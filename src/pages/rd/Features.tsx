import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { MarketingLayout } from "@/components/rd/marketing/MarketingLayout";
import { Eyebrow } from "@/components/rd/marketing/Eyebrow";
import { RDButton, RDBadge, IconArrow, IconCheck, IconSparkles } from "@/components/rd";

// /features — Features page per rd-app-extra.jsx Artboard_Features.

type PillarTone = "terra" | "navy" | "paper";

interface Pillar {
  cat: string;
  title: string;
  body: string;
  tags: string[];
  tone: PillarTone;
}

const PILLARS: Pillar[] = [
  {
    cat: "AI that closes",
    title: "24/7 bilingual reply engine",
    body:
      "Desk detects language from the first word and replies in French or English — instantly, day or night. Answers MLS questions, qualifies budget, and books showings straight into your calendar.",
    tags: ["EN ↔ FR auto-detect", "38s average reply", "Books into Google/Outlook"],
    tone: "terra",
  },
  {
    cat: "Lead intelligence",
    title: "Priority pipeline, not an inbox",
    body:
      "Every overnight lead gets triaged. Intent, urgency, budget fit, and timeline scored on one line — so your first call each morning is informed, not cold.",
    tags: ["Intent + urgency scoring", "Next-best-action queue", "CRM since 2020"],
    tone: "navy",
  },
  {
    cat: "Built for Canada",
    title: "PIPEDA-native. CASL-aware. RECO-ready.",
    body:
      "Canadian data stays in Canadian data centres. Consent is captured at first touch, logged, and revocable. Quebec disclosures and FINTRAC verifications tracked per deal.",
    tags: ["AWS ca-central-1", "PIPEDA consent log", "Quebec bilingual disclosures"],
    tone: "paper",
  },
];

const CAPABILITIES: { h: string; b: string }[] = [
  { h: "CREA DDF sync", b: "Live MLS listings, 15-minute refresh, pulled straight from your board." },
  { h: "Website chat widget", b: "Drop-in script. Matches your brokerage colours. Routes overflow to Desk." },
  { h: "Email sequences (CASL)", b: "Drip campaigns with consent gating. Auto-pauses on unsubscribe." },
  { h: "Showing calendar", b: "Desk books time slots from your real availability, in the buyer's timezone." },
  { h: "Team routing", b: "Round-robin by geography, language, or listing type — whatever fits your team." },
  { h: "Roles & permissions", b: "Team lead, agent, assistant, brokerage admin. Granular access per lead." },
  { h: "Activity & audit log", b: "Every AI action, every agent touch. Immutable. Exportable for compliance." },
  { h: "Reporting", b: "Response time, source ROI, stage conversion, agent leaderboard. CAD throughout." },
];

export default function Features() {
  return (
    <MarketingLayout>
      <SEO
        title="Features — RealtorDesk AI"
        description="24/7 bilingual AI chatbot, priority pipeline, PIPEDA-native data, CASL-compliant email automations, CREA DDF sync. The feature set Canadian realtors actually use."
        canonicalUrl="https://www.realtordesk.ai/features"
      />

      {/* Hero */}
      <section className="px-8 md:px-20 pt-20 pb-14 max-w-[1280px] mx-auto">
        <RDBadge tone="terra" size="sm" className="mb-5">
          <IconSparkles />
          What Desk does
        </RDBadge>
        <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-semibold tracking-[-0.025em] leading-[1.05] max-w-[900px]">
          One desk that handles the{" "}
          <span className="font-rd-serif italic font-normal text-rd-terra-600">overnight</span>, so
          you can handle the{" "}
          <span className="font-rd-serif italic font-normal text-rd-terra-600">close</span>.
        </h1>
        <p className="text-lg md:text-[20px] text-rd-ink-600 leading-[1.55] max-w-[680px] mt-6">
          Desk is your 24/7 bilingual AI colleague. It replies, qualifies, and books — then hands
          you the conversation when it matters.
        </p>
      </section>

      {/* Three pillars */}
      <section className="px-8 md:px-20 pb-24 max-w-[1280px] mx-auto flex flex-col gap-6">
        {PILLARS.map((pillar, i) => (
          <FeaturePillar key={pillar.title} {...pillar} index={i + 1} />
        ))}
      </section>

      {/* Dark capabilities section */}
      <section className="bg-rd-ink-900 text-white py-20">
        <div className="mx-auto max-w-[1280px] px-8 md:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-end mb-12">
            <div>
              <Eyebrow tone="dark">Everything else</Eyebrow>
              <h2 className="mt-3 text-[36px] md:text-[48px] font-semibold tracking-[-0.02em] leading-[1.05]">
                The plumbing,{" "}
                <span className="font-rd-serif italic font-normal text-rd-terra-400">done right</span>.
              </h2>
            </div>
            <p className="text-[17px] text-white/65 leading-[1.6]">
              The unsexy stuff most real-estate SaaS forgets. We don't. Each of these is the
              default, not a premium add-on.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CAPABILITIES.map((c) => (
              <div
                key={c.h}
                className="p-6 bg-white/[0.04] border border-white/[0.08] rounded-[14px]"
              >
                <div className="w-7 h-7 bg-rd-terra-600 rounded-[8px] mb-4 flex items-center justify-center">
                  <IconCheck />
                </div>
                <div className="text-[15px] font-semibold mb-1.5">{c.h}</div>
                <div className="text-[13px] text-white/65 leading-[1.55]">{c.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 md:px-20 py-20 max-w-[1280px] mx-auto text-center">
        <h2 className="text-[36px] md:text-[48px] font-semibold tracking-[-0.02em] leading-[1.1] max-w-[800px] mx-auto mb-5">
          Free for 14 days.{" "}
          <span className="font-rd-serif italic font-normal text-rd-terra-600">No card.</span>
        </h2>
        <p className="text-[17px] text-rd-ink-600 max-w-[520px] mx-auto mb-8">
          Connect your DDF feed, answer a few questions about your brokerage, and Desk is
          answering leads within 15 minutes.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/signup">
            <RDButton variant="terra" size="lg" trailingIcon={<IconArrow />}>
              Start free trial
            </RDButton>
          </Link>
          <Link to="/demo">
            <RDButton variant="outline" size="lg">
              Book a demo
            </RDButton>
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}

/* ────────────────────────────────────────────────────────── */

type PillarProps = Pillar & { index: number };

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

function FeaturePillar({ cat, title, body, tags, tone, index }: PillarProps) {
  const t = TONE[tone];
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-[60px_1fr_1.2fr] gap-8 lg:gap-10 p-9 ${t.bg} rounded-[20px] border border-rd-line items-start`}
    >
      <div
        className={`font-rd-serif italic text-[48px] lg:text-[56px] font-normal tracking-[-0.02em] leading-none ${t.num}`}
      >
        0{index}
      </div>
      <div>
        <RDBadge tone={t.badge} size="sm" className="mb-3.5">
          {cat}
        </RDBadge>
        <h3 className="text-[26px] lg:text-[32px] font-semibold tracking-[-0.015em] leading-[1.15] mb-3">
          {title}
        </h3>
        <p className="text-base text-rd-ink-700 leading-[1.6]">{body}</p>
      </div>
      <div className="flex flex-col gap-2.5 lg:pt-12">
        {tags.map((tag) => (
          <div
            key={tag}
            className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white border border-rd-line rounded-rd-md text-[13px] font-medium"
          >
            <span className={t.ring}>
              <IconCheck />
            </span>
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
}
