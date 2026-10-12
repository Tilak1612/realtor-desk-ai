import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check, X, Shield, Clock, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";
import BoldTrailComparisonTable from "@/components/BoldTrailComparisonTable";

// 2026-10-11: rewritten against the 2026-10-11 fact sheet. Removed: "30-minute
// support response" and 24/7 live chat, "enterprise-grade reliability",
// "productive within 24 hours", "Toronto, Vancouver, Calgary market
// intelligence", "PIPEDA compliant", "True Predictive AI ... 6x better", the
// dated CREA DDF promise, table rows ticking transaction management, email
// automation and a mobile app for Realtor Desk, the unsourced BoldTrail
// verdicts ("3-5 days" support, contract "Yes", crosses), "why Canadian agents
// are switching" and "early-access agents who chose us". BoldTrail cells with
// no source now say "Ask the vendor".
//
// NOT changed here: <BoldTrailComparisonTable /> lives in src/components and
// was outside this edit's file list.

const VsBoldTrail = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <SEO
        title="BoldTrail Alternative for Canadian Agents"
        description="A BoldTrail alternative for Canadian agents: Realtor Desk is a single-agent CRM at CAD $149 a month, with French per contact. BoldTrail quotes on request."
        keywords="BoldTrail alternative, Realtor Desk vs BoldTrail, Canadian real estate CRM"
        canonicalUrl="https://www.realtordesk.ai/vs/boldtrail"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "BoldTrail vs Realtor Desk Comparison",
            "description": "A BoldTrail alternative for Canadian agents: Realtor Desk is a single-agent CRM at CAD $149 a month, with French per contact. BoldTrail quotes on request.",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "BoldTrail", "description": "Pricing quoted on request; not published" },
                { "@type": "ListItem", "position": 2, "name": "Realtor Desk", "description": "$149/mo CAD, $0 setup fee" }
              ]
            }
          }
        ]}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <Badge variant="secondary" className="mb-4">
            BoldTrail Comparison
          </Badge>
          <h1 className="mb-6">
            BoldTrail Alternative for Canada: <span className="gradient-text">Realtor Desk</span> at $149/mo CAD
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            A CRM for a single Canadian agent at $149/mo CAD with no setup fee, French or English set per contact, and the production database hosted in Canada.
          </p>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto mb-8">
            We build one of the products compared here, so weigh this accordingly.
          </p>
          
          {/* Cost Comparison */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <Card className="p-6 flex-1 border-destructive/20">
              <div className="text-sm text-muted-foreground mb-2">BoldTrail First Year</div>
              <div className="text-3xl font-bold text-muted-foreground mb-1">Quoted</div>
              <div className="text-xs text-muted-foreground">BoldTrail does not publish pricing</div>
            </Card>
            
            {/* Was a downward-trend arrow, which read as a saving. There is no
                published BoldTrail price to compute one from. */}
            <div className="text-lg font-semibold text-muted-foreground">vs</div>
            
            <Card className="p-6 flex-1 border-accent">
              <div className="text-sm text-muted-foreground mb-2">Realtor Desk</div>
              <div className="text-3xl font-bold gradient-text mb-1">$149/mo</div>
              <div className="text-xs text-rd-terra-800 font-semibold">$149/mo CAD · no setup fee</div>
            </Card>
          </div>
        </div>
      </section>

      <BoldTrailComparisonTable />

      {/* How We're Different */}
      <section className="section-padding bg-muted">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">What Realtor Desk Is, and Is Not</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-accent/20">
              <Check className="w-8 h-8 text-rd-terra-800 mb-3" />
              <h3 className="font-bold mb-2">$149/mo CAD, zero setup fee</h3>
              <p className="text-sm text-muted-foreground">
                The price is published, for a single agent, with no setup fee. Compare it against the total you are quoted.
              </p>
            </Card>

            <Card className="p-6 border-accent/20">
              <Check className="w-8 h-8 text-rd-terra-800 mb-3" />
              <h3 className="font-bold mb-2">Canadian specifics</h3>
              <p className="text-sm text-muted-foreground">
                French or English set per contact. Date and source of consent recorded on each contact. Production database hosted in Canada.
              </p>
            </Card>

            <Card className="p-6 border-accent/20">
              <Check className="w-8 h-8 text-rd-terra-800 mb-3" />
              <h3 className="font-bold mb-2">A lead score you can read</h3>
              <p className="text-sm text-muted-foreground">
                A rule-based score from 0 to 100 with a visible breakdown, and a suggested next action. An in-app assistant drafts a reply; nothing is sent to a client without you.
              </p>
            </Card>

            <Card className="p-6">
              <X className="w-8 h-8 text-muted-foreground mb-3" />
              <h3 className="font-bold mb-2">What it does not do</h3>
              <p className="text-sm text-muted-foreground">
                No seats, lead routing or shared pipeline. No IDX website, lead generation, transaction management or back office. Native CREA DDF® sync is on the roadmap and is not live yet.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          <h2 className="text-center mb-12">Feature-by-Feature Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left p-4 font-bold">Feature</th>
                  <th className="text-center p-4 font-bold">Realtor Desk</th>
                  <th className="text-center p-4 font-bold">BoldTrail</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "List price", rdai: "$149/mo CAD", boldtrail: "Not published" },
                  { feature: "Setup fee", rdai: "$0", boldtrail: "Not published" },
                  { feature: "Rule-based lead score (0 to 100, with breakdown)", rdai: true, boldtrail: "Ask the vendor" },
                  { feature: "AI assistant inside the CRM", rdai: true, boldtrail: "Ask the vendor" },
                  { feature: "Production database hosted in Canada", rdai: true, boldtrail: "Ask the vendor" },
                  { feature: "French or English per contact", rdai: true, boldtrail: "Ask the vendor" },
                  { feature: "Consent date and source on each contact", rdai: true, boldtrail: "Ask the vendor" },
                  { feature: "Native CREA DDF® sync (roadmap)", rdai: "Not available yet", boldtrail: "Ask the vendor" },
                  { feature: "Seats, lead routing, shared pipeline", rdai: "Not available", boldtrail: "Ask the vendor" },
                  { feature: "IDX website and lead generation", rdai: "Not available", boldtrail: "Ask the vendor" },
                  { feature: "Automated email sequences", rdai: "Not available", boldtrail: "Ask the vendor" },
                  { feature: "Transaction Management", rdai: "Not available", boldtrail: "Ask the vendor" },
                  { feature: "Native mobile app", rdai: "Not available (responsive web app)", boldtrail: "Ask the vendor" },
                  { feature: "Free Migration", rdai: true, boldtrail: "Ask the vendor" },
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
                      {typeof row.boldtrail === 'boolean' ? (
                        row.boldtrail ? <Check className="w-5 h-5 text-rd-terra-800 mx-auto" /> : <X className="w-5 h-5 text-destructive mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">{row.boldtrail}</span>
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
          <h2 className="mb-6">We Make Switching Easy</h2>
          <p className="text-lg text-muted-foreground mb-8">
            If you decide to move, this is what we offer.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6">
              <Shield className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" />
              <h3 className="font-bold mb-2">100% Free Migration</h3>
              <p className="text-sm text-muted-foreground">
                We export your BoldTrail data and import it to your new account, at no charge.
              </p>
            </Card>

            <Card className="p-6">
              <Clock className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Live in 48 Hours</h3>
              <p className="text-sm text-muted-foreground">
                Schedule migration call, we handle everything, you're up and running in 2 days.
              </p>
            </Card>

            <Card className="p-6">
              <DollarSign className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" />
              <h3 className="font-bold mb-2">30-Day Guarantee</h3>
              <p className="text-sm text-muted-foreground">
                Not satisfied for any reason in your first 30 days, we refund 100%. No questions asked.
              </p>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button size="lg" className="btn-gradient">
                Schedule Free Migration Call
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline">
                See Pricing
              </Button>
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VsBoldTrail;