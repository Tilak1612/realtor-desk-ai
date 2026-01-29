import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, FileText, Award, Home, Cpu, Clock, Database, MapPin, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
// Unique images for each resource - no duplicates
import blogAI from "@/assets/blog-ai-transformation.jpg";
import blogCREA from "@/assets/blog-crea-ddf.jpg";
import blogCompliance from "@/assets/blog-compliance.jpg";
import blogLeads from "@/assets/blog-lead-conversion.jpg";
import blogBilingual from "@/assets/blog-bilingual-marketing.jpg";
import blogSuccess from "@/assets/blog-success-story.jpg";
import blogHousingForecast from "@/assets/blog-housing-forecast.jpg";
import blogAIAutomation from "@/assets/blog-ai-automation-realtor.jpg";
import blogFirstTimeBuyer from "@/assets/blog-first-time-buyer.jpg";
import blogSellHomeFast from "@/assets/blog-sell-home-fast.jpg";
import blogEdmontonMarket from "@/assets/blog-edmonton-market.jpg";
// Newly generated unique images
import blogCostMissedLeads from "@/assets/blog-cost-missed-leads.jpg";
import blogCASLCompliance from "@/assets/blog-casl-compliance.jpg";
import blogCalgaryMarketing from "@/assets/blog-calgary-marketing.jpg";
import blogVoiceAI from "@/assets/blog-voice-ai.jpg";
import blogAIChatbot from "@/assets/blog-ai-chatbot.jpg";
import blogBestCRM2025 from "@/assets/blog-best-crm-2025.jpg";
import blogAIvsTraditional from "@/assets/blog-ai-vs-traditional.jpg";
import blogVsKvcore from "@/assets/blog-vs-kvcore.jpg";
import blogVsFollowUpBoss from "@/assets/blog-vs-followupboss.jpg";
import blogIxactAlternatives from "@/assets/blog-ixact-alternatives.jpg";
import blogVsLofty from "@/assets/blog-vs-lofty.jpg";
import blogBoomtownAlternative from "@/assets/blog-boomtown-alternative.jpg";
import blogVsPropertybase from "@/assets/blog-vs-propertybase.jpg";
import blogTorontoVancouver from "@/assets/blog-toronto-vancouver-compare.jpg";
import blogPIPEDA from "@/assets/blog-pipeda-privacy.jpg";
import blogLeadResponse from "@/assets/blog-lead-response-time.jpg";
import blogAICRMGuide from "@/assets/blog-ai-crm-guide.jpg";
import blogLeadGeneration from "@/assets/blog-lead-generation-strategies.jpg";
import blogOpenHouse from "@/assets/blog-open-house-digital.jpg";
import blogDripCampaign from "@/assets/blog-drip-campaign-templates.jpg";

