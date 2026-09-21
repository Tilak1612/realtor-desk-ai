# Competitor-driven SEO strategy — realtordesk.ai

Research source: OpenSEO (DataForSEO), Canadian market (location 2124, `en`).
Date: 2026-09-21. Project `0ae685b9-3393-46fc-8cc0-705b6b31ef69`.

All volumes, difficulties and positions below are measured, not estimated. Where
a number could not be measured it is called out rather than filled in.

---

## 1. Where we started

| Metric | Value |
|---|---|
| Organic traffic (Canada) | **1 / month** |
| Organic keywords ranked | **3** |
| Backlinks / referring domains | no data |

A 68-page site ranking for 3 keywords is not a content problem. The site crawl
explained why.

## 2. The finding that explains the other findings

OpenSEO's crawl of all 68 live URLs returned, for **every single page**:

| Issue | Pages affected |
|---|---|
| Duplicate `<title>` | 68 / 68 |
| Duplicate meta description | 68 / 68 |
| Missing `<h1>` | 68 / 68 |
| Thin content | 68 / 68 |
| No outgoing links | 68 / 68 |
| Orphan page | 67 / 68 |

Confirmed directly against production — `/`, `/pricing` and `/vs/wise-agent` all
served the identical `<title>` and description in raw HTML.

**Cause.** The site is a Vite SPA. `src/components/SEO.tsx` writes the title,
description, canonical and JSON-LD from a `useEffect`, so they only exist after
JavaScript runs. Google renders JS; the AI crawlers that decide AI Overview,
ChatGPT and Perplexity citations largely do not. To them the site was 68
identical empty shells.

Two compounding faults:

1. `vercel.json` had no `buildCommand`, so Vercel ran the default `vite build`
   and never invoked the prerender step at all.
2. `scripts/prerender-pages.js` would not have helped: it copied the *same*
   unmodified `index.html` to every route. Running it changed nothing.

This matters more than usual here because **AI Overviews occupy rank 1 on 6 of
the 8 target SERPs** measured. The single largest ranking surface in this market
was structurally unreachable.

## 3. Real organic competitors

From SERP comparison across the category's keyword set. Only 2 of 18 seeds I
tested had measurable Labs data in Canada — the Canadian long-tail I expected
does not exist, which is itself a finding.

