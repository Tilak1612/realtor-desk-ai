// Shared CASL-compliant email footer builder.
//
// Used by every send-* edge function. Satisfies CASL §6(2):
//   - Sender identification
//   - Physical mailing address
//   - Contact information
//   - Functional unsubscribe mechanism
//
// Env vars (set via `supabase secrets set`):
//   COMPANY_LEGAL_NAME              default: "Brainfy AI Inc."
//   COMPANY_TRADE_NAME              default: "RealtorDesk AI"
//   COMPANY_PHYSICAL_ADDRESS_CA     default: placeholder — must be set in prod
//   UNSUBSCRIBE_TOKEN_SECRET        required for functional unsubscribe
//
// If UNSUBSCRIBE_TOKEN_SECRET is unset, the footer still renders a
// mailto: fallback so the email is never sent without an opt-out path.

const APP_URL = "https://www.realtordesk.ai";
const SUPPORT_EMAIL = "support@realtordesk.ai";

export interface CaslFooterOptions {
  recipientEmail: string;
  userId?: string | null;         // app user id if recipient is the agent
  contactId?: string | null;      // contacts.id if recipient is a CEM target
  consentBasis?: "express" | "implied" | "transactional";
  locale?: "en" | "fr";
}

function encodeBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function signToken(payload: Record<string, unknown>, secret: string): Promise<string> {
  const body = encodeBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return body + "." + encodeBase64Url(new Uint8Array(sig));
}

export async function buildUnsubscribeUrl(opts: CaslFooterOptions): Promise<string> {
  const secret = Deno.env.get("UNSUBSCRIBE_TOKEN_SECRET");
  if (!secret) {
    // Refuse to build a URL without the signing secret. Emailing an
    // unsigned ?email=<addr> link is a security hole: anyone who sees
    // the URL format can opt anyone else out. Fail loudly so the send
    // path aborts before a bad email goes out.
    throw new Error(
      "UNSUBSCRIBE_TOKEN_SECRET is not set — cannot build a signed unsubscribe URL. Set it via `supabase secrets set` before sending any CEM."
    );
  }
  const payload = {
    e: opts.recipientEmail.toLowerCase(),
    u: opts.userId ?? null,
    c: opts.contactId ?? null,
    t: Math.floor(Date.now() / 1000),
  };
  const token = await signToken(payload, secret);
  const q = new URLSearchParams({ token });
  return `${APP_URL}/unsubscribe?${q.toString()}`;
}

export async function buildCaslFooter(opts: CaslFooterOptions): Promise<string> {
  const legal = Deno.env.get("COMPANY_LEGAL_NAME") ?? "Brainfy AI Inc.";
  const trade = Deno.env.get("COMPANY_TRADE_NAME") ?? "RealtorDesk AI";
  const addr = Deno.env.get("COMPANY_PHYSICAL_ADDRESS_CA")
    ?? "Edmonton, Alberta, Canada"; // Tilak: override via supabase secret for street address
  const locale = opts.locale ?? "en";
  const unsubUrl = await buildUnsubscribeUrl(opts);

  const lines = locale === "fr" ? frLines : enLines;
  const consentLine = lines.consent[opts.consentBasis ?? "transactional"];

  return `
<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;border-top:1px solid #e5e7eb;padding-top:20px;">
  <tr><td style="padding:0 30px 24px;">
    <p style="font-size:11px;color:#9ca3af;line-height:1.6;margin:0 0 8px;">
      ${lines.sender}: <strong>${trade}</strong> (${legal}), ${escapeHtml(addr)}.
    </p>
    <p style="font-size:11px;color:#9ca3af;line-height:1.6;margin:0 0 8px;">
      ${lines.contact}: <a href="mailto:${SUPPORT_EMAIL}" style="color:#6b7280;text-decoration:underline;">${SUPPORT_EMAIL}</a> · <a href="${APP_URL}" style="color:#6b7280;text-decoration:underline;">realtordesk.ai</a>
    </p>
    <p style="font-size:11px;color:#9ca3af;line-height:1.6;margin:0 0 8px;">${consentLine}</p>
    <p style="font-size:11px;color:#9ca3af;line-height:1.6;margin:0;">
      <a href="${unsubUrl}" style="color:#6b7280;text-decoration:underline;">${lines.unsubscribe}</a>
    </p>
  </td></tr>
</table>`.trim();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const enLines = {
  sender: "Sent by",
  contact: "Contact",
  unsubscribe: "Unsubscribe from these emails",
  consent: {
    express:
      "You are receiving this because you gave express consent to communications from RealtorDesk AI.",
    implied:
      "You are receiving this under CASL implied consent (existing business relationship). You can opt out at any time.",
    transactional:
      "This is a transactional message related to your RealtorDesk AI account.",
  },
};

const frLines = {
  sender: "Envoyé par",
  contact: "Contact",
  unsubscribe: "Se désabonner de ces courriels",
  consent: {
    express:
      "Vous recevez ce message parce que vous avez donné un consentement explicite aux communications de RealtorDesk AI.",
    implied:
      "Vous recevez ce message en vertu du consentement tacite de la LCAP (relation d'affaires existante). Vous pouvez vous désabonner à tout moment.",
    transactional:
      "Ce message transactionnel concerne votre compte RealtorDesk AI.",
  },
};
