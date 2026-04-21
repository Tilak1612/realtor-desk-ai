import { useState } from "react";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { MarketingLayout } from "@/components/rd/marketing/MarketingLayout";
import { Eyebrow } from "@/components/rd/marketing/Eyebrow";
import { RDButton, RDBadge, IconArrow, IconCheck } from "@/components/rd";
import { cn } from "@/lib/utils";

// /pricing — Pricing page per rd-marketing.jsx Artboard_Pricing.
// Prices are the canonical Stripe numbers (Option B per product decision).
// Each plan carries both monthly + yearly amounts matching the live
// Stripe price IDs; the BillingToggle swaps between them. When backend
// wiring lands, the checkout buttons forward the corresponding priceId
// to the create-checkout edge function.

type BillingCycle = "monthly" | "annual";

interface Plan {
  name: string;
  tag: string;
  /** Monthly amount in CAD, or "Custom" for the talk-to-sales tier. */
  priceMonthly: number | "Custom";
  /** Yearly amount in CAD, or "Custom". Used when the billing toggle is Annual. */
  priceYearly: number | "Custom";
  /** Savings label shown under annual price, e.g. "Save $789/yr vs monthly". */
  annualSavingsLabel?: string;
  /** Stripe price IDs so backend wiring can forward the right one.
   *  Kept in sync with src/contexts/SubscriptionContext.tsx SUBSCRIPTION_PRODUCTS. */
  stripe?: { monthly: string; yearly: string };
  desc: string;
  cta: { label: string; variant: "primary" | "terra" | "outline" };
  features: string[];
  featured?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Solo",
    tag: "For the single agent",
    priceMonthly: 149,
    priceYearly: 999,
    annualSavingsLabel: "Save $789 vs monthly",
    stripe: {
      monthly: "price_1SXpyiS23MQcIdnrAphs809v",
      yearly: "price_1SXpzKS23MQcIdnrfH2rHhow",
    },
    desc: "Everything you need to stop losing leads at 2 a.m.",
    cta: { label: "Start free trial", variant: "outline" },
    features: [
      "Desk AI chatbot, 500 msgs/mo",
      "Bilingual EN · FR",
      "CREA DDF® feed (1 board)",
      "Lead scoring + pipeline",
      "CASL-compliant email drip",
      "1 user",
    ],
  },
  {
    name: "Team",
    tag: "For 2–10 agents",
    priceMonthly: 299,
    priceYearly: 2997,
    annualSavingsLabel: "Save $591 vs monthly",
    stripe: {
      monthly: "price_1SXpz0S23MQcIdnrrD0UGqa5",
      yearly: "price_1SXpzZS23MQcIdnrVVyUShLT",
    },
    desc: "Shared pipeline, round-robin routing, team reports.",
    cta: { label: "Start free trial", variant: "terra" },
    features: [
      "Everything in Solo, plus —",
      "Unlimited AI messages",
      "CREA DDF® feed (unlimited)",
      "Round-robin lead routing",
      "Team reports & leaderboard",
      "5 users, $15 each after",
    ],
    featured: true,
  },
  {
    name: "Brokerage",
    tag: "For 10+ agents",
    priceMonthly: "Custom",
    priceYearly: "Custom",
    desc: "Multi-tenant, SSO, dedicated CSM, FINTRAC tooling.",
    cta: { label: "Talk to sales", variant: "primary" },
    features: [
      "Everything in Team, plus —",
      "SAML SSO + Azure AD",
      "FINTRAC & RECO workflows",
      "Custom DDF mappings",
      "Dedicated Canadian CSM",
      "99.95% uptime SLA",
    ],
  },
];

const MATRIX: {
  label: string;
  rows: { f: string; solo: boolean | string; team: boolean | string; bk: boolean | string }[];
}[] = [
  {
    label: "AI & automation",
    rows: [
      { f: "Desk AI chatbot (msgs/mo)", solo: "500", team: "Unlimited", bk: "Unlimited" },
      { f: "Bilingual EN · FR", solo: true, team: true, bk: true },
      { f: "Custom voice training", solo: false, team: true, bk: true },
      { f: "AI lead scoring", solo: true, team: true, bk: true },
    ],
  },
  {
    label: "Integrations",
    rows: [
      { f: "CREA DDF® boards", solo: "1", team: "Unlimited", bk: "Unlimited + custom" },
      { f: "Stripe / Twilio / Resend", solo: true, team: true, bk: true },
      { f: "SAML SSO", solo: false, team: false, bk: true },
    ],
  },
  {
    label: "Compliance · Canada",
    rows: [
      { f: "PIPEDA hosting (Canada)", solo: true, team: true, bk: true },
      { f: "CASL email auto-footer", solo: true, team: true, bk: true },
      { f: "FINTRAC workflows", solo: false, team: false, bk: true },
    ],
  },
];

