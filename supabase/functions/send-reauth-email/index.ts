import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { buildCaslFooter } from "../_shared/casl-footer.ts";
import { isEmailSuppressed } from "../_shared/email-suppression.ts";

const TOOL_NAMES: Record<string, string> = {
  "google-calendar": "Google Calendar",
  "google-contacts": "Google Contacts",
  "outlook-calendar": "Outlook Calendar",
  "microsoft-contacts": "Microsoft Contacts",
};

const APP_URL = "https://www.realtordesk.ai";
const FROM_EMAIL = "RealtorDesk AI <support@realtordesk.ai>";

serve(async (req) => {
  try {
    const { userId, toolSlug } = await req.json();

    if (!userId || !toolSlug) {
      return new Response(JSON.stringify({ error: "userId and toolSlug required" }), { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user email
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", userId)
      .single();

    if (!profile?.email) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const toolName = TOOL_NAMES[toolSlug] || toolSlug;
    const reauthUrl = `${APP_URL}/dashboard/integrations`;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.error("[REAUTH-EMAIL] RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Email service not configured" }), { status: 500 });
    }

    if (await isEmailSuppressed(supabase, profile.email)) {
      return new Response(JSON.stringify({ sent: false, suppressed: true }), { status: 200 });
    }

    const caslFooter = await buildCaslFooter({
      recipientEmail: profile.email,
      userId,
      consentBasis: "transactional",
    });

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [profile.email],
        subject: `Action needed: Re-connect your ${toolName} integration`,
        html: buildEmailHtml(profile.full_name || profile.email, toolName, reauthUrl, caslFooter),
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.text();
      console.error("[REAUTH-EMAIL] Send failed:", err);
      return new Response(JSON.stringify({ error: "Email failed" }), { status: 500 });
    }

    console.log("[REAUTH-EMAIL] Sent to:", profile.email, "for:", toolName);
    return new Response(JSON.stringify({ sent: true }), { status: 200 });
  } catch (error) {
    console.error("[REAUTH-EMAIL] Error:", error instanceof Error ? error.message : String(error));
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
});

function buildEmailHtml(name: string, toolName: string, reauthUrl: string, caslFooter = ""): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#141414;border-radius:12px;border:1px solid #2a2a2a;overflow:hidden;">
<tr><td style="background:linear-gradient(135deg,#ea580c,#f97316);padding:24px 32px;">
<h1 style="color:#fff;font-size:20px;margin:0;">RealtorDesk AI</h1>
</td></tr>
<tr><td style="padding:32px;">
<h2 style="color:#fff;font-size:20px;margin:0 0 16px;">Your ${toolName} connection needs attention</h2>
<p style="color:#a0a0a0;font-size:15px;line-height:1.6;margin:0 0 16px;">Hi ${name},</p>
<p style="color:#a0a0a0;font-size:15px;line-height:1.6;margin:0 0 24px;">
Your <strong style="color:#fff;">${toolName}</strong> integration has been disconnected because your access token expired. Your calendar events and contacts are no longer syncing.</p>
<p style="color:#a0a0a0;font-size:15px;line-height:1.6;margin:0 0 32px;">It only takes 30 seconds to reconnect.</p>
<table cellpadding="0" cellspacing="0"><tr>
<td style="border-radius:8px;background:#ea580c;">
<a href="${reauthUrl}" style="display:inline-block;padding:14px 28px;color:#fff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">
Re-connect ${toolName} →
</a></td></tr></table>
</td></tr>
<tr><td style="padding:0 32px 32px;">
<p style="color:#606060;font-size:13px;margin:0 0 12px;">To reconnect:</p>
<ol style="color:#a0a0a0;font-size:13px;line-height:1.8;margin:0;padding-left:20px;">
<li>Click the button above</li>
<li>Find ${toolName} and click "Re-authenticate"</li>
<li>Sign in with your account — under 30 seconds</li>
</ol>
</td></tr>
<tr><td style="padding:24px 32px;border-top:1px solid #2a2a2a;">
<p style="color:#404040;font-size:12px;margin:0;">
RealtorDesk AI — Built for Canadian Real Estate Agents 🇨🇦<br>
Powered by Brainfy AI Inc · Edmonton, Alberta, Canada
</p></td></tr>
<tr><td>${caslFooter}</td></tr>
</table></td></tr></table>
</body></html>`;
}
