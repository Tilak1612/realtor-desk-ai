// resend-webhook: receives Resend delivery events (Svix-signed) for realtordesk.ai.
// Logs every event to public.resend_email_events and records hard bounces,
// complaints and Resend suppressions in public.email_suppressions, which every
// sender already checks through _shared/email-suppression.ts.
//
// Deploy with --no-verify-jwt: Resend sends no Supabase JWT; the Svix
// signature below is the authentication.
// Secret: RESEND_WEBHOOK_SECRET (whsec_...), from the Resend webhook page.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import { Webhook } from "npm:svix@1.42.0";
import { handleResendEvent, type ResendEvent, type WebhookStore } from "./handle.ts";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false },
});

const store: WebhookStore = {
  logEvent: async (row) =>
    await sb.from("resend_email_events").upsert(row, { onConflict: "svix_id", ignoreDuplicates: true }),
  suppress: async (email, source) =>
    await sb.from("email_suppressions").upsert({ email, source }, { onConflict: "email", ignoreDuplicates: true }),
};

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("method not allowed", { status: 405 });

  const secret = Deno.env.get("RESEND_WEBHOOK_SECRET");
  if (!secret) {
    console.error("[resend-webhook] RESEND_WEBHOOK_SECRET is not set");
    return new Response("not configured", { status: 500 });
  }

  const raw = await req.text();
  const headers = {
    "svix-id": req.headers.get("svix-id") ?? "",
    "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
    "svix-signature": req.headers.get("svix-signature") ?? "",
  };

  let evt: ResendEvent;
  try {
    evt = new Webhook(secret).verify(raw, headers) as ResendEvent;
  } catch {
    return new Response("invalid signature", { status: 401 });
  }

  const result = await handleResendEvent(evt, headers["svix-id"], store);
  if (result.status === 500) {
    console.error("[resend-webhook] database write failed for", headers["svix-id"], evt.type);
    return new Response(result.body, { status: 500 });
  }
  return Response.json(result.body);
});
