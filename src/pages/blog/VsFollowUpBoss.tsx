import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { FAQAccordion } from "@/components/rd/marketing/FAQAccordion";

// /blog/vs-follow-up-boss — rewritten 2026-10-02.
//
// The previous version said Realtor Desk "uses GPT-4 powered conversational AI
// to engage, qualify and nurture", "responds to every lead in under 3 seconds
// ... handles objections, and books appointments, all automatically", "responds
// 98% faster", and offers "intelligent lead distribution, shared team inbox,
// performance dashboards, and collaborative notes". It priced Follow Up Boss at
// "$810 CAD a month for a team of 5" against our $299, and listed "20,000+
// agents" as a Follow Up Boss strength. Realtor Desk does not reply to leads,
// has no lead distribution or team inbox, and the price figures were not
// sourced. The page also asserted a product launch year it could not support.
//
// FACTS ABOUT FOLLOW UP BOSS BELOW were read from its own pages on 2026-10-02:
// followupboss.com (its description of itself and its feature list) and
// followupboss.com/pricing. Where those pages did not say something (a currency,
// whether a card is needed for the trial, anything about Canada) this page says
// so. It does not say FOLLOW UP BOSS lacks a thing it simply did not mention.
//
// INTENT. This is the side-by-side. /switch-from-follow-up-boss is how to move.

const ROWS: { topic: string; fub: string; rd: string }[] = [
  {
    topic: "What it is",
    fub: "Calls itself the real estate operating system, built around organising leads, engaging them and coaching a team.",
    rd: "A single-agent CRM: contacts, one conversation timeline per client, lead scoring and a deal pipeline.",
  },
  {
    topic: "Published pricing",
    fub: "Grow $69 per user a month, Pro $499 a month for 10 users, Platform $1,000 a month for 30 users. Annual billing lowers these to $58, $416 and $833.",
    rd: "Solo CAD $149 a month. Team CAD $299 a month, which is a price tier rather than a set of team features.",
  },
  {
    topic: "Currency stated",
    fub: "Not stated on the pricing page.",
    rd: "Canadian dollars, before tax; GST/HST, plus QST or PST where it applies, at checkout.",
  },
  {
    topic: "Trial",
    fub: "14-day free trial. The page does not say whether a card is needed.",
    rd: "14 days. A card is collected up front and nothing is charged before day 14.",
  },
  {
    topic: "Team features",
    fub: "Lists lead distribution and routing, a team inbox, team collaboration tools and a team leaderboard.",
    rd: "None today: no seats, lead assignment or shared pipeline.",
  },
  {
    topic: "Calling and texting",
    fub: "Lists calling and texting. Calling is an add-on at $39 per user a month on Grow.",
    rd: "SMS through Twilio, sent only to numbers with a recorded consent. No calling.",
  },
  {
    topic: "Integrations",
    fub: "Lists 250+ integrations.",
    rd: "Zapier, Make and n8n for inbound leads, plus Twilio and SMTP.",
  },
  {
    topic: "AI",
    fub: "Lists AI capabilities, described as AI that adapts to your business.",
    rd: "An in-app assistant that drafts replies and summarises a thread on the contact you have open. It does not message leads on its own.",
  },
  {
    topic: "Mobile",
    fub: "Lists mobile apps.",
    rd: "A responsive web app. No native app.",
  },
  {
    topic: "Canada",
    fub: "The pages we read do not mention Canada, Canadian dollars, French, CASL or data location. Ask Follow Up Boss.",
    rd: "French per contact, a database in Canada, CAD pricing, and a consent record for CASL.",
  },
];

const FAQS = [
  {
    q: "Is Realtor Desk cheaper than Follow Up Boss?",
    a: "Not for one agent, at face value. Follow Up Boss's Grow plan is shown at $69 per user a month, and Realtor Desk is CAD $149. The currencies differ and Follow Up Boss does not state one, so check what you would actually be billed. Calling on Grow is an extra $39 per user a month.",
  },
  {
    q: "Does Realtor Desk have lead routing or a team inbox?",
    a: "No. There are no seats, lead assignment or shared pipeline today, so a team cannot work in one shared account. If you rely on routing or a team inbox, Follow Up Boss is the better fit.",
  },
  {
    q: "Which is better for a Canadian agent?",
    a: "It depends on what you need to be true. If you work alone and need French per contact, a consent record for CASL and a database in Canada, Realtor Desk is built around those. If you run a team and need routing, calling and a large integration library, Follow Up Boss lists those and Realtor Desk does not.",
  },
  {
    q: "Does Follow Up Boss work in Canada?",
    a: "Ask them. The Follow Up Boss pages we read do not mention Canada, Canadian dollars, French, CASL or data location, so we cannot say either way. Put those four questions to their sales team and get the answers in writing.",
  },
];

