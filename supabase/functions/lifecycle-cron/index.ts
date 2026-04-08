import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

/**
 * Lifecycle Cron — Automated User Retention Engine
 *
 * Run via pg_cron or external scheduler (e.g. daily at 10 AM EST).
 * Checks all trial users and fires the appropriate email based on their
 * signup age and engagement status.
 *
 * Sequences:
 *   Day 0:  Welcome (handled by send-welcome-email, not this cron)
 *   Day 3:  Activation check — nudge if no contacts/leads imported
 *   Day 7:  Proof of Value — weekly AI impact report
 *   Day 12: Trial ending countdown (2 days left)
 *   Day 14: Final trial expiry warning (0 days)
 *
 * Bilingual: Reads profiles.preferred_language for EN/FR templates.
 */

const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_EMAIL = "RealtorDesk AI <support@realtordesk.ai>";
const APP_URL = "https://www.realtordesk.ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[LIFECYCLE-CRON] ${step}${detailsStr}`);
};

// ─── Bilingual Templates ─────────────────────────────────────────────

interface EmailTemplate {
  subject: string;
  html: string;
}

function buildEmail(heading: string, content: string, lang: string): string {
  const footer = lang === "fr"
    ? "RealtorDesk AI — Conçu pour les agents immobiliers canadiens"
    : "RealtorDesk AI — Built for Canadian Real Estate Agents";
  const team = lang === "fr" ? "L'équipe RealtorDesk AI" : "The RealtorDesk AI Team";

  return `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
<tr><td style="background:linear-gradient(135deg,#ea580c,#f97316);padding:30px;text-align:center;">
<h1 style="color:#ffffff;font-size:24px;margin:0;">${heading}</h1>
</td></tr>
<tr><td style="padding:30px;">
${content}
<p style="font-size:14px;color:#6b7280;margin-top:30px;">— ${team} 🇨🇦</p>
</td></tr>
<tr><td style="background:#f9fafb;padding:20px 30px;text-align:center;">
<p style="font-size:12px;color:#9ca3af;margin:0;">${footer}</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

const CTA_STYLE = "background:#ea580c;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;";

function getDay3Template(name: string, lang: string): EmailTemplate {
  if (lang === "fr") {
    return {
      subject: "Activez votre IA — Guide rapide RealtorDesk",
      html: buildEmail("Activez Votre IA 🤖", `
        <p style="font-size:16px;color:#374151;line-height:1.6;">Bonjour ${name},</p>
        <p style="font-size:16px;color:#374151;line-height:1.6;">Nous remarquons que vous n'avez pas encore importé de contacts. Voici comment activer votre IA en 2 minutes :</p>
        <ol style="font-size:16px;color:#374151;line-height:2;">
          <li>Importez vos contacts depuis Realtor.ca</li>
          <li>L'IA analyse et score automatiquement chaque prospect</li>
          <li>Recevez vos recommandations d'appels prioritaires</li>
        </ol>
        <div style="text-align:center;margin:30px 0;">
          <a href="${APP_URL}/contacts" style="${CTA_STYLE}">Importer mes contacts →</a>
        </div>`, lang),
    };
  }
  return {
    subject: "Activate Your AI — RealtorDesk Quick Start",
    html: buildEmail("Activate Your AI 🤖", `
      <p style="font-size:16px;color:#374151;line-height:1.6;">Hi ${name},</p>
      <p style="font-size:16px;color:#374151;line-height:1.6;">We noticed you haven't imported any contacts yet. Here's how to activate your AI in 2 minutes:</p>
      <ol style="font-size:16px;color:#374151;line-height:2;">
        <li>Import contacts from Realtor.ca using our built-in importer</li>
        <li>AI automatically scores and prioritizes every lead</li>
        <li>Get your personalized call list for today</li>
      </ol>
      <div style="text-align:center;margin:30px 0;">
        <a href="${APP_URL}/contacts" style="${CTA_STYLE}">Import My Contacts →</a>
      </div>`, lang),
  };
}

function getDay7Template(name: string, lang: string, stats: { contacts: number; deals: number; aiChats: number }): EmailTemplate {
  if (lang === "fr") {
    return {
      subject: `Votre rapport IA de la semaine — RealtorDesk`,
      html: buildEmail("Votre Impact IA Cette Semaine 📊", `
        <p style="font-size:16px;color:#374151;line-height:1.6;">Bonjour ${name},</p>
        <p style="font-size:16px;color:#374151;line-height:1.6;">Voici un aperçu de votre première semaine avec RealtorDesk AI :</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <tr><td style="padding:12px;border-bottom:1px solid #e5e7eb;font-size:16px;">📇 Contacts gérés</td><td style="padding:12px;border-bottom:1px solid #e5e7eb;font-size:20px;font-weight:bold;text-align:right;">${stats.contacts}</td></tr>
          <tr><td style="padding:12px;border-bottom:1px solid #e5e7eb;font-size:16px;">🏠 Transactions actives</td><td style="padding:12px;border-bottom:1px solid #e5e7eb;font-size:20px;font-weight:bold;text-align:right;">${stats.deals}</td></tr>
          <tr><td style="padding:12px;font-size:16px;">🤖 Conversations IA</td><td style="padding:12px;font-size:20px;font-weight:bold;text-align:right;">${stats.aiChats}</td></tr>
        </table>
        <div style="text-align:center;margin:30px 0;">
          <a href="${APP_URL}/dashboard" style="${CTA_STYLE}">Voir mon tableau de bord →</a>
        </div>`, lang),
    };
  }
  return {
    subject: `Your Weekly AI Impact Report — RealtorDesk`,
    html: buildEmail("Your AI Impact This Week 📊", `
      <p style="font-size:16px;color:#374151;line-height:1.6;">Hi ${name},</p>
      <p style="font-size:16px;color:#374151;line-height:1.6;">Here's a snapshot of your first week with RealtorDesk AI:</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <tr><td style="padding:12px;border-bottom:1px solid #e5e7eb;font-size:16px;">📇 Contacts managed</td><td style="padding:12px;border-bottom:1px solid #e5e7eb;font-size:20px;font-weight:bold;text-align:right;">${stats.contacts}</td></tr>
        <tr><td style="padding:12px;border-bottom:1px solid #e5e7eb;font-size:16px;">🏠 Active deals</td><td style="padding:12px;border-bottom:1px solid #e5e7eb;font-size:20px;font-weight:bold;text-align:right;">${stats.deals}</td></tr>
        <tr><td style="padding:12px;font-size:16px;">🤖 AI conversations</td><td style="padding:12px;font-size:20px;font-weight:bold;text-align:right;">${stats.aiChats}</td></tr>
      </table>
      <div style="text-align:center;margin:30px 0;">
        <a href="${APP_URL}/dashboard" style="${CTA_STYLE}">View My Dashboard →</a>
      </div>`, lang),
  };
}

function getTrialEndingTemplate(name: string, lang: string, daysLeft: number): EmailTemplate {
  if (lang === "fr") {
    return {
      subject: daysLeft === 0
        ? "Votre essai RealtorDesk AI expire aujourd'hui"
        : `Plus que ${daysLeft} jour${daysLeft > 1 ? "s" : ""} d'essai — RealtorDesk AI`,
      html: buildEmail(
        daysLeft === 0 ? "Dernier Jour d'Essai ⏰" : `${daysLeft} Jour${daysLeft > 1 ? "s" : ""} Restant${daysLeft > 1 ? "s" : ""} ⏰`, `
        <p style="font-size:16px;color:#374151;line-height:1.6;">Bonjour ${name},</p>
        <p style="font-size:16px;color:#374151;line-height:1.6;">${daysLeft === 0
          ? "Votre essai gratuit de 14 jours se termine <strong>aujourd'hui</strong>."
          : `Votre essai gratuit se termine dans <strong>${daysLeft} jour${daysLeft > 1 ? "s" : ""}</strong>.`
        }</p>
        <p style="font-size:16px;color:#374151;line-height:1.6;">Ne perdez pas l'accès à :</p>
        <ul style="font-size:16px;color:#374151;line-height:2;">
          <li>🤖 Score IA des prospects</li>
          <li>💬 Chatbot 24/7 bilingue</li>
          <li>📊 Tableau de bord intelligent</li>
        </ul>
        <div style="text-align:center;margin:30px 0;">
          <a href="${APP_URL}/billing" style="${CTA_STYLE}">S'abonner maintenant →</a>
        </div>
        <p style="font-size:14px;color:#6b7280;">À partir de seulement 149$ CAD/mois.</p>`, lang),
    };
  }
  return {
    subject: daysLeft === 0
      ? "Your RealtorDesk AI trial expires today"
      : `${daysLeft} day${daysLeft > 1 ? "s" : ""} left on your trial — RealtorDesk AI`,
    html: buildEmail(
      daysLeft === 0 ? "Last Day of Your Trial ⏰" : `${daysLeft} Day${daysLeft > 1 ? "s" : ""} Left ⏰`, `
      <p style="font-size:16px;color:#374151;line-height:1.6;">Hi ${name},</p>
      <p style="font-size:16px;color:#374151;line-height:1.6;">${daysLeft === 0
        ? "Your 14-day free trial ends <strong>today</strong>."
        : `Your free trial ends in <strong>${daysLeft} day${daysLeft > 1 ? "s" : ""}</strong>.`
      }</p>
      <p style="font-size:16px;color:#374151;line-height:1.6;">Don't lose access to:</p>
      <ul style="font-size:16px;color:#374151;line-height:2;">
        <li>🤖 AI-powered lead scoring</li>
        <li>💬 24/7 bilingual chatbot</li>
        <li>📊 Smart CRM dashboard</li>
      </ul>
      <div style="text-align:center;margin:30px 0;">
        <a href="${APP_URL}/billing" style="${CTA_STYLE}">Subscribe Now →</a>
      </div>
      <p style="font-size:14px;color:#6b7280;">Plans start at just $149 CAD/month.</p>`, lang),
  };
}

