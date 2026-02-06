import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserPlus, Link as LinkIcon, Brain, Settings, Rocket, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import heroDashboard from "@/assets/hero-dashboard.jpg";

const HowItWorks = () => {
  const { t } = useTranslation();

  const steps = [
    {
      number: 1,
      icon: UserPlus,
      titleKey: "howItWorks.steps.signUp.title",
      timeKey: "howItWorks.steps.signUp.time",
      descriptionKey: "howItWorks.steps.signUp.description",
      detailsKey: "howItWorks.steps.signUp.details"
    },
    {
      number: 2,
      icon: LinkIcon,
      titleKey: "howItWorks.steps.connectTools.title",
      timeKey: "howItWorks.steps.connectTools.time",
      descriptionKey: "howItWorks.steps.connectTools.description",
      detailsKey: "howItWorks.steps.connectTools.details"
    },
    {
      number: 3,
      icon: Brain,
      titleKey: "howItWorks.steps.trainAI.title",
      timeKey: "howItWorks.steps.trainAI.time",
      descriptionKey: "howItWorks.steps.trainAI.description",
      detailsKey: "howItWorks.steps.trainAI.details"
    },
    {
      number: 4,
      icon: Settings,
      titleKey: "howItWorks.steps.customize.title",
      timeKey: "howItWorks.steps.customize.time",
      descriptionKey: "howItWorks.steps.customize.description",
      detailsKey: "howItWorks.steps.customize.details"
    },
    {
      number: 5,
      icon: Rocket,
      titleKey: "howItWorks.steps.goLive.title",
      timeKey: "howItWorks.steps.goLive.time",
      descriptionKey: "howItWorks.steps.goLive.description",
      detailsKey: "howItWorks.steps.goLive.details"
    },
    {
      number: 6,
      icon: TrendingUp,
      titleKey: "howItWorks.steps.optimize.title",
      timeKey: "howItWorks.steps.optimize.time",
      descriptionKey: "howItWorks.steps.optimize.description",
      detailsKey: "howItWorks.steps.optimize.details"
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="How RealtorDesk AI Works | Setup in 20 Minutes"
        description="Get started with RealtorDesk AI in about 20 minutes. Simple CRM setup, AI tools for Realtors, lead generation configuration, and virtual tour integration."
        keywords="real estate crm setup, ai crm onboarding, realtor crm implementation, real estate lead generation software setup"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-secondary/10 to-primary/10">
        <div className="container-custom text-center">
          <h1 className="mb-6 animate-fade-in-up">
            {t('howItWorks.hero.title')} <span className="gradient-text">{t('howItWorks.hero.titleGradient')}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            {t('howItWorks.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Step-by-Step Timeline */}
      <section className="section-padding">
        <div className="container-custom max-w-6xl">
          <div className="space-y-12">
            {steps.map((step, idx) => {
              const details = t(step.detailsKey, { returnObjects: true }) as string[];
              return (
                <div key={step.number} className="relative animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Left: Visual */}
                    <div className={`${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                      <Card className="p-8 card-hover">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center text-2xl font-bold">
                            {step.number}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">{t(step.titleKey)}</h3>
                            <p className="text-sm text-muted-foreground">⏱️ {t(step.timeKey)}</p>
                          </div>
                        </div>
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <step.icon className="w-10 h-10 text-primary" />
                        </div>
                      </Card>
                    </div>

                    {/* Right: Details */}
                    <div className={`${idx % 2 === 1 ? 'md:order-1' : ''}`}>
                      <p className="text-lg text-muted-foreground mb-4">{t(step.descriptionKey)}</p>
                      <ul className="space-y-2">
                        {Array.isArray(details) && details.map((detail, detailIdx) => (
                          <li key={detailIdx} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {idx < steps.length - 1 && (
                    <div className="hidden md:block absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-12">
                      <ArrowRight className="w-8 h-8 text-primary rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="mb-6">{t('howItWorks.dashboard.title')}</h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t('howItWorks.dashboard.subtitle')}
            </p>
            
            <div className="rounded-2xl overflow-hidden shadow-2xl mb-8">
              <img
                src={heroDashboard}
                alt="Realtor Desk AI Dashboard"
                className="w-full"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <h3 className="font-bold mb-2">{t('howItWorks.dashboard.unifiedInbox')}</h3>
                <p className="text-sm text-muted-foreground">{t('howItWorks.dashboard.unifiedInboxDesc')}</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-bold mb-2">{t('howItWorks.dashboard.aiInsights')}</h3>
                <p className="text-sm text-muted-foreground">{t('howItWorks.dashboard.aiInsightsDesc')}</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-bold mb-2">{t('howItWorks.dashboard.analytics')}</h3>
                <p className="text-sm text-muted-foreground">{t('howItWorks.dashboard.analyticsDesc')}</p>
              </Card>
            </div>

            <Link to="/signup">
              <Button size="lg" className="btn-gradient">
                {t('howItWorks.dashboard.cta')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="text-center">
              <h2 className="mb-4">{t('howItWorks.support.title')}</h2>
              <p className="text-lg text-muted-foreground mb-6">
                {t('howItWorks.support.subtitle')}
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div>
                  <h3 className="font-bold mb-2">{t('howItWorks.support.videoTutorials')}</h3>
                  <p className="text-sm text-muted-foreground">{t('howItWorks.support.videoTutorialsDesc')}</p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">{t('howItWorks.support.liveChat')}</h3>
                  <p className="text-sm text-muted-foreground">{t('howItWorks.support.liveChatDesc')}</p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">{t('howItWorks.support.freeOnboarding')}</h3>
                  <p className="text-sm text-muted-foreground">{t('howItWorks.support.freeOnboardingDesc')}</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                <strong>{t('howItWorks.support.avgSetupTime')}</strong> {t('howItWorks.support.basedOn')}
              </p>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;