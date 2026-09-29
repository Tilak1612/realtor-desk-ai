import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

// Brief 14 of the keyword plan: "CRM for real estate team".
//
// This page exists as a BUYER'S GUIDE, not a product page, because production
// has no team model. Checked on 2026-09-28: information_schema has no seat,
// assignment, organization or shared-pipeline column anywhere. The $299 Team
// plan is a billing tier, not a capability.
//
// The plan itself anticipated this — "round-robin must stay labeled roadmap" —
// but the gap is wider than routing, so the page leads with the limitation
// instead of burying it. If a seat model ships, rewrite this page; do not
// quietly add team claims to it.

const FAQS = [
  {
    q: "Does Realtor Desk support real estate teams?",
    a: "Not today. There is no seat model, no lead assignment, no shared pipeline and no team reporting. The $299 Team plan is a billing tier rather than a set of collaboration features.",
  },
  {
    q: "Is team support on the roadmap?",
    a: "Nothing is committed with a date, and we are not going to imply one. Treat the product as single-user when you evaluate it.",
  },
  {
    q: "What should a team look for instead?",
    a: "Assignment rules including holiday and edge cases, pipeline visibility without trampling, cold-lead accountability, what happens to contacts when an agent leaves, and whether billing is per seat.",
  },
  {
    q: "Does CASL work differently for a team?",
    a: "The law is the same, the exposure is larger — more senders, more lists, more chances someone mails without consent. Ask any vendor whether consent is enforced at send time or left as a filter.",
  },
  {
    q: "Can two agents share one account?",
    a: "Please do not. A shared login has no audit trail and breaks the consent record, which is the part you would most want to be able to produce later.",
  },
];

const RealEstateTeam = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="CRM for Real Estate Teams in Canada"
        description="What a real estate team should demand from a CRM — and a straight answer about where Realtor Desk is not yet the right choice for one."
        keywords="crm for real estate team, real estate team crm canada, team crm realtors"
        canonicalUrl="https://www.realtordesk.ai/use-cases/real-estate-team"
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
            <h1 className="mb-6">Choosing a CRM for a real estate team in Canada</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A team CRM has to answer one question a solo CRM never asks: who owns this lead right now. Realtor Desk does not answer it today. This page is a buyer&rsquo;s guide rather than a pitch, and it says where we fit and where we do not.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <div>
              <h2 className="mb-4">Start here: we are not a team CRM today</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Realtor Desk is single-user. There is no seat model, no lead assignment, no shared pipeline and no team reporting. The Team plan is a price tier, not a set of collaboration features, and we would rather you read that in the first paragraph than discover it after migrating.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                If you run a team of three or more with shared lead flow, buy something built for that. The rest of this page is what we would tell a friend to check before they do.
              </p>
            </div>
            <div>
              <h2 className="mb-4">The five questions that separate team CRMs</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                First, assignment: how does a lead get an owner, and what happens when that person is on holiday? Round-robin is the usual answer; ask what happens on the edge cases. Second, visibility: can a team lead see everyone&rsquo;s pipeline without being able to trample it? Third, accountability: when a lead goes cold, does the system show who let it, and is that information usable without being punitive?
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Fourth, offboarding: when an agent leaves, do their contacts stay with the team, and how much work is that transfer? This is the question most teams only ask once, at the worst moment. Fifth, billing: is it per seat, and does a part-time assistant cost the same as a producing agent?
              </p>
            </div>
            <div>
              <h2 className="mb-4">The Canadian layer, which applies at any size</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                CASL does not scale down. A team sends more email from more people, which multiplies both the consent question and the risk that somebody mails a list they should not have. Ask whether consent is enforced at send time or left as a filter a campaign builder has to remember.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Ask where client data is hosted, and ask whether the interface and client-facing email work in French if any part of your market is francophone. Those are the areas where US-built platforms most often have a gap, and where the answer is usually available before you sign anything.
              </p>
            </div>
            <div>
              <h2 className="mb-4">If you are one agent, or two who work separately</h2>
              <p className="text-muted-foreground leading-relaxed">
                Then the team question may not apply yet, and we may well fit: a single-user CRM with scoring, a conversation timeline per client, CASL-aware email, bilingual support, data in Canada and $149 CAD a month. The
              </p>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              <Link to="/use-cases/solo-agent" className="underline">solo agent page</Link> covers that case properly.
            </p>

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
              <h2 className="mb-3">If you are working solo</h2>
              <p className="text-muted-foreground mb-6">That is the case we serve well. $149 CAD a month, bilingual, hosted in Canada.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild>
                  <Link to="/pricing">See pricing</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/features">Solo agent guide</Link>
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

export default RealEstateTeam;
