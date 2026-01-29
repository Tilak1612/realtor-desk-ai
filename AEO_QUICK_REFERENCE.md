# AEO/SEO Quick Reference Guide

## Using New Schema Types

### 1. VideoObject Schema
```tsx
import { videoObjectSchema } from '@/lib/structuredData';

const videoSchema = videoObjectSchema({
  name: "RealtorDesk AI Demo",
  description: "See how our AI CRM works",
  thumbnailUrl: "https://realtordesk.ai/demo-thumb.jpg",
  uploadDate: "2026-01-29",
  duration: "PT2M30S", // 2 minutes 30 seconds
  contentUrl: "https://realtordesk.ai/demo-video.mp4"
});

// Add to SEO component
<SEO structuredData={[videoSchema]} />
```

### 2. Review Schema
```tsx
import { reviewSchema } from '@/lib/structuredData';

const review = reviewSchema({
  author: "Sarah Johnson",
  rating: 5,
  reviewBody: "Best CRM for Canadian realtors!",
  datePublished: "2026-01-15"
});

<SEO structuredData={[review]} />
```

### 3. Breadcrumb Navigation
```tsx
import { BreadcrumbNav } from '@/components/BreadcrumbNav';

<BreadcrumbNav 
  items={[
    { name: "Resources", url: "/resources" },
    { name: "Blog", url: "/resources/blog" }
  ]}
  currentPage="AI CRM Guide"
/>
```

### 4. Enhanced SEO Component
```tsx
import { SEO } from '@/components/SEO';

<SEO 
  title="Your Page Title"
  description="Your description"
  keywords="keyword1, keyword2"
  productPrice="149"
  productCurrency="CAD"
  answerFor="questions this page answers"
  structuredData={[schema1, schema2]}
/>
```

## AEO Best Practices

### 1. Write Direct Answers
❌ Bad: "Our pricing is competitive and flexible..."
✅ Good: "RealtorDesk AI costs $149 CAD/month for solo agents."

### 2. Use Question Format
```tsx
<h2>What is the best CRM for Canadian real estate agents?</h2>
<p>RealtorDesk AI is the best CRM for Canadian real estate agents because...</p>
```

### 3. Add Structured Data
Every page should have:
- Organization/SoftwareApplication schema
- FAQ or Q&A schema
- Breadcrumb schema (if nested page)
- Article schema (for blog posts)

### 4. Optimize for Voice Search
- Use natural language
- Target long-tail keywords
- Answer common questions
- Include local keywords (Canada, Toronto, etc.)

## Testing Your Changes

### 1. Validate Schema
```bash
# Use Google's Rich Results Test
https://search.google.com/test/rich-results

# Or Schema.org validator
https://validator.schema.org/
```

### 2. Test Social Sharing
```bash
# Facebook
https://developers.facebook.com/tools/debug/

# Twitter
https://cards-dev.twitter.com/validator
```

### 3. Check Robots.txt
```bash
# Visit in browser
https://realtordesk.ai/robots.txt
```

### 4. View Knowledge Base
```bash
# JSON format
https://realtordesk.ai/knowledge-base.json

# Text format
https://realtordesk.ai/ai-company-info.txt
```

## Common Patterns

### Blog Post with Full SEO
```tsx
<SEO 
  title="How to Generate Real Estate Leads with AI"
  description="Learn proven strategies..."
  keywords="real estate leads, AI lead generation"
  article={true}
  publishedTime="2026-01-29T10:00:00Z"
  modifiedTime="2026-01-29T10:00:00Z"
  author="RealtorDesk AI Team"
  answerFor="how to generate real estate leads, AI lead generation"
  structuredData={[articleSchema, faqSchema]}
/>
```

### Product/Feature Page
```tsx
<SEO 
  title="AI Chatbot for Real Estate"
  description="24/7 AI chatbot..."
  productPrice="149"
  answerFor="AI chatbot for realtors, real estate chatbot"
  structuredData={[productSchema, howToSchema]}
/>
```

### Comparison Page
```tsx
<SEO 
  title="RealtorDesk AI vs Lofty"
  description="Compare features and pricing..."
  answerFor="Lofty alternative, RealtorDesk vs Lofty"
  structuredData={[comparisonSchema, faqSchema]}
/>
```

## Monitoring & Optimization

### Weekly Checks
- [ ] Google Search Console - Featured snippets
- [ ] Schema validation errors
- [ ] Page speed scores
- [ ] Social sharing previews

### Monthly Reviews
- [ ] Keyword rankings
- [ ] AI search mentions
- [ ] Structured data coverage
- [ ] Content freshness updates

### Quarterly Audits
- [ ] Full SEO audit
- [ ] Competitor analysis
- [ ] New schema opportunities
- [ ] Content gap analysis
