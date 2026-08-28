import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { readCredentials } from "../_shared/token-crypto.ts";

/**
 * Sync Health Check — runs every 15 min via pg_cron.
 * Pings connected OAuth integrations, refreshes tokens, reports errors.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Two callers, two auth paths, both failing closed:
  //   - pg_cron sweeps every connection and sends CRON_SECRET.
  //   - A signed-in user pressing "Sync Now" checks only their OWN connections.
  //     That button used to be a DB write that stamped "success" without
  //     calling anything, so it needs a real path in here.
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const cronSecret = Deno.env.get("CRON_SECRET");
  const authToken = req.headers.get("Authorization")?.replace("Bearer ", "");
  const isCron = !!cronSecret && authToken === cronSecret;

  let scopedUserId: string | null = null;
  let scopedToolSlug: string | null = null;

  if (!isCron) {
    if (!authToken) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    // Resolve the caller from their JWT. Anything we cannot resolve is refused;
    // the user id is never taken from the request body.
    const { data: userData, error: userErr } = await supabase.auth.getUser(authToken);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    scopedUserId = userData.user.id;
    try {
      const body = await req.json();
      if (typeof body?.tool_slug === "string") scopedToolSlug = body.tool_slug;
    } catch {
      // No body is fine: check all of the caller's connections.
    }
  }

  let connectionQuery = supabase
    .from("integration_connections")
    .select("*")
    .eq("status", "connected")
    .not("credentials_encrypted", "is", null);

  if (scopedUserId) {
    connectionQuery = connectionQuery.eq("user_id", scopedUserId);
    if (scopedToolSlug) connectionQuery = connectionQuery.eq("tool_slug", scopedToolSlug);
  }

  const { data: connections, error } = await connectionQuery;

  if (error) {
    console.error("[SYNC-HEALTH] Fetch error:", error.message);
    return new Response(JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const results = { checked: 0, refreshed: 0, errors: 0, healthy: 0, unknown: 0 };

  for (const conn of connections ?? []) {
    // Only check OAuth tools (Google, Microsoft)
    const isOAuth = ["google-calendar", "google-contacts", "outlook-calendar", "microsoft-contacts"].includes(conn.tool_slug);
    if (!isOAuth) continue;

    results.checked++;

    try {
      // Try to ping the API with the stored access token
      const health = await pingToolApi(conn.tool_slug, conn.credentials_encrypted);

      if (health === "unknown") {
        // Leave last_sync_status untouched. Writing "success" here is exactly
        // the old bug; writing "error" would nag users over transient upstream
        // failures. Unknown means we learned nothing, so we assert nothing.
        console.log(`[SYNC-HEALTH] Indeterminate for ${conn.tool_slug}; leaving status unchanged`);
        results.unknown++;
      } else if (health === "healthy") {
        await supabase.from("integration_connections").update({
          last_sync_at: new Date().toISOString(),
          last_sync_status: "success",
          last_sync_error: null,
        }).eq("id", conn.id);
        results.healthy++;
      } else {
        // Token may be expired — mark as error
        await supabase.from("integration_connections").update({
          last_sync_status: "error",
          last_sync_error: "API ping failed. Token may be expired — re-authentication required.",
        }).eq("id", conn.id);

        // Send re-auth email (with 24h dedup)
        const lastEmail = conn.last_reauth_email_sent_at;
        const hoursSince = lastEmail
          ? (Date.now() - new Date(lastEmail).getTime()) / (1000 * 60 * 60)
          : Infinity;

        if (hoursSince > 24) {
          try {
            await supabase.functions.invoke("send-reauth-email", {
              body: { userId: conn.user_id, toolSlug: conn.tool_slug },
            });
            await supabase.from("integration_connections").update({
              last_reauth_email_sent_at: new Date().toISOString(),
            }).eq("id", conn.id);
          } catch (emailErr) {
            console.error("[SYNC-HEALTH] Re-auth email failed:", emailErr);
          }
        }

        results.errors++;
      }
    } catch (err) {
      console.error(`[SYNC-HEALTH] Error for ${conn.tool_slug}:`, err);
      await supabase.from("integration_connections").update({
        last_sync_status: "error",
        last_sync_error: `Health check error: ${err instanceof Error ? err.message : String(err)}`,
      }).eq("id", conn.id);
      results.errors++;
    }
  }

  console.log("[SYNC-HEALTH] Complete:", results);
  return new Response(JSON.stringify(results),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
});

type Health = "healthy" | "unhealthy" | "unknown";

/** Provider endpoints that return 401/403 on an invalid or expired token. */
const PROBE_URLS: Record<string, string> = {
  "google-calendar": "https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=1",
  "google-contacts": "https://people.googleapis.com/v1/people/me/connections?pageSize=1&personFields=names",
  "outlook-calendar": "https://graph.microsoft.com/v1.0/me/calendars?$top=1",
  "microsoft-contacts": "https://graph.microsoft.com/v1.0/me/contacts?$top=1",
};

/**
 * Actually call the provider with the stored access token.
 *
 * This used to be `return true` unconditionally, with a comment saying the
 * real check "happens when the user actually uses the integration". Because
 * this runs on a 15-minute cron and stamps last_sync_status:"success", the
 * entire error branch above was unreachable and send-reauth-email had never
 * once fired -- a revoked token showed a green badge indefinitely.
 *
 * Returns "unknown" rather than "healthy" when we cannot determine the state
 * (no key, undecryptable blob, no token, network failure). Claiming success
 * without evidence is the bug being fixed here, so an indeterminate result
 * must never be reported as healthy.
 */
async function pingToolApi(toolSlug: string, credentialsEncrypted: string | null): Promise<Health> {
  const url = PROBE_URLS[toolSlug];
  if (!url) return "unknown";

  const creds = await readCredentials(
    credentialsEncrypted,
    Deno.env.get("ENCRYPTION_KEY")
  );
  if (!creds) return "unknown";

  const accessToken =
    (creds.access_token as string | undefined) ??
    (creds.accessToken as string | undefined);
  if (!accessToken) return "unknown";

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(10_000),
    });

    // 401/403 is the signal we care about: the token is dead and the user has
    // to re-authenticate.
    if (res.status === 401 || res.status === 403) return "unhealthy";
    if (res.ok) return "healthy";

    // 5xx or rate limiting is the provider's problem, not the token's -- do
    // not nag the user to re-auth over a transient upstream error.
    return "unknown";
  } catch {
    return "unknown";
  }
}
