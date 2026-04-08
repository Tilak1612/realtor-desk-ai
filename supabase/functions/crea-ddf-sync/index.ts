import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREA-DDF-SYNC] ${step}${detailsStr}`);
};

/**
 * CREA DDF® Sync Edge Function — SCAFFOLD
 *
 * This function will sync property listings from the CREA Data Distribution
 * Facility (DDF®) into the ddf_properties table. It is designed to be invoked
 * on a cron schedule (e.g. every 6 hours).
 *
 * STATUS: Scaffold only — waiting for CREA DDF API credentials and approval.
 *
 * Implementation roadmap:
 *   1. OAuth 2.0 token exchange with CREA DDF API
 *   2. Fetch listings delta since last sync (use ddf_sync_log.last_synced_at)
 *   3. Normalize RETS/DDF property data → ddf_properties schema
 *   4. Upsert into Supabase with source='crea_ddf'
 *   5. Handle photos (store URLs, not binary)
 *   6. Exponential backoff on rate limits
 *
 * Required Supabase secrets:
 *   - CREA_DDF_API_KEY
 *   - CREA_DDF_API_SECRET
 */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify this is called from a cron or authorized service
    const authHeader = req.headers.get("Authorization");
    const cronSecret = Deno.env.get("CRON_SECRET");

    // Accept either a valid user token or the cron secret
    if (authHeader) {
      const supabaseAuth = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? ""
      );
      const token = authHeader.replace("Bearer ", "");
      const { error } = await supabaseAuth.auth.getUser(token);
      if (error && token !== cronSecret) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    logStep("Function invoked");

    const ddfApiKey = Deno.env.get("CREA_DDF_API_KEY");
    const ddfApiSecret = Deno.env.get("CREA_DDF_API_SECRET");

    if (!ddfApiKey || !ddfApiSecret) {
      logStep("CREA DDF credentials not configured — returning scaffold response");
      return new Response(
        JSON.stringify({
          status: "scaffold",
          message: "CREA DDF sync is not yet active. API credentials are required.",
          requiredSecrets: ["CREA_DDF_API_KEY", "CREA_DDF_API_SECRET"],
          roadmap: [
            "1. Apply for CREA DDF API access at crea.ca/ddf",
            "2. Set API credentials as Supabase secrets",
            "3. This function will automatically begin syncing"
          ]
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ===== IMPLEMENTATION PLACEHOLDER =====
    // Step 1: OAuth token exchange
    // const tokenResponse = await fetch("https://ddf.crea.ca/oauth2/token", { ... });

    // Step 2: Fetch listings delta
    // const listingsResponse = await fetch("https://ddf.crea.ca/api/v1/listings?since=...", { ... });

    // Step 3: Normalize and upsert
    // const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    // await supabase.from("ddf_properties").upsert(normalizedListings, { onConflict: "mls_number" });

    // Step 4: Update sync log
    // await supabase.from("ddf_sync_log").insert({ synced_at: new Date(), listings_count: ... });

    logStep("Sync complete (placeholder)");

    return new Response(
      JSON.stringify({
        status: "scaffold",
        message: "DDF sync scaffold invoked successfully. Full implementation pending.",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[CREA-DDF-SYNC] Error:", error instanceof Error ? error.message : String(error));
    return new Response(
      JSON.stringify({ error: "An error occurred during DDF sync" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
