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
        description="IXACT Contact lists $46.75/mo USD; Realtor Desk is $149/mo CAD. A side-by-side on price, bilingual EN/FR, CASL-aware email and lead ranking, so you can judge the difference."
        keywords="IXACT Contact vs RealtorDesk AI, IXACT alternative, Canadian real estate CRM comparison, AI CRM for realtors"
        canonicalUrl="https://www.realtordesk.ai/vs/ixact"
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
            More than IXACT. <span className="gradient-text">Here is what the difference buys.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            IXACT is the cheaper contact manager. We cost about three times as much — so this page is the honest case for paying it.
          </p>
          
          {/* Price Comparison */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-2xl mx-auto">
            <Card className="p-6 flex-1">
              <div className="text-sm text-muted-foreground mb-2">IXACT Contact</div>
              <div className="text-3xl font-bold mb-1">$46.75/mo</div>
              <div className="text-xs text-muted-foreground">Billed annually · currency not stated · ixactcontact.com, 9 Sep 2026</div>
            </Card>
            
            <div className="text-2xl font-bold">→</div>
            
            <Card className="p-6 flex-1 border-accent">
              <div className="text-sm text-muted-foreground mb-2">Realtor Desk</div>
              <div className="text-3xl font-bold gradient-text mb-1">$149/mo CAD</div>
              <div className="text-xs text-muted-foreground">Solo plan · billed monthly · 14-day free trial</div>
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
              <Brain className="w-12 h-12 text-rd-terra-800 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Get AI Capabilities</h3>
              <p className="text-sm text-muted-foreground">
                Predictive lead scoring, intelligent chatbot, automated nurturing IXACT doesn't have
              </p>
            </Card>

            <Card className="p-6 text-center">
              <TrendingUp className="w-12 h-12 text-rd-terra-800 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Know who to call first</h3>
              <p className="text-sm text-muted-foreground">
                Every lead carries a 0-100 score with the factors behind it, so your list is ranked before you open it
              </p>
            </Card>

            <Card className="p-6 text-center">
              <Zap className="w-12 h-12 text-rd-terra-800 mx-auto mb-4" />
              <h3 className="font-bold mb-2">One thread per client</h3>
              <p className="text-sm text-muted-foreground">
                Messages, notes and tasks sit on a single timeline beside the contact, in English or French
              </p>
            </Card>
          </div>

          <Card className="p-8 bg-accent/10 border-accent/20 text-center">
            <p className="text-lg mb-4">
              Realtor Desk costs more than IXACT. What you get for the difference is
              <span className="gradient-text font-bold"> bilingual EN/FR replies, CASL-aware email and engagement-based lead ranking</span>.
            </p>
            <p className="text-sm text-muted-foreground">
              Compare both on your own numbers — seats, billing term and taxes differ by vendor.
            </p>
          </Card>
        </div>
      </section>

      {/* Where we differ.
          This was "What IXACT Doesn't Have", six cards of which three rested on
          capabilities we do not have either -- a 24/7 lead-facing chatbot,
          market prediction, and engagement-timed nurturing. A gap only counts
          as a reason to switch if the thing is on our side of the line. The
          "Dated Interface / looks like it's from 2010" card went with them:
          that is an aesthetic opinion about a named competitor, not a fact we
          can stand behind. */}
      <section className="section-padding bg-muted">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-4">Where the two differ</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            IXACT is a well-established contact manager and costs a third of what we do.
            These are the specific things you get here that you do not get there.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <Check className="w-8 h-8 text-rd-terra-800 mb-3" />
              <h3 className="font-bold mb-2">Leads arrive ranked</h3>
              <p className="text-sm text-muted-foreground">
                Intent, urgency, budget and timeline roll up to a 0-100 score, with the
                factors behind it and a suggested next action on the lead.
              </p>
            </Card>

            <Card className="p-6">
              <Check className="w-8 h-8 text-rd-terra-800 mb-3" />
              <h3 className="font-bold mb-2">Bilingual end to end</h3>
              <p className="text-sm text-muted-foreground">
                The app, your emails and every lead record run in English or French.
                Set the language per contact and it stays there.
              </p>
            </Card>

            <Card className="p-6">
              <Check className="w-8 h-8 text-rd-terra-800 mb-3" />
              <h3 className="font-bold mb-2">Canadian by default</h3>
              <p className="text-sm text-muted-foreground">
                Data hosted in a Canadian region, CAD pricing and reporting, consent date
                and source on every contact, and an unsubscribe honoured permanently.
              </p>
            </Card>

            <Card className="p-6">
              <Check className="w-8 h-8 text-rd-terra-800 mb-3" />
              <h3 className="font-bold mb-2">A pipeline, not just a list</h3>
              <p className="text-sm text-muted-foreground">
                Drag a lead between stages and it sticks. Every column carries its own
                count and CAD value, so you can see where the money sits.
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
                  { feature: "List price", rdai: "$149/mo CAD", ixact: "$46.75/mo, billed annually" },
                  { feature: "Lead scoring (0-100, with factors)", rdai: true, ixact: false },
                  { feature: "Drag-and-drop pipeline with CAD value", rdai: true, ixact: false },
                  { feature: "Email sequence builder", rdai: "Sending on the roadmap", ixact: "Manual" },
                  { feature: "Bilingual Support (EN/FR)", rdai: true, ixact: false },
                  { feature: "Data hosted in Canada", rdai: true, ixact: "Not stated" },
                  { feature: "Mobile", rdai: "Responsive web", ixact: "Native app" },
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
                        row.rdai ? <Check className="w-5 h-5 text-rd-terra-800 mx-auto" /> : <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      ) : (
                        <span className="text-rd-terra-800 font-semibold">{row.rdai}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.ixact === 'boolean' ? (
                        row.ixact ? <Check className="w-5 h-5 text-rd-terra-800 mx-auto" /> : <X className="w-5 h-5 text-destructive mx-auto" />
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
          <h2 className="mb-6">What the extra costs, and what it buys</h2>
          <p className="text-lg text-muted-foreground mb-8">
            The three-times price gap is real. These are the things it pays for.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6">
              <DollarSign className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" />
              <h3 className="font-bold mb-2">A premium price</h3>
              <p className="text-sm text-muted-foreground">
                $149/mo CAD versus IXACT's $46.75/mo USD billed annually. You pay more, for bilingual
                EN/FR replies, CASL-aware email and engagement-based lead ranking.
              </p>
            </Card>

            <Card className="p-6">
              <Brain className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Free Migration</h3>
              <p className="text-sm text-muted-foreground">
                We move all your IXACT contacts and data for free. Zero effort on your part.
              </p>
            </Card>

            <Card className="p-6">
              <TrendingUp className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Free migration</h3>
              <p className="text-sm text-muted-foreground">
                We move your IXACT contacts, notes and tags across, and a 30-day money-back
                guarantee applies if it isn't right for you.
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

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VsIxact;