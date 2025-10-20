import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Inbox, TrendingUp, Bell, MessageSquare, Zap } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.jpg";
import { useTranslation } from "react-i18next";

const UnifiedDashboardSection = () => {
  const { t } = useTranslation();
  return (
    <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container-custom">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="mb-4">{t('dashboard.title')}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Dashboard Screenshot with Callouts */}
        <div className="relative max-w-6xl mx-auto mb-12">
          <img
            src={heroDashboard}
            alt="Realtor Desk AI Unified Dashboard"
            className="w-full rounded-2xl shadow-2xl"
          />
          
          {/* Floating Callout Badges */}
          <Badge className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm text-foreground shadow-lg flex items-center gap-2 py-2 px-4">
            <Inbox className="w-4 h-4 text-primary" />
            <span className="text-sm">Unified Inbox</span>
          </Badge>
          
          <Badge className="absolute top-1/3 right-4 bg-background/95 backdrop-blur-sm text-foreground shadow-lg flex items-center gap-2 py-2 px-4">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-sm">AI Lead Scoring</span>
          </Badge>
          
          <Badge className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm text-foreground shadow-lg flex items-center gap-2 py-2 px-4">
            <Bell className="w-4 h-4 text-accent" />
            <span className="text-sm">Real-time Alerts</span>
          </Badge>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          <Card className="p-6 text-center card-hover">
            <MessageSquare className="w-10 h-10 text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{t('dashboard.feature1')}</p>
          </Card>

          <Card className="p-6 text-center card-hover">
            <TrendingUp className="w-10 h-10 text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{t('dashboard.feature2')}</p>
          </Card>

          <Card className="p-6 text-center card-hover">
            <Bell className="w-10 h-10 text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{t('dashboard.feature3')}</p>
          </Card>

          <Card className="p-6 text-center card-hover">
            <Zap className="w-10 h-10 text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{t('dashboard.feature4')}</p>
          </Card>

          <Card className="p-6 text-center card-hover">
            <TrendingUp className="w-10 h-10 text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{t('dashboard.feature5')}</p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default UnifiedDashboardSection;
