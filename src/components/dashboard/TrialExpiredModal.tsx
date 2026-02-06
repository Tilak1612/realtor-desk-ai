import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Check, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { SUBSCRIPTION_PRODUCTS } from "@/contexts/SubscriptionContext";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

interface TrialExpiredModalProps {
  isOpen: boolean;
}

const TrialExpiredModal = ({ isOpen }: TrialExpiredModalProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string, planName: string) => {
    setLoading(planName);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: unknown) {
      toast.error(error.message || 'Failed to start checkout');
    } finally {
      setLoading(null);
    }
  };

  const features = [
    t('trial.feature.unlimitedContacts', 'Unlimited contacts & leads'),
    t('trial.feature.aiLeadScoring', 'AI-powered lead scoring'),
    t('trial.feature.emailAutomation', 'Email automation'),
    t('trial.feature.dealPipeline', 'Deal pipeline management'),
    t('trial.feature.marketInsights', 'Market insights & analytics'),
    t('trial.feature.prioritySupport', 'Priority support'),
  ];

  return (
    <Dialog open={isOpen} modal>
      <DialogContent 
        className="sm:max-w-2xl [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-destructive/10 w-fit">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <DialogTitle className="text-2xl">
            {t('trial.expired.title', 'Your Free Trial Has Ended')}
          </DialogTitle>
          <DialogDescription className="text-base">
            {t('trial.expired.description', 'Subscribe now to continue using Realtor Desk and keep all your data')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Monthly Plan */}
          <Card className="p-5 border-2 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">{t('trial.monthly', 'Monthly')}</h3>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-accent">${SUBSCRIPTION_PRODUCTS.agent.monthlyPrice}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleSubscribe(SUBSCRIPTION_PRODUCTS.agent.monthly_price_id, 'monthly')}
              disabled={loading !== null}
            >
              {loading === 'monthly' ? t('common.loading', 'Loading...') : t('trial.subscribeMonthly', 'Subscribe Monthly')}
            </Button>
          </Card>

          {/* Yearly Plan */}
          <Card className="p-5 border-2 border-primary/30 bg-primary/5 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
              {t('trial.savePercent', 'Save 44%')}
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">{t('trial.yearly', 'Yearly')}</h3>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-accent">${Math.round(SUBSCRIPTION_PRODUCTS.agent.yearlyPrice / 12)}</span>
              <span className="text-muted-foreground">/month</span>
              <p className="text-sm text-muted-foreground mt-1">
                {t('trial.billedYearly', 'Billed annually at ${{price}}').replace('{{price}}', String(SUBSCRIPTION_PRODUCTS.agent.yearlyPrice))}
              </p>
            </div>
            <Button 
              className="w-full btn-gradient"
              onClick={() => handleSubscribe(SUBSCRIPTION_PRODUCTS.agent.yearly_price_id, 'yearly')}
              disabled={loading !== null}
            >
              {loading === 'yearly' ? t('common.loading', 'Loading...') : t('trial.subscribeYearly', 'Subscribe Yearly')}
            </Button>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="font-medium mb-3">{t('trial.includesFeatures', 'All plans include:')}</p>
          <div className="grid grid-cols-2 gap-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-accent shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          {t('trial.guarantee', '30-day money-back guarantee • Cancel anytime')}
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default TrialExpiredModal;
