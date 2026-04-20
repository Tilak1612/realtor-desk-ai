// Public endpoint for the "I lost the email but want off the list" flow.
// Always returns 200 — we do NOT leak whether the address is in our DB.
// If the address IS in our DB, we email a signed opt-out link.
//
// Rate-limited: one send per email per 5 minutes (prevents abuse as a
// notification bomb by a third party).

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildUnsubscribeUrl } from "../_shared/casl-footer.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const FROM_EMAIL = "RealtorDesk AI <support@realtordesk.ai>";
const RATE_LIMIT_SECONDS = 5 * 60;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const rawEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!rawEmail || !/^[^@]+@[^@]+\.[^@]+$/.test(rawEmail)) {
      // Don't reveal validation detail; same opaque 200 as the happy path.
      return ok();
    }

    const secret = Deno.env.get("UNSUBSCRIBE_TOKEN_SECRET");
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!secret || !resendKey) {
      console.error("[REQUEST-UNSUB] missing UNSUBSCRIBE_TOKEN_SECRET or RESEND_API_KEY");
      return ok(); // fail opaque to caller; log loudly for us
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Rate-limit: check email_events for a recent unsubscribe_link_request
    // to this address; if within window, short-circuit silently.
    const sinceIso = new Date(Date.now() - RATE_LIMIT_SECONDS * 1000).toISOString();
    const { data: recent } = await admin
      .from("email_events")
      .select("id")
      .eq("event_type", "unsubscribe_link_request")
      .eq("recipient_email", rawEmail)
      .gte("sent_at", sinceIso)
      .limit(1);
    if (recent && recent.length > 0) return ok();

    // Look up the address. We search profiles (the agent themselves) and
    // contacts (CEM recipients the agent has added). We don't care WHICH
    // table matches — we just need a signed token so the link works.
    let userId: string | null = null;
    let contactId: string | null = null;

    const { data: profile } = await admin
      .from("profiles")
      .select("id")
      .eq("email", rawEmail)
      .maybeSingle();
    if (profile?.id) userId = profile.id as string;

    if (!userId) {
      const { data: contact } = await admin
        .from("contacts")
        .select("id")
        .eq("email", rawEmail)
        .maybeSingle();
      if (contact?.id) contactId = contact.id as string;
    }

    // If no match: we still return 200 so a probe can't enumerate our DB.
    // Don't send any mail to unknown addresses.
    if (!userId && !contactId) return ok();

    const unsubUrl = await buildUnsubscribeUrl({
      recipientEmail: rawEmail,
      userId,
      contactId,
    });

    const subject = "Confirm your RealtorDesk AI unsubscribe";
    const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
<tr><td style="padding:30px;">
<h2 style="color:#111;font-size:20px;margin:0 0 16px;">You asked us to stop emailing this address.</h2>
<p style="color:#444;font-size:15px;line-height:1.6;margin:0 0 20px;">
Click the button below and we will immediately add <strong>${escapeHtml(rawEmail)}</strong> to our suppression list. Your opt-out takes effect instantly per CASL §11.
</p>
<div style="text-align:center;margin:28px 0;">
  <a href="${unsubUrl}" style="background:#ea580c;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block;">Confirm unsubscribe</a>
</div>
<p style="color:#666;font-size:13px;line-height:1.6;margin:0;">
This link expires in 30 days. If you did not request this, you can ignore the email — nothing changes unless you click.
</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;

    const send = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [rawEmail],
        subject,
        html,
      }),
    });

    if (!send.ok) {
      console.error("[REQUEST-UNSUB] Resend error:", await send.text());
      return ok();
    }

    await admin.from("email_events").insert({
      user_id: userId,
      event_type: "unsubscribe_link_request",
      recipient_email: rawEmail,
      metadata: { matched_contact: contactId ?? null },
    });

    return ok();
  } catch (err) {
    console.error("[REQUEST-UNSUB] error:", err instanceof Error ? err.message : String(err));
    return ok();
  }
});

function ok(): Response {
  return new Response(
    JSON.stringify({ ok: true, message: "If this address is on our list, a confirmation link is on its way." }),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
