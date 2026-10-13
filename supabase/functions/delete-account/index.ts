import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { CONFIRM_PHRASE, deleteAccount, type DeletionPorts } from "./deletion.ts";

// delete-account: the caller deletes THEIR OWN account, for real, now.
//
// Why this exists: "Delete my account" in Settings used to show a toast asking
// the person to email support. Nothing was recorded and nothing was deleted.
// Apple (guideline 5.1.1(v)) and Google Play both require that deletion can be
// started inside the app and actually removes the account.
//
// What it does, in order, lives in ./deletion.ts with the reasons for the
// order. This file only authenticates the caller and connects that sequence to
// Supabase and Stripe. docs/MOBILE_ACCOUNT_DELETION.md has the table-by-table
// inventory of what is deleted and what is kept.
//
// The rules that must not be loosened:
//   - The user id comes from the verified token and from nowhere else. The
//     request body is read for one thing only: the confirmation phrase.
//   - Billing is cancelled before anything is deleted, and a Stripe failure
//     stops the run.
//   - Nothing personal is logged. Not the email, not the token: the user id,
//     step names and counts.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[DELETE-ACCOUNT] ${step}${detailsStr}`);
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// Same shape as a failed run from deletion.ts, so the client has one thing to parse.
const refuse = (status: number, code: string, error: string) =>
  json(
    {
      success: false,
      deleted: false,
      code,
      error,
      completed_steps: [],
      subscriptions_cancelled: 0,
      storage_objects_removed: 0,
    },
    status,
  );

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return refuse(405, "method_not_allowed", "Use POST.");
  }

  try {
    logStep("Function started");

    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    // Authenticate first, so an anonymous caller learns nothing about what a
    // valid request looks like. With no session supabase-js sends the anon key
    // as the bearer token; getUser rejects that the same as any bad token.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return refuse(401, "unauthorized", "Sign in to delete your account.");
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) return refuse(401, "unauthorized", "Sign in to delete your account.");

    const { data: userData, error: userError } = await admin.auth.getUser(token);
    const user = userData?.user;
    if (userError || !user) {
      // After a successful run the token still verifies until it expires, but
      // the user it names is gone, so a repeat call lands here. That is the
      // idempotent answer: there is nothing left to delete.
      return refuse(401, "unauthorized", "Your session is no longer valid. Sign in again.");
    }
    logStep("User authenticated", { userId: user.id });

    // An explicit phrase, so a stray or replayed POST cannot delete an account.
    let confirm: unknown = null;
    try {
      const body = await req.json();
      confirm = body && typeof body === "object" ? (body as Record<string, unknown>).confirm : null;
    } catch {
      confirm = null;
    }
    if (confirm !== CONFIRM_PHRASE) {
      return refuse(
        400,
        "confirmation_required",
        `Send { "confirm": "${CONFIRM_PHRASE}" } to delete the account.`,
      );
    }

    // Built lazily: an account that never reached checkout needs no Stripe call
    // beyond the customer lookup, and a missing key must surface as a failed
    // billing step (which stops the run) rather than as a crash before it.
    let stripeClient: Stripe | null = null;
    const stripe = (): Stripe => {
      if (stripeClient) return stripeClient;
      const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
      if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
      stripeClient = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
      return stripeClient;
    };

    const ports: DeletionPorts = {
      log: logStep,

      async isDemoAccount(userId) {
        const { data, error } = await admin
          .from("profiles")
          .select("is_demo")
          .eq("id", userId)
          .maybeSingle();
        if (error) throw new Error(error.message);
        // No profile row means no demo flag. The row only disappears with the
        // auth user, so this is the tail end of an earlier run, not a demo.
        return data?.is_demo === true;
      },

      // By email, because that is the only link this product keeps between a
      // user and Stripe (create-checkout, customer-portal and
      // check-subscription all find the customer this way). Those take the
      // first match; here every match is taken, since Stripe allows several
      // customers on one email and a subscription on any of them would go on
      // billing.
      async listStripeCustomerIds(email) {
        const customers = await stripe().customers.list({ email, limit: 100 });
        return customers.data.map((c) => c.id);
      },

      async listSubscriptions(customerId) {
        const out: { id: string; status: string }[] = [];
        // status "all", as check-subscription does, so nothing that can still
        // bill (trialing, past_due, unpaid, paused) is filtered out before
        // deletion.ts decides. Auto-pagination follows has_more.
        for await (const sub of stripe().subscriptions.list({
          customer: customerId,
          status: "all",
          limit: 100,
        })) {
          out.push({ id: sub.id, status: sub.status });
        }
        return out;
      },

      // Immediate cancel (DELETE /v1/subscriptions/:id). Stripe's defaults
      // apply: no final invoice, no proration, and automatic collection of any
      // open invoice stops. No refund is issued here.
      async cancelSubscription(subscriptionId) {
        try {
          await stripe().subscriptions.cancel(subscriptionId);
        } catch (e) {
          // Gone between the list and the cancel: it cannot bill, which is the
          // outcome wanted. Anything else is a real failure and stops the run.
          if ((e as { code?: string })?.code === "resource_missing") return;
          throw e;
        }
      },

      async listStorage(bucket, prefix, offset, limit) {
        const { data, error } = await admin.storage
          .from(bucket)
          .list(prefix, { limit, offset, sortBy: { column: "name", order: "asc" } });
        if (error) throw new Error(error.message);
        // The Storage API lists one level at a time and reports a folder as an
        // entry with a null id.
        return (data ?? []).map((entry) => ({ name: entry.name, isFolder: entry.id === null }));
      },

      async removeStorage(bucket, paths) {
        const { error } = await admin.storage.from(bucket).remove(paths);
        if (error) throw new Error(error.message);
      },

      async listContactIds(userId, offset, limit) {
        const { data, error } = await admin
          .from("contacts")
          .select("id")
          .eq("user_id", userId)
          .order("id", { ascending: true })
          .range(offset, offset + limit - 1);
        if (error) throw new Error(error.message);
        return (data ?? []).map((row) => row.id as string);
      },

      async deleteWhere(table, column, values) {
        if (values.length === 0) return;
        const { error } = await admin.from(table).delete().in(column, values);
        if (error) throw new Error(`${table}: ${error.message}`);
      },

      // Hard delete (shouldSoftDelete defaults to false): the auth.users row is
      // removed, which cascades to sessions, identities and MFA factors, and
      // through the public-schema foreign keys to the rest of the account.
      async deleteAuthUser(userId) {
        const { error } = await admin.auth.admin.deleteUser(userId);
        if (error && error.status !== 404) throw new Error(error.message);
      },
    };

    const outcome = await deleteAccount({ id: user.id, email: user.email ?? null }, ports);
    logStep(outcome.body.success ? "Account deleted" : "Stopped", {
      userId: user.id,
      failed_step: outcome.body.failed_step,
      completed_steps: outcome.body.completed_steps,
    });
    return json(outcome.body, outcome.status);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return refuse(500, "internal_error", "Account deletion failed before it started. Nothing was deleted.");
  }
});
