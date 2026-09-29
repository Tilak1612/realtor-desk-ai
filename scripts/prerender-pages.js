#!/usr/bin/env node

/**
 * Build-time static shell generation for the marketing site.
 *
 * WHY THIS EXISTS
 * ---------------
 * The site is a Vite SPA. `src/components/SEO.tsx` writes <title>, the meta
 * description, canonical and JSON-LD from a useEffect — which only runs once
 * JavaScript has executed. Google renders JS, but the AI crawlers that decide
 * AI Overview / ChatGPT / Perplexity citations largely do not.
 *
 * The 2026-09-21 crawl of the live site found, across all 68 sitemap URLs:
 *   68x duplicate <title>        68x duplicate meta description
 *   68x missing <h1>             68x thin content
 *   68x no outgoing links        67x orphan page
 *
 * i.e. to any crawler that does not run JS, the entire site was 68 identical
 * empty shells. That is the direct cause of the 3 ranked keywords the domain
 * had at the time.
 *
 * The previous version of this file wrote the SAME unmodified dist/index.html
 * to every route, so running it changed nothing at all.
 *
 * WHAT THIS DOES
 * --------------
 * For every URL in public/sitemap.xml (the sitemap is the source of truth for
 * what is indexable, so the two can never drift):
 *   1. Resolve the route to its page component via the App.tsx route table.
 *   2. Lift the <SEO> props — title / description / canonicalUrl — straight out
 *      of the page source. They are plain string literals, so this is exact.
 *   3. Emit dist/<route>/index.html with a correct head and a static shell
 *      inside #root containing the page's real H1, its description, and the
 *      site navigation.
 *
 * NOT CLOAKING: the shell is a faithful subset of the rendered page. The H1 is
 * the page's own H1, the copy is the page's own meta description, and the links
 * are the site's real Footer links. React's createRoot().render() clears #root,
 * so a visitor with JS never sees the shell — they get the full app, which
 * contains this same content and more.
 *
 * Usage: node scripts/prerender-pages.js   (runs via `npm run build:seo`)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.join(__dirname, '..');
const distDir = path.join(repoRoot, 'dist');
const SITE = 'https://www.realtordesk.ai';

// The one value both the nav registry and the @/content modules import. Read
// once, from its own config, and injected into every sandbox below — without
// it those modules throw on evaluation and their copy silently vanishes from
// the prerendered HTML while still rendering fine in the browser.
const CAL_ROUTE = (() => {
  const booking = fs.readFileSync(path.join(repoRoot, 'src/config/booking.ts'), 'utf8');
  const m = booking.match(/export const CAL_ROUTE\s*=\s*["']([^"']+)["']/);
  if (!m) throw new Error('prerender: CAL_ROUTE not found in src/config/booking.ts');
  return m[1];
})();

/* ------------------------------------------------------------------ *
 * 1. Routes to prerender — read from the sitemap so they never drift. *
 * ------------------------------------------------------------------ */

function readSitemapRoutes() {
  const xml = fs.readFileSync(path.join(repoRoot, 'public/sitemap.xml'), 'utf-8');
  const routes = [];
  for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
    const url = m[1];
    if (!url.startsWith(SITE)) continue;
    const pathname = url.slice(SITE.length) || '/';
    // Only prerender real page paths, never files or wildcards.
    if (pathname.includes('*') || path.extname(pathname)) continue;
    routes.push(pathname.replace(/\/$/, '') || '/');
  }
  return [...new Set(routes)];
}

/* ------------------------------------------------------------------ *
 * 1b. English translations, so t('key') SEO props can be resolved.    *
 * The bundle lives as a plain object literal in src/i18n/config.ts.   *
 * ------------------------------------------------------------------ */

function loadEnTranslations() {
  const src = fs.readFileSync(path.join(repoRoot, 'src/i18n/config.ts'), 'utf-8');
  const start = src.indexOf('const resources = ');
  if (start === -1) return {};
  const objStart = src.indexOf('{', start);

  // Balance braces while skipping over string literals.
  let depth = 0;
  let end = -1;
  let inString = null;
  for (let i = objStart; i < src.length; i++) {
    const c = src[i];
    if (inString) {
      if (c === inString && src[i - 1] !== '\\') inString = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      inString = c;
      continue;
    }
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end === -1) return {};

  try {
    const obj = new Function('return (' + src.slice(objStart, end + 1) + ')')();
    return obj?.en?.translation ?? {};
  } catch {
    return {};
  }
}

const EN = loadEnTranslations();

// Components often build their data arrays by calling t() at declaration —
// [{ question: t('faq.q1') }]. Without a t in scope those throw and the page
// loses its copy, which is why /faq prerendered at 91 words. Resolve through
// the same English bundle; an unknown key falls back to any default argument,
// then to empty, which the prose filter drops.
const sandboxT = (key, fallback) => {
  const v = lookup(key);
  if (typeof v === 'string') return v;
  return typeof fallback === 'string' ? fallback : '';
};

function lookup(key) {
  return key.split('.').reduce((acc, part) => (acc == null ? acc : acc[part]), EN);
}

