import { Navigate, useLocation } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";

// Card-at-signup gate.
//
// The database hands every new profile a 14-day trial for free:
//   trial_ends_at DEFAULT now() + 14 days, subscription_status DEFAULT 'trial'
// so before this gate existed a user could sign up and use the product for
// two weeks without ever seeing a payment form, and nothing charged them on
// day 14 because Stripe had never heard of them.
//
// Access now requires a real Stripe subscription. create-checkout collects the
// card up front and sets trial_period_days: 14, so the customer is billed
// automatically when the trial ends unless they cancel first.
//
// `subscribed` is true for trialing/active/past_due — see check-subscription.
// It is NOT true for the bare DB trial, which is the whole point.
export default function RequireBilling({ children }: { children: JSX.Element }) {
  const { subscribed, loading } = useSubscription();
  const location = useLocation();

  // Never redirect while the check is in flight. check-subscription soft-fails
  // to { subscribed: false } on transient errors, so bouncing early would kick
  // paying customers out to checkout on a blip.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!subscribed) {
    // `from` lets Billing send the user back where they were headed once
    // checkout completes.
    return <Navigate to="/billing?required=1" replace state={{ from: location.pathname }} />;
  }

  return children;
}
