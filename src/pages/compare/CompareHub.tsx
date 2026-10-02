import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

// /compare — the hub the brief asks for. There was none: nine vendors' worth
// of comparison pages and no page that listed them.
//
// ONE DESTINATION PER VENDOR, DELIBERATELY. The sitemap holds 18 comparison URLs
// for 9 vendors: four each for BoldTrail and Lofty, three for IXACT. They are
// NOT duplicates. Measured 2026-09-29 (six-word shingle overlap, REDESIGN-PHASE-0-
// AUDIT.md section 13), the highest content containment between any pair is 0.26
// against a near-duplicate threshold around 0.45, and the titles target
// different intents (alternative, versus, migration, research).
//
// The hub links one page per vendor because a hub is a short list, not because
// the others are redundant. Whether any pair trades positions on one query is a
// Search Console question this repo cannot answer; consolidate only pairs that
// show it.
//
// No comparison table on this page. Every factual cell belongs on the vendor
// page that can date and source it, and a summary table here would be a second
// copy to keep true.

interface Rival {
  vendor: string;
  to: string;
  /** Who should read it. Not a verdict on the competitor. */
  fit: string;
  /** Publishes a price, or quotes on request. Checked 2026-09-28. */
  pricing: "published" | "on request";
}

// `pricing` is the one fact stated here rather than on the vendor page, because
// it is the same check for all of them and it is the thing a buyer can verify
// in thirty seconds. Verified 2026-09-28 against each vendor's own site.
const RIVALS: Rival[] = [
  {
    vendor: "BoldTrail (formerly kvCORE)",
    to: "/compare/boldtrail",
    fit: "Large teams weighing a full lead-gen suite against a CRM that does less on purpose.",
    pricing: "on request",
  },
  {
    vendor: "Lofty (formerly Chime)",
    to: "/lofty-alternative",
    fit: "Agents who want the AI features without the US-market assumptions underneath them.",
    pricing: "on request",
  },
  {
    vendor: "Follow Up Boss",
    to: "/switch-from-follow-up-boss",
    fit: "Teams who like its follow-up discipline and want Canadian hosting and French.",
    pricing: "published",
  },
  {
    vendor: "IXACT Contact",
    to: "/vs/ixact",
    fit: "Canadian agents already on a low-cost CRM, asking what more spend actually buys.",
    pricing: "published",
  },
  {
    vendor: "Wise Agent",
    to: "/vs/wise-agent",
    fit: "Solo agents comparing a cheaper US product against one billed and hosted here.",
    pricing: "published",
  },
  {
    vendor: "LionDesk",
    to: "/switch-from-liondesk",
    fit: "Anyone moving off LionDesk, which Lone Wolf discontinued in September 2025.",
    pricing: "published",
  },
  {
    vendor: "Real Geeks",
    to: "/compare/real-geeks-alternative",
    fit: "Agents who bought it for the website and are now judging the CRM behind it.",
    pricing: "published",
  },
  {
    vendor: "Top Producer",
    to: "/compare/top-producer-alternative",
    fit: "Long-time users deciding whether to modernise or move.",
    pricing: "published",
  },
  {
    vendor: "BoomTown",
    to: "/blog/boomtown-alternative-canada",
    fit: "Teams comparing a lead-generation platform with a CRM attached.",
    pricing: "on request",
  },
];

const FAQS = [
  {
    q: "Why do some of these say the price is not published?",
    a: "Because it is not. Checked on 2026-09-28: BoldTrail, Lofty and BoomTown ask you to book a demo and quote afterwards. We will not print a number we cannot point at, and we will not calculate your savings against a number we made up. Where a vendor does publish, we quote it and say where it came from.",
  },
  {
    q: "Are these comparisons fair?",
    a: "They are ours, so judge them accordingly. What we can commit to is narrower and checkable: no invented competitor prices, no fabricated customer quotes, and a plain statement of what Realtor Desk does not do — no teams, no seats, no native CREA DDF® sync until Q3 2026.",
  },
  {
    q: "Which one should I read?",
    a: "The one you are currently paying. If you are not paying for anything yet, skip these and read what a real estate CRM actually is instead — comparison pages are written for people who have already decided they need one.",
  },
  {
    q: "What if the CRM I use is not listed?",
    a: "Then we have not written an honest page about it yet, and we would rather have a gap than a thin one. Tell us which it is and what you are trying to work out, and we will answer the specific question by email.",
  },
];

const CompareHub = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Compare Realtor Desk to other real estate CRMs"
        description="Side-by-side comparisons against the CRMs Canadian agents actually switch from, including which vendors publish a price and which quote on request."
        keywords="real estate crm comparison, canadian crm alternatives, compare real estate crm"
        canonicalUrl="https://www.realtordesk.ai/compare"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Compare Realtor Desk to other real estate CRMs",
            url: "https://www.realtordesk.ai/compare",
            hasPart: RIVALS.map((r) => ({
              "@type": "WebPage",
              name: `Realtor Desk compared with ${r.vendor}`,
              url: `https://www.realtordesk.ai${r.to}`,
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />
      <Navbar />

      <main>
        <section className="pt-32 md:pt-40 pb-10">
          <div className="container-custom max-w-3xl">
            <h1 className="mb-6">Compare Realtor Desk</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Nine comparisons against the CRMs Canadian agents actually switch
              from. Each one says who the other product suits, not just who it
              does not.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <div>
              <h2 className="mb-4">Before you read any of them</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Three of these vendors do not publish a price. Checked on
                2026-09-28: BoldTrail, Lofty and BoomTown all ask you to book a
                demo first. That matters more than it sounds, because it means
                any &ldquo;save 80% versus X&rdquo; claim you read anywhere,
                including from us, was calculated against a number somebody
                invented. We used to publish exactly that and have removed it.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Realtor Desk is $149 CAD a month for a single agent and $299 for
                the Team plan, with no setup fee. It is on the pricing page and
                on the checkout. Compare that against a written quote, not
                against a guess.
              </p>
            </div>

            <div>
              <h2 className="mb-6">The comparisons</h2>
              <ul className="space-y-4 list-none p-0 m-0">
                {RIVALS.map((r) => (
                  <li key={r.to}>
                    <Link
                      to={r.to}
                      className="block rounded-lg border p-5 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <span className="text-base font-semibold">
                          Realtor Desk vs {r.vendor}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {r.pricing === "published"
                            ? "Publishes a price"
                            : "Quotes on request"}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                        {r.fit}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mb-4">Where Realtor Desk is the wrong answer</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you run a team and need seats, lead assignment or a shared
                pipeline, we do not have them — there is no team model in the
                product at all, and the Team plan is a billing tier. If you need
                native CREA DDF® sync today, ours is on the roadmap for Q3 2026
                and Realtor.ca import is what works now. If you want a CRM
                bundled with paid lead generation, that is not what this is.
                Those are the three reasons people leave, and it is cheaper for
                both of us if you find out here.
              </p>
            </div>

            <div>
              <h2 className="mb-6">Questions</h2>
              <div className="space-y-6">
                {FAQS.map((f) => (
                  <div key={f.q}>
                    <h3 className="text-base font-semibold mb-2">{f.q}</h3>
                    <p className="text-muted-foreground leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <Card className="p-8 text-center">
              <h2 className="mb-3">Or skip the reading</h2>
              <p className="text-muted-foreground mb-6">
                Fourteen days, your own leads, no charge before day 14.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild>
                  <Link to="/signup">Start free trial</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/pricing">See pricing</Link>
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CompareHub;
