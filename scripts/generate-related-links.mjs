#!/usr/bin/env node
/**
 * Generates src/config/relatedLinks.ts: the "Keep reading" links shown at the
 * foot of each public page and emitted into the prerendered HTML.
 *
 *   node scripts/generate-related-links.mjs
 *
 * WHY THIS EXISTS. An audit of production on 2026-10-02 found 45 of 87 indexed
 * pages with exactly one inbound link, from a single hub page. They were not
 * orphans, but nothing on the site said they were related to anything. Internal
 * links are how a crawler decides what a page is about and how much it matters,
 * so a comparison page linked only from a hub is weaker than it needs to be, and
 * a reader finishing a CASL guide had no route to the product page that answers
 * the next question.
 *
 * HOW. Pages are grouped into topical clusters. Each page links to the next few
 * members of its cluster IN A RING (page i lists members i+1, i+2, ... wrapping
 * around), which gives every member the same number of inbound links instead of
 * letting early entries hog them. A small cluster is topped up from a fill
 * cluster so no page is left with a single sibling. Each cluster can also point
 * at one or two commercial "next" pages, which is where a reader who has finished
 * the article should go.
 *
 * WHY A GENERATOR AND A COMMITTED FILE, NOT A FUNCTION. scripts/prerender-pages.js
 * is plain Node and cannot import TypeScript, and the same lists must reach the
 * static HTML that crawlers read and the React component that visitors see. Plain
 * data, read by both, cannot drift. relatedLinks.test.ts fails if this file is
 * stale relative to the clusters below, so editing a cluster means re-running
 * this script, and forgetting to is caught.
 *
 * ANCHOR TEXT. Each label describes the destination, written for a reader rather
 * than as a keyword. They are defined once, so the same page is described the same
 * way everywhere it is linked.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Anchor text per destination. */
