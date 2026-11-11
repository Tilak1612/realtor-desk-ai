import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CtaLink } from "@/components/rd/marketing/CtaLink";
import { CAL_ROUTE } from "@/config/booking";
import trustGroundAvif from "@/assets/brand/trust-ground.avif";
import trustGroundWebp from "@/assets/brand/trust-ground.webp";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";
import { MarketingLayout } from "@/components/rd/marketing/MarketingLayout";
import { Eyebrow } from "@/components/rd/marketing/Eyebrow";
import {
  RDButton,
  RDBadge,
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
import { normalizeLocale } from "@/lib/i18n/format";
import { Reveal } from "@/components/motion/Reveal";
import { ProductTour } from "@/components/marketing/ProductTour";
import { AudienceCards } from "@/components/rd/marketing/AudienceCards";
import { ResourceCards } from "@/components/rd/marketing/ResourceCards";
import { FAQAccordion } from "@/components/rd/marketing/FAQAccordion";
import { HeroScorer } from "@/components/rd/marketing/HeroScorer";
import { HOME_FAQS, HOME_RESOURCES, HOME_TRIAL_PLAN, HOME_WORKFLOW } from "@/content/homeSections";
import {
  PLAN_SUMMARIES,
  formatBillingDate,
  formatCad,
  projectedFirstChargeDate,
} from "@/config/billing";
import { HOME_COMPARE_STRIP } from "@/content/comparisonTables";

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
  const workflow = HOME_WORKFLOW(isFr);

  return (
    <MarketingLayout>
      <SEO
        title={
          isFr
            ? "CRM immobilier pour courtiers canadiens | Realtor Desk"
            : "Real Estate CRM for Canadian Agents | Realtor Desk"
        }
        description={
          isFr
            ? "CRM bilingue pour l'immobilier canadien : notation des prospects, pipeline glisser-déposer, une chronologie par client et import de fiches Realtor.ca. Données hébergées au Canada, tarifs en CAD."
            : "The bilingual CRM for Canadian real estate: lead scoring, a drag-and-drop pipeline and one conversation timeline per client. Hosted in Canada, priced in CAD."
        }
        canonicalUrl="https://www.realtordesk.ai/"
        structuredData={[
          {
            // The one schema type the site did not emit. It names the site as an
            // entity distinct from the company and declares its languages, which
            // answer engines use to resolve "Realtor Desk" to a single site.
            // Deliberately no SearchAction: the site has no search, and markup
            // for a feature that does not exist is the thing to avoid.
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Realtor Desk",
            url: "https://www.realtordesk.ai/",
            inLanguage: ["en-CA", "fr-CA"],
            publisher: { "@type": "Organization", name: "Realtor Desk" },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            // Built from HOME_FAQS, the same array <FAQAccordion> renders, so
            // the markup cannot describe questions the page does not show.
            mainEntity: HOME_FAQS(isFr).map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />

      {/* The hero is deliberately NOT wrapped. It is the LCP region; delaying
          it behind an observer would trade the page's most important paint for
          a decoration. Everything below the fold reveals on scroll. */}
      <HeroSection t={t} />
      <Reveal><TrustStrip t={t} /></Reveal>
      {/* Brief homepage sequence step 2. Sourced from the nav registry, so
          these three cards cannot name a different set of audiences than the
          header panel and the footer column do. */}
      <Reveal><AudienceCards /></Reveal>
      {/* The real product, straight after the claims. Features explain it in
          words; this shows the dashboard a visitor would actually sign into. */}
      <Reveal><ProductTour /></Reveal>
      <Reveal><FeatureGrid t={t} /></Reveal>
      <Reveal><PipelinePreview t={t} /></Reveal>
      <Reveal><CompareStrip t={t} /></Reveal>
      <Reveal>
        <section className="px-8 md:px-14 py-[100px] border-t border-rd-line">
          <div className="mx-auto max-w-[760px]">
            {/* Was ~700 words hardcoded in English, which stayed English on the
                French homepage. Copy now comes from HOME_WORKFLOW so both
                locales are real prose rather than one being a fallback. */}
            <h2 className="text-[28px] md:text-[36px] font-semibold tracking-[-0.02em] mb-8">
              {workflow.heading}
            </h2>
            {workflow.blocks.map((b, bi) => (
              <div key={b.h}>
                <h3 className="text-lg font-semibold mb-2">{b.h}</h3>
                <p
                  className={`text-rd-ink-600 leading-[1.6] ${
                    bi === workflow.blocks.length - 1 ? "" : "mb-6"
                  }`}
                >
                  {b.p.map((seg, si) =>
                    typeof seg === "string" ? (
                      seg
                    ) : (
                      <Link key={si} to={seg.to} className="underline">
                        {seg.text}
                      </Link>
                    ),
                  )}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Steps 9 and 10. Both were missing: the homepage went from the
          Canadian-workflow prose straight to the closing CTA, so a visitor
          with an unanswered question had nowhere to go but the footer. */}
      <Reveal>
        <ResourceCards
          heading={
            isFr ? "À lire avant de choisir" : "Worth reading before you choose"
          }
          body={
            isFr
              ? "Trois guides écrits pour le marché canadien. Aucun ne se termine par « et c'est pourquoi vous devriez nous choisir »."
              : "Three guides written for the Canadian market. None of them ends with \u201cand that is why you should pick us\u201d."
          }
          items={HOME_RESOURCES(isFr)}
          allTo="/resources"
          allLabel={isFr ? "Tous les guides" : "All guides"}
        />
      </Reveal>

      <Reveal>
        <section className="px-4 sm:px-8 md:px-14 py-16 md:py-24 border-t border-rd-line">
          <div className="mx-auto max-w-[820px]">
            <h2 className="text-[28px] md:text-[36px] font-semibold tracking-[-0.02em] mb-8">
              {isFr ? "Questions avant de commencer" : "Questions before you start"}
            </h2>
            <FAQAccordion items={HOME_FAQS(isFr)} />
          </div>
        </section>
      </Reveal>

      <Reveal><TrialPlanCTA t={t} isFr={isFr} /></Reveal>
    </MarketingLayout>
  );
}

type TFn = (key: string) => string;

/* ──────────────────────────────────────────────────────────
 * HERO
 * ────────────────────────────────────────────────────────── */
function HeroSection({ t }: { t: TFn }) {
  // Top padding was a flat 100px at every width. At 390px that put the badge
  // ~112px below a ~84px header, so the H1 started around 470px down an 844px
  // viewport and pushed the primary CTA to the fold edge with the product card
  // entirely below it. 100px is right on desktop, where the header is
  // proportionally smaller and the grid is two columns; it is not right on a
  // phone.
  return (
    <section className="px-4 sm:px-8 md:px-14 pt-10 sm:pt-16 md:pt-[100px] pb-10 relative overflow-hidden">
      <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center">
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
            <CtaLink
              to="/signup"
              location="hero"
              variant="primary"
              size="lg"
              trailingIcon={<IconArrow />}
            >
                {t("landing.hero.ctaPrimary")}
            </CtaLink>
            <CtaLink
              to={CAL_ROUTE}
              location="hero"
              variant="outline"
              size="lg"
            >
                {t("landing.hero.ctaSecondary")}
            </CtaLink>
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

        <HeroScorer />
      </div>
    </section>
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
  // Only integrations a customer can switch on TODAY, and only ones marked
  // status: "available" in IntegrationHub. CREA DDF® used to head this list;
  // it is a scaffold awaiting CREA credentials (Q3 2026 everywhere else on
  // the site), and a bare wordmark in a logo strip reads as both "shipped"
  // and "affiliated with CREA". Neither is true. Stripe, Supabase and OpenAI
  // came out at the same time: they are our plumbing, not something the
  // agent connects, and OpenAI was wrong anyway -- the in-app assistant runs
  // on Gemini through the Lovable gateway.
  // Google Calendar and Outlook came out on 2026-09-21: the OAuth connection
  // is built, but nothing reads or writes events, so "Works with" overstated
  // it. They go back in when sync ships. Zapier and Make are real (they POST
  // to webhook-receiver) and Twilio is real (send-sms).
  const logos = ["Zapier", "Make", "Twilio"];
  // Decorative paper texture behind the strip. image-set rather than
  // <Picture> because it is a background, not content: no alt text to
  // write, nothing to announce, and it must not enter the accessibility
  // tree. AVIF is 11KB, WebP 30KB, and bg-white underneath is the
  // fallback when neither loads -- so the strip is never bare.
  return (
      <section
        className="px-4 sm:px-8 md:px-14 py-8 border-y border-rd-line bg-white bg-cover bg-center"
        style={{
          backgroundImage:
            `image-set(url(${trustGroundAvif}) type("image/avif"), url(${trustGroundWebp}) type("image/webp"))`,
        }}
      >
      <div className="mx-auto max-w-[1200px] flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-rd-ink-500">
          {t("landing.trustStrip.label")}
        </div>
        {/* A list of five things, marked up as one. It was five bare
            <span>s, so assistive technology announced a run of words with
            no indication they were a set or how many. */}
        <ul className="flex flex-wrap gap-x-10 gap-y-3 items-center font-bold text-[17px] list-none p-0 m-0">
          {logos.map((l) => (
            <li
              key={l}
              className="text-rd-ink-600 transition-colors duration-150 hover:text-rd-ink-900"
            >
              {l}
            </li>
          ))}
        </ul>
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

        {/* Nested Reveal so the cards arrive in sequence rather than as one
            block. The outer section Reveal wraps the whole <section>, whose
            direct children are the header and this grid -- staggering there
            would offset those two, not the cards. rd-stagger indexes direct
            children, so it has to sit on the grid itself. */}
        <Reveal stagger className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
            title={t("landing.featureGrid.inboxTitle")}
            desc={t("landing.featureGrid.inboxDesc")}
          />
        </Reveal>
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
    <div className="rd-card-lift group bg-white border border-rd-line rounded-rd-lg p-7 flex flex-col items-start gap-4">
      <div className="rd-card-lift-icon w-11 h-11 rounded-rd-md bg-rd-navy-100 text-rd-navy-800 flex items-center justify-center">
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
            <CtaLink
              to="/signup"
              location="pipeline_preview"
              variant="terra"
              size="lg"
              trailingIcon={<IconArrow />}
            >
                {t("landing.pipelinePreview.ctaPrimary")}
            </CtaLink>
            <CtaLink
              to={CAL_ROUTE}
              location="pipeline_preview"
              // light, not ghost. ghost is "transparent, slate text (nav/toolbar)"
              // per Button.tsx and is for LIGHT surfaces; this band is near-black,
              // so it rendered dark-on-dark at 1.37:1. Button.tsx already defines
              // light as "white surface with navy text (on dark sections)".
              variant="light"
              size="lg"
            >
                {t("landing.pipelinePreview.ctaSecondary")}
            </CtaLink>
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
            <span className="text-[11px] text-white/70">{c.count}</span>
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
function CompareStrip({ t }: { t: TFn }) {
  // BoldTrail cells come from boldtrail.com/faq, read 4 November 2026, and say
  // "Not stated" where that page is silent. The strip this replaced showed an
  // ✕ for BoldTrail hosting, a paid French add-on, manual CASL, a third-party
  // DDF plugin and "USD, +20%": none were sourced. Neither was "Time to first
  // AI response", removed earlier: nothing invokes run-automation in
  // production, so there is no automatic first response to time.
  // The rows live in @/content/comparisonTables so the prerendered HTML
  // carries the same table a visitor sees.
  const c = (key: string) => t(`landing.compareStrip.${key}`);
  const cell = (v: string | true) => (v === true ? true : c(v));
  const rows = HOME_COMPARE_STRIP.sections.flatMap((s) =>
    s.rows.map(([cap, them, us]) => ({ cap: c(cap), them: cell(them), us: cell(us) })),
  );

  return (
    <section className="px-4 sm:px-8 md:px-14 py-[100px] bg-white">
      <div className="mx-auto max-w-[1200px] text-center">
        <Eyebrow>{t("landing.compareStrip.eyebrow")}</Eyebrow>
        <h2 className="mt-2.5 text-[32px] md:text-[44px] font-semibold tracking-[-0.02em] leading-[1.1] max-w-[820px] mx-auto">
          {t("landing.compareStrip.heading")}
        </h2>
      </div>

      <div className="mx-auto max-w-[1100px] mt-12 bg-white border border-rd-line rounded-rd-lg shadow-rd-sm overflow-hidden">
        <div className="grid grid-cols-[1.6fr_1fr_1fr] px-7 py-5 bg-rd-ink-50 border-b border-rd-line text-[11px] font-bold uppercase tracking-[0.1em] text-rd-ink-600 items-center">
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

      <p className="mx-auto max-w-[1100px] mt-4 text-[13px] leading-[1.5] text-rd-ink-600">
        {c("sourceNote")}
      </p>

      <div className="text-center mt-8">
        <CtaLink
          to="/compare/boldtrail"
          location="home_compare_link"
          variant="outline"
          size="md"
          trailingIcon={<IconArrow />}
        >
            {t("landing.compareStrip.seeFull")}
        </CtaLink>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
 * CLOSING: YOUR FIRST 14 DAYS
 *
 * Was a navy card with one full-width "Claim your desk" button. The hero
 * already tells a visitor a card is required; that is the question they
 * carry to the bottom of the page, and the old card did not answer it.
 * This lays the trial out step by step beside the price, so the decision
 * point carries the facts: $0 today, when the 14 days start, how to leave
 * without paying, and what it costs after. Copy and sources live in
 * HOME_TRIAL_PLAN; prices come from PLAN_SUMMARIES, the same source the
 * signup disclosure uses, so the two cannot disagree.
 * ────────────────────────────────────────────────────────── */
function TrialPlanCTA({ t, isFr }: { t: TFn; isFr: boolean }) {
  const { i18n } = useTranslation();
  const copy = HOME_TRIAL_PLAN(isFr);
  const price = (key: "solo" | "team") =>
    formatCad(PLAN_SUMMARIES.find((p) => p.key === key)!.monthlyCad, i18n.language);

  // The projected first-charge date depends on the visitor's "today", so it
  // is filled in after mount: the prerendered HTML must not carry the date
  // the site happened to be built on.
  const [chargeDate, setChargeDate] = useState<string | null>(null);
  useEffect(() => {
    setChargeDate(formatBillingDate(projectedFirstChargeDate(), i18n.language));
  }, [i18n.language]);

  // Only render the testimonial block when a real attribution exists
  // (landing.testimonial.author is non-empty), as before.
  const hasAttributedTestimonial = Boolean(t("landing.testimonial.author"));

  return (
    <section
      aria-labelledby="trial-plan-heading"
      className="px-4 sm:px-8 md:px-14 pt-[100px] pb-[120px]"
    >
      {hasAttributedTestimonial && (
        <figure className="mx-auto max-w-[1200px] mb-12 bg-white border border-rd-line rounded-rd-xl p-10 md:p-12">
          <blockquote className="text-[20px] md:text-[22px] leading-[1.45] text-rd-ink-900 font-medium">
            {t("landing.testimonial.quote")}
          </blockquote>
          <figcaption className="mt-6 text-sm">
            <span className="font-semibold">{t("landing.testimonial.author")}</span>{" "}
            <span className="text-rd-ink-500">{t("landing.testimonial.role")}</span>
          </figcaption>
        </figure>
      )}

      <div className="relative overflow-hidden mx-auto max-w-[1200px] bg-rd-navy-800 text-white rounded-rd-xl px-6 py-10 sm:px-10 md:px-14 md:py-16">
        {/* The page's one depth idiom: a contained radial, pointer-transparent
            so it cannot swallow a click. */}
        <div
          aria-hidden="true"
          className="absolute -left-24 -top-24 w-[420px] h-[420px] rounded-full opacity-25 pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--rd-terra-600) 0%, transparent 62%)" }}
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-12 lg:gap-16 items-start lg:items-center">
          <div>
            <Eyebrow tone="dark">{copy.eyebrow}</Eyebrow>
            <h2
              id="trial-plan-heading"
              className="mt-2.5 text-[30px] md:text-[42px] font-semibold tracking-[-0.02em] leading-[1.1]"
            >
              {copy.heading}
            </h2>
            <p className="text-[16px] md:text-[17px] leading-[1.6] text-white/75 mt-4 max-w-[520px]">
              {copy.lede}
            </p>

            <ol className="mt-10 space-y-0">
              {copy.steps.map((step, i) => {
                const last = i === copy.steps.length - 1;
                return (
                  <li key={step.when} className="relative grid grid-cols-[36px_1fr] gap-4">
                    {/* Rail and marker. The rail stops at the last step. */}
                    <div className="relative flex justify-center" aria-hidden="true">
                      {!last && <span className="absolute top-9 bottom-0 w-px bg-white/20" />}
                      <span
                        className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold ${
                          last
                            ? "bg-rd-terra-600 text-white"
                            : "bg-white/10 text-white ring-1 ring-white/25"
                        }`}
                      >
                        {i + 1}
                      </span>
                    </div>
                    <div className={last ? "pb-0" : "pb-7"}>
                      <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-rd-terra-400">
                        {step.when}
                      </div>
                      <h3 className="mt-1 text-[17px] font-semibold leading-snug">{step.title}</h3>
                      <p className="mt-1 text-[15px] leading-[1.55] text-white/75">{step.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Price card: the decision, with the number on it. */}
          <div className="bg-white text-rd-ink-900 rounded-rd-lg shadow-rd-sm p-7 md:p-9">
            <div className="text-[12px] font-bold uppercase tracking-[0.12em] text-rd-ink-600">
              {copy.card.plan}
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-[56px] md:text-[64px] font-semibold tracking-[-0.03em] leading-none">
                {copy.card.today}
              </span>
              <span className="text-lg text-rd-ink-600">{copy.card.todayLabel}</span>
            </div>
            <p className="mt-3 text-[15px] leading-[1.5] text-rd-ink-700">
              {copy.card.then.replace("{price}", price("solo"))}
            </p>
            <p className="mt-2 min-h-[42px] text-[13px] leading-[1.5] text-rd-ink-600" aria-live="polite">
              {chargeDate ? copy.card.chargeDate.replace("{date}", chargeDate) : null}
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <CtaLink
                to="/signup"
                location="closing_trial_plan"
                variant="terra"
                size="lg"
                full
                trailingIcon={<IconArrow />}
              >
                {copy.card.cta}
              </CtaLink>
              <CtaLink to={CAL_ROUTE} location="closing_trial_plan" variant="outline" size="lg" full>
                {copy.card.demo}
              </CtaLink>
            </div>

            <div className="mt-6 pt-5 border-t border-rd-line text-[13px] leading-[1.5] text-rd-ink-600 space-y-2">
              <p>
                {copy.card.team.replace("{price}", price("team"))}{" "}
                <Link to="/pricing" className="font-semibold text-rd-navy-800 underline underline-offset-2">
                  {copy.card.teamLink}
                </Link>
              </p>
              <p className="flex items-start gap-1.5">
                <IconCheck className="text-rd-success mt-[3px] shrink-0" />
                {copy.card.footnote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
