import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

/**
 * Webhook Receiver — catches incoming leads from Zapier/Make/n8n.
 *
 * URL format: POST /webhook-receiver?user_id=X&tool=zapier&token=Y
 * Deployed with --no-verify-jwt since external services call this.
 *
 * This function used to parse the inbound payload, log its byte length, and
 * discard it — the only write was a status bump on integration_connections.
 * It then returned 200, so the sending platform recorded a success and never
 * retried. Every lead routed through this endpoint was lost, and both sides
 * believed it had worked.
 *
 * It now:
 *   1. Persists the raw payload to webhook_events FIRST, before any parsing,
 *      so a payload we fail to interpret is still recoverable by hand.
 *   2. Maps the common Zapier/Make/n8n field spellings onto a contact.
 *   3. Returns 5xx when persistence fails, so the sender retries instead of
 *      silently dropping the lead.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

/** Case- and separator-insensitive lookup across the shapes these tools send. */
function pick(payload: Record<string, unknown>, names: string[]): string | null {
  const flat: Record<string, unknown> = {};
  const walk = (obj: Record<string, unknown>, depth: number) => {
    if (depth > 3) return;
    for (const [k, v] of Object.entries(obj)) {
      const key = k.toLowerCase().replace(/[\s_-]/g, "");
      if (v && typeof v === "object" && !Array.isArray(v)) {
        walk(v as Record<string, unknown>, depth + 1);
      } else if (flat[key] === undefined) {
        flat[key] = v;
      }
    }
  };
  walk(payload, 0);

  for (const name of names) {
    const key = name.toLowerCase().replace(/[\s_-]/g, "");
    const v = flat[key];
    if (typeof v === "string" && v.trim()) return v.trim();
    if (typeof v === "number") return String(v);
  }
  return null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  let eventId: string | null = null;

  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("user_id");
    const toolSlug = url.searchParams.get("tool");
    const token = url.searchParams.get("token");

    if (!userId || !toolSlug || !token) {
      return json({ error: "Missing user_id, tool, or token" }, 400);
    }

    const { data: connection, error: connErr } = await supabase
      .from("integration_connections")
      .select("id, status, sync_count_total")
      .eq("user_id", userId)
      .eq("tool_slug", toolSlug)
      .eq("webhook_token", token)
      .single();

    if (connErr || !connection) {
      console.warn("[WEBHOOK] Invalid token:", { userId, toolSlug });
      return json({ error: "Unauthorized" }, 401);
    }

    let payload: Record<string, unknown> = {};
    try {
      payload = (await req.json()) as Record<string, unknown>;
    } catch {
      // Some tools send empty pings when you save the Zap — that is fine, and
      // is handled as "ignored" below rather than treated as a lost lead.
    }

    // Persist the raw payload BEFORE interpreting it. If the mapping below is
    // wrong for some tool's shape, the data still exists and can be replayed.
    const { data: event, error: eventErr } = await supabase
      .from("webhook_events")
      .insert({
        connection_id: connection.id,
        user_id: userId,
        tool_slug: toolSlug,
        payload,
        processing_status: "received",
      })
      .select("id")
      .single();

    if (eventErr) {
      // Could not even record the payload — tell the sender to retry rather
      // than accepting a lead we cannot account for.
      console.error("[WEBHOOK] Failed to persist payload:", eventErr.message);
      return json({ error: "Could not persist payload; retry" }, 503);
    }
    eventId = event.id;

    const email = pick(payload, ["email", "emailaddress", "email1", "contactemail", "from"]);
    const phone = pick(payload, ["phone", "phonenumber", "mobile", "telephone", "cell"]);
    const fullName = pick(payload, ["name", "fullname", "contactname"]);
    let firstName = pick(payload, ["firstname", "fname", "givenname"]);
    let lastName = pick(payload, ["lastname", "lname", "surname", "familyname"]);

    if (!firstName && fullName) {
      const parts = fullName.split(/\s+/);
      firstName = parts[0];
      lastName = lastName ?? (parts.length > 1 ? parts.slice(1).join(" ") : null);
    }

    // A contact needs somewhere to send a reply. Without an email or a phone
    // there is nothing actionable, so record it as ignored rather than
    // creating a junk row -- but the raw payload is already stored above.
    if (!email && !phone) {
      await supabase
        .from("webhook_events")
        .update({ processing_status: "ignored" })
        .eq("id", eventId);

      await supabase
        .from("integration_connections")
        .update({
          status: "connected",
          last_sync_at: new Date().toISOString(),
          last_sync_status: "success",
          last_sync_error: null,
          sync_count_total: (connection.sync_count_total || 0) + 1,
        })
        .eq("id", connection.id);

      return json({ received: true, lead_created: false, reason: "no email or phone in payload" }, 200);
    }

    if (email && !EMAIL_RE.test(email)) {
      await supabase
        .from("webhook_events")
        .update({ processing_status: "failed", processing_error: `Malformed email: ${email}` })
        .eq("id", eventId);
      return json({ error: "Malformed email address" }, 400);
    }

    // Dedupe on email so a Zap that fires twice does not create two leads.
    let contactId: string | null = null;
    let status: "contact_created" | "contact_updated" = "contact_created";

    if (email) {
      const { data: existing } = await supabase
        .from("contacts")
        .select("id")
        .eq("user_id", userId)
        .eq("email", email.toLowerCase())
        .maybeSingle();
      if (existing) {
        contactId = existing.id;
        status = "contact_updated";
      }
    }

    if (contactId) {
      // Only fill blanks; never overwrite what the agent already curated.
      const patch: Record<string, unknown> = { last_contact_date: new Date().toISOString() };
      if (phone) patch.phone = phone;
      if (firstName) patch.first_name = firstName;
      if (lastName) patch.last_name = lastName;

      const { error: updErr } = await supabase
        .from("contacts")
        .update(patch)
        .eq("id", contactId)
        .eq("user_id", userId);
      if (updErr) throw new Error(`contact update failed: ${updErr.message}`);
    } else {
      const { data: created, error: insErr } = await supabase
        .from("contacts")
        .insert({
          user_id: userId,
          first_name: firstName ?? "Unknown",
          last_name: lastName,
          email: email ? email.toLowerCase() : `no-email-${crypto.randomUUID()}@placeholder.invalid`,
          phone,
          source: toolSlug,
          stage: "new",
          // No CASL consent is implied by an inbound webhook. The agent has to
          // record consent explicitly before this contact can be messaged.
          consent_given: false,
          casl_consent: false,
          metadata: { via: "webhook", tool: toolSlug },
        })
        .select("id")
        .single();
      if (insErr) throw new Error(`contact insert failed: ${insErr.message}`);
      contactId = created.id;
    }

    await supabase
      .from("webhook_events")
      .update({ processing_status: status, contact_id: contactId })
      .eq("id", eventId);

    await supabase
      .from("integration_connections")
      .update({
        status: "connected",
        last_sync_at: new Date().toISOString(),
        last_sync_status: "success",
        last_sync_error: null,
        sync_count_total: (connection.sync_count_total || 0) + 1,
      })
      .eq("id", connection.id);

    console.log("[WEBHOOK] Lead persisted:", { userId, toolSlug, contactId, status });
    return json({ received: true, lead_created: status === "contact_created", contact_id: contactId }, 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[WEBHOOK] Error:", message);

    if (eventId) {
      await supabase
        .from("webhook_events")
        .update({ processing_status: "failed", processing_error: message })
        .eq("id", eventId);
    }

    // 5xx so the sending platform retries. Returning 200 here is what made
    // every failure permanent and invisible.
    return json({ error: "Internal error; retry" }, 500);
  }
});
