# CLAUDE.md — Project Root Context

> This file is the **single source of truth** for Claude Code when working in this repository.
> It is automatically read by Claude Code on session init (`/init`).

## Git Config

Always run before committing:
```
git config user.name "Tilak1612"
git config user.email "tilak1111@gmail.com"
```

## Project Overview

- **Product**: RealtorDesk AI — AI-powered CRM for Canadian real estate agents
- **One-liner**: "Automates lead follow-up, listing management, and client communication for Canadian agents"
- **Stage**: Production / Launched
- **Live URL**: https://www.realtordesk.ai
- **Repo**: https://github.com/Tilak1612/realtor-desk-ai
- **Supabase Project**: pseqajrtcgiphfnworii (realtordesk-prod)

## Tech Stack

| Layer | Technology |
| ------------ | ------------------------------------------------------------------- |
| Framework | Vite + React 19 (SPA) |
| Language | TypeScript (strict mode) |
| Routing | React Router 6 |
| Styling | Tailwind CSS + shadcn/ui (brand color: #ea580c) |
| Backend | Supabase (Auth, RLS, Edge Functions, Postgres) |
| Auth | Supabase Auth — email/password + Google OAuth + Microsoft OAuth |
| Payments | Stripe (Checkout, Webhooks, Portal) — CAD currency |
| Email | Resend (transactional) — from support@realtordesk.ai |
| AI | OpenAI API (lead scoring, AI chatbot) + Lovable AI chat widget |
| Hosting | Vercel |
| CI/CD | GitHub Actions |
| Monitoring | Google Analytics 4 + Search Console |
| Localization | i18next (EN/FR bilingual — RECO Quebec requirement) |
| Mobile | Capacitor (iOS/Android wrapper) |

## Architecture

```
src/
├── components/           # Reusable UI components (shadcn/ui based)
│   ├── ui/               # shadcn primitives
│   └── shared/           # App-wide shared components (Navbar, Sidebar, etc.)
├── features/             # Feature modules (co-located logic + UI)
│   ├── auth/             # Login, signup, OAuth, password reset
│   ├── dashboard/        # Main agent dashboard, KPI cards
│   ├── leads/            # AI lead scoring, lead list, lead detail
│   ├── contacts/         # Client/contact management
│   ├── deals/            # Deal pipeline (kanban + list view)
│   ├── properties/       # Property listings, CREA DDF feed integration
│   ├── tasks/            # Task management, calendar integration
│   ├── chatbot/          # 24/7 AI chatbot (Lovable widget integration)
│   ├── email/            # Email automation, drip campaigns
│   ├── billing/          # Stripe subscription management
│   └── virtual-tours/    # Matterport / iGuide virtual tour links
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions, Supabase client, Stripe helpers, OpenAI client
├── pages/                # Route-level page components
├── types/                # Shared TypeScript interfaces and types
└── styles/               # Global CSS / Tailwind config
supabase/
├── functions/            # Edge Functions (Deno) — webhook handlers, AI scoring, DDF sync
├── migrations/           # SQL migrations (sequential)
└── seed.sql              # Dev seed data (sample agents, leads, properties)
```

## Conventions

### Code Style
- **Components**: PascalCase, one per file, co-located with tests
- **Hooks**: `use` prefix, return typed objects (not arrays)
- **Utils**: camelCase, pure functions preferred
- **Types**: suffix with `Type`, `Props`, or `Schema` — never `I` prefix
- **Imports**: absolute paths via `@/` alias

### Supabase Rules
- **Every table with user data MUST have RLS policies** — no exceptions
- Auth uses `supabase.auth` — never roll custom JWT
- Edge Functions handle webhook verification, CREA DDF sync, and OpenAI calls
- Migrations are sequential: `YYYYMMDD_HHMMSS_description.sql`
- Multi-tenant: every table with agent/brokerage data uses `user_id` RLS

### Stripe Rules
- All Stripe webhook handlers verify signatures
- Checkout sessions use `metadata` to link back to Supabase user
- Pricing in CAD — always pass `currency: 'cad'`
- Never store raw card data — Stripe handles PCI compliance

### PIPEDA / Compliance Rules
- All personal data (leads, contacts) stored in Supabase Postgres (Canada region)
- Cookie consent banner required — Quebec Law 25 compliance
- Privacy policy and terms must be linked from every auth screen

### Git Workflow
- Branch naming: `feat/`, `fix/`, `chore/`, `refactor/`
- Commits: conventional commits (`feat:`, `fix:`, `chore:`)
- PRs require passing CI before merge
- Claude Code does NOT push — human reviews and pushes

## Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe (CAD)
VITE_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email (Resend)
RESEND_API_KEY=

# AI
OPENAI_API_KEY=
VITE_LOVABLE_API_KEY=

# Analytics
VITE_GA_MEASUREMENT_ID=

# CREA DDF Integration
CREA_DDF_API_KEY=
CREA_DDF_API_SECRET=

# Optional integrations
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
APIFY_API_KEY=
```

## Agent Routing

| Agent | Scope |
| ----------- | ---------------------------------------------------------------- |
| backend | Supabase, Edge Functions, RLS, CREA DDF sync, OpenAI integration |
| frontend | React components, pages, hooks, i18next translations, styling |
| devops | CI/CD, Vercel config, GitHub Actions, preview deployments |
| database | Schema design, migrations, seed data, RLS, multi-tenant policies |
| testing | Unit tests, integration tests, E2E (Playwright) |
| content | SEO (EN + FR), meta tags, landing page copy, OG images |

## Do NOT

- ✘ Push to git (human reviews and pushes)
- ✘ Modify `.env` files directly (use `.env.example` as reference)
- ✘ Skip RLS on any table with user/tenant data
- ✘ Store secrets in client-side code (`VITE_` prefix = public)
- ✘ Create migrations without checking existing schema first
- ✘ Use `any` type — always type explicitly
- ✘ Change pricing tiers or billing logic without Tilak's explicit approval
- ✘ Remove or bypass the PIPEDA consent/cookie banner
- ✘ Make direct calls to CREA DDF from the client — always via Edge Function
- ✘ Disable or weaken RLS for any agent/lead/contact table
