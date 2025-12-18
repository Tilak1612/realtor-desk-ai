import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionContextType {
  subscribed: boolean;
  productId: string | null;
  priceId: string | null;
  subscriptionEnd: string | null;
  loading: boolean;
  refreshSubscription: () => Promise<void>;
  subscriptionTier: 'trial' | 'agent' | 'team' | null;
  trialDaysLeft: number;
  trialExpired: boolean;
  trialEndsAt: string | null;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SUBSCRIPTION_PRODUCTS = {
  agent: {
    monthly_price_id: 'price_1SXpyiS23MQcIdnrAphs809v',
    yearly_price_id: 'price_1SXpzKS23MQcIdnrfH2rHhow',
    monthly_product_id: 'prod_TUpecsjMV6TaBw',
    yearly_product_id: 'prod_TUpevCKNFOGwCq',
    name: 'Agent Plan',
    yearlyPrice: 999,
    monthlyPrice: 149,
  },
  team: {
    monthly_price_id: 'price_1SXpz0S23MQcIdnrrD0UGqa5',
    yearly_price_id: 'price_1SXpzZS23MQcIdnrVVyUShLT',
    monthly_product_id: 'prod_TUpeTIPjzjd64Z',
    yearly_product_id: 'prod_TUpeobzrNh5RNk',
    name: 'Team Plan',
    yearlyPrice: 2997,
    monthlyPrice: 299,
  },
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [priceId, setPriceId] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);

  const calculateTrialDaysLeft = (trialEndDate: string | null): number => {
    if (!trialEndDate) return 0;
    const endDate = new Date(trialEndDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const trialDaysLeft = calculateTrialDaysLeft(trialEndsAt);
  const trialExpired = !subscribed && trialDaysLeft <= 0 && trialEndsAt !== null;

  const getSubscriptionTier = (): 'trial' | 'agent' | 'team' | null => {
    if (!subscribed) return 'trial';
    if (productId === SUBSCRIPTION_PRODUCTS.agent.monthly_product_id || 
        productId === SUBSCRIPTION_PRODUCTS.agent.yearly_product_id) return 'agent';
    if (productId === SUBSCRIPTION_PRODUCTS.team.monthly_product_id || 
        productId === SUBSCRIPTION_PRODUCTS.team.yearly_product_id) return 'team';
    return null;
  };

  const refreshSubscription = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Skip subscription check on public pages when not logged in
      if (!session) {
        setSubscribed(false);
        setProductId(null);
        setPriceId(null);
        setSubscriptionEnd(null);
        setTrialEndsAt(null);
        setLoading(false);
        return;
      }

      // Fetch trial_ends_at from profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('trial_ends_at')
        .eq('id', session.user.id)
        .single();

      if (profileData?.trial_ends_at) {
        setTrialEndsAt(profileData.trial_ends_at);
      }

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      // Silently handle errors on public pages
      if (error) {
        console.warn('Subscription check failed:', error);
        setSubscribed(false);
        setProductId(null);
        setPriceId(null);
        setSubscriptionEnd(null);
        setLoading(false);
        return;
      }

      setSubscribed(data.subscribed || false);
      setProductId(data.product_id || null);
      setPriceId(data.price_id || null);
      setSubscriptionEnd(data.subscription_end || null);
    } catch (error) {
      console.warn('Subscription check error:', error);
      setSubscribed(false);
      setProductId(null);
      setPriceId(null);
      setSubscriptionEnd(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSubscription();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        refreshSubscription();
      } else if (event === 'SIGNED_OUT') {
        setSubscribed(false);
        setProductId(null);
        setPriceId(null);
        setSubscriptionEnd(null);
        setTrialEndsAt(null);
      }
    });

    // Refresh subscription status every minute
    const interval = setInterval(refreshSubscription, 60000);

    return () => {
      authListener.subscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        subscribed,
        productId,
        priceId,
        subscriptionEnd,
        loading,
        refreshSubscription,
        subscriptionTier: getSubscriptionTier(),
        trialDaysLeft,
        trialExpired,
        trialEndsAt,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