const Resources = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const articles = [
    {
      categoryKey: "resourcesPage.categories.sales",
      icon: TrendingUp,
      title: "17 Proven Real Estate Lead Generation Strategies for Canadian Agents in 2025",
      excerpt: "Generate more qualified real estate leads with these battle-tested strategies. Includes cost breakdowns, ROI expectations, and free templates. Updated for the 2025 Canadian market.",
      readTime: 16,
      image: blogLeadGeneration,
      link: "/blog/real-estate-lead-generation-strategies-canada-2025",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.sales",
      icon: TrendingUp,
      title: "Open House Sign-In Sheets: Digital vs Paper 2025 (CASL Compliance Guide)",
      excerpt: "Digital open house sign-in sheets capture 3x more contact details and enable instant follow-up. Learn CASL requirements, conversion rate differences, and get free templates.",
      readTime: 12,
      image: blogOpenHouse,
      link: "/blog/open-house-digital-sign-in-sheets-vs-paper-2025",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.marketing",
      icon: FileText,
      title: "15 Real Estate Drip Campaign Templates for Canadian Agents (2025 Edition)",
      excerpt: "Copy-paste email sequences that convert cold leads into closed deals. Includes buyer nurture, seller follow-up, and expired listing templates. CASL-compliant and pre-tested.",
      readTime: 14,
      image: blogDripCampaign,
      link: "/blog/real-estate-drip-campaign-templates-canada-2025",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.sales",
      icon: TrendingUp,
      title: "The Real Cost of Missed Real Estate Leads in Canada: 2025 Analysis",
      excerpt: "Every missed lead costs $12,000+. See the true cost of slow response times and poor follow-up. Most agents lose $90,000-165,000/year. Includes ROI calculator.",
      readTime: 15,
      image: blogCostMissedLeads,
      link: "/resources/cost-of-missed-real-estate-leads-canada",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.compliance",
      icon: FileText,
      title: "CASL Compliance for Real Estate Email Marketing: Complete 2026 Guide",
      excerpt: "Master CASL compliance for Canadian real estate email marketing. Avoid $1M+ fines. Learn consent requirements, penalties, templates, and automation strategies.",
      readTime: 16,
      image: blogCASLCompliance,
      link: "/resources/casl-compliance-real-estate-email-marketing-canada",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.marketing",
      icon: BookOpen,
      title: "Calgary Real Estate Marketing Strategies: AI Tools for Alberta Agents in 2026",
      excerpt: "Calgary's market is unique. Oil economy, suburban sprawl, and -30°C winters require specialized strategies. Learn 7 AI-powered tactics Calgary agents use to dominate—even in winter.",
      readTime: 13,
      image: blogCalgaryMarketing,
      link: "/resources/calgary-real-estate-marketing-strategies",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.aiTech",
      icon: TrendingUp,
      title: "Voice AI for Real Estate Lead Follow-Up: How Canadian Agents Close More Deals",
      excerpt: "Voice AI makes 100+ calls per day, qualifies leads, books appointments, and sounds human. See how Canadian agents use AI to follow up instantly and close 3x more deals with 9,131% ROI.",
      readTime: 14,
      image: blogVoiceAI,
      link: "/resources/voice-ai-real-estate-lead-follow-up-canada",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.aiTech",
      icon: TrendingUp,
      title: "AI Chatbot for Real Estate Websites: Complete Canadian Implementation Guide 2026",
      excerpt: "AI chatbots capture 67% of leads that arrive after hours. See how Canadian real estate agents implement AI chatbots to convert visitors 24/7 and never miss a lead again.",
      readTime: 14,
      image: blogAIChatbot,
      link: "/blog/ai-chatbot-real-estate-websites-canada",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.aiTech",
      icon: TrendingUp,
      title: "Best Real Estate CRM for Canada 2025: Complete Comparison Guide",
      excerpt: "Compare the top 10 real estate CRMs in Canada. Features, pricing, pros/cons, and which CRM fits your business. Updated for 2025.",
      readTime: 16,
      image: blogBestCRM2025,
      link: "/blog/best-crm-canada-2025",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.aiTech",
      icon: Database,
      title: "AI CRM vs Traditional CRM for Real Estate: Which Wins in 2025?",
      excerpt: "AI CRMs deliver 847% ROI vs 89% for traditional CRMs. See feature-by-feature comparison, cost analysis, and why Canadian agents are switching.",
      readTime: 14,
      image: blogAIvsTraditional,
      link: "/blog/ai-vs-traditional-crm",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.aiTech",
      icon: Database,
      title: "RealtorDesk AI vs kvCORE: Canadian Real Estate CRM Comparison 2025",
      excerpt: "Compare kvCORE and RealtorDesk AI for Canadian real estate. Features, pricing, Canadian compliance, and which CRM delivers better ROI.",
      readTime: 15,
      image: blogVsKvcore,
      link: "/blog/vs-kvcore",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.aiTech",
      icon: Database,
      title: "RealtorDesk AI vs Follow Up Boss: Which CRM for Canadian Realtors?",
      excerpt: "Follow Up Boss vs RealtorDesk AI comparison. See which CRM offers better AI automation, Canadian features, and ROI for real estate agents.",
      readTime: 14,
      image: blogVsFollowUpBoss,
      link: "/blog/vs-follow-up-boss",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.aiTech",
      icon: Database,
      title: "Best IXACT Contact Alternatives for Canadian Realtors in 2025",
      excerpt: "IXACT Contact alternatives comparison. See top CRMs for Canadian real estate with better AI, pricing, and features than IXACT.",
      readTime: 15,
      image: blogIxactAlternatives,
      link: "/blog/ixact-alternatives",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.aiTech",
      icon: Database,
      title: "RealtorDesk AI vs Lofty (Chime) CRM: Canadian Real Estate Comparison",
      excerpt: "Compare Lofty CRM and RealtorDesk AI for Canadian agents. Features, pricing, AI capabilities, and Canadian market compliance.",
      readTime: 14,
      image: blogVsLofty,
      link: "/blog/vs-lofty-crm",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.aiTech",
      icon: Database,
      title: "Best BoomTown Alternative for Canadian Real Estate Agents 2025",
      excerpt: "BoomTown alternatives comparison. Find better CRMs for Canadian realtors with lower pricing, better AI, and Canadian compliance.",
      readTime: 15,
      image: blogBoomtownAlternative,
      link: "/blog/boomtown-alternative-canada",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.aiTech",
      icon: Database,
      title: "RealtorDesk AI vs Propertybase: Canadian Real Estate CRM Showdown",
      excerpt: "Propertybase vs RealtorDesk AI comparison. Features, pricing, AI automation, and which CRM is better for Canadian real estate teams.",
      readTime: 14,
      image: blogVsPropertybase,
      link: "/blog/vs-propertybase",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.canadianMarket",
      icon: Home,
      title: "First-Time Home Buyer Guide for Canada 2025: Everything You Need to Know",
      excerpt: "Complete first-time home buyer guide for Canada 2025. Learn about down payments, mortgage pre-approval, closing costs, and CMHC insurance.",
      readTime: 18,
      image: blogFirstTimeBuyer,
      link: "/first-time-home-buyer-guide-canada-2025",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.marketing",
      icon: Clock,
      title: "How to Sell Your Home Fast in Canada: 10 Proven Strategies for 2025",
      excerpt: "Learn how to sell your home fast in Canada with these 10 proven strategies. From pricing to staging to marketing, get expert tips for quick sales.",
      readTime: 16,
      image: blogSellHomeFast,
      link: "/sell-home-fast-canada-2025",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.canadianMarket",
      icon: MapPin,
      title: "Edmonton Real Estate Market 2025: Complete Buyer's & Investor's Guide",
      excerpt: "Edmonton real estate market 2025 analysis: housing prices, best neighborhoods, investment opportunities, and market predictions.",
      readTime: 17,
      image: blogEdmontonMarket,
      link: "/edmonton-real-estate-market-2025",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.canadianMarket",
      icon: Home,
      title: "Canada Housing Market Forecast 2025-2026: What Realtors Need to Know",
      excerpt: "Expert analysis of Canada's housing market forecast for 2025-2026. Interest rates, regional trends, and strategies for Canadian Realtors to succeed.",
      readTime: 15,
      image: blogHousingForecast,
      link: "/canada-housing-market-forecast-2025-2026",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.aiTech",
      icon: Cpu,
      title: "How Canadian Realtors Can Thrive in a Slower Market with AI Automation",
      excerpt: "Discover proven AI automation strategies helping Canadian Realtors close more deals in slower markets. Lead generation, follow-up systems & CRM tools.",
      readTime: 18,
      image: blogAIAutomation,
      link: "/canadian-realtors-thrive-slower-market-ai-automation",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.marketing",
      icon: Clock,
      title: "Lead Response Time: Why Canadian Realtors Lose Deals in the First 5 Minutes",
      excerpt: "78% of buyers choose the first agent who responds. Learn why fast lead response is critical for Canadian Realtors and how to automate instant follow-up.",
      readTime: 12,
      image: blogLeadResponse,
      link: "/lead-response-time-canadian-realtors",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.aiTech",
      icon: Database,
      title: "The Complete Guide to AI CRM for Canadian Real Estate Agents in 2025",
      excerpt: "Everything Canadian Realtors need to know about AI-powered CRM systems. Features, benefits, PIPEDA compliance, and how to choose the right platform.",
      readTime: 15,
      image: blogAICRMGuide,
      link: "/ai-crm-canadian-real-estate-agents-guide",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.canadianMarket",
      icon: MapPin,
      title: "Toronto vs Vancouver Real Estate: Market Trends & Predictions for 2025",
      excerpt: "Compare Toronto and Vancouver housing markets for 2025. Price trends, inventory levels, and opportunities for buyers, sellers, and Realtors.",
      readTime: 14,
      image: blogTorontoVancouver,
      link: "/toronto-vs-vancouver-real-estate-market-2025",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.compliance",
      icon: Shield,
      title: "PIPEDA Compliance for Real Estate: AI Tools & Data Privacy in Canada",
      excerpt: "Canadian Realtors must comply with PIPEDA when using AI tools and CRMs. Learn data privacy requirements, best practices, and how to choose compliant platforms.",
      readTime: 16,
      image: blogPIPEDA,
      link: "/pipeda-compliance-real-estate-ai-tools-canada",
      useTranslation: false,
    },
    {
      categoryKey: "resourcesPage.categories.aiTech",
      icon: TrendingUp,
      titleKey: "resourcesPage.articles.aiTransformation.title",
      excerptKey: "resourcesPage.articles.aiTransformation.excerpt",
      readTime: 8,
      image: blogAI,
      link: "/blog/ai-transformation",
      useTranslation: true,
    },
    {
      categoryKey: "resourcesPage.categories.canadianMarket",
      icon: Award,
      titleKey: "resourcesPage.articles.creaDdf.title",
      excerptKey: "resourcesPage.articles.creaDdf.excerpt",
      readTime: 12,
      image: blogCREA,
      link: "/blog/crea-ddf",
      useTranslation: true,
    },
    {
      categoryKey: "resourcesPage.categories.compliance",
      icon: FileText,
      titleKey: "resourcesPage.articles.compliance.title",
      excerptKey: "resourcesPage.articles.compliance.excerpt",
      readTime: 10,
      image: blogCompliance,
      link: "/blog/compliance",
      useTranslation: true,
    },
    {
      categoryKey: "resourcesPage.categories.marketing",
      icon: BookOpen,
      titleKey: "resourcesPage.articles.leadConversion.title",
      excerptKey: "resourcesPage.articles.leadConversion.excerpt",
      readTime: 7,
      image: blogLeads,
      link: "/blog/lead-conversion",
      useTranslation: true,
    },
    {
      categoryKey: "resourcesPage.categories.marketing",
      icon: BookOpen,
      titleKey: "resourcesPage.articles.bilingual.title",
      excerptKey: "resourcesPage.articles.bilingual.excerpt",
      readTime: 9,
      image: blogBilingual,
      link: "/blog/bilingual-marketing",
      useTranslation: true,
    },
    {
      categoryKey: "resourcesPage.categories.successStories",
      icon: Award,
      titleKey: "resourcesPage.articles.successStory.title",
      excerptKey: "resourcesPage.articles.successStory.excerpt",
      readTime: 6,
      image: blogSuccess,
      link: "/blog/success-story",
      useTranslation: true,
    },
  ];

  const categoryKeys = [
    "resourcesPage.categories.all",
    "resourcesPage.categories.aiTech",
    "resourcesPage.categories.canadianMarket",
    "resourcesPage.categories.marketing",
    "resourcesPage.categories.compliance",
    "resourcesPage.categories.successStories"
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <h1 className="mb-6 animate-fade-in-up">
            {t('resources.hero.title')} <span className="gradient-text">{t('resources.hero.titleGradient')}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            {t('resources.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Category Filter - Sticky */}
      <section className="py-8 border-b sticky top-20 z-40 bg-background/95 backdrop-blur-md">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 justify-center">
            {categoryKeys.map((key, index) => (
              <Button
                key={key}
                onClick={() => setSelectedCategory(key)}
                variant={selectedCategory === key ? "default" : "outline"}
                className={selectedCategory === key ? "btn-gradient" : "hover:border-primary transition-colors"}
              >
                {t(key)}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grouped by Category */}
      <section className="section-padding">
        <div className="container-custom">
          {categoryKeys.slice(1).map((categoryKey) => {
            const categoryArticles = articles.filter(article => article.categoryKey === categoryKey);
            
            if (categoryArticles.length === 0) return null;

            // Show all categories or only selected category
            const shouldDisplay = selectedCategory === "all" || selectedCategory === categoryKey;
            
            return shouldDisplay ? (
              <div key={categoryKey} className="mb-16">
                {/* Category Heading */}
                <div className="mb-8" id={categoryKey}>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">
                    {t(categoryKey)}
                  </h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                </div>
                
                {/* Articles Grid for this Category */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {categoryArticles.map((article, index) => (
                    <Card key={index} className="overflow-hidden card-hover">
                      {/* Article Image */}
                      <img 
                        src={article.image} 
                        alt={article.useTranslation ? t(article.titleKey!) : article.title}
                        className="w-full h-48 object-cover"
                      />
                      
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <article.icon className="w-4 h-4 text-primary" />
                          <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                            {t(article.categoryKey)}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold mb-3 line-clamp-2">
                          {article.useTranslation ? t(article.titleKey!) : article.title}
                        </h3>
                        
                        <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed">
                          {article.useTranslation ? t(article.excerptKey!) : article.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {article.readTime} {t('resourcesPage.readTime')}
                          </span>
                          <Link to={article.link}>
                            <Button variant="link" className="text-primary font-semibold p-0">
                              {t('resourcesPage.readMore')} →
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : null;
          })}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container-custom text-center">
          <h2 className="mb-4 text-white">{t('resourcesPage.newsletter.title')}</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            {t('resourcesPage.newsletter.subtitle')}
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <Input
              type="email"
              placeholder={t('resourcesPage.newsletter.placeholder')}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
            />
            <Button type="submit" variant="secondary" size="lg" className="whitespace-nowrap">
              {t('resourcesPage.newsletter.subscribe')}
            </Button>
          </form>

          <p className="text-sm text-white/70 mt-4">
            {t('resourcesPage.newsletter.noSpam')}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;