import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check, X, Brain, Zap, TrendingUp, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";

const VsIxact = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <SEO
        title="IXACT Contact vs RealtorDesk AI | Upgrade to AI"
        description="Upgrade from IXACT to AI-powered intelligence without breaking your budget. See pricing, features, and why Canadian agents switch."
        keywords="IXACT Contact vs RealtorDesk AI, IXACT alternative, Canadian real estate CRM comparison, AI CRM for realtors"
        canonicalUrl="https://realtordesk.ai/vs/ixact"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "IXACT Contact vs Realtor Desk",
            "description": "Compare IXACT Contact with Realtor Desk AI for pricing, AI features, and Canadian market support."
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
            Advanced AI for the <span className="gradient-text">Price of Basic CRM</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Upgrade from IXACT to AI-powered intelligence without breaking your budget
          </p>
          
          {/* Price Comparison */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-2xl mx-auto">
            <Card className="p-6 flex-1">
              <div className="text-sm text-muted-foreground mb-2">IXACT Contact</div>
              <div className="text-3xl font-bold mb-1">$456/year</div>
              <div className="text-xs text-muted-foreground">Basic CRM, no AI</div>
            </Card>
            
            <div className="text-2xl font-bold">→</div>
            
            <Card className="p-6 flex-1 border-accent">
              <div className="text-sm text-muted-foreground mb-2">Realtor Desk</div>
              <div className="text-3xl font-bold gradient-text mb-1">$699/year</div>
              <div className="text-xs text-accent font-semibold">+$243 for AI superpowers</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">Why Upgrade from IXACT?</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 text-center">
              <Brain className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="font-bold mb-2">Get AI Capabilities</h3>
              <p className="text-sm text-muted-foreground">
                Predictive lead scoring, intelligent chatbot, automated nurturing IXACT doesn't have
              </p>
            </Card>

            <Card className="p-6 text-center">
              <TrendingUp className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="font-bold mb-2">Close 3X More Deals</h3>
              <p className="text-sm text-muted-foreground">
                AI identifies your hottest leads. Focus on sellers ready to list, not cold contacts
              </p>
            </Card>

            <Card className="p-6 text-center">
              <Zap className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="font-bold mb-2">Save 15+ Hours/Week</h3>
              <p className="text-sm text-muted-foreground">
                AI handles lead qualification, follow-up, appointment booking automatically
              </p>
            </Card>
          </div>

          <Card className="p-8 bg-accent/10 border-accent/20 text-center">
            <p className="text-lg mb-4">
              <strong>For just $20/month more,</strong> get AI features that help you close 
              <span className="gradient-text font-bold"> 6-8 additional deals per year</span>
            </p>
            <p className="text-sm text-muted-foreground">
              At $10,000 average commission, that's $60,000-80,000 more revenue for a $243 investment
            </p>
          </Card>
        </div>
      </section>

      {/* What IXACT Is Missing */}
      <section className="section-padding bg-muted">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">What IXACT Doesn't Have</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-destructive/20">
              <X className="w-8 h-8 text-destructive mb-3" />
              <h3 className="font-bold mb-2">No Predictive AI</h3>
              <p className="text-sm text-muted-foreground">
                IXACT can't predict which leads will convert. You're guessing who to call first.
              </p>
            </Card>

            <Card className="p-6 border-destructive/20">
              <X className="w-8 h-8 text-destructive mb-3" />
              <h3 className="font-bold mb-2">No 24/7 Chatbot</h3>
              <p className="text-sm text-muted-foreground">
                Leads come in at 10pm, they wait until morning. Many go to your competitor.
              </p>
            </Card>

            <Card className="p-6 border-destructive/20">
              <X className="w-8 h-8 text-destructive mb-3" />
              <h3 className="font-bold mb-2">No Market Intelligence</h3>
              <p className="text-sm text-muted-foreground">
                Can't predict Toronto or Vancouver market trends. No neighborhood insights.
              </p>
            </Card>

            <Card className="p-6 border-destructive/20">
              <X className="w-8 h-8 text-destructive mb-3" />
              <h3 className="font-bold mb-2">Manual Lead Nurturing</h3>
              <p className="text-sm text-muted-foreground">
                You decide when to follow up. AI knows the optimal time based on engagement.
              </p>
            </Card>

            <Card className="p-6 border-destructive/20">
              <X className="w-8 h-8 text-destructive mb-3" />
              <h3 className="font-bold mb-2">Dated Interface</h3>
              <p className="text-sm text-muted-foreground">
                IXACT looks like it's from 2010. Clients notice. Realtor Desk is modern.
              </p>
            </Card>

            <Card className="p-6 border-destructive/20">
              <X className="w-8 h-8 text-destructive mb-3" />
              <h3 className="font-bold mb-2">Limited Canadian Features</h3>
              <p className="text-sm text-muted-foreground">
                No French support, limited CREA integration, no provincial market data.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          <h2 className="text-center mb-12">See What You're Missing</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left p-4 font-bold">Feature</th>
                  <th className="text-center p-4 font-bold">Realtor Desk</th>
                  <th className="text-center p-4 font-bold">IXACT Contact</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Annual Cost", rdai: "$699", ixact: "$456" },
                  { feature: "Predictive Lead Scoring", rdai: true, ixact: false },
                  { feature: "24/7 AI Chatbot", rdai: true, ixact: false },
                  { feature: "Market Intelligence", rdai: true, ixact: false },
                  { feature: "Automated Nurturing", rdai: "AI-optimized", ixact: "Manual" },
                  { feature: "Bilingual Support (EN/FR)", rdai: true, ixact: false },
                  { feature: "Canadian Market Data", rdai: true, ixact: "Limited" },
                  { feature: "Modern Interface", rdai: true, ixact: false },
                  { feature: "Mobile App", rdai: true, ixact: true },
                  { feature: "Email Marketing", rdai: true, ixact: true },
                  { feature: "Transaction Management", rdai: true, ixact: true },
                  { feature: "Contact Management", rdai: true, ixact: true },
                  { feature: "Free Migration", rdai: true, ixact: "N/A" },
                  { feature: "ROI Tracking", rdai: true, ixact: "Basic" },
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
                      {typeof row.ixact === 'boolean' ? (
                        row.ixact ? <Check className="w-5 h-5 text-accent mx-auto" /> : <X className="w-5 h-5 text-destructive mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">{row.ixact}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Upgrade CTA */}
      <section className="section-padding bg-gradient-to-br from-accent/10 to-accent/5">
        <div className="container-custom max-w-4xl text-center">
          <h2 className="mb-6">Upgrade to AI Without Breaking Your Budget</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Keep your budget-friendly pricing, add AI superpowers
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6">
              <DollarSign className="w-12 h-12 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-2">Only $20 More/Month</h3>
              <p className="text-sm text-muted-foreground">
                $699/year vs IXACT's $456. Coffee money for AI that closes deals.
              </p>
            </Card>

            <Card className="p-6">
              <Brain className="w-12 h-12 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-2">Free Migration</h3>
              <p className="text-sm text-muted-foreground">
                We move all your IXACT contacts and data for free. Zero effort on your part.
              </p>
            </Card>

            <Card className="p-6">
              <TrendingUp className="w-12 h-12 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-2">Proven ROI</h3>
              <p className="text-sm text-muted-foreground">
                Agents average 41% GCI increase first year. $243 investment, $75K+ return.
              </p>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button size="lg" className="btn-gradient">
                Upgrade to AI-Powered CRM
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline">
                See Pricing Details
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            "Best $20/month I ever spent. Closed 5 extra deals because AI told me who to call."<br/>
            <span className="font-semibold">- Laura K., Calgary</span>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VsIxact;