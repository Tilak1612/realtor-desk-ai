# SKILL.md — Claude Code Skills for RealtorDesk AI

> This file defines domain-specific skills that Claude Code agents can use when working in this repo.

## Global Rule: Bilingual (EN + FR-CA) Always

**Every addition to this project MUST ship in both English and French (Canadian French / FR-CA).** This is non-negotiable — RECO Ontario and OACIQ Quebec compliance depend on it, and FR-CA is a first-class language in this product, not an afterthought.

This applies to:
- UI copy (buttons, labels, tooltips, empty states, error messages, toasts)
- Page content (landing pages, dashboards, marketing pages, legal pages)
- Email templates (transactional + drip campaigns via Resend)
- Meta tags, OG images, structured data, and SEO content
- Notifications (in-app, push, SMS)
- Chatbot prompts and AI-generated responses where user-facing
- Form validation messages (zod schemas → i18next keys)
- PDF exports, receipts, and generated documents

**How to apply**:
1. Add new strings to `i18next` locale files — never hardcode user-facing text
2. Provide both `en` and `fr` keys in the same PR — no "FR to follow later"
3. Use the [Bilingual Glossary](../../.claude/projects/-Users-tilakraj-realtor-desk-ai-realtor-desk-ai/memory/bilingual_glossary.md) for authoritative term translations (RECO=ON, OACIQ=QC, PIPEDA=LPRPDE, CASL=LCAP)
4. For generated content (emails, AI responses), the generator must accept a `locale` parameter and branch on it
5. If a translation is uncertain, flag it for review rather than shipping English-only

**What counts as "shipped bilingual"**: both locales render without `[missing translation]` fallbacks, and FR-CA copy reads naturally to a native speaker (not machine-translated English).

---

## Base Skills

### 1. Frontend Component Builder
- **Agent**: agents/frontend/ (sub-task)
- **Trigger**: New UI component, page, or layout work
- **Rules**: PascalCase, co-located tests, shadcn/ui primitives, Tailwind only, absolute imports via `@/`

### 2. Supabase Backend Agent
- **Agent**: agents/backend/ (sub-task)
- **Trigger**: Edge Functions, RLS policies, database queries, auth flows
- **Rules**: Every table needs RLS, use `supabase.auth`, sequential migrations, never expose service role key client-side

### 3. Stripe Integration Agent
- **Agent**: agents/backend/ (sub-task)
- **Trigger**: Checkout, webhooks, subscription management, billing portal
- **Rules**: Verify webhook signatures, CAD currency, link checkout to Supabase user via metadata, never store card data

### 4. Testing Agent
- **Agent**: agents/testing/ (sub-task)
- **Trigger**: Unit tests, integration tests, E2E tests
- **Rules**: Co-locate with components, mock Supabase client for unit tests, Playwright for E2E

### 5. SEO & Content Agent
- **Agent**: agents/content/ (sub-task)
- **Trigger**: Meta tags, OG images, landing page copy, blog content
- **Rules**: Bilingual EN/FR, unique meta per page, structured data where applicable

### 6. DevOps Agent
- **Agent**: agents/devops/ (sub-task)
- **Trigger**: CI/CD, Vercel config, GitHub Actions, preview deployments
- **Rules**: Never deploy to production directly, preview deployments for PRs

---

## Product-Specific Skills

### Skill: Real Estate Data Agent
- **Agent**: agents/backend/ (sub-task)
- **Trigger**: CREA DDF integration, property data sync, MLS listing management
- **Context Files**: `src/features/properties/`, `supabase/functions/crea-ddf-sync/`

**Capabilities**:
- Implement and maintain CREA DDF API integration (OAuth 2.0 token refresh)
- Sync property listings to Supabase on schedule (Edge Function cron)
- Parse and normalize RETS/DDF property data into the app schema
- Handle listing photos, virtual tour URLs (Matterport / iGuide), and open house data
- Build property search with filters (city, price, bedrooms, property type)

**Rules**:
1. DDF sync runs via Edge Function — never from the client
2. Refresh OAuth tokens automatically — store encrypted in Supabase secrets
3. Property images are referenced by URL — do not store binary in Supabase
4. All DDF data synced with `source: 'crea_ddf'` marker for auditability
5. Respect CREA DDF rate limits — implement exponential backoff

**Output**:
- Edge Function: `supabase/functions/crea-ddf-sync/index.ts`
- DB migration: `supabase/migrations/YYYYMMDD_properties.sql`
- Types: `src/types/property.ts`

### Skill: Lead Scoring Agent
- **Agent**: agents/backend/ (sub-task)
- **Trigger**: Lead scoring logic, AI chatbot routing, lead enrichment
- **Context Files**: `src/features/leads/`, `supabase/functions/score-lead/`, `src/lib/openai.ts`

**Capabilities**:
- Design and implement AI lead scoring using OpenAI API
- Score leads on: engagement history, property search behavior, response time, budget signals
- Trigger Lovable AI chatbot handoff for high-score leads
- Enrich lead profiles via Apify (LinkedIn, social data)
- Build drip campaign triggers based on score thresholds

**Rules**:
1. All OpenAI calls happen in Edge Functions — API key never touches the client
2. Lead scores are 0–100; store with `scored_at` timestamp for tracking
3. Score updates are async — never block UI on scoring
4. Log scoring input/output for model evaluation and debugging
5. Never store raw OpenAI response beyond what's needed — respect PIPEDA

**Output**:
- Edge Function: `supabase/functions/score-lead/index.ts`
- Hook: `src/hooks/useLeadScore.ts`
- Types: `src/types/lead.ts`
