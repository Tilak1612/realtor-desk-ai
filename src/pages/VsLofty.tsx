import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check, X, Brain, Shield, Clock, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";

const VsLofty = () => {
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
            True AI vs. Basic Chatbots: <span className="gradient-text">Realtor Desk AI</span> vs Lofty
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Get predictive intelligence that actually closes deals, not just automated responses
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
                <Badge className="mb-2 bg-accent">Realtor Desk AI</Badge>
                <h3 className="text-xl font-bold">Predictive Intelligence</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Intelligent conversation, understands context</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Predicts which leads will convert (72% accuracy)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Learns and improves from every interaction</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Canadian market predictions (Toronto, Vancouver, Calgary)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Personalized content based on buyer behavior</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Common Complaints */}
      <section className="section-padding bg-muted">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">Why Agents Are Leaving Lofty</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-destructive/20">
              <X className="w-8 h-8 text-destructive mb-3" />
              <h3 className="font-bold mb-2">Unpredictable Costs</h3>
              <p className="text-sm text-muted-foreground">
                "$99/month turns into $300+ with call/text charges. Budget impossible to plan."
              </p>
            </Card>

            <Card className="p-6 border-destructive/20">
              <X className="w-8 h-8 text-destructive mb-3" />
              <h3 className="font-bold mb-2">Support Goes Dark</h3>
              <p className="text-sm text-muted-foreground">
                "Chat support is useless. Takes weeks to hear back on actual issues."
              </p>
            </Card>

            <Card className="p-6 border-destructive/20">
              <X className="w-8 h-8 text-destructive mb-3" />
              <h3 className="font-bold mb-2">Not Real AI</h3>
              <p className="text-sm text-muted-foreground">
                "The 'AI' is just canned responses. Doesn't understand context or learn."
              </p>
            </Card>

            <Card className="p-6 border-destructive/20">
              <X className="w-8 h-8 text-destructive mb-3" />
              <h3 className="font-bold mb-2">No Canadian Features</h3>
              <p className="text-sm text-muted-foreground">
                "US-focused. No Toronto market data, no French support, pricing in USD."
              </p>
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
                  <th className="text-center p-4 font-bold">Realtor Desk AI</th>
                  <th className="text-center p-4 font-bold">Lofty</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Starting Price", rdai: "$699/year", lofty: "$1,188+/year" },
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
                        row.rdai ? <Check className="w-5 h-5 text-accent mx-auto" /> : <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      ) : (
                        <span className="text-accent font-semibold">{row.rdai}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.lofty === 'boolean' ? (
                        row.lofty ? <Check className="w-5 h-5 text-accent mx-auto" /> : <X className="w-5 h-5 text-destructive mx-auto" />
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
          <Brain className="w-16 h-16 text-accent mx-auto mb-6" />
          <h2 className="mb-6">Upgrade to True AI-Powered Intelligence</h2>
          <p className="text-lg text-muted-foreground mb-8">
            See why 200+ agents left Lofty for Realtor Desk AI in 2024
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6">
              <Shield className="w-12 h-12 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-2">Risk-Free Switch</h3>
              <p className="text-sm text-muted-foreground">
                60-day money-back guarantee. If it's not better than Lofty, full refund.
              </p>
            </Card>

            <Card className="p-6">
              <Clock className="w-12 h-12 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-2">Quick Migration</h3>
              <p className="text-sm text-muted-foreground">
                We handle everything. You're live and productive in 48 hours.
              </p>
            </Card>

            <Card className="p-6">
              <DollarSign className="w-12 h-12 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-2">Transparent Pricing</h3>
              <p className="text-sm text-muted-foreground">
                $699/year, all-inclusive. No surprise charges. Ever.
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

          <p className="text-sm text-muted-foreground mt-8">
            "The AI actually understands my clients. Lofty was just automated spam."<br/>
            <span className="font-semibold">- Marcus R., Vancouver</span>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VsLofty;