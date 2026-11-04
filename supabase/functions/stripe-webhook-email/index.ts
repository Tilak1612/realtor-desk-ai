import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { trialEndingApplies } from "../_shared/mail-eligibility.ts";
import { classifyInvokeError } from "./invoke-outcome.ts";

const retryLater = (reason: string) =>
  new Response(JSON.stringify({ error: reason }), {
    status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, stripe-signature",
};

type ProfileLookup =
  | { kind: "found"; id: string; fullName: string }
  | { kind: "absent" }
  | { kind: "ambiguous" }
  | { kind: "error"; reason: string };

type ProfileQuery = {
  from(table: "profiles"): {
    select(columns: string): {
      eq(column: string, value: string): {
        maybeSingle(): PromiseLike<{ data: { id?: unknown; full_name?: unknown } | null; error: { code?: string } | null }>;
      };
    };
  };
};

/**
 * Map a Stripe customer email to exactly one profile, or say why not. A
 * database error, or a row without a usable id, is unknown state (the caller
 * asks Stripe to retry and sends nothing). No row is a verified absence and
 * several rows an ambiguous mapping: retrying cannot change either, so the
 * caller acknowledges the event and sends nothing. No mapping is invented.
 * profiles.email carries no unique constraint in the baseline schema, hence
 * the ambiguous case (maybeSingle reports more than one row as PGRST116).
 */
async function lookupProfile(db: ProfileQuery, email: string): Promise<ProfileLookup> {
  const { data, error } = await db.from("profiles").select("id, full_name").eq("email", email).maybeSingle();
  if (error) {
    if (error.code === "PGRST116") return { kind: "ambiguous" };
    return { kind: "error", reason: error.code ?? "query failed" };
  }
  if (data === null || data === undefined) return { kind: "absent" };
  if (typeof data.id !== "string" || data.id.length === 0) return { kind: "error", reason: "malformed profile row" };
  return { kind: "found", id: data.id, fullName: typeof data.full_name === "string" ? data.full_name : "" };
}

/** The answer for a lookup that is not "found", logged without the address. */
function unresolvedProfile(lookup: Exclude<ProfileLookup, { kind: "found" }>, context: string): Response {
  if (lookup.kind === "error") {
    console.error(`${context}: profile lookup failed, not sending; asking Stripe to retry`, { reason: lookup.reason });
    return retryLater("could not read profile");
  }
  console.log(`${context}: ${lookup.kind === "absent" ? "no profile" : "several profiles"} for the customer email, not sending`);
  return new Response(JSON.stringify({ received: true }), {
    status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

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
    // Deno's edge runtime has no synchronous Node crypto, so Stripe's sync
    // constructEvent throws ("SubtleCryptoProvider cannot be used in a
    // synchronous context"). Use the async variant with a SubtleCrypto provider.
    const cryptoProvider = Stripe.createSubtleCryptoProvider();
    const body = await req.text();
    let event: Stripe.Event;

    // STRIPE_WEBHOOK_SECRET is required — hard-fail if missing so misconfigured
    // production deployments never silently accept unsigned webhook payloads.
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not configured");
      return new Response(JSON.stringify({ error: "Webhook secret not configured" }), {
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response(JSON.stringify({ error: "Missing stripe-signature header" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret,
        undefined,
        cryptoProvider,
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err instanceof Error ? err.message : String(err));
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
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

      // Find user by email: exactly one profile, or no send.
      const profile = await lookupProfile(supabaseAdmin, customerEmail);
      if (profile.kind !== "found") return unresolvedProfile(profile, event.type);

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
          sourceEventId: event.id,
        },
      });

      const outcome = classifyInvokeError(fnError);
      if (outcome === "retry") {
        console.error("send-lifecycle-email failed, asking Stripe to retry:", fnError);
        return retryLater("lifecycle email failed");
      }
      if (outcome === "permanent") console.error("send-lifecycle-email rejected the request:", fnError);
    }


    // Stripe fires this 3 days before trial_end. Without it, a card-required
    // trial charges the customer with no warning at all -- the single most
    // complaint- and chargeback-generating gap in a trial-to-paid model.
    if (event.type === "customer.subscription.trial_will_end") {
      // The event carries a snapshot taken when Stripe created it; a retried
      // or delayed delivery can be days old. Decide on the subscription as it
      // is now, and send nothing if that cannot be read.
      const snapshot = event.data.object as Stripe.Subscription;
      let subscription: Stripe.Subscription;
      try {
        subscription = await stripe.subscriptions.retrieve(snapshot.id);
      } catch (err) {
        console.error("trial_will_end: could not read the current subscription, not sending:", err instanceof Error ? err.message : String(err));
        return retryLater("could not read subscription");
      }
      // The trial_ending email says the card will be charged automatically.
      // Not true once the subscription is cancelled or set to cancel, so no
      // email then (and no customer lookup).
      if (!trialEndingApplies(subscription)) {
        console.log("trial_will_end: subscription cancelled or not trialing, no trial_ending email", {
          status: subscription.status,
          cancel_at_period_end: subscription.cancel_at_period_end,
        });
        return new Response(JSON.stringify({ received: true }), {
          status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // The subscription payload carries a customer id, not an email.
      let customerEmail: string | null = null;
      let customerLookupFailed = false;
      try {
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        if (customer && !("deleted" in customer && customer.deleted)) {
          customerEmail = (customer as Stripe.Customer).email;
        }
      } catch (err) {
        console.error("trial_will_end: could not retrieve customer:", err instanceof Error ? err.message : String(err));
        customerLookupFailed = true;
      }
      if (customerLookupFailed) return retryLater("could not read customer");

      if (!customerEmail) {
        console.log("trial_will_end: no customer email, skipping");
        return new Response(JSON.stringify({ received: true }), {
          status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // Exactly one profile, or no send (previously a failed or empty lookup
      // invoked the callee with userId null, which answered 400 -> webhook 200).
      const profile = await lookupProfile(supabaseAdmin, customerEmail);
      if (profile.kind !== "found") return unresolvedProfile(profile, "trial_will_end");

      const trialEndMs = subscription.trial_end ? subscription.trial_end * 1000 : null;
      const daysRemaining = trialEndMs
        ? Math.max(0, Math.ceil((trialEndMs - Date.now()) / 86_400_000))
        : 3;
      const trialEndDate = trialEndMs
        ? new Date(trialEndMs).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })
        : "";

      // State the actual amount. "You will be charged your plan price" is not
      // an adequate disclosure when the card is already on file.
      const price = subscription.items.data[0]?.price;
      const amount = price?.unit_amount
        ? `$${(price.unit_amount / 100).toFixed(2)} ${(price.currency || "cad").toUpperCase()}`
        : "";

      const { error: fnError } = await supabaseAdmin.functions.invoke("send-lifecycle-email", {
        body: {
          eventType: "trial_ending",
          userId: profile.id,
          recipientEmail: customerEmail,
          data: {
            firstName: profile.fullName.split(" ")[0] || "",
            days_remaining: daysRemaining,
            trial_end_date: trialEndDate,
            amount,
          },
          sourceEventId: event.id,
        },
      });

      const outcome = classifyInvokeError(fnError);
      if (outcome === "retry") {
        console.error("trial_will_end: send-lifecycle-email failed, asking Stripe to retry:", fnError);
        return retryLater("lifecycle email failed");
      }
      if (outcome === "permanent") console.error("trial_will_end: send-lifecycle-email rejected the request:", fnError);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_email || (session.customer_details?.email ?? null);

      if (!customerEmail) {
        console.log("No customer email on checkout session, skipping");
        return new Response(JSON.stringify({ received: true }), {
          status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name")
        .eq("email", customerEmail)
        .single();

      const firstName = profile?.full_name?.split(" ")[0] || "";

      const { error: fnError } = await supabaseAdmin.functions.invoke("send-lifecycle-email", {
        body: {
          eventType: "realtordesk_onboarding_welcome",
          userId: profile?.id || null,
          recipientEmail: customerEmail,
          data: { firstName },
        },
      });

      if (fnError) console.error("Error calling send-lifecycle-email:", fnError);

    } else if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
      const customerEmail = customer.email;

      if (!customerEmail) {
        return new Response(JSON.stringify({ received: true }), {
          status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name")
        .eq("email", customerEmail)
        .single();

      const firstName = profile?.full_name?.split(" ")[0] || "";
      const trialEnd = subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toLocaleDateString("en-CA")
        : null;

      const { error: fnError } = await supabaseAdmin.functions.invoke("send-lifecycle-email", {
        body: {
          eventType: "realtordesk_onboarding_trialnudge",
          userId: profile?.id || null,
          recipientEmail: customerEmail,
          data: { firstName, trial_end_date: trialEnd },
        },
      });

      if (fnError) console.error("Error calling send-lifecycle-email:", fnError);

    } else if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
      const customerEmail = customer.email;

      if (!customerEmail) {
        return new Response(JSON.stringify({ received: true }), {
          status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name")
        .eq("email", customerEmail)
        .single();

      const firstName = profile?.full_name?.split(" ")[0] || "";

      const { error: fnError } = await supabaseAdmin.functions.invoke("send-lifecycle-email", {
        body: {
          eventType: "realtordesk_subscription_cancelled",
          userId: profile?.id || null,
          recipientEmail: customerEmail,
          data: { firstName },
        },
      });

      if (fnError) console.error("Error calling send-lifecycle-email:", fnError);
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
