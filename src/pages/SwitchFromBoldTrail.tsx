import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Phone, Upload, Download, GraduationCap, CheckCircle, DollarSign, TrendingDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";

const SwitchFromBoldTrail = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <SEO
        title="Switch from BoldTrail | Free Migration to RealtorDesk AI"
        description="Free migration and CSV import if you're moving from BoldTrail to RealtorDesk AI — CASL-compliant emails, EN/FR, $999/yr Founding Member tier."
        keywords="switch from BoldTrail, BoldTrail migration, BoldTrail alternative Canada, RealtorDesk AI"
        canonicalUrl="https://www.realtordesk.ai/switch-from-boldtrail"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Switch from BoldTrail",
            "description": "Free migration from BoldTrail to RealtorDesk AI with Canadian support and AI automation."
          }
        ]}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <Badge variant="secondary" className="mb-4">
            Switch & Save
          </Badge>
          <h1 className="mb-6">
            Frustrated with <span className="gradient-text">BoldTrail?</span> You're Not Alone.
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Canadian agents are choosing RealtorDesk AI over BoldTrail — $999/yr on the Founding Member tier vs BoldTrail's $6,987 first-year cost 
            while getting better AI, faster support, and Canadian features BoldTrail lacks.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <Card className="p-4 border-destructive/20">
              <div className="text-sm text-muted-foreground mb-1">You're Paying</div>
              <div className="text-2xl font-bold text-destructive">$6,987/year</div>
              <div className="text-xs text-muted-foreground">BoldTrail first year cost</div>
            </Card>
            
            <TrendingDown className="w-8 h-8 text-accent" />
            
            <Card className="p-4 border-accent">
              <div className="text-sm text-muted-foreground mb-1">Switch to</div>
              <div className="text-2xl font-bold gradient-text">$999/year</div>
              <div className="text-xs text-accent font-semibold">{t('comparison.savings')} $5,988!</div>
            </Card>
          </div>

          <Link to="/demo">
            <Button size="lg" className="btn-gradient">
              {t('comparison.schedule')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Common Complaints */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">{t('comparison.complaints')}</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Support Takes Days to Respond",
                quote: "I submit tickets and wait 3-5 days for basic answers. Meanwhile, I'm losing leads."
              },
              {
                title: "Constant Bugs and Crashes",
                quote: "The platform crashes during demos with clients. Super embarrassing and unprofessional."
              },
              {
                title: "Paying $6,987 First Year",
                quote: "$999 setup fee is ridiculous. Then $5,988/year on top. Way overpriced for what you get."
              },
              {
                title: "Too Complicated to Use",
                quote: "Takes months to learn. My team is frustrated and not using half the features."
              },
              {
                title: "No Canadian-Specific Features",
                quote: "Built for US market. No Toronto or Vancouver market insights. No French support."
              },
              {
                title: "Hidden Costs Add Up Fast",
                quote: "Extra fees for everything: more users, premium features, integrations. Budget explodes."
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

      {/* Migration Process */}
      <section className="section-padding bg-muted">
        <div className="container-custom max-w-5xl">
          <h2 className="text-center mb-12">We Make Switching Easy (And Free)</h2>
          
          <div className="grid md:grid-cols-5 gap-6">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-accent" />
              </div>
              <div className="text-lg font-bold mb-2">Step 1</div>
              <h3 className="font-semibold mb-2">15-Min Call</h3>
              <p className="text-sm text-muted-foreground">
                Schedule migration call to review your BoldTrail setup
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-accent" />
              </div>
              <div className="text-lg font-bold mb-2">Step 2</div>
              <h3 className="font-semibold mb-2">We Export</h3>
              <p className="text-sm text-muted-foreground">
                Our team exports your contacts, deals, and data from BoldTrail
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-accent" />
              </div>
              <div className="text-lg font-bold mb-2">Step 3</div>
              <h3 className="font-semibold mb-2">We Import</h3>
              <p className="text-sm text-muted-foreground">
                Everything moved to your new Realtor Desk account
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-6 h-6 text-accent" />
              </div>
              <div className="text-lg font-bold mb-2">Step 4</div>
              <h3 className="font-semibold mb-2">30-Min Training</h3>
              <p className="text-sm text-muted-foreground">
                Personalized onboarding session with your success manager
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-accent" />
              </div>
              <div className="text-lg font-bold mb-2">Step 5</div>
              <h3 className="font-semibold mb-2">You're Live!</h3>
              <p className="text-sm text-muted-foreground">
                Up and running in 48 hours, saving $5,988/year
              </p>
            </Card>
          </div>

          <Card className="mt-12 p-8 bg-accent/10 border-accent text-center">
            <DollarSign className="w-16 h-16 text-accent mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">100% Free Migration</h3>
            <p className="text-lg text-muted-foreground mb-4">
              $499 value included at no cost. We handle everything.
            </p>
            <Badge className="bg-accent">
              Zero downtime • Zero effort on your part
            </Badge>
          </Card>
        </div>
      </section>

      {/* Success Stories */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">Agents Who Made the Switch</h2>
          
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                  J
                </div>
                <div className="flex-1">
                  <p className="italic mb-3">
                    "I switched from BoldTrail and wish I'd done it sooner. Support actually responds 
                    now—within 30 minutes! And I'm saving over $5,000/year. No-brainer decision."
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Jennifer T.</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">Toronto</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                  M
                </div>
                <div className="flex-1">
                  <p className="italic mb-3">
                    "BoldTrail kept crashing. Realtor Desk is rock solid. Plus the AI actually works—
                    it closed a lead at 2am while I slept. BoldTrail could never do that."
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
                  S
                </div>
                <div className="flex-1">
                  <p className="italic mb-3">
                    "Migration took 2 days. ALL my data came over perfectly. Team was productive 
                    immediately. And we're saving $500/month. Why didn't I switch sooner?"
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Sarah K.</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">Calgary</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Risk-Free Guarantee */}
      <section className="section-padding bg-gradient-to-br from-accent/10 to-accent/5">
        <div className="container-custom max-w-4xl text-center">
          <h2 className="mb-6">Risk-Free 30-Day Guarantee</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Try Realtor Desk for 30 days. If it's not better than BoldTrail in every way, 
            we'll refund 100% and help you migrate back. No questions asked.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/demo">
              <Button size="lg" className="btn-gradient">
                Schedule Free Migration Call
              </Button>
            </Link>
            <Link to="/vs/boldtrail">
              <Button size="lg" variant="outline">
                See Full Comparison
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            Switch from BoldTrail today. Save $5,988 in year one versus their $6,987 first-year total.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SwitchFromBoldTrail;