const LABELS = {
  // comparisons
  '/compare': 'All comparisons',
  '/compare/boldtrail': 'Realtor Desk vs BoldTrail',
  '/vs/boldtrail': 'A BoldTrail alternative for Canadian agents',
  '/switch-from-boldtrail': 'Moving from BoldTrail',
  '/blog/vs-kvcore': 'kvCORE, now BoldTrail: what to ask first',
  '/vs/lofty': 'Realtor Desk vs Lofty',
  '/lofty-alternative': 'A Canadian alternative to Lofty',
  '/switch-from-lofty': 'Moving from Lofty',
  '/blog/vs-lofty-crm': 'Lofty CRM review for Canadian agents',
  '/vs/ixact': 'IXACT Contact vs Realtor Desk',
  '/switch-from-ixact': 'Moving from IXACT Contact',
  '/blog/ixact-alternatives': 'IXACT Contact alternatives',
  '/vs/wise-agent': 'Wise Agent vs Realtor Desk',
  '/switch-from-wise-agent': 'Moving from Wise Agent',
  '/switch-from-liondesk': 'Moving from LionDesk',
  '/blog/best-liondesk-alternative-canadian-realtors': 'LionDesk alternatives for Canadian realtors',
  '/switch-from-follow-up-boss': 'Moving from Follow Up Boss',
  '/blog/vs-follow-up-boss': 'Realtor Desk vs Follow Up Boss',
  '/compare/real-geeks-alternative': 'A Real Geeks alternative',
  '/compare/top-producer-alternative': 'A Top Producer alternative',
  '/blog/boomtown-alternative-canada': 'BoomTown alternatives for Canadian agents',
  '/blog/vs-propertybase': 'Propertybase vs Realtor Desk',
  // guides
  '/what-is-a-real-estate-crm': 'What a real estate CRM is',
  '/blog/best-crm-canada-2025': 'How to choose a CRM in Canada',
  '/blog/real-estate-crm-buying-guide': 'A buyer guide to real estate CRMs',
  '/resources/real-estate-crm-pricing': 'What a real estate CRM costs',
  '/resources/real-estate-crm-template': 'A free CRM spreadsheet template',
  '/ai-crm-canadian-real-estate-agents-guide': 'AI CRMs for Canadian agents',
  '/blog/ai-vs-traditional-crm': 'AI CRM against a traditional CRM',
  // compliance
  '/resources/casl-compliance-real-estate-email-marketing-canada': 'CASL for real estate email',
  '/features/casl-compliant-email': 'CASL-aware email in Realtor Desk',
  '/pipeda-compliance': 'PIPEDA and Realtor Desk',
  '/pipeda-compliance-real-estate-ai-tools-canada': 'PIPEDA and AI tools in real estate',
  '/fintrac-compliance': 'FINTRAC obligations for realtors',
  '/blog/compliance': 'A provincial compliance checklist',
  '/blog/crea-ddf': 'CREA DDF, explained',
  '/canadian-market': 'What built for Canada means here',
  // lead handling
  '/lead-response-time-canadian-realtors': 'Why Canadian agents lose hot leads',
  '/resources/cost-of-missed-real-estate-leads-canada': 'What missed leads can cost',
  '/resources/slow-follow-up-calculator-canadian-realtors': 'The slow follow-up calculator',
  '/real-estate-database-reactivation-canada': 'Reactivating a past-client database',
  '/blog/lead-conversion': 'Lead scoring and conversion',
  '/blog/real-estate-drip-campaign-templates-canada-2025': 'Drip campaign templates',
  '/blog/real-estate-lead-generation-strategies-canada-2025': 'Lead generation strategies',
  '/blog/open-house-digital-sign-in-sheets-vs-paper-2025': 'Open house sign-in sheets',
  // AI
  '/features/ai-powered-crm': 'Where AI helps in the CRM',
  '/features/ai-lead-scoring': 'How lead scoring works',
  '/features/ai-lead-follow-up': 'Follow-up: a suggested next action',
  '/resources/voice-ai-real-estate-lead-follow-up-canada': 'Voice AI for follow-up, explained',
  '/blog/ai-chatbot-real-estate-websites-canada': 'AI chatbots on real estate sites',
  '/blog/ai-transformation': 'How AI is changing Canadian real estate',
  '/canadian-realtors-thrive-slower-market-ai-automation': 'Working a slower market with AI',
  // product
  '/features': 'The platform',
  '/features/pipeline': 'The deal pipeline',
  '/features/conversations': 'One conversation per client',
  '/features/listing-import': 'Importing listings from Realtor.ca',
  '/features/import-contacts': 'Importing contacts from a CSV',
  '/features/bilingual-crm': 'Bilingual workflows',
  '/pricing': 'Pricing',
  '/how-it-works': 'How it works',
  '/integrations': 'Integrations',
  // audience and local
  '/use-cases/solo-agent': 'Realtor Desk for solo agents',
  '/use-cases/real-estate-team': 'Choosing a CRM for a team',
  '/use-cases/brokerage': 'Choosing a brokerage CRM',
  '/ca/toronto-realtor-crm': 'A CRM for Toronto realtors',
  '/ca/vancouver-realtor-crm': 'A CRM for Vancouver realtors',
  '/fr/crm-immobilier': 'CRM immobilier, en français',
  '/blog/bilingual-marketing': 'Bilingual real estate marketing',
  // market and consumer pages
  '/canada-housing-market-forecast-2025-2026': 'Housing market forecast, 2025 to 2026',
  '/toronto-vs-vancouver-real-estate-market-2025': 'Toronto against Vancouver',
  '/edmonton-real-estate-market-2025': 'The Edmonton market',
  '/first-time-home-buyer-guide-canada-2025': 'A first-time buyer guide',
  '/sell-home-fast-canada-2025': 'Selling a home fast',
  '/resources/calgary-real-estate-marketing-strategies': 'Calgary marketing strategies',
  '/resources': 'All guides',
  // company
  '/about': 'About Realtor Desk',
  '/blog/community-launch': 'The Realtor Desk community',
  '/partners': 'The partner program',
  '/contact': 'Contact us',
  '/faq': 'Frequently asked questions',
};

// Every comparison URL, not just one per vendor. With only the canonical pages in
// the pool, the comparison blog posts received links from their own cluster and
// nothing else, which left several with one or two inbound links.
const POOL_COMPARISONS = [
  '/compare/boldtrail', '/vs/boldtrail', '/switch-from-boldtrail', '/blog/vs-kvcore',
  '/vs/lofty', '/lofty-alternative', '/switch-from-lofty', '/blog/vs-lofty-crm',
  '/vs/ixact', '/switch-from-ixact', '/blog/ixact-alternatives',
  '/vs/wise-agent', '/switch-from-wise-agent',
  '/switch-from-liondesk', '/blog/best-liondesk-alternative-canadian-realtors',
  '/switch-from-follow-up-boss', '/blog/vs-follow-up-boss',
  '/compare/real-geeks-alternative', '/compare/top-producer-alternative',
  '/blog/boomtown-alternative-canada', '/blog/vs-propertybase',
];

/**
 * Clusters, in priority order: a page that belongs to several takes its siblings
 * from the first. `fill` names a pool used to top a small cluster up to four
 * siblings; `next` lists where a finished reader should go.
 */
