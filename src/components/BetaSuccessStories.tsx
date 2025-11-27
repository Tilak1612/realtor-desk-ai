import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { TrendingUp, Clock, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const BetaSuccessStories = () => {
  const { t } = useTranslation();
  const stories = [
    {
      name: "Sarah M.",
      location: "Toronto",
      brokerage: t('betaCommunity.testimonials.sarah.brokerage'),
      avatar: "SM",
      quote: t('betaCommunity.testimonials.sarah.quote'),
      metrics: [
        { value: "23", label: t('betaCommunity.testimonials.sarah.stats.leads') },
        { value: "8", label: t('betaCommunity.testimonials.sarah.stats.showings') },
        { value: "2", label: t('betaCommunity.testimonials.sarah.stats.deals') }
      ],
      badge: t('betaCommunity.testimonials.sarah.badge')
    },
    {
      name: "Marc D.",
      location: "Montreal",
      brokerage: t('betaCommunity.testimonials.marc.brokerage'),
      avatar: "MD",
      quote: t('betaCommunity.testimonials.marc.quote'),
      metrics: [
        { value: "40%", label: t('betaCommunity.testimonials.marc.stats.increase') },
        { value: "100%", label: t('betaCommunity.testimonials.marc.stats.response') },
        { value: "15", label: t('betaCommunity.testimonials.marc.stats.saved') }
      ],
      badge: t('betaCommunity.testimonials.marc.badge')
    },
    {
      name: "Jennifer K.",
      location: "Calgary",
      brokerage: t('betaCommunity.testimonials.jennifer.brokerage'),
      avatar: "JK",
      quote: t('betaCommunity.testimonials.jennifer.quote'),
      metrics: [
        { value: "<30s", label: t('betaCommunity.testimonials.jennifer.stats.responseTime') },
        { value: "45%", label: t('betaCommunity.testimonials.jennifer.stats.leadIncrease') },
        { value: "12", label: t('betaCommunity.testimonials.jennifer.stats.additionalDeals') }
      ],
      badge: t('betaCommunity.testimonials.jennifer.badge')
    }
  ];

  return (
    <section className="section-padding bg-background border-y">
      <div className="container-custom">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold">{t('betaCommunity.resultsTitle')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t('betaCommunity.resultsSubtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {stories.map((story, index) => (
            <Card 
              key={index} 
              className="p-6 hover:shadow-xl transition-all duration-300 flex flex-col"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header with Avatar */}
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-14 h-14">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                    {story.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{story.name}</h3>
                  <p className="text-sm text-muted-foreground">{story.location}</p>
                  <p className="text-xs text-muted-foreground">{story.brokerage}</p>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-sm text-muted-foreground mb-6 leading-relaxed flex-grow">
                "{story.quote}"
              </blockquote>

              {/* Metrics */}
              <div className="space-y-3 mb-4">
                {story.metrics.map((metric, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-primary">{metric.value}</span>
                      <span className="text-xs text-muted-foreground ml-1">{metric.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Badge */}
              <Badge variant="secondary" className="text-xs bg-accent/10 text-accent hover:bg-accent/20">
                {story.badge}
              </Badge>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            {t('betaCommunity.ctaTitle')}
          </h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            {t('betaCommunity.ctaSubtitle')}
          </p>
          <Link to="/signup">
            <Button size="lg" className="btn-gradient text-lg">
              {t('betaCommunity.ctaButton')}
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-6">
            {t('betaCommunity.ctaNote')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default BetaSuccessStories;
