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
        // ── Redesign palette (Phase 1 — 2026-04 rebrand) ────────────
        // Mirrors src/styles/rd-tokens.css so classes like
        // bg-rd-navy-800 / text-rd-terra-600 / border-rd-line compile.
        rd: {
          // Ink / neutrals
          "ink-950": "#0A0E14",
          "ink-900": "#111418",
          "ink-800": "#1B2028",
          "ink-700": "#2A2F38",
          "ink-600": "#4A5260",
          "ink-500": "#6B7280",
          "ink-400": "#9AA1AD",
          "ink-300": "#C8CDD5",
          "ink-200": "#E5E7EB",
          "ink-100": "#EEEFF1",
          "ink-50":  "#F5F5F2",
          // Paper surfaces
          paper: "#FAFAF7",
          "paper-2": "#F4F3EE",
          card: "#FFFFFF",
          line: "#E3E4E0",
          "line-strong": "#C8CAC2",
          // Navy (brand primary)
          "navy-950": "#050C17",
          "navy-900": "#081826",
          "navy-800": "#0B2540",
          "navy-700": "#133656",
          "navy-600": "#1F4A72",
          "navy-500": "#2E6291",
          "navy-400": "#5A89B3",
          "navy-300": "#93B2CE",
          "navy-200": "#C9D8E6",
          "navy-100": "#E4ECF3",
          "navy-50":  "#F1F5F9",
          // Terracotta (accent)
          "terra-900": "#7A2E14",
          "terra-800": "#9F4222",
          "terra-700": "#BE552F",
          "terra-600": "#D7714E",
          "terra-500": "#E08B6C",
          "terra-400": "#EBAA93",
          "terra-300": "#F2C8B9",
          "terra-200": "#F8E0D5",
          "terra-100": "#FBEEE7",
          "terra-50":  "#FDF7F3",
          // Semantic
          success: "#1F7A4D",
          "success-bg": "#E4F3EB",
          warning: "#B88A2E",
          "warning-bg": "#FAF0D7",
          danger: "#B32B2B",
          "danger-bg": "#FAE2E2",
          info: "#1F4A72",
          "info-bg": "#E4ECF3",
          // Lead score
          "score-hot":  "#D7714E",
          "score-warm": "#D9A441",
          "score-cool": "#5A89B3",
          "score-cold": "#9AA1AD",
        },
      },
      boxShadow: {
        "rd-sm":   "0 1px 2px rgba(11,37,64,0.06), 0 1px 1px rgba(11,37,64,0.04)",
        "rd-md":   "0 2px 4px rgba(11,37,64,0.05), 0 8px 24px -8px rgba(11,37,64,0.10)",
        "rd-lg":   "0 12px 28px -12px rgba(11,37,64,0.18), 0 40px 80px -40px rgba(11,37,64,0.20)",
        "rd-ring": "0 0 0 1px #E3E4E0",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        // Redesign (Phase 1). Alias the CSS-var pipeline from rd-tokens.css so
        // components can use `font-rd-sans | font-rd-serif | font-rd-mono`.
        'rd-sans': ['var(--rd-font-sans)'],
        'rd-serif': ['var(--rd-font-serif)'],
        'rd-mono': ['var(--rd-font-mono)'],
      },
      fontSize: {
        // Audit-mandated marketing scale
        'h1-display': ['56px', { lineHeight: '60px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'h1': ['48px', { lineHeight: '52px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'h2': ['36px', { lineHeight: '40px', letterSpacing: '-0.015em', fontWeight: '600' }],
        'h3': ['24px', { lineHeight: '30px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px' }],
        'body': ['16px', { lineHeight: '26px' }],
        'caption': ['13px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '500' }],
        // App scale (kept)
        'display-1': ['30px', { lineHeight: '36px', fontWeight: '600' }],
        'heading-1': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'heading-2': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'heading-3': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label': ['13px', { lineHeight: '18px', fontWeight: '500' }],
        'meta': ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // Redesign radii (Phase 1). Keyed with rd- prefix to avoid clobbering
        // the shadcn lg/md/sm chain above.
        "rd-xs": "4px",
        "rd-sm": "6px",
        "rd-md": "10px",
        "rd-lg": "14px",
        "rd-xl": "20px",
        "rd-pill": "999px",
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
