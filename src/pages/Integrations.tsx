import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Globe,
  CheckCircle,
  Users,
  Zap,
  MessageSquare,
  Calendar,
  Contact
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface Integration {
  name: string;
  subtitleKey: string;
  logo: string;
}

interface IntegrationCategory {
  titleKey: string;
  icon: React.ReactNode;
  integrations: Integration[];
}

const Integrations = () => {
  const { t } = useTranslation();
  
  const categories: IntegrationCategory[] = [
    {
      titleKey: "integrationsPage.categories.crmPlatforms",
      icon: <Users className="w-5 h-5" />,
      integrations: [
{ name: "Salesforce", subtitleKey: "comingSoon", logo: "https://cdn.worldvectorlogo.com/logos/salesforce-2.svg" },
        { name: "Zoho CRM", subtitleKey: "comingSoon", logo: "https://cdn.worldvectorlogo.com/logos/zoho-1.svg" },
        { name: "Pipedrive", subtitleKey: "comingSoon", logo: "https://cdn.worldvectorlogo.com/logos/pipedrive-1.svg" },
        { name: "Freshsales", subtitleKey: "comingSoon", logo: "https://cdn.worldvectorlogo.com/logos/freshworks-icon.svg" },
        { name: "Microsoft Dynamics", subtitleKey: "comingSoon", logo: "https://cdn.worldvectorlogo.com/logos/microsoft-dynamics-2.svg" },
        { name: "Keap", subtitleKey: "zapier", logo: "https://cdn.worldvectorlogo.com/logos/keap-1.svg" },
        { name: "Agile CRM", subtitleKey: "zapier", logo: "https://cdn.worldvectorlogo.com/logos/agile-crm.svg" },
        { name: "Close CRM", subtitleKey: "zapier", logo: "https://cdn.worldvectorlogo.com/logos/close-io.svg" },
        { name: "Nutshell", subtitleKey: "zapier", logo: "https://cdn.worldvectorlogo.com/logos/nutshell.svg" },
      ]
    },
    {
      titleKey: "integrationsPage.categories.automationTools",
      icon: <Zap className="w-5 h-5" />,
      integrations: [
        { name: "Zapier", subtitleKey: "native", logo: "https://cdn.worldvectorlogo.com/logos/zapier.svg" },
        { name: "Make", subtitleKey: "native", logo: "https://cdn.worldvectorlogo.com/logos/make-horizontal.svg" },
        { name: "n8n", subtitleKey: "native", logo: "https://cdn.worldvectorlogo.com/logos/n8n.svg" },
        { name: "IFTTT", subtitleKey: "zapier", logo: "https://cdn.worldvectorlogo.com/logos/ifttt.svg" },
      ]
    },
    {
      titleKey: "integrationsPage.categories.communicationTools",
      icon: <MessageSquare className="w-5 h-5" />,
      integrations: [
        { name: "Twilio", subtitleKey: "native", logo: "https://cdn.worldvectorlogo.com/logos/twilio-2.svg" },
        { name: "WhatsApp Cloud API", subtitleKey: "comingSoon", logo: "https://cdn.worldvectorlogo.com/logos/whatsapp-2.svg" },
        { name: "Email SMTP Providers", subtitleKey: "native", logo: "https://cdn.worldvectorlogo.com/logos/email-icon.svg" },
      ]
    },
    {
      titleKey: "integrationsPage.categories.calendarTools",
      icon: <Calendar className="w-5 h-5" />,
      integrations: [
        { name: "Google Calendar", subtitleKey: "native", logo: "https://cdn.worldvectorlogo.com/logos/google-calendar-2020.svg" },
        { name: "Outlook Calendar", subtitleKey: "native", logo: "https://cdn.worldvectorlogo.com/logos/outlook-1.svg" },
      ]
    },
    {
      titleKey: "integrationsPage.categories.contactLeadTools",
      icon: <Contact className="w-5 h-5" />,
      integrations: [
        { name: "Google Contacts", subtitleKey: "native", logo: "https://cdn.worldvectorlogo.com/logos/google-contacts.svg" },
        { name: "Microsoft Contacts", subtitleKey: "native", logo: "https://cdn.worldvectorlogo.com/logos/microsoft-icon.svg" },
        { name: "LinkedIn Lead Gen Forms", subtitleKey: "comingSoon", logo: "https://cdn.worldvectorlogo.com/logos/linkedin-icon-2.svg" },
        { name: "Facebook Lead Ads", subtitleKey: "comingSoon", logo: "https://cdn.worldvectorlogo.com/logos/facebook-icon.svg" },
        { name: "Centris (Quebec MLS)", subtitleKey: "comingSoon", logo: "https://cdn.worldvectorlogo.com/logos/canada-flag-icon.svg" },
      ]
    },
  ];

  const totalIntegrations = categories.reduce((acc, cat) => acc + cat.integrations.length, 0);

  const getSubtitle = (key: string) => {
    if (key === 'native') return t('integrations.hero.subtitle').includes('seamlessly') ? 'Native integration' : 'Intégration native';
    if (key === 'comingSoon') return 'Coming Soon';
    return 'Via Zapier/Make';
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Real Estate CRM Integrations | RealtorDesk AI"
        description="Integrate RealtorDesk AI via Zapier, Make, and n8n (5,000+ apps). Direct connectors for Salesforce, Zoho, Pipedrive on the roadmap. CREA DDF® coming Q3 2026."
        keywords="real estate crm integrations, virtual tour platforms, real estate website builders, real estate video marketing tools, CREA DDF integration"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <h1 className="mb-6 animate-fade-in-up">
            {t('integrations.hero.title')} <span className="gradient-text">{t('integrations.hero.titleGradient')}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            {t('integrations.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fade-in-up animation-delay-300">
            <Link to="/demo">
              <Button size="lg" className="text-lg">
                {t('integrationsPage.buttons.bookDemo')}
              </Button>
            </Link>
            <Link to="/features">
              <Button size="lg" variant="outline" className="text-lg">
                {t('integrationsPage.buttons.viewFeatures')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Integration Stats */}
      <section className="section-padding border-b">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-5xl font-bold gradient-text mb-2">{totalIntegrations}+</div>
              <p className="text-muted-foreground">{t('integrationsPage.stats.nativeIntegrations')}</p>
            </div>
            <div>
              <div className="text-5xl font-bold gradient-text mb-2">5,000+</div>
              <p className="text-muted-foreground">{t('integrationsPage.stats.viaZapier')}</p>
            </div>
            <div>
              <div className="text-5xl font-bold gradient-text mb-2">24/7</div>
              <p className="text-muted-foreground">{t('integrationsPage.stats.realTimeSync')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categorized Integrations Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('integrationsPage.partners.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('integrationsPage.partners.subtitle', { count: totalIntegrations })}
            </p>
          </div>
          
          <div className="space-y-12">
            {categories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{t(category.titleKey)}</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {category.integrations.map((integration, index) => (
                    <Card
                      key={index}
                      className="p-4 card-hover flex flex-col items-center text-center group bg-zinc-800 border border-zinc-500 rounded-lg"
                      tabIndex={0}
                    >
                      <div className="w-12 h-12 mb-3 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {integration.name.charAt(0)}
                      </div>
                      <h4 className="font-medium text-sm mb-1">{integration.name}</h4>
                      <p className="text-xs text-muted-foreground">{getSubtitle(integration.subtitleKey)}</p>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Access Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-6">{t('integrationsPage.api.title')}</h2>
              <p className="text-lg text-muted-foreground mb-6">
                {t('integrationsPage.api.subtitle')}
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">{t('integrationsPage.api.restApi')}</div>
                    <div className="text-sm text-muted-foreground">{t('integrationsPage.api.restApiDesc')}</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">{t('integrationsPage.api.zapier')}</div>
                    <div className="text-sm text-muted-foreground">{t('integrationsPage.api.zapierDesc')}</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">{t('integrationsPage.api.webhooks')}</div>
                    <div className="text-sm text-muted-foreground">{t('integrationsPage.api.webhooksDesc')}</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">{t('integrationsPage.api.devSupport')}</div>
                    <div className="text-sm text-muted-foreground">{t('integrationsPage.api.devSupportDesc')}</div>
                  </div>
                </li>
              </ul>
              <Link to="/demo">
                <Button size="lg">
                  {t('integrationsPage.buttons.bookDemo')}
                </Button>
              </Link>
            </div>
            <Card className="p-12 bg-gradient-to-br from-primary/10 to-secondary/10">
              <Globe className="w-24 h-24 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-center mb-4">{t('integrationsPage.api.enterpriseApi')}</h3>
              <p className="text-center text-muted-foreground">
                {t('integrationsPage.api.enterpriseApiDesc')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container-custom text-center">
          <h2 className="mb-6 text-white">{t('integrationsPage.cta.title')}</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            {t('integrationsPage.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button size="lg" variant="secondary" className="text-lg">
                {t('integrationsPage.cta.button')}
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="text-lg bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                {t('integrationsPage.cta.pricing')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Integrations;