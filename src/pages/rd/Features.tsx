import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";
import { MarketingLayout } from "@/components/rd/marketing/MarketingLayout";
import { Eyebrow } from "@/components/rd/marketing/Eyebrow";
import { RDButton, RDBadge, IconArrow, IconCheck, IconSparkles } from "@/components/rd";

// /features — Features page per rd-app-extra.jsx Artboard_Features.
// All copy flows through the `featuresRd.*` i18n namespace so the FR
// toggle swaps the entire page (previously 100% hardcoded EN — bug
// flagged in 2026-04 round-2 audit).

type PillarTone = "terra" | "navy" | "paper";
type TFn = (key: string) => string;

interface Pillar {
  catKey: string;
  titleKey: string;
  bodyKey: string;
  tagKeys: [string, string, string];
  tone: PillarTone;
}

const PILLARS: Pillar[] = [
  {
    catKey: "featuresRd.pillar1Cat",
    titleKey: "featuresRd.pillar1Title",
    bodyKey: "featuresRd.pillar1Body",
    tagKeys: ["featuresRd.pillar1Tag1", "featuresRd.pillar1Tag2", "featuresRd.pillar1Tag3"],
    tone: "terra",
  },
  {
    catKey: "featuresRd.pillar2Cat",
    titleKey: "featuresRd.pillar2Title",
    bodyKey: "featuresRd.pillar2Body",
    tagKeys: ["featuresRd.pillar2Tag1", "featuresRd.pillar2Tag2", "featuresRd.pillar2Tag3"],
    tone: "navy",
  },
  {
    catKey: "featuresRd.pillar3Cat",
    titleKey: "featuresRd.pillar3Title",
    bodyKey: "featuresRd.pillar3Body",
    tagKeys: ["featuresRd.pillar3Tag1", "featuresRd.pillar3Tag2", "featuresRd.pillar3Tag3"],
    tone: "paper",
  },
];

const CAPABILITIES: [string, string][] = [
  ["featuresRd.capDdfTitle", "featuresRd.capDdfBody"],
  ["featuresRd.capChatTitle", "featuresRd.capChatBody"],
  ["featuresRd.capEmailTitle", "featuresRd.capEmailBody"],
  ["featuresRd.capCalendarTitle", "featuresRd.capCalendarBody"],
  ["featuresRd.capRoutingTitle", "featuresRd.capRoutingBody"],
  ["featuresRd.capRolesTitle", "featuresRd.capRolesBody"],
  ["featuresRd.capAuditTitle", "featuresRd.capAuditBody"],
  ["featuresRd.capReportingTitle", "featuresRd.capReportingBody"],
];