export default function Pricing() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  return (
    <MarketingLayout>
      <SEO
        title="Pricing — RealtorDesk AI"
        description="One price. Every feature. Bilingual, PIPEDA-native, CREA DDF-ready. CAD pricing, 14-day trial, no credit card."
        canonicalUrl="https://www.realtordesk.ai/pricing"
      />

      {/* Hero */}
      <section className="px-8 md:px-14 pt-20 pb-10 text-center">
        <Eyebrow className="mx-auto">Pricing in CAD</Eyebrow>
        <h1 className="mt-3.5 text-[44px] md:text-[64px] font-semibold tracking-[-0.025em] leading-[1.05]">
          One price. <span className="font-rd-serif italic font-normal">Every</span> feature.
        </h1>
        <p className="text-lg text-rd-ink-600 max-w-[600px] mx-auto mt-5 leading-[1.55]">
          No AI quotas on Team or Brokerage. No "growth" tier that hides the integrations. 14-day
          trial, no credit card.
        </p>
        <BillingToggle cycle={cycle} onChange={setCycle} />
      </section>

      {/* Plans */}
      <section className="px-8 md:px-14 pb-14">
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((p) => (
            <PricingPlan key={p.name} plan={p} cycle={cycle} />
          ))}
        </div>
      </section>

      {/* Tax / parity disclaimer */}
      <p className="px-8 md:px-14 text-center text-[13px] text-rd-ink-500 max-w-[900px] mx-auto pb-16">
        Prices shown in CAD. GST/HST applied at checkout based on your billing province. The
        amount on this page matches what you will see on Stripe's secure checkout.
      </p>

      {/* Feature matrix */}
      <section className="px-8 md:px-14 py-[100px] bg-white border-t border-rd-line">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-[28px] md:text-[36px] font-semibold tracking-[-0.02em] text-center mb-10">
            Compare every feature
          </h2>
          <FeatureMatrix />
        </div>
      </section>
    </MarketingLayout>
  );
}

/* ────────────────────────────────────────────────────────── */

function BillingToggle({
  cycle,
  onChange,
}: {
  cycle: BillingCycle;
  onChange: (v: BillingCycle) => void;
}) {
  return (
    <div className="inline-flex mt-9 p-1 bg-white border border-rd-line rounded-rd-pill">
      <button
        type="button"
        onClick={() => onChange("monthly")}
        className={cn(
          "px-5 py-2 text-[13px] font-semibold rounded-rd-pill transition-colors",
          cycle === "monthly" ? "bg-rd-navy-800 text-white" : "bg-transparent text-rd-ink-600"
        )}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onChange("annual")}
        className={cn(
          "px-5 py-2 text-[13px] font-semibold rounded-rd-pill transition-colors",
          cycle === "annual" ? "bg-rd-navy-800 text-white" : "bg-transparent text-rd-ink-600"
        )}
      >
        Annual · save up to $789/yr
      </button>
    </div>
  );
}

