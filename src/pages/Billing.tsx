import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Check, Loader2, CreditCard, Calendar, Crown } from 'lucide-react';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useSubscription, SUBSCRIPTION_PRODUCTS } from '@/contexts/SubscriptionContext';

const Billing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [isYearly, setIsYearly] = useState(false); // Default to monthly
  
  const { subscribed, productId, subscriptionEnd, refreshSubscription, subscriptionTier, loading: subscriptionLoading } = useSubscription();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }

        setUser(session.user);

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setProfile(profileData);
      } catch (error: any) {
        // Error silently handled
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Check for success parameter
    if (searchParams.get('success') === 'true') {
      toast.success('Subscription activated successfully!');
      refreshSubscription();
      // Remove the success parameter from URL
      navigate('/app/billing', { replace: true });
    }
  }, [navigate, searchParams, refreshSubscription]);

  const handleCheckout = async (priceId: string) => {
    setCheckoutLoading(priceId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to start checkout');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to open billing portal');
    } finally {
      setPortalLoading(false);
    }
  };

  const getTrialDaysLeft = () => {
    if (!profile?.trial_ends_at) return 0;
    const endDate = new Date(profile.trial_ends_at);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (loading || subscriptionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar trialDaysLeft={getTrialDaysLeft()} />
      
      <div className="flex-1 lg:ml-0">
        <DashboardNavbar user={user} profile={profile} />
        
        <main className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
          <div>
            <h1 className="text-xl font-semibold mb-1">Billing & Subscription</h1>
            <p className="text-muted-foreground">Manage your subscription and billing details</p>
          </div>

          {/* Current Status Card */}
          {!subscribed && (
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-primary" />
                      Trial Account
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {getTrialDaysLeft()} days left in your free trial
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-primary border-primary">
                    Trial
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Upgrade now to unlock unlimited access and continue growing your business with AI-powered CRM.
                </p>
              </CardContent>
            </Card>
          )}

          {subscribed && (
            <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-accent" />
                      {subscriptionTier === 'agent' ? 'Agent Plan' : 'Team Plan'}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Your subscription is active
                    </CardDescription>
                  </div>
                  <Badge variant="default" className="bg-accent">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Next billing date: {subscriptionEnd ? new Date(subscriptionEnd).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <Button 
                  onClick={handleManageBilling} 
                  disabled={portalLoading}
                  className="w-full"
                  variant="outline"
                >
                  {portalLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Opening...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Manage Billing
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Billing Period Toggle */}
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-lg font-semibold">Select Billing Period</h3>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Monthly
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsYearly(!isYearly)}
                  className="relative w-14 h-8 rounded-full p-0 border-2"
                >
                  <div className={`absolute w-6 h-6 rounded-full bg-primary transition-transform ${isYearly ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </Button>
                <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Yearly
                </span>
                {isYearly && (
                  <Badge variant="secondary" className="text-accent font-semibold">
                    Save up to $789/year
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground text-center max-w-md">
                {isYearly 
                  ? '🎉 Founding Member Special: Lock in $999/year pricing until Dec 31, 2025!' 
                  : 'Switch to yearly billing to save hundreds and get Founding Member pricing'}
              </p>
            </div>
          </Card>

          {/* Plan Comparison */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {subscribed ? 'Available Plans' : 'Choose Your Plan'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Agent Plan */}
              <Card className={`${
                subscriptionTier === 'agent' 
                  ? 'border-2 border-accent shadow-lg' 
                  : ''
              }`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Agent Plan</CardTitle>
                    {subscriptionTier === 'agent' && (
                      <Badge variant="default" className="bg-accent">Current</Badge>
                    )}
                  </div>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      ${isYearly ? SUBSCRIPTION_PRODUCTS.agent.yearlyPrice : SUBSCRIPTION_PRODUCTS.agent.monthlyPrice}
                    </span>
                    <span className="text-muted-foreground">/{isYearly ? 'year' : 'month'}</span>
                  </div>
                  {isYearly && (
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-accent font-semibold">
                        🎉 Founding Member Price - Save $789/year
                      </Badge>
                    </div>
                  )}
                  <CardDescription className="mt-2">
                    Perfect for individual agents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Unlimited contacts & leads</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">AI-powered predictive CRM</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">24/7 AI chatbot</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Email & SMS automation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Mobile app included</span>
                    </li>
                  </ul>
                  {subscriptionTier !== 'agent' && (
                    <Button 
                      onClick={() => handleCheckout(isYearly ? SUBSCRIPTION_PRODUCTS.agent.yearly_price_id : SUBSCRIPTION_PRODUCTS.agent.monthly_price_id)}
                      disabled={checkoutLoading !== null}
                      className="w-full"
                    >
                      {checkoutLoading === (isYearly ? SUBSCRIPTION_PRODUCTS.agent.yearly_price_id : SUBSCRIPTION_PRODUCTS.agent.monthly_price_id) ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        subscribed ? 'Switch to Agent' : 'Upgrade to Agent'
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Team Plan */}
              <Card className={`${
                subscriptionTier === 'team' 
                  ? 'border-2 border-accent shadow-lg' 
                  : 'border-2 border-primary/20'
              }`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Team Plan</CardTitle>
                    {subscriptionTier === 'team' ? (
                      <Badge variant="default" className="bg-accent">Current</Badge>
                    ) : (
                      <Badge variant="secondary">Most Popular</Badge>
                    )}
                  </div>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      ${isYearly ? SUBSCRIPTION_PRODUCTS.team.yearlyPrice : SUBSCRIPTION_PRODUCTS.team.monthlyPrice}
                    </span>
                    <span className="text-muted-foreground">/{isYearly ? 'year' : 'month'}</span>
                  </div>
                  {isYearly && (
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-accent font-semibold">
                        Save $591/year with annual billing
                      </Badge>
                    </div>
                  )}
                  <CardDescription className="mt-2">
                    For growing teams of 2-5 agents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Everything in Agent, plus:</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Team collaboration tools</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Lead distribution & routing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Advanced reporting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Dedicated account manager</span>
                    </li>
                  </ul>
                  {subscriptionTier !== 'team' && (
                    <Button 
                      onClick={() => handleCheckout(isYearly ? SUBSCRIPTION_PRODUCTS.team.yearly_price_id : SUBSCRIPTION_PRODUCTS.team.monthly_price_id)}
                      disabled={checkoutLoading !== null}
                      className="w-full"
                    >
                      {checkoutLoading === (isYearly ? SUBSCRIPTION_PRODUCTS.team.yearly_price_id : SUBSCRIPTION_PRODUCTS.team.monthly_price_id) ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        subscribed ? 'Upgrade to Team' : 'Upgrade to Team'
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Billing;
