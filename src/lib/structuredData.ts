import { COMPANY } from "@/config/company";
// Structured Data Schemas for SEO

// Four unused exports were deleted on 2026-10-11: softwareApplicationSchema,
// localBusinessSchema, homepageFAQSchema and pricingPageFAQSchema. Nothing
// imported them, and they described a product that does not exist ("AI Voice
// Agent", "AI Chatbot (24/7)", "WhatsApp Messaging", "PIPEDA Compliance", a
// walk-in LocalBusiness). The live SoftwareApplication and Product blocks are in
// index.html; page FAQs are emitted by each page from its own visible text.

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Realtor Desk",
  "legalName": "Brainfy AI Inc.",
  "url": "https://www.realtordesk.ai",
  "logo": "https://www.realtordesk.ai/logo.png",
  "description": "A CRM for Canadian real estate agents: bilingual, with a consent record on each contact and a database hosted in Canada.",
  "foundingDate": "2024",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": COMPANY.city,
    "addressRegion": COMPANY.regionCode,
    "addressCountry": "CA"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "email": "support@realtordesk.ai",
    "availableLanguage": ["English", "French"]
  },
  // Must match the static Organization block in index.html and the profiles the
  // footer links. This copy used to list a LinkedIn page nobody had verified and
  // an X handle spelled differently from the real one, so two Organization nodes
  // disagreed about who the company is. entityLinks.test.ts keeps them identical.
  "sameAs": [
    "https://twitter.com/Realtor_desk_AI",
    "https://www.facebook.com/profile.php?id=61583653411571",
    "https://www.instagram.com/realtor_desk_ai",
    "https://www.youtube.com/@RealtorDeskAI"
  ]
};


export const productSchema = (planName: string, price: number, description: string) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": `Realtor Desk - ${planName} Plan`,
  "description": description,
  "brand": {
    "@type": "Brand",
    "name": "Realtor Desk"
  },
  "offers": {
    "@type": "Offer",
    "price": price.toFixed(2),
    "priceCurrency": "CAD",
    "availability": "https://schema.org/InStock",
    "url": "https://www.realtordesk.ai/pricing",
    "priceValidUntil": "2026-12-31"
  }
  // aggregateRating removed — no real reviews yet (see note above).
});

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": `https://www.realtordesk.ai${item.url}`
  }))
});

export const articleSchema = (
  title: string,
  description: string,
  author: string,
  publishedDate: string,
  modifiedDate: string,
  imageUrl: string
) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "image": imageUrl,
  "author": {
    "@type": "Person",
    "name": author
  },
  "publisher": {
    "@type": "Organization",
    "name": "Realtor Desk",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.realtordesk.ai/logo.png"
    }
  },
  "datePublished": publishedDate,
  "dateModified": modifiedDate,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.realtordesk.ai"
  }
});

export const howToSchema = (name: string, description: string, steps: { name: string; text: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": name,
  "description": description,
  "step": steps.map((step, index) => ({
    "@type": "HowToStep",
    "position": index + 1,
    "name": step.name,
    "text": step.text
  }))
});
