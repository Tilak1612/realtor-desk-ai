import { useTranslation } from "react-i18next";
import { CreditCard } from "lucide-react";
import {
  TRIAL_PERIOD_DAYS,
  LOWEST_MONTHLY_CAD,
  formatBillingDate,
  formatCad,
  projectedFirstChargeDate,
} from "@/config/billing";

// Billing transparency block, rendered directly under the signup CTA.
//
// Every number here is derived, never hardcoded in markup: the trial length
// mirrors the server constant (guarded by a contract test), the amount comes
// from the published plan table, and the date is computed at render in the
// visitor's timezone.
//
// The framing is deliberately conditional. Signup creates an account; it does
// not collect a card and does not start a trial. Saying "your first charge is
// 28 August" would be false — no plan is chosen and no trial is running. So
// this says what WOULD happen if the trial were started today, and names the
// next step explicitly.

export function BillingDisclosure() {
  const { t, i18n } = useTranslation();
  const chargeDate = formatBillingDate(projectedFirstChargeDate(), i18n.language);
  const amount = formatCad(LOWEST_MONTHLY_CAD, i18n.language);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5 text-left">
      <div className="flex items-start gap-2.5">
        <CreditCard className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet-300" aria-hidden="true" />
        <div className="space-y-1.5 text-xs leading-relaxed text-gray-300">
          <p className="font-semibold text-white">
            {t("auth.signup.billing.today", "You are not charged today.")}
          </p>
          <p>
            {t(
              "auth.signup.billing.next",
              "On the next step you choose a plan and enter a card through Stripe-hosted checkout. Your {{days}}-day free trial starts then.",
              { days: TRIAL_PERIOD_DAYS },
            )}
          </p>
          <p>
            {t(
              "auth.signup.billing.after",
              "Plans start at {{amount}}/month {{currency}}. If you started your trial today, your first charge would be {{date}}. Cancel any time before then from Billing and you pay nothing.",
              { amount, currency: "CAD", date: chargeDate },
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BillingDisclosure;
