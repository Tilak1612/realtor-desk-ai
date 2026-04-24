// Structured Data Schemas for SEO

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Realtor Desk",
  "legalName": "Brainfy AI Inc.",
  "url": "https://www.realtordesk.ai",
  "logo": "https://www.realtordesk.ai/logo.png",
  "description": "AI-first real estate CRM built for Canadian agents with PIPEDA compliance, bilingual support, and CREA DDF® integration on the roadmap.",
  "foundingDate": "2024",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Edmonton",
    "addressRegion": "AB",
    "addressCountry": "CA"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "email": "support@realtordesk.ai",
    "availableLanguage": ["English", "French"]
  },
  "sameAs": [
    "https://www.linkedin.com/company/realtordesk-ai",
    "https://twitter.com/realtordeskai"
  ]
};

export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Realtor Desk",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web, iOS, Android",
  "description": "AI-powered real estate CRM with 24/7 chatbot, lead scoring, and automated follow-ups for Canadian agents. CREA DDF® integration is on the roadmap.",
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "149.00",
    "highPrice": "599.00",
    "priceCurrency": "CAD",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "billingDuration": "P1M"
    },
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  },
  "provider": {
    "@type": "Organization",
    "name": "Brainfy AI Inc.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Edmonton",
      "addressRegion": "AB",
      "addressCountry": "CA"
    }
  },
  "featureList": [
    "AI Chatbot (24/7)",
    "AI Voice Agent",
    "CREA DDF® Integration (coming Q3 2026)",
    "Predictive Lead Scoring",
    "Email & SMS Automation",
    "WhatsApp Messaging",
    "Pipeline Management",
    "PIPEDA Compliance",
    "Bilingual Support (EN/FR)"
  ]
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Realtor Desk",
  "image": "https://www.realtordesk.ai/logo.png",
  "url": "https://www.realtordesk.ai",
  "telephone": "+1-XXX-XXX-XXXX",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Edmonton",
    "addressRegion": "AB",
    "addressCountry": "CA"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "53.5461",
    "longitude": "-113.4938"
  },
  "priceRange": "$149 - $599 CAD/month",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  ]
};

export const homepageFAQSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is Realtor Desk PIPEDA compliant?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Realtor Desk is designed with PIPEDA principles — encryption at rest and in transit, consent management, automated compliance logging, and Canadian-optimized infrastructure. We follow PIPEDA's 10 fair information principles in our data practices."
      }
    },
    {
      "@type": "Question",
      "name": "Does Realtor Desk integrate with CREA DDF®?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "CREA DDF® (Canadian MLS) integration is on the Q3 2026 roadmap for Realtor Desk. Today you can import listings from Realtor.ca via the built-in importer and manage listing information directly within the CRM."
      }
    },
    {
      "@type": "Question",
      "name": "How much does Realtor Desk cost compared to Lofty?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Realtor Desk starts at CAD $149/month with no setup fees. Lofty publishes starting tiers at USD $700+/month plus setup fees on its public pricing page. Actual savings depend on tier selected and the current CAD/USD exchange rate; see /pricing for Realtor Desk pricing."
      }
    },
    {
      "@type": "Question",
      "name": "Does Realtor Desk support French/bilingual features?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Realtor Desk offers full bilingual support with English and French interfaces, bilingual AI chatbot responses, and Quebec market-ready features for serving French-speaking clients."
      }
    },
    {
      "@type": "Question",
      "name": "What AI features does Realtor Desk include?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Realtor Desk includes a 24/7 AI chatbot, predictive lead scoring, automated follow-ups, smart email/SMS sequences, and custom AI training for your specific needs. AI voice agent and WhatsApp integration are coming soon."
      }
    }
  ]
};

export const pricingPageFAQSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is there a free trial?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Realtor Desk offers a 14-day free trial with no credit card required. You get full access to all features during the trial period."
      }
    },
    {
      "@type": "Question",
      "name": "Are there setup fees?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, Realtor Desk has zero setup fees on all plans. Unlike competitors like Lofty ($499-$1,499) and Follow Up Boss ($199), you can start immediately without upfront costs."
      }
    },
    {
      "@type": "Question",
      "name": "Can I cancel anytime?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, all Realtor Desk plans are month-to-month with no long-term contracts. You can cancel anytime from your billing settings."
      }
    },
    {
      "@type": "Question",
      "name": "What payment methods do you accept?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We accept all major credit cards (Visa, Mastercard, American Express) and debit cards through Stripe. Invoicing is available for Enterprise plans."
      }
    }
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
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  }
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
