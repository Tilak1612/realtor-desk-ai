import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        decorative: {
          orange: "hsl(var(--decorative-orange))",
          pink: "hsl(var(--decorative-pink))",
          purple: "hsl(var(--decorative-purple))",
          blue: "hsl(var(--decorative-blue))",
          yellow: "hsl(var(--decorative-yellow))",
          green: "hsl(var(--decorative-green))",
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        info: "hsl(var(--info))",
        status: {
          active: {
            DEFAULT: "hsl(var(--status-active))",
            foreground: "hsl(var(--status-active-foreground))",
          },
          pending: {
            DEFAULT: "hsl(var(--status-pending))",
            foreground: "hsl(var(--status-pending-foreground))",
          },
          closed: {
            DEFAULT: "hsl(var(--status-closed))",
            foreground: "hsl(var(--status-closed-foreground))",
          },
          sold: {
            DEFAULT: "hsl(var(--status-sold))",
            foreground: "hsl(var(--status-sold-foreground))",
          },
          // Lead statuses
          new: {
            DEFAULT: "hsl(var(--status-new))",
            foreground: "hsl(var(--status-new-foreground))",
          },
          contacted: {
            DEFAULT: "hsl(var(--status-contacted))",
            foreground: "hsl(var(--status-contacted-foreground))",
          },
          nurturing: {
            DEFAULT: "hsl(var(--status-nurturing))",
            foreground: "hsl(var(--status-nurturing-foreground))",
          },
          hot: {
            DEFAULT: "hsl(var(--status-hot))",
            foreground: "hsl(var(--status-hot-foreground))",
          },
          qualified: {
            DEFAULT: "hsl(var(--status-qualified))",
            foreground: "hsl(var(--status-qualified-foreground))",
          },
          unqualified: {
            DEFAULT: "hsl(var(--status-unqualified))",
            foreground: "hsl(var(--status-unqualified-foreground))",
          },
          converted: {
            DEFAULT: "hsl(var(--status-converted))",
            foreground: "hsl(var(--status-converted-foreground))",
          },
          // Deal statuses
          open: {
            DEFAULT: "hsl(var(--status-open))",
            foreground: "hsl(var(--status-open-foreground))",
          },
          underContract: {
            DEFAULT: "hsl(var(--status-under-contract))",
            foreground: "hsl(var(--status-under-contract-foreground))",
          },
          won: {
            DEFAULT: "hsl(var(--status-won))",
            foreground: "hsl(var(--status-won-foreground))",
          },
          lost: {
            DEFAULT: "hsl(var(--status-lost))",
            foreground: "hsl(var(--status-lost-foreground))",
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['30px', { lineHeight: '36px', fontWeight: '600' }],
        'heading-1': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'heading-2': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'heading-3': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label': ['13px', { lineHeight: '18px', fontWeight: '500' }],
        'meta': ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "scale-in": "scale-in 0.4s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
