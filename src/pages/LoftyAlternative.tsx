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
        "name": "How much cheaper is RealtorDesk AI than Lofty?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "RealtorDesk AI starts at $149 CAD/month with no setup fees, while Lofty starts at $700+ USD/month with setup fees of $499-$1,499. Canadian agents save approximately 85% in the first year by switching to RealtorDesk AI."
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
          "text": "Yes, RealtorDesk AI includes all core CRM features (lead management, pipeline, automation, SMS/email) plus PIPEDA-aware data handling, bilingual support, and an AI voice agent (coming soon). CREA DDF® (Canadian MLS) integration is planned for Q3 2026."
        }
      }
    ]
  };

  const comparisonTableSchema = {
    "@context": "https://schema.org",
    "@type": "ComparisonTable",
    "name": "Lofty vs RealtorDesk AI Feature Comparison",
    "items": [
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
        title="Lofty CRM Alternative for Canadian Agents in 2026"
        description="Best Lofty alternative for Canadian real estate agents. RealtorDesk AI offers PIPEDA compliance, AI voice agent, bilingual support, and CREA DDF® integration (coming Q3 2026) at $149 CAD/mo vs Lofty's $700+ USD/mo. Save 85%. Free migration."
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
              Save 85% vs Lofty:<br />
              <span className="gradient-text">Built for Canadian Agents</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Get PIPEDA compliance, AI voice agent, bilingual support, and CREA DDF® integration (coming Q3 2026) at <strong>$149 CAD/month</strong> vs Lofty's <strong>$700+ USD/month</strong>. No setup fees. Free migration.
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
              ✓ No credit card required &nbsp;•&nbsp; ✓ Free data migration &nbsp;•&nbsp; ✓ Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Price Comparison Hero Stats */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center mb-12">The Real Cost Comparison</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center border-2 border-primary">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-primary" />
                <div className="text-3xl font-bold mb-2 text-primary">$10,188</div>
                <div className="text-sm text-muted-foreground mb-1">First Year with Lofty</div>
                <div className="text-xs text-muted-foreground">
                  $700/mo × 12 + $1,499 setup fee + $399 migration
                </div>
              </Card>
              <Card className="p-6 text-center border-2 border-accent">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-accent" />
                <div className="text-3xl font-bold mb-2 text-accent">$1,788</div>
                <div className="text-sm text-muted-foreground mb-1">First Year with RealtorDesk AI</div>
                <div className="text-xs text-muted-foreground">
                  $149/mo × 12 + $0 setup + $0 migration
                </div>
              </Card>
              <Card className="p-6 text-center border-2 border-green-500">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <div className="text-3xl font-bold mb-2 text-green-500">$8,400</div>
                <div className="text-sm text-muted-foreground mb-1">You Save in Year 1</div>
                <div className="text-xs text-muted-foreground">
                  83% cost savings by switching
                </div>
              </Card>
            </div>
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
                    <td className="text-center py-3 px-4 font-bold text-accent">$149 CAD</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">$700+ USD</td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">Setup Fee</td>
                    <td className="text-center py-3 px-4"><Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500">$0</Badge></td>
                    <td className="text-center py-3 px-4 text-muted-foreground">$499 - $1,499</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Free Data Migration</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><X className="w-5 h-5 text-destructive mx-auto" /></td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">Free Trial</td>
                    <td className="text-center py-3 px-4 font-medium">14 days</td>
                    <td className="text-center py-3 px-4"><X className="w-5 h-5 text-destructive mx-auto" /></td>
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
                    <td className="text-center py-3 px-4"><Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500">Coming Soon</Badge></td>
                    <td className="text-center py-3 px-4"><X className="w-5 h-5 text-destructive mx-auto" /></td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">24/7 AI Chatbot</td>
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
                    <td className="text-center py-3 px-4"><Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500">Coming Soon</Badge></td>
                    <td className="text-center py-3 px-4"><X className="w-5 h-5 text-destructive mx-auto" /></td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">Pipeline Management</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Mobile App (iOS/Android)</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t-2 bg-primary/5">
                    <td className="py-4 px-4 font-bold">Total First Year Cost</td>
                    <td className="text-center py-4 px-4">
                      <div className="text-2xl font-bold text-accent">$1,788 CAD</div>
                      <div className="text-xs text-muted-foreground">$149/mo × 12</div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="text-2xl font-bold text-destructive">$10,188+ USD</div>
                      <div className="text-xs text-muted-foreground">~$13,850 CAD</div>
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
                <h3 className="text-xl font-bold mb-2">85% Cost Savings</h3>
                <p className="text-muted-foreground">
                  Save over $8,000 in the first year alone. No setup fees, no hidden costs, no expensive add-ons. Transparent pricing that makes sense for Canadian agents.
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
                  We'll migrate your data from Lofty for free and help you set up your account. No $1,499 setup fee, no $399 migration charge. Just seamless onboarding.
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
                <h3 className="text-lg font-bold mb-2">How much cheaper is RealtorDesk AI than Lofty?</h3>
                <p className="text-muted-foreground">
                  RealtorDesk AI starts at $149 CAD/month with no setup fees, while Lofty starts at $700+ USD/month with setup fees of $499-$1,499. Canadian agents save approximately 85% in the first year by switching to RealtorDesk AI.
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
                  Yes, RealtorDesk AI includes all core CRM features (lead management, pipeline, automation, SMS/email) plus PIPEDA-aware data handling, bilingual support, and an AI voice agent (coming soon). CREA DDF® (Canadian MLS) integration is planned for Q3 2026.
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
            <h2 className="mb-6">Ready to Save 85% and Get More Features?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join hundreds of Canadian agents who switched from Lofty to RealtorDesk AI. Start your free 14-day trial today—no credit card required.
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
