// Lifecycle email templates, rendered by send-lifecycle-email and by the
// offline dry-run script (scripts/email-dry-run.mjs). No imports, so Node and
// vitest can load it as well as Deno; the CASL footer is passed in.

export const APP_URL = "https://www.realtordesk.ai";

export interface EmailTemplate {
  subject: string;
  html: string;
}

export function getTemplate(eventType: string, data: Record<string, unknown> = {}, caslFooter = ""): EmailTemplate | null {
  const name = data.name || "there";

  const templates: Record<string, EmailTemplate> = {
    onboarding_step1: {
      subject: "Getting Started with RealtorDesk AI — Your Quick Guide",
      html: buildEmail(
        "Let's Get You Set Up! 🚀",
        `<p style="font-size:16px;color:#374151;line-height:1.6;">Hi ${name},</p>
        <p style="font-size:16px;color:#374151;line-height:1.6;">We noticed you haven't completed your profile setup yet. Here's a quick checklist to get the most out of RealtorDesk AI:</p>
        <ul style="font-size:16px;color:#374151;line-height:2;">
          <li>✅ Add your brokerage details</li>
          <li>✅ Import your first contacts</li>
          <li>✅ Configure your AI chatbot</li>
          <li>✅ Set up your calendar</li>
        </ul>
        <div style="text-align:center;margin:30px 0;">
          <a href="${APP_URL}/onboarding" style="background:#6366f1;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">Complete Setup →</a>
        </div>`,
        caslFooter
      ),
    },
    trial_ending: {
      subject: `Your RealtorDesk AI trial ends in ${data.days_remaining || 3} days — card will be charged`,
      html: buildEmail(
        "Your Trial Is Almost Over ⏰",
        `<p style="font-size:16px;color:#374151;line-height:1.6;">Hi ${name},</p>
        <p style="font-size:16px;color:#374151;line-height:1.6;">Your 14-day free trial of RealtorDesk AI ends in <strong>${data.days_remaining || 3} days</strong>${data.trial_end_date ? ` (${data.trial_end_date})` : ""}.</p>
        <p style="font-size:16px;color:#374151;line-height:1.6;"><strong>Your card will be charged ${data.amount || "your plan price"} automatically when the trial ends.</strong> No action is needed to continue. If you would rather not be billed, cancel from Billing before that date and you will not be charged.</p>
        <p style="font-size:16px;color:#374151;line-height:1.6;">What you keep:</p>
        <ul style="font-size:16px;color:#374151;line-height:2;">
          <li>🤖 AI-powered lead scoring</li>
          <li>💬 24/7 chatbot lead capture</li>
          <li>📊 Smart CRM dashboard</li>
          <li>🏠 Property management tools</li>
        </ul>
        <div style="text-align:center;margin:30px 0;">
          <a href="${APP_URL}/billing" style="background:#6366f1;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">Manage or cancel your plan →</a>
        </div>
        <p style="font-size:14px;color:#6b7280;">Plans start at $149 CAD/month. Canadian GST/HST is applied at checkout.</p>`,
        caslFooter
      ),
    },
    payment_success: {
      subject: "Payment Confirmed — RealtorDesk AI",
      html: buildEmail(
        "Payment Confirmed ✅",
        `<p style="font-size:16px;color:#374151;line-height:1.6;">Hi ${name},</p>
        <p style="font-size:16px;color:#374151;line-height:1.6;">Your payment of <strong>${data.amount || ""}</strong> has been successfully processed.</p>
        <p style="font-size:16px;color:#374151;line-height:1.6;">Your subscription is active and you have full access to all RealtorDesk AI features.</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${APP_URL}/dashboard" style="background:#6366f1;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">Go to Dashboard →</a>
        </div>
        <p style="font-size:14px;color:#6b7280;">View your billing history in <a href="${APP_URL}/billing" style="color:#6366f1;">Settings → Billing</a>.</p>`,
        caslFooter
      ),
    },
    payment_failed: {
      subject: "Action Required: Payment Failed — RealtorDesk AI",
      html: buildEmail(
        "Payment Failed ⚠️",
        `<p style="font-size:16px;color:#374151;line-height:1.6;">Hi ${name},</p>
        <p style="font-size:16px;color:#374151;line-height:1.6;">We were unable to process your latest payment. To avoid losing access to RealtorDesk AI, please update your payment method.</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${APP_URL}/billing" style="background:#ef4444;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">Update Payment Method →</a>
        </div>
        <p style="font-size:14px;color:#6b7280;">If you believe this is an error, please contact us at support@realtordesk.ai.</p>`,
        caslFooter
      ),
    },
    winback: {
      subject: "We Miss You — Come Back to RealtorDesk AI 🏡",
      html: buildEmail(
        "We Miss You! 🏡",
        `<p style="font-size:16px;color:#374151;line-height:1.6;">Hi ${name},</p>
        <p style="font-size:16px;color:#374151;line-height:1.6;">It's been a while since you've logged into RealtorDesk AI. Here's what's new:</p>
        <ul style="font-size:16px;color:#374151;line-height:2;">
          <li>🆕 Bilingual (EN/FR) CASL-compliant email sequences</li>
          <li>🆕 Improved lead-score explainer with behavioural signals</li>
          <li>🆕 Faster chatbot response times</li>
        </ul>
        <p style="font-size:16px;color:#374151;line-height:1.6;">Your data is still safe and waiting for you.</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${APP_URL}/dashboard" style="background:#6366f1;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">Log Back In →</a>
        </div>`,
        caslFooter
      ),
    },
  };

  return templates[eventType] || null;
}

function buildEmail(heading: string, content: string, caslFooter = ""): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
<tr><td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:30px;text-align:center;">
<h1 style="color:#ffffff;font-size:24px;margin:0;">${heading}</h1>
</td></tr>
<tr><td style="padding:30px;">
${content}
<p style="font-size:14px;color:#6b7280;margin-top:30px;">— The RealtorDesk AI Team 🇨🇦</p>
</td></tr>
<tr><td style="background:#f9fafb;padding:20px 30px;text-align:center;">
<p style="font-size:12px;color:#9ca3af;margin:0;">RealtorDesk AI — Built for Canadian Real Estate Agents</p>
</td></tr>
<tr><td>${caslFooter}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

/** Every eventType send-lifecycle-email accepts; one template each. */
export const LIFECYCLE_EVENTS = ["onboarding_step1", "trial_ending", "payment_success", "payment_failed", "winback"] as const;
