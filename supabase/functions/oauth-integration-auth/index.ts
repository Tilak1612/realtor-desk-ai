import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * OAuth Integration Auth — generates OAuth URL for Google/Microsoft.
 * Frontend opens the returned URL in a popup window.
 */

const GOOGLE_SCOPES: Record<string, string> = {
  "google-calendar": "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email",
  "google-contacts": "https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/userinfo.email",
};

const MICROSOFT_SCOPES: Record<string, string> = {
  "outlook-calendar": "Calendars.ReadWrite User.Read offline_access",
  "microsoft-contacts": "Contacts.Read User.Read offline_access",
};

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
      return new Response(JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid session" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json();
    const { provider, tool_slug } = body;

    if (!provider || !tool_slug) {
      return new Response(JSON.stringify({ error: "provider and tool_slug required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Generate state for CSRF protection
    const state = btoa(JSON.stringify({
      userId: user.id,
      toolSlug: tool_slug,
      nonce: crypto.randomUUID(),
    }));

    // Store state
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    await supabase.from("oauth_state_store").insert({
      state,
      user_id: user.id,
      tool_slug,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    });

    let authUrl: string;

    if (provider === "google") {
      const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
      const redirectUri = Deno.env.get("GOOGLE_REDIRECT_URI");
      if (!clientId || !redirectUri) {
        return new Response(JSON.stringify({ error: "Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_REDIRECT_URI." }),
          { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const scopes = GOOGLE_SCOPES[tool_slug] || "";
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}&access_type=offline&prompt=consent&state=${state}`;

    } else if (provider === "microsoft") {
      const clientId = Deno.env.get("MICROSOFT_CLIENT_ID");
      const redirectUri = Deno.env.get("MICROSOFT_REDIRECT_URI");
      if (!clientId || !redirectUri) {
        return new Response(JSON.stringify({ error: "Microsoft OAuth not configured. Set MICROSOFT_CLIENT_ID and MICROSOFT_REDIRECT_URI." }),
          { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const scopes = MICROSOFT_SCOPES[tool_slug] || "";
      authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}&state=${state}`;

    } else {
      return new Response(JSON.stringify({ error: "Unknown provider" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ authUrl }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("[OAUTH-AUTH] Error:", error instanceof Error ? error.message : String(error));
    return new Response(JSON.stringify({ error: "An error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
