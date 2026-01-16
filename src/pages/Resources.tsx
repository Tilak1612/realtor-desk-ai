import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, FileText, Award, GitCompare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import blogAI from "@/assets/blog-ai-transformation.jpg";
import blogCREA from "@/assets/blog-crea-ddf.jpg";
import blogCompliance from "@/assets/blog-compliance.jpg";
import blogLeads from "@/assets/blog-lead-conversion.jpg";
import blogBilingual from "@/assets/blog-bilingual-marketing.jpg";
import blogSuccess from "@/assets/blog-success-story.jpg";

const Resources = () => {
  const { t } = useTranslation();
  
  const articles = [
    {
      categoryKey: "resourcesPage.categories.sales",
      icon: TrendingUp,
      title: "The Real Cost of Missed Real Estate Leads in Canada: 2025 Analysis",
      excerpt: "Every missed lead costs $12,000+. See the true cost of slow response times and poor follow-up. Most agents lose $90,000-165,000/year. Includes ROI calculator.",
      readTime: 15,
      image: blogLeads,
      link: "/resources/cost-of-missed-real-estate-leads-canada",
    },
    {
      categoryKey: "resourcesPage.categories.compliance",
      icon: FileText,
      title: "CASL Compliance for Real Estate Email Marketing: Complete 2026 Guide",
      excerpt: "Master CASL compliance for Canadian real estate email marketing. Avoid $1M+ fines. Learn consent requirements, penalties, templates, and automation strategies.",
      readTime: 16,
      image: blogCompliance,
      link: "/resources/casl-compliance-real-estate-email-marketing-canada",
    },
    {
      categoryKey: "resourcesPage.categories.marketing",
      icon: BookOpen,
      title: "Calgary Real Estate Marketing Strategies: AI Tools for Alberta Agents in 2026",
      excerpt: "Calgary's market is unique. Oil economy, suburban sprawl, and -30°C winters require specialized strategies. Learn 7 AI-powered tactics Calgary agents use to dominate—even in winter.",
      readTime: 13,
      image: blogAI,
      link: "/resources/calgary-real-estate-marketing-strategies",
    },
    {
      categoryKey: "resourcesPage.categories.aiTech",
      icon: TrendingUp,
      title: "Voice AI for Real Estate Lead Follow-Up: How Canadian Agents Close More Deals",
      excerpt: "Voice AI makes 100+ calls per day, qualifies leads, books appointments, and sounds human. See how Canadian agents use AI to follow up instantly and close 3x more deals with 9,131% ROI.",
      readTime: 14,
      image: blogAI,
      link: "/resources/voice-ai-real-estate-lead-follow-up-canada",
    },
    {
      categoryKey: "resourcesPage.categories.aiTech",
      icon: TrendingUp,
      title: "AI Chatbot for Real Estate Websites in Canada: Complete 2025 Implementation Guide",
      excerpt: "67% of leads come after 6 PM. Learn how AI chatbots capture and qualify leads 24/7 with sub-3-second response times, 391% higher conversions, and PIPEDA/CASL compliance.",
      readTime: 15,
      image: blogAI,
      link: "/blog/ai-chatbot-real-estate-websites-canada",
    },
    {
      categoryKey: "resourcesPage.categories.aiTech",
      icon: TrendingUp,
      titleKey: "resourcesPage.articles.aiTransformation.title",
      excerptKey: "resourcesPage.articles.aiTransformation.excerpt",
      readTime: 8,
      image: blogAI,
      link: "/blog/ai-transformation",
    },
    {
      categoryKey: "resourcesPage.categories.canadianMarket",
      icon: Award,
      titleKey: "resourcesPage.articles.creaDdf.title",
      excerptKey: "resourcesPage.articles.creaDdf.excerpt",
      readTime: 12,
      image: blogCREA,
      link: "/blog/crea-ddf",
    },
    {
      categoryKey: "resourcesPage.categories.compliance",
      icon: FileText,
      titleKey: "resourcesPage.articles.compliance.title",
      excerptKey: "resourcesPage.articles.compliance.excerpt",
      readTime: 10,
      image: blogCompliance,
      link: "/blog/compliance",
    },
    {
      categoryKey: "resourcesPage.categories.marketing",
      icon: BookOpen,
      titleKey: "resourcesPage.articles.leadConversion.title",
      excerptKey: "resourcesPage.articles.leadConversion.excerpt",
      readTime: 7,
      image: blogLeads,
      link: "/blog/lead-conversion",
    },
    {
      categoryKey: "resourcesPage.categories.marketing",
      icon: BookOpen,
      titleKey: "resourcesPage.articles.bilingual.title",
      excerptKey: "resourcesPage.articles.bilingual.excerpt",
      readTime: 9,
      image: blogBilingual,
      link: "/blog/bilingual-marketing",
    },
    {
      categoryKey: "resourcesPage.categories.successStories",
      icon: Award,
      titleKey: "resourcesPage.articles.successStory.title",
      excerptKey: "resourcesPage.articles.successStory.excerpt",
      readTime: 6,
      image: blogSuccess,
      link: "/blog/success-story",
    },
    {
      categoryKey: "resourcesPage.categories.comparison",
      icon: GitCompare,
      title: "RealtorDesk AI vs kvCORE: Which CRM Wins for Canadian Agents in 2025?",
      excerpt: "Canadian agents compare RealtorDesk AI vs kvCORE. See pricing, features, PIPEDA compliance, and why 73% of switchers choose AI-first platforms.",
      readTime: 12,
      image: blogAI,
      link: "/blog/vs-kvcore",
    },
    {
      categoryKey: "resourcesPage.categories.comparison",
      icon: GitCompare,
      title: "RealtorDesk AI vs Follow Up Boss: Speed vs Features",
      excerpt: "Follow Up Boss costs $810 CAD/month for a team of 5. RealtorDesk AI costs $299 CAD—and responds 98% faster. See the complete comparison.",
      readTime: 10,
      image: blogLeads,
      link: "/blog/vs-follow-up-boss",
    },
    {
      categoryKey: "resourcesPage.categories.comparison",
      icon: GitCompare,
      title: "IXACT Contact Alternatives: Why Canadian Agents Are Switching to AI",
      excerpt: "IXACT Contact hasn't had a major update since 2019. Discover the top 5 modern alternatives with AI automation, Canadian compliance, and better ROI.",
      readTime: 11,
      image: blogCompliance,
      link: "/blog/ixact-alternatives",
    },
    {
      categoryKey: "resourcesPage.categories.comparison",
      icon: Award,
      title: "Best CRM for Canadian Real Estate Agents in 2025",
      excerpt: "Complete comparison of the top 10 CRMs for Canadian agents. Features, pricing, PIPEDA compliance, AI capabilities, and real-world testing results.",
      readTime: 15,
      image: blogAI,
      link: "/blog/best-crm-canada-2025",
    },
    {
      categoryKey: "resourcesPage.categories.aiTech",
      icon: TrendingUp,
      title: "AI CRM vs Traditional Real Estate CRM: ROI Analysis",
      excerpt: "Data-driven comparison showing why AI CRMs deliver 9,543% ROI. Response times, conversion rates, costs, and real performance data from 100 agents.",
      readTime: 12,
      image: blogLeads,
      link: "/blog/ai-vs-traditional-crm",
    },
    {
      categoryKey: "resourcesPage.categories.comparison",
      icon: GitCompare,
      title: "Lofty CRM vs RealtorDesk AI: Why Simplicity Beats Feature Bloat",
      excerpt: "Lofty has 237 features. You'll use 12. RealtorDesk AI has 8 core features. You'll use all 8. See why feature bloat doesn't equal better results.",
      readTime: 12,
      image: blogAI,
      link: "/blog/vs-lofty-crm",
    },
    {
      categoryKey: "resourcesPage.categories.comparison",
      icon: GitCompare,
      title: "BoomTown Alternative for Canada: PIPEDA-Compliant Options",
      excerpt: "BoomTown costs $1,350-2,700 CAD/month. Canadian agents can get better results for under $300 CAD/month. Top 5 alternatives compared.",
      readTime: 10,
      image: blogCompliance,
      link: "/blog/boomtown-alternative-canada",
    },
    {
      categoryKey: "resourcesPage.categories.comparison",
      icon: GitCompare,
      title: "Propertybase vs RealtorDesk AI: Enterprise vs Agile",
      excerpt: "Propertybase brings Salesforce power—and complexity. See why 95% of Canadian teams choose agile over enterprise. Save $203,236 over 3 years.",
      readTime: 9,
      image: blogLeads,
      link: "/blog/vs-propertybase",
    },
  ];

  const categoryKeys = [
    "resourcesPage.categories.all",
    "resourcesPage.categories.aiTech",
    "resourcesPage.categories.canadianMarket",
    "resourcesPage.categories.marketing",
    "resourcesPage.categories.compliance",
    "resourcesPage.categories.successStories",
    "resourcesPage.categories.comparison"
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
                  alt={article.title || t(article.titleKey)}
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
                    {article.title || t(article.titleKey)}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed">
                    {article.excerpt || t(article.excerptKey)}
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