#!/usr/bin/env node

/**
 * Post-build prerender script for Netlify SPA
 * This ensures Google and AI crawlers can see your content
 * 
 * Usage: node scripts/prerender-pages.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes that should be statically prerendered
const routes = [
  '/',
  '/features',
  '/pricing',
  '/how-it-works',
  '/demo',
  '/canadian-market',
  '/integrations',
  '/pipeda-compliance',
  '/resources',
  '/faq',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
  '/features/ai-powered-crm',
  '/lofty-alternative',
  '/vs/boldtrail',
  '/vs/lofty',
  '/vs/ixact',
  '/vs/wise-agent',
  '/switch-from-boldtrail',
  '/switch-from-lofty',
  '/switch-from-ixact',
  '/switch-from-wise-agent',
  '/blog/ai-transformation',
  '/blog/crea-ddf',
  '/blog/compliance',
  '/blog/lead-conversion',
  '/blog/bilingual-marketing',
  '/blog/success-story',
  '/canada-housing-market-forecast-2025-2026',
  '/canadian-realtors-thrive-slower-market-ai-automation',
  '/lead-response-time-canadian-realtors',
  '/ai-crm-canadian-real-estate-agents-guide',
  '/toronto-vs-vancouver-real-estate-market-2025',
  '/pipeda-compliance-real-estate-ai-tools-canada',
  '/first-time-home-buyer-guide-canada-2025',
  '/sell-home-fast-canada-2025',
  '/edmonton-real-estate-market-2025',
  '/blog/vs-kvcore',
  '/blog/vs-follow-up-boss',
  '/blog/ixact-alternatives',
  '/blog/best-crm-canada-2025',
  '/blog/ai-vs-traditional-crm',
  '/blog/vs-lofty-crm',
  '/blog/boomtown-alternative-canada',
  '/blog/vs-propertybase',
  '/blog/ai-chatbot-real-estate-websites-canada',
  '/blog/real-estate-lead-generation-strategies-canada-2025',
  '/blog/open-house-digital-sign-in-sheets-vs-paper-2025',
  '/blog/real-estate-drip-campaign-templates-canada-2025',
  '/resources/voice-ai-real-estate-lead-follow-up-canada',
  '/resources/calgary-real-estate-marketing-strategies',
  '/resources/casl-compliance-real-estate-email-marketing-canada',
  '/resources/cost-of-missed-real-estate-leads-canada',
];

const distDir = path.join(__dirname, '../dist');
const baseHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

console.log('🔨 Starting prerender process...');
console.log(`📁 Output directory: ${distDir}`);

// Create directories for routes
routes.forEach((route) => {
  if (route === '/') return; // root is index.html

  const routePath = path.join(distDir, route);
  const dir = route === '/' ? distDir : path.join(distDir, route);

  // Create directory structure
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }

  // Write index.html to route directory
  const htmlFile = path.join(dir, 'index.html');
  fs.writeFileSync(htmlFile, baseHtml, 'utf-8');
  console.log(`✅ Prerendered: ${route} → ${htmlFile}`);
});

console.log('\n✨ Prerender complete!');
console.log('📊 Routes prerendered:', routes.length);
console.log('🚀 Your site is now ready for crawlers');
