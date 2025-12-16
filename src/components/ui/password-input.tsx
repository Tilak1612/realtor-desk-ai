import * as React from "react";
import { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface PasswordRequirement {
  id: string;
  label: string;
  validator: (password: string) => boolean;
}

interface PasswordInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  showValidation?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showValidation = false, onValidationChange, value, onChange, ...props }, ref) => {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    const passwordRequirements: PasswordRequirement[] = [
      {
        id: "length",
        label: t('app.auth.passwordRequirements.minLength', 'At least 8 characters'),
        validator: (pwd) => pwd.length >= 8,
      },
      {
        id: "uppercase",
        label: t('app.auth.passwordRequirements.uppercase', 'At least 1 uppercase letter (A-Z)'),
        validator: (pwd) => /[A-Z]/.test(pwd),
      },
      {
        id: "lowercase",
        label: t('app.auth.passwordRequirements.lowercase', 'At least 1 lowercase letter (a-z)'),
        validator: (pwd) => /[a-z]/.test(pwd),
      },
      {
        id: "number",
        label: t('app.auth.passwordRequirements.number', 'At least 1 number (0-9)'),
        validator: (pwd) => /[0-9]/.test(pwd),
      },
      {
        id: "special",
        label: t('app.auth.passwordRequirements.special', 'At least 1 special character (!@#$%^&*()_+-=[]{}|;:,.<>?)'),
        validator: (pwd) => /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(pwd),
      },
    ];

    const passwordValue = (value as string) || "";
    
    const checkRequirements = () => {
      return passwordRequirements.map((req) => ({
        ...req,
        met: req.validator(passwordValue),
      }));
    };

    const requirements = checkRequirements();
    const allRequirementsMet = requirements.every((req) => req.met);

    React.useEffect(() => {
      if (onValidationChange) {
        onValidationChange(allRequirementsMet);
      }
    }, [allRequirementsMet, onValidationChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
      if (onChange) {
        onChange(e);
      }
    };

    const shouldShowValidation = showValidation && hasInteracted && (isFocused || passwordValue.length > 0);

    return (
      <div className="space-y-2">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className={cn(
              "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-[44px] touch-manipulation",
              className
            )}
            ref={ref}
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        {shouldShowValidation && (
          <div className="space-y-1.5 pt-1">
            {requirements.map((req) => (
              <div
                key={req.id}
                className={cn(
                  "flex items-center gap-2 text-sm transition-colors",
                  req.met ? "text-green-600 dark:text-green-500" : "text-destructive"
                )}
              >
                {req.met ? (
                  <Check className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <X className="h-4 w-4 flex-shrink-0" />
                )}
                <span>{req.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
export type { PasswordInputProps };

export const validatePassword = (password: string): boolean => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
  
  return hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
};
