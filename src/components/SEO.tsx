import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

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
  productPrice?: string;
  productCurrency?: string;
  answerFor?: string;
}

export const SEO = ({
  title,
  description,
  keywords,
  image = 'https://realtordesk.ai/og-image.png',
  article = false,
  publishedTime,
  modifiedTime,
  author,
  noindex = false,
  canonicalUrl,
  structuredData = [],
  productPrice,
  productCurrency = 'CAD',
  answerFor,
}: SEOProps) => {
  const location = useLocation();
  const siteUrl = 'https://realtordesk.ai';
  const currentUrl = canonicalUrl || `${siteUrl}${location.pathname}`;
  
  // Ensure title includes brand name
  const fullTitle = title.includes('RealtorDesk') ? title : `${title} | RealtorDesk AI`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={currentUrl} />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* AEO: Meta tags for AI Search Engines */}
      <meta name="target-audience" content="Canadian Real Estate Agents, Real Estate Teams, Brokerages" />
      <meta name="primary-category" content="Real Estate CRM Software" />
      {answerFor && <meta name="answer-for" content={answerFor} />}
      <meta name="language" content="en-CA" />
      <meta name="geo.region" content="CA" />
      <meta name="geo.placename" content="Canada" />
      
      {/* Product-specific meta tags */}
      {productPrice && (
        <>
          <meta property="product:price:amount" content={productPrice} />
          <meta property="product:price:currency" content={productCurrency} />
          <meta property="product:availability" content="in stock" />
          <meta property="product:condition" content="new" />
        </>
      )}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content="RealtorDesk AI" />
      <meta property="og:locale" content="en_CA" />
      <meta property="og:locale:alternate" content="fr_CA" />
      
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
      {article && (
        <>
          <meta property="article:section" content="Real Estate Technology" />
          <meta property="article:tag" content="Real Estate CRM" />
          <meta property="article:tag" content="AI Tools" />
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@Realtor_desk_AI" />
      <meta name="twitter:creator" content="@Realtor_desk_AI" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={fullTitle} />
      
      {/* Additional Twitter properties for better card rendering */}
      <meta name="twitter:label1" content="Pricing" />
      <meta name="twitter:data1" content="From $149 CAD/month" />
      <meta name="twitter:label2" content="Free Trial" />
      <meta name="twitter:data2" content="14 days" />
      
      {/* Structured Data */}
      {structuredData.length > 0 && structuredData.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
