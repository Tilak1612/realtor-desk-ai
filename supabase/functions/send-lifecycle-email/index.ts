import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCaslFooter } from "../_shared/casl-footer.ts";
import { isEmailSuppressed } from "../_shared/email-suppression.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_EMAIL = "RealtorDesk AI <support@realtordesk.ai>";
const APP_URL = "https://www.realtordesk.ai";

interface EmailTemplate {
  subject: string;
  html: string;
}

function getTemplate(eventType: string, data: Record<string, any> = {}, caslFooter = ""): EmailTemplate | null {
  const name = data.name || "there";

  const templates: Record<string, EmailTemplate> = {
    onboarding_step1: {
      subject: "Getting Started with RealtorDesk AI — Your Quick Guide",
      html: buildEmail(
        "Let's Get You Set Up! 🚀",
        `<p style="font-size:16px;color:#374151;line-height:1.6;">Hi ${name},</p>
        <p style="font-size:16px;color:#374151;line-height:1.6;">We noticed you haven't completed your profile setup yet. Here's a quick checklist to get the most out of RealtorDesk AI:</p>
        <ul style="font-size:16px;color:#374151;line-height:2;">
          <li>✅ Add your brokerage details</li>
          <li>✅ Import your first contacts</li>
          <li>✅ Configure your AI chatbot</li>
          <li>✅ Set up your calendar</li>
        </ul>
        <div style="text-align:center;margin:30px 0;">
          <a href="${APP_URL}/onboarding" style="background:#6366f1;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">Complete Setup →</a>
        </div>`,
        caslFooter
      ),
    },
    trial_ending: {
      subject: `Your RealtorDesk AI Trial Ends in ${data.days_remaining || 3} Days`,
      html: buildEmail(
        "Your Trial Is Almost Over ⏰",
        `<p style="font-size:16px;color:#374151;line-height:1.6;">Hi ${name},</p>
        <p style="font-size:16px;color:#374151;line-height:1.6;">Your 14-day free trial of RealtorDesk AI ends in <strong>${data.days_remaining || 3} days</strong>.</p>
        <p style="font-size:16px;color:#374151;line-height:1.6;">Don't lose access to:</p>
        <ul style="font-size:16px;color:#374151;line-height:2;">
          <li>🤖 AI-powered lead scoring</li>
          <li>💬 24/7 chatbot lead capture</li>
          <li>📊 Smart CRM dashboard</li>
          <li>🏠 Property management tools</li>
        </ul>
        <div style="text-align:center;margin:30px 0;">
          <a href="${APP_URL}/billing" style="background:#6366f1;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">Upgrade Now →</a>
        </div>
        <p style="font-size:14px;color:#6b7280;">Plans start at $149 CAD/month. Prices include Canadian GST/HST billing at checkout.</p>`,
        caslFooter
      ),
    },
    payment_success: {
      subject: "Payment Confirmed — RealtorDesk AI",
      html: buildEmail(
        "Payment Confirmed ✅",
        `<p style="font-size:16px;color:#374151;line-height:1.6;">Hi ${name},</p>
        <p style="font-size:16px;color:#374151;line-height:1.6;">Your payment of <strong>${data.amount || ""}</strong> has been successfully processed.</p>
        <p style="font-size:16px;color:#374151;line-height:1.6;">Your subscription is active and you have full access to all RealtorDesk AI features.</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${APP_URL}/dashboard" style="background:#6366f1;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">Go to Dashboard →</a>
        </div>
        <p style="font-size:14px;color:#6b7280;">View your billing history in <a href="${APP_URL}/billing" style="color:#6366f1;">Settings → Billing</a>.</p>`,
        caslFooter
      ),
    },
    payment_failed: {
      subject: "Action Required: Payment Failed — RealtorDesk AI",
      html: buildEmail(
        "Payment Failed ⚠️",
        `<p style="font-size:16px;color:#374151;line-height:1.6;">Hi ${name},</p>
        <p style="font-size:16px;color:#374151;line-height:1.6;">We were unable to process your latest payment. To avoid losing access to RealtorDesk AI, please update your payment method.</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${APP_URL}/billing" style="background:#ef4444;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">Update Payment Method →</a>
        </div>
        <p style="font-size:14px;color:#6b7280;">If you believe this is an error, please contact us at support@realtordesk.ai.</p>`,
        caslFooter
      ),
    },
    winback: {
      subject: "We Miss You — Come Back to RealtorDesk AI 🏡",
      html: buildEmail(
        "We Miss You! 🏡",
        `<p style="font-size:16px;color:#374151;line-height:1.6;">Hi ${name},</p>
        <p style="font-size:16px;color:#374151;line-height:1.6;">It's been a while since you've logged into RealtorDesk AI. Here's what's new:</p>
        <ul style="font-size:16px;color:#374151;line-height:2;">
          <li>🆕 Bilingual (EN/FR) CASL-compliant email sequences</li>
          <li>🆕 Improved lead-score explainer with behavioural signals</li>
          <li>🆕 Faster chatbot response times</li>
        </ul>
        <p style="font-size:16px;color:#374151;line-height:1.6;">Your data is still safe and waiting for you.</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${APP_URL}/dashboard" style="background:#6366f1;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">Log Back In →</a>
        </div>`,
        caslFooter
      ),
    },
  };

  return templates[eventType] || null;
}

function buildEmail(heading: string, content: string, caslFooter = ""): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
<tr><td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:30px;text-align:center;">
<h1 style="color:#ffffff;font-size:24px;margin:0;">${heading}</h1>
</td></tr>
<tr><td style="padding:30px;">
${content}
<p style="font-size:14px;color:#6b7280;margin-top:30px;">— The RealtorDesk AI Team 🇨🇦</p>
</td></tr>
<tr><td style="background:#f9fafb;padding:20px 30px;text-align:center;">
<p style="font-size:12px;color:#9ca3af;margin:0;">RealtorDesk AI — Built for Canadian Real Estate Agents</p>
</td></tr>
<tr><td>${caslFooter}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

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

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // This function is invoked by other edge functions (e.g. stripe-webhook-email)
    // using the service role — no per-user auth required here.

    const body = await req.json();
    const { eventType, userId, recipientEmail, data: templateData } = body;

    if (!eventType || !userId || !recipientEmail) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: eventType, userId, recipientEmail" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const validEvents = ["onboarding_step1", "trial_ending", "payment_success", "payment_failed", "winback"];
    if (!validEvents.includes(eventType)) {
      return new Response(
        JSON.stringify({ error: `Invalid eventType. Must be one of: ${validEvents.join(", ")}` }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check for duplicate
    const { data: existing } = await supabaseAdmin
      .from("email_events")
      .select("id")
      .eq("user_id", userId)
      .eq("event_type", eventType)
      .gte("sent_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1);

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({ success: true, message: `${eventType} email already sent recently` }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get profile name for template
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .single();

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
    const emailRes = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [recipientEmail],
        subject: template.subject,
        html: template.html,
      }),
    });

    if (!emailRes.ok) {
      const errBody = await emailRes.text();
      console.error("Resend API error:", errBody);
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Log event
    await supabaseAdmin.from("email_events").insert({
      user_id: userId,
      event_type: eventType,
      recipient_email: recipientEmail,
      metadata: { template_data: templateData, resend_response: await emailRes.json() },
    });

    return new Response(
      JSON.stringify({ success: true, message: `${eventType} email sent` }),
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
