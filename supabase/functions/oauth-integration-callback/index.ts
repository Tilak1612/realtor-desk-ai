import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

/**
 * OAuth Integration Callback — receives code from Google/Microsoft,
 * exchanges for tokens, encrypts, stores, and closes popup.
 *
 * Deploy with --no-verify-jwt since OAuth providers redirect here without JWT.
 */

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    if (error) {
      return new Response(popupErrorHTML(error), { headers: { "Content-Type": "text/html" } });
    }

    if (!code || !state) {
      return new Response(popupErrorHTML("Missing code or state"), { headers: { "Content-Type": "text/html" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify state
    const { data: stateRecord } = await supabase
      .from("oauth_state_store")
      .select("*")
      .eq("state", state)
      .single();

    if (!stateRecord || new Date(stateRecord.expires_at) < new Date()) {
      return new Response(popupErrorHTML("Session expired. Please try again."), { headers: { "Content-Type": "text/html" } });
    }

    let stateData: { userId: string; toolSlug: string };
    try {
      stateData = JSON.parse(atob(state));
    } catch {
      return new Response(popupErrorHTML("Invalid state"), { headers: { "Content-Type": "text/html" } });
    }

    const { userId, toolSlug } = stateData;
    const isGoogle = toolSlug.startsWith("google");

    // Exchange code for tokens
    let tokens: { access_token: string; refresh_token?: string; expires_in: number };
    let accountLabel: string;

    if (isGoogle) {
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: Deno.env.get("GOOGLE_CLIENT_ID") ?? "",
          client_secret: Deno.env.get("GOOGLE_CLIENT_SECRET") ?? "",
          redirect_uri: Deno.env.get("GOOGLE_REDIRECT_URI") ?? "",
          grant_type: "authorization_code",
        }),
      });
      tokens = await tokenRes.json();

      if (!tokens.access_token) {
        return new Response(popupErrorHTML("Failed to get Google token"), { headers: { "Content-Type": "text/html" } });
      }

      // Get user email
      const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const profile = await profileRes.json();
      accountLabel = profile.email || "Google Account";

    } else {
      // Microsoft
      const tokenRes = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: Deno.env.get("MICROSOFT_CLIENT_ID") ?? "",
          client_secret: Deno.env.get("MICROSOFT_CLIENT_SECRET") ?? "",
          redirect_uri: Deno.env.get("MICROSOFT_REDIRECT_URI") ?? "",
          grant_type: "authorization_code",
        }),
      });
      tokens = await tokenRes.json();

      if (!tokens.access_token) {
        return new Response(popupErrorHTML("Failed to get Microsoft token"), { headers: { "Content-Type": "text/html" } });
      }

      const profileRes = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const profile = await profileRes.json();
      accountLabel = profile.mail || profile.userPrincipalName || "Microsoft Account";
    }

    // Encrypt tokens
    const credentialsJson = JSON.stringify({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + (tokens.expires_in * 1000),
    });

    // Use the encrypt-integration-token function for encryption
    const { data: encrypted } = await supabase.functions.invoke("encrypt-integration-token", {
      body: { token: credentialsJson },
    });

    // Upsert connection
    await supabase.from("integration_connections").upsert({
      user_id: userId,
      tool_slug: toolSlug,
      status: "connected",
      credentials_encrypted: encrypted?.encrypted || credentialsJson,
      connected_account_label: accountLabel,
      connection_method: "oauth",
      last_sync_at: new Date().toISOString(),
      last_sync_status: "success",
    }, { onConflict: "user_id,tool_slug" });

    // Clean up state
    await supabase.from("oauth_state_store").delete().eq("state", state);

    console.log("[OAUTH-CALLBACK] Connected:", { userId, toolSlug, accountLabel });

    return new Response(popupSuccessHTML(toolSlug, accountLabel), { headers: { "Content-Type": "text/html" } });
  } catch (error) {
    console.error("[OAUTH-CALLBACK] Error:", error instanceof Error ? error.message : String(error));
    return new Response(popupErrorHTML("Something went wrong. Please try again."), { headers: { "Content-Type": "text/html" } });
  }
});

function popupSuccessHTML(toolSlug: string, accountLabel: string): string {
  return `<!DOCTYPE html><html><head><title>Connected</title></head><body style="background:#0a0a0a;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
<div style="text-align:center">
  <div style="font-size:48px;margin-bottom:16px">✅</div>
  <h2>Connected!</h2>
  <p style="color:#999">You can close this window.</p>
</div>
<script>
  window.opener?.postMessage({ type: 'OAUTH_SUCCESS', toolSlug: '${toolSlug}', accountLabel: '${accountLabel}' }, '*');
  setTimeout(() => window.close(), 2000);
</script></body></html>`;
}

function popupErrorHTML(message: string): string {
  return `<!DOCTYPE html><html><head><title>Error</title></head><body style="background:#0a0a0a;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
<div style="text-align:center">
  <div style="font-size:48px;margin-bottom:16px">❌</div>
  <h2>Connection Failed</h2>
  <p style="color:#999">${message}</p>
  <p style="color:#666;font-size:12px;margin-top:16px">You can close this window and try again.</p>
</div>
<script>
  window.opener?.postMessage({ type: 'OAUTH_ERROR', message: '${message}' }, '*');
  setTimeout(() => window.close(), 5000);
</script></body></html>`;
}
