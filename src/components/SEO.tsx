import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { normalizeLocale } from '@/lib/i18n/format';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  article?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noindex?: boolean;
  canonicalUrl?: string;
  structuredData?: object[];
}

// Locale-aware SEO surface. The active <html lang> attribute, og:locale,
// and hreflang alternates are driven off i18next so fr-CA visitors get
// the correct crawler signal. Quebec SERPs will otherwise show the EN
// title for users on `?lang=fr` URLs (2026-04 audit, Critical #10).

export const SEO = ({
  title,
  description,
  keywords,
  image = 'https://www.realtordesk.ai/og-image.png',
  article = false,
  publishedTime,
  modifiedTime,
  author,
  noindex = false,
  canonicalUrl,
  structuredData = [],
}: SEOProps) => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const locale = normalizeLocale(i18n.language);

  const siteUrl = 'https://www.realtordesk.ai';

  // Canonical must reflect the CURRENT locale, not collapse FR into EN.
  // 2026-04-24 audit: `/?lang=fr` was self-canonicalling to `/` (the EN URL),
  // telling Google the FR variant was a duplicate. Now fr-CA pages emit
  // canonical with `?lang=fr` preserved; en-CA pages emit the bare path
  // (EN is the default, no lang param needed).
  const basePath = canonicalUrl
    ? new URL(canonicalUrl).pathname
    : location.pathname;
  const canonicalQuery = locale === 'fr-CA' ? '?lang=fr' : '';
  const currentUrl = canonicalUrl
    ? canonicalUrl
    : `${siteUrl}${basePath}${canonicalQuery}`;

  // hreflang alternates — both variants always point at the stable
  // ?lang=* entry points so Google can index them as distinct URLs.
  const altEn = `${siteUrl}${basePath}?lang=en`;
  const altFr = `${siteUrl}${basePath}?lang=fr`;

  // Title already lives in the locale-specific page copy, so don't
  // double-append the brand. If the caller passed a generic non-brand
  // title, append "Realtor Desk" (not "RealtorDesk AI" — the brand was
  // unified to "Realtor Desk" in PRs #71–#73).
  const fullTitle =
    title.includes('Realtor Desk') || title.includes('RealtorDesk')
      ? title
      : `${title} | Realtor Desk`;

  const ogLocale = locale === 'fr-CA' ? 'fr_CA' : 'en_CA';
  const ogLocaleAlt = locale === 'fr-CA' ? 'en_CA' : 'fr_CA';
  const htmlLang = locale === 'fr-CA' ? 'fr-CA' : 'en-CA';

  // react-helmet-async 2.0.5 is inert under React 19 — verified in production:
  // every page carried the homepage <title> and description, and there were
  // ZERO [data-rh] managed tags in the document. So per-page SEO was not
  // "duplicated", it simply never applied anywhere on the site.
  //
  // Rather than swap in another library, write the tags directly. This
  // upserts by selector so there is exactly one of each — React 19's native
  // metadata hoisting would instead ADD a second <meta name="description">
  // alongside the static one already in index.html.
  useEffect(() => {
    document.title = fullTitle;
    document.documentElement.lang = htmlLang;

    const upsertMeta = (attr: "name" | "property", key: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const upsertLink = (rel: string, href: string, hreflang?: string) => {
      const sel = hreflang
        ? `link[rel="${rel}"][hreflang="${hreflang}"]`
        : `link[rel="${rel}"]:not([hreflang])`;
      let el = document.head.querySelector<HTMLLinkElement>(sel);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        if (hreflang) el.setAttribute("hreflang", hreflang);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    upsertMeta("name", "description", description);
    if (keywords) upsertMeta("name", "keywords", keywords);
    upsertMeta(
      "name",
      "robots",
      noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );

    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", article ? "article" : "website");
    upsertMeta("property", "og:url", currentUrl);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:image:width", "1200");
    upsertMeta("property", "og:image:height", "630");
    upsertMeta("property", "og:site_name", "Realtor Desk");
    upsertMeta("property", "og:locale", ogLocale);
    upsertMeta("property", "og:locale:alternate", ogLocaleAlt);

    if (article && publishedTime) upsertMeta("property", "article:published_time", publishedTime);
    if (article && modifiedTime) upsertMeta("property", "article:modified_time", modifiedTime);
    if (article && author) upsertMeta("property", "article:author", author);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);

    upsertLink("canonical", currentUrl);
    upsertLink("alternate", altEn, "en-CA");
    upsertLink("alternate", altFr, "fr-CA");
    upsertLink("alternate", altEn, "x-default");

    // Page-scoped JSON-LD. Tagged so it can be cleared on unmount without
    // touching the static blocks index.html ships.
    const tag = "data-seo-jsonld";
    document.head.querySelectorAll(`script[${tag}]`).forEach((n) => n.remove());
    structuredData.forEach((schema) => {
      const el = document.createElement("script");
      el.setAttribute("type", "application/ld+json");
      el.setAttribute(tag, "");
      el.textContent = JSON.stringify(schema);
      document.head.appendChild(el);
    });

    return () => {
      document.head.querySelectorAll(`script[${tag}]`).forEach((n) => n.remove());
    };
  }, [
    fullTitle, description, keywords, noindex, article, currentUrl, image,
    ogLocale, ogLocaleAlt, htmlLang, altEn, altFr, publishedTime, modifiedTime,
    author, structuredData,
  ]);

  return null;
};
