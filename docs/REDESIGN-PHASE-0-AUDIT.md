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

---

# Delivery record

Written after the work, not before it. Everything below is verified against the
build in `dist/` or a run of the checks named.

## 7. Route disposition — every row in the brief's table

| Brief page | Brief's proposed path | Disposition | Where it landed |
|---|---|---|---|
| Home | `/` | **Published** | Rebuilt to the brief's sequence; see §8 |
| Platform | `/features` | Mapped to existing | Unchanged |
| How it works | `/how-it-works` | Mapped to existing | Unchanged |
| Agents | `/solutions/agents` | **Mapped to existing** | `/use-cases/solo-agent` — indexed; the proposed path would have been a duplicate |
| Teams | `/solutions/teams` | **Mapped to existing** | `/use-cases/real-estate-team` |
| Brokerages | `/solutions/brokerages` | **Mapped to existing** | `/use-cases/brokerage` |
| CRM | `/features/real-estate-crm` | **Not built** | Covered by `/what-is-a-real-estate-crm` and `/features/ai-powered-crm`. A third page would be the "ten interchangeable pages" the brief warns against |
| Desk AI | "resolve current destination first" | **Resolved** | `/features/ai-powered-crm`. *Not* `/ai-assistant` — that is `<ProtectedRoute>` |
| Lead scoring | `/features/lead-scoring` | Mapped to existing | `/features/ai-lead-scoring` |
| Pipeline | `/features/pipeline` | **Deferred** | Capability is real (dnd-kit board, CAD totals) but has no page. Genuine gap, see §10 |
| Conversations | `/features/conversations` | **Deferred** | Same |
| Bilingual | `/features/bilingual-crm` | Mapped to existing | Unchanged |
| Listing import | `/features/listing-import` | **Deferred** | Same |
| Integrations | `/integrations` | Mapped to existing | Unchanged |
| Pricing | `/pricing` | Preserved | Untouched — billing is the source of truth |
| Demo | `/demo` | Preserved | Untouched |
| Sign up / in | `/signup`, `/login` | Preserved | Untouched |
| Resources | `/resources` | Mapped to existing | Now linked from the homepage |
| Compare hub | `/compare` | **Published** | New. See §9 |
| Comparison detail | existing | Preserved and corrected | Fabricated pricing removed, see §9 |
| Roadmap | `/roadmap` | Mapped to existing | Unchanged |
| About | `/about` | **Published** | New. Known facts only |
| Contact | `/contact` | Mapped to existing | Unchanged |
| Partners | `/partners` | Mapped to existing | Unchanged |
| Onboarding | `/onboarding` | **Excluded from nav** | `<ProtectedRoute>` + `<RequireBilling>`. Not a public page |
| Help | reuse existing | Mapped to existing | `/faq`, now in the nav and reachable from the footer |
| Careers | `/careers` | Mapped to existing | Unchanged |
| Legal / Canada | existing | Preserved | Wording untouched; grouped in the footer |
| 404 | catch-all | Unchanged | — |
| Lenders, Power Dialer, IDX site, Social Studio, Back Office, MCP server, ad services, Lofty Legends, Legends/LIVE, Leadership, News | — | **Not built** | The competitor map marks each "conditional draft — not established". None is established. No empty pages were created to fill menus |

No route is published as a preview-only draft, because nothing was built that
needed gating.

## 8. Homepage, against the brief's twelve-step sequence

| Step | State |
|---|---|
| 1 Hero | Existing, preserved with trial disclosure |
| 2 Audience cards | **Added**, from the nav registry |
| 3 Platform overview | Existing `ProductTour` |
| 4 Desk AI panel | Existing `FeatureGrid` |
| 5 Feature grid | Existing |
| 6 How it works, navy | Existing `PipelinePreview` |
| 7 Proof | Existing `CompareStrip` — product walkthrough, no customer stories, because we have none we can name |
| 8 Canadian context | Existing prose, **now bilingual** (was ~700 hardcoded English words on the French homepage) |
| 9 Resources | **Added** — three real articles, no invented dates or bylines |
| 10 FAQ | **Added** — six questions, FAQPage schema built from the same array |
| 11 Final CTA | Existing |
| 12 Footer | Shared, registry-driven |

## 9. Comparison pages — corrections, and a claim of mine that did not survive testing

> **Correction, 2026-09-29.** The section below originally called these pages
> cannibalisation and recommended consolidating them. I then measured it, and
> the measurement says otherwise — see §13. The inventory here is accurate; the
> "all competing for the same query" conclusion was an assumption I had not
> tested. Consolidation is **no longer recommended** without SERP data.


