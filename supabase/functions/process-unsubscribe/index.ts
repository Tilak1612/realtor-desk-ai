// Public edge function called by /unsubscribe after a user clicks the
// signed link from an email footer. HMAC-verifies the token, applies a
// 30-day freshness window, and writes an email_suppressions row. Runs
// with verify_jwt=false because users click this without being signed in.
//
// This endpoint ONLY accepts signed tokens. A raw `{email: "..."}`
// submission is rejected with 400 — otherwise anyone could opt anyone
// else out by crafting a URL. The "I lost my email" flow lives in the
// sibling request-unsubscribe-link function, which sends a signed link
// to the address and always responds 200 so it doesn't leak membership.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { getAdminClient, suppressEmail } from "../_shared/email-suppression.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const TOKEN_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

function decodeBase64Url(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function verifyToken(
  token: string,
  secret: string,
  nowSeconds: number = Math.floor(Date.now() / 1000)
): Promise<
  | { ok: true; payload: { e: string; u: string | null; c: string | null; t: number } }
  | { ok: false; reason: "malformed" | "invalid_signature" | "expired" | "invalid_payload" }
> {
  const parts = token.split(".");
  if (parts.length !== 2) return { ok: false, reason: "malformed" };
  const [bodyB64, sigB64] = parts;

  let sigBytes: Uint8Array;
  try {
    sigBytes = decodeBase64Url(sigB64);
  } catch {
    return { ok: false, reason: "malformed" };
  }

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
    sigBytes,
    new TextEncoder().encode(bodyB64)
  );
  if (!ok) return { ok: false, reason: "invalid_signature" };

  let raw: unknown;
  try {
    raw = JSON.parse(new TextDecoder().decode(decodeBase64Url(bodyB64)));
  } catch {
    return { ok: false, reason: "malformed" };
  }

  if (!raw || typeof raw !== "object") {
    return { ok: false, reason: "invalid_payload" };
  }
  const p = raw as Record<string, unknown>;
  if (typeof p.e !== "string" || typeof p.t !== "number") {
    return { ok: false, reason: "invalid_payload" };
  }
  if (nowSeconds - p.t > TOKEN_MAX_AGE_SECONDS) {
    return { ok: false, reason: "expired" };
  }

  return {
    ok: true,
    payload: {
      e: p.e,
      u: typeof p.u === "string" ? p.u : null,
      c: typeof p.c === "string" ? p.c : null,
      t: p.t,
    },
  };
}

export const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const token = body.token as string | undefined;
    const secret = Deno.env.get("UNSUBSCRIBE_TOKEN_SECRET");

    if (!secret) {
      console.error("[UNSUBSCRIBE] UNSUBSCRIBE_TOKEN_SECRET not set");
      return json({ error: "server_misconfigured" }, 500);
    }

    if (!token || typeof token !== "string") {
      return json({ error: "missing_token" }, 400);
    }

    const result = await verifyToken(token, secret);
    if (!result.ok) {
      return json({ error: result.reason }, 400);
    }

    const admin = getAdminClient();
    await suppressEmail(
      admin,
      result.payload.e,
      "unsubscribe_link",
      result.payload.u,
      result.payload.c
    );

    return json({ ok: true, email: result.payload.e }, 200);
  } catch (err) {
    console.error("[UNSUBSCRIBE] error:", err instanceof Error ? err.message : String(err));
    return json({ error: "internal_error" }, 500);
  }
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

// Don't serve when imported as a module for testing.
if (import.meta.main) serve(handler);
