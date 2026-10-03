import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { FAQAccordion } from "@/components/rd/marketing/FAQAccordion";

// /blog/vs-lofty-crm — rewritten 2026-10-02 as a review, not a scorecard.
//
// WHY. The previous version opened with "Lofty CRM has 237 features. You'll use
// 12. RealtorDesk AI has 8 core features." and went on to publish a Lofty price
// list ($499 / $799 / $1,200+ USD a month, setup fees of $2,000-5,000, training
// fees of $500-1,500), a "first year cost" of $11,800 against our $1,788, a
// "$10,012 saving", a "97.5% feature usage" figure, "our testing found the
// average agent uses 11%", "4-6 weeks" versus "1-3 days" setup, a "$30M+ in
// funding" line, a "2.7 seconds" AI response time we do not have, and "CASL
// violations up to $1,000,000" (the maximum is $10 million for a business).
// None of it was sourced. Lofty publishes no prices.
//
// WHAT THIS PAGE USES INSTEAD. Only what lofty.com says about itself, read on
// 2026-10-02: its pricing page (four tiers, each with a "Request Pricing"
// button, and the sentence quoted below) and its homepage product areas. Where a
// page did not say something, this page says it was not mentioned rather than
// that it is absent.
//
// INTENT. /vs/lofty is the side-by-side. This page is the "should I buy Lofty and
// what do I ask" review, which is why it is titled differently.

const LOFTY_AREAS: { area: string; rd: string }[] = [
  { area: "Real estate CRM", rd: "Yes. Contacts, one conversation timeline per client, lead scoring and a deal pipeline." },
  { area: "AI (described as agentic, acting for you)", rd: "Partly. The AI assistant inside the CRM drafts replies and summarises a thread on a contact you have open. It does not act on its own or message leads unattended." },
  { area: "IDX website", rd: "No. Realtor Desk does not build or host agent websites." },
  { area: "Lead generation services", rd: "No. It does not sell or run lead generation or advertising." },
  { area: "Power dialer", rd: "No. SMS is available, gated on recorded consent, but there is no dialer." },
  { area: "Smart Plans (automated multi-step workflows)", rd: "No. A sequence builder exists, but scheduled sending is not switched on." },
  { area: "Social Studio", rd: "No." },
  { area: "Transaction management", rd: "No. The pipeline tracks deals and values; it does not manage a transaction's documents or deadlines." },
  { area: "Mobile apps", rd: "No native app. Realtor Desk is a responsive web app." },
];

const QUESTIONS = [
  "What is the total first-year cost for my plan, including setup, onboarding, training and any lead-generation commitment?",
  "Which of those charges are optional, and which are required to get the features shown in the demo?",
  "How many seats does my quote include, and what does each extra seat cost?",
  "What is the contract length, and what does it cost to leave early?",
  "Where is my data stored, and which third parties process it?",
  "Does the product record the date and source of consent for each contact, so I can answer a CASL complaint?",
  "Does it work in French for the interface and for client email?",
  "Which Canadian listing source does it use, and is it a licensed feed?",
  "Can I export all of my data, in what format, and what happens to it if I cancel?",
];

const FAQS = [
  {
    q: "Does Lofty publish its pricing?",
    a: "No. Lofty's pricing page shows four tiers (Agent, Team, Broker and Enterprise), each with a Request Pricing button and the line that pricing varies with platform package, seat count, optional upgrades and lead-generation programs. Any figure quoted elsewhere is a guess unless it comes from a quote you were given.",
  },
  {
    q: "Does Lofty support Canadian agents?",
    a: "Ask them. The Lofty pages we read do not mention Canada, French or Canadian MLS, which means we cannot tell you either way. Put the questions below to their sales team and get the answers in writing.",
  },
  {
    q: "Is Realtor Desk a replacement for Lofty?",
    a: "For a small part of it. Lofty describes a broad platform that includes a website, lead generation and a dialer. Realtor Desk is a single-agent CRM with lead scoring, a pipeline and one conversation timeline per client, and it is the wrong choice if you need the rest of that platform.",
  },
  {
    q: "How much does Realtor Desk cost compared with Lofty?",
    a: "Realtor Desk is CAD $149 a month for a single agent, published on the pricing page. We cannot give you a Lofty figure to compare against, because Lofty does not publish one. Ask Lofty for a written quote and set it beside ours, remembering that the two products do different amounts of work.",
  },
];

