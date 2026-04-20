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
        description="RealtorDesk AI pricing: Agent $149/mo, Team $299/mo, Brokerage custom. No setup fees, 14-day free trial. PIPEDA-aware design. CREA DDF® integration on the Q3 2026 roadmap."
        keywords="real estate CRM pricing, CRM for real estate agents cost, Lofty alternative pricing, best CRM for real estate agents Canada, affordable real estate CRM"
        structuredData={[
          pricingPageFAQSchema,
          productSchema("Starter", 149, "AI-powered real estate CRM for individual Canadian agents — bilingual EN/FR, PIPEDA-aware, CREA DDF® on Q3 2026 roadmap"),
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
              {t('pricing.hero.saveYearly')} + {t('pricing.annual.foundingBonus', 'Founding Member Bonus')}
            </Badge>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <PricingCard
              name={t('pricing.plans.agent.name')}
              price={isYearly ? (pricingData.agent.foundingPrice.toString()) : pricingData.agent.monthly.toString()}
              description={t('pricing.plans.agent.description')}
              billingPeriod={isYearly ? "year" : "month"}
              discount={isYearly ? `Save $789 vs monthly ($498 vs regular yearly)` : t('pricing.plans.agent.savings')}
              yearlyPrice={isYearly ? pricingData.agent.foundingPrice : undefined}
              features={[
                t('pricing.plans.agent.feature1'),
                t('pricing.plans.agent.feature2'),
                t('pricing.plans.agent.feature3'),
                t('pricing.plans.agent.feature4'),
                t('pricing.plans.agent.feature5'),
                t('pricing.plans.agent.feature6'),
                t('pricing.plans.agent.feature7'),
                t('pricing.plans.agent.feature8'),
                t('pricing.plans.agent.feature9'),
                t('pricing.plans.agent.feature10'),
                t('pricing.plans.agent.feature11'),
              ]}
              ctaText={t('pricing.plans.agent.ctaMonthly')}
              ctaLink="/signup"
              trialBadge={t('pricing.plans.agent.badge')}
            />

            <PricingCard
              name={t('pricing.plans.team.name')}
              price={isYearly ? "2,997" : "299"}
              description={t('pricing.plans.team.description')}
              billingPeriod={isYearly ? "year" : "month"}
              discount={isYearly ? `Save ${pricingData.team.discount} annually` : undefined}
              yearlyPrice={isYearly ? pricingData.team.yearly : undefined}
              features={[
                t('pricing.plans.team.feature1'),
                t('pricing.plans.team.feature2'),
                t('pricing.plans.team.feature3'),
                t('pricing.plans.team.feature4'),
                t('pricing.plans.team.feature5'),
                t('pricing.plans.team.feature6'),
                t('pricing.plans.team.feature7'),
                t('pricing.plans.team.feature8'),
                t('pricing.plans.team.feature9'),
                t('pricing.plans.team.feature10'),
                t('pricing.plans.team.feature11'),
              ]}
              popular
              ctaText={t('pricing.plans.team.cta')}
              ctaLink="/signup"
              trialBadge={t('pricing.plans.team.badge')}
            />

            <PricingCard
              name={t('pricing.plans.brokerage.name')}
              price={t('pricing.plans.brokerage.price')}
              description={t('pricing.plans.brokerage.description')}
              features={[
                t('pricing.plans.brokerage.feature1'),
                t('pricing.plans.brokerage.feature2'),
                t('pricing.plans.brokerage.feature3'),
                t('pricing.plans.brokerage.feature4'),
                t('pricing.plans.brokerage.feature5'),
                t('pricing.plans.brokerage.feature6'),
                t('pricing.plans.brokerage.feature7'),
                t('pricing.plans.brokerage.feature8'),
                t('pricing.plans.brokerage.feature9'),
                t('pricing.plans.brokerage.feature10'),
              ]}
              ctaText={t('pricing.plans.brokerage.cta')}
              ctaLink="/demo"
              trialBadge={t('pricing.plans.brokerage.badge')}
            />
          </div>

          {/* Competitor Comparison Box */}
          <Card className="mt-16 p-8 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">{t('pricing.compare.heading')}</h3>
              <p className="text-muted-foreground">{t('pricing.compare.sub')}</p>
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
                  <div className="text-xs text-muted-foreground">{t('pricing.compare.firstYear')}</div>
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
                  <div className="text-xs text-muted-foreground">{t('pricing.compare.perYear')}</div>
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
                  <div className="text-xs text-accent font-semibold">{t('pricing.compare.saveThousands')}</div>
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
            <h3 className="text-2xl font-bold mb-6 text-center">{t('pricing.table.heading')}</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2">
                    <th className="text-left py-4 px-4 font-semibold">{t('pricing.table.featureCol')}</th>
                    <th className="text-center py-4 px-4 font-semibold text-accent">Realtor Desk AI</th>
                    <th className="text-center py-4 px-4 font-semibold text-muted-foreground">BoldTrail</th>
                    <th className="text-center py-4 px-4 font-semibold text-muted-foreground">Lofty</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">{ t("pricing.table.annualPrice", "Annual Price (Agent)") }</td>
                    <td className="text-center py-3 px-4 font-bold text-accent">$999</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">$5,988</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">$1,788+</td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">{ t("pricing.table.setupFee", "Setup Fee") }</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-accent mx-auto" /></td>
                    <td className="text-center py-3 px-4 text-muted-foreground">$999</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">{ t("pricing.table.varies") }</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">{ t("pricing.table.aiScoring", "AI Predictive Lead Scoring") }</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-accent mx-auto" /></td>
                    <td className="text-center py-3 px-4"><X className="w-5 h-5 text-destructive mx-auto" /></td>
                    <td className="text-center py-3 px-4 text-muted-foreground">{ t("pricing.table.basic") }</td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">{ t("pricing.table.chatbot", "24/7 Bilingual AI Chatbot") }</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-accent mx-auto" /></td>
                    <td className="text-center py-3 px-4"><X className="w-5 h-5 text-destructive mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">CREA DDF® {t('pricing.table.comingQ3')}</td>
                    <td className="text-center py-3 px-4"><span className="text-xs text-primary font-medium">{t('pricing.table.comingSoon')}</span></td>
                    <td className="text-center py-3 px-4 text-muted-foreground">{t('pricing.table.extraCost')}</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">{t('pricing.table.limited')}</td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">{ t("pricing.table.migration", "Free Migration") }</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-accent mx-auto" /></td>
                    <td className="text-center py-3 px-4"><X className="w-5 h-5 text-destructive mx-auto" /></td>
                    <td className="text-center py-3 px-4 text-muted-foreground">$500+</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">{ t("pricing.table.compliance", "Canadian Compliance (RECO, BCFSA)") }</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-accent mx-auto" /></td>
                    <td className="text-center py-3 px-4 text-muted-foreground">{ t("pricing.table.partial") }</td>
                    <td className="text-center py-3 px-4"><X className="w-5 h-5 text-destructive mx-auto" /></td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">{ t("pricing.table.mobileApp", "Mobile App") }</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-accent mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-semibold">{ t("pricing.table.totalCost", "Total First Year Cost") }</td>
                    <td className="text-center py-3 px-4 font-bold text-xl gradient-text">$999</td>
                    <td className="text-center py-3 px-4 font-bold text-destructive">$6,987</td>
                    <td className="text-center py-3 px-4 font-bold text-destructive">$1,788+</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-accent/10 rounded-lg text-center">
              <p className="text-sm font-semibold">
                {t('pricing.table.boldtrailSwitch', '💰 Switching from BoldTrail?')} <span className="gradient-text">{t('pricing.table.boldtrailSave', "You'll save $5,988 in year one alone!")}</span>
              </p>
            </div>
          </Card>

          {/* Social Proof - Success Stories */}
          <div className="mt-16 max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-center">{t('pricing.social.heading')}</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
                <div className="text-3xl font-bold gradient-text mb-2">$127K</div>
                <p className="text-sm text-muted-foreground mb-4">{t('pricing.social.stat1')}</p>
                <p className="text-xs italic">{t('pricing.social.quote1', '"Switched from BoldTrail and never looked back. The AI lead scoring is incredible."')}</p>
                <p className="text-xs font-semibold mt-2">- Sarah M., Toronto</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
                <div className="text-3xl font-bold gradient-text mb-2">18 {t('billing.features.deals', 'Deals')}</div>
                <p className="text-sm text-muted-foreground mb-4">{t('pricing.social.stat2')}</p>
                <p className="text-xs italic">{t('pricing.social.quote2', '"The 24/7 bilingual chatbot captures leads while I sleep. Game changer."')}</p>
                <p className="text-xs font-semibold mt-2">- Marc D., Montreal</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
                <div className="text-3xl font-bold gradient-text mb-2">15 hrs/wk</div>
                <p className="text-sm text-muted-foreground mb-4">{t('pricing.social.stat3')}</p>
                <p className="text-xs italic">{t('pricing.social.quote3', '"Automation handles follow-ups. I focus on closing deals, not data entry."')}</p>
                <p className="text-xs font-semibold mt-2">- Priya S., Vancouver</p>
              </Card>
            </div>
          </div>

          {/* Monthly vs Yearly Savings Highlight */}
          <Card className="mt-12 p-8 bg-gradient-to-r from-primary/5 to-secondary/5 max-w-4xl mx-auto border-2 border-primary/20">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">{t('pricing.annual.heading')}</h3>
              <div className="grid md:grid-cols-2 gap-8 mt-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">{t('pricing.annual.monthly')}</div>
                  <div className="text-4xl font-bold text-muted-foreground mb-2">$149<span className="text-lg">{t('pricing.annual.mo')}</span></div>
                  <div className="text-sm text-muted-foreground">= $1,788/{t('pricing.annual.yr', 'yr').replace('/', '')}</div>
                </div>
                <div className="relative">
                  <Badge className="absolute -top-3 right-0 bg-accent">{t('pricing.annual.bestValue')}</Badge>
                  <div className="text-sm text-muted-foreground mb-2">{t('pricing.annual.annualPlan')}</div>
                  <div className="text-4xl font-bold gradient-text mb-2">$999<span className="text-lg">{t('pricing.annual.yr')}</span></div>
                  <div className="text-sm font-semibold text-accent">{t('pricing.annual.save')}</div>
                </div>
              </div>
              <p className="mt-6 text-sm text-muted-foreground max-w-2xl mx-auto">
                {t('pricing.annual.disclaimer', 'Annual billing locks in your Founding Member rate forever. Monthly plans may increase to $149/month after promotion ends.')}
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Add-Ons Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <h2 className="text-center mb-12">{t('pricing.addons.heading')}</h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold gradient-text mb-2">49 $/{t('pricing.annual.mo', '/mo').replace('/', '')}</div>
              <h3 className="font-bold mb-2">{t('pricing.addons.staging')}</h3>
              <p className="text-sm text-muted-foreground">{t('pricing.addons.stagingDesc')}</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-2xl font-bold gradient-text mb-2">79 $/{t('pricing.annual.mo', '/mo').replace('/', '')}</div>
              <h3 className="font-bold mb-2">{t('pricing.addons.reports')}</h3>
              <p className="text-sm text-muted-foreground">{t('pricing.addons.reportsDesc')}</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-2xl font-bold gradient-text mb-2">199 $/{t('pricing.annual.mo', '/mo').replace('/', '')}</div>
              <h3 className="font-bold mb-2">{t('pricing.addons.leads')}</h3>
              <p className="text-sm text-muted-foreground">{t('pricing.addons.leadsDesc')}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Guarantees Section */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-center mb-12">{t('pricing.guarantees.heading')}</h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-8 text-center">
              <Shield className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">{t('pricing.guarantees.moneyBack')}</h3>
              <p className="text-muted-foreground">{t('pricing.guarantees.moneyBackDesc')}</p>
            </Card>

            <Card className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">{t('pricing.guarantees.noContracts')}</h3>
              <p className="text-muted-foreground">{t('pricing.guarantees.noContractsDesc')}</p>
            </Card>

            <Card className="p-8 text-center">
              <Brain className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">{t('pricing.guarantees.freeSetup')}</h3>
              <p className="text-muted-foreground">{t('pricing.guarantees.freeSetupDesc')}</p>
            </Card>
          </div>

          <Card className="p-12 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <Shield className="w-20 h-20 text-accent flex-shrink-0" />
              <div>
                <h2 className="mb-4">{t('pricing.guarantees.moneyBack')}</h2>
                <p className="text-lg text-muted-foreground mb-4">{t('pricing.guarantees.moneyBackDesc')}</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                  <Badge variant="secondary" className="gap-1">
                    <Check className="w-3 h-3" />
                    {t('pricing.guarantees.badge1')}
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Check className="w-3 h-3" />
                    {t('pricing.guarantees.badge2')}
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Check className="w-3 h-3" />
                    {t('pricing.guarantees.badge3')}
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
          <h2 className="text-center mb-12">{t('pricing.faq.heading')}</h2>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-background rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                {t('pricing.faq.q1')}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                No, all plans are month-to-month with no commitment. Cancel anytime without penalty.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-background rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                {t('pricing.faq.q2')}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Native CREA DDF® integration is currently in development and planned for Q3 2026. It will be included in all plans at no extra cost. In the meantime, you can import listings from Realtor.ca using our built-in import tool.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-background rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                {t('pricing.faq.q3')}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Absolutely! Schedule a personalized demo to see all features in action before making your decision.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-background rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                {t('pricing.faq.q4')}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We'll notify you when you're approaching your limit, and you can upgrade to the next tier seamlessly without losing any data.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-background rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                {t('pricing.faq.q5')}
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
