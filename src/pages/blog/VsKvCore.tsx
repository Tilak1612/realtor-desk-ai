import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { FAQAccordion } from "@/components/rd/marketing/FAQAccordion";

// /blog/vs-kvcore — rewritten 2026-10-02.
//
// The previous version opened by calling Realtor Desk "Canada's first AI-native
// CRM", said it uses "full GPT-4 powered conversational AI ... Voice AI for phone
// calls" and "predictive lead scoring", that its AI "responds automatically in
// under 3 seconds, 24/7/365 ... and books showings", and that it "automatically
// detects language preference and responds". Realtor Desk has no lead-facing AI,
// no voice agent, and a rule-based score. It also set kvCORE's response times at
// "5-15 minutes (or hours outside business hours)" with no source. The pricing
// section was already replaced on 2026-09-28, because kvCORE publishes no prices.
//
// FACTS ABOUT BOLDTRAIL (the product kvCORE was renamed to) were read from
// boldtrail.com on 2026-10-02: its self-description, its product areas, the
// absence of prices (it directs visitors to request a demo), and the absence of
// any mention of Canada, French or Canadian MLS.
//
// INTENT. This page answers the legacy-name query "kvCORE". The side-by-side is
// /compare/boldtrail and the alternative page is /vs/boldtrail.

const AREAS: { area: string; rd: string }[] = [
  { area: "Smart CRM", rd: "Yes. Contacts, one conversation timeline per client, lead scoring and a deal pipeline." },
  { area: "Integrated AI", rd: "Partly. An in-app assistant drafts replies and summarises a thread on the contact you have open. It does not act on its own or message leads." },
  { area: "IDX websites", rd: "No. Realtor Desk does not build or host agent websites." },
  { area: "Lead Engine", rd: "No. It does not generate or buy leads. Leads come in by Zapier, Make, n8n or by hand." },
  { area: "Marketing Autopilot", rd: "No. A sequence builder exists, but scheduled sending is not switched on." },
  { area: "Transaction integration", rd: "No. The pipeline tracks deals and values, not a transaction's documents or deadlines." },
  { area: "Business analytics", rd: "Basic reporting: response time, deals closed, stage conversion and lead source, in CAD." },
  { area: "BackOffice (billing, accounting, commissions) and Recruit", rd: "No. Realtor Desk is a single-agent CRM, not a brokerage back office." },
];

const QUESTIONS = [
  "What is the total first-year cost for my team size, including setup, onboarding, add-ons from the marketplace and any lead-generation spend?",
  "What is the contract length, and what does it cost to leave early?",
  "Where is my data stored, and which third parties process it?",
  "Does it record the date and source of consent for each contact, so I can answer a CASL complaint?",
  "Does it work in French, in the interface and in client email?",
  "Which Canadian listing source does it use, and is it a licensed feed?",
];

const FAQS = [
  {
    q: "Is kvCORE the same as BoldTrail?",
    a: "Yes. kvCORE is the older name; the product is now sold as BoldTrail. Pages that still say kvCORE are using the previous name.",
  },
  {
    q: "Does BoldTrail publish its pricing?",
    a: "No. The BoldTrail pages we read show no prices and direct visitors to request a demo. Any figure quoted elsewhere is a guess unless it comes from a quote you were given.",
  },
  {
    q: "Does BoldTrail support Canadian agents?",
    a: "Ask them. The BoldTrail homepage we read does not mention Canada, French or Canadian MLS, so we cannot tell you either way. Get the answers in writing.",
  },
  {
    q: "Is Realtor Desk a replacement for BoldTrail?",
    a: "For a small part of it. BoldTrail lists websites, lead generation, marketing automation, back office and recruiting tools. Realtor Desk is a single-agent CRM with lead scoring, a pipeline and one conversation timeline per client, and it is the wrong choice if you need the rest.",
  },
];

