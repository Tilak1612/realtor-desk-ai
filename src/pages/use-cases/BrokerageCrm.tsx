import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

// Brief 15 of the keyword plan: "real estate brokerage CRM Canada". The plan
// says "Keep FINTRAC workflows labeled roadmap until live".
//
// The gap is larger than FINTRAC: production has no organization, seat or
// brokerage model at all (checked 2026-09-28). So this ships as a buyer guide
// that opens with what we do not do, rather than a product page for a product
// that does not exist. FINTRAC content here is educational only and must never
// read as a compliance guarantee.

const FAQS = [
  {
    q: "Is Realtor Desk a brokerage CRM?",
    a: "No. There is no organization layer, no seats, no roles and no FINTRAC workflow. It is a single-agent CRM, and the pricing page marks FINTRAC and SSO as roadmap.",
  },
  {
    q: "Does any CRM make a brokerage FINTRAC compliant?",
    a: "No. Software can help you keep and retrieve records; the obligations remain the brokerage’s. Treat any claim of compliance-by-purchase as a reason to look harder at the vendor.",
  },
  {
    q: "What should we ask about record retention?",
    a: "What is retained, for how long, who can export it, and what happens when the agent who created it leaves. Ask for an actual export during evaluation rather than a description of one.",
  },
  {
    q: "Who is accountable under PIPEDA?",
    a: "Generally the organization that collects the personal information — for a brokerage, that usually means the brokerage rather than the individual agent. Confirm where data is hosted and how a deletion request is honoured.",
  },
  {
    q: "Why publish this if you do not sell to brokerages?",
    a: "Because the questions are hard to find written down, and a page that says \"not us, here is what to ask\" is more useful than one that pretends otherwise.",
  },
];

const BrokerageCrm = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Brokerage CRM in Canada: What to Look For"
        description="A brokerage buyer guide covering FINTRAC record keeping, PIPEDA, seat management and offboarding — plus a straight account of what Realtor Desk does not do."
        keywords="real estate brokerage crm canada, brokerage crm, fintrac real estate crm"
        canonicalUrl="https://www.realtordesk.ai/use-cases/brokerage"
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
            <h1 className="mb-6">Choosing a brokerage CRM in Canada</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A brokerage has obligations an individual agent does not, and most of them land on record keeping. Realtor Desk is a single-agent CRM and is not a brokerage system today. This page is what we would check if we were buying one.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <div>
              <h2 className="mb-4">What we do not do, first</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Realtor Desk has no brokerage model. No organization layer, no seats, no roles beyond a single account, no deal or commission oversight, no agent onboarding or offboarding, and no FINTRAC workflow. The pricing page marks FINTRAC workflows and SAML SSO as roadmap, and that is accurate.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                If you are buying for a brokerage, we are not the product. The rest of this is the checklist, and it is genuinely useful whoever you buy from.
              </p>
            </div>
            <div>
              <h2 className="mb-4">Record keeping is the brokerage-shaped problem</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                FINTRAC obligations for real estate include client identification and record retention, and the practical question for software is whether records can be produced years later by someone who was not there when they were created. Ask any vendor: what exactly is retained, for how long, who can export it, and what happens to it when the agent who created it leaves.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Nothing about buying software discharges those obligations. A vendor that tells you their product makes you FINTRAC compliant is telling you something that is not true about any product.
              </p>
            </div>
            <div>
              <h2 className="mb-4">Privacy, at brokerage scale</h2>
              <p className="text-muted-foreground leading-relaxed">
                Under PIPEDA the brokerage is usually the organization accountable for personal information its agents collect. That makes two questions load-bearing: where the data is hosted, and whether you can extract or delete a specific client&rsquo;s record on request without a support ticket. Ask to see the export, not a description of it.
              </p>
            </div>
            <div>
              <h2 className="mb-4">Offboarding is the question to ask twice</h2>
              <p className="text-muted-foreground leading-relaxed">
                Agents move. The moment one does, you need their client records to remain with the brokerage, the handover to be doable in an afternoon rather than a project, and the consent history to travel with the contact rather than be lost with the account. Most platforms answer this badly and very few answer it in their marketing, so put it in writing during evaluation.
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
              <h2 className="mb-3">For individual agents</h2>
              <p className="text-muted-foreground mb-6">That is who Realtor Desk is built for. $149 CAD a month, bilingual, hosted in Canada.</p>
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

export default BrokerageCrm;
