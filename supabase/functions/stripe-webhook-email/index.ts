import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY not configured");
      return new Response(JSON.stringify({ error: "Stripe not configured" }), {
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });
    const body = await req.text();
    let event: Stripe.Event;

    // Verify webhook signature if secret is configured
    if (webhookSecret) {
      const signature = req.headers.get("stripe-signature");
      if (!signature) {
        return new Response(JSON.stringify({ error: "Missing stripe-signature header" }), {
          status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err) {
        console.error("Webhook signature verification failed:", err instanceof Error ? err.message : String(err));
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    } else {
      // No webhook secret configured yet - parse event directly (dev mode)
      console.warn("STRIPE_WEBHOOK_SECRET not configured - skipping signature verification");
      event = JSON.parse(body) as Stripe.Event;
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Handle relevant events
    if (event.type === "invoice.payment_succeeded" || event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      const customerEmail = invoice.customer_email;

      if (!customerEmail) {
        console.log("No customer email on invoice, skipping");
        return new Response(JSON.stringify({ received: true }), {
          status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // Find user by email
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name")
        .eq("email", customerEmail)
        .single();

      if (!profile) {
        console.log("No profile found for email:", customerEmail);
        return new Response(JSON.stringify({ received: true }), {
          status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const eventType = event.type === "invoice.payment_succeeded"
        ? "payment_success"
        : "payment_failed";

      const amount = invoice.amount_paid
        ? `$${(invoice.amount_paid / 100).toFixed(2)} ${(invoice.currency || "cad").toUpperCase()}`
        : "";

      // Call send-lifecycle-email
      const { error: fnError } = await supabaseAdmin.functions.invoke("send-lifecycle-email", {
        body: {
          eventType,
          userId: profile.id,
          recipientEmail: customerEmail,
          data: { amount, invoice_id: invoice.id },
        },
      });

      if (fnError) {
        console.error("Error calling send-lifecycle-email:", fnError);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in stripe-webhook-email:", error instanceof Error ? error.message : String(error));
    return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
