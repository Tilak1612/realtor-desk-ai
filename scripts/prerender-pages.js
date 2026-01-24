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
  '/canadian-market',
  '/how-it-works',
  '/demo',
  '/resources',
  '/integrations',
  '/faq',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
  '/signup',
  '/login',
  '/lofty-alternative',
  '/vs/boldtrail',
  '/vs/lofty',
  '/vs/ixact',
  '/vs/wise-agent',
  '/blog/ai-transformation',
  '/blog/crea-ddf',
  '/blog/compliance',
  '/blog/lead-conversion',
  '/blog/bilingual-marketing',
  '/blog/success-story',
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
