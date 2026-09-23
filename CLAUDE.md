# CLAUDE.md — RealtorDesk AI

## Product
- **RealtorDesk AI** — AI CRM for Canadian real estate agents: lead scoring,
  automated follow-up, listing sync, market insights.
- Stage: production / launched. Live: https://www.realtordesk.ai
- Supabase: `vxkqwkeqincbxrgglmca` (realtordesk-prod, ca-central-1)

## Stack
Vite + React (SPA, prerendered for SEO via `npm run build:seo`) · TypeScript strict · React Router 6 ·
Tailwind + shadcn/ui · Supabase (Auth, RLS, Postgres, 32 Edge Functions) ·
Stripe Checkout + Portal + webhooks · i18next (EN/FR) · Capacitor mobile
wrapper · Sentry · Vercel Speed Insights · @dnd-kit pipeline board · recharts.

## Repo map
- `src/pages`, `src/components`, `src/hooks`, `src/contexts`, `src/i18n`,
  `src/lib`, `src/integrations`, `src/config`
- `api/` — **Vercel serverless functions.** There are two server runtimes in
  this repo, not one: Supabase Edge Functions (Deno, `Deno.env.get`, secrets
  via `supabase secrets set`) and Vercel functions (Node, `process.env`,
  secrets via Vercel project env vars). `api/integrations/google/[action].ts`
  is the Google Calendar OAuth + events endpoint and reads
  `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` from Vercel. Check both runtimes
  before concluding a feature is unimplemented.
- `supabase/functions/` — `calculate-lead-score` / `lead-score-calculator`,
  `crea-ddf-sync`, `import-property-from-ddf`, `apify-runner`,
  `run-automation`, `email-automation`, `lifecycle-cron`, `send-lifecycle-email`,
  `send-sms`, `send-phone-verification`, `request-unsubscribe-link`,
  `process-unsubscribe`, `oauth-integration-auth` / `-callback`,
  `encrypt-integration-token`, `create-checkout`, `customer-portal`,
  `check-subscription`, `stripe-webhook-email`, `ai-chatbot`, `claude-chat`,
  `generate-call-summary`, `sync-health-check`, `webhook-receiver`
- `api-tests/`, `scripts/`, `docs/`

## Commands
```
npm run dev
npm run lint
npm run typecheck            # tsc -p tsconfig.app.json --noEmit
npm run test                 # vitest run
npm run build:seo            # vite build + prerender pages
npm run verify:live
npm run verify:a11y
npm run verify:responsive
npm run verify:parity        # dashboard: desktop vs tablet vs phone (vite preview on :4201)
npm run verify:auth          # auth pages EN+FR incl. failure states (vite preview on :4201)
```

## Domain guardrails
- **CASL**: every marketing/automation email needs a working unsubscribe path and
  a consent record. Never send to an unsubscribed or unconsented contact, and
  never bypass `request-unsubscribe-link` / `process-unsubscribe`.
- **CREA / DDF**: listing data is licensed. Respect attribution and caching rules,
  do not re-publish DDF data outside permitted surfaces, and keep sync failures
  visible via `sync-health-check` instead of swallowing them.
- Integration OAuth tokens must stay encrypted (`encrypt-integration-token`).
  Never log or return a raw token.
- Agent data is tenant-scoped. Leads, listings, and call summaries never cross
  agents/brokerages.
- Lead scores and AI call summaries are assistive — no legal or valuation claims.

## Supabase rules
- Append-only, timestamped migrations; enable and test RLS on new tables.
- Service-role key only in Edge Functions; browser uses the anon key.
- Cron-driven functions (`lifecycle-cron`, `email-automation`) must be idempotent.

## Docs hygiene
The root has ~40 report files. Update an existing one rather than adding another.

## Definition of done
Files changed; lint + typecheck + vitest results; unverified items; migrations,
env vars, or cron/webhook changes the deploy needs.
