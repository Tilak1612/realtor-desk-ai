import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Auth Rate Limiter — tracks login/signup attempts per IP in a Supabase table.
 *
 * Limits:
 *   - Login:  10 attempts per 15-minute window per IP
 *   - Signup:  5 attempts per 15-minute window per IP
 *
 * The frontend calls this BEFORE hitting supabase.auth to get a go/no-go.
 * If the limit is exceeded, a 429 is returned.
 */

const LIMITS: Record<string, { maxAttempts: number; windowMinutes: number }> = {
  login:  { maxAttempts: 10, windowMinutes: 15 },
  signup: { maxAttempts: 5,  windowMinutes: 15 },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action } = body;
    if (!action || !LIMITS[action]) {
      return new Response(
        JSON.stringify({ error: "Invalid action. Must be 'login' or 'signup'." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract client IP from standard headers (Vercel/Supabase proxy chain)
    const ip =
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    const { maxAttempts, windowMinutes } = LIMITS[action];
    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Count recent attempts
    const { count, error: countError } = await supabase
      .from("auth_rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip)
      .eq("action", action)
      .gte("attempted_at", windowStart);

    if (countError) {
      console.error("[AUTH-RATE-LIMITER] Count query failed:", countError.message);
      // Fail open — don't block users if the table doesn't exist yet
      return new Response(
        JSON.stringify({ allowed: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const attempts = count ?? 0;

    if (attempts >= maxAttempts) {
      console.warn(`[AUTH-RATE-LIMITER] Rate limit hit: ip=${ip} action=${action} attempts=${attempts}`);
      return new Response(
        JSON.stringify({
          allowed: false,
          error: "Too many attempts. Please try again later.",
          retryAfterMinutes: windowMinutes,
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Record this attempt
    const { error: insertError } = await supabase
      .from("auth_rate_limits")
      .insert({ ip_address: ip, action, attempted_at: new Date().toISOString() });

    if (insertError) {
      console.error("[AUTH-RATE-LIMITER] Insert failed:", insertError.message);
    }

    return new Response(
      JSON.stringify({
        allowed: true,
        remaining: maxAttempts - attempts - 1,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[AUTH-RATE-LIMITER] Error:", error instanceof Error ? error.message : String(error));
    // Fail open
    return new Response(
      JSON.stringify({ allowed: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