const VsLoftyCRM = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Lofty CRM Review for Canadian Agents"
        description="What Lofty says it offers, what it does not publish on price, and the nine questions a Canadian agent should ask before buying. Checked October 2026."
        keywords="Lofty CRM review, Lofty CRM Canada, Lofty pricing, Chime CRM review, is Lofty worth it, Lofty alternative Canada"
        article
        publishedTime="2025-01-01"
        modifiedTime="2026-10-02"
        author="Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/blog/vs-lofty-crm"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Lofty CRM review for Canadian agents",
            description:
              "What Lofty says it offers, what it does not publish on price, and what a Canadian agent should ask before buying.",
            author: { "@type": "Organization", name: "Realtor Desk" },
            publisher: { "@type": "Organization", name: "Realtor Desk" },
            datePublished: "2025-01-01",
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
                <span>5 min read</span>
              </div>
            </div>
            <h1 className="mb-6">Lofty CRM review for Canadian agents</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Lofty, formerly Chime, sells a broad real estate platform. This review
              covers what Lofty says it offers, what it does not publish, and the
              questions to put to its sales team before you sign.
            </p>
          </header>

          <Card className="p-6 mb-8">
            <h2 className="text-lg font-bold mb-3">Short answer</h2>
            <p className="text-base mb-3">
              Lofty is a much larger product than Realtor Desk, and it quotes
              pricing only on request, so no honest price comparison is possible.
              Whether it suits a Canadian agent depends on answers the Lofty pages
              we read do not give.
            </p>
            <p className="text-sm text-muted-foreground mb-0">
              We build Realtor Desk, a competitor, so weigh this review accordingly.
              Everything about Lofty below comes from Lofty&rsquo;s own pages, read on
              October 2, 2026.
            </p>
          </Card>

          <div className="prose prose-lg max-w-none">
            <h2>What Lofty says it offers</h2>
            <p>
              Lofty&rsquo;s homepage describes the product as putting business growth
              on autopilot with agentic AI, and lists these areas: a real estate CRM,
              an IDX website, lead generation services, a power dialer, Smart Plans
              for automated multi-step workflows, Social Studio, transaction
              management and mobile apps.
            </p>

            <h2>Where Realtor Desk overlaps, and where it does not</h2>
            <p>
              Set against Lofty&rsquo;s own list, Realtor Desk covers the CRM core and
              little else. That is useful to know whichever way you decide.
            </p>

            <div className="overflow-x-auto not-prose my-6">
              <table className="min-w-full text-sm">
                <caption className="text-left text-muted-foreground pb-3">
                  Lofty&rsquo;s product areas, as listed on its homepage, and what
                  Realtor Desk offers in each.
                </caption>
                <thead>
                  <tr className="border-b-2 text-left">
                    <th scope="col" className="py-2 pr-4 font-semibold">Lofty product area</th>
                    <th scope="col" className="py-2 font-semibold">Realtor Desk</th>
                  </tr>
                </thead>
                <tbody>
                  {LOFTY_AREAS.map((r) => (
                    <tr key={r.area} className="border-b align-top">
                      <th scope="row" className="py-3 pr-4 text-left font-semibold">{r.area}</th>
                      <td className="py-3 text-muted-foreground">{r.rd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2>What Lofty does not publish</h2>
            <p>
              Lofty&rsquo;s pricing page shows four tiers, Agent, Team, Broker and
              Enterprise, each with a Request Pricing button. It states that
              &ldquo;pricing varies based on your choice of platform package, seat
              count, optional upgrades and lead-gen programs.&rdquo; No dollar figure
              appears. The Lofty pages we read also do not mention Canada, French or
              Canadian MLS, so we cannot tell you how it handles them.
            </p>
            <p>
              That makes any published &ldquo;Lofty costs $X&rdquo; figure, including
              the ones that used to appear on this page, a guess. We removed ours.
            </p>

            <h2>Nine questions to ask Lofty before you buy</h2>
            <ol>
              {QUESTIONS.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ol>
            <p>
              Ask for the answers in writing. If a vendor will not put a total first
              year cost in an email, that tells you something too.
            </p>

            <h2>If you want the smaller product</h2>
            <p>
              Realtor Desk is CAD $149 a month for a single agent, with a 14-day
              trial, French set per contact, and a database that runs in Canada. For
              the side-by-side, see{" "}
              <Link to="/vs/lofty">Realtor Desk vs Lofty</Link> or our{" "}
              <Link to="/lofty-alternative">Lofty alternative</Link> page. For a wider
              view of what other vendors publish, see the{" "}
              <Link to="/blog/best-crm-canada-2025">guide to choosing a CRM in Canada</Link>.
            </p>

            <h2>Questions</h2>
          </div>

          <FAQAccordion items={FAQS} className="mb-12" />

          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">See the smaller product on your own contacts</h2>
            <p className="text-muted-foreground mb-6">
              14 days, then CAD $149 a month. A card is collected up front and
              nothing is charged before day 14.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild>
                <Link to="/signup">Start free trial</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/vs/lofty">Compare side by side</Link>
              </Button>
            </div>
          </Card>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default VsLoftyCRM;
