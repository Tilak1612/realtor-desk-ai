import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check, X, DollarSign, Clock, Globe, Shield, Zap, MessageSquare } from "lucide-react";

const LoftyAlternative = () => {
  const comparisonFAQSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much cheaper is Realtor Desk than Lofty?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We cannot tell you, and neither can anyone else. Realtor Desk is $149 CAD a month with no setup fee. Lofty does not publish prices \u2014 its pricing page asks you to request a quote \u2014 so there is no public figure to compare against."
        }
      },
      {
        "@type": "Question",
        "name": "Does RealtorDesk AI work with CREA DDF® like Lofty?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "CREA DDF® integration is on the Q3 2026 roadmap for RealtorDesk AI. Unlike Lofty which is US-focused, RealtorDesk AI is designed from the ground up for the Canadian real estate market."
        }
      },
      {
        "@type": "Question",
        "name": "Can I migrate from Lofty to RealtorDesk AI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, RealtorDesk AI offers free data migration from Lofty. Our team will help you transfer your contacts, deals, and automation workflows at no additional cost."
        }
      },
      {
        "@type": "Question",
        "name": "Does RealtorDesk AI have the same features as Lofty?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Not all of them. Realtor Desk covers the CRM core: lead management, a deal pipeline, SMS and one conversation timeline per client, with French per contact. It does not include an IDX website, lead generation, a power dialer or a voice agent, which Lofty lists. Choose on which of those you actually use."
        }
      }
    ]
  };

  const comparisonTableSchema = {
    "@context": "https://schema.org",
    // ComparisonTable is not a schema.org type — the block validated as JSON
    // but search engines ignore an unknown @type, so it did nothing. ItemList
    // is the valid equivalent for a two-product comparison.
    "@type": "ItemList",
    "name": "Lofty vs Realtor Desk feature comparison",
    "itemListElement": [
      {
        "@type": "Product",
        "name": "RealtorDesk AI",
        "offers": {
          "@type": "Offer",
          "price": "149.00",
          "priceCurrency": "CAD"
        }
      },
      {
        "@type": "Product",
        "name": "Lofty",
        "offers": {
          "@type": "Offer",
          "price": "700.00",
          "priceCurrency": "USD"
        }
      }
    ]
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title="Lofty Alternative for Canadian Agents"
        description="A Canadian alternative to Lofty: bilingual EN/FR, data hosted in Canada and $149 CAD/month. CREA DDF® integration is on the Q3 2026 roadmap."
        keywords="Lofty alternative, Lofty CRM alternative Canada, cheaper than Lofty, best real estate CRM Canada, CREA DDF CRM, PIPEDA compliant CRM, Lofty vs RealtorDesk, switch from Lofty"
        canonicalUrl="https://www.realtordesk.ai/lofty-alternative"
        structuredData={[comparisonFAQSchema, comparisonTableSchema]}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              #1 Lofty Alternative for Canadian Agents
            </Badge>
            <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold">
              A Canadian alternative to Lofty<br />
              <span className="gradient-text">with a price you can read</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Get bilingual EN/FR support, data hosted in Canada, and CREA DDF® integration (coming Q3 2026) at <strong>$149 CAD/month</strong> with no setup fee. Lofty quotes its pricing on request rather than publishing it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="group">
                <Link to="/signup">
                  Start Free 14-Day Trial
                  <Zap className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/demo">See Why Agents Switch</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              ✓ Cancel anytime before you're charged &nbsp;•&nbsp; ✓ Free data migration &nbsp;•&nbsp; ✓ Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* What a price comparison can honestly say.
          This was three cards — "$10,188 First Year with Lofty" built from
          $700/mo + a $1,499 setup fee + $399 migration, against "$1,788" for
          us, concluding "$8,400 You Save". Verified 2026-09-28: lofty.com
          publishes no prices at all. Every one of those competitor figures was
          invented, the page said so itself two sections later ("Not
          published"), and the saving derived from them was quoted as 85% in
          the H1 and 83% on the card. A comparison that makes up the other
          side's number is not a comparison. */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6">What a price comparison can honestly say</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Realtor Desk is <strong>$149 CAD a month</strong> for a single
              agent and <strong>$299</strong> for the Team plan, with no setup
              fee. Those numbers are on our pricing page and on the checkout.
            </p>
            <p className="text-muted-foreground mb-6">
              Lofty does not publish prices. Its pricing page asks you to
              request a quote, so anyone telling you what Lofty costs — us
              included — is guessing. We are not going to invent a figure and
              then calculate your savings from it.
            </p>
            <p className="text-muted-foreground">
              What you can compare today is what each vendor is willing to tell
              you before you talk to sales. Ask Lofty for a written quote
              including setup and migration, then put it next to ours.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center mb-4">Feature-by-Feature Comparison</h2>
            <p className="text-center text-muted-foreground mb-12">
              Why Canadian agents choose RealtorDesk AI over Lofty
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2">
                    <th className="text-left py-4 px-4 font-semibold">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold text-primary">RealtorDesk AI</th>
                    <th className="text-center py-4 px-4 font-semibold text-muted-foreground">Lofty</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-muted/30">
                    <td className="py-4 px-4 font-semibold" colSpan={3}>Pricing & Value</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Starting Price (Monthly)</td>
                    <td className="text-center py-3 px-4 font-bold text-rd-terra-800">$149 CAD</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Not published</td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">Setup Fee</td>
                    <td className="text-center py-3 px-4"><Badge variant="outline" className="bg-green-500/10 text-green-800 border-green-500">$0</Badge></td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Not published</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Free Data Migration</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    {/* Was a red X. We have no source for what Lofty includes
                        in a quote it does not publish. */}
                    <td className="text-center py-3 px-4 text-muted-foreground">Not published</td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">Free Trial</td>
                    <td className="text-center py-3 px-4 font-medium">14 days</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Demo on request</td>
                  </tr>
                  <tr className="border-b bg-muted/30">
                    <td className="py-4 px-4 font-semibold" colSpan={3}>Canadian Market Features</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">CREA DDF® Integration</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Coming Q3 2026</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">❌ US-focused</td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">PIPEDA Compliance (Canadian Data Hosting)</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4 text-muted-foreground">⚠️ US servers</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Bilingual Support (EN/FR)</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><X className="w-5 h-5 text-destructive mx-auto" /></td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">Quebec Market Ready</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><X className="w-5 h-5 text-destructive mx-auto" /></td>
                  </tr>
                  <tr className="border-b bg-muted/30">
                    <td className="py-4 px-4 font-semibold" colSpan={3}>AI Features</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">AI Voice Agent (Inbound/Outbound)</td>
                    <td className="text-center py-3 px-4"><Badge variant="outline" className="bg-yellow-500/10 text-yellow-800 border-yellow-500">Coming Soon</Badge></td>
                    <td className="text-center py-3 px-4"><X className="w-5 h-5 text-destructive mx-auto" /></td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">AI assistant inside the CRM</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4 text-muted-foreground">$99/mo add-on</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Predictive Lead Scoring</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">Custom AI Training</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Limited</td>
                  </tr>
                  <tr className="border-b bg-muted/30">
                    <td className="py-4 px-4 font-semibold" colSpan={3}>Core CRM Features</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Contact Management</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">Email & SMS Automation</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">WhatsApp Integration</td>
                    <td className="text-center py-3 px-4"><Badge variant="outline" className="bg-yellow-500/10 text-yellow-800 border-yellow-500">Coming Soon</Badge></td>
                    <td className="text-center py-3 px-4"><X className="w-5 h-5 text-destructive mx-auto" /></td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">Pipeline Management</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Mobile access</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t-2 bg-primary/5">
                    <td className="py-4 px-4 font-bold">Total First Year Cost</td>
                    <td className="text-center py-4 px-4">
                      <div className="text-2xl font-bold text-rd-terra-800">$1,788 CAD</div>
                      <div className="text-xs text-muted-foreground">$149/mo × 12, no setup fee</div>
                    </td>
                    {/* Was "$10,188+ USD / ~$13,850 CAD". Both invented. */}
                    <td className="text-center py-4 px-4">
                      <div className="text-2xl font-bold text-muted-foreground">Quote only</div>
                      <div className="text-xs text-muted-foreground">No public price to total</div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Why Canadian Agents Switch */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center mb-12">Why Canadian Agents Are Switching from Lofty</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <Shield className="w-10 h-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Built for Canada</h3>
                <p className="text-muted-foreground">
                  Lofty is designed for the US market. RealtorDesk AI is built specifically for Canadian agents with PIPEDA compliance, bilingual support, Canadian data hosting, and CREA DDF® integration coming Q3 2026.
                </p>
              </Card>
              <Card className="p-6">
                <DollarSign className="w-10 h-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">A price you can check</h3>
                <p className="text-muted-foreground">
                  $149 CAD a month, no setup fee, no add-on tiers, and the number is published rather than quoted. You can see what you will pay before you speak to anyone.
                </p>
              </Card>
              <Card className="p-6">
                <MessageSquare className="w-10 h-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">AI Voice Agent (Coming Soon)</h3>
                <p className="text-muted-foreground">
                  AI voice calling for inbound and outbound lead qualification is on our roadmap. Already included in your plan at no extra cost when it launches.
                </p>
              </Card>
              <Card className="p-6">
                <Clock className="w-10 h-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Free Migration & Setup</h3>
                <p className="text-muted-foreground">
                  We&rsquo;ll migrate your data from Lofty for free and help you set up your account. No setup fee and no migration charge on our side.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-2">How much cheaper is Realtor Desk than Lofty?</h3>
                <p className="text-muted-foreground">
                  We cannot tell you, and neither can anyone else. Realtor Desk is $149 CAD a month with no setup fee. Lofty does not publish prices \u2014 its pricing page asks you to request a quote \u2014 so there is no public figure to compare against. Ask them for a written quote and put it next to ours.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-2">Will RealtorDesk AI work with CREA DDF® like Lofty?</h3>
                <p className="text-muted-foreground">
                  CREA DDF® integration is on the Q3 2026 roadmap for RealtorDesk AI. Unlike Lofty which is US-focused, RealtorDesk AI is designed from the ground up for the Canadian real estate market.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-2">Can I migrate from Lofty to RealtorDesk AI?</h3>
                <p className="text-muted-foreground">
                  Yes, RealtorDesk AI offers free data migration from Lofty. Our team will help you transfer your contacts, deals, and automation workflows at no additional cost.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-2">Does RealtorDesk AI have the same features as Lofty?</h3>
                <p className="text-muted-foreground">
                  Not all of them. Realtor Desk covers the CRM core: lead management, a deal pipeline, SMS and one conversation timeline per client, with French per contact. It does not include an IDX website, lead generation, a power dialer or a voice agent, which Lofty lists. Choose on which of those you actually use.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-2">Is there a contract or can I cancel anytime?</h3>
                <p className="text-muted-foreground">
                  RealtorDesk AI has no long-term contracts. All plans are month-to-month and you can cancel anytime from your billing settings. Unlike Lofty which often requires annual commitments.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6">See it before you decide</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start a free 14-day trial and work a week of your own leads in it. A card is collected up front and nothing is charged before day 14, so you can cancel before you pay anything.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="group">
                <Link to="/signup">
                  Start Free Trial
                  <Zap className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/demo">Book a Demo</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Questions? Email us at <a href="mailto:support@realtordesk.ai" className="text-primary hover:underline">support@realtordesk.ai</a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LoftyAlternative;