// Turn `{t('a.b')}` or `{t('a.b', 'Fallback copy')}` into the English string.
// Returns null if anything is left unresolved, so the caller falls back rather
// than shipping raw JSX as a <title> — which is exactly what happened before
// the two-argument form was handled.
function resolveT(expr) {
  let missing = false;
  // Handles t('key'), t("key", "fallback"), and the multi-line form with a
  // trailing comma. Quotes are matched by backreference so an apostrophe
  // inside a double-quoted fallback does not end the match early.
  const out = expr.replace(
    /\{?\s*t\(\s*(["'])([^"']+)\1\s*(?:,\s*(["'])((?:\\.|(?!\3)[\s\S])*)\3\s*)?,?\s*\)\s*\}?/g,
    (_m, _q1, key, _q2, fallback) => {
      const v = lookup(key);
      if (typeof v === 'string') return v;
      if (typeof fallback === 'string') return fallback;
      missing = true;
      return '';
    },
  );
  // Any surviving t( means a form this parser does not understand.
  if (missing || /\bt\(/.test(out)) return null;
  return out;
}

/* --------------------------------------------------------- *
 * 2. Route -> page source file, from the App.tsx route table *
 * --------------------------------------------------------- */

function buildRouteFileMap() {
  const appSrc = fs.readFileSync(path.join(repoRoot, 'src/App.tsx'), 'utf-8');

  // const Foo = lazyWithRetry(() => import("./pages/Foo"));
  // const Foo = lazy(() => import("./pages/Foo"));
  // import Foo from "./pages/Foo";
  const componentToModule = new Map();
  for (const m of appSrc.matchAll(
    /const\s+(\w+)\s*=\s*(?:lazyWithRetry|lazy)\(\s*\(\)\s*=>\s*import\(\s*["']([^"']+)["']\s*\)/g,
  )) {
    componentToModule.set(m[1], m[2]);
  }
  for (const m of appSrc.matchAll(/^import\s+(\w+)\s+from\s+["'](\.\/[^"']+)["']/gm)) {
    if (!componentToModule.has(m[1])) componentToModule.set(m[1], m[2]);
  }

  // <Route path="/x" element={<Foo ... />} />
  const routeToComponent = new Map();
  const redirectRoutes = new Set();
  for (const m of appSrc.matchAll(
    /<Route\s+path=["']([^"']+)["']\s+element=\{\s*<(\w+)/g,
  )) {
    const routePath = m[1].replace(/\/$/, '') || '/';
    if (m[2] === 'Navigate') {
      redirectRoutes.add(routePath);
      continue;
    }
    if (!routeToComponent.has(routePath)) routeToComponent.set(routePath, m[2]);
  }

  // Some routes render a small in-file gate component (e.g. IntegrationsRoute
  // sends signed-in users to the dashboard). Follow it to the page it renders
  // for a signed-out visitor, which is what a crawler sees.
  const resolveWrapper = (component, seen = new Set()) => {
    if (componentToModule.has(component) || seen.has(component)) return component;
    seen.add(component);
    const decl = appSrc.match(
      new RegExp(`const\\s+${component}\\s*=\\s*\\([^)]*\\)\\s*=>\\s*\\{([\\s\\S]*?)\\n\\};`),
    );
    if (!decl) return component;
    // The last `return <X ... />` is the non-redirect render path.
    const renders = [...decl[1].matchAll(/return\s+<(\w+)/g)].map((r) => r[1]);
    const target = renders.reverse().find((r) => r !== 'Navigate' && componentToModule.has(r));
    return target ? resolveWrapper(target, seen) : component;
  };

  const routeToFile = new Map();
  for (const [routePath, rawComponent] of routeToComponent) {
    const component = resolveWrapper(rawComponent);
    const mod = componentToModule.get(component);
    if (!mod) continue;
    const rel = mod.replace(/^\.\//, 'src/');
    for (const ext of ['.tsx', '.ts', '/index.tsx']) {
      const candidate = path.join(repoRoot, rel + ext);
      if (fs.existsSync(candidate)) {
        routeToFile.set(routePath, candidate);
        break;
      }
    }
  }
  return { routeToFile, redirectRoutes };
}

/* ----------------------------------------- *
 * 3. Lift <SEO> props out of the page source *
 * ----------------------------------------- */

// Grabs prop="a plain string literal", or prop={t('key')} resolved to English.
function literalProp(block, name) {
  const lit = block.match(new RegExp(`\\b${name}=\\s*"((?:[^"\\\\]|\\\\.)*)"`, 's'));
  if (lit) {
    return lit[1].replace(/\\"/g, '"').replace(/\s+/g, ' ').trim() || null;
  }
  // prop={ ...expression... } — pull out the balanced braces.
  const at = block.search(new RegExp(`\\b${name}=\\s*\\{`));
  if (at === -1) return null;
  const open = block.indexOf('{', at);
  let depth = 0;
  let close = -1;
  for (let i = open; i < block.length; i++) {
    if (block[i] === '{') depth++;
    else if (block[i] === '}') {
      depth--;
      if (depth === 0) {
        close = i;
        break;
      }
    }
  }
  if (close === -1) return null;
  const expr = block.slice(open, close + 1);

  if (/\bt\(/.test(expr)) {
    const resolved = resolveT(expr);
    return resolved ? resolved.replace(/\s+/g, ' ').trim() || null : null;
  }

  // A locale ternary such as `isFr ? "…" : "…"`. Prerendered HTML is the
  // en-CA default (the FR variant is served at ?lang=fr), so take the
  // else-branch — the last string literal in the expression.
  const strings = [...expr.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]);
  if (/\bisFr\b|\blang\b|locale/.test(expr) && strings.length >= 2) {
    return strings[strings.length - 1].replace(/\\"/g, '"').replace(/\s+/g, ' ').trim() || null;
  }
  return null;
}

function extractSeoBlock(src) {
  const start = src.indexOf('<SEO');
  if (start === -1) return null;
  // Walk to the matching end of the JSX element, tracking brace depth so a
  // `/>` inside structuredData={...} does not end the block early.
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') depth--;
    else if (c === '>' && depth === 0 && src[i - 1] === '/') {
      return src.slice(start, i + 1);
    }
  }
  return null;
}

// Lift structuredData={[ ... ]} when it is a self-contained literal, so the
// page's own JSON-LD reaches crawlers that do not run JS. Pages that build
// their schema from a local const (FAQS.map(...)) cannot be evaluated here and
// are skipped rather than guessed at — they still get BreadcrumbList.
// Top-level `const NAME = [...]` / `{...}` literals from the page, so schema
// built as FAQS.map(...) can be evaluated without duplicating the copy into
// the <SEO> call. Anything referencing an import throws and is skipped.
// Declarations pulled in from a page's `@/content/*` module.
//
// The brief asks for new prose to live outside JSX, so pages now import their
// FAQ and card copy from src/content/*.ts. That broke schema lifting silently:
// the homepage's structuredData built its FAQPage from HOME_FAQS(isFr), an
// imported function, so the expression threw here and the page shipped with
// BreadcrumbList only — no FAQPage, and none of the answers in the static HTML.
//
// Resolving these imports is narrow on purpose: only "@/content/..." specifiers
// (never node_modules, never arbitrary source), and only top-level `export
// const` / `export function` declarations, type annotations stripped. Anything
// that fails to evaluate is dropped, exactly like a local const.
function importedContentPrelude(src) {
  const out = [];
  for (const m of src.matchAll(/import\s*\{([^}]+)\}\s*from\s*["']@\/content\/([\w./-]+)["']/g)) {
    const file = path.join(repoRoot, 'src/content', m[2].replace(/\.[jt]sx?$/, '') + '.ts');
    if (!fs.existsSync(file)) continue;
    const mod = fs.readFileSync(file, 'utf8');
    const wanted = m[1]
      .split(',')
      .map((n) => n.trim().split(/\s+as\s+/).pop().trim())
      .filter(Boolean);

    for (const name of wanted) {
      // `export function NAME(...) { ... }` — brace-matched, then stripped of
      // the parameter and return type annotations TypeScript adds.
      const fnAt = mod.search(new RegExp(`export\\s+function\\s+${name}\\b`));
      if (fnAt !== -1) {
        // Find the BODY brace, not the first one after the parameter list.
        // `function F(x: boolean): { heading: string }` puts an object literal
        // in the return-type annotation, so "first { after )" matched the type
        // and produced a declaration that threw — which is how the homepage's
        // prose silently vanished from the static HTML while still rendering in
        // the browser. Brace-match each candidate and take the first whose
        // contents contain a `return`; a type annotation never does.
        const open = (() => {
          let at = mod.indexOf(')', fnAt);
          for (;;) {
            const cand = mod.indexOf('{', at);
            if (cand === -1) return -1;
            let d = 0, q = null, close = -1;
            for (let i = cand; i < mod.length; i++) {
              const c = mod[i];
              if (q) { if (c === q && mod[i - 1] !== '\\') q = null; continue; }
              if (c === '"' || c === "'" || c === '`') { q = c; continue; }
              if (c === '{') d++;
              else if (c === '}') { d--; if (d === 0) { close = i; break; } }
            }
            if (close === -1) return -1;
            if (/\breturn\b/.test(mod.slice(cand, close))) return cand;
            at = close + 1;
          }
        })();
        if (open === -1) continue;
        let depth = 0, quote = null, end = -1;
        for (let i = open; i < mod.length; i++) {
          const c = mod[i];
          if (quote) { if (c === quote && mod[i - 1] !== '\\') quote = null; continue; }
          if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
          if (c === '{') depth++;
          else if (c === '}') { depth--; if (depth === 0) { end = i; break; } }
        }
        if (end !== -1) {
          const sig = mod.slice(fnAt, open);
          const params = sig.slice(sig.indexOf('(') + 1, sig.lastIndexOf(')'));
          const plain = params
            .split(',')
            .map((a) => a.split(':')[0].trim())
            .filter(Boolean)
            .join(', ');
          out.push(`function ${name}(${plain}) ${mod.slice(open, end + 1)}`);
          // A content module that exports HOME_FAQS(isFr) hands back its copy
          // only when called, so the declaration alone leaves the strings
          // unreachable to the prose extractor — which is how the homepage
          // ended up emitting FAQPage markup for answers the static HTML did
          // not contain. Materialise the English result under a marked name.
          const arity = plain ? plain.split(',').length : 0;
          if (arity <= 1) out.push(`const ${name}__CONTENT = ${name}(${arity ? 'false' : ''});`);
        }
        continue;
      }

      // `export const NAME = [...] | {...}`
      const cm = mod.match(new RegExp(`export\\s+const\\s+${name}\\s*(?::[^=]+)?=\\s*([\\[{])`));
      if (!cm) continue;
      const open = mod.indexOf(cm[1], cm.index);
      const closeCh = cm[1] === '[' ? ']' : '}';
      let depth = 0, quote = null, end = -1;
      for (let i = open; i < mod.length; i++) {
        const c = mod[i];
        if (quote) { if (c === quote && mod[i - 1] !== '\\') quote = null; continue; }
        if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
        if (c === cm[1]) depth++;
        else if (c === closeCh) { depth--; if (depth === 0) { end = i; break; } }
      }
      if (end !== -1) out.push(`const ${name} = ${mod.slice(open, end + 1)};`);
    }
  }

  // Same incremental guard the local prelude uses: one unusable declaration
  // must not cost the page its whole schema.
  const usable = [];
  for (const decl of out) {
    try {
      new Function('t', 'CAL_ROUTE', `${usable.join('\n')}\n${decl}`)(sandboxT, CAL_ROUTE);
      usable.push(decl);
    } catch {
      /* skip */
    }
  }
  return usable.join('\n');
}

function localConstPrelude(src) {
  const out = [];
  // Indented too: /faq keeps its questions in a `const faqs = [...]` declared
  // inside the component. Declarations that reference props or hooks throw
  // when evaluated and are dropped by the incremental pass below, so widening
  // this costs nothing.
  for (const m of src.matchAll(/^[ \t]*const\s+([A-Za-z_$][\w$]*)\s*(?::[^=]+)?=\s*([[{])/gm)) {
    const openIdx = m.index + m[0].length - 1;
    const openCh = m[2];
    const closeCh = openCh === '[' ? ']' : '}';
    let depth = 0;
    let end = -1;
    let quote = null;
    for (let i = openIdx; i < src.length; i++) {
      const c = src[i];
      if (quote) {
        if (c === quote && src[i - 1] !== '\\') quote = null;
        continue;
      }
      if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
      if (c === openCh) depth++;
      else if (c === closeCh) { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end === -1) continue;
    out.push(`const ${m[1]} = ${src.slice(openIdx, end + 1)};`);
  }
  // Drop any declaration that cannot stand alone (it references an import, a
  // component, or an earlier value we did not capture). Keeping the rest means
  // one unusable const no longer costs us the whole page's copy.
  const usable = [];
  for (const decl of out) {
    try {
      new Function('t', 'CAL_ROUTE', `${usable.join('\n')}\n${decl}`)(sandboxT, CAL_ROUTE);
      usable.push(decl);
    } catch {
      /* skip */
    }
  }
  // Locale flag for pages that branch their schema on language. Every route in
  // sitemap.xml is the English canonical — the French variant lives behind a
  // query string that Vercel cannot serve statically — so English is the
  // correct value here, not a convenient default. Declared first so a page's
  // own `isFr` shadows it if one is ever hoisted into the prelude.
  const localeFlags = `const isFr = false; const isEn = true; const CAL_ROUTE = ${JSON.stringify(CAL_ROUTE)};`;
  return [localeFlags, importedContentPrelude(src), usable.join('\n')].filter(Boolean).join('\n');
}

function extractStructuredData(block, src = '') {
  const at = block.search(/\bstructuredData=\s*\{/);
  if (at === -1) return null;
  const open = block.indexOf('{', at);
  let depth = 0;
  let close = -1;
  for (let i = open; i < block.length; i++) {
    if (block[i] === '{') depth++;
    else if (block[i] === '}') {
      depth--;
      if (depth === 0) {
        close = i;
        break;
      }
    }
  }
  if (close === -1) return null;
  try {
    const expr = block.slice(open + 1, close).trim();
    const value = new Function('t', `${localConstPrelude(src)}\nreturn (${expr})`)(sandboxT);
    if (!Array.isArray(value)) return null;
    const usable = value.filter((v) => v && typeof v === 'object' && v['@type']);
    return usable.length ? usable : null;
  } catch {
    return null;
  }
}

function extractH1(src) {
  // A page can hold more than one <h1> across conditional branches — a form
  // page renders "Application received" when submitted, and that block often
  // comes first in source order. The prerendered HTML represents the page as a
  // visitor first sees it, so skip confirmation headings when another exists.
  const all = [...src.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map((x) => x[1]);
  if (all.length === 0) return null;
  const isConfirmation = (raw) =>
    /received|thank ?you|success|confirmed|submitted|all set/i.test(raw);
  const preferred = all.length > 1 ? all.filter((raw) => !isConfirmation(raw)) : all;
  let inner = (preferred.length ? preferred : all)[0];
  // Resolve any t('key') segments against the English bundle. If a key is
  // missing the caller falls back to the SEO title rather than ship a
  // half-empty H1.
  if (/\bt\(/.test(inner)) {
    const resolved = resolveT(inner);
    if (!resolved) return null;
    inner = resolved;
  }
  inner = inner
    .replace(/\{["'`]\s*["'`]\}/g, ' ') // {" "}
    .replace(/<[^>]+>/g, '') // nested <span> etc.
    .replace(/\{[^}]*\}/g, '') // any other expression
    .replace(/\s+/g, ' ')
    .trim();
  return inner || null;
}

/* --------------------------------------------------------------------- *
 * 3b. Body copy, so the shell is not thin content.                       *
 * Pull the text out of the page's own <h2>/<h3>/<p>/<li> elements. Only  *
 * plain prose is taken — an element whose content includes a nested      *
 * component, a map() or any expression other than t() is skipped, since  *
 * we cannot render those without booting the app.                        *
 * --------------------------------------------------------------------- */

// Empty-state and loading copy is UI chrome for a state the crawler is not in
// — "No FAQs found matching your search" reads as a fact about the page once
// it is sitting in the static HTML.
function isEmptyState(v) {
  return (
    /^(no [a-z ]{0,25}(found|yet|results)|nothing to show|loading|try different)/i.test(String(v).trim()) ||
    /matching your search/i.test(String(v))
  );
}

const INLINE_OK = /^(?:strong|em|b|i|span|br|a|code|u|small|Link)$/i;

// Internal links are the whole point of the crawl graph: without them every
// page below the footer nav is an orphan. React Router's <Link to="/x"> is
// normalised to <a href="/x"> and kept; everything else is flattened to text.
function normaliseLinks(html) {
  return html
    .replace(/<Link\s+([^>]*?)to="(\/[^"]*)"([^>]*)>/g, '<a href="$2">')
    .replace(/<\/Link>/g, '</a>')
    .replace(/<a\s+([^>]*?)href="(\/[^"]*)"([^>]*)>/g, '<a href="$2">');
}

// Escape text but leave the anchors we just normalised intact.
function escapeAroundAnchors(html) {
  return html
    .split(/(<a href="\/[^"]*">|<\/a>)/g)
    .map((part) => (/^<\/?a(\s|>)/.test(part) ? part : esc(part)))
    .join('');
}

function textOf(inner, tag = '') {
  // Reject anything with a nested component (capitalised tag) or a non-t()
  // expression — those need the real renderer.
  const tags = [...inner.matchAll(/<\/?([A-Za-z][\w.]*)/g)].map((m) => m[1]);
  if (tags.some((tag) => !INLINE_OK.test(tag))) return null;

  let s = normaliseLinks(inner);
  if (/\bt\(/.test(s)) {
    const resolved = resolveT(s);
    if (!resolved) return null;
    s = resolved;
  }
  s = s.replace(/\{["'`]\s*["'`]\}/g, ' '); // {" "}
  if (/[{}]/.test(s)) return null; // some other expression survived
  s = s
    // Strip every tag except the internal anchors normalised above.
    .replace(/<(?!\/?a(?:\s|>))[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&rsquo;|&#39;|&apos;/g, '’')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&quot;/g, '"')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
  const visible = s.replace(/<[^>]+>/g, '').trim();
  if (isEmptyState(visible)) return null;
  // The 25-char floor exists to drop stray fragments, but it was also dropping
  // short link labels ("Switching from Lofty" is 20 chars), which silently
  // re-orphaned the very pages the hub was added to link. Anything carrying an
  // internal link is kept regardless of length.
  const hasInternalLink = /<a href="\//.test(s);
  // Headings are structure, not prose: "All guides" is 10 characters and still
  // worth emitting, because the shell otherwise ships a list with no heading
  // above it. The floor stays for paragraphs and list items.
  const isHeading = tag === 'h2' || tag === 'h3';
  if (!hasInternalLink && !isHeading && visible.length < 25) return null;
  return visible.length > 0 ? s : null;
}

// 40 was too low: on a long hub page like /resources the comparison links sat
// past the cut, so the pages they de-orphan stayed orphaned.
// Pages whose copy lives in a data array — FAQ entries, feature cards,
// integration categories — render it through .map(), which extractBody cannot
// follow. The 2026-09-26 crawl still flagged /features, /pricing, /demo,
// /faq and ten others as thin for exactly that reason, and those are the
// commercial pages.
//
// The consts are already evaluated for structuredData, so reuse that: walk the
// evaluated values and take the human-readable strings. Anything that looks
// like a slug, class name, URL, icon or single word is skipped, so this emits
// prose rather than markup fragments.
function extractDataStrings(src, { limit = 60 } = {}) {
  const prelude = localConstPrelude(src);
  const declared = new Set([...prelude.matchAll(/^const\s+([A-Za-z_$][\w$]*)/gm)].map((m) => m[1]));
  // `faqs.map(` may be indented as well, which the caller's regex allows.
  const names = [...declared];
  // Consts the page actually renders from. `.map()` alone was too narrow —
  // /faq declares `faqs` and then maps a filtered copy of it — so accept any
  // declaration referenced again after its own declaration. The prose filter
  // below still throws away anything that is not human-readable copy.
  const mapped = names.filter((n) => {
    // Copy lifted from an imported @/content module is included on sight: the
    // page referenced it once, at the import, and the "used twice" heuristic
    // below is about local consts that are declared and then rendered.
    if (n.endsWith('__CONTENT')) return true;
    const uses = [...src.matchAll(new RegExp(`\\b${n}\\b`, 'g'))].length;
    return uses > 1;
  });
  if (mapped.length === 0) return [];

  let values;
  try {
    values = new Function('t', `${prelude}\nreturn [${mapped.join(',')}];`)(sandboxT);
  } catch {
    return [];
  }

  const out = [];
  const seen = new Set();
  const looksLikeProse = (v) =>
    typeof v === 'string' &&
    !isEmptyState(v) &&
    v.length >= 12 &&
    /\s/.test(v.trim()) &&
    !/^https?:|^\/|^#|^[a-z0-9-]+$/i.test(v.trim()) &&
    !/[{}<>]/.test(v);

  const walk = (node) => {
    if (out.length >= limit) return;
    if (Array.isArray(node)) {
      node.forEach(walk);
    } else if (node && typeof node === 'object') {
      Object.values(node).forEach(walk);
    } else if (typeof node === 'string') {
      // Data arrays on these pages hold i18n keys rather than copy
      // (CAPS_NOW is [["featuresRd.capImportTitle", ...]]), so resolve a
      // dotted key through the English bundle before judging it.
      const raw = node.trim();
      const isKey = /^[a-z][\w]*(\.[\w]+)+$/.test(raw);
      const resolved = isKey ? lookup(raw) : raw;
      if (typeof resolved !== 'string') return;
      const t = resolved.trim();
      if (looksLikeProse(t) && !seen.has(t)) {
        seen.add(t);
        out.push(t);
      }
    }
  };
  values.forEach(walk);
  return out;
}

function extractBody(src, { limit = 140 } = {}) {
  const out = [];
  for (const m of src.matchAll(/<(h2|h3|p|li)\b[^>]*>([\s\S]*?)<\/\1>/g)) {
    const text = textOf(m[2], m[1]);
    if (!text) continue;
    if (out.some((b) => b.text === text)) continue;
    out.push({ tag: m[1] === 'li' ? 'li' : m[1], text });
    if (out.length >= limit) break;
  }
  return out;
}

// Most of the pages the crawl still called thin compose their copy from child
// components — /faq is eight lines of JSX around <MobileOptimizedFAQ />. The
// extractors above only ever read the page file, so that copy was invisible.
// Follow the page's own component imports one level deep and read those too.
//
// Shared chrome is excluded: Navbar and Footer appear on every page, so
// pulling their text in would add the same block 69 times and say nothing.
const CHROME = /(^|\/)(Navbar|Footer|SEO|CookieConsent|SkipToContent|ScrollToTop|SiteAssistant)$/;

function localComponentSources(src, depth = 1, seen = new Set()) {
  if (depth < 0) return [];
  const out = [];
  for (const m of src.matchAll(/^import\s+(?:\{[^}]*\}|\w+)\s+from\s+["'](@\/(?:components|pages)\/[^"']+)["']/gm)) {
    const rel = m[1].replace(/^@\//, 'src/');
    if (CHROME.test(rel) || rel.startsWith('src/components/ui/')) continue;
    for (const ext of ['.tsx', '.ts', '/index.tsx']) {
      const full = path.join(repoRoot, rel + ext);
      if (!fs.existsSync(full) || seen.has(full)) continue;
      seen.add(full);
      const body = fs.readFileSync(full, 'utf-8');
      out.push(body);
      out.push(...localComponentSources(body, depth - 1, seen));
      break;
    }
  }
  return out;
}

/* ------------------------- *
 * 4. HTML shell construction *
 * ------------------------- */

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// The shell's site nav, read from the SAME registry the React header and
// footer use: src/config/siteNav.ts.
//
// This list used to be a hand-written copy of the footer, and it was the copy
// that mattered most — a crawler with no JS sees only this, so the shell's
// links ARE the site's internal link graph. It had drifted: no audience pages,
// no comparisons, no /about, no compliance pages. Thirteen links where the
// real footer has thirty-two.
//
// Parsed rather than imported because this is a Node script and the registry
// is TypeScript. The parse is narrow — top-level `const NAME = [...]` array
// literals of flat objects — and if it yields nothing the build fails loudly
// instead of quietly shipping a shell with no navigation.
function readNavRegistry() {
  const src = fs.readFileSync(path.join(repoRoot, 'src/config/siteNav.ts'), 'utf8');

  // CAL_ROUTE comes from the booking config rather than being hardcoded here
  // — hardcoding "/demo" is how a second copy starts.

  // Strip type annotations on the declarations we want, then evaluate each in
  // order so later arrays can reference earlier ones (FOOTER_COLUMNS reuses
  // WHO_WE_HELP). `satisfies`/interfaces are left behind by the filter.
  const decls = [];
  for (const m of src.matchAll(/^(?:export\s+)?const\s+([A-Z][A-Z0-9_]*)\s*(?::[^=]+?)?=\s*\[/gm)) {
    const open = src.indexOf('[', m.index + m[0].length - 1);
    let depth = 0, quote = null, end = -1;
    for (let i = open; i < src.length; i++) {
      const c = src[i];
      if (quote) { if (c === quote && src[i - 1] !== '\\') quote = null; continue; }
      if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
      if (c === '[') depth++;
      else if (c === ']') { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end !== -1) decls.push([m[1], src.slice(open, end + 1)]);
  }

  const scope = { CAL_ROUTE };
  for (const [name, literal] of decls) {
    try {
      const keys = Object.keys(scope);
      scope[name] = new Function(...keys, `return (${literal});`)(...keys.map((k) => scope[k]));
    } catch {
      /* references something we did not capture — skip it */
    }
  }

  const seen = new Map();
  const add = (item) => {
    if (!item || typeof item.to !== 'string') return;
    if (item.external || !item.to.startsWith('/')) return;
    if (!seen.has(item.to)) seen.set(item.to, item.label);
  };
  for (const group of scope.PRIMARY_NAV ?? []) {
    if (group.to) add(group);
    for (const i of group.items ?? []) add(i);
    for (const p of group.panes ?? []) {
      add(p);
      for (const i of p.items ?? []) add(i);
    }
  }
  for (const col of scope.FOOTER_COLUMNS ?? []) for (const i of col.items ?? []) add(i);

  if (seen.size < 20) {
    throw new Error(
      `prerender: only parsed ${seen.size} links from siteNav.ts — the registry's shape changed ` +
        'and readNavRegistry() needs updating. Refusing to prerender a site with no navigation.',
    );
  }
  return [...seen.entries()];
}

const FOOTER_LINKS = readNavRegistry();

function breadcrumbs(route, title) {
  const items = [{ name: 'Home', item: SITE + '/' }];
  const parts = route.split('/').filter(Boolean);
  let acc = '';
  parts.forEach((part, i) => {
    acc += '/' + part;
    items.push({
      name: i === parts.length - 1 ? title : part.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      item: SITE + acc,
    });
  });
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.item,
    })),
  };
}

function buildHead(baseHtml, { route, title, description, canonical, structuredData }) {
  // index.html carries a <noscript> fallback holding the HOMEPAGE h1 and copy.
  // It was the previous attempt at serving crawlers something. Now that #root
  // holds this page's real h1 and description, that block would put a second,
  // wrong h1 and the homepage's description on all 67 pages. Drop it — a
  // browser without JS reads the #root content, which is strictly better.
  let head = baseHtml.replace(/<noscript>[\s\S]*?<\/noscript>/g, '');
  const url = canonical || SITE + (route === '/' ? '/' : route);

  const setTag = (pattern, replacement) => {
    head = pattern.test(head) ? head.replace(pattern, replacement) : head;
  };

  setTag(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  setTag(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${esc(description)}" />`,
  );
  setTag(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${esc(title)}" />`,
  );
  setTag(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${esc(description)}" />`,
  );
  setTag(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${esc(url)}" />`,
  );
  setTag(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${esc(title)}" />`,
  );
  setTag(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${esc(description)}" />`,
  );

  // Canonical + hreflang: replace an existing canonical, otherwise inject.
  const linkBlock =
    `<link rel="canonical" href="${esc(url)}" />` +
    `<link rel="alternate" hreflang="en-CA" href="${esc(url)}?lang=en" />` +
    `<link rel="alternate" hreflang="fr-CA" href="${esc(url)}?lang=fr" />` +
    `<link rel="alternate" hreflang="x-default" href="${esc(url)}" />`;
  if (/<link\s+rel="canonical"[^>]*>/.test(head)) {
    head = head.replace(/<link\s+rel="canonical"[^>]*>/, linkBlock);
  } else {
    head = head.replace('</head>', `${linkBlock}</head>`);
  }

  const graph = [breadcrumbs(route, title), ...(structuredData ?? [])];
  const ld = graph
    .map((node) => `<script type="application/ld+json">${JSON.stringify(node)}</script>`)
    .join('');
  head = head.replace('</head>', `${ld}</head>`);

  return head;
}

function buildShell({ route, h1, description, body }) {
  const links = FOOTER_LINKS.filter(([href]) => href !== route)
    .map(([href, label]) => `<li><a href="${href}">${esc(label)}</a></li>`)
    .join('');

  // Vercel serves dist/index.html for any path with no prerendered file — the
  // SPA routes (/login, /app/*). Those would briefly paint the HOMEPAGE shell
  // before React mounts and clears #root. Drop the shell immediately when the
  // URL is not the one it was built for; crawlers on the right URL still read
  // it, because this only ever runs when the path does not match.
  const guard =
    `<script>if(location.pathname.replace(/\\/$/,'')!==${JSON.stringify(
      route === '/' ? '' : route,
    )})document.getElementById('root').textContent='';</script>`;

  // The shell is a reduced view of the page, so a section whose first
  // extracted heading is an <h3> would follow the <h1> directly and read as a
  // skipped level — 16 pages were flagged for exactly that, and it was this
  // script's doing rather than the page's. Clamp each heading to at most one
  // level below the previous one.
  let lastLevel = 1;
  for (const block of body) {
    if (block.tag !== 'h2' && block.tag !== 'h3') continue;
    const level = block.tag === 'h2' ? 2 : 3;
    const clamped = Math.min(level, lastLevel + 1);
    block.tag = clamped === 2 ? 'h2' : 'h3';
    lastLevel = clamped;
  }

  // Wrap consecutive <li> runs back into a single list.
  const bodyHtml = [];
  let inList = false;
  for (const block of body) {
    if (block.tag === 'li' && !inList) {
      bodyHtml.push('<ul>');
      inList = true;
    } else if (block.tag !== 'li' && inList) {
      bodyHtml.push('</ul>');
      inList = false;
    }
    // block.text already has its text escaped and its anchors preserved.
    bodyHtml.push(`<${block.tag}>${escapeAroundAnchors(block.text)}</${block.tag}>`);
  }
  if (inList) bodyHtml.push('</ul>');

  return [
    '<div id="root">',
    '<a href="/">Realtor Desk</a>',
    '<main>',
    `<h1>${esc(h1)}</h1>`,
    `<p>${esc(description)}</p>`,
    bodyHtml.join(''),
    '<p><a href="/pricing">See pricing</a> or <a href="/demo">book a demo</a>.</p>',
    '</main>',
    `<nav aria-label="Site"><ul>${links}</ul></nav>`,
    '</div>',
    guard,
  ].join('');
}

/* ---------- *
 * 5. Run it. *
 * ---------- */

/**
 * Resolve every sitemap route's title and description without touching dist.
 * Same extraction the prerender uses, so a test cannot pass against a stale
 * build. Exported for src/test/seo/metaLength.test.ts.
 */
export function collectMeta() {
  const { routeToFile, redirectRoutes } = buildRouteFileMap();
  const out = [];
  for (const route of readSitemapRoutes()) {
    if (redirectRoutes.has(route)) continue;
    const file = routeToFile.get(route);
    if (!file) continue;
    const src = fs.readFileSync(file, 'utf-8');
    const block = extractSeoBlock(src);
    const title = block && literalProp(block, 'title');
    const description = block && literalProp(block, 'description');
    if (!title || !description) continue;
    out.push({
      route,
      title:
        title.includes('Realtor Desk') || title.includes('RealtorDesk')
          ? title
          : `${title} | Realtor Desk`,
      description,
    });
  }
  return out;
}

// Everything below runs only when this file is executed directly, so importing
// it for collectMeta() does not require dist/ to exist.
const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirectRun) {

const baseHtmlPath = path.join(distDir, 'index.html');
if (!fs.existsSync(baseHtmlPath)) {
  console.error('✖ dist/index.html not found — run `vite build` first.');
  process.exit(1);
}
// Route "/" overwrites dist/index.html with the filled homepage, so a second
// run would find no empty #root to fill. Keep the pristine Vite output beside
// it the first time, and reuse that on any re-run without a fresh build.
const templatePath = path.join(distDir, '.prerender-template.html');
let baseHtml = fs.readFileSync(baseHtmlPath, 'utf-8');

if (/<div id="root">\s*<\/div>/.test(baseHtml)) {
  fs.writeFileSync(templatePath, baseHtml, 'utf-8');
} else if (fs.existsSync(templatePath)) {
  baseHtml = fs.readFileSync(templatePath, 'utf-8');
} else {
  console.error(
    '✖ dist/index.html has no empty <div id="root"></div> and no cached template — run `vite build` first.',
  );
  process.exit(1);
}

const routes = readSitemapRoutes();
const { routeToFile, redirectRoutes } = buildRouteFileMap();

let written = 0;
const unresolved = [];
const seenTitles = new Map();

for (const route of routes) {
  if (redirectRoutes.has(route)) {
    unresolved.push(`${route} (listed in sitemap.xml but App.tsx redirects it — remove from the sitemap)`);
    continue;
  }
  const file = routeToFile.get(route);
  if (!file) {
    unresolved.push(`${route} (no route in App.tsx)`);
    continue;
  }

  const src = fs.readFileSync(file, 'utf-8');
  const block = extractSeoBlock(src);
  const title = block && literalProp(block, 'title');
  const description = block && literalProp(block, 'description');
  const canonical = block && literalProp(block, 'canonicalUrl');
  const structuredData = block && extractStructuredData(block, src);

  if (!title || !description) {
    unresolved.push(`${route} (no literal <SEO> title/description in ${path.relative(repoRoot, file)})`);
    continue;
  }

  // Match the runtime SEO component: brand the title unless it already is branded.
  const fullTitle =
    title.includes('Realtor Desk') || title.includes('RealtorDesk')
      ? title
      : `${title} | Realtor Desk`;

  const h1 = extractH1(src) || title;

  const body = extractBody(src);

  // Copy that lives in mapped data arrays, on the page and in its own
  // components.
  const childSources = localComponentSources(src);
  const dataStrings = [src, ...childSources].flatMap((code) => extractDataStrings(code));
  for (const child of childSources) {
    for (const blk of extractBody(child, { limit: 40 })) {
      if (!body.some((b) => b.text === blk.text)) body.push(blk);
    }
  }
  const seenText = new Set(body.map((b) => b.text));
  for (const t of dataStrings) {
    const esced = esc(t);
    if (seenText.has(esced) || body.some((b) => b.text.includes(t))) continue;
    seenText.add(esced);
    body.push({ tag: 'p', text: esced });
  }

  const html = buildHead(baseHtml, { route, title: fullTitle, description, canonical, structuredData }).replace(
    /<div id="root">\s*<\/div>/,
    buildShell({ route, h1, description, body }),
  );

  // The whole point of this script is one unique, well-formed h1 and title per
  // page. Verify the emitted HTML rather than trusting the extraction.
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  if (h1Count !== 1) {
    unresolved.push(`${route} (emitted ${h1Count} <h1> elements, expected exactly 1)`);
    continue;
  }
  if (/[{}<>]/.test(fullTitle) || /\bt\(/.test(fullTitle)) {
    unresolved.push(`${route} (title still contains raw JSX: ${fullTitle.slice(0, 60)})`);
    continue;
  }

  const outDir = route === '/' ? distDir : path.join(distDir, route);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');

  if (seenTitles.has(fullTitle)) {
    unresolved.push(`${route} (duplicate title, same as ${seenTitles.get(fullTitle)})`);
  } else {
    seenTitles.set(fullTitle, route);
  }
  written++;
}

console.log(`✔ Prerendered ${written}/${routes.length} sitemap routes with unique titles.`);
if (unresolved.length) {
  console.log(`\n⚠ ${unresolved.length} route(s) need attention:`);
  for (const r of unresolved) console.log(`   - ${r}`);
}

// A route in the sitemap that we cannot give a unique title to would ship as
// another duplicate-title page, which is the exact bug this script exists to
// fix. Fail the build rather than regress silently.
if (unresolved.length) {
  console.error('\n✖ Every sitemap URL must prerender to a unique title.');
  process.exit(1);
}

}
