import { Helmet } from 'react-helmet-async';
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

  return (
    <Helmet htmlAttributes={{ lang: htmlLang }}>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={currentUrl} />

      {/* hreflang alternates */}
      <link rel="alternate" hrefLang="en-CA" href={altEn} />
      <link rel="alternate" hrefLang="fr-CA" href={altFr} />
      <link rel="alternate" hrefLang="x-default" href={altEn} />

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Realtor Desk" />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content={ogLocaleAlt} />

      {/* Article Meta */}
      {article && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {article && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {article && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      {structuredData.length > 0 && structuredData.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
