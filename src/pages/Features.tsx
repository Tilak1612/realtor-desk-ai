import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { CheckCircle, Brain, MessageSquare, TrendingUp, FileCheck, Megaphone } from "lucide-react";
import { useTranslation } from "react-i18next";

const Features = () => {
  const { t } = useTranslation();

  const featureTabs = [
    {
      value: "crm",
      label: t('features.tab1', 'Predictive CRM'),
      icon: Brain,
      features: [
        {
          title: t('features.crm.h1', 'Multi-Dimensional Lead Scoring'),
          description: t('features.crm.p1', 'AI analyzes engagement signals including property searches, email opens, social activity, mortgage indicators, and life events to rank your leads'),
          benefit: t('features.crm.sub1', 'Focus on your hottest leads and close more deals'),
        },
        {
          title: t('features.crm.h2', 'Conversational Intelligence'),
          description: t('features.crm.p2', 'Real-time sentiment analysis across email, text, and chat with urgency detection and automated response suggestions'),
          benefit: t('features.crm.sub2', '45% more relevant responses, 60% fewer deals falling through'),
        },
        {
          title: t('features.crm.h3', 'Automated Data Enrichment'),
          description: t('features.crm.p3', 'Autonomous contact profile building from public records, social media, and behavior tracking'),
          benefit: t('features.crm.sub3', 'Dramatically reduce manual data entry with automated profile building'),
        },
      ],
    },
    {
      value: "chatbot",
      label: t('features.tab2', 'AI Chatbot'),
      icon: MessageSquare,
      features: [
        {
          title: t('features.chatbot.h1', '24/7 Multilingual Engagement'),
          description: t('features.chatbot.p1', 'Intelligent conversations in English and French, handles property inquiries, qualifies leads, schedules showings'),
          benefit: t('features.chatbot.sub1', 'Maximize after-hours lead capture with AI that never sleeps'),
        },
        {
          title: t('features.chatbot.h2', 'Smart Qualification System'),
          description: t('features.chatbot.p2', 'AI conducts natural conversations to assess buyer readiness, budget, timeline, and preferences'),
          benefit: t('features.chatbot.sub2', 'Only qualified leads reach your calendar'),
        },
        {
          title: t('features.chatbot.h3', 'Seamless Human Handoff'),
          description: t('features.chatbot.p3', 'AI knows when to transfer to human agent with complete conversation context'),
          benefit: t('features.chatbot.sub3', 'Never lose a hot lead to automation'),
        },
      ],
    },
    {
      value: "market",
      label: t('features.tab3', 'Market Intelligence'),
      icon: TrendingUp,
      features: [
        {
          title: t('features.market.h1', 'AI-Powered Property Insights (Coming Soon)'),
          description: t('features.market.p1', 'AI-assisted property analysis using local market trends, comparable sales, and neighbourhood data to support your CMA process'),
          benefit: t('features.market.sub1', 'Faster, data-backed CMAs for your clients'),
        },
        {
          title: t('features.market.h2', 'Off-Market Opportunity Detection'),
          description: t('features.market.p2', 'AI predicts which homeowners are likely to sell 3-6 months before listing'),
          benefit: t('features.market.sub2', 'Get exclusive listings before competitors'),
        },
        {
          title: t('features.market.h3', 'Real-Time Market Reports'),
          description: t('features.market.p3', 'Automated comparative market analysis with absorption rates, days-on-market trends, price-per-sqft evolution'),
          benefit: t('features.market.sub3', 'Position yourself as the local market expert'),
        },
      ],
    },
    {
      value: "transaction",
      label: t('features.tab4', 'Transaction Management'),
      icon: FileCheck,
      features: [
        {
          title: t('features.transaction.h1', 'Intelligent Timeline Prediction'),
          description: t('features.transaction.p1', 'AI forecasts closing dates based on transaction type, parties involved, and historical performance'),
          benefit: t('features.transaction.sub1', 'Designed to accelerate your closing timeline with fewer missed steps'),
        },
        {
          title: t('features.transaction.h2', 'Automated Vendor Coordination'),
          description: t('features.transaction.p2', 'Smart scheduling of inspectors, appraisers, lawyers with availability optimization'),
          benefit: t('features.transaction.sub2', '75% fewer missed deadlines'),
        },
        {
          title: t('features.transaction.h3', 'Risk Detection Engine'),
          description: t('features.transaction.p3', 'Predictive alerts for financing issues, inspection problems, and buyer/seller cold feet'),
          benefit: t('features.transaction.sub3', 'Deal fall-through reduced from 12% to 4%'),
        },
      ],
    },
    {
      value: "marketing",
      label: t('features.tab5', 'Marketing Automation'),
      icon: Megaphone,
      features: [
        {
          title: t('features.marketing.h1', 'AI Content Generation'),
          description: t('features.marketing.p1', 'Automated creation of property descriptions, social posts, email campaigns, and neighborhood guides'),
          benefit: t('features.marketing.sub1', '85% less time on marketing content'),
        },
        {
          title: t('features.marketing.h2', 'Intelligent Distribution'),
          description: t('features.marketing.p2', 'AI determines optimal posting times, channels, and audience segments for each piece of content'),
          benefit: t('features.marketing.sub2', '150% increase in engagement rates'),
        },
        {
          title: t('features.marketing.h3', 'Performance Analytics'),
          description: t('features.marketing.p3', 'ROI tracking by content type, platform, and campaign with improvement recommendations'),
          benefit: t('features.marketing.sub3', '45% reduction in cost per lead'),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="AI Tools for Realtors | Real Estate CRM Features"
        description="Discover AI tools for Realtors: predictive CRM, 24/7 chatbot, real estate lead generation software, virtual tour platforms, and video marketing tools built for agents."
        keywords="real estate crm features, ai tools for realtors, real estate lead generation software, virtual tour integration, real estate video marketing tools, CREA DDF integration"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <h1 className="mb-6 animate-fade-in-up">
            {t('features.hero.title')} <span className="gradient-text">{t('features.hero.titleGradient')}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            {t('features.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Features Tabs Section */}
      <section className="section-padding">
        <div className="container-custom">
          <Tabs defaultValue="crm" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-12 h-auto">
              {featureTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {featureTabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="space-y-8">
                {tab.features.map((feature, index) => (
                  <Card key={index} className="p-8 card-hover">
                    <div className="grid md:grid-cols-3 gap-6 items-start">
                      <div className="md:col-span-2">
                        <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 bg-accent/10 p-4 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-accent flex-shrink-0" />
                        <p className="text-sm font-semibold">{feature.benefit}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <h2 className="text-center mb-12">{t('features.comparison.title')}</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-background rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-gradient-to-r from-primary to-secondary text-white">
                <tr>
                  <th className="p-4 text-left font-semibold">Feature</th>
                  <th className="p-4 text-left font-semibold">Realtor Desk AI</th>
                  <th className="p-4 text-left font-semibold">Follow Up Boss</th>
                  <th className="p-4 text-left font-semibold">Wise Agent</th>
                  <th className="p-4 text-left font-semibold">kvCORE</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Predictive Lead Scoring", "✓ Advanced AI", "Basic", "Manual", "Basic"],
                  ["24/7 AI Chatbot", "✓ Bilingual", "Add-on", "Limited", "Basic"],
                  ["CREA DDF® Integration", "Coming Q3 2026", "Third-party", "Third-party", "Third-party"],
                  ["Transaction AI", "✓ Full automation", "✗", "Manual", "Basic"],
                  ["Canadian Compliance", "✓ Built-in", "Manual", "Manual", "Manual"],
                  ["Marketing Automation", "✓ AI-generated", "Templates", "Templates", "Templates"],
                  ["Mobile App", "✓ Full-featured", "Limited", "Basic", "✓"],
                  ["Starting Price", "$149/mo", "$69/mo", "$49/mo", "$149/mo"],
                  ["Setup Fee", "$0", "$0", "$0", "$299"],
                  ["Contract", "Month-to-month", "Annual", "Month-to-month", "Annual"],
                  ["ROI", "$8.71 per $1", "$3-4 per $1", "$2-3 per $1", "$4-5 per $1"],
                ].map((row, index) => (
                  <tr key={index} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium">{row[0]}</td>
                    <td className="p-4 text-accent font-semibold">{row[1]}</td>
                    <td className="p-4 text-muted-foreground">{row[2]}</td>
                    <td className="p-4 text-muted-foreground">{row[3]}</td>
                    <td className="p-4 text-muted-foreground">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-6">
            {t('features.comparison.disclaimer')}
          </p>
        </div>
      </section>

      {/* Mobile-First Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-6">{t('features.mobile.title')}</h2>
              <p className="text-lg text-muted-foreground mb-6">
                {t('features.mobile.subtitle')}
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Full CRM Access</div>
                    <div className="text-sm text-muted-foreground">View and manage all contacts, leads, and deals from your phone</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Push Notifications</div>
                    <div className="text-sm text-muted-foreground">Get instant alerts for new leads, messages, and deal updates</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Offline Mode</div>
                    <div className="text-sm text-muted-foreground">Access your data even without internet connection</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Voice Commands</div>
                    <div className="text-sm text-muted-foreground">Add notes and create tasks hands-free while driving</div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-12 text-center">
              <MessageSquare className="w-32 h-32 mx-auto mb-6 text-primary" />
              <p className="text-2xl font-bold mb-2">{t('features.mobile.appStores')}</p>
              <p className="text-muted-foreground">Download from App Store or Google Play</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
