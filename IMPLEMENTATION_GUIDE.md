# RealtorDesk AI SEO & Prerender Implementation Guide

## What Was Added
- Helmet-based SEO component with JSON-LD support (Organization, SoftwareApplication, Product, FAQ, Article, Breadcrumb, HowTo).
- Structured data utilities under src/lib/structuredData.ts for reuse across pages.
- Netlify prerender configuration to emit crawlable HTML for SPA routes.
- Expanded sitemap with core routes, alternatives, compliance, and blog resources.
- New pages: Lofty alternative and PIPEDA compliance, each with targeted metadata and schemas.

## Build & Deploy
1) Install deps (if needed): `npm install`
2) Build: `npm run build`
3) Deploy: publish the dist/ output to your host (Netlify config provided in netlify.toml).

## Prerender Notes (Netlify)
- netlify-plugin-prerender-spa targets key routes; ensure the plugin is enabled in your Netlify site settings.
- After deploy, fetch a prerendered route (e.g., `curl -I https://realtordesk.ai/lofty-alternative`) and confirm HTML content (not just the root script tag).

## Validation Checklist
- Robots & Sitemap
  - Confirm robots.txt is reachable and references https://realtordesk.ai/sitemap.xml
  - Submit sitemap in Search Console/Bing Webmaster Tools after deploy
- Meta & Canonical
  - View source on a key page and verify title, description, canonical, OG/Twitter tags are present
- Structured Data
  - Run Google Rich Results test on homepage, pricing, Lofty alternative, PIPEDA pages; ensure schemas are detected without errors
- Rendering
  - Use `curl -L https://realtordesk.ai/` and ensure visible body content is present server-side (prerendered HTML)
- Performance
  - Run PageSpeed Insights on / and /lofty-alternative; watch FCP and CLS; optimize images if needed
- Indexability
  - Check no unintended `noindex`; verify pages respond 200 and are linked internally

## If Hosting Elsewhere
- If not on Netlify, use a prerender service (e.g., Rendertron) or migrate to SSR/SSG (Next.js/Nuxt) to ensure bots receive HTML.
- Make sure cache headers mirror the intent: long cache for assets, short/no cache for HTML.