**Direct product competitors:** wiseagent.com (#1), sierrainteractive.com,
luxurypresence.com, myrealpage.com (Canadian), ixactcontact.com, topproducer.com.

**Non-product competitors that occupy the SERP:** capterra.ca, forbes.com,
reddit.com, salesforce.com, hubspot.com, monday.com.

**Beatable Canadian small fry ranking today:** joinrivercity.ca ranks #4/#5/#8
across three of our target queries with a single page. cdtechnology.ca,
agentroof.com and kreativehive.ca also hold top-10 slots. These are winnable.

## 4. The keyword gap — the core of this engagement

Wise Agent earns effectively all of its Canadian visibility from **one page**
(its homepage), ranking #2–3 for a tight cluster of generic synonyms:

| Keyword | Volume | KD | Their pos |
|---|---:|---:|---:|
| real estate crm | 480 | 29 | 2 |
| crm for real estate industry | 480 | 18 | 2 |
| real estate crms | 480 | 21 | 2 |
| real estate customer relationship management | 480 | 20 | 3 |
| crm for real estate agents | 170 | 13 | 2 |
| realtor crm | 170 | 25 | 2 |
| best crm for real estate | 110 | 18 | 2 |
| crm software for real estate | 110 | 20 | 2 |
| crm tool(s) for real estate | 110 | 25 | 2 |
| customer relationship management software for real estate | 110 | 25 | 2 |
| real estate crm systems | 110 | 19 | 2 |
| best crm for realtor | 110 | 25 | 3 |
| client management software real estate | 110 | 36 | 3 |
| **Total** | **~2,800/mo** | **13–36** | |

Against what Realtor Desk was targeting:

| Keyword | Volume | KD |
|---|---:|---:|
| real estate crm canada | 30 | 32 |
| best crm for real estate canada | 30 | 33 |
| real estate software canada | 10 | 27 |
| **Total** | **~70/mo** | |

**The site was optimised for a keyword set roughly 40× smaller than the one that
is both larger and easier.** The Canadian positioning is correct and stays — the
error was treating "Canadian" as the primary *keyword* rather than the
differentiator in the copy.

Note the homepage H1 was `Every lead in one place. Built for Canada.` — it did
not contain "CRM" or "real estate" at all.

## 5. Cluster map — one intent per page, no cannibalisation

| Page | Intent | Primary target | Volume |
|---|---|---|---:|
| `/` | Commercial, head term | real estate crm + 12 synonyms | ~2,800 |
| `/canadian-market` | Commercial, Canada-qualified | real estate crm canada | 30 |
| `/blog/best-crm-canada-2025` | Commercial investigation | best crm for real estate canada | 30 |
| `/what-is-a-real-estate-crm` **(new)** | Informational / definitional | what is real estate crm | 50 |
| `/vs/*`, `/switch-from-*` | Brand comparison | competitor brand terms | varies |

The `/canadian-market` vs `/blog/best-crm-canada-2025` split is drawn on SERP
page type, not guesswork: the "…crm canada" SERP returns product homepages
(IXACT, Wise Agent), the "best crm…canada" SERP returns listicles and Reddit.

## 6. What was implemented

**Technical — the unblocker**

- `scripts/prerender-pages.js` rewritten into a real static-shell generator. It
  takes its route list from `sitemap.xml` (so the two cannot drift), resolves
  each route through the `App.tsx` table, follows in-file gate components, and
  lifts the real title/description/canonical off each page's `<SEO>` —
  including `t('key')`, `t('key','fallback')` and the homepage `isFr` ternary.
- Emits per-page title, description, canonical, hreflang and `BreadcrumbList`
  JSON-LD, plus an `#root` shell carrying the page's own H1, description, body
  copy and the site navigation.
- `vercel.json` now builds with `npm run build:seo`.
- The build **fails** if any sitemap URL lacks a unique title, emits other than
  exactly one H1, or leaves raw JSX in a title.

Result, verified on the build output:

| | Before | After |
|---|---|---|
| Unique titles | 1 / 68 | **68 / 68** |
| Unique descriptions | 1 / 68 | **68 / 68** |
| Pages with exactly one H1 | 0 / 68 | **68 / 68** |
| Avg. static words per page | ~35 | **396** |
| Outgoing links per page | 0 | 15 |

**Content and targeting**

- Homepage H1 → `Every lead in one place. The real estate CRM for Canada.`
  Title → `Real Estate CRM for Canadian Agents | Realtor Desk`. Both languages.
- New `/what-is-a-real-estate-crm` for "what is real estate crm" (50/mo, **KD
  5** — the lowest-difficulty term with real volume in the set). Its SERP is an
  AI Overview over Salesforce/HubSpot/Capterra, so it answers in the first two
  sentences and mirrors the People Also Ask set in FAQPage schema.
- Stale years: 15 pages said "2025" in September 2026, while Forbes ranks with
  "10 Best Real Estate CRMs of 2026". The year was **removed** from the nine
  evergreen ones rather than bumped — no year-modified keyword here has
  measurable volume, so it earns nothing and only decays, and bumping would
  imply a 2026 review that has not happened.
- `/blog/success-story` was in the sitemap but redirects to `/resources`;
  removed, since sitemaps must not list redirects.

## 7. Corrections to my own earlier reads

- I first reported Top Producer as "the biggest competitor-brand cluster
  (~310/mo)". That over-counted: most of it is navigational login traffic
  (`top producer login` 140, `top producer 8i login` 90) that will never convert
  and that we cannot win. Addressable comparison intent is **~80/mo**
  (`top producer crm` 40, `top producer software` 30, `top producer crm reviews`
  10) — worth a page, but not a priority.
- 16 of the 18 Canadian long-tail seeds I expected to find returned no Labs
  data. The Canadian-modifier long-tail largely does not exist.

## 8. Not done — and why

- **`/vs/top-producer` and `/switch-from-top-producer`** (~80/mo). The only
  measurable competitor-brand gap left. Straightforward given the existing
  comparison templates.
- **Six pages presenting 2025 market data** (`/canada-housing-market-forecast-2025-2026`,
  `/toronto-vs-vancouver-…-2025`, `/edmonton-real-estate-market-2025`,
  `/first-time-home-buyer-guide-canada-2025`, `/sell-home-fast-canada-2025`,
  `/resources/cost-of-missed-real-estate-leads-canada`). These need a genuine
  data refresh. I did not bump their years, because relabelling stale figures as
  current would misrepresent them, and I will not invent 2026 market numbers.
- **Four consumer-intent pages** (first-time buyer, sell-home-fast,
  Toronto-vs-Vancouver, Edmonton market) target home buyers and sellers, not
  agents. That is off-ICP traffic for a B2B SaaS. Worth a decision on whether
  they stay.
- **French**: the new page is English-only, matching the existing comparison
  pages. The prerendered shell is the `en-CA` default; `?lang=fr` still depends
  on JS, so FR has the same crawler invisibility the EN site just lost. This is
  the largest remaining technical gap.
- **`/pricing`, `/faq`, `/resources`** still prerender thin (70–102 words)
  because their content lives in data arrays rather than JSX prose.
- **Re-audit**: the OpenSEO crawl reads the live site, so it cannot confirm these
  fixes until the branch is deployed. Verification above is against the build
  output. Re-run `run_site_audit` after deploy.

## 9. Recommended order next

1. Deploy and re-run the OpenSEO site audit to confirm the six issue classes clear.
2. Submit the updated sitemap in Search Console; request indexing for `/` and
   `/what-is-a-real-estate-crm`.
3. Prerender the French variants.
4. Build the Top Producer comparison pair.
5. Decide on the consumer-intent pages; refresh or retire the 2025 data pages.

Expect no movement for weeks — the pages have to be recrawled before any of this
registers. The correct early signal is pages becoming *indexed with their own
titles* in Search Console, not ranking changes.
