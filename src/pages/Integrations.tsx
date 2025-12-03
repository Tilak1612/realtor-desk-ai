import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  subtitle: string;
  logo: string;
}

interface IntegrationCategory {
  title: string;
  icon: React.ReactNode;
  integrations: Integration[];
}

const Integrations = () => {
  const { t } = useTranslation();
  
  const categories: IntegrationCategory[] = [
    {
      title: "CRM Platforms",
      icon: <Users className="w-5 h-5" />,
      integrations: [
        { name: "HubSpot", subtitle: "Native integration", logo: "https://cdn.worldvectorlogo.com/logos/hubspot.svg" },
        { name: "Salesforce", subtitle: "Native integration", logo: "https://cdn.worldvectorlogo.com/logos/salesforce-2.svg" },
        { name: "Zoho CRM", subtitle: "Native integration", logo: "https://cdn.worldvectorlogo.com/logos/zoho-1.svg" },
        { name: "Pipedrive", subtitle: "Native integration", logo: "https://cdn.worldvectorlogo.com/logos/pipedrive-1.svg" },
        { name: "Freshsales", subtitle: "Native integration", logo: "https://cdn.worldvectorlogo.com/logos/freshworks-icon.svg" },
        { name: "Microsoft Dynamics", subtitle: "Native integration", logo: "https://cdn.worldvectorlogo.com/logos/microsoft-dynamics-2.svg" },
        { name: "Keap", subtitle: "Via Zapier/Make", logo: "https://cdn.worldvectorlogo.com/logos/keap-1.svg" },
        { name: "Agile CRM", subtitle: "Via Zapier/Make", logo: "https://cdn.worldvectorlogo.com/logos/agile-crm.svg" },
        { name: "Close CRM", subtitle: "Via Zapier/Make", logo: "https://cdn.worldvectorlogo.com/logos/close-io.svg" },
        { name: "Nutshell", subtitle: "Via Zapier/Make", logo: "https://cdn.worldvectorlogo.com/logos/nutshell.svg" },
      ]
    },
    {
      title: "Automation & Workflow Tools",
      icon: <Zap className="w-5 h-5" />,
      integrations: [
        { name: "Zapier", subtitle: "Native integration", logo: "https://cdn.worldvectorlogo.com/logos/zapier.svg" },
        { name: "Make", subtitle: "Native integration", logo: "https://cdn.worldvectorlogo.com/logos/make-horizontal.svg" },
        { name: "n8n", subtitle: "Native integration", logo: "https://cdn.worldvectorlogo.com/logos/n8n.svg" },
        { name: "IFTTT", subtitle: "Via Zapier/Make", logo: "https://cdn.worldvectorlogo.com/logos/ifttt.svg" },
      ]
    },
    {
      title: "Communication Tools",
      icon: <MessageSquare className="w-5 h-5" />,
      integrations: [
        { name: "Twilio", subtitle: "Native integration", logo: "https://cdn.worldvectorlogo.com/logos/twilio-2.svg" },
        { name: "WhatsApp Cloud API", subtitle: "Native integration", logo: "https://cdn.worldvectorlogo.com/logos/whatsapp-2.svg" },
        { name: "Email SMTP Providers", subtitle: "Native integration", logo: "https://cdn.worldvectorlogo.com/logos/email-icon.svg" },
      ]
    },
    {
      title: "Calendar Tools",
      icon: <Calendar className="w-5 h-5" />,
      integrations: [
        { name: "Google Calendar", subtitle: "Native integration", logo: "https://cdn.worldvectorlogo.com/logos/google-calendar-2020.svg" },
        { name: "Outlook Calendar", subtitle: "Native integration", logo: "https://cdn.worldvectorlogo.com/logos/outlook-1.svg" },
      ]
    },
    {
      title: "Contact & Lead Tools",
      icon: <Contact className="w-5 h-5" />,
      integrations: [
        { name: "Google Contacts", subtitle: "Native integration", logo: "https://cdn.worldvectorlogo.com/logos/google-contacts.svg" },
        { name: "Microsoft Contacts", subtitle: "Native integration", logo: "https://cdn.worldvectorlogo.com/logos/microsoft-icon.svg" },
        { name: "LinkedIn Lead Gen Forms", subtitle: "Native integration", logo: "https://cdn.worldvectorlogo.com/logos/linkedin-icon-2.svg" },
        { name: "Facebook Lead Ads", subtitle: "Native integration", logo: "https://cdn.worldvectorlogo.com/logos/facebook-icon.svg" },
      ]
    },
  ];

  const totalIntegrations = categories.reduce((acc, cat) => acc + cat.integrations.length, 0);

  return (
    <div className="min-h-screen">
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
                Book Your Free Demo
              </Button>
            </Link>
            <Link to="/features">
              <Button size="lg" variant="outline" className="text-lg">
                View All Features
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
              <p className="text-muted-foreground">Native Integrations</p>
            </div>
            <div>
              <div className="text-5xl font-bold gradient-text mb-2">5,000+</div>
              <p className="text-muted-foreground">Via Zapier Connection</p>
            </div>
            <div>
              <div className="text-5xl font-bold gradient-text mb-2">24/7</div>
              <p className="text-muted-foreground">Real-Time Sync</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categorized Integrations Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Integration Partners</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with {totalIntegrations}+ industry-leading tools and platforms
            </p>
          </div>
          
          <div className="space-y-12">
            {categories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{category.title}</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {category.integrations.map((integration, index) => (
                    <Card 
                      key={index} 
                      className="p-4 card-hover flex flex-col items-center text-center group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      tabIndex={0}
                    >
                      <div className="w-12 h-12 mb-3 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300">
                        <img 
                          src={integration.logo} 
                          alt={`${integration.name} logo`}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-lg">${integration.name.charAt(0)}</div>`;
                            }
                          }}
                        />
                      </div>
                      <h4 className="font-medium text-sm mb-1">{integration.name}</h4>
                      <p className="text-xs text-muted-foreground">{integration.subtitle}</p>
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
              <h2 className="mb-6">Need a Custom Integration?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our REST API and Zapier integration give you unlimited flexibility to connect any tool in your workflow.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Full REST API Access</div>
                    <div className="text-sm text-muted-foreground">Enterprise plan includes complete API documentation</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Zapier Integration</div>
                    <div className="text-sm text-muted-foreground">Connect to 5,000+ apps without coding</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Webhook Support</div>
                    <div className="text-sm text-muted-foreground">Real-time data sync with your custom tools</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Developer Support</div>
                    <div className="text-sm text-muted-foreground">Dedicated technical team for custom integrations</div>
                  </div>
                </li>
              </ul>
              <Link to="/demo">
                <Button size="lg">
                  Book Your Free Demo
                </Button>
              </Link>
            </div>
            <Card className="p-12 bg-gradient-to-br from-primary/10 to-secondary/10">
              <Globe className="w-24 h-24 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-center mb-4">Enterprise API Access</h3>
              <p className="text-center text-muted-foreground">
                Build custom integrations with our comprehensive API. Available on Enterprise plans.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container-custom text-center">
          <h2 className="mb-6 text-white">Ready to Connect Your Tech Stack?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Start integrating your tools today and experience seamless workflow automation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button size="lg" variant="secondary" className="text-lg">
                Start Closing More Deals
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="text-lg bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                View Pricing
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