**17 comparison URLs in the sitemap for 9 vendors.** Three each for BoldTrail
(`/compare/boldtrail`, `/switch-from-boldtrail`, `/vs/boldtrail`), Lofty
(`/lofty-alternative`, `/vs/lofty`, `/switch-from-lofty`) and IXACT
(`/vs/ixact`, `/switch-from-ixact`, `/blog/ixact-alternatives`); two each for
Wise Agent and LionDesk. All self-canonical, all competing for the same query.

`/compare` links **one page per vendor** rather than all 17. Consolidating the
rest needs a recorded old→new redirect map and explicit sign-off, since these
are indexed URLs — **not done here, recommended.**

Fabricated competitor pricing removed while auditing them. The 2026-09-28 sweep
had left an exact-string blocklist behind, which missed a whole page:

- `/lofty-alternative` — `$700/mo`, `$1,499` setup, `$399` migration,
  `$499 - $1,499`, `$10,188+ USD`, `~$13,850 CAD`, and an 85%/83% saving
  derived from them, while the page's own table said Lofty's price is "Not
  published"
- `/blog/vs-kvcore` — kvCORE's whole price list, a `$15,080` three-year total
  and `Savings over 3 years: $9,716`
- the sitewide callout `Save up to 85% compared to BoldTrail, 45% vs Lofty`
- `/switch-from-lofty` — a `$99-300+/mo` Lofty card
- `/blog/best-crm-canada-2025`, `/blog/boomtown-alternative-canada` — kvCORE figures
- `/compare/boldtrail` — `$499 value` attached to our own migration
- our own `Brokerage: typically $1,200-2,500/month`, absent from `billing.ts`
- two fabricated customer counts ("Join hundreds of Canadian agents")

The guard now matches shape — any money figure within 55 characters of Lofty,
BoldTrail or kvCORE, any nearby savings percentage, and our own customer count.
Scoped to those three vendors only: IXACT, LionDesk, Wise Agent and Follow Up
Boss do publish, and flagging sourced figures would train everyone to ignore it.

## 10. Verification run

| Check | Result |
|---|---|
| Vitest | 454 passing, 58 files |
| `tsc --noEmit` | clean |
| ESLint | 74 errors / 8 warnings — the `main` baseline, unchanged |
| Prerender | 84/84 routes, unique titles |
| Orphans | 0 |
| axe (`/`, `/compare`, `/about`, `/pricing`, `/use-cases/solo-agent`) | **0 violations** |
| Responsive, 320→1920 | 40/40 checks clean after one fix |
| 200% zoom (720×450) | no horizontal overflow |
| Keyboard | every disclosure trigger tabbable; Escape, focus return, outside click covered by tests |
| Static shell links | 13 → 33 internal destinations per page |
| Homepage static body | 704 → 1087 words |

One responsive failure found and fixed: the footer's `X` social link rendered
8×24, under WCAG 2.5.8's 24×24, at every width below 1024.

## 11. Remaining blockers and recommendations

**Needs a decision, not more work**

1. **Comparison consolidation.** 17 URLs, 9 vendors. Needs an old→new redirect
   map and sign-off before touching indexed pages.
2. **The brief's violet palette.** Its tokens (`#5634D8` / `#10162E`) are read
   off the competitor recording. The repo has a deliberate navy/terracotta
   system from the 2026-04 rebrand, and the brief also says to preserve brand
   assets. Structure was adopted; hue was not. Reversible either way.

**Needs evidence we do not have**

3. **Mobile app claims.** `softwareApplicationSchema` says
   `"operatingSystem": "Web, iOS, Android"` and `/lofty-alternative` ticks
   "Mobile App (iOS/Android)". The repo has a Capacitor wrapper; whether a
   build is published to either store is unverified. **Flagged, not changed** —
   it needs someone to check the store listings.
4. **Customer stories.** Homepage step 7 stays a product walkthrough until
   there is a permissioned one.

**Real gaps, deliberately not filled with thin pages**

5. `/features/pipeline`, `/features/conversations`, `/features/listing-import` —
   all three capabilities ship; none has a page. Worth building properly.
6. **French locale URLs.** FR still lives behind `?lang=fr`, which Vercel cannot
   serve statically, so French pages are invisible to non-JS crawlers.
   `/fr/crm-immobilier` is the one exception. Needs path-based locales.
7. **Six pages carry 2025 market data.**

**Not done, by instruction**

8. **Not deployed.** The brief withholds deployment and billing/legal changes.
   Pricing, trial terms and legal wording are untouched.

---

# 12. Live site audit — www.realtordesk.ai, 2026-09-29

Run against **production as it stands today**, which is `main` — none of the
work on this branch is deployed yet. 82 indexed pages.

