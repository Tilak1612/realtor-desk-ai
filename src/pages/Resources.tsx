import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, FileText, Award, Home, Cpu, Clock, Database, MapPin, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import blogAI from "@/assets/blog-ai-transformation.jpg";
import blogCREA from "@/assets/blog-crea-ddf.jpg";
import blogCompliance from "@/assets/blog-compliance.jpg";
import blogLeads from "@/assets/blog-lead-conversion.jpg";
import blogBilingual from "@/assets/blog-bilingual-marketing.jpg";
import blogSuccess from "@/assets/blog-success-story.jpg";
import blogHousingForecast from "@/assets/blog-housing-forecast.jpg";
import blogAIAutomation from "@/assets/blog-ai-automation-realtor.jpg";
import blogLeadResponse from "@/assets/blog-lead-conversion.jpg";
import blogAICRM from "@/assets/blog-ai-transformation.jpg";
import blogTorontoVancouver from "@/assets/blog-success-story.jpg";
import blogPIPEDA from "@/assets/blog-compliance.jpg";
import blogFirstTimeBuyer from "@/assets/blog-first-time-buyer.jpg";
import blogSellHomeFast from "@/assets/blog-sell-home-fast.jpg";
import blogEdmontonMarket from "@/assets/blog-edmonton-market.jpg";

const Resources = () => {
  const { t } = useTranslation();
  
  const articles = [
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
      image: blogAICRM,
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

      {/* Category Filter */}
      <section className="py-8 border-b">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 justify-center">
            {categoryKeys.map((key, index) => (
              <Button
                key={key}
                variant={index === 0 ? "default" : "outline"}
                className={index === 0 ? "btn-gradient" : ""}
              >
                {t(key)}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
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