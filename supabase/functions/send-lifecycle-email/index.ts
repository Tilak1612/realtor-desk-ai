import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_EMAIL = "RealtorDesk AI <no-reply@realtordesk.ai>";
const APP_URL = "https://realtordesk.ai";

interface EmailTemplate {
  subject: string;
  html: string;
}

function getTemplate(eventType: string, data: Record<string, any> = {}): EmailTemplate | null {
  const name = data.firstName || data.name || "there";
  
  const templates: Record<string, EmailTemplate> = {
    realtordesk_onboarding_welcome: {
      subject: `Welcome to RealtorDesk AI, ${name} — your 24/7 AI chatbot is live and ready`,
      html: buildEmail(`Welcome to RealtorDesk AI, ${name}!`, `
        <p>Welcome to RealtorDesk AI — rated #1 for Canadian agents, 85% less than BoldTrail.</p>
        <p>Two things are live right now:</p>
        <ul>
          <li>Your 24/7 AI chatbot — capturing leads even while you sleep.</li>
          <li>Your CRM — CREA DDF® native, bilingual EN/FR, PIPEDA compliant.</li>
        </ul>
        <div style="text-align:center;margin:30px 0;">
          <a href="${APP_URL}/dashboard" style="background:#1e3a5f;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">Add My First Lead</a>
        </div>
        <p>Plans start at $79/month CAD — 14-day free trial active.</p>
      `),
    },
    realtordesk_onboarding_quickwin: {
      subject: `${name}, your AI chatbot answered 0 leads last night. Here's why.`,
      html: buildEmail(`Get Your Pipeline Running`, `
        <p>Hi ${name}, your chatbot is active but has no leads yet. Fix in under 5 minutes:</p>
        <ol>
          <li>Manual add — 5 hottest leads, 30 seconds each</li>
          <li>CSV import — export from old CRM, 2 minutes</li>
          <li>Live capture — embed lead form on website</li>
        </ol>
        <div style="text-align:center;margin:30px 0;">
          <a href="${APP_URL}/leads/import" style="background:#1e3a5f;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">Add My Leads + Configure My Chatbot</a>
        </div>
      `),
    },
    realtordesk_onboarding_checklist: {
      subject: "5 RealtorDesk AI features that top Canadian agents activate in week one",
      html: buildEmail(`Your Setup Checklist`, `
        <p>Hi ${name}, here is your week one checklist:</p>
        <ul>
          <li>✅ Add or import your leads</li>
          <li>⬜ Connect CREA DDF® — pulls live Canadian MLS data</li>
          <li>⬜ Set chatbot language — EN, FR, or bilingual</li>
          <li>⬜ Link virtual tour provider — Matterport, iGuide</li>
          <li>⬜ Enable predictive lead scoring</li>
        </ul>
        <div style="text-align:center;margin:30px 0;">
          <a href="${APP_URL}/settings/checklist" style="background:#1e3a5f;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">Complete My Setup</a>
        </div>
      `),
    },
    realtordesk_onboarding_trialnudge: {
      subject: "$79/month vs a missed lead. The math is easy.",
      html: buildEmail(`Trial Ending Soon`, `
        <p>Hi ${name}, your trial ends on ${data.trial_end_date || 'soon'}.</p>
        <p>When it expires, your AI chatbot goes offline and access to leads and CREA DDF® sync pauses.</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${APP_URL}/billing" style="background:#1e3a5f;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">Upgrade RealtorDesk AI — $79/month CAD</a>
        </div>
      `),
    },
    realtordesk_activation_celebrate: {
      subject: `First lead in, ${name} — your AI chatbot is now working for you 24/7`,
      html: buildEmail(`First Lead Captured!`, `
        <p>Hi ${name}, your first lead is in! Here are two things to do now:</p>
        <ol>
          <li>Enable predictive lead scoring in Settings</li>
          <li>Set a follow-up reminder for this lead today</li>
        </ol>
        <div style="text-align:center;margin:30px 0;">
          <a href="${APP_URL}/dashboard" style="background:#1e3a5f;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">Activate Lead Scoring</a>
        </div>
      `),
    }
  };
  
  return templates[eventType] || null;
}

function buildEmail(heading: string, content: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f2f4f8; background-color: #f2f4f8;">
      <div style="background-color: #ffffff; padding: 40px; border-radius: 8px;">
        <h2 style="color: #1e3a5f; border-bottom: 2px solid #8aabcc; padding-bottom: 10px;">${heading}</h2>
        <div style="color: #333; line-height: 1.6; font-size: 16px;">
          ${content}
        </div>
        <p style="margin-top: 40px; color: #666; font-size: 14px;">
          — The RealtorDesk AI team<br>
          <a href="${APP_URL}" style="color: #1e3a5f;">realtordesk.ai</a>
        </p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
        Built for Canadian Real Estate Agents | PIPEDA Compliant
      </div>
    </div>
  `;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body = await req.json();
    const { eventType, userId, recipientEmail, data: templateData } = body;

    const template = getTemplate(eventType, templateData);
    if (!template) {
      return new Response(JSON.stringify({ error: "Template not found" }), { status: 404 });
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const emailRes = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: { "Authorization": \`Bearer \${resendApiKey}\`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [recipientEmail],
        subject: template.subject,
        html: template.html,
      }),
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "An error occurred" }), { status: 500 });
  }
};

serve(handler);
