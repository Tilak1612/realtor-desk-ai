/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { STRIPE_PRICES, STRIPE_PRODUCTS } from "@/config/stripe";
import { supabase } from '@/integrations/supabase/client';
import { trackEvent } from '@/utils/analytics';

interface SubscriptionContextType {
  subscribed: boolean;
  /**
   * True when the last check could not determine subscription state (network
   * error, gateway 5xx, Stripe down). Distinct from `subscribed === false`,
   * which means we asked and the answer was no. Guards must not evict on
   * "unknown" -- doing so logs paying customers out to the billing wall on
   * any transient blip.
   */
  subscriptionUnknown: boolean;
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
    monthly_price_id: STRIPE_PRICES.solo.monthly,
    yearly_price_id: STRIPE_PRICES.solo.yearly,
    monthly_product_id: STRIPE_PRODUCTS.solo,
    yearly_product_id: STRIPE_PRODUCTS.solo,
    name: 'Solo Plan',
    yearlyPrice: 999,
    monthlyPrice: 149,
  },
  team: {
    monthly_price_id: STRIPE_PRICES.team.monthly,
    yearly_price_id: STRIPE_PRICES.team.yearly,
    monthly_product_id: STRIPE_PRODUCTS.team,
    yearly_product_id: STRIPE_PRODUCTS.team,
    name: 'Team Plan',
    yearlyPrice: 2997,
    monthlyPrice: 299,
  },
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionUnknown, setSubscriptionUnknown] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [priceId, setPriceId] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);
  const prevSubscribedRef = useRef<boolean | null>(null);

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
        setSubscriptionUnknown(false); // no session is a definite answer
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

      // Don't pin session.access_token into an explicit Authorization header.
      // getSession() returns the cached session, which may be past its 1-hour
      // expiry — that stale token was what caused ~50% of check-subscription
      // calls to 401 at the gateway. Let the SDK attach the current token
      // itself so it benefits from autoRefreshToken.
      const { data, error } = await supabase.functions.invoke('check-subscription');

      // Silently handle errors on public pages
      if (error) {
        // Transient failure: we do not know. Leave `subscribed` at its last
        // known value and flag the uncertainty so RequireBilling holds instead
        // of redirecting. Previously this set subscribed=false, which meant a
        // single 5xx from Stripe or the gateway bounced every paying customer
        // to /billing.
        console.warn('Subscription check failed:', error);
        setSubscriptionUnknown(true);
        setLoading(false);
        return;
      }

      const newSubscribed = data?.subscribed || false;
      setSubscriptionUnknown(false); // got a definitive answer
      if (prevSubscribedRef.current !== null && prevSubscribedRef.current !== newSubscribed) {
        trackEvent('subscription_status_changed', {
          subscribed: newSubscribed,
          product_id: data.product_id || null,
        });
      }
      prevSubscribedRef.current = newSubscribed;
      setSubscribed(newSubscribed);
      setProductId(data.product_id || null);
      setPriceId(data.price_id || null);
      setSubscriptionEnd(data.subscription_end || null);
    } catch (error) {
      // Same reasoning as the `error` branch above: unknown, not "no".
      console.warn('Subscription check error:', error);
      setSubscriptionUnknown(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let lastCheckTime = 0;
    const MIN_CHECK_INTERVAL = 30000; // 30s minimum between checks

    const throttledRefresh = async () => {
      const now = Date.now();
      if (now - lastCheckTime < MIN_CHECK_INTERVAL) return;
      lastCheckTime = now;
      await refreshSubscription();
    };

    throttledRefresh();

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        // Small delay to avoid burst with initial load
        setTimeout(throttledRefresh, 2000);
      } else if (event === 'SIGNED_OUT') {
        setSubscribed(false);
        setProductId(null);
        setPriceId(null);
        setSubscriptionEnd(null);
        setTrialEndsAt(null);
      }
      // Skip TOKEN_REFRESHED to reduce Stripe API calls
    });

    // Refresh every 5 minutes instead of every minute
    const interval = setInterval(throttledRefresh, 300000);

    return () => {
      authListener.subscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        subscribed,
        subscriptionUnknown,
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
