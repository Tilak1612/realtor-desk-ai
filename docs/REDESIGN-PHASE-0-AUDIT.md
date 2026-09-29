# Phase 0 audit — website redesign brief

Prepared 28 September 2026 against `CLAUDE-CODE-IMPLEMENTATION-BRIEF.md`.
Mandated before any redesign edits. Nothing here is inferred from the Lofty
recording; everything is read from this repository or verified against
production.

## 1. Stack, confirmed not assumed

React 19.2 · React Router 6.30 · Vite 5.4 · Tailwind 3.4 · i18next 25.5 · npm.
Build is `vite build && node scripts/prerender-pages.js`; deployment is Vercel
with `buildCommand: npm run build:seo`. **Not Next.js** — the brief warns
against assuming it, and the warning was warranted.

123 routes in `App.tsx`, 89 of them public, 82 in the sitemap.

## 2. Public shell — the brief's structural finding, corrected

The brief says "Homepage and integrations page have different footers…
Replace duplicated public shells with one shared shell". Half of that was
already true and half was not:

- **Header: already unified.** `src/components/Navbar.tsx` is an 11-line shim
  delegating to `MarketingHeader`. All 88 public pages shared one header
  before this work began.
- **Footer: genuinely duplicated.** Two real implementations —
  `Footer.tsx` (221 lines, light `bg-muted`, 13 destinations, English-only) on
  84 pages, and `MarketingFooter.tsx` (191 lines, 20 destinations, grouped
  Product / Compare / Company / Canada, FR legal-acronym swaps per the 2026-04
  Bill 96 audit) on 4.

Resolved by keeping `MarketingFooter` and shimming `Footer.tsx` to it, the
same pattern already used for the header. The two things only the legacy file
had — the `/faq` link, and the support address plus four social profiles —
were ported across first so no page loses a destination.

Verified after the swap: `/faq` is now reachable from `/integrations`, and the
site still has zero orphan pages.

## 3. Claim ledger

Status as verified in this repository and against production, not as the
marketing site describes it.

| Claim | Status | Evidence |
|---|---|---|
| Bilingual EN/FR interface + client email | **live** | i18next EN/FR bundles; `?lang=fr` toggle |
| Lead scoring 0–100 with visible factors | **live** | `supabase/functions/calculate-lead-score`: 30/30/20/15/5, capped at 100 |
| Conversation timeline per client | **live** | `conversation_messages` table |
| Drag-and-drop pipeline, CAD totals | **live** | @dnd-kit board |
| Realtor.ca listing import | **live** | built-in importer |
| CASL consent + unsubscribe | **live** | `email_suppressions` ("A row = never send"), `sms_consent` fails closed, `request-unsubscribe-link` / `process-unsubscribe` |
| Twilio SMS | **live** | `send-sms` |
| Inbound automation (Zapier/Make/n8n) | **live** | `webhook-receiver` |
| Data hosted in Canada | **live** | Supabase `ca-central-1` |
| Google Calendar connect | **live** | `api/integrations/google/[action].ts`, `google_calendar_connections` in prod |
| Google Calendar **event push** | **partial** | endpoint exists; **nothing in `src/` calls it** |
| Google/Microsoft contact import | **planned** | OAuth only, no import path |
| Outlook calendar sync | **planned** | OAuth only |
| Native CREA DDF sync | **planned** | Q3 2026 roadmap; `crea-ddf-sync` is scaffold |
| Round-robin routing | **planned** | labelled roadmap on /pricing |
| SAML SSO | **planned** | labelled roadmap on /pricing |
| FINTRAC workflows | **planned** | labelled roadmap on /pricing |
| **Teams / seats / shared pipeline** | **does not exist** | no seat, assignment, organization or brokerage column anywhere in `information_schema`. The $299 Team plan is a billing tier only |
| Autonomous AI reply to leads | **does not exist** | nothing invokes `run-automation`; pinned by `capabilityClaims.test.ts` |

The brief asks about the calendar inconsistency specifically: **connection and
sync are separate, and only connection ships.** Both are already represented
that way on `/features/ai-lead-follow-up`, `/integrations` and `/pricing`.

The brief also warns not to promote roadmap items because their target quarter
has arrived. Checked: every unshipped row on `/pricing` still reads
"(roadmap)" or "(Q3 2026)".

