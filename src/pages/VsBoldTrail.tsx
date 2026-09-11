import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check, X, TrendingDown, Shield, Clock, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";
import BoldTrailComparisonTable from "@/components/BoldTrailComparisonTable";

const VsBoldTrail = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <SEO
        title="BoldTrail Alternative | RealtorDesk AI vs BoldTrail"
        description="Looking for a BoldTrail alternative? RealtorDesk AI helps Canadian agents save $5,988 in year one with AI lead generation and faster support."
        keywords="BoldTrail alternative, RealtorDesk AI vs BoldTrail, Canadian real estate CRM, AI CRM for realtors"
        canonicalUrl="https://www.realtordesk.ai/vs/boldtrail"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "BoldTrail vs Realtor Desk Comparison",
            "description": "Compare BoldTrail with Realtor Desk to see pricing, features, and why Canadian agents are switching.",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "BoldTrail", "description": "$6,987 first year with $999 setup fee" },
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
            Best CRM for Real Estate Agents Comparison
          </Badge>
          <h1 className="mb-6">
            Best BoldTrail Alternative: <span className="gradient-text">Realtor Desk</span> - Save $5,988 first year
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            The best CRM for real estate agents with AI lead generation software. Save $5,988 first year vs BoldTrail while getting faster support and Canadian-focused features.
          </p>
          
          {/* Cost Comparison */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <Card className="p-6 flex-1 border-destructive/20">
              <div className="text-sm text-muted-foreground mb-2">BoldTrail First Year</div>
              <div className="text-3xl font-bold text-destructive mb-1">$6,987</div>
              <div className="text-xs text-muted-foreground">$5,988/year + $999 setup · vendor figures unverified</div>
            </Card>
            
            <TrendingDown className="w-8 h-8 text-rd-terra-800 rotate-90 sm:rotate-0" />
            
            <Card className="p-6 flex-1 border-accent">
              <div className="text-sm text-muted-foreground mb-2">Realtor Desk</div>
              <div className="text-3xl font-bold gradient-text mb-1">$149/mo</div>
              <div className="text-xs text-rd-terra-800 font-semibold">{t('comparison.savings')} $5,988 {t('comparison.firstYear')}</div>
            </Card>
          </div>
        </div>
      </section>

      <BoldTrailComparisonTable />

      {/* How We're Different */}
      <section className="section-padding bg-muted">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">How Realtor Desk Is Different</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-accent/20">
              <Check className="w-8 h-8 text-rd-terra-800 mb-3" />
              <h3 className="font-bold mb-2">30-Minute Support Response</h3>
              <p className="text-sm text-muted-foreground">
                Canadian support team responds within 30 minutes during business hours. Live chat available 24/7.
              </p>
            </Card>

            <Card className="p-6 border-accent/20">
              <Check className="w-8 h-8 text-rd-terra-800 mb-3" />
              <h3 className="font-bold mb-2">Enterprise-Grade Reliability</h3>
              <p className="text-sm text-muted-foreground">
                Built on enterprise infrastructure. Your CRM works when you need it. No embarrassing crashes.
              </p>
            </Card>

            <Card className="p-6 border-accent/20">
              <Check className="w-8 h-8 text-rd-terra-800 mb-3" />
              <h3 className="font-bold mb-2">$149/mo CAD, zero setup fee</h3>
              <p className="text-sm text-muted-foreground">
                All-inclusive pricing. No hidden costs, no surprise charges. Save $5,988 first year vs BoldTrail.
              </p>
            </Card>

            <Card className="p-6 border-accent/20">
              <Check className="w-8 h-8 text-rd-terra-800 mb-3" />
              <h3 className="font-bold mb-2">Easy to Learn and Use</h3>
              <p className="text-sm text-muted-foreground">
                Intuitive interface. Most agents are productive within 24 hours. Free training included.
              </p>
            </Card>

            <Card className="p-6 border-accent/20">
              <Check className="w-8 h-8 text-rd-terra-800 mb-3" />
              <h3 className="font-bold mb-2">Built for Canadian Market</h3>
              <p className="text-sm text-muted-foreground">
                Toronto, Vancouver, Calgary market intelligence. Bilingual EN/FR. PIPEDA compliant. CREA DDF® integration coming Q3 2026.
              </p>
            </Card>

            <Card className="p-6 border-accent/20">
              <Check className="w-8 h-8 text-rd-terra-800 mb-3" />
              <h3 className="font-bold mb-2">True Predictive AI</h3>
              <p className="text-sm text-muted-foreground">
                Not just automation - real AI that predicts which leads will convert. 6x better than basic CRMs.
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
                  { feature: "List price", rdai: "$149/mo CAD", boldtrail: "$5,988/yr (unverified)" },
                  { feature: "Setup fee", rdai: "$0", boldtrail: "$999 (unverified)" },
                  { feature: "Predictive Lead Scoring", rdai: true, boldtrail: false },
                  { feature: "24/7 AI Chatbot", rdai: true, boldtrail: false },
                  { feature: "Canadian Market Intelligence", rdai: true, boldtrail: false },
                  { feature: "Bilingual Support (EN/FR)", rdai: true, boldtrail: false },
                  { feature: "Support Response Time", rdai: "30 min", boldtrail: "3-5 days" },
                  { feature: "Reliability", rdai: "Enterprise-grade", boldtrail: "No published SLA" },
                  { feature: "CREA DDF® Integration", rdai: "Q3 2026", boldtrail: true },
                  { feature: "Email Automation", rdai: true, boldtrail: true },
                  { feature: "Mobile App", rdai: true, boldtrail: true },
                  { feature: "Transaction Management", rdai: true, boldtrail: true },
                  { feature: "Free Migration", rdai: true, boldtrail: false },
                  { feature: "Free Training", rdai: true, boldtrail: false },
                  { feature: "Contract Required", rdai: "No", boldtrail: "Yes" },
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
            Join early-access Canadian agents who chose RealtorDesk AI over BoldTrail
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6">
              <Shield className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" />
              <h3 className="font-bold mb-2">100% Free Migration</h3>
              <p className="text-sm text-muted-foreground">
                We export your BoldTrail data and import it to your new account. $499 value, free.
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