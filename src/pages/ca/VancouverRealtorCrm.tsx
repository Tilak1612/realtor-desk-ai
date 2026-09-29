import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

// Brief 17 of the keyword plan: "CRM for Vancouver realtors". Same constraint
// as Toronto — real local substance, not a city-name swap, and distinct
// substance rather than the Toronto page with the nouns changed.
//
// Board facts read from gvrealtors.ca on 28 September 2026: Greater Vancouver
// REALTORS (GVR) covers the Greater Vancouver Region; "Find a Home" links to
// realtylink.org; member-facing tools named on the site are Market Watch,
// ChartBook, residential and commercial dashboards, an Area Map and an
// Economics blog.
//
// No integration with any of them exists. Do not imply one.

const FAQS = [
  {
    q: "Does Realtor Desk connect to Greater Vancouver REALTORS?",
    a: "No. There is no GVR integration and none is scheduled. Listings import from a Realtor.ca URL or MLS number; native CREA DDF® sync is Q3 2026 roadmap.",
  },
  {
    q: "What tools does GVR provide?",
    a: "Their site names Market Watch, ChartBook, residential and commercial dashboards, an Area Map and an economics blog, with listing search via realtylink.org. Those cover market data and inventory, not client relationships.",
  },
  {
    q: "Why does a long sales cycle change what I need?",
    a: "Because the risk shifts from missing a fast lead to forgetting a slow one. You need a record that survives eighteen months and resurfaces the contact when they re-engage, rather than a list that only shows this week.",
  },
  {
    q: "Is this a BC-specific product?",
    a: "No. The board, the inventory and the cycle are local; the CRM is the same software everywhere. We would rather say that than sell a provincial edition that does not exist.",
  },
  {
    q: "What does it cost?",
    a: "$149 CAD a month for a single agent, $299 for Team, no setup fee, with a 14-day trial that requires a card to start.",
  },
];

const VancouverRealtorCrm = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="CRM for Vancouver Realtors"
        description="What a Greater Vancouver REALTORS member needs from a CRM, where board tools stop, and how listings work today — with no invented local integrations."
        keywords="crm for vancouver realtors, gvr crm, vancouver real estate crm, bc realtor crm"
        canonicalUrl="https://www.realtordesk.ai/ca/vancouver-realtor-crm"
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
            <h1 className="mb-6">A CRM for Vancouver realtors</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Greater Vancouver REALTORS gives you the market data and the listing feed. What it cannot tell you is which of last month&rsquo;s enquiries is quietly still looking. In a market where a single client may take two years to transact, that memory is the whole value of a CRM.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <div>
              <h2 className="mb-4">What GVR gives you, and what it does not</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Greater Vancouver REALTORS covers the Greater Vancouver Region, and its member tooling is unusually strong on data: Market Watch, ChartBook, residential and commercial dashboards, an Area Map and an economics blog, with public listing search through realtylink.org. If you want to know what the market did, the board has already told you.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                What none of it holds is the relationship. Realtor Desk sits next to those tools rather than replacing or connecting to them — there is no GVR integration and we are not implying one.
              </p>
            </div>
            <div>
              <h2 className="mb-4">A long cycle is a memory problem</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Vancouver&rsquo;s distinguishing feature for a CRM is not volume, it is duration. Affordability stretches the decision: a first-time buyer may watch for eighteen months, a downsizer may circle a building for two years, and the conversation you had in March is load-bearing by the following spring.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                A tool that only surfaces this week&rsquo;s hot leads is the wrong shape for that. What matters is that the long-dormant contact resurfaces when they start engaging again — which is why scoring here is built on behaviour over time rather than recency alone, and why the conversation timeline per client is the feature that earns its keep.
              </p>
            </div>
            <div>
              <h2 className="mb-4">Listings and language</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Import a property from a Realtor.ca URL or MLS number today. Native CREA DDF® sync is on the roadmap for Q3 2026 and is not live; there is no board-specific feed.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The bilingual side matters less in Vancouver than in Montreal and more than people assume — and the same mechanism that serves a francophone client is what lets you keep one client&rsquo;s correspondence in a different language from your own working interface.
              </p>
            </div>
            <div>
              <h2 className="mb-4">The parts that apply anywhere in BC</h2>
              <p className="text-muted-foreground leading-relaxed">
                Data hosted in Canada, CASL consent recorded per contact with a send refused when it is absent, unsubscribe enforced at send time, and pricing in Canadian dollars so a falling loonie does not quietly raise your software bill.
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
              <h2 className="mb-3">Memory that lasts the cycle</h2>
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

export default VancouverRealtorCrm;
