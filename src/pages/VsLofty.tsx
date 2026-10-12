import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check, X, Shield, Upload, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";

// 2026-10-11: rewritten against the 2026-10-11 fact sheet. Removed: the
// "Lofty's AI vs ours" cards (unsourced verdicts on Lofty; a chatbot, learning
// AI, predictive scoring and Toronto/Vancouver/Calgary market predictions we do
// not have), table rows that ticked a chatbot, email automation, a mobile app,
// a website builder and market data for Realtor Desk, the unsourced "30 min"
// support and "No contracts" rows, "PIPEDA compliant", the dated CREA DDF
// promise and the "200+ agents left Lofty" button. Lofty cells with no source
// now say "Ask the vendor"; the ones that cite lofty.com rest on the dated
// reading in the "Choosing between them" section.
//
// 2026-10-11, later the same day, by the owner's decision: Realtor Desk does
// NOT offer a migration service, so every migration offer was removed. Gone:
// the migration row in the table and the "Quick Migration" card, in which
// Realtor Desk staff did the whole move within a promised time. Replaced with the
// true process, read from src/lib/csvImport.ts and the import modal: the agent
// exports a CSV and imports it themselves; contacts only, no consent, no
// duplicate merging. The money-back guarantee card is unchanged.

const VsLofty = () => {
  const { t } = useTranslation();
  
  const comparisonSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Lofty vs Realtor Desk Comparison",
    "description": "Realtor Desk vs Lofty for Canadian agents: published CAD pricing, French per contact, database hosted in Canada. Lofty quotes its prices on request.",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Lofty", "description": "Pricing quoted on request; not published"},
        {"@type": "ListItem", "position": 2, "name": "Realtor Desk", "description": "$149 CAD a month for a single agent; French per contact; production database hosted in Canada"}
      ]
    }
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title="Realtor Desk vs Lofty for Canadian Agents"
        description="Realtor Desk vs Lofty for Canadian agents: published CAD pricing, French per contact, database hosted in Canada. Lofty quotes its prices on request."
        keywords="Lofty alternative, Lofty CRM alternative Canada, Realtor Desk vs Lofty, real estate CRM Canada"
        structuredData={[comparisonSchema]}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <Badge variant="secondary" className="mb-4">
            Lofty Alternative for Canadian Agents
          </Badge>
          <h1 className="mb-6">
            <span className="gradient-text">Realtor Desk</span> and Lofty, compared for Canadian agents
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            {/* Was "Save 85%". Lofty publishes no price — this page's own
                JSON-LD says so two screens up ("Pricing quoted on request; not
                published") — so there was no figure to compute a saving
                against. Verified 2026-09-28. */}
            $149 CAD a month for a single agent, published rather than quoted. French or English set per contact, and the production database hosted in Canada.
          </p>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-4">
            Native CREA DDF® sync is on the roadmap and is not live yet.
          </p>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto mb-8">
            We build one of the products compared here, so weigh this accordingly.
          </p>
        </div>
      </section>

      {/* What the AI does. The Lofty half of this section is gone: we have no
          source for what Lofty's AI can or cannot do. */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">What the AI in Realtor Desk does, and does not do</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-accent">
              <div className="text-center mb-4">
                <Badge className="mb-2 bg-rd-terra-800">Realtor Desk</Badge>
                <h3 className="text-xl font-bold">What it does</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-rd-terra-800 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Scores each lead from 0 to 100 by rule, with a visible breakdown</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-rd-terra-800 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Breakdown covers engagement, behaviour, budget match, timeline and qualification</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-rd-terra-800 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Suggests a next action and a time to take it</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-rd-terra-800 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">An in-app assistant drafts a reply or summarises the thread on the contact you have open</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-rd-terra-800 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Nothing is sent to a client without you</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8">
              <div className="text-center mb-4">
                <Badge variant="outline" className="mb-2">Realtor Desk</Badge>
                <h3 className="text-xl font-bold">What it does not do</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-sm">No lead-facing chatbot or website chat widget</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-sm">No automatic replies and no automatic appointment booking</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-sm">No voice agent and no WhatsApp</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-sm">No market data or price predictions</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-sm">The score is rule-based; it is not machine learning</span>
                </li>
              </ul>
            </Card>
          </div>

          <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto mt-8">
            We make no claim here about what Lofty&rsquo;s AI features do. Ask Lofty for a demo on your own leads and judge it there.
          </p>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          <h2 className="text-center mb-12">Detailed Feature Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left p-4 font-bold">Feature</th>
                  <th className="text-center p-4 font-bold">Realtor Desk</th>
                  <th className="text-center p-4 font-bold">Lofty</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Starting price", rdai: "$149/mo CAD", lofty: "Not published" },
                  { feature: "Published price", rdai: true, lofty: "Quoted on request" },
                  { feature: "Rule-based lead score (0 to 100, with breakdown)", rdai: true, lofty: "Ask the vendor" },
                  { feature: "In-app assistant that drafts a reply", rdai: true, lofty: "Ask the vendor" },
                  { feature: "French or English per contact", rdai: true, lofty: "Not stated on lofty.com" },
                  { feature: "Production database hosted in Canada", rdai: true, lofty: "Not stated on lofty.com" },
                  { feature: "Consent date and source on each contact", rdai: true, lofty: "Ask the vendor" },
                  { feature: "Native CREA DDF® sync (roadmap)", rdai: "Not available yet", lofty: "Not stated on lofty.com" },
                  { feature: "IDX website", rdai: "Not available", lofty: "Listed on lofty.com" },
                  { feature: "Lead generation programmes", rdai: "Not available", lofty: "Listed on lofty.com" },
                  { feature: "Seats, lead routing, shared pipeline", rdai: "Not available", lofty: "Ask the vendor" },
                  { feature: "Lead-facing chatbot", rdai: "Not available", lofty: "Ask the vendor" },
                  { feature: "Voice agent", rdai: "Not available", lofty: "Ask the vendor" },
                  { feature: "Automated email sequences", rdai: "Not available", lofty: "Ask the vendor" },
                  { feature: "Market data", rdai: "Not available", lofty: "Ask the vendor" },
                  { feature: "Native mobile app", rdai: "Not available (responsive web app)", lofty: "Ask the vendor" },
                  { feature: "Moving your contacts", rdai: "CSV import you run yourself", lofty: "Ask the vendor" },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{row.feature}</td>
                    <td className="p-4 text-center">
                      {typeof row.rdai === 'boolean' ? (
                        row.rdai ? <Check className="w-5 h-5 text-rd-terra-800 mx-auto" /> : <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      ) : (
                        <span className="text-rd-terra-800 font-semibold">{row.rdai}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.lofty === 'boolean' ? (
                        row.lofty ? <Check className="w-5 h-5 text-rd-terra-800 mx-auto" /> : <X className="w-5 h-5 text-destructive mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">{row.lofty}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* If you decide to switch. The middle card was "Quick Migration": Realtor
          Desk staff handling the whole move, with a promised turnaround. There is no such service;
          the agent moves their own contacts by CSV. */}
      <section className="section-padding bg-gradient-to-br from-accent/10 to-accent/5">
        <div className="container-custom max-w-4xl text-center">
          <h2 className="mb-6">If you decide to switch</h2>
          <p className="text-lg text-muted-foreground mb-8">
            The trial runs 14 days. A card is collected up front and nothing is charged before day 14.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6">
              <Shield className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Risk-Free Switch</h3>
              <p className="text-sm text-muted-foreground">
                30-day money-back guarantee. Not satisfied for any reason, full refund.
              </p>
            </Card>

            <Card className="p-6">
              <Upload className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" />
              <h3 className="font-bold mb-2">A CSV import you run yourself</h3>
              <p className="text-sm text-muted-foreground">
                Export your Lofty contacts as a CSV file and import that file yourself. Nobody at Realtor Desk moves your data for you. It creates contacts only: no deals, history or consent. The{" "}
                <Link to="/features/import-contacts" className="underline">import documentation</Link>{" "}
                lists the columns it reads, and the{" "}
                <Link to="/resources/casl-compliance-real-estate-email-marketing-canada" className="underline">CASL guide</Link>{" "}
                covers the consent to record before you email a contact.
              </p>
            </Card>

            <Card className="p-6">
              <DollarSign className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Transparent Pricing</h3>
              <p className="text-sm text-muted-foreground">
                $149/mo CAD on the Solo plan. Annual billing saves up to $789/yr.
              </p>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button size="lg" className="btn-gradient">
                Book a Demo
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline">
                View Pricing
              </Button>
            </Link>
          </div>

        </div>
      </section>

      <section className="section-padding border-t">
        <div className="container-custom max-w-3xl">
          <h2 className="mb-6">Choosing between them</h2>

          <p className="text-muted-foreground leading-relaxed mb-6">
            We build one of these, so weigh the framing accordingly. What follows
            is checkable: the Lofty facts come from lofty.com read on 28
            September 2026, and ours come from our own pricing and product.
          </p>

          <h3 className="text-lg font-semibold mb-2">They sell a platform; we sell a CRM</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Lofty bundles IDX websites, lead generation programmes and a CRM, with
            tiers for agents, teams, brokers and enterprise. If you want your
            website, your paid lead flow and your database from one vendor on one
            invoice, that is a real advantage and we do not offer it. Realtor Desk
            is the database and the follow-up, and expects your leads to arrive
            from wherever you already get them.
          </p>

          <h3 className="text-lg font-semibold mb-2">Cost is knowable on one side only</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            We are $149 CAD a month on Solo, or $999 a year, with no setup fee.
            Lofty does not publish prices — its pricing page asks you to request a
            quote and notes that cost varies with package, seat count, upgrades
            and lead-generation programmes. So ask for a written quote covering
            seats, setup, contract length and anything billed separately, and
            compare that total. Any number we printed for them would be a guess.
          </p>

          <h3 className="text-lg font-semibold mb-2">The Canadian specifics</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Our production database is hosted in Canada, billing is in CAD, and the
            interface and client-facing email both work in French. Some outside
            services (SMS, email delivery, AI drafting) may process data outside
            Canada. The date and source of consent are recorded per contact and a
            send from the inbox or by SMS is refused when no consent is on file.
            Lofty&rsquo;s site
            does not make statements about Canadian data residency, CREA DDF or
            French support — ask them if those matter to you rather than assuming
            either way.
          </p>

          <h3 className="text-lg font-semibold mb-2">Who should pick which</h3>
          <p className="text-muted-foreground leading-relaxed">
            Take Lofty if you want lead generation and a website bundled with the
            CRM and are comfortable with quoted pricing, or if you need seats for
            a team: Realtor Desk is a single-agent product. Take us if you work
            alone, have lead sources already and want a CRM that works in two
            languages at a price you can read off a page. If you are still
            shortlisting,{" "}
            <Link to="/blog/real-estate-crm-buying-guide" className="underline">
              the buying guide
            </Link>{" "}
            sets out how to run the evaluation, and{" "}
            <Link to="/switch-from-lofty" className="underline">
              the page on moving from Lofty
            </Link>{" "}
            covers what a CSV import you run yourself brings across if you do
            switch.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VsLofty;