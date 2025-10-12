import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, FileText, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

const Resources = () => {
  const { t } = useTranslation();
  const articles = [
    {
      category: "AI & Technology",
      icon: TrendingUp,
      title: "How AI Is Transforming Canadian Real Estate in 2025",
      excerpt: "Discover the latest AI innovations revolutionizing how Canadian realtors work, from predictive analytics to automated transaction management.",
      readTime: "8 min read",
    },
    {
      category: "Canadian Market",
      icon: Award,
      title: "The Complete Guide to CREA DDF® Integration",
      excerpt: "Everything you need to know about accessing national MLS data and integrating CREA DDF® into your real estate workflow.",
      readTime: "12 min read",
    },
    {
      category: "Compliance",
      icon: FileText,
      title: "Provincial Compliance Checklist: ON, BC, AB, QC",
      excerpt: "Stay compliant with regulations across Canada. A comprehensive guide to RECO, BCFSA, RECA, and AMF requirements.",
      readTime: "10 min read",
    },
    {
      category: "Marketing",
      icon: BookOpen,
      title: "10 Ways to Increase Lead Conversion with Predictive Analytics",
      excerpt: "Learn how AI-powered lead scoring and predictive analytics can increase your conversion rate from 5% to 18%.",
      readTime: "7 min read",
    },
    {
      category: "Marketing",
      icon: BookOpen,
      title: "Bilingual Real Estate Marketing: Beyond Translation",
      excerpt: "Master the art of true bilingual marketing for Canadian markets. It's not just about translation - it's about cultural communication.",
      readTime: "9 min read",
    },
    {
      category: "Success Stories",
      icon: Award,
      title: "How Sarah Chen Closed 14 Extra Deals in Q1 with AI",
      excerpt: "A Toronto agent's journey from traditional CRM to AI-powered success. Real numbers, real results, real transformation.",
      readTime: "6 min read",
    },
  ];

  const categories = ["All Articles", "AI & Technology", "Canadian Market", "Marketing", "Compliance", "Success Stories"];

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
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All Articles" ? "default" : "outline"}
                className={category === "All Articles" ? "btn-gradient" : ""}
              >
                {category}
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
                {/* Category Badge */}
                <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <article.icon className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                      {article.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 line-clamp-2">{article.title}</h3>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{article.readTime}</span>
                    <Button variant="link" className="text-primary font-semibold p-0">
                      Read More →
                    </Button>
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
          <h2 className="mb-4 text-white">Get Weekly Insights Delivered to Your Inbox</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join 2,000+ Canadian realtors receiving actionable AI and real estate tips every week
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
            />
            <Button type="submit" variant="secondary" size="lg" className="whitespace-nowrap">
              Subscribe
            </Button>
          </form>

          <p className="text-sm text-white/70 mt-4">
            No spam. Unsubscribe anytime. Privacy policy.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;
