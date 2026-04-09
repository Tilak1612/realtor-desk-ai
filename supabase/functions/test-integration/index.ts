import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Test Integration — validates credentials for API key and SMTP connections.
 * Called before saving credentials to ensure they're valid.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ valid: false, error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const token = authHeader.replace("Bearer ", "");
    const { error: authError } = await supabaseAuth.auth.getUser(token);
    if (authError) {
      return new Response(JSON.stringify({ valid: false, error: "Invalid session" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json();
    const { tool_slug, connection_method, credentials } = body;

    if (!tool_slug || !credentials) {
      return new Response(JSON.stringify({ valid: false, error: "Missing tool_slug or credentials" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ─── Twilio Test ───
    if (tool_slug === "twilio") {
      const { api_key: accountSid, api_secret: authToken } = credentials;
      if (!accountSid || !authToken) {
        return new Response(JSON.stringify({ valid: false, error: "Account SID and Auth Token are required" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      try {
        const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`, {
          headers: {
            Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          return new Response(JSON.stringify({ valid: true, accountName: data.friendly_name }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        } else {
          return new Response(JSON.stringify({ valid: false, error: "Invalid Twilio credentials. Check your Account SID and Auth Token." }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      } catch {
        return new Response(JSON.stringify({ valid: false, error: "Could not reach Twilio. Please try again." }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    // ─── SMTP Test ───
    if (connection_method === "smtp") {
      const { host, port, user } = credentials;
      if (!host || !port || !user) {
        return new Response(JSON.stringify({ valid: false, error: "SMTP host, port, and username are required" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // In Deno edge functions, we can't use Nodemailer. Do a TCP connect test instead.
      try {
        const conn = await Deno.connect({ hostname: host, port: parseInt(port) });
        conn.close();
        return new Response(JSON.stringify({ valid: true, message: "SMTP server is reachable" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch {
        return new Response(JSON.stringify({ valid: false, error: `Cannot reach ${host}:${port}. Check your SMTP settings.` }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    // ─── Generic API Key Test ───
    // For tools without specific test endpoints, just validate format
    if (credentials.api_key && credentials.api_key.length >= 10) {
      return new Response(JSON.stringify({ valid: true, message: "API key format looks valid" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ valid: false, error: "Invalid or missing credentials" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("[TEST-INTEGRATION] Error:", error instanceof Error ? error.message : String(error));
    return new Response(JSON.stringify({ valid: false, error: "An error occurred during testing" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
