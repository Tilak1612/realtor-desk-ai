import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { FAQAccordion } from "@/components/rd/marketing/FAQAccordion";

// /features/pipeline — the brief lists it; the capability shipped long ago and
// had no page.
//
// EVERY FACT HERE IS A COLUMN OR A COMPONENT, checked 2026-09-28:
//   drag and drop            src/pages/rd/app/Pipeline.tsx, @dnd-kit/core
//   stage, value, status     public.deals
//   probability              public.deals.probability
//   expected_close_date      public.deals.expected_close_date
//   commission_percentage    public.deals.commission_percentage
//   listing_price            public.deals.listing_price
//   contact_id               public.deals — every deal hangs off a contact
//
// What is NOT claimed, because it does not exist: forecasting, weighted
// revenue projections, team pipelines, per-agent splits, transaction
// management, e-signature, document workflow. `deals` has no assignment or
// organization column — there is no team model in the product.

const FAQS = [
  {
    q: "What are the pipeline stages?",
    a: "Yours. Stage is a free-text field on the deal rather than a fixed enum, so the board reflects how you actually work instead of how an American vendor thinks Canadian deals close. Drag a card and the stage updates.",
  },
  {
    q: "Are the totals in Canadian dollars?",
    a: "Yes, and that is not a display setting. The product is billed and denominated in CAD throughout, so there is no exchange rate sitting between you and your own numbers — the standing complaint about running a Canadian business on US-billed software.",
  },
  {
    q: "Can I track commission?",
    a: "Each deal carries a listing price and a commission percentage alongside its value, so the number you care about is on the card rather than in a separate spreadsheet. It is record-keeping, not accounting — there is no invoicing or brokerage split calculation.",
  },
  {
    q: "Does it forecast revenue?",
    a: "No. A deal has a probability and an expected close date you set yourself, and the board totals what is in each stage. We do not multiply those together and call it a forecast, because a made-up number is worse than no number.",
  },
  {
    q: "Can my team share a pipeline?",
    a: "Not today. There is no seat, assignment or organization model anywhere in the product — the deals table has no column for it. The Team plan is a billing tier. If shared pipeline visibility is what you need, this is the wrong product right now and we would rather say so.",
  },
];

const Pipeline = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Real estate deal pipeline, priced in CAD"
        description="A drag-and-drop deal pipeline for Canadian agents: your own stages, close dates, commission percentage, and totals in Canadian dollars."
        keywords="real estate pipeline, deal pipeline crm, real estate sales pipeline canada, crm pipeline stages"
        canonicalUrl="https://www.realtordesk.ai/features/pipeline"
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
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
              <Link to="/features" className="hover:underline">
                Platform
              </Link>
              <span aria-hidden="true"> / </span>
              <span>Pipeline</span>
            </nav>
            <h1 className="mb-6">A pipeline you can read in Canadian dollars</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Drag deals between your own stages and see what is actually in
              play. Every card is attached to a real contact, so the pipeline
              and the conversation are never two different systems.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <div>
              <h2 className="mb-4">The board is the record</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Most CRMs make the pipeline a report — a view generated from
                data you maintain somewhere else. Here it is the other way
                round: the board is where you move the deal, and the record
                updates because you moved it. Drag a card to a new stage and
                that is the update, with no second screen to keep in sync.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                That matters most on the day you are busy. A pipeline that needs
                maintaining stops being maintained, and a stale pipeline is
                worse than none because you start trusting it.
              </p>
            </div>

            <div>
              <h2 className="mb-4">What a deal carries</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>
                  A stage you define yourself, not one borrowed from a US
                  transaction model.
                </li>
                <li>A value, and a listing price where the two differ.</li>
                <li>
                  A commission percentage, so the number you actually earn sits
                  on the card.
                </li>
                <li>
                  A probability and an expected close date, both yours to set.
                </li>
                <li>
                  The contact it belongs to, with their whole conversation one
                  click away.
                </li>
                <li>Notes, for the part that never fits in a field.</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4">Three steps</h2>
              <ol className="space-y-3 text-muted-foreground leading-relaxed list-decimal pl-5">
                <li>
                  <strong className="text-foreground">Create the deal from the contact.</strong>{" "}
                  It inherits who it is for, so you never type a name twice.
                </li>
                <li>
                  <strong className="text-foreground">Move it as the work moves.</strong>{" "}
                  Drag between stages; the board totals update as you go.
                </li>
                <li>
                  <strong className="text-foreground">Read the column, not the list.</strong>{" "}
                  What is stuck is visible as a shape rather than something you
                  have to go looking for.
                </li>
              </ol>
            </div>

            <div>
              <h2 className="mb-4">Where it stops</h2>
              <p className="text-muted-foreground leading-relaxed">
                This is a pipeline, not transaction management. There is no
                e-signature, no document workflow, no conditions checklist and
                no closing coordination. There is also no team pipeline — no
                seats, no assignment, no per-agent split — because there is no
                team model in the product at all. If you need those, say so
                before you trial rather than after.
              </p>
            </div>

            <div>
              <h2 className="mb-6">Questions</h2>
              <FAQAccordion items={FAQS} />
            </div>

            <div>
              <h2 className="mb-4">Related</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>
                  <Link to="/features/conversations" className="underline">
                    One conversation per client
                  </Link>{" "}
                  — what sits behind every card.
                </li>
                <li>
                  <Link to="/features/ai-lead-scoring" className="underline">
                    Lead scoring
                  </Link>{" "}
                  — which of them to work on first.
                </li>
                <li>
                  <Link to="/features" className="underline">
                    The rest of the platform
                  </Link>
                  .
                </li>
              </ul>
            </div>

            <Card className="p-8 text-center">
              <h2 className="mb-3">Move your own deals through it</h2>
              <p className="text-muted-foreground mb-6">
                14 days, $149 CAD a month after. Nothing charged before day 14.
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

export default Pipeline;
