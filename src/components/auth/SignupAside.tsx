import { useTranslation } from "react-i18next";
import { Check, ShieldCheck, Lock, Server, Clock, CreditCard, XCircle } from "lucide-react";
import { TRIAL_PERIOD_DAYS } from "@/config/billing";

// Left column for /signup on >=lg. Answers "why hand over a card" before the
// form asks for five fields.
//
// EVIDENCE RULE: every bullet below maps to shipped, verified behaviour —
// CREA DDF lead capture, the automation runner, the contacts/deals pipeline,
// and AI drafting in the inbox. The trust card lists only what the codebase
// and policies actually support: PIPEDA (policy page + consent capture),
// Canadian hosting (Supabase ca-central), TLS in transit + encryption at rest
// (Supabase default), and per-account isolation (RLS, verified by live
// cross-tenant probes).
//
// Deliberately ABSENT: customer counts, brokerage logos, testimonials, uptime
// figures and certifications (SOC 2 / ISO). None is verifiable from this
// codebase, so per the brief they are omitted rather than softened.

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/20"
        aria-hidden="true"
      >
        <Check className="h-3 w-3 text-violet-200" />
      </span>
      <span className="text-sm leading-relaxed text-gray-200">{children}</span>
    </li>
  );
}

function Reassure({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-xs font-medium text-gray-200">
      <span className="text-violet-300" aria-hidden="true">{icon}</span>
      {children}
    </li>
  );
}

export function SignupAside() {
  const { t } = useTranslation();

  return (
    <div className="max-w-lg">
      <h2 className="text-3xl font-bold leading-tight tracking-tight text-white xl:text-4xl">
        {t(
          "auth.signup.aside.headline",
          "The Canadian real estate CRM that works your leads for you.",
        )}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-gray-200">
        {t(
          "auth.signup.aside.sub",
          "Desk answers new enquiries, keeps follow-up moving, and shows you the pipeline — in English and French.",
        )}
      </p>

      <ul className="mt-8 space-y-3.5">
        <Bullet>
          {t(
            "auth.signup.aside.b1",
            "Capture leads from your CREA DDF feed, website forms, and ads in one inbox.",
          )}
        </Bullet>
        <Bullet>
          {t(
            "auth.signup.aside.b2",
            "Automated follow-up sequences that keep working after you close the laptop.",
          )}
        </Bullet>
        <Bullet>
          {t(
            "auth.signup.aside.b3",
            "A contact and deal pipeline built for showings, offers, and closings.",
          )}
        </Bullet>
        <Bullet>
          {t(
            "auth.signup.aside.b4",
            "AI drafts replies in your lead's language so nobody waits hours for an answer.",
          )}
        </Bullet>
      </ul>

      {/* Reassurance row */}
      <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2.5">
        <Reassure icon={<Clock className="h-3.5 w-3.5" />}>
          {t("auth.signup.aside.r1", "{{days}}-day free trial", { days: TRIAL_PERIOD_DAYS })}
        </Reassure>
        <Reassure icon={<CreditCard className="h-3.5 w-3.5" />}>
          {t("auth.signup.aside.r2", "No charge today")}
        </Reassure>
        <Reassure icon={<XCircle className="h-3.5 w-3.5" />}>
          {t("auth.signup.aside.r3", "Cancel before day {{days}}", { days: TRIAL_PERIOD_DAYS })}
        </Reassure>
        <Reassure icon={<Clock className="h-3.5 w-3.5" />}>
          {t("auth.signup.aside.r4", "About 2 minutes to set up")}
        </Reassure>
      </ul>

      {/* Trust card */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-gray-300">
          {t("auth.signup.aside.trustTitle", "Your data")}
        </h3>
        <ul className="mt-3.5 space-y-2.5">
          <li className="flex items-start gap-2.5 text-sm text-gray-200">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300" aria-hidden="true" />
            {t("auth.signup.aside.t1", "PIPEDA-compliant handling, with consent recorded at signup.")}
          </li>
          <li className="flex items-start gap-2.5 text-sm text-gray-200">
            <Server className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300" aria-hidden="true" />
            {t("auth.signup.aside.t2", "Stored on Canadian servers.")}
          </li>
          <li className="flex items-start gap-2.5 text-sm text-gray-200">
            <Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300" aria-hidden="true" />
            {t("auth.signup.aside.t3", "256-bit SSL in transit and encrypted at rest.")}
          </li>
          <li className="flex items-start gap-2.5 text-sm text-gray-200">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300" aria-hidden="true" />
            {t("auth.signup.aside.t4", "Your workspace is isolated — no other account can read your data.")}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SignupAside;