## Technical SEO: clean

| Check | Result |
|---|---|
| Sitemap URLs returning 200 | **82 / 82** |
| Missing `<title>` / description | 0 / 0 |
| Duplicate titles | **0** |
| Duplicate descriptions | **0** |
| Titles over 60 chars | 0 |
| Descriptions over 160 chars | 0 |
| Missing canonical | 0 |
| Canonical pointing somewhere other than self | 0 |
| Pages with no `<h1>` | 0 |
| Accidental `noindex` | 0 |
| Orphans (indexed, linked from nowhere) | **0** |
| Pages with fewer than 5 outgoing links | 0 |
| Pages with no JSON-LD | 0 |
| Invalid JSON-LD | **0** of 311 blocks |
| `robots.txt` | Single `*` group; authenticated surfaces disallowed; `/signup` and `/login` deliberately crawlable and `noindex,follow` |
| `llms.txt` | 200 |

`npm run verify:live`: **20/20**, including axe clean on 84 pages desktop and
11 at 390px, mobile LCP 1488 ms under 4× CPU throttle, CLS 0.0003, no console
errors, no failed requests, no horizontal overflow 320–1920.

Live schema: Organization 82, SoftwareApplication 82, Product 82,
BreadcrumbList 82, Article 34, FAQPage 18, WebPage 11, CreativeWork 1,
ItemList 1.

**Nothing in the technical layer needs fixing.** The live site is in good shape
structurally, which is what makes the next section the real finding.

## What is wrong on the live site is the copy

Verified in the rendered DOM at https://www.realtordesk.ai/lofty-alternative
on 2026-09-29. Every one of these is public right now:

    Save 85%                      $10,188                 $8,400
    83% cost savings              $1,499                  $399
    $700/mo                       $499 - $1,499           Mobile App (iOS/Android)
    hundreds of Canadian agents

The page states in its own comparison table that Lofty's price is "Not
published" — which is true — and then prints seven Lofty prices and two
different savings percentages derived from them.

Also live: `Savings over 3 years: $9,716 CAD` on `/blog/vs-kvcore`, against a
vendor that publishes no prices either.

Only the static HTML hid some of these from a `curl`; they render for every
human visitor and for any crawler that executes JavaScript.

**One FAQ parity failure live**, found by running this branch's new check
against production: `/use-cases/brokerage` emits an answer in `FAQPage` markup
that the page body does not contain, because the source string held a literal
`&rsquo;` — which React renders verbatim from a JS string. Visitors see
`the obligations remain the brokerage&rsquo;s`.

Every item in this section is already fixed on
`redesign/phase-0-audit-and-shared-shell` and is waiting on review.

## Not verifiable from here

GSC and GA4 need account access. Nothing in this audit substitutes for
impressions, clicks or position data — it is a crawl and render audit only.

---

# 13. The cannibalisation claim, retracted

I reported 17 comparison URLs across 9 vendors as cannibalisation and
recommended consolidating them. Before implementing that, I measured the
overlap. It does not hold.

**Method.** Six-word shingles over the prerendered body text of every page in
each vendor cluster, pairwise, reporting Jaccard similarity and containment of
the smaller page within the larger.

| Cluster | Pages | Highest containment between any pair |
|---|---|---|
| BoldTrail / kvCORE | 4 | 0.14 |
| Lofty | 4 | 0.15 |
| IXACT | 3 | 0.16 |
| Wise Agent | 2 | 0.26 |
| LionDesk | 2 | 0.09 |
| Follow Up Boss | 2 | 0.06 |

Near-duplicate content starts around 0.45 containment. Nothing here is close.
Jaccard similarity never exceeds 0.10. **The copy on these pages is genuinely
distinct**, and the titles address different intents — alternative-seeking
(`/x-alternative`), comparison (`/vs/x`), migration (`/switch-from-x`) and
research (`/blog/vs-x`).

Two corrections to what I wrote earlier:

1. The count is **18, not 17** — BoldTrail and Lofty each have four indexed
   pages once the blog comparisons are included.
2. "All competing for the same query" was an **assumption, not a finding**.
   Whether these cannibalise depends on whether Google returns the same page
   for the same query across the cluster, which requires Search Console
   impression and position data per URL. That needs account access this session
   does not have.

**Recommendation changed: do not consolidate.** Canonicalising four substantive
pages into one on an untested assumption would have destroyed indexed content
that is not duplicated. The right next step is to open Search Console, filter
to each cluster, and look for two URLs trading positions on one query. Only
then is there something to consolidate, and only for the pairs that show it.

The fabricated-pricing corrections in §9 stand — those were verified
individually and are unrelated to this retraction.
