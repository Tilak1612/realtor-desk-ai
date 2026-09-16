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
