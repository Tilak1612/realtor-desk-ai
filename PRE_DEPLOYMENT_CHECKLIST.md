# 📋 PRE-DEPLOYMENT CHECKLIST

Before you push to production, verify everything locally:

## ✅ LOCAL VERIFICATION (Do this first)

### 1. Build Successfully Completes
```bash
cd /workspaces/realtor-desk-ai
npm run build
```

**Expected output:**
```
✓ built in 13.39s
🔨 Starting prerender process...
✨ Prerender complete!
📊 Routes prerendered: 25
🚀 Your site is now ready for crawlers
```

**❌ If it fails:** 
- Check error message in build log
- Run `chmod +x scripts/prerender-pages.js` and try again

### 2. Verify Pre-rendered Files Exist
```bash
# Check a few routes exist
ls dist/features/index.html
ls dist/pricing/index.html
ls dist/blog/ai-transformation/index.html
```

**Expected:** All three files should exist (no errors)

### 3. Test Pre-rendered Content
```bash
# Should show actual HTML content, not just <div id="root">
head -100 dist/features/index.html | grep -E "<h1|<h2|<title|meta name"
```

**Expected:** Shows meta tags and title (proves content is there)

### 4. Verify Headers File
```bash
cat public/_headers
```

**Expected:** Shows cache control and CORS headers

## 📤 DEPLOYMENT

### 5. Commit All Changes
```bash
git add .
git status  # Review changes
git commit -m "Fix: Implement static pre-rendering for SEO crawlability

- Add post-build prerender script for 25 routes  
- Update npm build to run prerender after Vite
- Add _headers for crawler access and cache rules
- Update netlify.toml with prerender plugin config
- Add comprehensive documentation and test suite"
```

### 6. Push to Main
```bash
git push origin main
```

## 🔍 POST-DEPLOYMENT VERIFICATION (After Netlify builds)

### 7. Check Netlify Build Logs
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Go to **Deploys** tab
4. Click the latest deploy
5. Look for these lines in the build log:
   ```
   ✓ built in XX.XXs
   🔨 Starting prerender...
   ✨ Prerender complete!
   📊 Routes prerendered: 25
   ```

**❌ If missing:** Build may have failed. Check full logs.

### 8. Quick Curl Test (Most Important)
```bash
# Test one route
curl https://www.realtordesk.ai/features | head -50 | grep -c "<h1"
# Should return a number > 0 (means content exists)

# Or check for title
curl https://www.realtordesk.ai/features | grep "<title>"
# Should show your page title in meta
```

### 9. Test Homepage Too
```bash
curl https://www.realtordesk.ai | head -50 | grep -c "The AI-First"
# Should return > 0 (shows your hero content)
```

### 10. Google Search Console Test
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property (realtordesk.ai)
3. Click **URL Inspection**
4. Paste: `https://www.realtordesk.ai/features`
5. Click **Test Live URL** (may take 30-60 seconds)
6. In the screenshot, verify:
   ✅ Page shows actual content (not blank)
   ✅ Shows your heading and text
   ✅ Shows logo/branding

### 11. Run Diagnostic Test
```bash
bash scripts/test-seo.sh https://www.realtordesk.ai
```

**Expected output:**
```
📋 TEST 1: Checking for HTML content...
  Testing / ... ✅ PASS
  Testing /features ... ✅ PASS
  Testing /pricing ... ✅ PASS
  ...
📋 TEST 2: Checking HTTP headers... ✅ 200 OK
📋 TEST 3: Checking Cache Control... ✅ Cache headers configured
📋 TEST 4: Checking for meta tags... ✅ ✅ ✅
📋 TEST 5: Checking content size...
  /: XXXX bytes ✅
  /features: XXXX bytes ✅
```

## 🎯 SUCCESS CRITERIA

Your fix is **WORKING** when:

✅ **All 3 curl tests pass** (show content, not empty HTML)  
✅ **Google Search Console screenshot shows actual page**  
✅ **Diagnostic test shows all green checkmarks**  
✅ **Lighthouse SEO score is 90+**  
✅ **No 403 "host_not_allowed" errors**  

## 📊 FINAL VERIFICATION

### Check Search Console Health
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click on your property
3. Check **Coverage** report
4. Submit homepage: `https://www.realtordesk.ai/`
5. Monitor daily for indexing progress

### Monitor Rankings
After 2-4 weeks, check if your pages appear for keywords like:
- "real estate CRM Canada"
- "best CRM for realtors"
- "AI real estate software"
- "Lofty alternative"

## 🚨 TROUBLESHOOTING

### Curl still shows empty HTML
- [ ] Check Netlify deploy completed successfully
- [ ] Clear browser cache
- [ ] Wait 5 minutes for CDN to update
- [ ] Run: `curl -i https://www.realtordesk.ai/features | head -20`
- [ ] Look for status code (should be 200)

### Google Search Console shows blank screenshot
- [ ] Wait 2-3 hours for render cache to clear
- [ ] Try "Request Indexing" again
- [ ] Check browser console for JS errors
- [ ] Verify `/dist/features/index.html` exists locally

### Build fails on Netlify but works locally
- [ ] Check Node version: `node --version` (should be 18+)
- [ ] Check npm version: `npm --version` (should be 8+)
- [ ] Delete `package-lock.json` and `bun.lockb`, rebuild
- [ ] Check Netlify build logs for specific error message

## 📞 FINAL CHECKLIST

Before considering this complete:

- [ ] Local build test passes
- [ ] Pre-rendered files exist
- [ ] Changes committed and pushed
- [ ] Netlify build completes (no errors)
- [ ] Curl tests show HTML content
- [ ] Google Search Console passes URL inspection
- [ ] Diagnostic script shows all green checks
- [ ] Documented in Google Search Console
- [ ] Plan to monitor results over 2-4 weeks

## 🎉 YOU'RE DONE!

Your site is now crawler-accessible and ready for Google indexation!

**Next:** Monitor Google Search Console daily and wait 2-4 weeks for results.

Questions? See:
- `QUICK_SEO_FIX_REFERENCE.md` - Quick overview
- `SSR_SEO_DEPLOYMENT_GUIDE.md` - Detailed guide
- `TECHNICAL_SUMMARY_SSR_FIX.md` - How it works
