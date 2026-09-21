# SEO / AEO / GEO audit — realtordesk.ai

Audited 2026-09-16 against the live production site, the codebase, and the
production Supabase project. Every finding below was verified, not inferred.

---

## 1. What was already good

Earlier rounds did real work, and this audit did not need to redo it:

- `SEO.tsx` writes metadata directly to the DOM rather than through
  react-helmet-async, which is inert under React 19 — a prior audit caught that
  every page was serving the homepage's title. Per-page `<title>`, description,
  canonical, OG, Twitter and JSON-LD all apply correctly now.
- Canonical URLs are locale-aware: `?lang=fr` self-canonicalises to the French
  URL instead of collapsing into English.
- `hreflang` emits `en-CA`, `fr-CA` and `x-default`.
- Structured data carries no fabricated `aggregateRating`; it was removed with
  a comment explaining why.
- `/signup` and `/login` are crawlable but `noindex,follow`, deliberately, so
  link equity flows without them appearing in SERPs.
- 62 pages pass axe at desktop and 11 at 390px with zero serious or critical
  violations. Mobile LCP is 672 ms under 4× CPU throttling; CLS is 0.

## 2. Findings, and what was done

### 2.1 robots.txt was void — three independent defects (Critical)

The file read as though it protected the authenticated app. It did not. Any one
of these alone would have voided the entire block list:

1. **A blank line after `Crawl-delay: 1` ended the `*` group.** Every
   `Disallow` beneath it belonged to no user-agent at all.
2. **A blanket `Allow: /` sat above the `Disallow` lines.** Google resolves by
   longest match, so `Disallow: /app` would have won there — but a
   first-match-wins parser takes the `Allow` and cancels the list.
3. **Named groups for Googlebot, Bingbot, GPTBot, ClaudeBot, Google-Extended
   and CCBot each contained only `Allow: /`.** A crawler obeys exactly one
   group, the most specific match, and ignores every other — including `*`. So
   those six were exempt from the block list by construction.

Net effect: `/app`, `/app/leads`, `/admin`, `/billing`, `/settings` and the
one-time-token pages were crawlable by every crawler that matters.

**Fixed.** One contiguous `*` group with no blank lines and no blanket `Allow`;
a single named group for CCBot that repeats the block list. Verified with two
independent parsers across 18 crawler tokens: 14 private paths blocked, 16
public paths allowed, for every one.

### 2.2 The AI-discovery files contradicted the website (Critical)

`llms.txt`, `llms-full.txt`, `ai-company-info.txt` and `knowledge-base.json`
exist to be ingested and quoted by answer engines. All four were still
asserting claims the site itself stopped making in #238, #240 and #241 — so the
corrected pages and the files feeding ChatGPT Search, Perplexity and Claude
were telling different stories, and the files were the ones written to be cited.

Removed because they were never measured:

| Claim | Where |
|---|---|
| "37% increase in closings reported by users" | ai-company-info.txt |
| "15+ hours saved weekly per agent" | ai-company-info.txt |
| "47-second average lead response" / "Sub-3-second AI response" | both files |
| "Canadian realtors lose 60-80% of leads" | ai-company-info.txt |
| "70% lower cost than Lofty CRM" | knowledge-base.json |
| "under 45 seconds" vs BoldTrail's "2–3 min" | llms.txt, llms-full.txt |
| "99.95% uptime SLA" | llms-full.txt |
| `metrics` block: response time, closing rate, hours saved, retention | knowledge-base.json |

Removed because the capability does not exist: a 24/7 lead-answering chatbot,
showings booked into a calendar, live CREA DDF MLS sync, Canadian-market drip
templates, team routing, granular roles, an immutable audit log, FINTRAC
workflows, market forecasting.

