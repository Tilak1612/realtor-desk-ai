import { useState, Fragment } from "react";
import { CtaLink } from "@/components/rd/marketing/CtaLink";
import { CAL_ROUTE } from "@/config/booking";
import { Reveal } from "@/components/motion/Reveal";
import { STRIPE_PRICES } from "@/config/stripe";
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
      monthly: STRIPE_PRICES.solo.monthly,
      yearly: STRIPE_PRICES.solo.yearly,
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
      monthly: STRIPE_PRICES.team.monthly,
      yearly: STRIPE_PRICES.team.yearly,
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
      {/* Below the fold on every viewport, so it reveals. The plan grid
          above is deliberately not wrapped -- it is the reason people
          opened this page and must never wait on an observer. */}
      <Reveal>
      <section className="px-8 md:px-14 py-[100px] bg-white border-t border-rd-line">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-[28px] md:text-[36px] font-semibold tracking-[-0.02em] text-center mb-10">
            {t("pricingRd.compareHeading")}
          </h2>
          <FeatureMatrix t={t} />
        </div>
      </section>

      {/* Written out as prose because the plan cards and the feature matrix are
          component-driven: the 2026-09-26 crawl saw 103 words on this page.
          These are also the questions the SEO report's /pricing brief asks the
          page to answer — trial requirements and billing. */}
      <section className="px-8 md:px-14 py-[100px] border-t border-rd-line">
        <div className="mx-auto max-w-[760px]">
          <h2 className="text-[28px] md:text-[36px] font-semibold tracking-[-0.02em] mb-8">
            Billing questions, answered
          </h2>

          <h3 className="text-lg font-semibold mb-2">What does the trial include?</h3>
          <p className="text-rd-ink-600 leading-[1.6] mb-6">
            Fourteen days with the plan you pick, not a reduced version of it. A
            card is collected when you start so the account can continue without
            interruption, and nothing is charged before day 14. Cancel any time
            before then and you are not billed.
          </p>

          <h3 className="text-lg font-semibold mb-2">What do the plans cost?</h3>
          <p className="text-rd-ink-600 leading-[1.6] mb-6">
            Solo is $149 CAD per month and Team is $299 CAD per month. Prices are
            in Canadian dollars, so there is no exchange rate moving your bill
            between months, which is the common complaint about US-billed real
            estate software.
          </p>

          <h3 className="text-lg font-semibold mb-2">What is actually included today?</h3>
          <p className="text-rd-ink-600 leading-[1.6] mb-6">
            Lead scoring, a drag-and-drop pipeline, one conversation timeline per
            client, Realtor.ca listing import, CASL-aware email with consent
            records, SMS through Twilio, and inbound automation from Zapier, Make
            or n8n. The interface and client-facing email both work in English and
            French. Data is hosted in Canada.
          </p>

          <h3 className="text-lg font-semibold mb-2">What is not included yet?</h3>
          <p className="text-rd-ink-600 leading-[1.6] mb-6">
            Native CREA DDF® listing sync is on the roadmap for Q3 2026 — until
            then, listings come in through the Realtor.ca importer. Google
            Calendar and Outlook connect today, but pushing appointments to them
            automatically is still in build. We would rather you read that here
            than discover it in week two.
          </p>

          <h3 className="text-lg font-semibold mb-2">Can I change plan or leave?</h3>
          <p className="text-rd-ink-600 leading-[1.6]">
            Plans change from billing settings and take effect on the next cycle.
            There is no contract and no cancellation fee. Your contacts export to
            CSV at any point, including after you cancel — the data is yours.
          </p>
        </div>
      </section>
      </Reveal>
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
          cycle === "monthly"
            ? "bg-rd-navy-800 text-white"
            : "bg-transparent text-rd-ink-600 hover:text-rd-ink-900 hover:bg-rd-ink-50"
        )}
      >
        {t("pricingRd.toggleMonthly")}
      </button>
      <button
        type="button"
        onClick={() => onChange("annual")}
        className={cn(
          "px-5 py-2 text-[13px] font-semibold rounded-rd-pill transition-colors",
          cycle === "annual"
            ? "bg-rd-navy-800 text-white"
            : "bg-transparent text-rd-ink-600 hover:text-rd-ink-900 hover:bg-rd-ink-50"
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
        "relative rounded-rd-xl p-8 rd-card-lift",
        featured
          // -translate-y-2 is gone: rd-card-lift owns transform, and the two
          // would fight. The resting offset moves into --rd-lift-base so the
          // hover delta composes with it instead of replacing it.
          ? "bg-rd-navy-800 text-white border border-rd-navy-700 shadow-rd-lg [--rd-lift-base:-0.5rem]"
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
          featured ? "text-rd-terra-400" : "text-rd-terra-800"
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

      {/* CtaLink, not <Link><RDButton/></Link>. The nested pattern put an
          interactive element inside an anchor and, more importantly here,
          emitted no analytics -- so the pricing CTA, the closest click to
          revenue on the site, was the one CTA nobody could attribute. */}
      <CtaLink
        to={plan.cta === "talkSales" ? CAL_ROUTE : "/signup"}
        location={`pricing_${plan.id}`}
        label={plan.cta === "talkSales" ? "book_demo" : "start_trial"}
        variant={plan.ctaVariant}
        size="lg"
        full
        className="mt-6"
        trailingIcon={<IconArrow />}
      >
        {plan.cta === "talkSales" ? t("pricingRd.ctaTalkSales") : t("pricingRd.ctaStart")}
      </CtaLink>

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
              "px-6 py-3 bg-rd-ink-50 text-[11px] font-bold uppercase tracking-[0.08em] text-rd-ink-600",
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
