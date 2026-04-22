import { Fragment } from "react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { MarketingLayout } from "@/components/rd/marketing/MarketingLayout";
import { Eyebrow } from "@/components/rd/marketing/Eyebrow";
import { RDButton, IconArrow } from "@/components/rd";
import { cn } from "@/lib/utils";

// /compare/boldtrail — Compare page per rd-marketing.jsx Artboard_Compare.
// Static content — matches the design's comparison table sourced from
// BoldTrail's own help center + G2 signals (see PR #23 for source
// citations if a reader wants to drill in).

interface CompareItem {
  f: string;
  bt: string;
  rd: string;
}

const SECTIONS: { section: string; items: CompareItem[] }[] = [
  {
    section: "Canadian fit",
    items: [
      { f: "Canadian-hosted data (PIPEDA)", bt: "✕ US-only", rd: "✓ Canadian data centers" },
      { f: "Bilingual EN · FR", bt: "Add-on, $$", rd: "✓ Built in" },
      { f: "CASL email auto-footers", bt: "Manual template", rd: "✓ Automatic" },
      { f: "CREA DDF® integration", bt: "3rd-party plugin", rd: "✓ Native" },
      { f: "CAD pricing", bt: "USD + ~20% premium", rd: "✓ Pure CAD" },
    ],
  },
  {
    section: "AI & speed",
    items: [
      { f: "AI lead response time", bt: "2–3 min", rd: "< 45s" },
      { f: "Bilingual AI out of the box", bt: "✕", rd: "✓" },
      { f: "Voice AI coming 2026", bt: "Unknown", rd: "Q3 2026, in beta now" },
    ],
  },
  {
    section: "Cost",
    items: [
      { f: "Starting price", bt: "USD $499 setup + $99/mo", rd: "CAD $149/mo, no setup" },
      { f: "Annual plan (single agent)", bt: "USD $1,188/yr", rd: "CAD $999/yr — save $789" },
      { f: "Per-user cost after 5", bt: "USD $49", rd: "CAD $15" },
      { f: "Onboarding fee", bt: "USD $499", rd: "Included" },
    ],
  },
];

const BT_STATS: [string, string][] = [
  ["2008", "Founded"],
  ["KW", "Parent co."],
  ["USD", "Pricing"],
];
const RD_STATS: [string, string][] = [
  ["2025", "Launched"],
  ["YEG", "HQ"],
  ["CAD", "Pricing"],
];

export default function CompareBoldtrail() {
  return (
    <MarketingLayout>
      <SEO
        title="RealtorDesk AI vs BoldTrail — the Canadian-first alternative"
        description="BoldTrail is a great platform — for KW agents in Dallas. If you're selling pre-construction in Mississauga or condos in Le Plateau, here's how we compare."
        canonicalUrl="https://www.realtordesk.ai/compare/boldtrail"
      />

      {/* Hero */}
      <section className="px-8 md:px-14 pt-20 pb-10">
        <div className="mx-auto max-w-[1100px] text-center">
          <Eyebrow className="mx-auto">Realtor Desk vs BoldTrail</Eyebrow>
          <h1 className="mt-3.5 text-[40px] md:text-[56px] lg:text-[64px] font-semibold tracking-[-0.025em] leading-[1.05]">
            One's built for the US.{" "}
            <span className="font-rd-serif italic font-normal text-rd-navy-800">
              One's built for you
            </span>
            .
          </h1>
          <p className="text-lg text-rd-ink-600 max-w-[680px] mx-auto mt-5 leading-[1.55]">
            BoldTrail is a great platform — for Keller Williams agents in Dallas. If you're
            selling pre-construction in Mississauga or condos in Le Plateau, a few things change.
          </p>
        </div>
      </section>

      {/* Hero cards */}
      <section className="px-8 md:px-14 pb-8">
        <div className="mx-auto max-w-[1100px] grid grid-cols-1 md:grid-cols-2 gap-5">
          <CompareHeroCard
            name="BoldTrail"
            tagline="The US market leader"
            stats={BT_STATS}
            variant="muted"
          />
          <CompareHeroCard
            name="Realtor Desk"
            tagline="The Canadian-first alternative"
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
            Ready to trade USD for a product that speaks your market?
          </h2>
          <p className="text-base text-white/70 mt-3.5 leading-[1.55]">
            Import your BoldTrail leads in one click. 14-day trial. We'll match your remaining
            annual contract.
          </p>
          <div className="inline-flex flex-wrap gap-3 mt-8 justify-center">
            <Link to="/signup">
              <RDButton variant="terra" size="lg" trailingIcon={<IconArrow />}>
                Start your switch
              </RDButton>
            </Link>
            <Link to="/contact">
              <RDButton variant="light" size="lg">
                Talk to a Canadian
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
