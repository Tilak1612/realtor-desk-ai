import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check, X, Brain, Globe, Shield, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

const VsWiseAgent = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <Badge variant="secondary" className="mb-4">
            Comparison Guide
          </Badge>
          <h1 className="mb-6">
            Get AI Superiority and <span className="gradient-text">Canadian Features</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Wise Agent is fine for US agents. Canadian agents need Canadian solutions.
          </p>
        </div>
      </section>

      {/* Canadian Focus */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">Why Canadian Agents Need Canadian CRM</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-destructive/20">
              <div className="text-center mb-4">
                <Globe className="w-12 h-12 text-destructive mx-auto mb-3" />
                <Badge variant="outline" className="mb-2">Wise Agent</Badge>
                <h3 className="text-xl font-bold">Built for US Market</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <span className="text-sm">No Canadian market intelligence</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <span className="text-sm">No French language support</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Limited CREA DDF® integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <span className="text-sm">No Toronto/Vancouver/Calgary insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <span className="text-sm">US-based support (timezone issues)</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Pricing in USD (conversion confusion)</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-accent">
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">🇨🇦</div>
                <Badge className="mb-2 bg-accent">Realtor Desk</Badge>
                <h3 className="text-xl font-bold">Built for Canada</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Toronto, Vancouver, Calgary market predictions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Full bilingual support (English/French)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Native CREA DDF® integration included</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Provincial market intelligence (all 10 provinces)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Canadian support team (your timezone)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Canadian dollar pricing (CAD)</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Capabilities */}
      <section className="section-padding bg-muted">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">AI Capabilities Wise Agent Lacks</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-accent/20">
              <Brain className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-bold mb-2">Predictive Lead Scoring</h3>
              <p className="text-sm text-muted-foreground mb-3">
                AI analyzes 50+ data points to predict which leads will convert in next 6-12 months
              </p>
              <Badge variant="outline" className="text-xs">
                72% accuracy vs. Wise Agent's manual guess
              </Badge>
            </Card>

            <Card className="p-6 border-accent/20">
              <Brain className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-bold mb-2">Intelligent Conversation</h3>
              <p className="text-sm text-muted-foreground mb-3">
                24/7 AI chatbot that understands context, qualifies leads, books appointments
              </p>
              <Badge variant="outline" className="text-xs">
                Not just canned auto-responses
              </Badge>
            </Card>

            <Card className="p-6 border-accent/20">
              <Brain className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-bold mb-2">Market Intelligence</h3>
              <p className="text-sm text-muted-foreground mb-3">
                AI predicts neighborhood trends, price movements, inventory changes
              </p>
              <Badge variant="outline" className="text-xs">
                Hyperlocal Canadian data
              </Badge>
            </Card>

            <Card className="p-6 border-accent/20">
              <Brain className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-bold mb-2">Optimal Timing</h3>
              <p className="text-sm text-muted-foreground mb-3">
                AI determines best time to contact each lead based on engagement patterns
              </p>
              <Badge variant="outline" className="text-xs">
                No more guessing when to follow up
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
                  { feature: "Predictive AI", rdai: true, wise: false },
                  { feature: "24/7 AI Chatbot", rdai: true, wise: "Basic" },
                  { feature: "Canadian Market Data", rdai: true, wise: false },
                  { feature: "Bilingual (EN/FR)", rdai: true, wise: false },
                  { feature: "CREA DDF® Integration", rdai: "Native", wise: "Limited" },
                  { feature: "Provincial Insights", rdai: true, wise: false },
                  { feature: "Support Timezone", rdai: "Canadian", wise: "US" },
                  { feature: "Pricing Currency", rdai: "CAD", wise: "USD" },
                  { feature: "PIPEDA Compliance", rdai: true, wise: false },
                  { feature: "Email Marketing", rdai: true, wise: true },
                  { feature: "Transaction Mgmt", rdai: true, wise: true },
                  { feature: "Mobile App", rdai: true, wise: true },
                  { feature: "Free Migration", rdai: true, wise: false },
                  { feature: "ROI Tracking", rdai: "Advanced", wise: "Basic" },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{row.feature}</td>
                    <td className="p-4 text-center">
                      {typeof row.rdai === 'boolean' ? (
                        row.rdai ? <Check className="w-5 h-5 text-accent mx-auto" /> : <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      ) : (
                        <span className="text-accent font-semibold">{row.rdai}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.wise === 'boolean' ? (
                        row.wise ? <Check className="w-5 h-5 text-accent mx-auto" /> : <X className="w-5 h-5 text-destructive mx-auto" />
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
          <div className="text-4xl mb-4">🇨🇦</div>
          <h2 className="mb-6">Switch to Canadian-Built AI CRM</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Get bilingual support & Canadian market intelligence Wise Agent can't provide
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6">
              <Shield className="w-12 h-12 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-2">Risk-Free Trial</h3>
              <p className="text-sm text-muted-foreground">
                30-day money-back guarantee. If you miss Wise Agent, full refund.
              </p>
            </Card>

            <Card className="p-6">
              <Globe className="w-12 h-12 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-2">Free Migration</h3>
              <p className="text-sm text-muted-foreground">
                We move all your Wise Agent data. You're live in 48 hours.
              </p>
            </Card>

            <Card className="p-6">
              <TrendingUp className="w-12 h-12 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-2">Canadian Success</h3>
              <p className="text-sm text-muted-foreground">
                Built by Canadian agents who understand Toronto, Vancouver, Calgary markets.
              </p>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button size="lg" className="btn-gradient">
                Get Bilingual Support & Market Intelligence
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline">
                View Pricing in CAD
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            "Wise Agent didn't understand Canadian market. Realtor Desk gets it."<br/>
            <span className="font-semibold">- Philippe D., Montreal</span>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VsWiseAgent;