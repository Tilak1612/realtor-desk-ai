#!/bin/bash

# SSR SEO Diagnostic Test Suite
# Run this after deploying to verify your site is crawler-accessible

set -e

DOMAIN="${1:-https://www.realtordesk.ai}"
ROUTES=("/" "/features" "/pricing" "/canadian-market" "/demo" "/blog/ai-transformation")

echo "🔍 SSR/SEO DIAGNOSTIC TEST SUITE"
echo "=================================="
echo "Testing domain: $DOMAIN"
echo ""

# Test 1: Check if responses contain actual content
echo "📋 TEST 1: Checking for HTML content (not just <div id=\"root\">)..."
for route in "${ROUTES[@]}"; do
  echo -n "  Testing $route ... "
  RESPONSE=$(curl -s "$DOMAIN$route")
  
  # Check if response contains more than just div id="root"
  if echo "$RESPONSE" | grep -q "<h1\|<h2\|<title"; then
    echo "✅ PASS (Found HTML content)"
  else
    echo "❌ FAIL (Only found <div id=\"root\">)"
  fi
done

echo ""
echo "📋 TEST 2: Checking HTTP headers..."
RESPONSE=$(curl -i -s "$DOMAIN/" | head -20)
echo "$RESPONSE" | grep -E "200|301|302" || echo "❌ FAIL: Non-2xx status code"
echo "$RESPONSE" | grep -i "Content-Type" || echo "⚠️  WARNING: No Content-Type header"

echo ""
echo "📋 TEST 3: Checking Cache Control headers..."
CACHE=$(curl -i -s "$DOMAIN/features/" | grep -i "Cache-Control" || echo "Not found")
if [ "$CACHE" != "Not found" ]; then
  echo "✅ Cache headers configured: $CACHE"
else
  echo "⚠️  WARNING: No Cache-Control header"
fi

echo ""
echo "📋 TEST 4: Checking for meta tags..."
echo -n "  Checking title tag ... "
curl -s "$DOMAIN/" | grep -q "<title" && echo "✅" || echo "❌"

echo -n "  Checking meta description ... "
curl -s "$DOMAIN/" | grep -q 'name="description"' && echo "✅" || echo "❌"

echo -n "  Checking og:image ... "
curl -s "$DOMAIN/" | grep -q 'property="og:image"' && echo "✅" || echo "❌"

echo ""
echo "📋 TEST 5: Checking content size..."
for route in "/" "/features"; do
  SIZE=$(curl -s "$DOMAIN$route" | wc -c)
  echo "  $route: $SIZE bytes"
  if [ "$SIZE" -lt 2000 ]; then
    echo "    ⚠️  WARNING: Response is very small (might be just div)"
  else
    echo "    ✅ Response size looks good"
  fi
done

echo ""
echo "=================================="
echo "🎯 DIAGNOSTIC TEST COMPLETE"
echo ""
echo "📌 NEXT STEPS:"
echo "  1. If all tests passed: Submit your site to Google Search Console"
echo "  2. If tests failed: Check Netlify build logs and run 'npm run build' locally"
echo "  3. For detailed testing: Run curl manually"
echo "     curl $DOMAIN/features | head -50"
echo ""
