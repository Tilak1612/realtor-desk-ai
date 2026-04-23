import { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";
import { MarketingLayout } from "@/components/rd/marketing/MarketingLayout";
import { Eyebrow } from "@/components/rd/marketing/Eyebrow";
import { RDButton, RDBadge, IconArrow, IconCheck } from "@/components/rd";
import { cn } from "@/lib/utils";
import { normalizeLocale, type SupportedLocale } from "@/lib/i18n/format";

// /pricing — Pricing page per rd-marketing.jsx Artboard_Pricing.
// Prices are the canonical Stripe numbers (Option B per product decision).
// Stripe price IDs + numeric amounts live in this file; all copy flows
// through the `pricingRd.*` i18n namespace so the FR toggle swaps the
// entire page (previously 100% hardcoded EN per 2026-04 audit).

type BillingCycle = "monthly" | "annual";
type TFn = (key: string, opts?: Record<string, unknown>) => string;

interface PlanData {
  /** Stable id, used for t() lookups and Stripe routing. */
  id: "solo" | "team" | "brokerage";
  priceMonthly: number | "custom";
  priceYearly: number | "custom";
  stripe?: { monthly: string; yearly: string };
  cta: "start" | "talkSales";
  ctaVariant: "primary" | "terra" | "outline";
  featureKeys: string[];
  featured?: boolean;
}

const PLANS: PlanData[] = [
  {
    id: "solo",
    priceMonthly: 149,
    priceYearly: 999,
    stripe: {
      monthly: "price_1SXpyiS23MQcIdnrAphs809v",
      yearly: "price_1SXpzKS23MQcIdnrfH2rHhow",
    },
    cta: "start",
    ctaVariant: "outline",
    featureKeys: [
      "pricingRd.featSoloDesk",
      "pricingRd.featSoloBilingual",
      "pricingRd.featSoloDdf1",
      "pricingRd.featSoloScoring",
      "pricingRd.featSoloCasl",
      "pricingRd.featSoloUser",
    ],
  },
  {
    id: "team",
    priceMonthly: 299,
    priceYearly: 2997,
    stripe: {
      monthly: "price_1SXpz0S23MQcIdnrrD0UGqa5",
      yearly: "price_1SXpzZS23MQcIdnrVVyUShLT",
    },
    cta: "start",
    ctaVariant: "terra",
    featureKeys: [
      "__team_every", // sentinel resolved to "Everything in Solo, plus —" via t(planFor=solo)
      "pricingRd.featTeamAiUnl",
      "pricingRd.featTeamDdfUnl",
      "pricingRd.featTeamRouting",
      "pricingRd.featTeamReports",
      "pricingRd.featTeamSeats",
    ],
    featured: true,
  },
  {
    id: "brokerage",
    priceMonthly: "custom",
    priceYearly: "custom",
    cta: "talkSales",
    ctaVariant: "primary",
    featureKeys: [
      "__brokerage_every", // sentinel
      "pricingRd.featBrokerageSso",
      "pricingRd.featBrokerageCompliance",
      "pricingRd.featBrokerageDdfCustom",
      "pricingRd.featBrokerageCsm",
      "pricingRd.featBrokerageSla",
    ],
  },
];

export default function Pricing() {
  const { t, i18n } = useTranslation();
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const locale = normalizeLocale(i18n.language);

  return (
    <MarketingLayout>
      <SEO
        title={t("pricingRd.seoTitle")}
        description={t("pricingRd.seoDesc")}
        canonicalUrl="https://www.realtordesk.ai/pricing"
      />

      {/* Hero */}
      <section className="px-8 md:px-14 pt-20 pb-10 text-center">
        <Eyebrow className="mx-auto">{t("pricingRd.eyebrow")}</Eyebrow>
        <h1 className="mt-3.5 text-[44px] md:text-[64px] font-semibold tracking-[-0.025em] leading-[1.05]">
          {t("pricingRd.heading1")}{" "}
          <span className="font-rd-serif italic font-normal">{t("pricingRd.heading2")}</span>{" "}
          {t("pricingRd.heading3")}
        </h1>
        <p className="text-lg text-rd-ink-600 max-w-[600px] mx-auto mt-5 leading-[1.55]">
          {t("pricingRd.subtitle")}
        </p>
        <BillingToggle cycle={cycle} onChange={setCycle} t={t} />
      </section>

      {/* Plans */}
      <section className="px-8 md:px-14 pb-14">
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((p) => (
            <PricingPlan key={p.id} plan={p} cycle={cycle} t={t} locale={locale} />
          ))}
        </div>
      </section>

      <p className="px-8 md:px-14 text-center text-[13px] text-rd-ink-500 max-w-[900px] mx-auto pb-16">
        {t("pricingRd.taxNote")}
      </p>

      {/* Feature matrix */}
      <section className="px-8 md:px-14 py-[100px] bg-white border-t border-rd-line">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-[28px] md:text-[36px] font-semibold tracking-[-0.02em] text-center mb-10">
            {t("pricingRd.compareHeading")}
          </h2>
          <FeatureMatrix t={t} />
        </div>
      </section>
    </MarketingLayout>
  );
}