Also corrected: a `$999/yr` Solo tier that does not exist (removed from the
site in #231 but still quoted here); "~20 minutes" setup against "~10-min"
elsewhere; and four named competitors carrying unsourced `weakness` strings.

**Fixed.** All four rewritten from verified capability. Each now carries an
explicit *features not built* section and a correction notice naming the
retired claims, so an engine working from a cached copy is told they were
withdrawn.

### 2.3 Entity ambiguity (High)

`llms.txt` declares the canonical brand to be **Realtor Desk**, two words,
while `ai-company-info.txt` and `knowledge-base.json` said "RealtorDesk AI"
throughout — the exact ambiguity an answer engine has to guess its way through.
Headquarters was "Canada" in one file and "Edmonton, AB" in another.

**Fixed.** One brand string, one company name (Brainfy AI Inc.), one location
(Edmonton, Alberta), one support address, across all four files. Guarded.

### 2.4 Sitemap gaps (Medium)

Eight public routes returning HTTP 200 were absent: `/switch-from-follow-up-boss`,
`/switch-from-liondesk`, `/compare/boldtrail`,
`/resources/slow-follow-up-calculator-canadian-realtors`, and four `/blog/*`
pages. Every `lastmod` on the pages rewritten this session was stale, which
tells a crawler not to bother re-reading them.

**Fixed.** 60 → 68 URLs; `lastmod` refreshed on the 10 pages that changed.
A test asserts the sitemap contains nothing `robots.txt` disallows.

## 3. Crawler access report

Verified by parsing the new `robots.txt`, not by reading it.

| Class | Tokens | Public pages | Private app |
|---|---|---|---|
| Search | Googlebot, Bingbot, DuckDuckBot, Slurp, Applebot | Allowed | Blocked |
| AI search | OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Claude-SearchBot, Claude-User, Amazonbot | Allowed | Blocked |
| AI training | GPTBot, ClaudeBot, Google-Extended, Applebot-Extended | Allowed | Blocked |
| Archive | CCBot (crawl-delay 2) | Allowed | Blocked |
| Unknown | anything else, via `*` | Allowed | Blocked |

**OAI-SearchBot vs GPTBot.** These are separate tokens for separate purposes:
OAI-SearchBot surfaces pages in ChatGPT Search, GPTBot is the model training
crawler. Both are currently allowed.

**Training policy — unchanged.** The site permits AI training crawlers. That is
the owner's existing choice and this audit did not alter it. To opt out of
training without losing AI-search visibility, add groups for GPTBot, ClaudeBot,
Google-Extended and Applebot-Extended with `Disallow: /`, each repeating the
block list, and leave OAI-SearchBot, Claude-SearchBot and PerplexityBot alone.
The file documents this.

**Not verified.** Whether Vercel's WAF, bot protection or rate limiting blocks
any of these at the edge. `robots.txt` is only the polite layer; a 403 from the
edge is invisible to it. Checking needs access to the Vercel firewall config.

## 4. Entity map

```
Brainfy AI Inc.  (Organization, Edmonton, Alberta, Canada)
  └── Realtor Desk  (SoftwareApplication — CRM for real estate)
        ├── audience    Licensed Canadian real estate agents, teams, brokerages
        ├── market      Canada; English and Canadian French
        ├── plans       Solo $149/mo CAD · Team $299/mo CAD · Brokerage custom
        ├── trial       14 days, card at checkout, nothing charged before day 14
        ├── integrates  Google Calendar, Outlook, Google/Microsoft Contacts,
        │               Zapier, Make, n8n, Twilio, SMTP
        ├── roadmap     CREA DDF (Q3 2026), Centris (Q4 2026), sequence sending,
        │               website chat widget, team routing, roles + audit log
        └── not         CREA affiliation · security certification · FINTRAC
                        workflows · market forecasting · published metrics
```

## 5. Keyword → page map

One primary intent per page; no two pages target the same head term.

| Page | Primary intent | Query shape |
|---|---|---|
| `/` | real estate CRM Canada | commercial |
| `/features` | what the product does | commercial investigation |
| `/pricing` | real estate CRM pricing CAD | transactional |
| `/vs/ixact`, `/vs/boldtrail`, `/vs/lofty`, `/vs/wise-agent` | X vs Realtor Desk | comparison |
| `/switch-from-*` | migrating off X | comparison, high intent |
| `/canadian-market` | Canadian real estate CRM requirements | informational |
| `/pipeda-compliance`, `/fintrac-compliance` | Canadian compliance for realtors | informational |
| `/blog/*` | topic-specific informational | informational |

## 6. Conversational query map

Natural-language questions the corrected files now answer directly:

- *What is Realtor Desk?* → one-sentence definition, first line of every file.
- *Is there a CRM for Canadian real estate agents that works in French?* →
  bilingual EN/FR, per-contact language.
- *Does Realtor Desk integrate with MLS?* → no, not yet; Realtor.ca import
  today, CREA DDF targeted Q3 2026. Stated as a limitation, not buried.
- *How much does Realtor Desk cost?* → $149/$299 CAD, 14-day trial, card at
  checkout.
- *Is my data stored in Canada?* → yes, Canadian region.
- *Does it answer leads automatically?* → **no.** Explicitly answered, because
  the old files said yes.

## 7. What was NOT done, and why

- **IndexNow** — not implemented. It would need a key file and a deploy hook to
  ping on publish. Worth doing; it is a build-pipeline change rather than a
  content one, and it should not ride along in a truth-correction PR.
- **Vercel edge / WAF crawler check** — needs firewall config access.
- **Google Search Console / Bing Webmaster data** — no API credentials
  configured, so indexation and impressions could not be read. The Google
  verification file (`googleeec1cfed4e1b49f9.html`) is present and untouched.
- **`/market-intelligence`** still shows hardcoded arrays to signed-in agents
  as though they were real Canadian market data, with a CSV export. It is now
  `Disallow`ed in robots.txt, but taking it down or labelling it as sample data
  is a product decision.
- **Content expansion** — no new pages were written. The site already has ~100
  public routes; adding more before the existing ones are accurate would be
  the wrong order.

## 8. Plan

**30 days.** Implement IndexNow and wire it to the deploy. Connect Search
Console and Bing Webmaster Tools and read actual indexation rather than
inferring it. Decide what happens to `/market-intelligence`. Re-run the
comparison-page sweep for any claim this audit did not reach.

**60 days.** Capture real product screenshots
(`npm run capture:screenshots`) — the one remaining `verify:live` SKIP, and the
strongest available citable evidence. Audit the ~40 blog pages for the same
class of invented outcome figures found on the marketing pages; the
`$92,000 revenue` / `142% increase` / `391% more conversions` figures are known
to be there.

**90 days.** Publish something genuinely citable — the first real customer
story, or original data drawn from the product. Every GEO improvement short of
that is housekeeping: it makes the site understandable, but only real evidence
makes it worth citing.

## 9. Verification

| Check | Result |
|---|---|
| `tsc --noEmit` | clean |
| tests | 376/376 (362 before + 14 new) |
| lint | 68 errors / 8 warnings — unchanged baseline |
| production build | green; all six discovery files present in `dist/` |
| robots.txt, 18 crawler tokens | 14 private paths blocked, 16 public allowed, 0 wrong |
| sitemap.xml | valid XML, 68 unique canonical URLs, 0 conflicting with robots.txt |
| `knowledge-base.json` | parses; no metrics block |

Both new guards were mutation-checked: reinserting the blank line into
robots.txt, or a fabricated metric into `llms.txt`, makes them fail.


---

# Part 2 — Competitor-driven strategy and prerender fix (2026-09-21)

Research source: OpenSEO (DataForSEO), Canadian market (location 2124, `en`).
Date: 2026-09-21. Project `0ae685b9-3393-46fc-8cc0-705b6b31ef69`.

All volumes, difficulties and positions below are measured, not estimated. Where
a number could not be measured it is called out rather than filled in.

---

### 1. Where we started

| Metric | Value |
|---|---|
| Organic traffic (Canada) | **1 / month** |
| Organic keywords ranked | **3** |
| Backlinks / referring domains | no data |

A 68-page site ranking for 3 keywords is not a content problem. The site crawl
explained why.

### 2. The finding that explains the other findings

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

### 3. Real organic competitors

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

### 4. The keyword gap — the core of this engagement

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

### 5. Cluster map — one intent per page, no cannibalisation

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

### 6. What was implemented

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

### 7. Competitors rejected, and why

Not every competitor deserves a page. These were researched and **rejected on
the data**:

| Domain | Verdict |
|---|---|
| **topproducer.com** | Rejected. ~80/mo of addressable intent, and its site states it is operated by "Constellation1 Inc. and Emphasys Canada Holdings Inc." — a Canadian entity. The "US-built vs Canadian" angle our other comparison pages use would be **factually wrong** here, and the site states no pricing, no French support and no data-residency claim, so there is nothing verifiable left to compare on. Publishing it would mean inventing differentiators. |
| **ixactcontact.com** | Keep existing pages, do not expand. Its ~2,740/mo Canadian footprint is almost entirely brand navigation (`ixact contact login` 880, `ixact login` 880, `ixact` 590) that we cannot and should not target. |
| **myrealpage.com** | Not a competitor for CRM intent. Its traffic is consumer property search (`acreages for sale saskatoon`, `cottages for sale ontario`, `mls listings`) — it sells agent websites. It surfaced in the CRM SERP through a single blog post. |
| **capterra.ca / forbes.com / reddit.com / monday.com** | SERP occupants, not competitors. Worth pursuing as *placement* targets (see backlinks below), not as pages to outrank head-on. |

### 8. Competitor price claims — a live accuracy risk

The comparison pages publish **43 specific competitor price claims** across 15
pages. These are the highest-risk factual statements on the site: they decay
silently, and nothing regenerates them.

Spot-checking the most repeated one against `ixactcontact.com/pricing`
(2026-09-21) found two real defects, both now fixed:

- `/blog/ixact-alternatives` claimed "IXACT charges $39-59 USD/month ($53-80
  CAD)". IXACT actually lists **$46.75/mo billed annually, $55/mo billed
  monthly**. Two of our own pages disagreed with each other — `/vs/ixact` had
  the correct figure.
