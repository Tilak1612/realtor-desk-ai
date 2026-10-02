#!/usr/bin/env node
/**
 * Keeps the SPA fallback rewrites in vercel.json equal to the routes declared
 * in src/App.tsx.
 *
 * WHY. The old config had one catch-all rewrite to /index.html, so every unknown
 * URL (/this-does-not-exist) answered HTTP 200 with the homepage shell and
 * `robots: index, follow` — a soft-404 that search engines may index. Now only
 * URLs the router actually knows are rewritten to the app shell; anything else
 * falls through to Vercel's 404 (dist/404.html, which is noindex).
 *
 * Prerendered pages are plain files and never reach a rewrite. The rewrites
 * only serve routes with no file: /login, /app/*, parameterised pages, and
 * <Navigate> redirects declared in the router.
 *
 *   node scripts/sync-vercel-rewrites.mjs          # write vercel.json
 *   node scripts/sync-vercel-rewrites.mjs --check  # exit 1 if out of date
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appSrc = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf-8');
const vercelPath = path.join(root, 'vercel.json');

export function routeSources() {
  const out = new Set();
  for (const m of appSrc.matchAll(/<Route[^>]*?\spath="([^"]+)"/g)) {
    let p = m[1];
    if (p === '*') continue; // the router's own 404 is what unknown URLs must NOT reach
    if (!p.startsWith('/')) throw new Error('Relative route path in App.tsx: ' + p);
    p = p.replace(/\/\*$/, '/:path*');
    out.add(p);
  }
  return [...out].sort();
}

const sources = routeSources();
if (sources.length < 100) {
  console.error('✖ Only ' + sources.length + ' routes parsed from App.tsx; refusing to write a partial list.');
  process.exit(1);
}
const config = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'));
const rewrites = sources.map((source) => ({ source, destination: '/index.html' }));
const next = JSON.stringify({ ...config, rewrites }, null, 2) + '\n';

if (process.argv.includes('--check')) {
  if (fs.readFileSync(vercelPath, 'utf-8') !== next) {
    console.error('✖ vercel.json rewrites are out of date. Run: node scripts/sync-vercel-rewrites.mjs');
    process.exit(1);
  }
  console.log('✔ vercel.json rewrites match src/App.tsx (' + sources.length + ' routes).');
} else {
  fs.writeFileSync(vercelPath, next);
  console.log('✔ Wrote ' + sources.length + ' rewrites to vercel.json.');
}
