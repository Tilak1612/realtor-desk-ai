import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";
import { SEO } from "@/components/SEO";
import { pricingPageFAQSchema, productSchema } from "@/lib/structuredData";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, Brain, Check, X, TrendingDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { trackEvent } from "@/utils/analytics";

const Pricing = () => {
  const { t } = useTranslation();
  const [isYearly, setIsYearly] = useState(false); // Default to monthly

  useEffect(() => {
    trackEvent("view_pricing", {});
  }, []);

  const pricingData = {
    agent: {
      monthly: 149,
      yearly: 1497,
      yearlyTotal: 149 * 12, // $1,788
      savings: 291, // Regular yearly saves $291 vs monthly
      foundingPrice: 999,
      foundingSavings: 789, // Founding price saves $789 vs paying monthly ($1,788 - $999)
      foundingVsYearly: 498, // Founding price saves $498 vs regular yearly ($1,497 - $999)
      discount: "$291"
    },
    team: {
      monthly: 299,
      yearly: 2997,
      yearlyTotal: 299 * 12, // $3,588
      perAgent: 600, // $2,997 / 5 agents
      savings: 591, // $3,588 - $2,997 = $591
      discount: "$591"
    }
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title="Real Estate CRM Pricing - From $149/mo | RealtorDesk AI"
        description="RealtorDesk AI pricing: $149/mo Starter, $299/mo Pro, $599/mo Teams. Save 85% vs Lofty ($700/mo). No setup fees, 14-day free trial. CREA DDF® native, PIPEDA compliant."
        keywords="real estate CRM pricing, CRM for real estate agents cost, Lofty alternative pricing, best CRM for real estate agents Canada, affordable real estate CRM"
        structuredData={[
          pricingPageFAQSchema,
          productSchema("Starter", 149, "AI-powered real estate CRM for individual agents with CREA DDF® integration"),
          productSchema("Professional", 299, "Advanced CRM with AI voice agent and SMS automation for growing agents"),
          productSchema("Teams", 599, "Enterprise CRM with unlimited users and custom AI training")
        ]}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <Badge variant="secondary" className="mb-4 animate-fade-in-up">
            {t('pricing.hero.badge')}
          </Badge>
          <Badge variant="default" className="mb-4 animate-fade-in-up bg-accent text-white">
            {t('pricing.banner.trial', '🎉 14 Days Free Trial - Start Today!')}
          </Badge>
          <Badge variant="default" className="mb-4 animate-fade-in-up bg-primary text-white">
            {t('pricing.banner.launch', '🎉 Launch Pricing — Save $498/year vs. Monthly!')}
          </Badge>
          <h1 className="mb-6 animate-fade-in-up">
            {t('pricing.hero.title')} <span className="gradient-text">{t('pricing.hero.titleGradient')}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            {t('pricing.hero.subtitle')}
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8 animate-fade-in-up animation-delay-300">
            <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              {t('pricing.hero.monthly')}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-8 rounded-full p-0 border-2"
            >
              <div className={`absolute w-6 h-6 rounded-full bg-primary transition-transform ${isYearly ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </Button>
            <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              {t('pricing.hero.yearly')}
            </span>
            <Badge variant="secondary" className="text-accent font-semibold">
              {t('pricing.hero.saveYearly')} + Founding Member Bonus
            </Badge>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <PricingCard
              name="AGENT"
              price={isYearly ? (pricingData.agent.foundingPrice.toString()) : pricingData.agent.monthly.toString()}
              description="Perfect for individual agents ready to scale"
              billingPeriod={isYearly ? "year" : "month"}
              discount={isYearly ? `Save $789 vs monthly ($498 vs regular yearly)` : `Save $${pricingData.agent.savings}/year with annual billing`}
              yearlyPrice={isYearly ? pricingData.agent.foundingPrice : undefined}
              features={[
                "Unlimited contacts & leads",
                "AI-powered predictive CRM",
                "24/7 AI chatbot (website, SMS, email)",
                "ROI tracking & analytics",
                "Email & SMS automation",
                "Canadian market intelligence",
                "Bilingual support (EN/FR)",
                "Mobile app included",
                "Free migration assistance",
                "No setup fees",
                "Priority support"
              ]}
              ctaText="Start 14-Day Free Trial"
              ctaLink="/signup"
              trialBadge="14 Days Free Trial"
            />

            <PricingCard
              name="TEAM"
              price={isYearly ? "2,997" : "299"}
              description="For growing teams of 2-5 agents"
              billingPeriod={isYearly ? "year" : "month"}
              discount={isYearly ? `Save ${pricingData.team.discount} annually` : undefined}
              yearlyPrice={isYearly ? pricingData.team.yearly : undefined}
              features={[
                "Everything in Agent tier, plus:",
                "Team collaboration tools",
                "Lead distribution & routing",
                "Team performance dashboard",
                "Shared pipeline management",
                "Advanced reporting & analytics",
                "Priority support",
                "Dedicated account manager",
                "Custom training sessions",
                "API access available",
                "White-label options"
              ]}
              popular
              ctaText="Start 14-Day Free Trial"
              ctaLink="/signup"
              trialBadge="14 Days Free Trial"
            />

            <PricingCard
              name="BROKERAGE"
              price="Custom"
              description="For brokerages with 6+ agents"
              features={[
                "Everything in Team tier, plus:",
                "Unlimited agents",
                "Custom branding & white-label",
                "Advanced admin controls",
                "Multi-office management",
                "Brokerage compliance tools",
                "Dedicated success manager",
                "Custom AI model training",
                "Volume pricing discounts",
                "Premium 24/7 support"
              ]}
              ctaText="Start 14-Day Free Trial"
              ctaLink="/demo"
              trialBadge="14 Days Free Trial"
            />
          </div>

          {/* Competitor Comparison Box */}
          <Card className="mt-16 p-8 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Compare with Competitors</h3>
              <p className="text-muted-foreground">See how much you save with Realtor Desk AI</p>
            </div>
            
            <div className="grid gap-4">
              {/* BoldTrail */}
              <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
                <div className="flex items-center gap-4">
                  <X className="w-5 h-5 text-destructive flex-shrink-0" />
                  <div>
                    <div className="font-semibold">BoldTrail</div>
                    <div className="text-sm text-muted-foreground">$5,988/year + $999 setup fee</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-destructive">$6,987</div>
                  <div className="text-xs text-muted-foreground">First year</div>
                </div>
              </div>

              {/* Lofty */}
              <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
                <div className="flex items-center gap-4">
                  <X className="w-5 h-5 text-destructive flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Lofty</div>
                    <div className="text-sm text-muted-foreground">$1,788 - $3,588/year per user</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-destructive">$1,788+</div>
                  <div className="text-xs text-muted-foreground">Per year</div>
                </div>
              </div>

              {/* Realtor Desk AI */}
              <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg border-2 border-accent">
                <div className="flex items-center gap-4">
                  <Check className="w-5 h-5 text-accent flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-accent">Realtor Desk AI</div>
                    <div className="text-sm text-muted-foreground">$999/year (Founding Member), $0 setup</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold gradient-text">$999</div>
                  <div className="text-xs text-accent font-semibold">Save thousands!</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <TrendingDown className="w-4 h-4 text-accent" />
              <span>Save up to <span className="font-bold text-accent">85%</span> compared to BoldTrail, <span className="font-bold text-accent">45%</span> vs Lofty</span>
            </div>
          </Card>

          {/* Feature Comparison Table */}
          <Card className="mt-12 p-8 max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">Feature Comparison: Why Agents Switch to Realtor Desk AI</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2">
                    <th className="text-left py-4 px-4 font-semibold">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold text-accent">Realtor Desk AI</th>
                    <th className="text-center py-4 px-4 font-semibold text-muted-foreground">BoldTrail</th>
                    <th className="text-center py-4 px-4 font-semibold text-muted-foreground">Lofty</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">Annual Price (Agent)</td>
                    <td className="text-center py-3 px-4 font-bold text-accent">$999</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">$5,988</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">$1,788+</td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">Setup Fee</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-accent mx-auto" /></td>
                    <td className="text-center py-3 px-4 text-muted-foreground">$999</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Varies</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">AI Predictive Lead Scoring</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-accent mx-auto" /></td>
                    <td className="text-center py-3 px-4"><X className="w-5 h-5 text-destructive mx-auto" /></td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Basic</td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">24/7 Bilingual AI Chatbot</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-accent mx-auto" /></td>
                    <td className="text-center py-3 px-4"><X className="w-5 h-5 text-destructive mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">CREA DDF® Integration <span className="text-xs text-primary font-medium ml-1">(Coming Q3 2026)</span></td>
                    <td className="text-center py-3 px-4"><span className="text-xs text-primary font-medium">Coming Soon</span></td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Extra Cost</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Limited</td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">Free Migration</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-accent mx-auto" /></td>
                    <td className="text-center py-3 px-4"><X className="w-5 h-5 text-destructive mx-auto" /></td>
                    <td className="text-center py-3 px-4 text-muted-foreground">$500+</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Canadian Compliance (RECO, BCFSA)</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-accent mx-auto" /></td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Partial</td>
                    <td className="text-center py-3 px-4"><X className="w-5 h-5 text-destructive mx-auto" /></td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">Mobile App</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-accent mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-semibold">Total First Year Cost</td>
                    <td className="text-center py-3 px-4 font-bold text-xl gradient-text">$999</td>
                    <td className="text-center py-3 px-4 font-bold text-destructive">$6,987</td>
                    <td className="text-center py-3 px-4 font-bold text-destructive">$1,788+</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-accent/10 rounded-lg text-center">
              <p className="text-sm font-semibold">
                💰 Switching from BoldTrail? <span className="gradient-text">You'll save $5,988 in year one alone!</span>
              </p>
            </div>
          </Card>

          {/* Social Proof - Success Stories */}
          <div className="mt-16 max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-center">Real Results from Real Agents</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
                <div className="text-3xl font-bold gradient-text mb-2">$127K</div>
                <p className="text-sm text-muted-foreground mb-4">Additional GCI in first year</p>
                <p className="text-xs italic">"Switched from BoldTrail and never looked back. The AI lead scoring is incredible."</p>
                <p className="text-xs font-semibold mt-2">- Sarah M., Toronto</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
                <div className="text-3xl font-bold gradient-text mb-2">18 Deals</div>
                <p className="text-sm text-muted-foreground mb-4">Closed from AI chatbot leads</p>
                <p className="text-xs italic">"The 24/7 bilingual chatbot captures leads while I sleep. Game changer."</p>
                <p className="text-xs font-semibold mt-2">- Marc D., Montreal</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
                <div className="text-3xl font-bold gradient-text mb-2">15 hrs/wk</div>
                <p className="text-sm text-muted-foreground mb-4">Time saved on admin tasks</p>
                <p className="text-xs italic">"Automation handles follow-ups. I focus on closing deals, not data entry."</p>
                <p className="text-xs font-semibold mt-2">- Priya S., Vancouver</p>
              </Card>
            </div>
          </div>

          {/* Monthly vs Yearly Savings Highlight */}
          <Card className="mt-12 p-8 bg-gradient-to-r from-primary/5 to-secondary/5 max-w-4xl mx-auto border-2 border-primary/20">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Why Choose Annual Billing?</h3>
              <div className="grid md:grid-cols-2 gap-8 mt-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Monthly Plan</div>
                  <div className="text-4xl font-bold text-muted-foreground mb-2">$149<span className="text-lg">/mo</span></div>
                  <div className="text-sm text-muted-foreground">= $1,788/year</div>
                </div>
                <div className="relative">
                  <Badge className="absolute -top-3 right-0 bg-accent">Best Value</Badge>
                  <div className="text-sm text-muted-foreground mb-2">Annual Plan (Founding Member)</div>
                  <div className="text-4xl font-bold gradient-text mb-2">$999<span className="text-lg">/yr</span></div>
                  <div className="text-sm font-semibold text-accent">Save $789/year!</div>
                </div>
              </div>
              <p className="mt-6 text-sm text-muted-foreground max-w-2xl mx-auto">
                Annual billing locks in your Founding Member rate forever. Monthly plans may increase to $149/month after promotion ends.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Add-Ons Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <h2 className="text-center mb-12">Enhance Your Plan with Add-Ons</h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold gradient-text mb-2">$49/month</div>
              <h3 className="font-bold mb-2">Virtual Staging AI</h3>
              <p className="text-sm text-muted-foreground">Unlimited virtual staging for all your listings</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-2xl font-bold gradient-text mb-2">$79/month</div>
              <h3 className="font-bold mb-2">Advanced Market Reports</h3>
              <p className="text-sm text-muted-foreground">Branded reports with your logo and branding</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-2xl font-bold gradient-text mb-2">$199/month</div>
              <h3 className="font-bold mb-2">Lead Generation Module</h3>
              <p className="text-sm text-muted-foreground">Targeted seller/buyer lead identification</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Guarantees Section */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-center mb-12">Our Guarantees to You</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-8 text-center">
              <Shield className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">30-Day Money-Back Guarantee</h3>
              <p className="text-muted-foreground">
                Close at least one additional deal in your first 30 days or get a full refund. No questions asked.
              </p>
            </Card>
            
            <Card className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">No Contracts, Cancel Anytime</h3>
              <p className="text-muted-foreground">
                All plans are month-to-month. Cancel anytime with one click. No penalties, no hassles.
              </p>
            </Card>
            
            <Card className="p-8 text-center">
              <Brain className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Free Setup & Migration</h3>
              <p className="text-muted-foreground">
                We'll migrate your contacts and data from any CRM for free. Plus complimentary onboarding and training.
              </p>
            </Card>
          </div>
          
          <Card className="p-12 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <Shield className="w-20 h-20 text-accent flex-shrink-0" />
              <div>
                <h2 className="mb-4">30-Day Money-Back Guarantee</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  If you don't see measurable ROI in 30 days, we'll refund 100%. No questions asked.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                  <Badge variant="secondary" className="gap-1">
                    <Check className="w-3 h-3" />
                    No contracts
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Check className="w-3 h-3" />
                    No setup fees
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Check className="w-3 h-3" />
                    Cancel anytime
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom max-w-3xl">
          <h2 className="text-center mb-12">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-background rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                Do I need to sign a long-term contract?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                No, all plans are month-to-month with no commitment. Cancel anytime without penalty.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-background rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                Is CREA DDF® integration included?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Native CREA DDF® integration is currently in development and planned for Q3 2026. It will be included in all plans at no extra cost. In the meantime, you can import listings from Realtor.ca using our built-in import tool.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-background rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                Can I try before I buy?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Absolutely! Schedule a personalized demo to see all features in action before making your decision.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-background rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                What if I exceed my contact limit?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We'll notify you when you're approaching your limit, and you can upgrade to the next tier seamlessly without losing any data.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-background rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                Do you offer training?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes, free onboarding and training are included with all plans. We'll help you get up and running quickly.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
