import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

// Brief 20 of the keyword plan: "real estate CRM pricing". The plan asks for a
// dated comparison table and notes no vendor owns the statistics angle.
//
// The honest version of this page turned out to be more interesting than the
// brief expected. Checking each vendor's own pricing page on 28 September 2026
// found that most of the category does not publish a price at all. So the table
// records who publishes and who quotes, with the figure only where the vendor
// states it. Every "not published" below was confirmed on the vendor's own
// pricing page that day, not assumed.
//
// Do not add a price here that a vendor does not publish. Two of the three
// fabrications removed from this site in September were invented competitor
// prices; this page is the one most likely to attract them back.

type Row = {
  vendor: string;
  published: boolean;
  price: string;
  currency: string;
  note: string;
};

const CHECKED = "28 September 2026";

const ROWS: Row[] = [
  {
    vendor: "Realtor Desk",
    published: true,
    price: "$149 / $299 per month",
    currency: "CAD",
    note: "Solo and Team. $999 / $2,997 billed annually. No setup fee. 14-day trial, card required to start.",
  },
  {
    vendor: "IXACT Contact",
    published: true,
    price: "$46.75 – $55 per month",
    currency: "USD",
    note: "Annual vs monthly billing. Team member seats listed separately. Add-ons priced individually.",
  },
  {
    vendor: "Wise Agent",
    published: true,
    price: "$49 – $69 per month",
    currency: "USD",
    note: "CRM and CRM + WiseSocial tiers; $42 / $59 billed annually. Enterprise is quoted.",
  },
  {
    vendor: "Lofty",
    published: false,
    price: "Not published",
    currency: "—",
    note: "Four tiers listed behind Request Pricing. States cost varies with package, seat count, upgrades and lead-gen programmes.",
  },
  {
    vendor: "BoldTrail",
    published: false,
    price: "Not published",
    currency: "—",
    note: "No pricing shown. Agent, team, broker and enterprise routes all lead to contact forms.",
  },
  {
    vendor: "Top Producer",
    published: false,
    price: "Not published",
    currency: "—",
    note: "No pricing on the product site; quoted on enquiry.",
  },
];

const FAQS = [
  {
    q: "How much does a real estate CRM cost?",
    a: "Where vendors publish a price, the range for a single agent runs from roughly USD $47 to USD $69 a month, and Realtor Desk is CAD $149. But half the category does not publish at all — Lofty, BoldTrail and Top Producer all quote on enquiry — so a single headline number for the market would be misleading.",
  },
  {
    q: "Why do so many CRMs hide their pricing?",
    a: "Usually because the price depends on seat count, lead-generation add-ons or a negotiated annual contract. That is a legitimate model for a platform sold to brokerages. It does mean you cannot compare on price without going through a sales conversation, and that the number you are quoted may not be the number someone else is quoted.",
  },
  {
    q: "What should I ask for in a quote?",
    a: "Four things in writing: the per-seat monthly cost, any setup or onboarding fee, the contract length and what happens at renewal, and which functions are billed separately. Add them up over twelve months before comparing against a published price.",
  },
  {
    q: "Is a cheaper CRM worse?",
    a: "Not inherently. Wise Agent is among the least expensive and is widely used by solo agents. Price tends to track breadth — websites, lead generation and back office bundled in — rather than quality of the core CRM. Pay for the scope you will actually use.",
  },
  {
    q: "What does currency do to the comparison?",
    a: "More than most Canadian buyers expect. A USD-billed subscription moves with the exchange rate every month, so a plan that looked comparable in January may not in September. When you compare, either convert everything on the same day or note which prices are in which currency.",
  },
];

const RealEstateCrmPricing = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="How Much Does a Real Estate CRM Cost?"
        description="What real estate CRMs actually cost, checked against each vendor's own pricing page — including the ones that publish nothing and quote on enquiry instead."
        keywords="real estate crm pricing, real estate crm cost, crm pricing comparison realtors, how much does a real estate crm cost"
        canonicalUrl="https://www.realtordesk.ai/resources/real-estate-crm-pricing"
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
            <h1 className="mb-6">How much does a real estate CRM cost?</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Among vendors that publish a price, a single agent pays roughly USD
              $47 to $69 a month, and Realtor Desk is CAD $149. The more useful
              finding is that half of this category publishes nothing at all — so
              the first question is not what a CRM costs, but whether the vendor
              will tell you before a sales call.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <div>
              <h2 className="mb-3">Published prices, checked {CHECKED}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Each figure below comes from the vendor&rsquo;s own pricing page on
                that date. Where a vendor does not publish, the row says so rather
                than carrying an estimate. We build one of these products, which is
                why the table reports sources instead of picking a winner.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-semibold">Vendor</th>
                      <th className="text-left py-2 pr-4 font-semibold">Entry price</th>
                      <th className="text-left py-2 pr-4 font-semibold">Currency</th>
                      <th className="text-left py-2 font-semibold">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map((r) => (
                      <tr key={r.vendor} className="border-b last:border-0">
                        <td className="py-3 pr-4 font-medium">{r.vendor}</td>
                        <td className={`py-3 pr-4 ${r.published ? "" : "text-muted-foreground"}`}>
                          {r.price}
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">{r.currency}</td>
                        <td className="py-3 text-muted-foreground">{r.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Prices change. Treat this as a dated snapshot and confirm on the
                vendor&rsquo;s site before deciding.
              </p>
            </div>

            <div>
              <h2 className="mb-4">The cost that is not on the price page</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>
                  <strong className="text-foreground">Setup and onboarding.</strong>{" "}
                  Often quoted separately, and often the largest first-year line
                  after the subscription itself.
                </li>
                <li>
                  <strong className="text-foreground">Seats.</strong> A price
                  advertised for one agent rarely holds for four.
                </li>
                <li>
                  <strong className="text-foreground">Lead generation.</strong>{" "}
                  Several platforms bundle paid lead programmes into the quote, which
                  makes the CRM look expensive and the leads look free. Ask for them
                  separated.
                </li>
                <li>
                  <strong className="text-foreground">Contract length.</strong> An
                  annual commitment is common where pricing is quoted rather than
                  published. Ask what happens at renewal.
                </li>
                <li>
                  <strong className="text-foreground">Exchange rate.</strong> A
                  USD-billed plan changes cost in CAD every month.
                </li>
              </ul>
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
              <h2 className="mb-3">Our price is on the page</h2>
              <p className="text-muted-foreground mb-6">
                $149 CAD a month for Solo, $299 for Team, no setup fee. You can read
                it without talking to anyone.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild>
                  <Link to="/pricing">See pricing</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/blog/real-estate-crm-buying-guide">How to choose</Link>
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

export default RealEstateCrmPricing;
