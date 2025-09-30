import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { CheckCircle, Brain, MessageSquare, TrendingUp, FileCheck, Megaphone } from "lucide-react";

const Features = () => {
  const featureTabs = [
    {
      value: "crm",
      label: "Predictive CRM",
      icon: Brain,
      features: [
        {
          title: "Multi-Dimensional Lead Scoring",
          description: "AI analyzes 50+ data points including property searches, email engagement, social signals, mortgage pre-approval status, and life events",
          benefit: "Increase conversion from 5% to 18%",
        },
        {
          title: "Conversational Intelligence",
          description: "Real-time sentiment analysis across email, text, and chat with urgency detection and automated response suggestions",
          benefit: "45% more relevant responses, 60% fewer deals falling through",
        },
        {
          title: "Automated Data Enrichment",
          description: "Autonomous contact profile building from public records, social media, and behavior tracking",
          benefit: "90% reduction in manual data entry",
        },
      ],
    },
    {
      value: "chatbot",
      label: "AI Chatbot",
      icon: MessageSquare,
      features: [
        {
          title: "24/7 Multilingual Engagement",
          description: "Intelligent conversations in English and French, handles property inquiries, qualifies leads, schedules showings",
          benefit: "250% increase in after-hours lead capture",
        },
        {
          title: "Smart Qualification System",
          description: "AI conducts natural conversations to assess buyer readiness, budget, timeline, and preferences",
          benefit: "Only qualified leads reach your calendar",
        },
        {
          title: "Seamless Human Handoff",
          description: "AI knows when to transfer to human agent with complete conversation context",
          benefit: "Never lose a hot lead to automation",
        },
      ],
    },
    {
      value: "market",
      label: "Market Intelligence",
      icon: TrendingUp,
      features: [
        {
          title: "Predictive Property Valuation",
          description: "95% accurate valuations using 300+ property data points and local market trends",
          benefit: "CMAs in 3 minutes vs. 3 hours",
        },
        {
          title: "Off-Market Opportunity Detection",
          description: "AI predicts which homeowners are likely to sell 3-6 months before listing",
          benefit: "Get exclusive listings before competitors",
        },
        {
          title: "Real-Time Market Reports",
          description: "Automated comparative market analysis with absorption rates, days-on-market trends, price-per-sqft evolution",
          benefit: "Position yourself as the local market expert",
        },
      ],
    },
    {
      value: "transaction",
      label: "Transaction Management",
      icon: FileCheck,
      features: [
        {
          title: "Intelligent Timeline Prediction",
          description: "AI forecasts closing dates based on transaction type, parties involved, and historical performance",
          benefit: "Reduce closing time from 60 to 35 days",
        },
        {
          title: "Automated Vendor Coordination",
          description: "Smart scheduling of inspectors, appraisers, lawyers with availability optimization",
          benefit: "75% fewer missed deadlines",
        },
        {
          title: "Risk Detection Engine",
          description: "Predictive alerts for financing issues, inspection problems, and buyer/seller cold feet",
          benefit: "Deal fall-through reduced from 12% to 4%",
        },
      ],
    },
    {
      value: "marketing",
      label: "Marketing Automation",
      icon: Megaphone,
      features: [
        {
          title: "AI Content Generation",
          description: "Automated creation of property descriptions, social posts, email campaigns, and neighborhood guides",
          benefit: "85% less time on marketing content",
        },
        {
          title: "Intelligent Distribution",
          description: "AI determines optimal posting times, channels, and audience segments for each piece of content",
          benefit: "150% increase in engagement rates",
        },
        {
          title: "Performance Analytics",
          description: "ROI tracking by content type, platform, and campaign with improvement recommendations",
          benefit: "45% reduction in cost per lead",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <h1 className="mb-6 animate-fade-in-up">
            Every Feature Your Real Estate Business Needs, <span className="gradient-text">Powered by AI</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            From first contact to closed deal - intelligent automation at every step
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
          <h2 className="text-center mb-12">Brainfy AI vs. Traditional CRMs</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-background rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-gradient-to-r from-primary to-secondary text-white">
                <tr>
                  <th className="p-4 text-left font-semibold">Feature</th>
                  <th className="p-4 text-left font-semibold">Brainfy AI</th>
                  <th className="p-4 text-left font-semibold">Traditional CRMs</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Predictive Lead Scoring", "✓ Advanced AI", "Basic manual scoring"],
                  ["24/7 AI Chatbot", "✓ Bilingual", "Limited or none"],
                  ["CREA DDF® Integration", "✓ Native", "Requires add-ons"],
                  ["Transaction Intelligence", "✓ AI-powered", "Manual tracking"],
                  ["Provincial Compliance", "✓ Automated", "Manual management"],
                  ["Price", "Starting at $99/mo", "$69-$150/mo"],
                  ["ROI", "$8.71 per $1 invested", "$3-4 per $1 invested"],
                ].map((row, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-4 font-medium">{row[0]}</td>
                    <td className="p-4 text-accent font-semibold">{row[1]}</td>
                    <td className="p-4 text-muted-foreground">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
