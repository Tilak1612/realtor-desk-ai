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

    const subs = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: "active",
      limit: 1,
    });

    const hasActiveSub = subs.data.length > 0;
    let productId: string | null = null;
    let priceId: string | null = null;
    let subscriptionEnd: string | null = null;

    if (hasActiveSub) {
      const s = subs.data[0];
      subscriptionEnd = new Date(s.current_period_end * 1000).toISOString();
      productId = s.items.data[0].price.product as string;
      priceId = s.items.data[0].price.id;
    }

    const AGENT = new Set(["prod_TUpecsjMV6TaBw", "prod_TUpevCKNFOGwCq"]);
    const TEAM = new Set(["prod_TUpeTIPjzjd64Z", "prod_TUpeobzrNh5RNk"]);
    const tier = AGENT.has(productId ?? "") ? "agent" : TEAM.has(productId ?? "") ? "team" : null;
    const update: Record<string, string> = {
      subscription_status: hasActiveSub ? "active" : "trial",
    };
    if (tier) update.subscription_tier = tier;
    await sb.from("profiles").update(update).eq("id", user.id);

    return json({
      subscribed: hasActiveSub,
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
