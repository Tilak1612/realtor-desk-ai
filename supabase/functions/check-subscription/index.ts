import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

// Soft-fail shape: always 200 {subscribed:false,reason} for auth issues.
// The SDK on the client never emits FunctionsHttpError for these cases,
// so the console stays clean on /login and whenever a token is briefly
// stale between auto-refresh cycles. Real infra errors still 500.
const unsubscribed = (reason: string) => json({ subscribed: false, reason });

// Stripe epoch seconds -> ISO string, or null. NEVER throws.
//
// This helper exists because `new Date(undefined * 1000).toISOString()` throws
// RangeError("Invalid time value"), which took down the whole function and, via
// the client's error branch, logged out every entitled user. A missing or
// malformed timestamp is cosmetic; it must never cost someone their access.
const toIso = (seconds: unknown): string | null => {
  if (typeof seconds !== "number" || !Number.isFinite(seconds)) return null;
  const d = new Date(seconds * 1000);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  const sb = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return unsubscribed("no_session");
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) return unsubscribed("no_session");

  const { data: userData, error: userError } = await sb.auth.getUser(token);
  if (userError || !userData.user?.email) return unsubscribed("invalid_session");
  const user = userData.user;

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) {
      await sb.from("profiles").update({ subscription_status: "trial" }).eq("id", user.id);
      return json({ subscribed: false });
    }

    // status:"all" on purpose. Trials are created by Checkout with
    // trial_period_days, so a user who has just handed over a card sits in
    // "trialing", NOT "active". Filtering to active alone reported those
    // users as unsubscribed -- which, now that app access is gated on this
    // response, would have locked out exactly the people who just paid.
    const subs = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: "all",
      limit: 10,
    });

    // "Entitled" = we hold a payment method and the subscription has not
    // lapsed. past_due keeps access during Stripe's retry window rather than
    // cutting a paying customer off on a single failed charge.
    const ENTITLED = new Set(["trialing", "active", "past_due"]);
    const sub = subs.data.find((s) => ENTITLED.has(s.status)) ?? null;
    const hasSub = sub !== null;

    let productId: string | null = null;
    let priceId: string | null = null;
    let subscriptionEnd: string | null = null;
    let trialEnd: string | null = null;

    if (sub) {
      // API version 2025-08-27.basil moved current_period_start/end OFF the
      // Subscription object and ONTO each subscription item. Reading it from
      // the subscription yields undefined on Basil and later. Read the item
      // first, fall back to the legacy field so a pre-Basil pin still works.
      const item = sub.items.data[0];
      const periodEnd =
        (item as unknown as { current_period_end?: number })?.current_period_end ??
        (sub as unknown as { current_period_end?: number }).current_period_end;

      subscriptionEnd = toIso(periodEnd);
      trialEnd = toIso(sub.trial_end);
      productId = (item?.price?.product as string) ?? null;
      priceId = item?.price?.id ?? null;
    }

    // Product IDs come from env so test/live catalogues don't need a deploy.
    const SOLO = Deno.env.get("STRIPE_PRODUCT_SOLO") ?? "";
    const TEAM = Deno.env.get("STRIPE_PRODUCT_TEAM") ?? "";
    const tier =
      productId && productId === SOLO ? "agent" :
      productId && productId === TEAM ? "team" : null;

    // The DB enum has no "trialing" member, so a carded trial is stored as
    // "trial". Entitlement is carried by the `subscribed` field below, not by
    // this column -- a bare no-card signup is also "trial" here.
    //
    // Best-effort: a failed profile write must not deny an entitled user.
    try {
      const update: Record<string, string> = {
        subscription_status: sub && sub.status === "active" ? "active" : "trial",
      };
      if (tier) update.subscription_tier = tier;
      await sb.from("profiles").update(update).eq("id", user.id);
    } catch (e) {
      console.error("[CHECK-SUBSCRIPTION] profile update failed (non-fatal):", e);
    }

    return json({
      subscribed: hasSub,
      status: sub?.status ?? null,
      trial_end: trialEnd,
      cancel_at_period_end: sub?.cancel_at_period_end ?? false,
      product_id: productId,
      price_id: priceId,
      subscription_end: subscriptionEnd,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[CHECK-SUBSCRIPTION] ERROR:", msg);
    return json({ error: msg }, 500);
  }
});
