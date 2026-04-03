import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_EMAIL = "Alex from RealtorDesk AI <support@realtordesk.ai>";
const APP_URL = "https://www.realtordesk.ai";

// PDF hosted in Supabase Storage public bucket "assets".
// To activate: upload the PDF to the bucket and confirm the public URL resolves.
// Bucket path: assets/lead-magnets/slow-follow-up-calculator-canadian-realtors.pdf
const SUPABASE_STORAGE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const DOWNLOAD_URL = SUPABASE_STORAGE_URL
  ? `${SUPABASE_STORAGE_URL}/storage/v1/object/public/assets/lead-magnets/slow-follow-up-calculator-canadian-realtors.pdf`
  : `${APP_URL}/downloads/slow-follow-up-calculator-canadian-realtors.pdf`;

// Disposable / throwaway email domains to reject
const BLOCKED_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "tempmail.com", "throwam.com",
  "sharklasers.com", "guerrillamailblock.com", "grr.la", "guerrillamail.info",
  "guerrillamail.biz", "guerrillamail.de", "guerrillamail.net", "guerrillamail.org",
  "spam4.me", "trashmail.com", "trashmail.at", "trashmail.io", "trashmail.me",
  "dispostable.com", "yopmail.com", "yopmail.fr", "cool.fr.nf", "jetable.fr.nf",
  "nospam.ze.tc", "nomail.xl.cx", "mega.zik.dj", "speed.1s.fr", "courriel.fr.nf",
  "moncourrier.fr.nf", "monemail.fr.nf", "monmail.fr.nf", "10minutemail.com",
  "10minutemail.net", "10minutemail.org", "fakeinbox.com", "mailnull.com",
  "spamgourmet.com", "spamgourmet.net", "spamgourmet.org", "maildrop.cc",
  "spamfree24.org", "wegwerfmail.de", "wegwerfmail.net", "wegwerfmail.org",
]);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Rate-limit: one successful send per email address per 24 hours.
// Uses lead_magnet_requests table (no user_id — visitors are unauthenticated).
async function isRateLimited(email: string): Promise<boolean> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return false; // fail open if not configured

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { count } = await supabase
    .from("lead_magnet_requests")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", since);

  return (count ?? 0) > 0;
}

async function recordSend(email: string): Promise<void> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return;

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  await supabase.from("lead_magnet_requests").insert({ email });
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { firstName, email, website } = body as {
      firstName?: string;
      email?: string;
      website?: string; // honeypot — must be absent or empty
    };

    // Honeypot: bots fill hidden fields; humans don't
    if (website) {
      // Return 200 so bots think it worked
      return new Response(JSON.stringify({ success: true }), {
        status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const domain = email.split("@")[1].toLowerCase();
    if (BLOCKED_DOMAINS.has(domain)) {
      return new Response(
        JSON.stringify({ error: "Please use a permanent email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Rate limit: silently succeed so we don't leak whether an email is in our system
    if (await isRateLimited(email)) {
      console.log("Rate limited (already sent in past 24h):", email);
      return new Response(JSON.stringify({ success: true }), {
        status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const name = (firstName ?? "").trim() || "there";

    const emailRes = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: "Your follow-up calculator + 5 scripts (RealtorDesk)",
        html: deliveryEmailHtml(name),
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

    // Record the send for rate-limiting future requests from the same address
    await recordSend(email);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("send-lead-magnet-email error:", error instanceof Error ? error.message : String(error));
    return new Response(
      JSON.stringify({ error: "An error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

const deliveryEmailHtml = (name: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;">

        <!-- Header -->
        <tr>
          <td style="background:#1e3a5f;padding:32px 32px 24px;text-align:left;">
            <p style="margin:0 0 4px;color:#a0b4c8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">RealtorDesk AI</p>
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;">
              Your follow-up calculator + scripts are here
            </h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="font-size:16px;color:#374151;line-height:1.6;margin:0 0 16px;">Hi ${name},</p>
            <p style="font-size:16px;color:#374151;line-height:1.6;margin:0 0 24px;">
              Here's everything you asked for:
            </p>

            <!-- Download CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
              <tr>
                <td style="background:#f0f4ff;border:1px solid #c7d7f5;border-radius:10px;padding:20px 24px;">
                  <p style="margin:0 0 6px;font-size:14px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Free download</p>
                  <p style="margin:0 0 12px;font-size:17px;color:#111827;font-weight:700;">How Much Is Slow Follow-Up Costing You?</p>
                  <p style="margin:0 0 16px;font-size:14px;color:#4b5563;line-height:1.5;">
                    GCI loss calculator + 5 done-for-you response scripts for Canadian agents.
                  </p>
                  <a href="${DOWNLOAD_URL}"
                     style="display:inline-block;background:#2563eb;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">
                    Download the calculator + scripts →
                  </a>
                </td>
              </tr>
            </table>

            <!-- How to use it -->
            <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 12px;font-weight:600;">
              Start here:
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#374151;line-height:1.5;">
                  <strong style="color:#2563eb;">Step 1 —</strong> Run the calculator in Part 1. Most agents are surprised by their number.
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#374151;line-height:1.5;">
                  <strong style="color:#2563eb;">Step 2 —</strong> Set Script 1 as your default auto-reply for new leads. Takes about 10 minutes in your email client or CRM.
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;font-size:14px;color:#374151;line-height:1.5;">
                  <strong style="color:#2563eb;">Step 3 —</strong> If you want the scripts running automatically — 24/7, even during showings — that's exactly what RealtorDesk AI does.
                </td>
              </tr>
            </table>

            <!-- Soft trial CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 6px;font-size:15px;color:#111827;font-weight:700;">
                    Want AI doing this automatically while you're in showings?
                  </p>
                  <p style="margin:0 0 14px;font-size:14px;color:#4b5563;line-height:1.5;">
                    RealtorDesk AI responds to every lead in seconds — CREA DDF integrated, PIPEDA compliant, bilingual. Starting at $149/month CAD.
                  </p>
                  <a href="${APP_URL}/signup"
                     style="display:inline-block;background:#1e3a5f;color:#ffffff;padding:11px 22px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;margin-right:10px;">
                    Start your 14-day free trial
                  </a>
                  <a href="${APP_URL}/demo"
                     style="display:inline-block;color:#2563eb;padding:11px 0;text-decoration:none;font-weight:600;font-size:14px;">
                    Book a demo →
                  </a>
                </td>
              </tr>
            </table>

            <p style="font-size:14px;color:#6b7280;line-height:1.6;margin:0 0 4px;">
              Questions about setting up your first automated follow-up? Reply to this email — I read every one.
            </p>
            <p style="font-size:14px;color:#374151;margin:0;">
              — Alex<br />
              <span style="color:#6b7280;">RealtorDesk AI | support@realtordesk.ai</span>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;">
            <p style="font-size:12px;color:#9ca3af;margin:0;text-align:center;">
              RealtorDesk AI — Built for Canadian Real Estate Agents 🇨🇦
              <br />
              You're receiving this because you requested the slow follow-up calculator.
              <br />
              <a href="${APP_URL}/unsubscribe" style="color:#9ca3af;">Unsubscribe</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
`;

serve(handler);
