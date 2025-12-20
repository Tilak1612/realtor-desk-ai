import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Crown, ArrowRight, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TrialBannerProps {
  daysLeft: number;
}

const TrialBanner = ({ daysLeft }: TrialBannerProps) => {
  const { t } = useTranslation();

  // Determine urgency level and styling
  const getUrgencyConfig = () => {
    if (daysLeft <= 1) {
      return {
        bgClass: "bg-gradient-to-r from-destructive/20 to-destructive/10 border-destructive/40",
        iconClass: "text-destructive",
        icon: AlertTriangle,
        textClass: "text-destructive",
      };
    } else if (daysLeft <= 3) {
      return {
        bgClass: "bg-gradient-to-r from-yellow-500/20 to-orange-500/10 border-yellow-500/40",
        iconClass: "text-yellow-500",
        icon: AlertTriangle,
        textClass: "text-yellow-600 dark:text-yellow-400",
      };
    } else if (daysLeft <= 7) {
      return {
        bgClass: "bg-gradient-to-r from-orange-500/15 to-yellow-500/10 border-orange-500/30",
        iconClass: "text-orange-500",
        icon: Clock,
        textClass: "text-orange-600 dark:text-orange-400",
      };
    }
    return {
      bgClass: "bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20",
      iconClass: "text-primary",
      icon: Crown,
      textClass: "text-foreground",
    };
  };

  const config = getUrgencyConfig();
  const Icon = config.icon;

  const getTrialMessage = () => {
    if (daysLeft === 0) {
      return t('trial.expirestoday', 'Your trial expires today!');
    } else if (daysLeft === 1) {
      return t('trial.oneDay', '1 day remaining in your free trial');
    }
    return t('trial.daysRemaining', '{{count}} days remaining in your free trial').replace('{{count}}', String(daysLeft));
  };

  return (
    <Card className={cn("p-4 border-2", config.bgClass)}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-full bg-background/50", config.iconClass)}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className={cn("font-semibold", config.textClass)}>
              {getTrialMessage()}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('trial.upgradeMessage', 'Upgrade now to keep all your data and unlock premium features')}
            </p>
          </div>
        </div>
        <Link to="/billing">
          <Button 
            size="sm"
            className={cn(
              "btn-gradient h-8 text-xs",
              daysLeft <= 3 && "animate-pulse"
            )}
          >
            {t('trial.upgradeNow', 'Upgrade Now')} <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default TrialBanner;