## 4. Plan-ID mismatch

The brief flags Integrations saying "Enterprise" while pricing says
"Brokerage". `src/config/billing.ts` has exactly two plan summaries — `solo`
(149 CAD) and `team` (299 CAD) — while `/pricing` renders a third
`brokerage` column. **Do not equate any of these with "Enterprise".** Billing
config is the authority; no marketing-only pricing source was created.

## 5. Content audit

Approved existing copy stays. The one category needing care is competitor
facts: 27 invented prices for Lofty and BoldTrail were removed on 28 Sep after
confirming neither vendor publishes pricing, along with 14 fabricated
testimonials and an ROI table promising "$306,312/year". Guards in
`capabilityClaims.test.ts` and `metaLength.test.ts` now pin all of it.

New copy from `CONTENT-PACK.md` is publishable where it describes a **live**
row above. Anything touching teams, brokerage capability, autonomous AI,
IDX/websites, dialer, transaction management, back office or social publishing
is preview-only per the brief and the competitor map.

## 6. Route inventory

| Path | Component | In sitemap | Disposition |
|---|---|---|---|
| `/` | RDHome | yes | existing |
| `/ai-crm-canadian-real-estate-agents-guide` | AICRMGuide | yes | existing |
| `/blog/ai-chatbot-real-estate-websites-canada` | AIChatbotGuide | yes | existing |
| `/blog/ai-transformation` | AITransformation | yes | existing |
| `/blog/ai-vs-traditional-crm` | AIvsTraditionalCRM | yes | existing |
| `/blog/best-crm-canada-2025` | BestCRMCanada2025 | yes | existing |
| `/blog/best-liondesk-alternative-canadian-realtors` | LionDeskAlternative | yes | existing |
| `/blog/bilingual-marketing` | BilingualMarketing | yes | existing |
| `/blog/boomtown-alternative-canada` | BoomTownAlternative | yes | existing |
| `/blog/community-launch` | CommunityLaunch | yes | existing |
| `/blog/compliance` | Compliance | yes | existing |
| `/blog/crea-ddf` | CreaDDF | yes | existing |
| `/blog/ixact-alternatives` | IxactAlternatives | yes | existing |
| `/blog/lead-conversion` | LeadConversion | yes | existing |
| `/blog/open-house-digital-sign-in-sheets-vs-paper-2025` | OpenHouseDigitalSignIn | yes | existing |
| `/blog/real-estate-crm-buying-guide` | RealEstateCRMBuyingGuide | yes | existing |
| `/blog/real-estate-drip-campaign-templates-canada-2025` | DripCampaignTemplates | yes | existing |
| `/blog/real-estate-lead-generation-strategies-canada-2025` | LeadGenerationStrategies | yes | existing |
| `/blog/success-story` | Navigate | no | existing |
| `/blog/vs-follow-up-boss` | VsFollowUpBoss | yes | existing |
| `/blog/vs-kvcore` | VsKvCore | yes | existing |
| `/blog/vs-lofty-crm` | VsLoftyCRM | yes | existing |
| `/blog/vs-propertybase` | VsPropertybase | yes | existing |
| `/ca/toronto-realtor-crm` | TorontoRealtorCrm | yes | existing |
| `/ca/vancouver-realtor-crm` | VancouverRealtorCrm | yes | existing |
| `/canada-housing-market-forecast-2025-2026` | HousingForecast2025 | yes | existing |
| `/canadian-market` | CanadianMarket | yes | existing |
| `/canadian-realtors-thrive-slower-market-ai-automation` | AIAutomationSlowerMarket | yes | existing |
| `/careers` | Careers | yes | existing |
| `/compare/boldtrail` | RDCompareBoldtrail | yes | existing |
| `/compare/real-geeks-alternative` | RealGeeksAlternative | yes | existing |
| `/compare/top-producer-alternative` | TopProducerAlternative | yes | existing |
| `/contact` | Contact | yes | existing |
| `/demo` | Demo | yes | existing |
| `/edmonton-real-estate-market-2025` | EdmontonMarket2025 | yes | existing |
| `/faq` | FAQ | yes | existing |
| `/features` | RDFeatures | yes | existing |
| `/features/ai-lead-follow-up` | AiLeadFollowUp | yes | existing |
| `/features/ai-lead-scoring` | AiLeadScoring | yes | existing |
| `/features/ai-powered-crm` | AIPoweredCRM | yes | existing |
| `/features/bilingual-crm` | BilingualCrm | yes | existing |
| `/features/casl-compliant-email` | CaslCompliantEmail | yes | existing |
| `/fintrac-compliance` | FintracCompliance | yes | existing |
| `/first-time-home-buyer-guide-canada-2025` | FirstTimeBuyerGuide | yes | existing |
| `/fr/crm-immobilier` | CrmImmobilier | yes | existing |
| `/how-it-works` | HowItWorks | yes | existing |
| `/integrations` | IntegrationsRoute | yes | existing |
| `/lead-response-time-canadian-realtors` | LeadResponseTime | yes | existing |
| `/lofty-alternative` | LoftyAlternative | yes | existing |
| `/login` | Login | no | existing |
| `/partners` | Partners | yes | existing |
| `/partners/apply` | PartnersApply | yes | existing |
| `/partners/terms` | PartnersTerms | yes | existing |
| `/pipeda-compliance` | PIPEDACompliancePage | yes | existing |
| `/pipeda-compliance-real-estate-ai-tools-canada` | PIPEDACompliance | yes | existing |
| `/pricing` | RDPricing | yes | existing |
| `/privacy-policy` | PrivacyPolicy | yes | existing |
| `/real-estate-database-reactivation-canada` | DatabaseReactivation | yes | existing |
| `/resources` | Resources | yes | existing |
| `/resources/calgary-real-estate-marketing-strategies` | CalgaryMarketingGuide | yes | existing |
| `/resources/casl-compliance-real-estate-email-marketing-canada` | CASLComplianceGuide | yes | existing |
| `/resources/cost-of-missed-real-estate-leads-canada` | CostOfMissedLeads | yes | existing |
| `/resources/real-estate-crm-pricing` | RealEstateCrmPricing | yes | existing |
| `/resources/real-estate-crm-template` | RealEstateCrmTemplate | yes | existing |
| `/resources/slow-follow-up-calculator-canadian-realtors` | LeadMagnetFollowUp | yes | existing |
| `/resources/voice-ai-real-estate-lead-follow-up-canada` | VoiceAIGuide | yes | existing |
| `/roadmap` | Roadmap | yes | existing |
| `/sell-home-fast-canada-2025` | SellHomeFast | yes | existing |
| `/sign-in` | Navigate | no | existing |
| `/sign-up` | Navigate | no | existing |
| `/signin` | Navigate | no | existing |
| `/signup` | Signup | no | existing |
| `/switch-from-boldtrail` | SwitchFromBoldTrail | yes | existing |
| `/switch-from-follow-up-boss` | SwitchFromFollowUpBoss | yes | existing |
| `/switch-from-ixact` | SwitchFromIxact | yes | existing |
| `/switch-from-liondesk` | SwitchFromLionDesk | yes | existing |
| `/switch-from-lofty` | SwitchFromLofty | yes | existing |
| `/switch-from-wise-agent` | SwitchFromWiseAgent | yes | existing |
| `/terms-of-service` | TermsOfService | yes | existing |
| `/toronto-vs-vancouver-real-estate-market-2025` | TorontoVsVancouver | yes | existing |
| `/unsubscribe` | Unsubscribe | no | existing |
| `/use-cases/brokerage` | BrokerageCrm | yes | existing |
| `/use-cases/real-estate-team` | RealEstateTeam | yes | existing |
| `/use-cases/solo-agent` | SoloAgent | yes | existing |
| `/vs/boldtrail` | VsBoldTrail | yes | existing |
| `/vs/ixact` | VsIxact | yes | existing |
| `/vs/lofty` | VsLofty | yes | existing |
| `/vs/wise-agent` | VsWiseAgent | yes | existing |
| `/what-is-a-real-estate-crm` | WhatIsARealEstateCRM | yes | existing |

## Disposition summary

All 89 public routes already exist and are mapped. The brief's proposed paths
that do **not** exist are the conditional/competitor-only ones in
`COMPETITOR-PAGE-MAP.csv` (dialer, IDX website, social studio, back office,
lead-gen services, autonomous agents) — none has an established capability, so
none is created. `/about` is the one genuinely new non-conditional page in the
brief that has no current route.