const CLUSTERS = [
  { id: 'boldtrail', fill: POOL_COMPARISONS, next: ['/compare', '/blog/best-crm-canada-2025'],
    members: ['/compare/boldtrail', '/vs/boldtrail', '/switch-from-boldtrail', '/blog/vs-kvcore'] },
  { id: 'lofty', fill: POOL_COMPARISONS, next: ['/compare', '/blog/best-crm-canada-2025'],
    members: ['/vs/lofty', '/lofty-alternative', '/switch-from-lofty', '/blog/vs-lofty-crm'] },
  { id: 'ixact', fill: POOL_COMPARISONS, next: ['/compare', '/blog/best-crm-canada-2025'],
    members: ['/vs/ixact', '/switch-from-ixact', '/blog/ixact-alternatives'] },
  { id: 'wise-agent', fill: POOL_COMPARISONS, next: ['/compare', '/blog/best-crm-canada-2025'],
    members: ['/vs/wise-agent', '/switch-from-wise-agent'] },
  { id: 'liondesk', fill: POOL_COMPARISONS, next: ['/compare', '/blog/best-crm-canada-2025'],
    members: ['/switch-from-liondesk', '/blog/best-liondesk-alternative-canadian-realtors'] },
  { id: 'follow-up-boss', fill: POOL_COMPARISONS, next: ['/compare', '/blog/best-crm-canada-2025'],
    members: ['/switch-from-follow-up-boss', '/blog/vs-follow-up-boss'] },
  { id: 'other-vendors', fill: POOL_COMPARISONS, next: ['/compare', '/blog/best-crm-canada-2025'],
    members: ['/compare/real-geeks-alternative', '/compare/top-producer-alternative', '/blog/boomtown-alternative-canada', '/blog/vs-propertybase'] },
  { id: 'choosing-a-crm', next: ['/pricing', '/features'],
    members: ['/what-is-a-real-estate-crm', '/blog/best-crm-canada-2025', '/blog/real-estate-crm-buying-guide', '/resources/real-estate-crm-pricing', '/resources/real-estate-crm-template', '/ai-crm-canadian-real-estate-agents-guide', '/blog/ai-vs-traditional-crm', '/features/import-contacts'] },
  { id: 'compliance', next: ['/features/casl-compliant-email', '/pricing'],
    members: ['/resources/casl-compliance-real-estate-email-marketing-canada', '/pipeda-compliance', '/pipeda-compliance-real-estate-ai-tools-canada', '/fintrac-compliance', '/blog/compliance', '/blog/crea-ddf', '/canadian-market', '/features/casl-compliant-email'] },
  { id: 'lead-handling', next: ['/features/ai-lead-scoring', '/features/ai-lead-follow-up'],
    members: ['/lead-response-time-canadian-realtors', '/resources/cost-of-missed-real-estate-leads-canada', '/resources/slow-follow-up-calculator-canadian-realtors', '/real-estate-database-reactivation-canada', '/blog/lead-conversion', '/blog/real-estate-drip-campaign-templates-canada-2025', '/blog/real-estate-lead-generation-strategies-canada-2025', '/blog/open-house-digital-sign-in-sheets-vs-paper-2025'] },
  { id: 'ai', next: ['/features', '/pricing'],
    members: ['/features/ai-powered-crm', '/features/ai-lead-scoring', '/features/ai-lead-follow-up', '/resources/voice-ai-real-estate-lead-follow-up-canada', '/blog/ai-chatbot-real-estate-websites-canada', '/blog/ai-transformation', '/canadian-realtors-thrive-slower-market-ai-automation'] },
  { id: 'product', next: ['/pricing', '/how-it-works'],
    members: ['/features/pipeline', '/features/conversations', '/features/import-contacts', '/features/listing-import', '/features/bilingual-crm', '/features/ai-lead-scoring', '/features/ai-lead-follow-up', '/features/casl-compliant-email'] },
  { id: 'audience-and-local', next: ['/pricing', '/about'],
    members: ['/use-cases/solo-agent', '/use-cases/real-estate-team', '/use-cases/brokerage', '/ca/toronto-realtor-crm', '/ca/vancouver-realtor-crm', '/fr/crm-immobilier', '/blog/bilingual-marketing', '/canadian-market'] },
  { id: 'market-and-consumer', next: ['/resources', '/what-is-a-real-estate-crm'],
    members: ['/canada-housing-market-forecast-2025-2026', '/toronto-vs-vancouver-real-estate-market-2025', '/edmonton-real-estate-market-2025', '/first-time-home-buyer-guide-canada-2025', '/sell-home-fast-canada-2025', '/resources/calgary-real-estate-marketing-strategies'] },
  { id: 'company', next: ['/pricing', '/features'],
    members: ['/about', '/blog/community-launch', '/partners', '/contact', '/faq'] },
];

