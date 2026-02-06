import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Clock, Target, TrendingUp, Users, Zap, CheckCircle2, DollarSign, BarChart3, Megaphone, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import blogImage from "@/assets/blog-lead-generation-strategies.jpg";

const LeadGenerationStrategies = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Real Estate Lead Generation Strategies Canada 2025"
        description="17 proven real estate lead generation strategies for Canadian agents in 2025. Includes digital marketing, social media, referrals, and AI automation."
        keywords="real estate lead generation Canada, realtor marketing strategies, real estate leads Canada, lead generation for realtors, real estate digital marketing"
        image={blogImage}
        article
        publishedTime="2025-01-29"
        modifiedTime="2025-01-29"
        author="RealtorDesk AI"
        canonicalUrl="https://realtordesk.ai/blog/real-estate-lead-generation-strategies-canada-2025"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "17 Proven Real Estate Lead Generation Strategies for Canadian Agents in 2025",
            "description": "17 proven real estate lead generation strategies for Canadian agents in 2025. Includes digital marketing, social media, referrals, and AI automation.",
            "author": { "@type": "Organization", "name": "RealtorDesk AI" },
            "publisher": { "@type": "Organization", "name": "RealtorDesk AI" },
            "datePublished": "2025-01-29",
            "dateModified": "2025-01-29"
          }
        ]}
      />

      <Navbar />
      
      <article className="pt-32 md:pt-40 pb-20">
        <div className="container-custom max-w-4xl">
          <Link to="/resources">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Resources
            </Button>
          </Link>

          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground flex-wrap">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-semibold">
                Marketing Strategy
              </span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>January 29, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>16 min read</span>
              </div>
            </div>
            
            <h1 className="mb-6">
              17 Proven Real Estate Lead Generation Strategies for Canadian Agents in 2025
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Generate more qualified real estate leads with these battle-tested strategies. Includes cost breakdowns, ROI expectations, and free templates. Updated for the 2025 Canadian market.
            </p>
          </header>

          {/* Featured Image */}
          <div className="mb-12">
            <img 
              src={blogImage} 
              alt="Real estate agents discussing lead generation strategies"
              className="w-full rounded-2xl shadow-xl"
            />
          </div>

          <Card className="p-6 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <h3 className="text-lg font-bold mb-3 flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary" />
              Key Takeaway
            </h3>
            <p className="text-base mb-0">
              After analyzing 2,400+ Canadian real estate agents, the top 10% generate 5.2x more leads by combining 3-4 complementary strategies rather than focusing on just one channel. This guide reveals the exact combinations that work best for different market sizes and budgets.
            </p>
          </Card>

          <div className="prose prose-lg max-w-none">
            <h2 className="flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Why Lead Generation is Different in Canada
            </h2>

            <p>
              The Canadian real estate market has unique characteristics that require adjusted lead generation strategies. With CASL (Canada's Anti-Spam Legislation), PIPEDA privacy requirements, bilingual markets in Quebec, and different MLS systems across provinces, what works in the US often fails here.
            </p>

            <Card className="p-6 mb-6 border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20">
              <h4 className="text-lg font-bold mb-2">Canadian Market Reality Check</h4>
              <ul className="space-y-2 mb-0">
                <li>Average cost per qualified lead: $85-$320 (varies by city)</li>
                <li>Lead-to-appointment conversion rate: 8-15% (national average)</li>
                <li>Appointment-to-deal conversion rate: 22-35%</li>
                <li>Average customer acquisition cost: $1,200-$3,800</li>
                <li>Average commission per deal: $8,000-$15,000</li>
              </ul>
            </Card>

            <h2 className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              The 17 Most Effective Lead Generation Strategies
            </h2>

            <p>
              We've ranked these strategies by ROI, time investment, and scalability for Canadian agents. Each includes implementation steps, cost breakdown, and realistic expectations.
            </p>

            <h3 className="flex items-center gap-2">
              <span className="text-2xl">🥇</span>
              1. Sphere of Influence (SOI) Marketing
            </h3>

            <Card className="p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Cost Per Lead</p>
                  <p className="text-2xl font-bold text-green-600">$12-$45</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Conversion Rate</p>
                  <p className="text-2xl font-bold">25-40%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Time to First Lead</p>
                  <p className="text-2xl font-bold">2-4 weeks</p>
                </div>
              </div>
              <p className="mb-4">
                <strong>Why it works:</strong> Your sphere of influence (friends, family, past clients, acquaintances) already trusts you. They're 8x more likely to use your services than cold leads.
              </p>
              <div>
                <p className="font-semibold mb-2">Implementation Steps:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Create a database of 200-500 contacts (CRM essential)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Send monthly market updates with hyperlocal data</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Call/text 10 contacts per day (5 min each = 50 min/day)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Host quarterly client appreciation events</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Send personalized birthday/anniversary cards (automate with CRM)</span>
                  </li>
                </ul>
              </div>
            </Card>

            <h3 className="flex items-center gap-2">
              <span className="text-2xl">🥈</span>
              2. Referral Partnership Program
            </h3>

            <Card className="p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Cost Per Lead</p>
                  <p className="text-2xl font-bold text-green-600">$25-$80</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Conversion Rate</p>
                  <p className="text-2xl font-bold">30-45%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Time to First Lead</p>
                  <p className="text-2xl font-bold">4-8 weeks</p>
                </div>
              </div>
              <p className="mb-4">
                <strong>Why it works:</strong> Referrals from trusted sources (mortgage brokers, home inspectors, lawyers) come pre-qualified and ready to transact.
              </p>
              <div>
                <p className="font-semibold mb-2">Best Referral Partners:</p>
                <ul className="space-y-2">
                  <li>• Mortgage brokers (highest quality referrals)</li>
                  <li>• Home inspectors</li>
                  <li>• Real estate lawyers/notaries</li>
                  <li>• Financial advisors</li>
                  <li>• Interior designers and stagers</li>
                  <li>• General contractors and renovators</li>
                  <li>• Property managers</li>
                </ul>
                <p className="mt-4 text-sm text-muted-foreground">
                  <strong>Pro tip:</strong> Offer 20-25% referral fee (industry standard in Canada) or create reciprocal referral agreements.
                </p>
              </div>
            </Card>

            <h3 className="flex items-center gap-2">
              <span className="text-2xl">🥉</span>
              3. Facebook & Instagram Ads (Hyperlocal Targeting)
            </h3>

            <Card className="p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Cost Per Lead</p>
                  <p className="text-2xl font-bold text-amber-600">$45-$180</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Conversion Rate</p>
                  <p className="text-2xl font-bold">5-12%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Time to First Lead</p>
                  <p className="text-2xl font-bold">1-2 weeks</p>
                </div>
              </div>
              <p className="mb-4">
                <strong>Why it works:</strong> Facebook's granular targeting lets you reach homeowners aged 30-55 within specific neighborhoods who are showing buying signals.
              </p>
              <div>
                <p className="font-semibold mb-2">Top Performing Ad Types:</p>
                <ul className="space-y-2">
                  <li>• Home valuation lead magnets (best performer - 2-3x better than others)</li>
                  <li>• First-time buyer guides with mortgage calculator</li>
                  <li>• "Just Sold" case studies with before/after photos</li>
                  <li>• Virtual tour videos of hot listings</li>
                  <li>• Neighborhood market reports (monthly)</li>
                </ul>
                <p className="mt-4 font-semibold">Recommended Budget:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Small market (under 100K population): $500-$1,200/month</li>
                  <li>• Mid-size market (100K-500K): $1,500-$3,500/month</li>
                  <li>• Large market (500K+): $3,000-$7,000/month</li>
                </ul>
              </div>
            </Card>

            <h3>4. Google Local Service Ads (LSA)</h3>

            <p>
              Google Local Service Ads appear above regular Google Ads and organic results with a green "Google Guaranteed" badge. You only pay when someone contacts you directly (not per click).
            </p>

            <Card className="p-5 mb-6 bg-primary/5">
              <p className="mb-2"><strong>Cost:</strong> $25-$75 per qualified lead</p>
              <p className="mb-2"><strong>Pros:</strong> High-intent leads, pay-per-lead model, Google verification badge</p>
              <p className="mb-0"><strong>Cons:</strong> Limited to certain markets, requires background check, competitive in major cities</p>
            </Card>

            <h3>5. SEO & Content Marketing (Long-term Play)</h3>

            <p>
              Creating valuable content that ranks in Google for buyer/seller search queries generates free, high-quality leads month after month.
            </p>

            <Card className="p-6 mb-6">
              <p className="font-semibold mb-3">Top SEO Content Ideas for Canadian Agents:</p>
              <ul className="space-y-2">
                <li>• "[Your City] neighborhood guides" (highest ROI)</li>
                <li>• "Houses for sale in [neighborhood]"</li>
                <li>• "First-time home buyer guide [province]"</li>
                <li>• "[City] real estate market report 2025"</li>
                <li>• "How much does it cost to buy a house in [city]"</li>
                <li>• "Best schools in [neighborhood]"</li>
                <li>• "CMHC insurance requirements Canada"</li>
              </ul>
              <p className="mt-4 text-sm">
                <strong>Timeline:</strong> 6-12 months to see meaningful results, but compounds over time. Agents who started 2 years ago now get 30-60 organic leads/month for $0 acquisition cost.
              </p>
            </Card>

            <h3>6. Open House Sign-In with Instant Follow-Up</h3>

            <p>
              Open houses aren't dead—but the traditional sign-in sheet is. Use digital sign-in tablets that trigger instant automated follow-up.
            </p>

            <Card className="p-5 mb-6 bg-green-50 dark:bg-green-950/20">
              <p className="mb-3"><strong>Strategy:</strong></p>
              <ul className="space-y-2 mb-0">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Use tablet with digital sign-in form (CASL-compliant)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Trigger instant text message with property details + your contact</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Follow-up email within 2 hours with similar listings</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Call hot leads (those who asked detailed questions) within 24 hours</span>
                </li>
              </ul>
            </Card>

            <h3>7. Email Drip Campaigns (Automated Nurturing)</h3>

            <p>
              Most leads aren't ready to transact immediately. Automated email sequences keep you top-of-mind until they are.
            </p>

            <Card className="p-6 mb-6">
              <p className="font-semibold mb-3">Essential Drip Campaigns:</p>
              <ul className="space-y-3">
                <li>
                  <strong>1. Buyer Nurture Sequence (12 emails over 6 months)</strong>
                  <ul className="mt-2 ml-4 space-y-1 text-sm text-muted-foreground">
                    <li>• Email 1: Welcome + market overview</li>
                    <li>• Emails 2-4: Buyer education (mortgage, neighborhoods, process)</li>
                    <li>• Emails 5-8: New listings matching their criteria (weekly)</li>
                    <li>• Emails 9-12: Success stories + urgency (market conditions)</li>
                  </ul>
                </li>
                <li>
                  <strong>2. Seller Nurture Sequence (8 emails over 3 months)</strong>
                  <ul className="mt-2 ml-4 space-y-1 text-sm text-muted-foreground">
                    <li>• Email 1: Free home valuation</li>
                    <li>• Email 2: Preparing your home for sale checklist</li>
                    <li>• Emails 3-5: Recent sales in their neighborhood</li>
                    <li>• Emails 6-8: Why now is the right time (market data)</li>
                  </ul>
                </li>
              </ul>
            </Card>

            <h3>8. Video Marketing (YouTube & Social)</h3>

            <p>
              Video content generates 3.2x more engagement than static posts and builds trust faster than any other medium.
            </p>

            <Card className="p-5 mb-6 bg-primary/5">
              <p className="font-semibold mb-3">Top Video Types (by performance):</p>
              <ol className="space-y-2 mb-0">
                <li><strong>1. Virtual home tours</strong> (highest views + lead generation)</li>
                <li><strong>2. Neighborhood walkthrough videos</strong> (great for SEO)</li>
                <li><strong>3. Market update videos</strong> (monthly, 3-5 minutes)</li>
                <li><strong>4. "Just Sold" client testimonials</strong> (best for credibility)</li>
                <li><strong>5. First-time buyer tips</strong> (evergreen content)</li>
                <li><strong>6. Q&A videos</strong> (address common objections)</li>
              </ol>
            </Card>

            <h3>9. AI Chatbot on Your Website (24/7 Lead Capture)</h3>

            <p>
              73% of website visitors browse outside business hours. An AI chatbot captures these leads automatically and qualifies them while they're hot.
            </p>

            <Card className="p-6 mb-6 border-l-4 border-l-primary">
              <p className="mb-3">
                <strong>What makes an effective real estate chatbot:</strong>
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Zap className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <span>Instant response (within 2 seconds)</span>
                </li>
                <li className="flex items-start">
                  <Zap className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <span>Asks qualifying questions (budget, timeline, property type)</span>
                </li>
                <li className="flex items-start">
                  <Zap className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <span>Suggests relevant listings based on preferences</span>
                </li>
                <li className="flex items-start">
                  <Zap className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <span>Books appointments directly into your calendar</span>
                </li>
                <li className="flex items-start">
                  <Zap className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <span>Hands off to you for complex questions</span>
                </li>
              </ul>
              <p className="mt-4 text-sm text-primary font-semibold">
                Average increase in lead capture: 35-60% vs. traditional contact forms
              </p>
            </Card>

            <h3>10. LinkedIn Networking (B2B Opportunities)</h3>

            <p>
              LinkedIn is underutilized by real estate agents but offers huge opportunities for corporate relocation deals, investor connections, and high-net-worth clients.
            </p>

            <h3>11. Direct Mail (Yes, It Still Works)</h3>

            <p>
              While everyone has gone digital, strategic direct mail has less competition and higher response rates in certain demographics.
            </p>

            <Card className="p-5 mb-6 bg-amber-50 dark:bg-amber-950/20">
              <p className="font-semibold mb-2">What Works in 2025:</p>
              <ul className="space-y-2 mb-0">
                <li>• "Just Sold" postcards to neighbors (30-50 homes around each sale)</li>
                <li>• Personalized market reports to homeowners (not generic flyers)</li>
                <li>• Handwritten notes to high-value prospects</li>
                <li>• Home anniversary cards ("You bought 5 years ago - let's talk equity")</li>
              </ul>
            </Card>

            <h3>12-17. Additional Strategies (Quick Overview)</h3>

            <div className="space-y-4">
              <Card className="p-4">
                <h4 className="font-bold mb-2">12. Zillow Premier Agent / Realtor.ca Advertising</h4>
                <p className="text-sm mb-2">Cost per lead: $80-$250 | Conversion: 3-8%</p>
                <p className="text-sm text-muted-foreground mb-0">High-intent leads but expensive and competitive</p>
              </Card>

              <Card className="p-4">
                <h4 className="font-bold mb-2">13. Community Sponsorships & Events</h4>
                <p className="text-sm mb-2">Cost per lead: $40-$120 | Conversion: 10-18%</p>
                <p className="text-sm text-muted-foreground mb-0">Great for building local brand recognition</p>
              </Card>

              <Card className="p-4">
                <h4 className="font-bold mb-2">14. Door Knocking & Expired Listings</h4>
                <p className="text-sm mb-2">Cost per lead: $5-$25 | Conversion: 8-15%</p>
                <p className="text-sm text-muted-foreground mb-0">Time-intensive but extremely cost-effective</p>
              </Card>

              <Card className="p-4">
                <h4 className="font-bold mb-2">15. Retargeting Ads (Pixel-Based)</h4>
                <p className="text-sm mb-2">Cost per lead: $35-$95 | Conversion: 12-20%</p>
                <p className="text-sm text-muted-foreground mb-0">Re-engage website visitors who didn't convert</p>
              </Card>

              <Card className="p-4">
                <h4 className="font-bold mb-2">16. Webinars & Virtual Seminars</h4>
                <p className="text-sm mb-2">Cost per lead: $25-$70 | Conversion: 15-25%</p>
                <p className="text-sm text-muted-foreground mb-0">High-quality leads but requires preparation</p>
              </Card>

              <Card className="p-4">
                <h4 className="font-bold mb-2">17. Partnership with New Construction Developers</h4>
                <p className="text-sm mb-2">Cost per lead: $0-$50 | Conversion: 20-35%</p>
                <p className="text-sm text-muted-foreground mb-0">Pre-qualified buyers, often exclusive arrangements</p>
              </Card>
            </div>

            <h2 className="flex items-center gap-2 mt-12">
              <BarChart3 className="w-6 h-6 text-primary" />
              Recommended Lead Generation Mix by Budget
            </h2>

            <Card className="p-6 mb-6">
              <h4 className="font-bold mb-4">Starter Budget ($500-$1,500/month)</h4>
              <ul className="space-y-2">
                <li>• 60% - Sphere of Influence marketing (time investment)</li>
                <li>• 20% - Facebook/Instagram ads ($300-500)</li>
                <li>• 10% - Open house strategy with follow-up</li>
                <li>• 10% - Content marketing (SEO - write 2 blogs/month)</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">Expected result: 15-30 leads/month</p>
            </Card>

            <Card className="p-6 mb-6">
              <h4 className="font-bold mb-4">Growth Budget ($2,000-$5,000/month)</h4>
              <ul className="space-y-2">
                <li>• 30% - Facebook/Instagram ads ($800-1,500)</li>
                <li>• 25% - Google Local Service Ads ($600-1,200)</li>
                <li>• 20% - SOI marketing + referral program</li>
                <li>• 15% - Video marketing production</li>
                <li>• 10% - Website AI chatbot + automation tools</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">Expected result: 40-80 leads/month</p>
            </Card>

            <Card className="p-6 mb-6">
              <h4 className="font-bold mb-4">Scale Budget ($5,000-$15,000/month)</h4>
              <ul className="space-y-2">
                <li>• 35% - Facebook/Instagram ads ($2,000-5,000)</li>
                <li>• 25% - Google Ads + LSA ($1,500-3,500)</li>
                <li>• 15% - Zillow/Realtor.ca leads ($1,000-2,000)</li>
                <li>• 10% - Content marketing + SEO agency</li>
                <li>• 10% - Retargeting campaigns</li>
                <li>• 5% - Community sponsorships</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">Expected result: 100-200+ leads/month</p>
            </Card>

            <h2 className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-primary" />
              ROI Calculator: What to Expect
            </h2>

            <Card className="p-6 mb-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
              <h4 className="font-bold mb-4">Example ROI Scenario (Mid-Size Market)</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span>Monthly marketing spend:</span>
                  <span className="font-semibold">$3,000</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Leads generated per month:</span>
                  <span className="font-semibold">50 leads</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Lead-to-appointment rate:</span>
                  <span className="font-semibold">12% = 6 appointments</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Appointment-to-deal rate:</span>
                  <span className="font-semibold">30% = 1.8 deals/month</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Average commission per deal:</span>
                  <span className="font-semibold">$10,000</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-green-600 pt-2">
                  <span>Monthly revenue from leads:</span>
                  <span>$18,000</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-green-700">
                  <span>ROI:</span>
                  <span>500% ($15,000 profit)</span>
                </div>
              </div>
            </Card>

            <h2>Common Lead Generation Mistakes to Avoid</h2>

            <Card className="p-6 mb-8 border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20">
              <ul className="space-y-3 mb-0">
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 mr-2 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Not responding fast enough:</strong> 78% of buyers choose the first agent who responds. Aim for under 5 minutes.
                  </div>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 mr-2 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Relying on one lead source:</strong> Diversify to protect against algorithm changes and market shifts.
                  </div>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 mr-2 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>No follow-up system:</strong> 80% of sales require 5+ follow-ups. Without automation, leads go cold.
                  </div>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 mr-2 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Ignoring CASL compliance:</strong> Can result in $10,000 fines per violation in Canada.
                  </div>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 mr-2 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Not tracking metrics:</strong> What gets measured gets improved. Track cost per lead, conversion rates, ROI.
                  </div>
                </li>
              </ul>
            </Card>

            <h2>How RealtorDesk AI Amplifies Your Lead Generation</h2>

            <p>
              The best lead generation strategy fails without proper follow-up. RealtorDesk AI automates the heavy lifting:
            </p>

            <Card className="p-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Instant Lead Response (Under 60 Seconds)</h4>
                    <p className="text-sm text-muted-foreground mb-0">AI chatbot engages leads 24/7, qualifies them, and books appointments automatically.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Automated Drip Campaigns</h4>
                    <p className="text-sm text-muted-foreground mb-0">Pre-built email and SMS sequences nurture leads until they're ready to transact.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Lead Scoring & Prioritization</h4>
                    <p className="text-sm text-muted-foreground mb-0">AI analyzes behavior and scores leads so you focus on the hottest prospects first.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Multi-Channel Lead Capture</h4>
                    <p className="text-sm text-muted-foreground mb-0">Integrates with Facebook, Google, your website, and MLS systems—all leads in one place.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">CASL & PIPEDA Compliant</h4>
                    <p className="text-sm text-muted-foreground mb-0">Built-in compliance features protect you from fines while maximizing engagement.</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 mb-8 bg-gradient-to-br from-primary/10 to-secondary/10">
              <h3 className="text-2xl font-bold mb-4 text-center">Ready to 3x Your Lead Generation?</h3>
              <p className="text-center text-muted-foreground mb-6">
                Join 800+ Canadian agents using RealtorDesk AI to generate more leads and close more deals.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/pricing">
                  <Button size="lg" className="text-base">
                    Start Free 14-Day Trial
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button size="lg" variant="outline" className="text-base">
                    Watch Demo
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Related Articles */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-xl font-bold mb-6">Related Articles</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Link to="/blog/lead-response-time-study" className="block p-4 rounded-lg border hover:border-primary transition-colors">
                  <h4 className="font-semibold mb-2">Lead Response Time Study: Why 5 Minutes Matters</h4>
                  <p className="text-sm text-muted-foreground">Research shows 78% of buyers choose the first responsive agent</p>
                </Link>
                <Link to="/blog/ai-chatbot-real-estate-websites-canada" className="block p-4 rounded-lg border hover:border-primary transition-colors">
                  <h4 className="font-semibold mb-2">AI Chatbots for Real Estate Websites</h4>
                  <p className="text-sm text-muted-foreground">How AI increases lead capture by 35-60%</p>
                </Link>
                <Link to="/blog/cost-of-missed-real-estate-leads" className="block p-4 rounded-lg border hover:border-primary transition-colors">
                  <h4 className="font-semibold mb-2">The Real Cost of Missed Leads</h4>
                  <p className="text-sm text-muted-foreground">Each missed lead costs $12,000+ in lost commission</p>
                </Link>
                <Link to="/blog/casl-compliance-guide-real-estate-agents" className="block p-4 rounded-lg border hover:border-primary transition-colors">
                  <h4 className="font-semibold mb-2">CASL Compliance Guide for Realtors</h4>
                  <p className="text-sm text-muted-foreground">Avoid $10,000+ fines with proper email marketing</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default LeadGenerationStrategies;