// ─── Main Handler ─────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Cron started");

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      logStep("RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get all trial users
    const { data: trialUsers, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, created_at, trial_ends_at, onboarding_completed, first_contact_added_at, preferred_language")
      .eq("subscription_status", "trial");

    if (error) {
      logStep("Failed to fetch trial users", { error: error.message });
      return new Response(JSON.stringify({ error: "Database error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    logStep("Found trial users", { count: trialUsers?.length ?? 0 });

    const results = { sent: 0, skipped: 0, errors: 0 };

    for (const user of trialUsers || []) {
      const daysSinceSignup = Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24));
      const daysUntilExpiry = user.trial_ends_at
        ? Math.ceil((new Date(user.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null;
      const lang = user.preferred_language || "en";
      const name = user.full_name?.split(" ")[0] || (lang === "fr" ? "cher agent" : "there");

      let eventType: string | null = null;
      let template: EmailTemplate | null = null;

      // Day 3: Activation check
      if (daysSinceSignup >= 3 && daysSinceSignup < 5 && !user.first_contact_added_at) {
        eventType = "lifecycle_day3_activation";
        template = getDay3Template(name, lang);
      }
      // Day 7: Proof of value
      else if (daysSinceSignup >= 7 && daysSinceSignup < 9) {
        eventType = "lifecycle_day7_report";
        // Fetch user stats
        const [contactsRes, dealsRes, chatsRes] = await Promise.all([
          supabase.from("contacts").select("id", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("deals").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "active"),
          supabase.from("ai_conversations").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        ]);
        template = getDay7Template(name, lang, {
          contacts: contactsRes.count ?? 0,
          deals: dealsRes.count ?? 0,
          aiChats: chatsRes.count ?? 0,
        });
      }
      // Day 12: Trial ending (2 days left)
      else if (daysUntilExpiry !== null && daysUntilExpiry === 2) {
        eventType = "lifecycle_day12_trial_ending";
        template = getTrialEndingTemplate(name, lang, 2);
      }
      // Day 14: Trial expires today
      else if (daysUntilExpiry !== null && daysUntilExpiry === 0) {
        eventType = "lifecycle_day14_trial_expired";
        template = getTrialEndingTemplate(name, lang, 0);
      }

      if (!eventType || !template) {
        results.skipped++;
        continue;
      }

      // Dedup: check if already sent
      const { data: existing } = await supabase
        .from("email_events")
        .select("id")
        .eq("user_id", user.id)
        .eq("event_type", eventType)
        .limit(1);

      if (existing && existing.length > 0) {
        results.skipped++;
        continue;
      }

      // Send via Resend
      try {
        const emailRes = await fetch(RESEND_API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: [user.email],
            subject: template.subject,
            html: template.html,
          }),
        });

        if (!emailRes.ok) {
          logStep("Resend error", { userId: user.id, event: eventType, status: emailRes.status });
          results.errors++;
          continue;
        }

        // Log the event (prevents re-sending)
        await supabase.from("email_events").insert({
          user_id: user.id,
          event_type: eventType,
          recipient_email: user.email,
          metadata: { day: daysSinceSignup, lang },
        });

        results.sent++;
        logStep("Email sent", { userId: user.id, event: eventType, lang });
      } catch (sendError) {
        logStep("Send error", { userId: user.id, error: sendError instanceof Error ? sendError.message : String(sendError) });
        results.errors++;
      }
    }

    logStep("Cron complete", results);
    return new Response(JSON.stringify({ success: true, ...results }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[LIFECYCLE-CRON] Error:", error instanceof Error ? error.message : String(error));
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
