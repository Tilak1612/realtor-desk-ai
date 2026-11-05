import { Fragment } from "react";
import { Link } from "react-router-dom";
import { CtaLink } from "@/components/rd/marketing/CtaLink";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";
import { MarketingLayout } from "@/components/rd/marketing/MarketingLayout";
import { Eyebrow } from "@/components/rd/marketing/Eyebrow";
import { IconArrow } from "@/components/rd";
import { cn } from "@/lib/utils";
import { BOLDTRAIL_COMPARE_TABLE } from "@/content/comparisonTables";

// /compare/boldtrail — Compare page per rd-marketing.jsx Artboard_Compare.
// Static content backed by the `compareBoldtrail.*` i18n namespace so
// the whole table (not just the hero) swaps on FR toggle.

export default function CompareBoldtrail() {
  const { t } = useTranslation();

  // Every BoldTrail cell comes from boldtrail.com/faq, read 4 November 2026.
  // Where that page is silent the cell says so ("Not stated"): a missing
  // public statement is an unknown, not a "no". The version this replaced
  // asserted US-only hosting, a Keller Williams parent, USD setup fees, a
  // CAD $15 extra-user price, native DDF on our side and a contract-match
  // offer, none of which were sourced or true. The rows live in
  // @/content/comparisonTables so the prerendered HTML carries the same table.
  const k = (key: string) => t(`compareBoldtrail.${key}`);
  const TABLE = BOLDTRAIL_COMPARE_TABLE;

  const BT_STATS: [string, string][] = [
    [k("vVendorThem"), k("statVendor")],
    [k("vTypeThem"), k("statType")],
    [k("vPriceThem"), k("statPricing")],
  ];
  const RD_STATS: [string, string][] = [
    [k("vVendorUs"), k("statVendor")],
    [k("vTypeUs"), k("statType")],
    [k("vPriceUs"), k("statPricing")],
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
            <div className="sr-only">{k(TABLE.columns[0])}</div>
            <div className="text-center">{k(TABLE.columns[1])}</div>
            <div className="text-center text-rd-navy-800">{k(TABLE.columns[2])}</div>
          </div>
          {TABLE.sections.map((sec) => (
            <Fragment key={sec.heading}>
              {sec.heading && (
                <div className="px-7 py-3.5 bg-white border-t border-rd-line text-xs font-bold uppercase tracking-[0.08em] text-rd-terra-700">
                  {k(sec.heading)}
                </div>
              )}
              {sec.rows.map(([f, bt, rd]) => (
                <div
                  key={f}
                  className="grid grid-cols-[1.8fr_1fr_1fr] px-7 py-[18px] border-t border-rd-line items-center text-sm"
                >
                  <div className="text-rd-ink-900 font-medium">{k(f)}</div>
                  <div className="text-center text-rd-ink-500">{bt === true ? k("vIncluded") : k(bt)}</div>
                  <div className="text-center text-rd-navy-800 font-semibold">{rd === true ? k("vIncluded") : k(rd)}</div>
                </div>
              ))}
            </Fragment>
          ))}
        </div>
        {TABLE.note && (
          <p className="mx-auto max-w-[1100px] mt-4 text-[13px] leading-[1.5] text-rd-ink-600">
            {k(TABLE.note)}
          </p>
        )}
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
              to="/switch-from-boldtrail"
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
            {k("readHeading")}
          </h2>
          <p className="text-rd-ink-600 leading-[1.6] mb-8">{k("readIntro")}</p>

          <h3 className="text-lg font-semibold mb-2">{k("readKindH")}</h3>
          <p className="text-rd-ink-600 leading-[1.6] mb-6">{k("readKind")}</p>

          <h3 className="text-lg font-semibold mb-2">{k("readSilentH")}</h3>
          <p className="text-rd-ink-600 leading-[1.6] mb-6">{k("readSilent")}</p>

          <h3 className="text-lg font-semibold mb-2">{k("readUsH")}</h3>
          <p className="text-rd-ink-600 leading-[1.6] mb-6">{k("readUs")}</p>

          <h3 className="text-lg font-semibold mb-2">{k("readWhoH")}</h3>
          <p className="text-rd-ink-600 leading-[1.6] mb-4">{k("readWho")}</p>
          <p className="text-rd-ink-600 leading-[1.6] flex flex-wrap gap-x-5 gap-y-1">
            <Link to="/blog/best-crm-canada-2025" className="underline">{k("readLinkCompare")}</Link>
            <Link to="/blog/real-estate-crm-buying-guide" className="underline">{k("readLinkGuide")}</Link>
            <Link to="/pricing" className="underline">{t("siteNav.pricing")}</Link>
            <Link to="/roadmap" className="underline">{t("siteNav.roadmap", "Roadmap")}</Link>
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
