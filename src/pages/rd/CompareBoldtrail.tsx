import { Fragment } from "react";
import { Link } from "react-router-dom";
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
          <div className="grid grid-cols-[1.8fr_1fr_1fr] px-7 py-5 bg-rd-ink-50 border-b border-rd-line text-xs font-bold uppercase tracking-[0.08em] text-rd-ink-500">
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
            <Link to="/signup">
              <RDButton variant="terra" size="lg" trailingIcon={<IconArrow />}>
                {t("compareBoldtrail.closingCtaPrimary")}
              </RDButton>
            </Link>
            <Link to="/contact">
              <RDButton variant="light" size="lg">
                {t("compareBoldtrail.closingCtaSecondary")}
              </RDButton>
            </Link>
          </div>
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
            <div className="text-xs opacity-60 mt-0.5">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
