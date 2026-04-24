import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";
import { MarketingLayout } from "@/components/rd/marketing/MarketingLayout";
import { Eyebrow } from "@/components/rd/marketing/Eyebrow";
import {
  RDButton,
  RDBadge,
  RDAvatar,
  RDMark,
  IconArrow,
  IconCheck,
  IconSparkle,
  IconSparkles,
  IconGlobe,
  IconShield,
  IconPipeline,
  IconLead,
  IconBolt,
} from "@/components/rd";
import { normalizeLocale, formatPercent, formatSeconds } from "@/lib/i18n/format";

// /  — Home page per rd-marketing.jsx Artboard_Home.
//
// Every user-visible string flows through t() into the `landing.*`
// namespace so the FR toggle swaps the entire page, not just the hero.
// Previously the hero was keyed but the six sections below were
// hardcoded EN — read as bad faith by Quebec users per 2026-04 audit.

export default function Home() {
  const { t, i18n } = useTranslation();
  const locale = normalizeLocale(i18n.language);
  const isFr = locale === "fr-CA";

  return (
    <MarketingLayout>
      <SEO
        title={
          isFr
            ? "Realtor Desk — le CRM immobilier canadien propulsé par l'IA"
            : "Realtor Desk — The Canadian real estate CRM, powered by AI"
        }
        description={
          isFr
            ? "Desk IA répond à chaque prospect en français ou en anglais, conforme à la LCAP, natif LPRPDE, prêt pour le SDD de l'ACI. Conçu pour les courtiers canadiens."
            : "Desk AI answers every lead in French or English, CASL-aware, PIPEDA-native, CREA DDF-ready. Built for Canadian realtors."
        }
        canonicalUrl="https://www.realtordesk.ai/"
      />

      <HeroSection t={t} />
      <TrustStrip t={t} />
      <FeatureGrid t={t} />
      <PipelinePreview t={t} />
      <CompareStrip t={t} locale={locale} />
      <TestimonialAndCTA t={t} />
    </MarketingLayout>
  );
}

type TFn = (key: string) => string;

/* ──────────────────────────────────────────────────────────
 * HERO
 * ────────────────────────────────────────────────────────── */