const VsKvCore = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Realtor Desk vs kvCORE for Canadian Agents"
        description="kvCORE is now BoldTrail. What it says it offers, what it does not publish on price or Canada, and six questions to ask before you buy. Checked October 2026."
        keywords="kvCORE alternative Canada, kvCORE vs Realtor Desk, kvCORE pricing, BoldTrail kvCORE, kvCORE review Canadian agents"
        article
        publishedTime="2025-01-16"
        modifiedTime="2026-10-02"
        author="Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/blog/vs-kvcore"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "kvCORE (now BoldTrail) for Canadian agents: what to ask first",
            description:
              "kvCORE is now BoldTrail. What it says it offers, what it does not publish, and what a Canadian agent should ask before buying.",
            author: { "@type": "Organization", name: "Realtor Desk" },
            publisher: { "@type": "Organization", name: "Realtor Desk" },
            datePublished: "2025-01-16",
            dateModified: "2026-10-02",
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

      <article className="pt-32 md:pt-40 pb-20">
        <div className="container-custom max-w-3xl">
          <Link to="/resources">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Resources
            </Button>
          </Link>

          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Updated October 2, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>4 min read</span>
              </div>
            </div>
            <h1 className="mb-6">kvCORE, now BoldTrail: what to ask before you buy</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              kvCORE is the older name for BoldTrail, a broad real estate platform. This
              page covers what BoldTrail says it offers, what it does not publish, and
              how Realtor Desk differs.
            </p>
          </header>

          <Card className="p-6 mb-8">
            <h2 className="text-lg font-bold mb-3">Short answer</h2>
            <p className="text-base mb-3">
              BoldTrail is a far larger product than Realtor Desk and publishes no
              prices, so no honest price comparison exists. Whether it suits a
              Canadian agent depends on answers its homepage does not give.
            </p>
            <p className="text-sm text-muted-foreground mb-0">
              We build Realtor Desk, a competitor, so weigh this accordingly. BoldTrail
              facts were read from its own site on October 2, 2026.
            </p>
          </Card>

          <div className="prose prose-lg max-w-none">
            <h2>What BoldTrail says it offers</h2>
            <p>
              BoldTrail calls itself an AI-powered real estate solution. Its platform
              lists IDX websites, a lead engine, a smart CRM, marketing autopilot,
              transaction integration, business analytics and integrated AI. It also
              lists a back-office product for billings, onboarding, accounting and
              commissions, a recruiting product, and a marketplace of add-ons.
            </p>

            <h2>Where Realtor Desk overlaps, and where it does not</h2>
            <div className="overflow-x-auto not-prose my-6">
              <table className="min-w-full text-sm">
                <caption className="text-left text-muted-foreground pb-3">
                  BoldTrail&rsquo;s product areas, as listed on its homepage, and what Realtor
                  Desk offers in each.
                </caption>
                <thead>
                  <tr className="border-b-2 text-left">
                    <th scope="col" className="py-2 pr-4 font-semibold">BoldTrail area</th>
                    <th scope="col" className="py-2 font-semibold">Realtor Desk</th>
                  </tr>
                </thead>
                <tbody>
                  {AREAS.map((r) => (
                    <tr key={r.area} className="border-b align-top">
                      <th scope="row" className="py-3 pr-4 text-left font-semibold">{r.area}</th>
                      <td className="py-3 text-muted-foreground">{r.rd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2>What BoldTrail does not publish</h2>
            <p>
              The BoldTrail pages we read show no prices and direct visitors to request
              a demo. They also do not mention Canada, French or Canadian MLS. That
              makes any &ldquo;kvCORE costs $X&rdquo; figure a guess, including the ones
              that used to appear on this page, and we removed ours.
            </p>

            <h2>Six questions to ask BoldTrail</h2>
            <ol>
              {QUESTIONS.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ol>
            <p>
              Ask for the answers in writing. For the side-by-side see{" "}
              <Link to="/compare/boldtrail">Realtor Desk vs BoldTrail</Link>, and for the
              alternative angle see <Link to="/vs/boldtrail">BoldTrail alternative</Link>.
              For a wider view of what vendors publish, see the{" "}
              <Link to="/blog/best-crm-canada-2025">guide to choosing a CRM in Canada</Link>.
            </p>

            <h2>Questions</h2>
          </div>

          <FAQAccordion items={FAQS} className="mb-12" />

          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">See the smaller product on your own contacts</h2>
            <p className="text-muted-foreground mb-6">
              14 days, then CAD $149 a month. A card is collected up front and nothing is
              charged before day 14.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild>
                <Link to="/signup">Start free trial</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/compare/boldtrail">Compare side by side</Link>
              </Button>
            </div>
          </Card>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default VsKvCore;
