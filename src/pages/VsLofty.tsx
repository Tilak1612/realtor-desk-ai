import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check, X, Brain, Shield, Clock, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";

const VsLofty = () => {
  const { t } = useTranslation();
  
  const comparisonSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Lofty vs RealtorDesk AI Comparison",
    "description": "Compare Lofty with RealtorDesk AI for Canadian real estate agents: published CAD pricing, bilingual EN/FR, data hosted in Canada, and CREA DDF\u00ae integration on the roadmap for Q3 2026.",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Lofty", "description": "Pricing quoted on request; not published"},
        {"@type": "ListItem", "position": 2, "name": "RealtorDesk AI", "description": "$149 CAD/mo, PIPEDA compliant, bilingual, CREA DDF® coming Q3 2026"}
      ]
    }
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title="Realtor Desk vs Lofty for Canadian Agents"
        description="Realtor Desk vs Lofty for Canadian agents: CAD pricing, bilingual EN/FR and data hosted in Canada. CREA DDF® is on the Q3 2026 roadmap."
        keywords="Lofty alternative, Lofty CRM alternative Canada, real estate CRM cheaper than Lofty, best CRM for Canadian realtors, CREA DDF integration, PIPEDA compliant CRM"
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
            Why Canadian Agents Choose <span className="gradient-text">RealtorDesk AI</span> Over Lofty
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {/* Was "Save 85%". Lofty publishes no price — this page's own
                JSON-LD says so two screens up ("Pricing quoted on request; not
                published") — so there was no figure to compute a saving
                against. Verified 2026-09-28. */}
            $149 CAD a month, published rather than quoted. Bilingual EN/FR, data hosted in Canada, and CREA DDF® integration on the roadmap for Q3 2026.
          </p>
        </div>
      </section>

      {/* AI Comparison */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">What "AI" Really Means</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-destructive/20">
              <div className="text-center mb-4">
                <Badge variant="outline" className="mb-2">Lofty's "AI"</Badge>
                <h3 className="text-xl font-bold">Basic Automation</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Pre-programmed chatbot responses</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <span className="text-sm">No predictive lead scoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Can't learn from your interactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <span className="text-sm">No market intelligence</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Generic email templates</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-accent">
              <div className="text-center mb-4">
                <Badge className="mb-2 bg-rd-terra-800">Realtor Desk</Badge>
                <h3 className="text-xl font-bold">Predictive Intelligence</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-rd-terra-800 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Intelligent conversation, understands context</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-rd-terra-800 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Ranks leads by observed engagement</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-rd-terra-800 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Learns and improves from every interaction</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-rd-terra-800 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Canadian market predictions (Toronto, Vancouver, Calgary)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-rd-terra-800 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Personalized content based on buyer behavior</span>
                </li>
              </ul>
            </Card>
          </div>
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
                  { feature: "Transparent Pricing", rdai: true, lofty: false },
                  { feature: "Predictive Lead Scoring", rdai: true, lofty: false },
                  { feature: "AI Learns & Adapts", rdai: true, lofty: false },
                  { feature: "Canadian Market Data", rdai: true, lofty: false },
                  { feature: "Bilingual (EN/FR)", rdai: true, lofty: false },
                  { feature: "Support Response Time", rdai: "30 min", lofty: "Days/weeks" },
                  { feature: "Call/Text Charges", rdai: "Included", lofty: "Extra cost" },
                  { feature: "Basic Chatbot", rdai: true, lofty: true },
                  { feature: "Email Automation", rdai: true, lofty: true },
                  { feature: "Mobile App", rdai: true, lofty: true },
                  { feature: "Website Builder", rdai: true, lofty: true },
                  { feature: "Free Migration", rdai: true, lofty: false },
                  { feature: "No Contracts", rdai: true, lofty: false },
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

      {/* Migration CTA */}
      <section className="section-padding bg-gradient-to-br from-accent/10 to-accent/5">
        <div className="container-custom max-w-4xl text-center">
          <Brain className="w-16 h-16 text-rd-terra-800 mx-auto mb-6" />
          <h2 className="mb-6">Upgrade to True AI-Powered Intelligence</h2>
          <p className="text-lg text-muted-foreground mb-8">
            See why Canadian agents are choosing RealtorDesk AI over Lofty
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
              <Clock className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Quick Migration</h3>
              <p className="text-sm text-muted-foreground">
                We handle everything. You're live and productive in 48 hours.
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
                See Why 200+ Agents Left Lofty
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
            Our data is hosted in Canada, billing is in CAD, and the interface and
            client-facing email both work in French. CASL consent is recorded per
            contact and a send is refused when it is missing. Lofty&rsquo;s site
            does not make statements about Canadian data residency, CREA DDF or
            French support — ask them if those matter to you rather than assuming
            either way.
          </p>

          <h3 className="text-lg font-semibold mb-2">Who should pick which</h3>
          <p className="text-muted-foreground leading-relaxed">
            Take Lofty if you want lead generation and a website bundled with the
            CRM and are comfortable with quoted pricing. Take us if you have lead
            sources already and want follow-up handled properly in two languages
            at a price you can read off a page. If you are still shortlisting,{" "}
            <Link to="/blog/real-estate-crm-buying-guide" className="underline">
              the buying guide
            </Link>{" "}
            sets out how to run the evaluation, and{" "}
            <Link to="/switch-from-lofty" className="underline">
              the migration page
            </Link>{" "}
            covers what moves across if you do switch.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VsLofty;