function HeroSection({ t }: { t: TFn }) {
  return (
    <section className="px-4 sm:px-8 md:px-14 pt-[100px] pb-10 relative overflow-hidden">
      <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-16 items-center">
        <div>
          <RDBadge tone="terra" size="sm" className="mb-6 flex-wrap max-w-full">
            <IconSparkle />
            {t("landing.hero.badge")}
          </RDBadge>
          <h1 className="text-[34px] sm:text-[48px] md:text-[56px] lg:text-[76px] font-semibold tracking-[-0.025em] leading-[1.02] text-rd-ink-900 break-words">
            {t("landing.hero.headline1")}{" "}
            <span className="font-rd-serif italic font-normal text-rd-navy-800">
              {t("landing.hero.headline2")}
            </span>
          </h1>
          <p className="text-lg lg:text-[20px] leading-[1.55] text-rd-ink-600 mt-6 max-w-[520px]">
            {t("landing.hero.subtitle")}
          </p>
          <div className="flex flex-wrap gap-3 mt-9">
            <Link to="/signup">
              <RDButton variant="primary" size="lg" trailingIcon={<IconArrow />}>
                {t("landing.hero.ctaPrimary")}
              </RDButton>
            </Link>
            <Link to="/demo">
              <RDButton variant="outline" size="lg">
                {t("landing.hero.ctaSecondary")}
              </RDButton>
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-4 md:gap-[18px] mt-8 text-[13px] text-rd-ink-500">
            <span className="inline-flex items-center gap-1.5">
              <IconCheck className="text-rd-success" />
              {t("landing.hero.trustNoCard")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <IconCheck className="text-rd-success" />
              {t("landing.hero.trustSetup")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <IconCheck className="text-rd-success" />
              {t("landing.hero.trustDdf")}
            </span>
          </div>
        </div>

        <HeroProduct t={t} />
      </div>
    </section>
  );
}

function HeroProduct({ t }: { t: TFn }) {
  const { i18n } = useTranslation();
  const locale = normalizeLocale(i18n.language);
  return (
    <div className="relative aspect-square w-full max-w-[540px] mx-auto">
      {/* Navy card */}
      <div className="absolute inset-0 bg-rd-navy-800 rounded-rd-xl shadow-rd-lg overflow-hidden">
        <div className="p-6 md:p-7 text-white flex flex-col h-full">
          {/* Card head */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-rd-terra-600 rounded-[7px] flex items-center justify-center">
                <IconSparkles />
              </div>
              <span className="font-semibold text-sm">{t("landing.heroProduct.deskLive")}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-white/60">
              <span className="w-1.5 h-1.5 bg-rd-success rounded-full" />
              {t("landing.heroProduct.answering")}
            </div>
          </div>

          {/* Lead message */}
          <div className="mt-6 flex gap-3 items-start">
            <RDAvatar name="Émilie Tremblay" size={32} tone="var(--rd-terra-700)" />
            <div className="bg-white/[0.08] rounded-[4px_14px_14px_14px] px-3.5 py-3 text-[13px] leading-[1.5] max-w-[85%]">
              {t("landing.heroProduct.leadMsg")}
            </div>
          </div>

          {/* AI reply */}
          <div className="mt-4 flex gap-3 items-start flex-row-reverse">
            <div className="w-8 h-8 bg-rd-terra-600 rounded-full flex items-center justify-center flex-shrink-0">
              <IconSparkles />
            </div>
            <div className="bg-rd-terra-600 text-white rounded-[14px_4px_14px_14px] px-3.5 py-3 text-[13px] leading-[1.5] max-w-[85%]">
              {t("landing.heroProduct.aiReply")}
            </div>
          </div>

          {/* Captured card */}
          <div className="mt-auto p-3.5 bg-white/[0.06] rounded-rd-md border border-white/10">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] uppercase tracking-[0.08em] text-white/60 font-semibold">
                {t("landing.heroProduct.leadCaptured")}
              </span>
              <RDBadge tone="terra" size="sm">{t("landing.heroProduct.hotBadge")}</RDBadge>
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <KV k={t("landing.heroProduct.kListing")} v="Le Plateau · 680 k$ CA" vEn="Le Plateau · $680K CAD" isFr={locale === "fr-CA"} />
              <KV k={t("landing.heroProduct.kTimeline")} v={t("landing.heroProduct.vTimelineTomorrow")} />
              <KV k={t("landing.heroProduct.kLang")} v={t("landing.heroProduct.vLangDetected")} />
              <KV k={t("landing.heroProduct.kBudget")} v={t("landing.heroProduct.vBudgetPreApproved")} />
            </div>
          </div>
        </div>
      </div>

      {/* Floating KPI */}
      <div className="hidden sm:flex absolute -bottom-6 -left-9 bg-white border border-rd-line rounded-rd-lg px-5 py-4 shadow-rd-md items-center gap-3.5">
        <div className="w-2 h-2 bg-rd-success rounded-full" />
        <div>
          <div className="text-[11px] text-rd-ink-500 uppercase tracking-[0.06em] font-semibold">
            {t("landing.heroProduct.avgResponseLabel")}
          </div>
          <div className="text-[22px] font-bold tracking-[-0.01em]">
            {formatSeconds(32, locale)}{" "}
            <span className="text-[13px] text-rd-success font-semibold">{formatPercent(-96, locale)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function KV({ k, v, vEn, isFr }: { k: string; v: string; vEn?: string; isFr?: boolean }) {
  return (
    <div>
      <div className="text-white/50 text-[10px] uppercase tracking-[0.06em]">{k}</div>
      <div className="text-white font-medium text-[13px] mt-0.5">{isFr === undefined ? v : isFr ? v : (vEn ?? v)}</div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
 * TRUST STRIP
 * Regulator row removed from logo strip — the old "RECO" entry was
 * factually wrong as a national trust signal (RECO is Ontario only).
 * Provincial coverage is now communicated via the bilingual feature
 * card below, not the vendor-logo strip.
 * ────────────────────────────────────────────────────────── */
function TrustStrip({ t }: { t: TFn }) {
  const logos = ["CREA DDF®", "Stripe", "OpenAI", "Twilio", "Supabase"];
  return (
    <section className="px-4 sm:px-8 md:px-14 py-8 border-y border-rd-line bg-white">
      <div className="mx-auto max-w-[1200px] flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-rd-ink-500">
          {t("landing.trustStrip.label")}
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-3 items-center font-bold text-[17px] text-rd-ink-600/70">
          {logos.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
 * FEATURE GRID
 * ────────────────────────────────────────────────────────── */
function FeatureGrid({ t }: { t: TFn }) {
  return (
    <section className="px-4 sm:px-8 md:px-14 py-24 lg:py-[120px]">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <Eyebrow>{t("landing.featureGrid.eyebrow")}</Eyebrow>
            <h2 className="mt-2.5 text-[36px] md:text-[48px] font-semibold tracking-[-0.02em] leading-[1.08] max-w-[720px]">
              {t("landing.featureGrid.heading")}
            </h2>
          </div>
          <p className="text-base leading-[1.55] text-rd-ink-600 max-w-[340px]">
            {t("landing.featureGrid.intro")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Feature
            big
            icon={<IconSparkles />}
            title={t("landing.featureGrid.chatbotTitle")}
            desc={t("landing.featureGrid.chatbotDesc")}
            meetLabel={t("landing.featureGrid.meetDeskAi")}
          />
          <Feature
            icon={<IconGlobe />}
            title={t("landing.featureGrid.bilingualTitle")}
            desc={t("landing.featureGrid.bilingualDesc")}
          />
          <Feature
            icon={<IconShield />}
            title={t("landing.featureGrid.pipedaTitle")}
            desc={t("landing.featureGrid.pipedaDesc")}
          />
          <Feature
            icon={<IconPipeline />}
            title={t("landing.featureGrid.pipelineTitle")}
            desc={t("landing.featureGrid.pipelineDesc")}
          />
          <Feature
            icon={<IconLead />}
            title={t("landing.featureGrid.scoringTitle")}
            desc={t("landing.featureGrid.scoringDesc")}
          />
          <Feature
            icon={<IconBolt />}
            title={t("landing.featureGrid.automationsTitle")}
            desc={t("landing.featureGrid.automationsDesc")}
          />
        </div>
      </div>
    </section>
  );
}

function Feature({
  icon,
  title,
  desc,
  big,
  meetLabel,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  big?: boolean;
  meetLabel?: string;
}) {
  if (big) {
    return (
      <div className="md:col-span-3 bg-rd-navy-800 text-white border border-rd-navy-700 rounded-rd-lg p-9 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12 relative overflow-hidden">
        <div
          className="absolute -right-14 -top-14 w-[280px] h-[280px] rounded-full opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, var(--rd-terra-600) 0%, transparent 60%)",
          }}
        />
        <div className="w-16 h-16 rounded-[14px] bg-rd-terra-600 text-white flex items-center justify-center flex-shrink-0 relative z-10">
          {icon}
        </div>
        <div className="relative z-10 flex-1">
          <h3 className="text-[26px] font-semibold tracking-[-0.01em] leading-[1.2]">{title}</h3>
          <p className="text-base leading-[1.55] text-white/70 mt-2 max-w-[620px]">{desc}</p>
        </div>
        <RDButton variant="light" trailingIcon={<IconArrow />} className="relative z-10 flex-shrink-0">
          {meetLabel}
        </RDButton>
      </div>
    );
  }
  return (
    <div className="bg-white border border-rd-line rounded-rd-lg p-7 flex flex-col items-start gap-4">
      <div className="w-11 h-11 rounded-rd-md bg-rd-navy-100 text-rd-navy-800 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-[19px] font-semibold tracking-[-0.01em] leading-[1.2]">{title}</h3>
      <p className="text-sm leading-[1.55] text-rd-ink-600">{desc}</p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
 * DARK PIPELINE PREVIEW
 * ────────────────────────────────────────────────────────── */
function PipelinePreview({ t }: { t: TFn }) {
  return (
    <section className="px-4 sm:px-8 md:px-14 py-[100px] bg-rd-ink-900 text-white relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] opacity-50 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--rd-navy-700) 0%, transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 items-center">
        <div>
          <Eyebrow tone="dark">{t("landing.pipelinePreview.eyebrow")}</Eyebrow>
          <h2 className="mt-2.5 text-[32px] md:text-[44px] font-semibold tracking-[-0.02em] leading-[1.1]">
            {t("landing.pipelinePreview.heading")}
          </h2>
          <p className="text-[17px] leading-[1.6] text-white/70 mt-5 max-w-[440px]">
            {t("landing.pipelinePreview.body")}
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link to="/signup">
              <RDButton variant="terra" trailingIcon={<IconArrow />}>
                {t("landing.pipelinePreview.ctaPrimary")}
              </RDButton>
            </Link>
            <Link to="/demo">
              <RDButton variant="ghost" className="text-white hover:bg-white/10">
                {t("landing.pipelinePreview.ctaSecondary")}
              </RDButton>
            </Link>
          </div>
        </div>
        <MiniPipeline t={t} />
      </div>
    </section>
  );
}

function MiniPipeline({ t }: { t: TFn }) {
  type Tag = "hot" | "warm";
  const cols: {
    title: string;
    count: number;
    tone: string;
    cards: { name: string; area: string; tag: Tag }[];
  }[] = [
    {
      title: t("landing.pipelinePreview.colNewLeads"),
      count: 12,
      tone: "bg-rd-terra-600",
      cards: [
        { name: "Hassan A.", area: "Mississauga", tag: "hot" },
        { name: "Émilie T.", area: "Le Plateau", tag: "hot" },
        { name: "Chen W.", area: "Richmond BC", tag: "warm" },
      ],
    },
    {
      title: t("landing.pipelinePreview.colContacted"),
      count: 7,
      tone: "bg-rd-navy-400",
      cards: [
        { name: "Olivia K.", area: "Leslieville", tag: "warm" },
        { name: "Kenji P.", area: "Kitsilano", tag: "warm" },
      ],
    },
    {
      title: t("landing.pipelinePreview.colShowingBooked"),
      count: 4,
      tone: "bg-rd-success",
      cards: [{ name: "Priya S.", area: "Oakville", tag: "hot" }],
    },
  ];
  const tagLabel = (tag: Tag) =>
    tag === "hot" ? t("landing.pipelinePreview.tagHot") : t("landing.pipelinePreview.tagWarm");
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {cols.map((c) => (
        <div
          key={c.title}
          className="bg-white/[0.05] border border-white/10 rounded-[12px] p-3.5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className={`w-1.5 h-1.5 rounded-full ${c.tone}`} />
              {c.title}
            </div>
            <span className="text-[11px] text-white/50">{c.count}</span>
          </div>
          <div className="flex flex-col gap-2">
            {c.cards.map((k) => (
              <div
                key={k.name}
                className="bg-rd-navy-800/50 border border-white/[0.08] rounded-[8px] px-3 py-2.5"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-semibold">{k.name}</span>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-[0.04em] ${
                      k.tag === "hot" ? "text-rd-terra-400" : "text-rd-navy-300"
                    }`}
                  >
                    {tagLabel(k.tag)}
                  </span>
                </div>
                <div className="text-[11px] text-white/55 mt-0.5">{k.area}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
 * COMPARE STRIP
 * ────────────────────────────────────────────────────────── */
function CompareStrip({ t, locale }: { t: TFn; locale: "en-CA" | "fr-CA" }) {
  const isFr = locale === "fr-CA";
  const rows: { cap: string; them: string | boolean; us: string | boolean }[] = [
    { cap: t("landing.compareStrip.rowHosting"), them: false, us: true },
    { cap: t("landing.compareStrip.rowBilingual"), them: t("landing.compareStrip.valAddon"), us: true },
    { cap: t("landing.compareStrip.rowCasl"), them: t("landing.compareStrip.valManual"), us: true },
    { cap: t("landing.compareStrip.rowDdf"), them: t("landing.compareStrip.valThirdParty"), us: true },
    { cap: t("landing.compareStrip.rowCad"), them: isFr ? "USD, +20 %" : "USD, +20%", us: true },
    { cap: t("landing.compareStrip.rowTtfr"), them: t("landing.compareStrip.valDays"), us: t("landing.compareStrip.valMinutes") },
  ];

  return (
    <section className="px-4 sm:px-8 md:px-14 py-[100px] bg-white">
      <div className="mx-auto max-w-[1200px] text-center">
        <Eyebrow>{t("landing.compareStrip.eyebrow")}</Eyebrow>
        <h2 className="mt-2.5 text-[32px] md:text-[44px] font-semibold tracking-[-0.02em] leading-[1.1] max-w-[820px] mx-auto">
          {t("landing.compareStrip.heading")}
        </h2>
      </div>

      <div className="mx-auto max-w-[1100px] mt-12 bg-white border border-rd-line rounded-rd-lg shadow-rd-sm overflow-hidden">
        <div className="grid grid-cols-[1.6fr_1fr_1fr] px-7 py-5 bg-rd-ink-50 border-b border-rd-line text-[11px] font-bold uppercase tracking-[0.1em] text-rd-ink-500 items-center">
          <div>{t("landing.compareStrip.hCapability")}</div>
          <div className="text-center text-rd-ink-600 text-sm normal-case tracking-normal font-semibold">
            {t("landing.compareStrip.hThem")}
          </div>
          <div className="text-center text-rd-navy-800 text-sm normal-case tracking-normal font-bold flex items-center gap-2 justify-center">
            <RDMark size={18} />
            {t("landing.compareStrip.hUs")}
          </div>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.cap}
            className={`grid grid-cols-[1.6fr_1fr_1fr] px-7 py-4 items-center ${
              i === rows.length - 1 ? "" : "border-b border-rd-line"
            }`}
          >
            <div className="text-sm font-medium text-rd-ink-900">{r.cap}</div>
            <div className="text-center text-sm text-rd-ink-500">
              {r.them === true ? (
                <IconCheck className="text-rd-success inline" />
              ) : r.them === false ? (
                <span className="text-rd-danger font-semibold">✕</span>
              ) : (
                r.them
              )}
            </div>
            <div className="text-center text-sm font-semibold text-rd-navy-800">
              {r.us === true ? (
                <span className="inline-flex items-center gap-1.5">
                  <IconCheck className="text-rd-success" />
                  {t("landing.compareStrip.valIncluded")}
                </span>
              ) : (
                r.us
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link to="/compare/boldtrail">
          <RDButton variant="outline" trailingIcon={<IconArrow />}>
            {t("landing.compareStrip.seeFull")}
          </RDButton>
        </Link>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
 * TESTIMONIAL + CTA
 * ────────────────────────────────────────────────────────── */
function TestimonialAndCTA({ t }: { t: TFn }) {
  // Only render the testimonial block when a real attribution exists
  // (landing.testimonial.author is non-empty). Until then the CTA
  // card takes the full width — avoids broadcasting "zero customer
  // references" with a placeholder card (2026-04-24 audit).
  const hasAttributedTestimonial = Boolean(t("landing.testimonial.author"));

  return (
    <section className="px-4 sm:px-8 md:px-14 pt-[100px] pb-[120px]">
      <div
        className={`mx-auto max-w-[1200px] grid grid-cols-1 ${
          hasAttributedTestimonial ? "lg:grid-cols-[1.2fr_1fr]" : ""
        } gap-12 items-stretch`}
      >
        {hasAttributedTestimonial && (
          <div className="bg-white border border-rd-line rounded-rd-xl p-10 md:p-12 relative">
            <div className="text-[72px] leading-none text-rd-terra-600 font-rd-serif">"</div>
            <p className="text-[20px] md:text-[22px] leading-[1.45] text-rd-ink-900 font-medium -mt-5">
              {t("landing.testimonial.quote")}
            </p>
            <div className="flex items-center gap-3 mt-8">
              <div>
                <div className="font-semibold text-sm">{t("landing.testimonial.author")}</div>
                <div className="text-[13px] text-rd-ink-500">{t("landing.testimonial.role")}</div>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-rd-navy-800 rounded-rd-xl p-10 md:p-12 text-white flex flex-col justify-between gap-8">
          <div>
            <h3 className="text-[28px] md:text-[32px] font-semibold tracking-[-0.01em] leading-[1.15]">
              {t("landing.closingCta.title")}
            </h3>
            <p className="text-[15px] text-white/70 mt-3 leading-[1.55]">
              {t("landing.closingCta.body")}
            </p>
          </div>
          <Link to="/signup">
            <RDButton variant="terra" size="lg" trailingIcon={<IconArrow />}>
              {t("landing.closingCta.cta")}
            </RDButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
