import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Price-ID allowlist, sourced from environment so test↔live is a config change
// rather than a deploy. Mirrors src/config/stripe.ts on the frontend.
//
// This allowlist is the control that stops a caller substituting an arbitrary
// (e.g. $0) price into checkout, so it must never end up empty-but-permissive.
const VALID_PRICE_IDS: Set<string> = new Set(
  [
    Deno.env.get("STRIPE_PRICE_SOLO_MONTHLY"),
    Deno.env.get("STRIPE_PRICE_SOLO_YEARLY"),
    Deno.env.get("STRIPE_PRICE_TEAM_MONTHLY"),
    Deno.env.get("STRIPE_PRICE_TEAM_YEARLY"),
  ].filter((v): v is string => typeof v === "string" && v.length > 0),
);

// Free-trial length. Card is collected at checkout and charged automatically
// when the trial ends. If this changes, the marketing copy must change with it
// — "14-day free trial" appears across the site, i18n (EN/FR), JSON-LD
// structured data, and the site-assistant corpus.
const TRIAL_PERIOD_DAYS = 14;

// Validate price ID format (Stripe price IDs start with "price_")
const isValidPriceIdFormat = (priceId: string): boolean => {
  return typeof priceId === "string" && 
         priceId.startsWith("price_") && 
         priceId.length >= 10 && 
         priceId.length <= 100 &&
         /^price_[a-zA-Z0-9]+$/.test(priceId);
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    // Parse and validate input
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { priceId } = body;
    
    if (!priceId) {
      return new Response(
        JSON.stringify({ error: "Price ID is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate price ID format
    if (!isValidPriceIdFormat(priceId)) {
      return new Response(
        JSON.stringify({ error: "Invalid price ID format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fail CLOSED. The previous `size > 0 &&` guard meant an unconfigured
    // allowlist silently accepted ANY price ID — with the IDs now coming from
    // env, a missing secret would have turned that into a price-tampering hole.
    if (VALID_PRICE_IDS.size === 0) {
      console.error("[CREATE-CHECKOUT] No STRIPE_PRICE_* configured — refusing checkout");
      return new Response(
        JSON.stringify({ error: "Billing is not configured" }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!VALID_PRICE_IDS.has(priceId)) {
      console.warn("Price ID not in whitelist:", priceId);
      return new Response(
        JSON.stringify({ error: "Invalid price ID" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    logStep("Received price ID", { priceId: priceId.substring(0, 20) + "..." });

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    logStep("User authenticated", { userId: user.id });

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Payment service configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const stripe = new Stripe(stripeKey, { 
      apiVersion: "2025-08-27.basil" 
    });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer");
    } else {
      logStep("No existing customer found");
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      // Stamp the Supabase user id so the webhook can link the Stripe
      // customer back to our auth user (stripe-webhook-email uses this).
      client_reference_id: user.id,
      metadata: { user_id: user.id },
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      // 14-day free trial with the card collected up front: Stripe stores the
      // payment method during checkout and charges automatically when the trial
      // ends. Set here rather than on the Price so the term is version-
      // controlled and identical across every plan.
      subscription_data: {
        trial_period_days: TRIAL_PERIOD_DAYS,
      },
      // Explicit for intent: in subscription mode Stripe already collects a
      // payment method by default, but "always" makes it impossible to silently
      // become a no-card trial if this block is edited later.
      payment_method_collection: "always",
      // Surfaces "You won't be charged until <date>" + the recurring amount on
      // the Stripe-hosted page, which is the disclosure a paid-after-trial
      // subscription needs.
      custom_text: {
        submit: {
          message:
            `Your ${TRIAL_PERIOD_DAYS}-day free trial starts today. ` +
            `We'll charge your card automatically when it ends unless you cancel before then. ` +
            `You can cancel any time from Billing.`,
        },
      },
      success_url: `${origin}/billing?success=true`,
      cancel_url: `${origin}/billing`,
    });

    logStep("Checkout session created");

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    // Log full error details server-side only
    console.error("[CREATE-CHECKOUT] ERROR:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // Return generic error message to client
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
