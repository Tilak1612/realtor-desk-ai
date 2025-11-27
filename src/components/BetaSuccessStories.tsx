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
      brokerage: "Independent Agent",
      avatar: "SM",
      quote: "I was skeptical about AI, but after the first week, I had 3 showings booked while I was sleeping. The voice agent sounds natural and captures all the details I need.",
      metrics: [
        { value: "23", label: "leads captured in first month" },
        { value: "8", label: "showings booked automatically" },
        { value: "2", label: "deals closed" }
      ],
      badge: "Beta Participant Since Nov 2024"
    },
    {
      name: "Marc D.",
      location: "Montreal",
      brokerage: "Century 21",
      avatar: "MD",
      quote: "The seamless English/French switching is perfect for Montreal. My AI handles both languages naturally, which has opened up my market significantly.",
      metrics: [
        { value: "40%", label: "increase in francophone leads" },
        { value: "100%", label: "of inquiries answered <2 minutes" },
        { value: "15", label: "hours/week saved" }
      ],
      badge: "Beta Participant Since Dec 2024"
    },
    {
      name: "Jennifer K.",
      location: "Calgary",
      brokerage: "RE/MAX Team Lead",
      avatar: "JK",
      quote: "Our team of 5 agents now operates like a team of 15. The unified dashboard means no lead falls through the cracks, even when we're all busy.",
      metrics: [
        { value: "<30s", label: "Team response time" },
        { value: "45%", label: "increase in qualified leads" },
        { value: "12", label: "additional deals in Q1" }
      ],
      badge: "Beta Participant Since Jan 2025"
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
