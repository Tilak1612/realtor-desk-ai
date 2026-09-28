import { Fragment } from "react";
import { Link } from "react-router-dom";
import { CtaLink } from "@/components/rd/marketing/CtaLink";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";
import { MarketingLayout } from "@/components/rd/marketing/MarketingLayout";
import { Eyebrow } from "@/components/rd/marketing/Eyebrow";
import { RDButton, IconArrow } from "@/components/rd";
import { cn } from "@/lib/utils";

// /compare/boldtrail — Compare page per rd-marketing.jsx Artboard_Compare.
// Static content backed by the `compareBoldtrail.*` i18n namespace so
// the whole table (not just the hero) swaps on FR toggle.

interface CompareItem {
  f: string;
  bt: string;
  rd: string;
}

export default function CompareBoldtrail() {
  const { t } = useTranslation();

  const SECTIONS: { section: string; items: CompareItem[] }[] = [
    {
      section: t("compareBoldtrail.secCanadianFit"),
      items: [
        { f: t("compareBoldtrail.fCanadianHosted"), bt: t("compareBoldtrail.vThemUsOnly"), rd: t("compareBoldtrail.vUsCanadianCenters") },
        { f: t("compareBoldtrail.fBilingual"), bt: t("compareBoldtrail.vThemAddonCost"), rd: t("compareBoldtrail.vUsBuiltIn") },
        { f: t("compareBoldtrail.fCaslFooters"), bt: t("compareBoldtrail.vThemManualTemplate"), rd: t("compareBoldtrail.vUsAutomatic") },
        { f: t("compareBoldtrail.fDdfIntegration"), bt: t("compareBoldtrail.vThemThirdParty"), rd: t("compareBoldtrail.vUsNative") },
        { f: t("compareBoldtrail.fCadPricing"), bt: t("compareBoldtrail.vThemUsdPremium"), rd: t("compareBoldtrail.vUsPureCad") },
      ],
    },
    {
      section: t("compareBoldtrail.secAiSpeed"),
      items: [
        { f: t("compareBoldtrail.fAiResponseTime"), bt: t("compareBoldtrail.vThemMinutes"), rd: t("compareBoldtrail.vUsFast") },
        { f: t("compareBoldtrail.fBilingualAiOob"), bt: t("compareBoldtrail.vNo"), rd: t("compareBoldtrail.vYes") },
        { f: t("compareBoldtrail.fVoiceAi2026"), bt: t("compareBoldtrail.vThemUnknown"), rd: t("compareBoldtrail.vUsQ3Beta") },
      ],
    },
    {
      section: t("compareBoldtrail.secCost"),
      items: [
        { f: t("compareBoldtrail.fStartingPrice"), bt: t("compareBoldtrail.vThemPriceSetup"), rd: t("compareBoldtrail.vUsPriceNoSetup") },
        { f: t("compareBoldtrail.fAnnualSingle"), bt: t("compareBoldtrail.vThemAnnual"), rd: t("compareBoldtrail.vUsAnnualSave") },
        { f: t("compareBoldtrail.fPerUserAfter5"), bt: t("compareBoldtrail.vThemPerUser"), rd: t("compareBoldtrail.vUsPerUser") },
        { f: t("compareBoldtrail.fOnboardingFee"), bt: t("compareBoldtrail.vThemOnboardingFee"), rd: t("compareBoldtrail.vUsIncluded") },
      ],
    },
  ];

  const BT_STATS: [string, string][] = [
    ["2008", t("compareBoldtrail.statFounded")],
    ["KW", t("compareBoldtrail.statParent")],
    ["USD", t("compareBoldtrail.statPricing")],
  ];
  const RD_STATS: [string, string][] = [
    ["2025", t("compareBoldtrail.statLaunched")],
    ["YEG", t("compareBoldtrail.statHq")],
    ["CAD", t("compareBoldtrail.statPricing")],
  ];

  return (
    <MarketingLayout>
      <SEO
        title={t("compareBoldtrail.seoTitle")}
        description={t("compareBoldtrail.seoDesc")}
        canonicalUrl="https://www.realtordesk.ai/compare/boldtrail"
      />

      {/* Hero */}
      <section className="px-8 md:px-14 pt-20 pb-10">
        <div className="mx-auto max-w-[1100px] text-center">
          <Eyebrow className="mx-auto">{t("compareBoldtrail.eyebrow")}</Eyebrow>
          <h1 className="mt-3.5 text-[40px] md:text-[56px] lg:text-[64px] font-semibold tracking-[-0.025em] leading-[1.05]">
            {t("compareBoldtrail.headline1")}{" "}
            <span className="font-rd-serif italic font-normal text-rd-navy-800">
              {t("compareBoldtrail.headline2")}
            </span>
            .
          </h1>
          <p className="text-lg text-rd-ink-600 max-w-[680px] mx-auto mt-5 leading-[1.55]">
            {t("compareBoldtrail.subtitle")}
          </p>
        </div>
      </section>

      {/* Hero cards */}
      <section className="px-8 md:px-14 pb-8">
        <div className="mx-auto max-w-[1100px] grid grid-cols-1 md:grid-cols-2 gap-5">
          <CompareHeroCard
            name="BoldTrail"
            tagline={t("compareBoldtrail.heroCardThemTag")}
            stats={BT_STATS}
            variant="muted"
          />
          <CompareHeroCard
            name="Realtor Desk"
            tagline={t("compareBoldtrail.heroCardUsTag")}
            stats={RD_STATS}
            variant="navy"
          />
        </div>
      </section>

      {/* Comparison table */}
      <section className="px-8 md:px-14 py-14">
        <div className="mx-auto max-w-[1100px] bg-white border border-rd-line rounded-rd-lg overflow-hidden shadow-rd-sm">
          <div className="grid grid-cols-[1.8fr_1fr_1fr] px-7 py-5 bg-rd-ink-50 border-b border-rd-line text-xs font-bold uppercase tracking-[0.08em] text-rd-ink-700">
            <div />
            <div className="text-center">BoldTrail</div>
            <div className="text-center text-rd-navy-800">Realtor Desk</div>
          </div>
          {SECTIONS.map((sec) => (
            <Fragment key={sec.section}>
              <div className="px-7 py-3.5 bg-white border-t border-rd-line text-xs font-bold uppercase tracking-[0.08em] text-rd-terra-700">
                {sec.section}
              </div>
              {sec.items.map((it) => (
                <div
                  key={it.f}
                  className="grid grid-cols-[1.8fr_1fr_1fr] px-7 py-[18px] border-t border-rd-line items-center text-sm"
                >
                  <div className="text-rd-ink-900 font-medium">{it.f}</div>
                  <div className="text-center text-rd-ink-500">{it.bt}</div>
                  <div className="text-center text-rd-navy-800 font-semibold">{it.rd}</div>
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-8 md:px-14 py-20">
        <div className="mx-auto max-w-[900px] bg-rd-navy-800 rounded-rd-xl p-12 md:p-14 text-center text-white">
          <h2 className="text-[28px] md:text-[36px] font-semibold tracking-[-0.02em] leading-[1.15]">
            {t("compareBoldtrail.closingHeadline")}
          </h2>
          <p className="text-base text-white/70 mt-3.5 leading-[1.55]">
            {t("compareBoldtrail.closingBody")}
          </p>
          <div className="inline-flex flex-wrap gap-3 mt-8 justify-center">
            <CtaLink
              to="/signup"
              location="compare_boldtrail"
              variant="terra"
              size="lg"
              trailingIcon={<IconArrow />}
            >
                {t("compareBoldtrail.closingCtaPrimary")}
            </CtaLink>
            <CtaLink
              to="/contact"
              location="compare_boldtrail_secondary"
              variant="light"
              size="lg"
            >
                {t("compareBoldtrail.closingCtaSecondary")}
            </CtaLink>
          </div>
        </div>
      </section>
      <section className="px-8 md:px-14 py-[100px] border-t border-rd-line">
        <div className="mx-auto max-w-[760px]">
          <h2 className="text-[28px] md:text-[36px] font-semibold tracking-[-0.02em] mb-4">
            How to read this comparison
          </h2>
          <p className="text-rd-ink-600 leading-[1.6] mb-8">
            We build one of these two products, so treat the framing accordingly.
            Everything below about BoldTrail comes from their own site, read on
            26 September 2026. Product details change — check
            boldtrail.com before you decide, and hold us to the same standard.
          </p>

          <h3 className="text-lg font-semibold mb-2">They are not the same kind of product</h3>
          <p className="text-rd-ink-600 leading-[1.6] mb-6">
            BoldTrail, from Inside Real Estate, is a broad platform. Their site
            markets to &ldquo;agents, teams, brokers, and enterprise-level
            organizations&rdquo; and spans four modules: the main platform with
            IDX websites, lead generation and CRM; BackOffice for commissions and
            accounting; Recruit for brokerage growth; and a marketplace of add-ons.
            Realtor Desk is a CRM for the working agent. If you need agent
            billing, commission accounting and a recruiting pipeline in one
            system, that is a real requirement and we do not meet it.
          </p>

          <h3 className="text-lg font-semibold mb-2">What their site does not say</h3>
          <p className="text-rd-ink-600 leading-[1.6] mb-6">
            Their homepage states no pricing, and makes no statement about Canadian
            data residency, CREA DDF, or French-language support. That is an
            observation about what is published, not a claim that the product
            lacks those things — ask them directly if those matter to you. They
            are the things we build around, so they are where we would expect the
            difference to sit.
          </p>

          <h3 className="text-lg font-semibold mb-2">What we will say about ourselves</h3>
          <p className="text-rd-ink-600 leading-[1.6] mb-6">
            Data hosted in Canada, pricing in CAD at $149/month for Solo and $299
            for Team, bilingual EN/FR in the interface and in client-facing email,
            and CASL consent recorded per contact with sends refused when consent
            is missing. Listings import from Realtor.ca today; native CREA DDF®
            sync is on the roadmap for Q3 2026 and is not live.
          </p>

          <h3 className="text-lg font-semibold mb-2">Who should pick which</h3>
          <p className="text-rd-ink-600 leading-[1.6]">
            A brokerage that needs back office, recruiting and IDX websites in one
            platform should look at BoldTrail. A Canadian agent or small team who
            wants lead follow-up handled properly, in two languages, billed in
            dollars that do not move, is who we built for. Our{" "}
            <Link to="/blog/best-crm-canada-2025" className="underline">
              comparison of Canadian CRM options
            </Link>{" "}
            covers the rest of the field, and{" "}
            <Link to="/blog/real-estate-crm-buying-guide" className="underline">
              the buying guide
            </Link>{" "}
            sets out how to run the evaluation yourself.
          </p>
        </div>
      </section>
    </MarketingLayout>
  );
}

function CompareHeroCard({
  name,
  tagline,
  stats,
  variant,
}: {
  name: string;
  tagline: string;
  stats: [string, string][];
  variant: "muted" | "navy";
}) {
  const navy = variant === "navy";
  return (
    <div
      className={cn(
        "rounded-rd-xl p-8",
        navy
          ? "bg-rd-navy-800 text-white"
          : "bg-rd-ink-100 text-rd-ink-700 border border-rd-line"
      )}
    >
      <div className="text-[11px] font-bold uppercase tracking-[0.08em] opacity-70">{tagline}</div>
      <h3 className="text-[28px] md:text-[36px] font-semibold tracking-[-0.02em] mt-2">{name}</h3>
      <div
        className={cn(
          "flex flex-wrap gap-x-8 gap-y-4 mt-8 pt-6 border-t",
          navy ? "border-white/10" : "border-rd-line"
        )}
      >
        {stats.map(([k, v]) => (
          <div key={k}>
            <div className="text-[22px] font-bold tracking-[-0.02em]">{k}</div>
            <div className={cn("text-xs mt-0.5", navy ? "text-white/80" : "text-rd-ink-700")}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