function PricingPlan({ plan, cycle }: { plan: Plan; cycle: BillingCycle }) {
  const displayPrice = cycle === "annual" ? plan.priceYearly : plan.priceMonthly;
  const unitLabel = cycle === "annual" ? "/yr" : "/mo";
  // Show the per-month breakdown under the yearly number for the Solo plan so
  // the annual saving is legible at a glance. Tiny rounding note matters less
  // than keeping the big number clearly the annual amount.
  const perMonthWhenYearly =
    cycle === "annual" && typeof plan.priceYearly === "number"
      ? `CAD · $${(plan.priceYearly / 12).toLocaleString("en-CA", {
          maximumFractionDigits: 0,
        })}/mo effective`
      : "CAD · billed " + (cycle === "annual" ? "yearly" : "monthly");

  const featured = !!plan.featured;
  return (
    <div
      className={cn(
        "relative rounded-rd-xl p-8",
        featured
          ? "bg-rd-navy-800 text-white border border-rd-navy-700 shadow-rd-lg -translate-y-2"
          : "bg-white text-rd-ink-900 border border-rd-line shadow-rd-sm"
      )}
    >
      {featured && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <RDBadge tone="terra">Most agents pick this</RDBadge>
        </div>
      )}

      <div
        className={cn(
          "text-[11px] font-bold uppercase tracking-[0.08em]",
          featured ? "text-rd-terra-400" : "text-rd-terra-700"
        )}
      >
        {plan.tag}
      </div>
      <h3 className="text-[28px] font-semibold tracking-[-0.01em] mt-1.5">{plan.name}</h3>

      <div className="flex items-baseline gap-1.5 mt-6">
        <span className="text-[52px] font-semibold tracking-[-0.025em]">
          {typeof displayPrice === "number"
            ? `$${displayPrice.toLocaleString("en-CA")}`
            : displayPrice}
        </span>
        {typeof displayPrice === "number" && (
          <span className={cn("text-sm", featured ? "text-white/60" : "text-rd-ink-500")}>
            {unitLabel}
          </span>
        )}
      </div>
      <div
        className={cn(
          "text-xs mt-1 tracking-[0.02em]",
          featured ? "text-white/50" : "text-rd-ink-500"
        )}
      >
        {typeof displayPrice === "number" ? perMonthWhenYearly : "Annual · CAD"}
      </div>

      {cycle === "annual" && plan.annualSavingsLabel && (
        <div
          className={cn(
            "text-xs mt-2 font-semibold",
            featured ? "text-rd-terra-400" : "text-rd-success"
          )}
        >
          {plan.annualSavingsLabel}
        </div>
      )}

      <p className={cn("text-sm mt-4 leading-[1.5]", featured ? "text-white/70" : "text-rd-ink-600")}>
        {plan.desc}
      </p>

      <Link to={plan.cta.label === "Talk to sales" ? "/demo" : "/signup"} className="block mt-6">
        <RDButton variant={plan.cta.variant} size="lg" trailingIcon={<IconArrow />} full>
          {plan.cta.label}
        </RDButton>
      </Link>

      <ul className="mt-7 flex flex-col gap-3">
        {plan.features.map((f) => {
          const isHead = f.startsWith("Everything");
          return (
            <li
              key={f}
              className={cn(
                "text-[13px] flex items-start gap-2.5",
                featured ? "text-white/85" : "text-rd-ink-700",
                isHead && "font-bold"
              )}
            >
              {!isHead && (
                <IconCheck
                  className={cn(
                    "flex-shrink-0 mt-1",
                    featured ? "text-rd-terra-400" : "text-rd-success"
                  )}
                />
              )}
              <span>{f}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function FeatureMatrix() {
  return (
    <div className="bg-white border border-rd-line rounded-rd-lg overflow-hidden">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] px-6 py-[18px] bg-rd-ink-50 border-b border-rd-line text-xs font-bold uppercase tracking-[0.06em] text-rd-ink-600">
        <div />
        <div className="text-center">Solo</div>
        <div className="text-center text-rd-navy-800">Team</div>
        <div className="text-center">Brokerage</div>
      </div>
      {MATRIX.map((section, si) => (
        <Fragment key={section.label}>
          <div
            className={cn(
              "px-6 py-3 bg-rd-ink-50 text-[11px] font-bold uppercase tracking-[0.08em] text-rd-ink-500",
              si === 0 ? "" : "border-t border-rd-line"
            )}
          >
            {section.label}
          </div>
          {section.rows.map((r) => (
            <div
              key={r.f}
              className="grid grid-cols-[2fr_1fr_1fr_1fr] px-6 py-4 border-t border-rd-line items-center text-sm"
            >
              <div className="text-rd-ink-900 font-medium">{r.f}</div>
              <Cell v={r.solo} />
              <Cell v={r.team} featured />
              <Cell v={r.bk} />
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  );
}

function Cell({ v, featured }: { v: boolean | string; featured?: boolean }) {
  return (
    <div
      className={cn(
        "text-center text-[13px]",
        featured ? "text-rd-navy-800 font-semibold" : "text-rd-ink-700 font-medium"
      )}
    >
      {v === true ? (
        <IconCheck className="text-rd-success inline" />
      ) : v === false ? (
        <span className="text-rd-ink-300">—</span>
      ) : (
        v
      )}
    </div>
  );
}
