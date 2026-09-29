import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

// Brief 16 of the keyword plan: "CRM for Toronto realtors". The plan is
// explicit that this must be about real board and market workflows, "not a
// city-name swap".
//
// Board facts below were read from trreb.ca on 28 September 2026: the Toronto
// Regional Real Estate Board covers the Greater Toronto area and references
// "GTA and Barrie"; member-facing systems named on the site are
// onlistings.trreb.ca for property search, member.trreb.ca for applications,
// and market-outlook.trreb.ca for the Market Outlook Digital Digest.
//
// We do NOT integrate with any of them. Nothing on this page may imply we do.

const FAQS = [
  {
    q: "Does Realtor Desk integrate with TRREB?",
    a: "No. There is no TRREB integration and none is scheduled. You can import a listing from a Realtor.ca URL or MLS number today; native CREA DDF® sync is on the Q3 2026 roadmap.",
  },
  {
    q: "What does TRREB stand for?",
    a: "The Toronto Regional Real Estate Board, covering the Greater Toronto area. Its own site also references the GTA and Barrie.",
  },
  {
    q: "Do I still need a CRM if I use the board tools?",
    a: "They solve different problems. Board systems find inventory and report the market; a CRM records who asked what and what you owe them next. Neither replaces the other.",
  },
  {
    q: "Is there a Toronto-specific version of the product?",
    a: "No, and be sceptical of anyone selling one. What is genuinely local is your board, your inventory and your pace; the CRM underneath is the same software. We would rather say that than invent a city edition.",
  },
  {
    q: "What does it cost?",
    a: "$149 CAD a month for a single agent, $299 for the Team tier, no setup fee, 14-day trial with a card required to start.",
  },
];

const TorontoRealtorCrm = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="CRM for Toronto Realtors (TRREB)"
        description="What a TRREB member needs from a CRM: where board tools stop, what the CRM has to carry, and how Realtor.ca import works today in the GTA."
        keywords="crm for toronto realtors, trreb crm, toronto real estate crm, gta realtor crm"
        canonicalUrl="https://www.realtordesk.ai/ca/toronto-realtor-crm"
        structuredData={[
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
            <h1 className="mb-6">A CRM for Toronto realtors</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Your board already gives you listing search and market data. What it does not give you is a record of who asked about what, and when you said you would call them back. That gap is the entire job of a CRM, and it is the same job in Toronto as anywhere — the difference is the volume and the pace.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <div>
              <h2 className="mb-4">What TRREB gives you, and what it does not</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Toronto Regional Real Estate Board covers the Greater Toronto area, and its member systems handle the listing side: property search on onlistings.trreb.ca, the applications portal at member.trreb.ca, and market data through the Market Outlook Digital Digest. Between them you can find inventory and read the market.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                None of that tracks a relationship. Which buyer asked about which street, what you promised on a Tuesday call, whether the seller who was "thinking about spring" has been contacted since — that lives in your CRM or it lives nowhere. Realtor Desk does not connect to TRREB systems, and we are not claiming otherwise; it is the layer next to them.
              </p>
            </div>
            <div>
              <h2 className="mb-4">What the GTA does to a follow-up list</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Two things make this market harder on a CRM than most. Volume: a single open house in a busy pocket can produce more enquiries in an afternoon than a quieter market produces in a fortnight, and they arrive faster than anyone can triage by hand. Pace: a lead who was warm on Thursday may have written an offer with someone else by Sunday.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                That combination is why ordering matters more here than almost anywhere. A list sorted by arrival date is the wrong list. Realtor Desk scores each lead 0-100 on engagement, behaviour, budget match, timeline and qualification, and shows the components, so the order reflects who is actually moving.
              </p>
            </div>
            <div>
              <h2 className="mb-4">Listings, honestly</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You can import a listing into Realtor Desk from a Realtor.ca URL or an MLS number today, which covers the common case of attaching a property to a client record. Native CREA DDF® sync is on the roadmap for Q3 2026 and is not live. There is no TRREB-specific integration and none is scheduled.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                If automatic board-feed sync is the thing you are shopping for, that is a reason to look at a platform that already has it rather than at us.
              </p>
            </div>
            <div>
              <h2 className="mb-4">The Canadian parts that are not Toronto-specific</h2>
              <p className="text-muted-foreground leading-relaxed">
                Client data hosted in Canada, CASL consent recorded per contact with the send refused when it is missing, pricing in Canadian dollars, and an interface and client email that both work in French. Toronto is a bilingual-adjacent market more often than people expect, and francophone clients notice.
              </p>
            </div>

            <div>
              <h2 className="mb-6">Common questions</h2>
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
              <h2 className="mb-3">Built for Canadian agents</h2>
              <p className="text-muted-foreground mb-6">$149 CAD a month, bilingual EN/FR, data hosted in Canada.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild>
                  <Link to="/pricing">See pricing</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/features">See the features</Link>
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

export default TorontoRealtorCrm;
