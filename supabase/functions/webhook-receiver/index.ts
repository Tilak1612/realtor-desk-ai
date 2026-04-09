import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

/**
 * Webhook Receiver — catches incoming pings from Zapier/Make/n8n.
 *
 * URL format: POST /webhook-receiver?user_id=X&tool=zapier&token=Y
 * Deployed with --no-verify-jwt since external services call this.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("user_id");
    const toolSlug = url.searchParams.get("tool");
    const token = url.searchParams.get("token");

    if (!userId || !toolSlug || !token) {
      return new Response(JSON.stringify({ error: "Missing user_id, tool, or token" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Validate webhook token
    const { data: connection, error } = await supabase
      .from("integration_connections")
      .select("id, status, sync_count_total")
      .eq("user_id", userId)
      .eq("tool_slug", toolSlug)
      .eq("webhook_token", token)
      .single();

    if (error || !connection) {
      console.warn("[WEBHOOK] Invalid token:", { userId, toolSlug });
      return new Response(JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Parse payload
    let payload = {};
    try {
      payload = await req.json();
    } catch {
      // Some tools send empty pings — that's fine
    }

    // Update connection status
    await supabase.from("integration_connections").update({
      status: "connected",
      last_sync_at: new Date().toISOString(),
      last_sync_status: "success",
      last_sync_error: null,
      sync_count_total: (connection.sync_count_total || 0) + 1,
    }).eq("id", connection.id);

    console.log("[WEBHOOK] Received:", { userId, toolSlug, payloadSize: JSON.stringify(payload).length });

    return new Response(JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("[WEBHOOK] Error:", error instanceof Error ? error.message : String(error));
    return new Response(JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
