import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

// Brief 7 of the keyword plan: "Real Geeks alternative". The plan notes Real
// Geeks is US IDX-centric and that the Canada angle is Realtor.ca today, with
// CREA DDF only once the roadmap feature ships.
//
// Facts about Real Geeks below come from realgeeks.com read on 28 September
// 2026: the named modules are IDX Websites, Property Valuation Tool, MoveTo
// App, CRM/Lead Manager, Dialer, email drip, SMS autoresponders, Marketing
// Studio, Facebook Tool, Geek AI, Market Reports and a Marketplace. No pricing
// is published. Canada is not mentioned anywhere in the page content; there is
// a "CREA Disclaimer" link in the footer with no explanation attached.
//
// Do not turn that footer link into a claim in either direction.

const FAQS = [
  {
    q: "Does Real Geeks work in Canada?",
    a: "Their site markets to the United States and does not mention Canada in its product content. There is an unexplained CREA disclaimer link in the footer. We would not read that as Canadian support either way — ask them.",
  },
  {
    q: "What does Real Geeks cost?",
    a: "They do not publish prices; the site links to pricing without showing figures. Ask for a written quote covering seats, setup and contract length before comparing against a published price.",
  },
  {
    q: "Is Realtor Desk an IDX alternative?",
    a: "No, and that is the honest answer. We do not build websites or IDX search. If the website is the product you are shopping for, we are not a replacement for it.",
  },
  {
    q: "What about MLS listings?",
    a: "Realtor.ca import works today. Native CREA DDF® sync is on the Q3 2026 roadmap and is not live. We say that everywhere rather than implying the integration already exists.",
  },
  {
    q: "Can I move my contacts over?",
    a: "Yes, by CSV. Our migration pages document which columns are recognised, what does not come across, and how to test with twenty rows before committing.",
  },
];

const RealGeeksAlternative = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Real Geeks Alternative for Canadian Agents"
        description="Real Geeks is a US IDX and lead-generation platform. What that means for a Canadian agent, and where a Canada-hosted CRM is the better fit."
        keywords="real geeks alternative, real geeks canada, idx crm alternative canada"
        canonicalUrl="https://www.realtordesk.ai/compare/real-geeks-alternative"
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
            <h1 className="mb-6">A Real Geeks alternative for Canadian agents</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Real Geeks is an IDX website and lead-generation platform with a CRM attached. Realtor Desk is a CRM with no website product. If you want your site, your paid leads and your database from one US vendor, they are a reasonable choice and we are not. If you already have a website, the comparison changes.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <div>
              <h2 className="mb-4">They are not the same kind of product</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Real Geeks leads with IDX websites: a search experience on your own domain, a valuation tool to capture sellers, and lead generation feeding a CRM built to work those leads. The CRM is part of a funnel that starts with the website.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Realtor Desk has no website product and no lead-generation programme. It assumes your leads already arrive — from your site, from portals, from open houses, from referrals — and concerns itself with what happens next. If you do not have a website yet, that is a real gap on our side.
              </p>
            </div>
            <div>
              <h2 className="mb-4">What their site says about Canada</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nothing, in the page content. Real Geeks markets to the United States and does not mention Canada, CREA or French anywhere in its product copy. There is a "CREA Disclaimer" link in the footer, unexplained, which we are not going to interpret in either direction — ask them directly if Canadian listing data matters to you.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Pricing is not published either; the site links to pricing without showing figures. So a like-for-like cost comparison is not possible from public information.
              </p>
            </div>
            <div>
              <h2 className="mb-4">Where the Canadian difference is real</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Realtor Desk hosts client data in Canada, bills in CAD at $149 a month with no setup fee, records CASL consent per contact and refuses a send without it, and works in English and French in both the interface and client-facing email.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                On listings: Realtor.ca import works today. Native CREA DDF® sync is on the roadmap for Q3 2026 and is not live, so if MLS-driven IDX search is the centre of your business right now, that is an argument for a platform that already does it rather than for us.
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
              <h2 className="mb-3">If you already have a website</h2>
              <p className="text-muted-foreground mb-6">Realtor Desk handles the part after the lead arrives. $149 CAD a month, bilingual, hosted in Canada.</p>
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

export default RealGeeksAlternative;
