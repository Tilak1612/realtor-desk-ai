import { Link } from "react-router-dom";
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

// /  — Home page per rd-marketing.jsx Artboard_Home.

export default function Home() {
  return (
    <MarketingLayout>
      <SEO
        title="RealtorDesk AI — The Canadian real estate CRM, powered by AI"
        description="Desk AI answers every lead in French or English, CASL-aware, PIPEDA-native, CREA DDF-ready. Built for Canadian realtors."
        canonicalUrl="https://www.realtordesk.ai/"
      />

      <HeroSection />
      <TrustStrip />
      <FeatureGrid />
      <PipelinePreview />
      <CompareStrip />
      <TestimonialAndCTA />
    </MarketingLayout>
  );
}

/* ──────────────────────────────────────────────────────────
 * HERO
 * ────────────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="px-8 md:px-14 pt-[100px] pb-10 relative overflow-hidden">
      <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-16 items-center">
        <div>
          <RDBadge tone="terra" size="sm" className="mb-6">
            <IconSparkle />
            Now in public beta · 14-day free trial
          </RDBadge>
          <h1 className="text-[34px] sm:text-[48px] md:text-[56px] lg:text-[76px] font-semibold tracking-[-0.025em] leading-[1.02] text-rd-ink-900 break-words">
            Close more deals.{" "}
            <span className="font-rd-serif italic font-normal text-rd-navy-800">Calmly.</span>
          </h1>
          <p className="text-lg lg:text-[20px] leading-[1.55] text-rd-ink-600 mt-6 max-w-[520px]">
            RealtorDesk AI answers every lead the instant they land — in French or English,
            on-brand, PIPEDA-aware. You show up to a shortlist, not a fire drill.
          </p>
          <div className="flex flex-wrap gap-3 mt-9">
            <Link to="/signup">
              <RDButton variant="primary" size="lg" trailingIcon={<IconArrow />}>
                Start 14-day free trial
              </RDButton>
            </Link>
            <Link to="/demo">
              <RDButton variant="outline" size="lg">
                Book a 15-min demo
              </RDButton>
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-4 md:gap-[18px] mt-8 text-[13px] text-rd-ink-500">
            <span className="inline-flex items-center gap-1.5">
              <IconCheck className="text-rd-success" />
              No credit card
            </span>
            <span className="inline-flex items-center gap-1.5">
              <IconCheck className="text-rd-success" />
              5-min setup
            </span>
            <span className="inline-flex items-center gap-1.5">
              <IconCheck className="text-rd-success" />
              CREA DDF ready
            </span>
          </div>
        </div>

        <HeroProduct />
      </div>
    </section>
  );
}

function HeroProduct() {
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
              <span className="font-semibold text-sm">Desk AI · Live</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-white/60">
              <span className="w-1.5 h-1.5 bg-rd-success rounded-full" />
              answering now
            </div>
          </div>

          {/* Lead message */}
          <div className="mt-6 flex gap-3 items-start">
            <RDAvatar name="Émilie Tremblay" size={32} tone="var(--rd-terra-700)" />
            <div className="bg-white/[0.08] rounded-[4px_14px_14px_14px] px-3.5 py-3 text-[13px] leading-[1.5] max-w-[85%]">
              Bonsoir — est-ce que le condo sur rue St-Laurent est encore disponible ? Je peux
              visiter demain soir.
            </div>
          </div>

          {/* AI reply */}
          <div className="mt-4 flex gap-3 items-start flex-row-reverse">
            <div className="w-8 h-8 bg-rd-terra-600 rounded-full flex items-center justify-center flex-shrink-0">
              <IconSparkles />
            </div>
            <div className="bg-rd-terra-600 text-white rounded-[14px_4px_14px_14px] px-3.5 py-3 text-[13px] leading-[1.5] max-w-[85%]">
              Oui, Émilie ! Il est disponible. J'ai un créneau demain à 19h ou 19h30 — lequel vous
              convient ? Je vous envoie l'adresse par texto.
            </div>
          </div>

          {/* Captured card */}
          <div className="mt-auto p-3.5 bg-white/[0.06] rounded-rd-md border border-white/10">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] uppercase tracking-[0.08em] text-white/60 font-semibold">
                Lead captured
              </span>
              <RDBadge tone="terra" size="sm">Hot · 92</RDBadge>
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <KV k="Listing" v="Le Plateau · $680K" />
              <KV k="Timeline" v="Tomorrow 7pm" />
              <KV k="Lang" v="French (detected)" />
              <KV k="Budget fit" v="✓ pre-approved" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating KPI — hidden under 640px so the `-left-9` offset can't
          push past the viewport edge and trigger a horizontal scroll. */}
      <div className="hidden sm:flex absolute -bottom-6 -left-9 bg-white border border-rd-line rounded-rd-lg px-5 py-4 shadow-rd-md items-center gap-3.5">
        <div className="w-2 h-2 bg-rd-success rounded-full" />
        <div>
          <div className="text-[11px] text-rd-ink-500 uppercase tracking-[0.06em] font-semibold">
            Avg response time
          </div>
          <div className="text-[22px] font-bold tracking-[-0.01em]">
            32s{" "}
            <span className="text-[13px] text-rd-success font-semibold">−96%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-white/50 text-[10px] uppercase tracking-[0.06em]">{k}</div>
      <div className="text-white font-medium text-[13px] mt-0.5">{v}</div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
 * TRUST STRIP
 * ────────────────────────────────────────────────────────── */
