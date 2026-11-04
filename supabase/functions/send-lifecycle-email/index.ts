import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCaslFooter } from "../_shared/casl-footer.ts";
import { isEmailSuppressed } from "../_shared/email-suppression.ts";
import { deliveryEventKey, deliveryMode, sendEmail } from "../_shared/outbound-email.ts";
import { isServiceRoleCaller } from "../_shared/internal-caller.ts";
import { getTemplate, LIFECYCLE_EVENTS } from "./templates.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const FROM_EMAIL = Deno.env.get("EMAIL_FROM") ?? "RealtorDesk AI <support@realtordesk.ai>";

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Internal only. Its one caller, stripe-webhook-email, invokes it with the
    // service-role key. verify_jwt alone let any project JWT through (the
    // public anon key, any signed-in user) and this function then mailed
    // whatever recipientEmail it was given.
    if (!isServiceRoleCaller(req.headers, serviceRoleKey)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();
    const { eventType, userId, recipientEmail, data: templateData, sourceEventId } = body;

    if (!eventType || !userId || !recipientEmail) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: eventType, userId, recipientEmail" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const validEvents: readonly string[] = LIFECYCLE_EVENTS;
    if (!validEvents.includes(eventType)) {
      return new Response(
        JSON.stringify({ error: `Invalid eventType. Must be one of: ${validEvents.join(", ")}` }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Recorded and deduplicated under a key that, outside production, is
    // namespaced: a test copy never counts as the real user's email.
    const mode = deliveryMode();
    const eventKey = deliveryEventKey(eventType, mode);

    // Same Stripe event delivered again (Stripe retries for days): already
    // handled, whenever it was. Check-then-send, not atomic: two concurrent
    // deliveries of one event can both pass.
    if (typeof sourceEventId === "string" && sourceEventId) {
      const { data: replay, error: replayError } = await supabaseAdmin
        .from("email_events")
        .select("id")
        .eq("user_id", userId)
        .eq("event_type", eventKey)
        .eq("metadata->>source_event_id", sourceEventId)
        .limit(1);
      if (replayError) {
        console.error("send-lifecycle-email: replay check failed, not sending:", replayError.message);
        return new Response(JSON.stringify({ error: "Could not check for a duplicate" }), {
          status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      if (replay && replay.length > 0) {
        return new Response(
          JSON.stringify({ success: true, duplicate: true, message: `${eventType} already handled for this event` }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // Check for duplicate
    const { data: existing, error: existingError } = await supabaseAdmin
      .from("email_events")
      .select("id")
      .eq("user_id", userId)
      .eq("event_type", eventKey)
      .gte("sent_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1);

    if (existingError) {
      // Unknown whether it was already sent: do not send (the caller may retry).
      console.error("send-lifecycle-email: dedup check failed, not sending:", existingError.message);
      return new Response(JSON.stringify({ error: "Could not check for a duplicate" }), {
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({ success: true, message: `${eventType} email already sent recently` }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // The subject must be a real account: no email for an arbitrary userId.
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("send-lifecycle-email: profile lookup failed:", profileError.message);
      return new Response(JSON.stringify({ error: "Could not load the user" }), {
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    if (!profile) {
      return new Response(JSON.stringify({ error: "Unknown user" }), {
        status: 404, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const mergedData = { name: profile?.full_name || "there", ...templateData };

    if (await isEmailSuppressed(supabaseAdmin, recipientEmail)) {
      return new Response(
        JSON.stringify({ success: true, message: "Recipient has unsubscribed", suppressed: true }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const caslFooter = await buildCaslFooter({
      recipientEmail,
      userId,
      consentBasis: eventType === "winback" ? "implied" : "transactional",
    });

    const template = getTemplate(eventType, mergedData, caslFooter);

    if (!template) {
      return new Response(JSON.stringify({ error: "Template not found" }), {
        status: 404, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Send via Resend
    const sendResult = await sendEmail({
      from: FROM_EMAIL,
      to: [recipientEmail],
      subject: template.subject,
      html: template.html,
    }, { apiKey: resendApiKey, environment: mode.environment });

    if (sendResult.status !== "sent") {
      console.error("Resend API error:", sendResult.httpStatus, sendResult.error);
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Log event. If this write fails the email has still gone, so answer 200
    // (a retry would send it twice) and say it was not recorded.
    const { error: recordError } = await supabaseAdmin.from("email_events").insert({
      user_id: userId,
      event_type: eventKey,
      recipient_email: recipientEmail,
      metadata: {
        template_data: templateData,
        resend_response: { id: sendResult.id },
        email_environment: sendResult.environment,
        rerouted: sendResult.rerouted,
        ...(typeof sourceEventId === "string" && sourceEventId ? { source_event_id: sourceEventId } : {}),
      },
    });
    if (recordError) console.error("send-lifecycle-email: sent but not recorded:", recordError.message);

    return new Response(
      JSON.stringify({ success: true, rerouted: sendResult.rerouted, recorded: !recordError, message: `${eventType} email sent` }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Error in send-lifecycle-email:", error instanceof Error ? error.message : String(error));
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
