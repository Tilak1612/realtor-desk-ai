import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { FAQAccordion } from "@/components/rd/marketing/FAQAccordion";

// /blog/best-liondesk-alternative-canadian-realtors — rewritten 2026-10-02.
//
// The previous version ranked Realtor Desk "#1 LionDesk alternative", listed a
// "Claude-powered AI chatbot included", "FINTRAC record-keeping support" and
// "free migration" among its strengths (none of which the product has), quoted
// competitor prices it could not source, said US-dollar pricing "adds ~35%",
// and described LionDesk as "being discontinued ... by September 2025" in the
// future tense. LionDesk ended in September 2025.
//
// Facts about other vendors were read from their own pages on 2026-10-02 (the
// same fetches behind /blog/best-crm-canada-2025). The LionDesk wind-down is
// from Inman, 2025-05-16, linked in the body.
//
// This page and /switch-from-liondesk target different intents: this one is
// "what are my options", that one is "how do I move my contacts". Keep them apart.

const FAQS = [
  {
    q: "What replaced LionDesk?",
    a: "Lone Wolf Technologies, which owned LionDesk, offered customers Lone Wolf Relationships when it wound LionDesk down in 2025. It is the vendor's own successor, not the only choice.",
  },
  {
    q: "Which LionDesk alternatives publish a price?",
    a: "Of the vendors we checked, Follow Up Boss, IXACT Contact, Wise Agent, CloseFlow and Top Producer show prices on their pricing pages, and Realtor Desk publishes CAD $149 a month. Lofty and BoldTrail ask you to request a quote. Only CloseFlow and Realtor Desk state Canadian-dollar prices.",
  },
  {
    q: "Is Realtor Desk a good LionDesk alternative?",
    a: "For a solo Canadian agent who wants French per contact, a database in Canada and CAD pricing, it can be. It is not the cheapest option, it has no native mobile app, no automated email sequences and no team features. If you relied on any of those in your old CRM, check first.",
  },
];

const LionDeskAlternative = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="LionDesk Alternatives for Canadian Realtors"
        description="LionDesk ended in September 2025. Your options in Canada, what each vendor publishes on price and currency, and what to check before moving. Oct 2026."
        keywords="LionDesk alternative Canada, LionDesk replacement, best LionDesk alternative, Lone Wolf Relationships alternative, CRM for Canadian realtors"
        article
        publishedTime="2026-04-02"
        modifiedTime="2026-10-02"
        author="Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/blog/best-liondesk-alternative-canadian-realtors"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "LionDesk alternatives for Canadian realtors",
            description:
              "LionDesk ended in September 2025. Options for Canadian realtors and what to check before moving.",
            author: { "@type": "Organization", name: "Realtor Desk" },
            publisher: { "@type": "Organization", name: "Realtor Desk" },
            datePublished: "2026-04-02",
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
            <h1 className="mb-6">LionDesk alternatives for Canadian realtors</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              LionDesk ended in September 2025. Here are the options a Canadian
              agent has, what each vendor publishes on price and currency, and what
              to check before you move your contacts.
            </p>
          </header>

          <div className="prose prose-lg max-w-none">
            <h2>What happened</h2>
            <p>
              Lone Wolf Technologies announced in May 2025 that it was winding
              LionDesk down. The software stayed available through September 2025,
              and customers were offered Lone Wolf Relationships, the company&rsquo;s
              own CRM, as reported by{" "}
              <a
                href="https://www.inman.com/2025/05/16/lone-wolf-technologies-to-wind-down-popular-liondesk-crm/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Inman
              </a>
              . If you are reading an older page that says LionDesk is about to shut
              down, it predates that.
            </p>

            <h2>What to check in a replacement</h2>
            <ul>
              <li>
                <strong>Currency.</strong> Wise Agent states US dollars. Follow Up
                Boss, IXACT Contact and Top Producer show prices without naming a
                currency. CloseFlow and Realtor Desk state Canadian dollars.
              </li>
              <li>
                <strong>Consent records.</strong> Under CASL you must be able to
                show when and how a contact agreed to hear from you. Ask whether the
                CRM stores that per contact.
              </li>
              <li>
                <strong>Importing your contacts.</strong> Most CRMs accept a CSV.
                Ask what happens to tags and unrecognised columns, and whether
                consent comes across. It usually does not.
              </li>
              <li>
                <strong>What you actually used.</strong> List the three features you
                touched weekly in LionDesk and check each one. A longer feature
                list is not the point.
              </li>
            </ul>

            <h2>Your options</h2>
            <ul>
              <li>
                <strong>Lone Wolf Relationships.</strong> The vendor&rsquo;s own
                successor. Inman reported pricing on par with what LionDesk charged.
              </li>
              <li>
                <strong>Wise Agent.</strong> US$49 a month, or US$42 billed
                annually, with a 14-day trial, per its{" "}
                <a href="https://www.wiseagent.com/pricing.asp" rel="noopener noreferrer" target="_blank">
                  pricing page
                </a>
                . Priced in US dollars.
              </li>
              <li>
                <strong>IXACT Contact.</strong> $46.75 a month billed annually or $55
                monthly, per its{" "}
                <a href="https://www.ixactcontact.com/real-estate-crm-pricing/" rel="noopener noreferrer" target="_blank">
                  pricing page
                </a>
                . No currency or trial length is stated there.
              </li>
              <li>
                <strong>CloseFlow.</strong> CA$49, CA$99 or CA$179 a month with a
                14-day trial, per its{" "}
                <a href="https://www.closeflow.ca/pricing" rel="noopener noreferrer" target="_blank">
                  pricing page
                </a>
                , marked as a founder rate for the first 100 agents.
              </li>
              <li>
                <strong>Follow Up Boss.</strong> $69 per user a month on the Grow
                plan, with a 14-day free trial, per its{" "}
                <a href="https://followupboss.com/pricing" rel="noopener noreferrer" target="_blank">
                  pricing page
                </a>
                . No currency is stated there.
              </li>
              <li>
                <strong>Realtor Desk.</strong> CAD $149 a month for a single agent,
                with a 14-day trial. French is set per contact and the database runs
                in Canada. It is the most expensive of the lower-priced options
                above, it is a single-agent product, it has no native mobile app, and
                it does not send automated email sequences.
              </li>
            </ul>

            <p>
              For a wider comparison, including Lofty, BoldTrail and Top Producer,
              see our{" "}
              <Link to="/blog/best-crm-canada-2025">guide to choosing a CRM in Canada</Link>.
              To move your contacts, see{" "}
              <Link to="/switch-from-liondesk">how a CSV move works</Link>.
            </p>

            <p>
              We build Realtor Desk, so weigh our entry accordingly. Vendor prices
              change, so confirm on each page before you decide.
            </p>

            <h2>Questions</h2>
          </div>

          <FAQAccordion items={FAQS} className="mb-12" />

          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Try it with a small file first</h2>
            <p className="text-muted-foreground mb-6">
              Import twenty contacts and see how they land. The trial is 14 days, a
              card is collected up front, and nothing is charged before day 14.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild>
                <Link to="/signup">Start free trial</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/switch-from-liondesk">How the move works</Link>
              </Button>
            </div>
          </Card>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default LionDeskAlternative;