export default function Features() {
  const { t } = useTranslation();

  return (
    <MarketingLayout>
      <SEO
        title={t("featuresRd.seoTitle")}
        description={t("featuresRd.seoDesc")}
        canonicalUrl="https://www.realtordesk.ai/features"
      />

      {/* Hero */}
      <section className="px-8 md:px-20 pt-20 pb-14 max-w-[1280px] mx-auto">
        <RDBadge tone="terra" size="sm" className="mb-5">
          <IconSparkles />
          {t("featuresRd.badge")}
        </RDBadge>
        <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-semibold tracking-[-0.025em] leading-[1.05] max-w-[900px]">
          {t("featuresRd.heroH1Pre")}{" "}
          <span className="font-rd-serif italic font-normal text-rd-terra-600">
            {t("featuresRd.heroH1Italic1")}
          </span>
          {t("featuresRd.heroH1Mid")}{" "}
          <span className="font-rd-serif italic font-normal text-rd-terra-600">
            {t("featuresRd.heroH1Italic2")}
          </span>
          .
        </h1>
        <p className="text-lg md:text-[20px] text-rd-ink-600 leading-[1.55] max-w-[680px] mt-6">
          {t("featuresRd.heroSubtitle")}
        </p>
      </section>

      {/* Three pillars */}
      <section className="px-8 md:px-20 pb-24 max-w-[1280px] mx-auto flex flex-col gap-6">
        {PILLARS.map((pillar, i) => (
          <FeaturePillar key={pillar.titleKey} pillar={pillar} index={i + 1} t={t} />
        ))}
      </section>

      {/* Dark capabilities section */}
      <section className="bg-rd-ink-900 text-white py-20">
        <div className="mx-auto max-w-[1280px] px-8 md:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-end mb-12">
            <div>
              <Eyebrow tone="dark">{t("featuresRd.capsEyebrow")}</Eyebrow>
              <h2 className="mt-3 text-[36px] md:text-[48px] font-semibold tracking-[-0.02em] leading-[1.05]">
                {t("featuresRd.capsHeading1")}{" "}
                <span className="font-rd-serif italic font-normal text-rd-terra-400">
                  {t("featuresRd.capsHeadingItalic")}
                </span>
                .
              </h2>
            </div>
            <p className="text-[17px] text-white/65 leading-[1.6]">
              {t("featuresRd.capsIntro")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CAPABILITIES.map(([hKey, bKey]) => (
              <div
                key={hKey}
                className="p-6 bg-white/[0.04] border border-white/[0.08] rounded-[14px]"
              >
                <div className="w-7 h-7 bg-rd-terra-600 rounded-[8px] mb-4 flex items-center justify-center">
                  <IconCheck />
                </div>
                <div className="text-[15px] font-semibold mb-1.5">{t(hKey)}</div>
                <div className="text-[13px] text-white/65 leading-[1.55]">{t(bKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 md:px-20 py-20 max-w-[1280px] mx-auto text-center">
        <h2 className="text-[36px] md:text-[48px] font-semibold tracking-[-0.02em] leading-[1.1] max-w-[800px] mx-auto mb-5">
          {t("featuresRd.ctaH1Pre")}{" "}
          <span className="font-rd-serif italic font-normal text-rd-terra-600">
            {t("featuresRd.ctaH1Italic")}
          </span>
        </h2>
        <p className="text-[17px] text-rd-ink-600 max-w-[520px] mx-auto mb-8">
          {t("featuresRd.ctaBody")}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/signup">
            <RDButton variant="terra" size="lg" trailingIcon={<IconArrow />}>
              {t("featuresRd.ctaPrimary")}
            </RDButton>
          </Link>
          <Link to="/demo">
            <RDButton variant="outline" size="lg">
              {t("featuresRd.ctaSecondary")}
            </RDButton>
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}

/* ────────────────────────────────────────────────────────── */

type PillarProps = { pillar: Pillar; index: number; t: TFn };

const TONE: Record<PillarTone, { bg: string; ring: string; num: string; badge: "terra" | "navy" | "neutral" }> =
  {
    terra: {
      bg: "bg-rd-terra-100",
      ring: "text-rd-terra-600",
      num: "text-rd-terra-700",
      badge: "terra",
    },
    navy: {
      bg: "bg-rd-navy-100",
      ring: "text-rd-navy-500",
      num: "text-rd-navy-700",
      badge: "navy",
    },
    paper: {
      bg: "bg-white",
      ring: "text-rd-ink-400",
      num: "text-rd-ink-700",
      badge: "neutral",
    },
  };

function FeaturePillar({ pillar, index, t }: PillarProps) {
  const { catKey, titleKey, bodyKey, tagKeys, tone } = pillar;
  const tn = TONE[tone];
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-[60px_1fr_1.2fr] gap-8 lg:gap-10 p-9 ${tn.bg} rounded-[20px] border border-rd-line items-start`}
    >
      <div
        className={`font-rd-serif italic text-[48px] lg:text-[56px] font-normal tracking-[-0.02em] leading-none ${tn.num}`}
      >
        0{index}
      </div>
      <div>
        <RDBadge tone={tn.badge} size="sm" className="mb-3.5">
          {t(catKey)}
        </RDBadge>
        <h3 className="text-[26px] lg:text-[32px] font-semibold tracking-[-0.015em] leading-[1.15] mb-3">
          {t(titleKey)}
        </h3>
        <p className="text-base text-rd-ink-700 leading-[1.6]">{t(bodyKey)}</p>
      </div>
      <div className="flex flex-col gap-2.5 lg:pt-12">
        {tagKeys.map((tagKey) => (
          <div
            key={tagKey}
            className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white border border-rd-line rounded-rd-md text-[13px] font-medium"
          >
            <span className={tn.ring}>
              <IconCheck />
            </span>
            {t(tagKey)}
          </div>
        ))}
      </div>
    </div>
  );
}
