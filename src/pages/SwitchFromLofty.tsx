import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Phone, Upload, Download, GraduationCap, CheckCircle, Brain, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";

const SwitchFromLofty = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <SEO
        title="Switch from Lofty | Upgrade to Real AI"
        description="Move from Lofty to RealtorDesk AI for true predictive intelligence, transparent pricing, and Canadian support."
        keywords="switch from Lofty, Lofty CRM migration, Lofty alternative Canada, RealtorDesk AI"
        canonicalUrl="https://realtordesk.ai/switch-from-lofty"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Switch from Lofty",
            "description": "Upgrade from Lofty to RealtorDesk AI with real AI features and Canadian market support."
          }
        ]}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <Badge variant="secondary" className="mb-4">
            Upgrade to Real AI
          </Badge>
          <h1 className="mb-6">
            Tired of Lofty's <span className="gradient-text">"AI" That Doesn't Actually Work?</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Get true predictive intelligence, transparent pricing, and responsive Canadian support. 
            Join the agents who upgraded from basic automation to AI that actually closes deals.
          </p>
          
          <Link to="/demo">
            <Button size="lg" className="btn-gradient">
              Schedule Free Migration Call
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Agents Leave Lofty */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">Why Agents Are Leaving Lofty</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Unpredictable Costs",
                quote: "$99/month turns into $300+ with call/text charges. Budget impossible to plan. Hidden fees everywhere."
              },
              {
                title: "Support Goes Dark",
                quote: "Chat support is useless. Takes weeks to hear back on actual issues. Phone support is a joke."
              },
              {
                title: "Not Real AI",
                quote: "The 'AI' is just canned responses. Doesn't understand context, doesn't learn. It's automation, not intelligence."
              },
              {
                title: "No Canadian Features",
                quote: "US-focused. No Toronto market data, no French support, pricing in USD. They don't get Canada."
              },
              {
                title: "Can't Cancel Easily",
                quote: "Locked into contracts. When I tried to cancel, they made it impossible. Felt trapped."
              },
              {
                title: "Buggy Platform",
                quote: "Constant glitches. Emails don't send. Leads get lost. Tech support says 'we're working on it' for months."
              }
            ].map((item, idx) => (
              <Card key={idx} className="p-6">
                <h3 className="font-bold mb-3 text-destructive">❌ {item.title}</h3>
                <p className="text-sm text-muted-foreground italic">"{item.quote}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Real AI vs Fake AI */}
      <section className="section-padding bg-muted">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">Real AI vs. Lofty's "AI"</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-destructive/20">
              <Badge variant="outline" className="mb-4">Lofty's "AI"</Badge>
              <h3 className="text-xl font-bold mb-4">Basic Automation</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-destructive">❌</span>
                  <span>Pre-programmed chatbot with canned responses</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-destructive">❌</span>
                  <span>Can't predict which leads will convert</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-destructive">❌</span>
                  <span>Doesn't learn from your interactions</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-destructive">❌</span>
                  <span>Generic email templates for everyone</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-destructive">❌</span>
                  <span>No market intelligence or predictions</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-accent">
              <Badge className="mb-4 bg-accent">Realtor Desk</Badge>
              <h3 className="text-xl font-bold mb-4">True Intelligence</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-accent">✓</span>
                  <span>Understands context, has real conversations</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-accent">✓</span>
                  <span>Predicts conversions with 72% accuracy</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-accent">✓</span>
                  <span>Learns and improves from every interaction</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-accent">✓</span>
                  <span>Personalized content based on behavior</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-accent">✓</span>
                  <span>Canadian market predictions (TO, VAN, CAL)</span>
                </li>
              </ul>
            </Card>
          </div>

          <Card className="mt-8 p-6 bg-accent/10 border-accent/20">
            <p className="text-center italic mb-2">
              "Lofty's 'AI' sent the same generic email to everyone. Realtor Desk actually 
              personalizes based on what each lead clicks. Night and day difference."
            </p>
            <p className="text-center font-semibold">- Marcus R., Vancouver</p>
          </Card>
        </div>
      </section>

      {/* Migration Process */}
      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          <h2 className="text-center mb-12">Simple, Fast Migration Process</h2>
          
          <div className="grid md:grid-cols-5 gap-6">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-accent" />
              </div>
              <div className="text-lg font-bold mb-2">Step 1</div>
              <h3 className="font-semibold mb-2">15-Min Call</h3>
              <p className="text-sm text-muted-foreground">
                Quick call to understand your Lofty setup
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-accent" />
              </div>
              <div className="text-lg font-bold mb-2">Step 2</div>
              <h3 className="font-semibold mb-2">Data Export</h3>
              <p className="text-sm text-muted-foreground">
                We export all your Lofty contacts and deals
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-accent" />
              </div>
              <div className="text-lg font-bold mb-2">Step 3</div>
              <h3 className="font-semibold mb-2">Import</h3>
              <p className="text-sm text-muted-foreground">
                Everything moved to Realtor Desk
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-6 h-6 text-accent" />
              </div>
              <div className="text-lg font-bold mb-2">Step 4</div>
              <h3 className="font-semibold mb-2">Training</h3>
              <p className="text-sm text-muted-foreground">
                30-minute personalized onboarding
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-accent" />
              </div>
              <div className="text-lg font-bold mb-2">Step 5</div>
              <h3 className="font-semibold mb-2">Go Live</h3>
              <p className="text-sm text-muted-foreground">
                Productive in 48 hours
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Transparent Pricing */}
      <section className="section-padding bg-muted">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">Transparent Pricing (Unlike Lofty)</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-destructive/20">
              <Badge variant="outline" className="mb-4">Lofty</Badge>
              <div className="text-3xl font-bold text-destructive mb-4">$99-300+/mo</div>
              <ul className="space-y-2 mb-6">
                <li className="text-sm text-muted-foreground">• Base: $99-199/month</li>
                <li className="text-sm text-muted-foreground">• + Call/text charges</li>
                <li className="text-sm text-muted-foreground">• + Premium features</li>
                <li className="text-sm text-muted-foreground">• + Overages</li>
                <li className="text-sm text-destructive font-semibold">= Unpredictable budget</li>
              </ul>
            </Card>

            <Card className="p-8 border-accent">
              <Badge className="mb-4 bg-accent">Realtor Desk</Badge>
              <div className="text-3xl font-bold gradient-text mb-4">$699/year</div>
              <ul className="space-y-2 mb-6">
                <li className="text-sm">✓ All features included</li>
                <li className="text-sm">✓ No call/text charges</li>
                <li className="text-sm">✓ No surprise fees</li>
                <li className="text-sm">✓ No overage charges</li>
                <li className="text-sm text-accent font-semibold">✓ Budget you can plan</li>
              </ul>
            </Card>
          </div>

          <Card className="mt-8 p-6 bg-accent/10 border-accent/20 text-center">
            <DollarSign className="w-12 h-12 text-accent mx-auto mb-3" />
            <p className="font-semibold mb-2">What You Actually Pay:</p>
            <p className="text-sm text-muted-foreground">
              Lofty: $1,188-3,600/year + unpredictable charges<br/>
              Realtor Desk: <span className="text-accent font-semibold">$699/year, period.</span>
            </p>
          </Card>
        </div>
      </section>

      {/* Success Stories */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">Why 200+ Agents Left Lofty</h2>
          
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                  M
                </div>
                <div className="flex-1">
                  <p className="italic mb-3">
                    "The AI actually understands my clients. Lofty was just automated spam. 
                    Realtor Desk has real conversations and books qualified appointments."
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Marcus R.</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">Vancouver</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                  L
                </div>
                <div className="flex-1">
                  <p className="italic mb-3">
                    "My Lofty bill kept growing. $99 turned into $250+/month. Realtor Desk is 
                    $699/year with EVERYTHING included. I'm saving thousands."
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Laura K.</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">Calgary</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-accent/10 to-accent/5">
        <div className="container-custom max-w-4xl text-center">
          <Brain className="w-16 h-16 text-accent mx-auto mb-6" />
          <h2 className="mb-6">Upgrade to Real AI Today</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            30-day money-back guarantee. If it's not better than Lofty, full refund. No questions asked.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button size="lg" className="btn-gradient">
                Schedule Free Migration Call
              </Button>
            </Link>
            <Link to="/vs/lofty">
              <Button size="lg" variant="outline">
                See Full Comparison
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SwitchFromLofty;