function TrustStrip() {
  const logos = ["CREA DDF®", "Stripe", "OpenAI", "Twilio", "Supabase", "RECO"];
  return (
    <section className="px-8 md:px-14 py-8 border-y border-rd-line bg-white">
      <div className="mx-auto max-w-[1200px] flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-rd-ink-500">
          Built with · integrated for
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-3 items-center font-bold text-[17px] text-rd-ink-600/70">
          {logos.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
 * FEATURE GRID
 * ────────────────────────────────────────────────────────── */
function FeatureGrid() {
  return (
    <section className="px-8 md:px-14 py-24 lg:py-[120px]">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <Eyebrow>Why RealtorDesk</Eyebrow>
            <h2 className="mt-2.5 text-[36px] md:text-[48px] font-semibold tracking-[-0.02em] leading-[1.08] max-w-[720px]">
              An AI teammate who speaks Canadian real estate.
            </h2>
          </div>
          <p className="text-base leading-[1.55] text-rd-ink-600 max-w-[340px]">
            Five capabilities, one clean console. No plugins, no duct-tape integrations, no
            midnight follow-ups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Feature
            big
            icon={<IconSparkles />}
            title="24/7 AI chatbot"
            desc="Answers MLS questions, qualifies budget, books showings into your calendar — in the tone you train it on."
          />
          <Feature
            icon={<IconGlobe />}
            title="Bilingual EN · FR"
            desc="Detects the lead's language from the first message. RECO-Quebec ready out of the box."
          />
          <Feature
            icon={<IconShield />}
            title="PIPEDA-native"
            desc="Canadian-hosted data. Consent timestamps on every lead. CASL-compliant email footers."
          />
          <Feature
            icon={<IconPipeline />}
            title="Pipeline that moves"
            desc="Drag-drop kanban, AI-suggested next step, deal-value rollup — nothing sits stale for 14 days."
          />
          <Feature
            icon={<IconLead />}
            title="Lead scoring"
            desc="Intent, urgency, budget, timeline. A live 0-100 score with the 'why' in plain English."
          />
          <Feature
            icon={<IconBolt />}
            title="Email automations"
            desc="Drip templates written for Canadian markets — Toronto pre-construction, Calgary first-time buyers, Montreal relocs."
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
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  big?: boolean;
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
          Meet Desk AI
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
function PipelinePreview() {
  return (
    <section className="px-8 md:px-14 py-[100px] bg-rd-ink-900 text-white relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] opacity-50 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--rd-navy-700) 0%, transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 items-center">
        <div>
          <Eyebrow tone="dark">The morning read</Eyebrow>
          <h2 className="mt-2.5 text-[32px] md:text-[44px] font-semibold tracking-[-0.02em] leading-[1.1]">
            You show up to a prioritized pipeline. Not an inbox.
          </h2>
          <p className="text-[17px] leading-[1.6] text-white/70 mt-5 max-w-[440px]">
            Every overnight lead triaged. Hot prospects surface at the top with a timestamped
            transcript of what AI already said — so your first call is informed, not a cold intro.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link to="/signup">
              <RDButton variant="terra" trailingIcon={<IconArrow />}>
                Try the pipeline
              </RDButton>
            </Link>
            <Link to="/demo">
              <RDButton variant="ghost" className="text-white hover:bg-white/10">
                Watch 2-min tour
              </RDButton>
            </Link>
          </div>
        </div>
        <MiniPipeline />
      </div>
    </section>
  );
}

function MiniPipeline() {
  const cols: {
    title: string;
    count: number;
    tone: string;
    cards: { name: string; area: string; tag: "Hot" | "Warm" }[];
  }[] = [
    {
      title: "New leads",
      count: 12,
      tone: "bg-rd-terra-600",
      cards: [
        { name: "Hassan A.", area: "Mississauga", tag: "Hot" },
        { name: "Émilie T.", area: "Le Plateau", tag: "Hot" },
        { name: "Chen W.", area: "Richmond BC", tag: "Warm" },
      ],
    },
    {
      title: "Contacted",
      count: 7,
      tone: "bg-rd-navy-400",
      cards: [
        { name: "Olivia K.", area: "Leslieville", tag: "Warm" },
        { name: "Kenji P.", area: "Kitsilano", tag: "Warm" },
      ],
    },
    {
      title: "Showing booked",
      count: 4,
      tone: "bg-rd-success",
      cards: [{ name: "Priya S.", area: "Oakville", tag: "Hot" }],
    },
  ];
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
                      k.tag === "Hot" ? "text-rd-terra-400" : "text-rd-navy-300"
                    }`}
                  >
                    {k.tag}
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
function CompareStrip() {
  const rows: { cap: string; them: string | boolean; us: string | boolean }[] = [
    { cap: "Canadian hosting (PIPEDA)", them: false, us: true },
    { cap: "Bilingual EN/FR out of the box", them: "Add-on", us: true },
    { cap: "CASL-compliant email", them: "Manual", us: true },
    { cap: "CREA DDF® native integration", them: "3rd-party", us: true },
    { cap: "CAD pricing", them: "USD, +20%", us: true },
    { cap: "Time to first AI response", them: "2–3 days", us: "5 minutes" },
  ];

  return (
    <section className="px-8 md:px-14 py-[100px] bg-white">
      <div className="mx-auto max-w-[1200px] text-center">
        <Eyebrow>The BoldTrail alternative</Eyebrow>
        <h2 className="mt-2.5 text-[32px] md:text-[44px] font-semibold tracking-[-0.02em] leading-[1.1] max-w-[820px] mx-auto">
          US-first tools, retrofit for Canada. Or us — where Canada is the brief.
        </h2>
      </div>

      <div className="mx-auto max-w-[1100px] mt-12 bg-white border border-rd-line rounded-rd-lg shadow-rd-sm overflow-hidden">
        <div className="grid grid-cols-[1.6fr_1fr_1fr] px-7 py-5 bg-rd-ink-50 border-b border-rd-line text-[11px] font-bold uppercase tracking-[0.1em] text-rd-ink-500 items-center">
          <div>Capability</div>
          <div className="text-center text-rd-ink-600 text-sm normal-case tracking-normal font-semibold">
            BoldTrail
          </div>
          <div className="text-center text-rd-navy-800 text-sm normal-case tracking-normal font-bold flex items-center gap-2 justify-center">
            <RDMark size={18} />
            RealtorDesk AI
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
                  Included
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
            See the full comparison
          </RDButton>
        </Link>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
 * TESTIMONIAL + CTA
 * ────────────────────────────────────────────────────────── */
function TestimonialAndCTA() {
  return (
    <section className="px-8 md:px-14 pt-[100px] pb-[120px]">
      <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-stretch">
        {/* Testimonial */}
        <div className="bg-white border border-rd-line rounded-rd-xl p-10 md:p-12 relative">
          <div className="text-[72px] leading-none text-rd-terra-600 font-rd-serif">"</div>
          <p className="text-[20px] md:text-[22px] leading-[1.45] text-rd-ink-900 font-medium -mt-5">
            I closed a $1.4M listing on day three because RealtorDesk answered the lead at 11:42
            p.m. in French. I called her back at 9 a.m. with the whole transcript. That's the
            product.
          </p>
          <div className="flex items-center gap-3 mt-8">
            <RDAvatar name="Sarah Khoury" size={40} tone="var(--rd-navy-700)" />
            <div>
              <div className="font-semibold text-sm">Sarah Khoury</div>
              <div className="text-[13px] text-rd-ink-500">Broker · Royal LePage Toronto</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-rd-navy-800 rounded-rd-xl p-10 md:p-12 text-white flex flex-col justify-between gap-8">
          <div>
            <h3 className="text-[28px] md:text-[32px] font-semibold tracking-[-0.01em] leading-[1.15]">
              Start your 14-day trial.
            </h3>
            <p className="text-[15px] text-white/70 mt-3 leading-[1.55]">
              No credit card. Full access. Import one lead, send one bilingual reply — then decide.
            </p>
          </div>
          <Link to="/signup">
            <RDButton variant="terra" size="lg" trailingIcon={<IconArrow />}>
              Claim your desk
            </RDButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
