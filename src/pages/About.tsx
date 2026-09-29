import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

// /about — the one page in the redesign brief with no existing route.
//
// WHAT IS DELIBERATELY ABSENT. The brief's own instruction is "Company, known
// facts only", and the acceptance criteria forbid invented outcomes. So there
// is no founding story, no team size, no headcount, no customer count, no
// funding, no awards, no leadership section and no photos. Everything below
// traces to something already published or already in the repo:
//
//   legal entity + city + 2024   src/lib/structuredData.ts organizationSchema
//   support address, no office   src/pages/Contact.tsx
//   ca-central-1 data residency  CLAUDE.md, Supabase project realtordesk-prod
//   prices and trial terms       the Stripe-backed pricing configuration
//
// A leadership section needs approved names, biographies and photos, which we
// do not have. It is left out rather than filled with placeholders.

const FAQS = [
  {
    q: "Who builds Realtor Desk?",
    a: "Brainfy AI Inc., a Canadian company based in Edmonton, Alberta. Realtor Desk is its real estate product. Mail reaches us in Edmonton, but there is no walk-in office — support runs by email.",
  },
  {
    q: "Where is my data stored?",
    a: "In Canada. The production database runs in the ca-central-1 region. This is the question Canadian brokerages ask first, and it is the reason the answer is on this page rather than buried in a policy.",
  },
  {
    q: "Are you affiliated with CREA, a real estate board, or a regulator?",
    a: "No. Realtor Desk is an independent software product. We are not endorsed by, affiliated with, or certified by CREA, any provincial real estate board, or any regulator. Where we reference CREA DDF®, we are naming a data feed we intend to support, not claiming a relationship.",
  },
  {
    q: "Does using Realtor Desk make me compliant with PIPEDA or CASL?",
    a: "No, and we will not say otherwise. Software cannot make you compliant. We record consent per contact and refuse to send without it, which helps you meet obligations under CASL, and we keep data in Canada, which helps under PIPEDA and Quebec's Law 25. How you collect consent and handle requests remains yours.",
  },
  {
    q: "How do you make money?",
    a: "Subscriptions only — CAD $149 a month for a single agent, $299 for the Team plan, with no setup fee. We do not sell leads, take referral fees on transactions, or sell your contact data. There is a 14-day trial; a card is collected up front and nothing is charged before day 14.",
  },
];

const PRINCIPLES = [
  {
    h: "Say what ships, and what does not",
    p: "Our roadmap page marks features live, partial or planned, and the product pages say where a capability stops. Listing import from a Realtor.ca address works today; native CREA DDF® sync does not, and is marked Q3 2026. We would rather lose a sale to a competitor's longer feature list than win one a buyer regrets in week three.",
  },
  {
    h: "Nothing goes out in your name without you",
    p: "Realtor Desk scores a lead, suggests a next action and a time to take it — and then stops. No message is sent automatically. That is a deliberate constraint rather than a missing feature: under CASL, a system that sends generously on your behalf creates liability in your name, not ours.",
  },
  {
    h: "Canadian by construction, not by flag",
    p: "Data in Canada, prices in Canadian dollars, consent handling written against CASL, and French that reaches the client rather than stopping at the marketing site. A maple leaf in a logo is not localisation.",
  },
  {
    h: "No numbers we cannot show our work for",
    p: "You will not find a conversion-lift percentage, an ROI figure or a named-agent testimonial anywhere on this site. We removed the ones that were here. If we publish a figure, we will publish where it came from.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="About Realtor Desk"
        description="Realtor Desk is built by Brainfy AI Inc. in Edmonton, Alberta. Client data is stored in Canada. Independent — not affiliated with CREA or any real estate board."
        keywords="about realtor desk, brainfy ai, canadian real estate crm company, edmonton software company"
        canonicalUrl="https://www.realtordesk.ai/about"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About Realtor Desk",
            url: "https://www.realtordesk.ai/about",
            mainEntity: {
              "@type": "Organization",
              name: "Realtor Desk",
              legalName: "Brainfy AI Inc.",
              url: "https://www.realtordesk.ai",
              foundingDate: "2024",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Edmonton",
                addressRegion: "AB",
                addressCountry: "CA",
              },
            },
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
            <h1 className="mb-6">About Realtor Desk</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Realtor Desk is a CRM for Canadian real estate agents, built by
              Brainfy AI Inc. in Edmonton, Alberta. Client data is stored in
              Canada. We are an independent software company with no affiliation
              to CREA, any real estate board, or any regulator.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <div>
              <h2 className="mb-4">Why this product exists</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Most real estate CRMs are built for the American market and
                adapted afterwards. The adaptation usually stops at the marketing
                site: prices stay in US dollars, the French is a translated
                landing page in front of an English product, consent handling is
                written against CAN-SPAM rather than CASL, and nobody can tell
                you which country the database sits in.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                None of that is fatal on its own. Together it means a Canadian
                agent spends the first month working around the software instead
                of with it. Realtor Desk starts from the other end.
              </p>
            </div>

            <div>
              <h2 className="mb-6">How we decide what to say</h2>
              <div className="space-y-6">
                {PRINCIPLES.map((s) => (
                  <div key={s.h}>
                    <h3 className="text-base font-semibold mb-2">{s.h}</h3>
                    <p className="text-muted-foreground leading-relaxed">{s.p}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-4">The company</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>
                  Legal entity: Brainfy AI Inc., incorporated in Canada, operating
                  since 2024.
                </li>
                <li>Based in Edmonton, Alberta. Mailing address only — no walk-in office.</li>
                <li>
                  Support runs by email at{" "}
                  <a className="underline" href="mailto:support@realtordesk.ai">
                    support@realtordesk.ai
                  </a>
                  , in English and French, normally answered within one business day.
                </li>
                <li>Production data is stored in Canada (ca-central-1).</li>
                <li>
                  Revenue comes from subscriptions. We do not sell leads, take a
                  cut of transactions, or sell contact data.
                </li>
              </ul>
              <p className="text-sm text-muted-foreground leading-relaxed mt-4">
                We do not publish customer counts, revenue, or named client
                stories. When we have permission to tell a real one, we will.
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
              <h2 className="mb-3">Have a question we have not answered?</h2>
              <p className="text-muted-foreground mb-6">
                Email a person, or see what the product actually does before you
                talk to anyone.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild>
                  <Link to="/contact">Contact us</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/features">See the product</Link>
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

export default About;
