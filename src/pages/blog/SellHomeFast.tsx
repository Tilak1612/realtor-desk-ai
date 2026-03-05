import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, Calendar, DollarSign, Home, Camera, Megaphone, Users, TrendingDown, CalendarCheck, Gift, Cpu, AlertTriangle, HelpCircle, CheckCircle2, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import blogImage from "@/assets/blog-sell-home-fast.jpg";

const SellHomeFast = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="How to Sell Your Home Fast in Canada: 10 Proven Strategies for 2025"
        description="Learn how to sell your home fast in Canada with 10 proven strategies. From pricing to staging and marketing, get expert tips for quick sales."
        keywords="how to sell home fast Canada, home staging tips, real estate pricing strategy, sell house quickly, best time to sell house"
        image={blogImage}
        article
        publishedTime="2025-01-01"
        modifiedTime="2025-01-01"
        author="RealtorDesk AI"
        canonicalUrl="https://www.realtordesk.ai/sell-home-fast-canada-2025"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "How to Sell Your Home Fast in Canada: 10 Proven Strategies for 2025",
            "description": "Learn how to sell your home fast in Canada with 10 proven strategies. From pricing to staging and marketing, get expert tips for quick sales.",
            "author": { "@type": "Organization", "name": "RealtorDesk AI" },
            "publisher": { "@type": "Organization", "name": "RealtorDesk AI" },
            "datePublished": "2025-01-01",
            "dateModified": "2025-01-01"
          }
        ]}
      />

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom">
          <Link to="/resources" className="inline-flex items-center text-primary hover:underline mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Resources
          </Link>

          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Marketing
              </span>
              <div className="flex items-center text-muted-foreground text-sm">
                <Clock className="w-4 h-4 mr-1" />
                16 min read
              </div>
              <div className="flex items-center text-muted-foreground text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                January 2025
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How to Sell Your Home Fast in Canada: 10 Proven Strategies for 2025
            </h1>

            <p className="text-xl text-muted-foreground">
              Homes priced right, staged professionally, and marketed aggressively can sell in 7-14 days. This guide reveals the exact strategies top-performing Canadian agents use.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="container-custom -mt-8 mb-12">
        <img 
          src={blogImage} 
          alt="Sold home with professional staging"
          className="w-full max-w-4xl rounded-2xl shadow-xl"
        />
      </section>

      {/* Article Content */}
      <article className="container-custom pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            
            {/* What You'll Learn */}
            <Card className="p-6 mb-8 bg-primary/5 border-primary/20">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-primary" />
                What You'll Learn
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  The #1 factor that determines how fast your home sells
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  Strategic pricing tactics that trigger bidding wars
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  Home staging secrets that add 5-10% to sale price
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  Digital marketing techniques that attract buyers in 48 hours
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  How AI-powered agent tools accelerate the selling process
                </li>
              </ul>
            </Card>

            {/* Cost of Time */}
            <h2 className="text-3xl font-bold mt-12 mb-6">Why Selling Fast Matters in 2025</h2>
            
            <Card className="p-6 mb-8 border-l-4 border-red-500">
              <h3 className="font-bold mb-4">💸 The Cost of Time on Market</h3>
              <p className="text-muted-foreground mb-4">Every month your home sits unsold costs you:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Direct Carrying Costs:</p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• Mortgage payments: $2,000-5,000/month</li>
                    <li>• Property taxes: $300-600/month</li>
                    <li>• Home insurance: $100-200/month</li>
                    <li>• Utilities: $200-400/month</li>
                    <li>• Maintenance: $200-500/month</li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-2xl text-red-600">$2,800 - $6,700</p>
                  <p className="text-sm text-muted-foreground">Total monthly cost</p>
                  <p className="font-bold text-lg mt-4">Over 6 months: $16,800 - $40,200</p>
                  <p className="text-sm text-muted-foreground">Money that could be equity in your next home</p>
                </div>
              </div>
            </Card>

            {/* 10 Strategies */}
            <h2 className="text-3xl font-bold mt-12 mb-6">10 Proven Strategies to Sell Fast</h2>

            {/* Strategy 1 */}
            <Card className="p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Strategy #1: Price It Right from Day One</h3>
                  <p className="text-muted-foreground mb-4">
                    <strong>This is the single most important decision you'll make.</strong> Overpricing is the #1 reason homes sit on the market for months.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="font-bold text-red-700">❌ When You Overprice:</p>
                      <ul className="text-sm text-red-600 mt-2 space-y-1">
                        <li>Week 1-2: Few showings</li>
                        <li>Week 3-4: Agent suggests price reduction</li>
                        <li>Week 9+: Significant price drop needed</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="font-bold text-green-700">✓ When You Price Right:</p>
                      <ul className="text-sm text-green-600 mt-2 space-y-1">
                        <li>Week 1: High showing activity</li>
                        <li>Week 2: Multiple offers received</li>
                        <li>Week 3: Smooth closing scheduled</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Strategy 2 */}
            <Card className="p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Strategy #2: Master First Impressions (Curb Appeal)</h3>
                  <p className="text-muted-foreground mb-4">
                    90% of buyers drive by before booking showings. If your home looks unappealing from the street, they move on.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-bold mb-2">Quick Wins Within 48 Hours:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>✅ Power wash driveway & walkways ($150-300)</li>
                      <li>✅ Fresh mulch in gardens ($200-400)</li>
                      <li>✅ Add potted plants flanking front door ($80-150)</li>
                      <li>✅ Replace worn doormat ($30-60)</li>
                    </ul>
                    <p className="text-primary font-bold mt-3">Total Cost: $500-1,200 | Value Added: 5-10% increase</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Strategy 3 */}
            <Card className="p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Strategy #3: Stage Every Room Like a Model Home</h3>
                  <p className="text-muted-foreground mb-4">
                    Professional staging sells homes <strong>3x faster</strong> and for <strong>5-10% more money</strong> than vacant or poorly staged homes.
                  </p>
                  <div className="grid md:grid-cols-3 gap-3 text-center">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <p className="font-bold text-primary">Investment</p>
                      <p className="text-lg">$2,000-5,000</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <p className="font-bold text-green-700">Return</p>
                      <p className="text-lg">$25,000-50,000</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <p className="font-bold text-blue-700">Time Saved</p>
                      <p className="text-lg">20-40 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Strategy 4 */}
            <Card className="p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Strategy #4: Professional Photography & Virtual Tours</h3>
                  <p className="text-muted-foreground mb-4">
                    <strong>73% of buyers won't book a showing if photos are poor quality.</strong> Your listing photos are your first showing.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-muted/50 rounded">
                      <span>Professional Photography (25-40 photos)</span>
                      <span className="font-bold">$200-500</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/50 rounded">
                      <span>Drone Aerial Photography</span>
                      <span className="font-bold">$150-300</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/50 rounded">
                      <span>3D Virtual Tour (Matterport)</span>
                      <span className="font-bold">$300-600</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Strategy 5 */}
            <Card className="p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  <Megaphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Strategy #5: Aggressive Digital Marketing</h3>
                  <p className="text-muted-foreground mb-4">
                    Where buyers search in 2025: 92% start online, 78% use social media, 64% watch video tours.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> MLS Listing with compelling headline (Day 1)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Realtor.ca syndication via CREA DDF®</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Facebook & Instagram ad campaigns ($100-300)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Email blast to 500-2,000 buyer contacts</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> YouTube video walkthrough</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Strategy 6 */}
            <Card className="p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Strategy #6: Strategic Open Houses</h3>
                  <p className="text-muted-foreground">
                    78% of buyers attend at least one open house. Host public open houses (weekends 2-4 PM), broker previews (weekdays 11 AM-1 PM), and twilight events (Thursday 5-7 PM).
                  </p>
                </div>
              </div>
            </Card>

            {/* Strategy 7 */}
            <Card className="p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Strategy #7: Price Reductions (If Needed)</h3>
                  <p className="text-muted-foreground">
                    If your home hasn't sold in 21 days, reevaluate pricing. Minor adjustment (1-3%) for good feedback, significant reduction (5-8%) if minimal showings.
                  </p>
                </div>
              </div>
            </Card>

            {/* Strategy 8 */}
            <Card className="p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Strategy #8: Flexible Showing Schedule</h3>
                  <p className="text-muted-foreground">
                    The easier it is to see your home, the faster it sells. Allow showings 7 days per week, 9 AM - 7 PM minimum. Selling 30 days faster saves $3,000-7,000 in carrying costs.
                  </p>
                </div>
              </div>
            </Card>

            {/* Strategy 9 */}
            <Card className="p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Strategy #9: Offer Incentives to Buyers</h3>
                  <p className="text-muted-foreground mb-4">
                    In slower markets, buyer incentives can tip the scales.
                  </p>
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-muted/50 rounded">💰 Closing cost credit (1-2%)</div>
                    <div className="p-2 bg-muted/50 rounded">📅 Flexible closing date</div>
                    <div className="p-2 bg-muted/50 rounded">🔧 Home warranty ($500-800)</div>
                    <div className="p-2 bg-muted/50 rounded">🔍 Pre-inspection report</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Strategy 10 */}
            <Card className="p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Strategy #10: Work with a Tech-Savvy Agent</h3>
                  <p className="text-muted-foreground mb-4">
                    The right agent sells your home 30-50% faster. Top agents respond in under 5 minutes using AI automation vs. 2-4 hours for average agents.
                  </p>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="font-bold text-primary mb-2">AI-Powered Agents Deliver:</p>
                    <ul className="text-sm space-y-1">
                      <li>✅ Sub-3-second response times to buyer inquiries</li>
                      <li>✅ 24/7 automated showing scheduling</li>
                      <li>✅ Predictive buyer matching</li>
                      <li>✅ Homes sold in 14 days average vs. 30-40 days</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Common Mistakes */}
            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center">
              <AlertTriangle className="w-8 h-8 mr-3 text-orange-500" />
              Common Mistakes That Slow Down Sales
            </h2>

            <div className="space-y-3 mb-8">
              {[
                { mistake: "Overpricing to 'leave room for negotiation'", why: "Buyers filter you out of searches" },
                { mistake: "Living in the home during showings", why: "Buyers feel uncomfortable discussing pros/cons" },
                { mistake: "Ignoring agent feedback", why: "Missing honest buyer reactions" },
                { mistake: "Poor curb appeal", why: "50% of buyers won't even enter" },
                { mistake: "Restricting showing times", why: "Serious buyers have limited availability" },
                { mistake: "Skipping professional photography", why: "73% won't book showings with poor photos" },
              ].map((item, idx) => (
                <Card key={idx} className="p-3 border-l-4 border-orange-500">
                  <p className="font-bold text-orange-600">❌ {item.mistake}</p>
                  <p className="text-sm text-muted-foreground">Why it fails: {item.why}</p>
                </Card>
              ))}
            </div>

            {/* 30-Day Action Plan */}
            <h2 className="text-3xl font-bold mt-12 mb-6">Your 30-Day Action Plan</h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <Card className="p-4">
                <h4 className="font-bold text-primary mb-2">Week 1: Preparation</h4>
                <ul className="text-sm space-y-1">
                  <li>✅ Interview 2-3 agents</li>
                  <li>✅ Get CMA and pricing recommendation</li>
                  <li>✅ Schedule professional photography</li>
                  <li>✅ Begin decluttering</li>
                </ul>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold text-primary mb-2">Week 2: Staging & Setup</h4>
                <ul className="text-sm space-y-1">
                  <li>✅ Complete staging</li>
                  <li>✅ Photography shoot</li>
                  <li>✅ Prepare marketing materials</li>
                  <li>✅ Finalize listing price</li>
                </ul>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold text-primary mb-2">Week 3: Launch</h4>
                <ul className="text-sm space-y-1">
                  <li>✅ Go live on MLS (Thursday)</li>
                  <li>✅ Social media campaigns launch</li>
                  <li>✅ First open house</li>
                  <li>✅ Collect feedback</li>
                </ul>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold text-primary mb-2">Week 4: Offers</h4>
                <ul className="text-sm space-y-1">
                  <li>✅ Review all offers</li>
                  <li>✅ Negotiate terms</li>
                  <li>✅ Accept offer</li>
                  <li>✅ Begin closing process</li>
                </ul>
              </Card>
            </div>

            {/* FAQs */}
            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center">
              <HelpCircle className="w-8 h-8 mr-3 text-primary" />
              Frequently Asked Questions
            </h2>

            <div className="space-y-4 mb-8">
              {[
                { q: "How long does it take to sell a home in Canada in 2025?", a: "Market average is 25-40 days depending on location. With proper pricing and marketing, expect 7-21 days." },
                { q: "Should I sell my home before buying a new one?", a: "Ideal sequence: Get pre-approved, list your home, accept offer with 60-90 day closing, buy new home during closing period." },
                { q: "What's the best time of year to sell?", a: "Spring (March-May) has highest buyer demand. Fall (Sept-Oct) is second-best. Avoid December-February if possible." },
                { q: "How do I handle multiple offers?", a: "Set a 'highest and best' deadline, review all offers with your agent, prioritize terms beyond price (closing date, conditions, deposit)." },
              ].map((item, idx) => (
                <Card key={idx} className="p-4">
                  <h4 className="font-bold mb-2">{item.q}</h4>
                  <p className="text-muted-foreground text-sm">{item.a}</p>
                </Card>
              ))}
            </div>

            {/* Conclusion */}
            <h2 className="text-3xl font-bold mt-12 mb-6">Conclusion</h2>
            <p className="text-muted-foreground mb-6">
              Selling your home fast in Canada in 2025 comes down to three pillars: <strong>strategic pricing, professional presentation, and aggressive marketing</strong>.
            </p>
            <p className="text-muted-foreground mb-8">
              By pricing right, staging every room, and partnering with a tech-savvy agent who responds to buyers instantly, you can sell in <strong>7-21 days</strong>—well ahead of the market average.
            </p>

            {/* CTA */}
            <Card className="p-8 bg-gradient-to-r from-primary to-secondary text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Sell Your Home Fast?</h3>
              <p className="mb-6 text-white/90">
                Find a real estate agent who uses modern AI-powered tools to respond to buyers in seconds, not hours.
              </p>
              <Link to="/demo">
                <Button size="lg" variant="secondary">
                  Book a Free Demo
                </Button>
              </Link>
            </Card>

            {/* Related Articles */}
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-4">Related Articles</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Link to="/lead-response-time-canadian-realtors" className="block">
                  <Card className="p-4 hover:shadow-lg transition-shadow">
                    <h4 className="font-bold text-primary">Lead Response Time: Why Realtors Lose Deals</h4>
                    <p className="text-sm text-muted-foreground">Why the first 5 minutes matter most</p>
                  </Card>
                </Link>
                <Link to="/canadian-realtors-thrive-slower-market-ai-automation" className="block">
                  <Card className="p-4 hover:shadow-lg transition-shadow">
                    <h4 className="font-bold text-primary">AI Automation for Canadian Realtors</h4>
                    <p className="text-sm text-muted-foreground">Thrive in slower markets with AI</p>
                  </Card>
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

export default SellHomeFast;
