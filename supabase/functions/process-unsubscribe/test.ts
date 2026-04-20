// Deno test — run with: deno test --allow-env --allow-net supabase/functions/process-unsubscribe/test.ts
// Verifies that the HMAC token check rejects every class of bad input.

import { assertEquals } from "https://deno.land/std@0.190.0/testing/asserts.ts";
import { verifyToken } from "./index.ts";

const SECRET = "test-secret-do-not-use-in-prod";

function encodeBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function signToken(payload: Record<string, unknown>, secret = SECRET): Promise<string> {
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

const NOW = 1_700_000_000;

Deno.test("valid token → ok", async () => {
  const t = await signToken({ e: "alice@example.com", u: null, c: null, t: NOW });
  const r = await verifyToken(t, SECRET, NOW + 10);
  assertEquals(r.ok, true);
  if (r.ok) assertEquals(r.payload.e, "alice@example.com");
});

Deno.test("malformed token (no dot) → malformed", async () => {
  const r = await verifyToken("not-a-token", SECRET, NOW);
  assertEquals(r.ok, false);
  if (!r.ok) assertEquals(r.reason, "malformed");
});

Deno.test("tampered body (signature mismatch) → invalid_signature", async () => {
  const t = await signToken({ e: "alice@example.com", t: NOW });
  const [, sig] = t.split(".");
  const tampered = encodeBase64Url(new TextEncoder().encode(JSON.stringify({ e: "attacker@example.com", t: NOW }))) + "." + sig;
  const r = await verifyToken(tampered, SECRET, NOW);
  assertEquals(r.ok, false);
  if (!r.ok) assertEquals(r.reason, "invalid_signature");
});

Deno.test("wrong signing secret → invalid_signature", async () => {
  const t = await signToken({ e: "alice@example.com", t: NOW }, "a-different-secret");
  const r = await verifyToken(t, SECRET, NOW);
  assertEquals(r.ok, false);
  if (!r.ok) assertEquals(r.reason, "invalid_signature");
});

Deno.test("expired token (>30d old) → expired", async () => {
  const t = await signToken({ e: "alice@example.com", t: NOW });
  const thirtyOneDaysLater = NOW + 31 * 24 * 60 * 60;
  const r = await verifyToken(t, SECRET, thirtyOneDaysLater);
  assertEquals(r.ok, false);
  if (!r.ok) assertEquals(r.reason, "expired");
});

Deno.test("fresh token at 29d → ok", async () => {
  const t = await signToken({ e: "alice@example.com", t: NOW });
  const twentyNineDaysLater = NOW + 29 * 24 * 60 * 60;
  const r = await verifyToken(t, SECRET, twentyNineDaysLater);
  assertEquals(r.ok, true);
});

Deno.test("missing required fields → invalid_payload", async () => {
  const t = await signToken({ u: null });
  const r = await verifyToken(t, SECRET, NOW);
  assertEquals(r.ok, false);
  if (!r.ok) assertEquals(r.reason, "invalid_payload");
});
