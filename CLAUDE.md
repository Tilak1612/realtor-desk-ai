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
- **Supabase Project**: `vxkqwkeqincbxrgglmca` (realtordesk-prod, ca-central-1)

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
├── assets/               # Raster + SVG. Run scripts/optimize-images.mjs after
│                         # adding one; <Picture> needs .avif/.webp siblings.
├── components/           # Shared UI
│   ├── ui/               # shadcn primitives
│   ├── rd/               # The "RD" product shell: AppShell, Sidebar, TopNav,
│   │                     # StatCard, Table, and the /app design system
│   ├── dashboard/        # Legacy dashboard widgets
│   ├── contacts/ deals/ integrations/ contact-detail/
│   └── Picture.tsx       # <picture> with AVIF -> WebP -> original.
│                         # width/height are REQUIRED (prevents CLS).
├── config/               # billing.ts, legal.ts — constants mirrored from
│                         # server-side values, guarded by contract tests
├── contexts/             # SubscriptionContext
├── data/                 # Static reference data
├── hooks/
│   └── rd/               # useLeads, useReports, useConversation, ...
├── i18n/                 # config.ts holds BOTH en and fr bundles inline.
│                         # ~345KB; shape.test.ts enforces key parity.
├── integrations/supabase/# client.ts + generated types.ts
├── lib/
│   └── rd/               # mapContact, mapActivity, pipeline, csv
├── pages/                # Route components (marketing + /app + blog)
└── styles/rd-tokens.css  # RD design tokens; base tokens live in index.css
supabase/
├── functions/            # Edge Functions (Deno)
└── migrations/
```

**Note:** there is no `src/features/` directory. This tree is organised by kind
(components / hooks / lib / pages), not by feature. Earlier revisions of this
file described a feature-module layout that was never built.


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
VITE_SUPABASE_PUBLISHABLE_KEY=
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

## Verification

Three harnesses, all Playwright + a real Chrome. The first two need a local
`vite preview`; the third targets the live domain.

```bash
bunx vite preview --port 4173 --strictPort &
npm run verify:a11y -- /pricing /integrations        # axe, serious + critical
npm run verify:responsive -- /pricing                # 8 widths, overflow + tap size
npm run verify:live                                  # 15 checks against production
```

`verify:responsive` accepts `WIDTHS=320,768` to narrow the default eight
(320/375/390/430/768/1024/1440/1920) -- use it to sweep every sitemap route at
the extremes, where overflow and tap-target problems actually live.

**The local harnesses need Supabase env vars to render anything.** Without them
`supabaseUrl is required` throws at module init and every page is blank -- and a
blank page has no contrast violations and no small tap targets, so it would
score perfectly. Both scripts therefore report EMPTY, never PASS, for a page
under 200 characters of text. Throwaway values are enough for marketing pages:

```bash
VITE_SUPABASE_URL="https://placeholder.supabase.co" \
VITE_SUPABASE_PUBLISHABLE_KEY="placeholder" npm run build
```

Two traps worth knowing, both of which produced false clean runs:

- **A stale `vite preview` holding the port.** Vite prints "Port 4173 is in use,
  trying another one" and binds elsewhere, so the run measures an old build.
  Always pass `--strictPort`.
- **Measuring mid-animation.** `animate-fade-in-up` passes through fractional
  opacity, and axe scores whatever it finds. Both scripts wait for finite
  animations to finish -- infinite ones (spinners) are skipped, since awaiting
  one never returns.

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

## gstack (recommended)

This project uses [gstack](https://github.com/garrytan/gstack) for AI-assisted workflows.
Install it for the best experience:

```bash
git clone --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup --team
```

Skills like /qa, /ship, /review, /investigate, and /browse become available after install.
Use /browse for all web browsing. Use ~/.claude/skills/gstack/... for gstack file paths.
