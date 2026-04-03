import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_EMAIL = "RealtorDesk AI <support@realtordesk.ai>";
const APP_URL = "https://www.realtordesk.ai";

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Auth check
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const body = await req.json().catch(() => ({}));
    const userId = body.userId;

    if (!userId || userId !== user.id) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Check for duplicate welcome email
    const { data: existing } = await supabaseAdmin
      .from("email_events")
      .select("id")
      .eq("user_id", userId)
      .eq("event_type", "welcome")
      .limit(1);

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({ success: true, message: "Welcome email already sent" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get profile
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name, email")
      .eq("id", userId)
      .single();

    const recipientEmail = profile?.email || user.email;
    const fullName = profile?.full_name || "there";

    // Send via Resend
    const emailRes = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [recipientEmail],
        subject: "Welcome to RealtorDesk AI — Your 14-Day Trial Starts Now!",
        html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
<tr><td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:40px 30px;text-align:center;">
<h1 style="color:#ffffff;font-size:28px;margin:0;">Welcome to RealtorDesk AI! 🎉</h1>
<p style="color:#e0e7ff;font-size:16px;margin:10px 0 0;">Your AI-powered CRM is ready</p>
</td></tr>
<tr><td style="padding:30px;">
<p style="font-size:16px;color:#374151;line-height:1.6;">Hi ${fullName},</p>
<p style="font-size:16px;color:#374151;line-height:1.6;">Welcome aboard! Your 14-day free trial of RealtorDesk AI is now active. Here's how to get started:</p>

<table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
<tr><td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
<strong style="color:#6366f1;">1.</strong> <strong>Complete your profile</strong> — Add your brokerage info and preferences
</td></tr>
<tr><td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
<strong style="color:#6366f1;">2.</strong> <strong>Import your contacts</strong> — CSV upload or manual entry
</td></tr>
<tr><td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
<strong style="color:#6366f1;">3.</strong> <strong>Set up your AI chatbot</strong> — 24/7 lead capture on autopilot
</td></tr>
<tr><td style="padding:12px 0;">
<strong style="color:#6366f1;">4.</strong> <strong>Explore AI lead scoring</strong> — Know which leads to call first
</td></tr>
</table>

<div style="text-align:center;margin:30px 0;">
<a href="${APP_URL}/dashboard" style="background:#6366f1;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">Go to Dashboard →</a>
</div>

<p style="font-size:14px;color:#6b7280;line-height:1.6;">Need help? Reply to this email or visit our <a href="${APP_URL}/faq" style="color:#6366f1;">FAQ page</a>.</p>
<p style="font-size:14px;color:#6b7280;">— The RealtorDesk AI Team 🇨🇦</p>
</td></tr>
<tr><td style="background:#f9fafb;padding:20px 30px;text-align:center;">
<p style="font-size:12px;color:#9ca3af;margin:0;">RealtorDesk AI — Built for Canadian Real Estate Agents</p>
<p style="font-size:12px;color:#9ca3af;margin:5px 0 0;">Toronto, ON, Canada</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`,
      }),
    });

    if (!emailRes.ok) {
      const errBody = await emailRes.text();
      console.error("Resend API error:", errBody);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Log to email_events
    await supabaseAdmin.from("email_events").insert({
      user_id: userId,
      event_type: "welcome",
      recipient_email: recipientEmail,
      metadata: { resend_response: await emailRes.json() },
    });

    return new Response(
      JSON.stringify({ success: true, message: "Welcome email sent" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Error in send-welcome-email:", error instanceof Error ? error.message : String(error));
    return new Response(
      JSON.stringify({ error: "An error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