function BillingToggle({
  cycle,
  onChange,
  t,
}: {
  cycle: BillingCycle;
  onChange: (v: BillingCycle) => void;
  t: TFn;
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
        {t("pricingRd.toggleMonthly")}
      </button>
      <button
        type="button"
        onClick={() => onChange("annual")}
        className={cn(
          "px-5 py-2 text-[13px] font-semibold rounded-rd-pill transition-colors",
          cycle === "annual" ? "bg-rd-navy-800 text-white" : "bg-transparent text-rd-ink-600"
        )}
      >
        {t("pricingRd.toggleAnnual")}
      </button>
    </div>
  );
}

/**
 * Render a monetary amount inline. Keeps the existing large-font split
 * (big number + tiny unit label) while respecting FR decimal comma +
 * `$` after the number.
 */
function renderPrice(amount: number, locale: SupportedLocale): string {
  if (locale === "fr-CA") {
    return amount.toLocaleString("fr-CA", { maximumFractionDigits: 0 }) + " $";
  }
  return "$" + amount.toLocaleString("en-CA", { maximumFractionDigits: 0 });
}

function PricingPlan({
  plan,
  cycle,
  t,
  locale,
}: {
  plan: PlanData;
  cycle: BillingCycle;
  t: TFn;
  locale: SupportedLocale;
}) {
  const name = t(`pricingRd.plan${cap(plan.id)}Name`);
  const tag = t(`pricingRd.plan${cap(plan.id)}Tag`);
  const desc = t(`pricingRd.plan${cap(plan.id)}Desc`);
  const savingsLabel =
    plan.id === "solo" || plan.id === "team"
      ? t(`pricingRd.plan${cap(plan.id)}Savings`)
      : undefined;

  const displayPrice = cycle === "annual" ? plan.priceYearly : plan.priceMonthly;
  const unitLabel = cycle === "annual" ? t("pricingRd.unitYr") : t("pricingRd.unitMo");

  const perMonthWhenYearly =
    cycle === "annual" && typeof plan.priceYearly === "number"
      ? t("pricingRd.perMoEffective", {
          amount: Math.round(plan.priceYearly / 12).toLocaleString(
            locale === "fr-CA" ? "fr-CA" : "en-CA",
            { maximumFractionDigits: 0 },
          ),
        })
      : cycle === "annual"
        ? t("pricingRd.billedYearly")
        : t("pricingRd.billedMonthly");

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
          <RDBadge tone="terra">{t("pricingRd.featuredTag")}</RDBadge>
        </div>
      )}

      <div
        className={cn(
          "text-[11px] font-bold uppercase tracking-[0.08em]",
          featured ? "text-rd-terra-400" : "text-rd-terra-700"
        )}
      >
        {tag}
      </div>
      <h3 className="text-[28px] font-semibold tracking-[-0.01em] mt-1.5">{name}</h3>

      <div className="flex items-baseline gap-1.5 mt-6">
        <span className="text-[52px] font-semibold tracking-[-0.025em]">
          {typeof displayPrice === "number"
            ? renderPrice(displayPrice, locale)
            : t("pricingRd.customLabel")}
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
        {typeof displayPrice === "number" ? perMonthWhenYearly : t("pricingRd.customAnnualLabel")}
      </div>

      {cycle === "annual" && savingsLabel && (
        <div
          className={cn(
            "text-xs mt-2 font-semibold",
            featured ? "text-rd-terra-400" : "text-rd-success"
          )}
        >
          {savingsLabel}
        </div>
      )}

      <p className={cn("text-sm mt-4 leading-[1.5]", featured ? "text-white/70" : "text-rd-ink-600")}>
        {desc}
      </p>

      <Link
        to={plan.cta === "talkSales" ? "/demo" : "/signup"}
        className="block mt-6"
      >
        <RDButton variant={plan.ctaVariant} size="lg" trailingIcon={<IconArrow />} full>
          {plan.cta === "talkSales" ? t("pricingRd.ctaTalkSales") : t("pricingRd.ctaStart")}
        </RDButton>
      </Link>

      <ul className="mt-7 flex flex-col gap-3">
        {plan.featureKeys.map((fk) => {
          const label =
            fk === "__team_every"
              ? t("pricingRd.featEveryIn", { plan: t("pricingRd.planSoloName") })
              : fk === "__brokerage_every"
                ? t("pricingRd.featEveryIn", { plan: t("pricingRd.planTeamName") })
                : t(fk);
          const isHead = fk.startsWith("__");
          return (
            <li
              key={fk}
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
              <span>{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface MatrixRow {
  labelKey: string;
  solo: boolean | string;
  team: boolean | string;
  bk: boolean | string;
}

function FeatureMatrix({ t }: { t: TFn }) {
  const sections: { labelKey: string; rows: MatrixRow[] }[] = [
    {
      labelKey: "pricingRd.matrixSecAi",
      rows: [
        { labelKey: "pricingRd.matrixRowDeskMsgs", solo: "500", team: t("pricingRd.matrixValUnl"), bk: t("pricingRd.matrixValUnl") },
        { labelKey: "pricingRd.matrixRowBilingual", solo: true, team: true, bk: true },
        { labelKey: "pricingRd.matrixRowVoice", solo: false, team: true, bk: true },
        { labelKey: "pricingRd.matrixRowScoring", solo: true, team: true, bk: true },
      ],
    },
    {
      labelKey: "pricingRd.matrixSecIntegrations",
      rows: [
        { labelKey: "pricingRd.matrixRowDdfBoards", solo: "1", team: t("pricingRd.matrixValUnl"), bk: t("pricingRd.matrixValUnlCustom") },
        { labelKey: "pricingRd.matrixRowStack", solo: true, team: true, bk: true },
        { labelKey: "pricingRd.matrixRowSso", solo: false, team: false, bk: true },
      ],
    },
    {
      labelKey: "pricingRd.matrixSecCompliance",
      rows: [
        { labelKey: "pricingRd.matrixRowPipeda", solo: true, team: true, bk: true },
        { labelKey: "pricingRd.matrixRowCasl", solo: true, team: true, bk: true },
        { labelKey: "pricingRd.matrixRowFintrac", solo: false, team: false, bk: true },
      ],
    },
  ];

  return (
    <div className="bg-white border border-rd-line rounded-rd-lg overflow-hidden">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] px-6 py-[18px] bg-rd-ink-50 border-b border-rd-line text-xs font-bold uppercase tracking-[0.06em] text-rd-ink-600">
        <div />
        <div className="text-center">{t("pricingRd.colSolo")}</div>
        <div className="text-center text-rd-navy-800">{t("pricingRd.colTeam")}</div>
        <div className="text-center">{t("pricingRd.colBrokerage")}</div>
      </div>
      {sections.map((section, si) => (
        <Fragment key={section.labelKey}>
          <div
            className={cn(
              "px-6 py-3 bg-rd-ink-50 text-[11px] font-bold uppercase tracking-[0.08em] text-rd-ink-500",
              si === 0 ? "" : "border-t border-rd-line"
            )}
          >
            {t(section.labelKey)}
          </div>
          {section.rows.map((r) => (
            <div
              key={r.labelKey}
              className="grid grid-cols-[2fr_1fr_1fr_1fr] px-6 py-4 border-t border-rd-line items-center text-sm"
            >
              <div className="text-rd-ink-900 font-medium">{t(r.labelKey)}</div>
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