- The derived "$828-1,152 more than IXACT" and "saves you $828/year" figures
  were built on that wrong base *and* silently converted USD to CAD at an
  unstated rate. Each price now appears in the currency its vendor publishes.
- `/vs/ixact` compared "$46.75/mo" against "$149/mo CAD" without noting the
  IXACT figure is **USD**. Marked.

**The remaining 41 claims across 13 pages are unverified.** They should either
be checked against each vendor's live pricing page or replaced with qualitative
comparisons that do not rot.

### 9. Corrections to my own earlier reads

- I first reported Top Producer as "the biggest competitor-brand cluster
  (~310/mo)". That over-counted: most of it is navigational login traffic
  (`top producer login` 140, `top producer 8i login` 90) that will never convert
  and that we cannot win. Addressable comparison intent is **~80/mo**
  (`top producer crm` 40, `top producer software` 30, `top producer crm reviews`
  10) — worth a page, but not a priority.
- 16 of the 18 Canadian long-tail seeds I expected to find returned no Labs
  data. The Canadian-modifier long-tail largely does not exist.

### 10. Not done — and why

- **`/vs/top-producer`** — researched and deliberately **not built**; see
  "Competitors rejected" above. It would require claims I cannot verify.
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
- **French — attempted, reverted, and here is exactly why.** The FR variant
  lives at `?lang=fr`. I built locale-aware prerendering (68 FR pages with real
  French titles, H1s, `lang="fr-CA"` and `?lang=fr` canonicals) into
  `dist/fr/<route>`, and added `vercel.json` rewrites mapping `?lang=fr` onto
  that tree. **It does not work, and cannot.** Vercel checks the filesystem
  *before* applying rewrites, and filesystem matching ignores the query string
  — so `/pricing?lang=fr` matches `pricing/index.html` and the rewrite never
  fires. This is the same ordering that makes the English prerender work.
  Verified on the deployed preview: `?lang=fr` returned the English title.
  Reverted, because leaving `/fr/*` files that no React Router route matches
  would give crawlers indexable URLs that render the 404 page.

  **The real fix is path-based locales** (`/fr/pricing`), which needs three
  things together: i18n detection from the path prefix, React Router serving
  the `/fr` tree, and canonical/hreflang/sitemap moved onto the new URLs. That
  is a contained project, not a config tweak. Until then French is invisible to
  non-JS crawlers, exactly as it was before.
- **`/pricing`, `/faq`, `/resources`** still prerender thin (70–102 words)
  because their content lives in data arrays rather than JSX prose.
- **Re-audit**: the OpenSEO crawl reads the live site, so it cannot confirm these
  fixes until the branch is deployed. Verification above is against the build
  output. Re-run `run_site_audit` after deploy.

### 11. Recommended order next

1. Deploy and re-run the OpenSEO site audit to confirm the six issue classes clear.
2. Submit the updated sitemap in Search Console; request indexing for `/` and
   `/what-is-a-real-estate-crm`.
3. Prerender the French variants.
4. Build the Top Producer comparison pair.
5. Decide on the consumer-intent pages; refresh or retire the 2025 data pages.

Expect no movement for weeks — the pages have to be recrawled before any of this
registers. The correct early signal is pages becoming *indexed with their own
titles* in Search Console, not ranking changes.
