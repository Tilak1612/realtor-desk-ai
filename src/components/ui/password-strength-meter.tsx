/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Shield, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

type StrengthLevel = "none" | "weak" | "fair" | "good" | "strong";

const getPasswordStrength = (password: string): { level: StrengthLevel; score: number } => {
  if (!password) return { level: "none", score: 0 };
  
  let score = 0;
  
  // Length checks
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password)) score += 1;
  
  // Bonus for mixing
  if (password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password)) {
    score += 1;
  }
  
  if (score <= 2) return { level: "weak", score };
  if (score <= 4) return { level: "fair", score };
  if (score <= 6) return { level: "good", score };
  return { level: "strong", score };
};

const PasswordStrengthMeter = ({ password, className }: PasswordStrengthMeterProps) => {
  const { t } = useTranslation();
  const { level, score } = getPasswordStrength(password);
  
  const config = {
    none: {
      label: t('app.auth.passwordStrength.none', 'Enter password'),
      color: "bg-muted",
      textColor: "text-muted-foreground",
      width: "0%",
      icon: Shield,
    },
    weak: {
      label: t('app.auth.passwordStrength.weak', 'Weak'),
      color: "bg-red-500",
      textColor: "text-red-500",
      width: "25%",
      icon: ShieldX,
    },
    fair: {
      label: t('app.auth.passwordStrength.fair', 'Fair'),
      color: "bg-orange-500",
      textColor: "text-orange-500",
      width: "50%",
      icon: ShieldAlert,
    },
    good: {
      label: t('app.auth.passwordStrength.good', 'Good'),
      color: "bg-yellow-500",
      textColor: "text-yellow-500",
      width: "75%",
      icon: Shield,
    },
    strong: {
      label: t('app.auth.passwordStrength.strong', 'Strong'),
      color: "bg-green-500",
      textColor: "text-green-500",
      width: "100%",
      icon: ShieldCheck,
    },
  };
  
  const current = config[level];
  const Icon = current.icon;
  
  if (!password) return null;
  
  return (
    <div className={cn("space-y-2", className)}>
      {/* Progress bar */}
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-300 ease-out rounded-full", current.color)}
          style={{ width: current.width }}
        />
      </div>
      
      {/* Label with icon */}
      <div className={cn("flex items-center gap-1.5 text-xs font-medium", current.textColor)}>
        <Icon className="h-3.5 w-3.5" />
        <span>{current.label}</span>
      </div>
    </div>
  );
};

export { PasswordStrengthMeter, getPasswordStrength };
