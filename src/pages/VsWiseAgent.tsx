import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check, X, Brain, Globe, Shield, DollarSign, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";

// 2026-10-11: rewritten against the 2026-10-11 fact sheet. Removed: every
// unsourced verdict on Wise Agent (US-only, no French, "Limited" DDF, USD
// pricing, US support, "Basic" AI), and for Realtor Desk the Toronto /
// Vancouver / Calgary market predictions, provincial market intelligence, the
// 24/7 chatbot that qualifies leads and books appointments, "Predictive AI",
// "PIPEDA Compliance", transaction management, a mobile app, "ROI Tracking",
// the Canadian support team, "built by Canadian agents" and the dated CREA DDF
// promise. Wise Agent cells now say "Ask the vendor" and the Wise Agent card is
// a list of questions to put to them.
//
// 2026-10-11, later the same day, by the owner's decision: Realtor Desk does
// NOT offer a migration service, so every migration offer was removed. Gone:
// the migration row in the table and the card in which Realtor Desk staff
// moved the Wise Agent data within a promised time. Replaced with the true
// process, read from src/lib/csvImport.ts and the import modal: the agent
// exports a CSV and imports it themselves; contacts only, no consent, no
// duplicate merging. The money-back guarantee card is unchanged.

const VsWiseAgent = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <SEO
        title="Wise Agent vs Realtor Desk | Canadian CRM Comparison"
        description="Wise Agent and Realtor Desk for a single Canadian agent: CAD pricing, French per contact, consent records, and what to ask Wise Agent before you choose."
        keywords="Wise Agent vs Realtor Desk, Wise Agent alternative Canada, Canadian real estate CRM"
        canonicalUrl="https://www.realtordesk.ai/vs/wise-agent"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Wise Agent vs Realtor Desk",
            "description": "Wise Agent and Realtor Desk for a single Canadian agent: CAD pricing, French per contact, consent records, and what to ask Wise Agent before you choose."
          }
        ]}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <Badge variant="secondary" className="mb-4">
            Comparison Guide
          </Badge>
          <h1 className="mb-6">
            Wise Agent vs Realtor Desk <span className="gradient-text">for a single Canadian agent</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            What Realtor Desk does and does not do, and the questions to put to Wise Agent before you choose.
          </p>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto mb-8">
            We build one of the products compared here, so weigh this accordingly. This page does not state Wise Agent&rsquo;s features or prices; check its own site for those.
          </p>
        </div>
      </section>

      {/* Canadian Focus */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">The Canadian specifics to compare</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8">
              <div className="text-center mb-4">
                <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <Badge variant="outline" className="mb-2">Wise Agent</Badge>
                <h3 className="text-xl font-bold">Questions to ask Wise Agent</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground flex-shrink-0">?</span>
                  <span className="text-sm">Which currency is each plan billed in?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground flex-shrink-0">?</span>
                  <span className="text-sm">Do the interface and client email work in French?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground flex-shrink-0">?</span>
                  <span className="text-sm">Is a consent date and source stored on each contact?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground flex-shrink-0">?</span>
                  <span className="text-sm">Where is the customer database hosted?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground flex-shrink-0">?</span>
                  <span className="text-sm">What does it support for Canadian listing data?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground flex-shrink-0">?</span>
                  <span className="text-sm">What is the contract length, and how do you export your contacts?</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-accent">
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">🇨🇦</div>
                <Badge className="mb-2 bg-rd-terra-800">Realtor Desk</Badge>
                <h3 className="text-xl font-bold">What Realtor Desk does</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-rd-terra-800 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">CAD $149 a month for a single agent</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-rd-terra-800 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">French or English set per contact; the interface and client email both work in French</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-rd-terra-800 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Date and source of consent recorded on each contact</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-rd-terra-800 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Production database hosted in Canada</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-rd-terra-800 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">A single listing can be brought in from a Realtor.ca address or an MLS number</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Native CREA DDF® sync is on the roadmap and is not live yet</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Capabilities */}
      <section className="section-padding bg-muted">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">What the AI in Realtor Desk does</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-accent/20">
              <Brain className="w-8 h-8 text-rd-terra-800 mb-3" />
              <h3 className="font-bold mb-2">A rule-based lead score</h3>
              <p className="text-sm text-muted-foreground mb-3">
                A 0-100 score per lead with a visible breakdown: engagement, behaviour, budget match, timeline and qualification
              </p>
              <Badge variant="outline" className="text-xs">
                Rule-based, not machine learning
              </Badge>
            </Card>

            <Card className="p-6 border-accent/20">
              <Brain className="w-8 h-8 text-rd-terra-800 mb-3" />
              <h3 className="font-bold mb-2">An assistant that drafts</h3>
              <p className="text-sm text-muted-foreground mb-3">
                The in-app assistant drafts a reply or summarises the thread on the contact you have open
              </p>
              <Badge variant="outline" className="text-xs">
                Nothing is sent to a client without you
              </Badge>
            </Card>

            <Card className="p-6 border-accent/20">
              <Brain className="w-8 h-8 text-rd-terra-800 mb-3" />
              <h3 className="font-bold mb-2">A suggested next action</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Each lead carries a suggested next action and a time to take it
              </p>
              <Badge variant="outline" className="text-xs">
                You decide whether to act on it
              </Badge>
            </Card>

            <Card className="p-6">
              <X className="w-8 h-8 text-muted-foreground mb-3" />
              <h3 className="font-bold mb-2">What it does not do</h3>
              <p className="text-sm text-muted-foreground mb-3">
                No lead-facing chatbot, no automatic replies, no automatic appointment booking, no voice agent and no WhatsApp
              </p>
              <Badge variant="outline" className="text-xs">
                Not available
              </Badge>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          <h2 className="text-center mb-12">Complete Feature Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left p-4 font-bold">Feature</th>
                  <th className="text-center p-4 font-bold">Realtor Desk</th>
                  <th className="text-center p-4 font-bold">Wise Agent</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Pricing Currency", rdai: "CAD", wise: "Check the vendor's pricing page" },
                  { feature: "Rule-based lead score (0 to 100, with breakdown)", rdai: true, wise: "Ask the vendor" },
                  { feature: "AI assistant inside the CRM", rdai: true, wise: "Ask the vendor" },
                  { feature: "French or English per contact", rdai: true, wise: "Ask the vendor" },
                  { feature: "Consent date and source on each contact", rdai: true, wise: "Ask the vendor" },
                  { feature: "Production database hosted in Canada", rdai: true, wise: "Ask the vendor" },
                  { feature: "Drag-and-drop pipeline with CAD totals", rdai: true, wise: "Ask the vendor" },
                  { feature: "Native CREA DDF® sync (roadmap)", rdai: "Not available yet", wise: "Ask the vendor" },
                  { feature: "Canadian market data", rdai: "Not available", wise: "Ask the vendor" },
                  { feature: "Lead-facing chatbot", rdai: "Not available", wise: "Ask the vendor" },
                  { feature: "Automated email sequences", rdai: "Not available", wise: "Ask the vendor" },
                  { feature: "Transaction management", rdai: "Not available", wise: "Ask the vendor" },
                  { feature: "Native mobile app", rdai: "Not available (responsive web app)", wise: "Ask the vendor" },
                  { feature: "Moving your contacts", rdai: "CSV import you run yourself", wise: "Ask the vendor" },
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
                      {typeof row.wise === 'boolean' ? (
                        row.wise ? <Check className="w-5 h-5 text-rd-terra-800 mx-auto" /> : <X className="w-5 h-5 text-destructive mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">{row.wise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Switch CTA */}
      <section className="section-padding bg-gradient-to-br from-accent/10 to-accent/5">
        <div className="container-custom max-w-4xl text-center">
          <h2 className="mb-6">If you decide to switch</h2>
          <p className="text-lg text-muted-foreground mb-8">
            The trial runs 14 days. A card is collected up front and nothing is charged before day 14.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6">
              <Shield className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Risk-Free Trial</h3>
              <p className="text-sm text-muted-foreground">
                30-day money-back guarantee. Not satisfied for any reason, full refund.
              </p>
            </Card>

            <Card className="p-6">
              {/* Was a migration done by Realtor Desk staff, with a promised
                  turnaround. There is no migration service; the agent moves
                  their own contacts. */}
              <Upload className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" />
              <h3 className="font-bold mb-2">A CSV import you run yourself</h3>
              <p className="text-sm text-muted-foreground">
                Export your Wise Agent contacts as a CSV file and import that file yourself. Nobody at Realtor Desk moves your data for you. It creates contacts only: no deals, history or consent. The{" "}
                <Link to="/features/import-contacts" className="underline">import documentation</Link>{" "}
                lists the columns it reads, and the{" "}
                <Link to="/resources/casl-compliance-real-estate-email-marketing-canada" className="underline">CASL guide</Link>{" "}
                covers the consent to record before you email a contact.
              </p>
            </Card>

            <Card className="p-6">
              <DollarSign className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" />
              <h3 className="font-bold mb-2">A published price</h3>
              <p className="text-sm text-muted-foreground">
                CAD $149 a month for a single agent. You can read it before you speak to anyone.
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
                View Pricing in CAD
              </Button>
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VsWiseAgent;