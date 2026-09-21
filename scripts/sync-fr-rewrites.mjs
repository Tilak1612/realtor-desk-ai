#!/usr/bin/env node

/**
 * Keeps the `?lang=fr` rewrites in vercel.json in step with sitemap.xml.
 *
 * The French variant is served at `?lang=fr`, and Vercel cannot vary a static
 * file by query string — so the prerenderer writes French into dist/fr/<route>
 * and these rewrites point `?lang=fr` at that tree. No user-facing URL changes.
 *
 * The rules are enumerated rather than written as one catch-all on purpose. A
 * blanket `/:path*` -> `/fr/:path*` would 404 any route without a prerendered
 * French file — including /login?lang=fr and /signup?lang=fr, which the French
 * auth flow uses. Only routes we actually prerender are rewritten; everything
 * else falls through to the SPA as before.
 *
 * vercel.json is read by Vercel before the build runs, so this cannot be a
 * build step — it is committed. `npm run test` fails if the two drift.
 *
 * Usage: node scripts/sync-fr-rewrites.mjs [--check]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const SITE = 'https://www.realtordesk.ai';

export function sitemapRoutes() {
  const xml = fs.readFileSync(path.join(repoRoot, 'public/sitemap.xml'), 'utf-8');
  const routes = [];
  for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
    const url = m[1];
    if (!url.startsWith(SITE)) continue;
    const pathname = url.slice(SITE.length) || '/';
    if (pathname.includes('*') || path.extname(pathname)) continue;
    routes.push(pathname.replace(/\/$/, '') || '/');
  }
  return [...new Set(routes)];
}

export function frRewrites() {
  return sitemapRoutes().map((route) => ({
    source: route,
    has: [{ type: 'query', key: 'lang', value: 'fr' }],
    destination: route === '/' ? '/fr/index.html' : `/fr${route}`,
  }));
}

const isFrRule = (r) =>
  Array.isArray(r.has) && r.has.some((h) => h.type === 'query' && h.key === 'lang');

function main() {
  const p = path.join(repoRoot, 'vercel.json');
  const cfg = JSON.parse(fs.readFileSync(p, 'utf-8'));
  const wanted = frRewrites();
  const others = (cfg.rewrites ?? []).filter((r) => !isFrRule(r));

  // French rules must precede the SPA catch-all.
  cfg.rewrites = [...wanted, ...others];

  const next = JSON.stringify(cfg, null, 2) + '\n';
  const current = fs.readFileSync(p, 'utf-8');

  if (process.argv.includes('--check')) {
    if (next !== current) {
      console.error('✖ vercel.json FR rewrites are out of date. Run: node scripts/sync-fr-rewrites.mjs');
      process.exit(1);
    }
    console.log(`✔ vercel.json FR rewrites match the sitemap (${wanted.length} routes).`);
    return;
  }

  fs.writeFileSync(p, next, 'utf-8');
  console.log(`✔ Wrote ${wanted.length} French rewrites to vercel.json.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  main();
}
