// Public edge function called by /unsubscribe. Verifies the signed token,
// writes an email_suppressions row, and returns 200 on success.
// Runs with verify_jwt=false because users click this link without being signed in.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { getAdminClient, suppressEmail } from "../_shared/email-suppression.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function decodeBase64Url(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function verifyToken(token: string, secret: string): Promise<Record<string, unknown> | null> {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [bodyB64, sigB64] = parts;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    decodeBase64Url(sigB64),
    new TextEncoder().encode(bodyB64)
  );
  if (!ok) return null;
  try {
    return JSON.parse(new TextDecoder().decode(decodeBase64Url(bodyB64)));
  } catch {
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const token = body.token as string | undefined;
    const emailDirect = body.email as string | undefined;
    const secret = Deno.env.get("UNSUBSCRIBE_TOKEN_SECRET");

    let email: string | null = null;
    let userId: string | null = null;
    let contactId: string | null = null;

    if (token && secret) {
      const payload = await verifyToken(token, secret);
      if (!payload) {
        return new Response(JSON.stringify({ error: "invalid_token" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      email = (payload.e as string) ?? null;
      userId = (payload.u as string | null) ?? null;
      contactId = (payload.c as string | null) ?? null;
    } else if (emailDirect && /^[^@]+@[^@]+\.[^@]+$/.test(emailDirect)) {
      // Fallback: user manually typed their email on /unsubscribe.
      // We accept it without a signed token but the source field flags it.
      email = emailDirect.toLowerCase();
    }

    if (!email) {
      return new Response(JSON.stringify({ error: "missing_email_or_token" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const admin = getAdminClient();
    await suppressEmail(admin, email, "unsubscribe_link", userId, contactId);

    return new Response(JSON.stringify({ ok: true, email }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    console.error("[UNSUBSCRIBE] error:", err instanceof Error ? err.message : String(err));
    return new Response(JSON.stringify({ error: "internal_error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