const SIBLINGS = 4; // siblings per page, before the "next" links

const ring = (members, self, count) => {
  const i = members.indexOf(self);
  const out = [];
  for (let k = 1; k < members.length && out.length < count; k++) out.push(members[(i + k) % members.length]);
  return out;
};

const links = {};
for (const c of CLUSTERS) {
  for (const page of c.members) {
    if (links[page]) continue; // first cluster wins
    const picks = ring(c.members, page, SIBLINGS);
    if (picks.length < SIBLINGS && c.fill) {
      // Rotate the fill pool by this page's position so small clusters do not all
      // send their extra links to the same two pages.
      const start = c.members.indexOf(page) * 5 + POOL_COMPARISONS.indexOf(c.members[0]) + 1;
      for (let k = 0; picks.length < SIBLINGS && k < c.fill.length * 2; k++) {
        const cand = c.fill[(start + k) % c.fill.length];
        if (cand !== page && !picks.includes(cand) && !c.members.includes(cand)) picks.push(cand);
      }
    }
    for (const n of c.next) if (n !== page && !picks.includes(n)) picks.push(n);
    links[page] = picks;
  }
}

// A standalone French page shows no English "Keep reading" block. It is still a
// link TARGET, so it keeps the inbound links the other pages give it.
for (const k of Object.keys(links)) if (k.startsWith('/fr/')) delete links[k];

// ── verification before writing anything
const problems = [];
const sitemap = fs.readFileSync(path.join(root, 'public/sitemap.xml'), 'utf8');
const sitemapPaths = new Set(
  [...sitemap.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1].replace('https://www.realtordesk.ai', '') || '/'),
);
const inbound = {};
for (const [from, tos] of Object.entries(links)) {
  if (!sitemapPaths.has(from)) problems.push(`source not in sitemap: ${from}`);
  for (const to of tos) {
    if (!LABELS[to]) problems.push(`no label for ${to}`);
    if (!sitemapPaths.has(to)) problems.push(`target not in sitemap: ${to}`);
    inbound[to] = (inbound[to] ?? 0) + 1;
  }
}
for (const p of Object.keys(links)) if (!LABELS[p]) problems.push(`no label for ${p}`);
if (problems.length) {
  console.error('Refusing to write relatedLinks.ts:\n  ' + problems.join('\n  '));
  process.exit(1);
}

const keys = Object.keys(links).sort();
const body =
  `export const RELATED_LABELS: Record<string, string> = {\n` +
  Object.keys(LABELS).sort().map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(LABELS[k])},`).join('\n') +
  `\n};\n\n` +
  `export const RELATED_LINKS: Record<string, string[]> = {\n` +
  keys.map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(links[k])},`).join('\n') +
  `\n};\n`;

const header = `// GENERATED by scripts/generate-related-links.mjs. Do not edit by hand.
//
// The "Keep reading" links under each public page, and the same links in the
// prerendered HTML. Edit the clusters in the generator and re-run it:
//
//   node scripts/generate-related-links.mjs
//
// relatedLinks.test.ts fails if this file no longer matches the generator, if a
// target is not a real route, or if any page ends up with too few inbound links.

`;
const target = path.join(root, 'src/config/relatedLinks.ts');
if (process.argv.includes('--check')) {
  // Used by relatedLinks.test.ts. Writes nothing; fails if the committed file is
  // not exactly what the clusters above produce.
  const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
  if (current !== header + body) {
    console.error('src/config/relatedLinks.ts is out of date. Run: node scripts/generate-related-links.mjs');
    process.exit(1);
  }
  console.log('relatedLinks.ts is current');
  process.exit(0);
}
fs.writeFileSync(target, header + body);

const counts = Object.values(inbound);
const min = Math.min(...counts), max = Math.max(...counts);
console.log(`wrote src/config/relatedLinks.ts: ${keys.length} pages with related links`);
console.log(`inbound links from related blocks, per target: min ${min}, max ${max}`);
const uncovered = [...sitemapPaths].filter((p) => !links[p]).sort();
console.log(`sitemap pages with no related block (${uncovered.length}):\n  ${uncovered.join('\n  ')}`);
const weak = Object.entries(inbound).filter(([, n]) => n < 3).sort((a, b) => a[1] - b[1]);
console.log(`targets with fewer than 3 inbound from related blocks: ${weak.length}`);
for (const [p, n] of weak) console.log(`  ${n}  ${p}`);
