import * as React from "react";
import { cn } from "@/lib/utils";
import { Phone } from "lucide-react";

interface PhoneInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  iconClassName?: string;
}

const formatPhoneNumber = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, "");
  
  // Limit to 10 digits (North American format)
  const limited = digits.slice(0, 10);
  
  // Format as (XXX) XXX-XXXX
  if (limited.length === 0) return "";
  if (limited.length <= 3) return `(${limited}`;
  if (limited.length <= 6) return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
  return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
};

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, iconClassName, value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhoneNumber(e.target.value);
      
      // Create a synthetic event with the formatted value
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: formatted,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      
      if (onChange) {
        onChange(syntheticEvent);
      }
    };

    return (
      <div className="relative">
        <input
          type="tel"
          className={cn(
            "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 pl-12 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-[44px] touch-manipulation",
            className
          )}
          ref={ref}
          value={value}
          onChange={handleChange}
          {...props}
        />
        <Phone className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400", iconClassName)} />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput, formatPhoneNumber };
