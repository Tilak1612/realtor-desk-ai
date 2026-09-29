import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

// Brief 8 of the keyword plan: "Top Producer alternative".
//
// IMPORTANT, and the reason this page reads differently from the others:
// topproducer.com names "Constellation1 Inc. and Emphasys Canada Holdings Inc."
// in its footer (read 28 September 2026). Top Producer is Canadian-operated.
// The "they are American, we are Canadian" framing used elsewhere on this site
// would be factually wrong here, and an earlier attempt at this page was
// dropped rather than shipped with it.
//
// Verified from their site the same day: modules are CRM, Seller Leads
// (HouseValues), Real Estate Leads (Social Connect), AI-Powered Farming (Smart
// Targeting), Lead Routing (FiveStreet), Agent Website, email and SMS, Dynamic
// Workflows, Transaction Manager, Market Snapshot Reports, AI Author, Follow Up
// Coach, Property Insights and 150+ lead source integrations. No pricing shown.

const FAQS = [
  {
    q: "Is Top Producer American?",
    a: "No. Its site names Constellation1 Inc. and Emphasys Canada Holdings Inc. in the footer — it is Canadian-operated. Any comparison that rests on them being a US vendor is wrong, including ones you may read elsewhere.",
  },
  {
    q: "What does Top Producer cost?",
    a: "They do not publish pricing on their product site; it is quoted on enquiry. Ask for seats, setup fee, contract length and which lead products are billed separately, in writing.",
  },
  {
    q: "What does Top Producer do that Realtor Desk does not?",
    a: "Lead generation products, an agent website, transaction management, MLS market snapshot reports and lead routing, plus integrations with 150+ lead sources. We do none of those.",
  },
  {
    q: "What does Realtor Desk do that they do not publish?",
    a: "A published price in CAD, and a bilingual interface and client-facing email. Their site makes no statement about French support either way, so ask them rather than assuming.",
  },
  {
    q: "Can I move my data across?",
    a: "By CSV. Our migration pages list the columns recognised on import, what does not transfer, and a twenty-row test procedure to run before committing.",
  },
];

const TopProducerAlternative = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Top Producer Alternative for Canadian Agents"
        description="Top Producer bundles CRM, lead generation and websites and quotes its pricing privately. A comparison against a published CAD price, on facts we can check."
        keywords="top producer alternative, top producer crm alternative, top producer vs realtor desk"
        canonicalUrl="https://www.realtordesk.ai/compare/top-producer-alternative"
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
            <h1 className="mb-6">A Top Producer alternative</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Top Producer is an established all-in-one platform: CRM, lead generation, agent websites and MLS market reports. Realtor Desk is a CRM, priced publicly in Canadian dollars. The useful comparison is scope and pricing transparency, not nationality — and that cuts against the angle you might expect.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <div>
              <h2 className="mb-4">Scope is the real difference</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Top Producer sells a platform: lead generation products, an agent website, MLS market snapshot reports, transaction management, lead routing and AI writing tools, with a CRM at the centre. It integrates with 150+ lead sources. If you want your lead flow, your site and your database bought together, that breadth is the point of it.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Realtor Desk is the CRM alone. No website, no lead-generation programme, no transaction manager. Narrower on purpose, and cheaper as a consequence — but if you need the other pieces you would be buying them separately.
              </p>
            </div>
            <div>
              <h2 className="mb-4">Not the comparison you might expect</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                It would be convenient to frame this as Canadian versus American. It is not true. Top Producer&rsquo;s own footer names Constellation1 Inc. and Emphasys Canada Holdings Inc., so it is a Canadian-operated business with a long history in this market. Anyone selling you a nationality argument against them has not read their site.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                What is true is narrower and checkable: they do not publish pricing, and they make no published statement about French-language support. We publish $149 and $299 CAD on the pricing page, and the interface and client email both work in French.
              </p>
            </div>
            <div>
              <h2 className="mb-4">How to compare them properly</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Ask Top Producer for a written quote covering the seats you need, any setup or onboarding fee, the contract length and what renews automatically, and which lead products are billed separately from the CRM. Then compare that annual total against $999 or $1,788 for Solo.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Judge the CRM on the same terms. If their lead generation is what you actually want, the CRM price is not the number that matters and we are not the product you are shopping for.
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
              <h2 className="mb-3">A narrower product, priced on the page</h2>
              <p className="text-muted-foreground mb-6">$149 CAD a month for Solo, $299 for Team, no setup fee. Bilingual EN/FR, hosted in Canada.</p>
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

export default TopProducerAlternative;