const VsFollowUpBoss = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Realtor Desk vs Follow Up Boss for Canada"
        description="Follow Up Boss and Realtor Desk compared for Canadian agents: published pricing, team features, handling of consent and data, and who each one suits."
        keywords="Follow Up Boss alternative Canada, Follow Up Boss vs Realtor Desk, Follow Up Boss pricing, CRM for Canadian realtors, Follow Up Boss CASL"
        article
        publishedTime="2025-01-16"
        modifiedTime="2026-10-02"
        author="Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/blog/vs-follow-up-boss"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Realtor Desk vs Follow Up Boss for Canadian agents",
            description:
              "Follow Up Boss and Realtor Desk compared for Canadian agents, using what Follow Up Boss publishes about itself.",
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
        <div className="container-custom max-w-4xl">
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
            <h1 className="mb-6">Realtor Desk vs Follow Up Boss for Canadian agents</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Follow Up Boss is a much larger product built around teams. Realtor Desk
              is a single-agent CRM built around Canadian practice. This is a
              side-by-side using what Follow Up Boss publishes about itself.
            </p>
          </header>

          <Card className="p-6 mb-8">
            <h2 className="text-lg font-bold mb-3">Short answer</h2>
            <p className="text-base mb-3">
              If you run a team, or need routing, a team inbox, calling and a large
              integration library, Follow Up Boss lists all of those and Realtor Desk
              has none. If you work alone and need French per contact, a consent
              record and a database in Canada, Realtor Desk is built around those, and
              the Follow Up Boss pages we read do not mention them.
            </p>
            <p className="text-sm text-muted-foreground mb-0">
              We build Realtor Desk, a competitor, so weigh this accordingly. Follow Up
              Boss facts were read from its own site on October 2, 2026.
            </p>
          </Card>

          <div className="prose prose-lg max-w-none">
            <h2>Side by side</h2>
            <p>
              Follow Up Boss column: its{" "}
              <a href="https://www.followupboss.com" rel="noopener noreferrer" target="_blank">homepage</a>{" "}
              and{" "}
              <a href="https://followupboss.com/pricing" rel="noopener noreferrer" target="_blank">pricing page</a>.
              Where a page did not say something, the table says so rather than
              assuming it is absent.
            </p>

            <div className="overflow-x-auto not-prose my-6">
              <table className="min-w-full text-sm">
                <caption className="text-left text-muted-foreground pb-3">
                  Follow Up Boss as it describes itself, against Realtor Desk.
                </caption>
                <thead>
                  <tr className="border-b-2 text-left">
                    <th scope="col" className="py-2 pr-4 font-semibold">Topic</th>
                    <th scope="col" className="py-2 pr-4 font-semibold">Follow Up Boss</th>
                    <th scope="col" className="py-2 font-semibold">Realtor Desk</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.topic} className="border-b align-top">
                      <th scope="row" className="py-3 pr-4 text-left font-semibold">{r.topic}</th>
                      <td className="py-3 pr-4 text-muted-foreground">{r.fub}</td>
                      <td className="py-3 text-muted-foreground">{r.rd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2>Who each one suits</h2>
            <ul>
              <li>
                <strong>A team, or anyone who needs routing and calling:</strong> Follow
                Up Boss lists those features. Realtor Desk does not support teams
                today, and our{" "}
                <Link to="/use-cases/real-estate-team">team guide</Link> says what to look
                for instead.
              </li>
              <li>
                <strong>A solo Canadian agent who works in French or needs Canadian
                data location:</strong> Realtor Desk is built around those. See the{" "}
                <Link to="/use-cases/solo-agent">solo agent guide</Link>.
              </li>
              <li>
                <strong>Anyone price-sensitive for one seat:</strong> compare carefully.
                At face value Follow Up Boss Grow is lower per month than Realtor Desk,
                in a currency its page does not name.
              </li>
            </ul>

            <p>
              For other vendors, see the{" "}
              <Link to="/blog/best-crm-canada-2025">guide to choosing a CRM in Canada</Link>{" "}
              or the <Link to="/compare">comparison hub</Link>. To move your contacts,
              see <Link to="/switch-from-follow-up-boss">moving from Follow Up Boss</Link>.
            </p>

            <h2>Questions</h2>
          </div>

          <FAQAccordion items={FAQS} className="mb-12" />

          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">See the smaller product on your own contacts</h2>
            <p className="text-muted-foreground mb-6">
              14 days, then CAD $149 a month. A card is collected up front and nothing
              is charged before day 14.
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
      </article>

      <Footer />
    </div>
  );
};

export default VsFollowUpBoss;
