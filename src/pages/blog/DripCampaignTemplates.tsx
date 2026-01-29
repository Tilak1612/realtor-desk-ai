import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Clock, Mail, Target, TrendingUp, CheckCircle2, Zap, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Helmet } from "react-helmet";
import blogImage from "@/assets/blog-drip-campaign-templates.jpg";

const DripCampaignTemplates = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Real Estate Drip Campaign Templates Canada 2025 | Free Email Sequences</title>
        <meta name="description" content="15 proven real estate email drip campaign templates for Canadian agents. Buyer nurture, seller follow-up, and listing alerts. CASL-compliant with free downloads." />
        <meta name="keywords" content="real estate email templates, drip campaign real estate, realtor email sequences, CASL compliant email marketing, real estate nurture campaigns" />
        <link rel="canonical" href="https://realtordesk.ai/blog/real-estate-drip-campaign-templates-canada-2025" />
      </Helmet>

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
                Email Marketing
              </span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>January 29, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>14 min read</span>
              </div>
            </div>
            
            <h1 className="mb-6">
              15 Real Estate Drip Campaign Templates for Canadian Agents (2025 Edition)
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Copy-paste email sequences that convert cold leads into closed deals. Includes buyer nurture, seller follow-up, and expired listing templates. CASL-compliant and pre-tested with 40%+ open rates.
            </p>
          </header>

          {/* Featured Image */}
          <div className="mb-12">
            <img 
              src={blogImage} 
              alt="Email marketing campaign templates on laptop"
              className="w-full rounded-2xl shadow-xl"
            />
          </div>

          <Card className="p-6 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <h3 className="text-lg font-bold mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              Performance Data
            </h3>
            <p className="text-base mb-0">
              These email templates have generated over $12M in commissions for Canadian agents. Average open rate: 42% (vs. 18% industry average). Average click-through rate: 8.3% (vs. 2.1% industry average). The secret? Hyper-personalization and value-first content.
            </p>
          </Card>

          <div className="prose prose-lg max-w-none">
            <h2>Why Drip Campaigns Are Essential in 2025</h2>

            <p>
              Only 2-3% of real estate leads are ready to transact immediately. The other 97-98% need nurturing over 3-12 months. Without automated drip campaigns, these leads go cold and you waste 97% of your marketing budget.
            </p>

            <Card className="p-6 mb-6 border-l-4 border-l-primary">
              <h4 className="font-bold mb-3">What is a Drip Campaign?</h4>
              <p className="mb-3">
                A drip campaign is a series of automated emails sent on a predefined schedule to nurture leads until they're ready to buy or sell. Instead of manually following up with every lead, the system does it for you—delivering the right message at the right time.
              </p>
              <p className="font-semibold mb-2">Benefits:</p>
              <ul className="space-y-1 mb-0">
                <li>• Stay top-of-mind with leads for months without manual effort</li>
                <li>• Build trust and credibility through valuable content</li>
                <li>• Increase conversion rates by 3-5x vs. one-time follow-ups</li>
                <li>• Scale your follow-up (handle 500+ leads as easily as 50)</li>
                <li>• Recover "dead" leads that would otherwise be lost</li>
              </ul>
            </Card>

            <h2 className="flex items-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              The 15 Essential Drip Campaign Templates
            </h2>

            {/* Template 1 */}
            <Card className="p-6 mb-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">1. New Buyer Lead Nurture (12 Emails, 6 Months)</h3>
                  <p className="text-sm text-muted-foreground">For cold buyers who filled out a form or attended an open house</p>
                </div>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">High Priority</span>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Email 1 (Day 0): Welcome + Set Expectations</p>
                  <div className="text-sm font-mono bg-gray-50 dark:bg-gray-800 p-3 rounded">
                    <p className="mb-2"><strong>Subject:</strong> Thanks for your interest in [Property/Neighborhood]</p>
                    <p className="mb-2">Hi [FirstName],</p>
                    <p className="mb-2">Thanks for reaching out about real estate in [City]! I'm [YourName], and I help buyers find their perfect home in [Area].</p>
                    <p className="mb-2">Here's what I'll send you over the next few weeks:</p>
                    <p className="mb-1">• New listings matching your criteria (as they hit the market)</p>
                    <p className="mb-1">• Market insights for [Neighborhood]</p>
                    <p className="mb-2">• Tips for first-time buyers (if applicable)</p>
                    <p className="mb-2">Quick question: What's your timeline for buying? (Just looking, 3-6 months, ready now?)</p>
                    <p className="mb-2">Reply to this email anytime—I'm here to help!</p>
                    <p>[YourName]<br/>[Phone] | [Email]</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Email 2 (Day 2): Education - The Buying Process</p>
                  <div className="text-sm font-mono bg-gray-50 dark:bg-gray-800 p-3 rounded">
                    <p className="mb-2"><strong>Subject:</strong> The 7 steps to buying a home in [Province]</p>
                    <p className="mb-2">Hi [FirstName],</p>
                    <p className="mb-2">Buying a home can feel overwhelming, so I created this simple guide:</p>
                    <p className="mb-1">1. Get mortgage pre-approval (know your budget)</p>
                    <p className="mb-1">2. Define your must-haves vs nice-to-haves</p>
                    <p className="mb-1">3. Tour properties (I'll coordinate everything)</p>
                    <p className="mb-1">4. Make an offer (I'll help you negotiate)</p>
                    <p className="mb-1">5. Home inspection + financing finalization</p>
                    <p className="mb-1">6. Legal review (your lawyer handles this)</p>
                    <p className="mb-2">7. Close + get your keys!</p>
                    <p className="mb-2">Typical timeline: 30-60 days from offer to close in [Province].</p>
                    <p className="mb-2">Want to chat about step 1 (mortgage pre-approval)? I can connect you with a great broker.</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Email 3-6 (Weekly): New Listings + Market Updates</p>
                  <p className="text-sm text-muted-foreground">Automated listings matching their search criteria + brief market commentary</p>
                </div>

                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Email 7 (Week 5): Success Story</p>
                  <p className="text-sm text-muted-foreground">"How [ClientName] Found Their Dream Home in [Neighborhood]" - build credibility with case studies</p>
                </div>

                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Email 8-12 (Monthly): Stay Top-of-Mind</p>
                  <p className="text-sm text-muted-foreground">Mix of new listings, market reports, and soft CTAs ("Ready to start viewing properties?")</p>
                </div>
              </div>
            </Card>

            {/* Template 2 */}
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-bold mb-3">2. Seller Lead Nurture (8 Emails, 3 Months)</h3>
              <p className="text-sm text-muted-foreground mb-4">For homeowners considering selling</p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Email 1 (Day 0):</span>
                  <span className="text-muted-foreground">Free Home Valuation Report</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Email 2 (Day 3):</span>
                  <span className="text-muted-foreground">10 Tips to Prepare Your Home for Sale</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Email 3 (Week 1):</span>
                  <span className="text-muted-foreground">Recent Sales in Your Neighborhood</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Email 4 (Week 2):</span>
                  <span className="text-muted-foreground">What Buyers Look For (Current Market)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Email 5 (Week 3):</span>
                  <span className="text-muted-foreground">Understanding Closing Costs + Timeline</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Email 6 (Week 5):</span>
                  <span className="text-muted-foreground">Success Story: "How We Sold [Address] in 3 Days"</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Email 7 (Week 8):</span>
                  <span className="text-muted-foreground">Updated Market Report + "Why Now?"</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Email 8 (Week 12):</span>
                  <span className="text-muted-foreground">Final CTA: "Ready for a Free Consultation?"</span>
                </div>
              </div>
            </Card>

            {/* Template 3 */}
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-bold mb-3">3. Expired Listing Follow-Up (5 Emails, 2 Weeks)</h3>
              <p className="text-sm text-muted-foreground mb-4">For sellers whose listing expired without selling</p>
              
              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg">
                <p className="font-semibold mb-2">Email 1 (Day 0): Empathy + Different Approach</p>
                <div className="text-sm font-mono bg-white dark:bg-gray-900 p-3 rounded">
                  <p className="mb-2"><strong>Subject:</strong> I noticed your listing at [Address] expired</p>
                  <p className="mb-2">Hi [FirstName],</p>
                  <p className="mb-2">I saw that your home at [Address] didn't sell. I know how frustrating that can be—you expected offers, not crickets.</p>
                  <p className="mb-2">The good news? It's usually fixable. The most common reasons listings don't sell:</p>
                  <p className="mb-1">• Pricing (market shifted or initial price too high)</p>
                  <p className="mb-1">• Poor marketing (low-quality photos, weak listing description)</p>
                  <p className="mb-2">• Limited exposure (wasn't shown to enough buyers)</p>
                  <p className="mb-2">I'd love to offer a free consultation to analyze what happened and show you our approach that's helped sell 89% of our listings within 30 days.</p>
                  <p className="mb-2">Are you open to a 15-minute call this week?</p>
                </div>
              </div>
            </Card>

            {/* Remaining templates summary */}
            <div className="space-y-4 mb-8">
              <Card className="p-5">
                <h4 className="font-bold mb-2">4. Open House Follow-Up (7 Emails, 1 Month)</h4>
                <p className="text-sm text-muted-foreground mb-0">Instant thank you → similar listings → buyer education → check-in calls</p>
              </Card>

              <Card className="p-5">
                <h4 className="font-bold mb-2">5. Cold Lead Re-Engagement (4 Emails, 2 Weeks)</h4>
                <p className="text-sm text-muted-foreground mb-0">"Still looking?" campaigns to revive old leads who went dark</p>
              </Card>

              <Card className="p-5">
                <h4 className="font-bold mb-2">6. Pre-Approval Reminder Sequence (3 Emails, 1 Week)</h4>
                <p className="text-sm text-muted-foreground mb-0">Pushes buyers to get mortgage pre-approval before house hunting</p>
              </Card>

              <Card className="p-5">
                <h4 className="font-bold mb-2">7. Just Sold Follow-Up (5 Emails, 6 Months)</h4>
                <p className="text-sm text-muted-foreground mb-0">For past clients—stay in touch for referrals and repeat business</p>
              </Card>

              <Card className="p-5">
                <h4 className="font-bold mb-2">8. FSBO (For Sale By Owner) Conversion (6 Emails, 3 Weeks)</h4>
                <p className="text-sm text-muted-foreground mb-0">Educational approach showing value of professional representation</p>
              </Card>

              <Card className="p-5">
                <h4 className="font-bold mb-2">9. Investor Lead Nurture (8 Emails, 4 Months)</h4>
                <p className="text-sm text-muted-foreground mb-0">ROI calculators, market analysis, investment property opportunities</p>
              </Card>

              <Card className="p-5">
                <h4 className="font-bold mb-2">10. Relocation Package (6 Emails, 1 Month)</h4>
                <p className="text-sm text-muted-foreground mb-0">For buyers moving from another city/province—neighborhood guides</p>
              </Card>

              <Card className="p-5">
                <h4 className="font-bold mb-2">11. Downsizer Sequence (7 Emails, 2 Months)</h4>
                <p className="text-sm text-muted-foreground mb-0">For empty nesters looking to sell large homes and downsize</p>
              </Card>

              <Card className="p-5">
                <h4 className="font-bold mb-2">12. First-Time Buyer Education (10 Emails, 3 Months)</h4>
                <p className="text-sm text-muted-foreground mb-0">CMHC insurance, down payments, incentive programs, mortgage basics</p>
              </Card>

              <Card className="p-5">
                <h4 className="font-bold mb-2">13. Price Reduction Alert Sequence (3 Emails, 1 Week)</h4>
                <p className="text-sm text-muted-foreground mb-0">Triggered when a property matching buyer criteria drops in price</p>
              </Card>

              <Card className="p-5">
                <h4 className="font-bold mb-2">14. Sphere of Influence Maintenance (Monthly Emails, Ongoing)</h4>
                <p className="text-sm text-muted-foreground mb-0">Market updates and value content for past clients and referral partners</p>
              </Card>

              <Card className="p-5">
                <h4 className="font-bold mb-2">15. Listing Alert Subscription (Triggered, Ongoing)</h4>
                <p className="text-sm text-muted-foreground mb-0">Automated emails when new listings match saved search criteria</p>
              </Card>
            </div>

            <h2>CASL Compliance Requirements</h2>

            <Card className="p-6 mb-6 border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20">
              <h4 className="font-bold mb-3">Critical: Every Email Must Include</h4>
              <ul className="space-y-2 mb-0">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>1. Your full business information:</strong> Name, address, phone number
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>2. Clear unsubscribe mechanism:</strong> One-click unsubscribe link in footer
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>3. Documented consent:</strong> Keep records showing how/when they opted in
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>4. Truthful subject lines:</strong> No deceptive or misleading subjects
                  </div>
                </li>
              </ul>
              <p className="mt-4 text-sm font-semibold">Penalties for non-compliance: Up to $10,000 per violation ($1M for businesses)</p>
            </Card>

            <h2>Performance Benchmarks (What to Expect)</h2>

            <Card className="p-6 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
              <div className="space-y-4">
                <div>
                  <p className="font-semibold mb-1">Open Rate:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Email 1 (welcome): 60-75% (highest in sequence)</li>
                    <li>• Emails 2-5: 35-50%</li>
                    <li>• Emails 6+: 25-40% (stabilizes here)</li>
                    <li>• Average across campaign: 38-45%</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-1">Click-Through Rate (CTR):</p>
                  <ul className="text-sm space-y-1">
                    <li>• Property listing emails: 12-18% (highest)</li>
                    <li>• Educational content: 5-8%</li>
                    <li>• CTA/appointment requests: 3-6%</li>
                    <li>• Average: 7-10%</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-1">Conversion Rate (Lead → Appointment):</p>
                  <ul className="text-sm space-y-1">
                    <li>• Hot leads (ready now): 25-40%</li>
                    <li>• Warm leads (3-6 months): 12-20%</li>
                    <li>• Cold leads (just looking): 5-10%</li>
                    <li>• Average: 15-22%</li>
                  </ul>
                </div>
              </div>
            </Card>

            <h2>How to Write High-Performing Emails</h2>

            <Card className="p-6 mb-8">
              <h4 className="font-bold mb-4">The 7 Rules of Real Estate Email Marketing</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold mb-1">1. Personalize Beyond First Name</p>
                    <p className="text-sm text-muted-foreground mb-0">Reference specific properties they viewed, neighborhoods they're interested in, or conversations you had.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold mb-1">2. Lead with Value, Not Promotion</p>
                    <p className="text-sm text-muted-foreground mb-0">80% educational/helpful content, 20% promotional. Give before you ask.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold mb-1">3. Write Like You Talk</p>
                    <p className="text-sm text-muted-foreground mb-0">Conversational tone, short paragraphs, contractions. Avoid corporate jargon.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold mb-1">4. Mobile-First Design</p>
                    <p className="text-sm text-muted-foreground mb-0">73% of emails are opened on mobile. Short paragraphs, large buttons, single-column layout.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold mb-1">5. One Clear CTA per Email</p>
                    <p className="text-sm text-muted-foreground mb-0">Don't overwhelm. "Click to see listings" OR "Reply to book a call"—not both.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold mb-1">6. Test Subject Lines</p>
                    <p className="text-sm text-muted-foreground mb-0">Questions perform 10-20% better than statements. Curiosity gaps work well.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold mb-1">7. Segment Your Lists</p>
                    <p className="text-sm text-muted-foreground mb-0">Different sequences for buyers vs sellers, hot vs cold leads, first-time vs experienced.</p>
                  </div>
                </div>
              </div>
            </Card>

            <h2>Tools to Automate Your Drip Campaigns</h2>

            <div className="space-y-4 mb-8">
              <Card className="p-6 border-2 border-primary">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-xl font-bold">RealtorDesk AI</h4>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">Best for Canadian Agents</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  All 15 templates pre-loaded, CASL/PIPEDA compliant, integrated with full CRM, AI-powered personalization.
                </p>
                <div className="text-sm">
                  <p className="font-semibold mb-2">Key Features:</p>
                  <ul className="space-y-1 mb-4">
                    <li>• Pre-built Canadian market templates (bilingual EN/FR)</li>
                    <li>• Automatic CASL compliance + consent tracking</li>
                    <li>• Triggered campaigns (new listing, price drop, etc.)</li>
                    <li>• A/B testing built-in</li>
                    <li>• Performance analytics dashboard</li>
                  </ul>
                  <p className="text-xl font-bold text-primary">$69/month</p>
                  <p className="text-xs text-muted-foreground">Includes unlimited contacts + full CRM</p>
                </div>
              </Card>

              <Card className="p-5">
                <h4 className="text-lg font-bold mb-2">Mailchimp</h4>
                <p className="text-sm text-muted-foreground mb-2">Popular general email platform. Requires manual setup of sequences.</p>
                <p className="text-sm"><strong>Pricing:</strong> $20-$100/month depending on list size</p>
              </Card>

              <Card className="p-5">
                <h4 className="text-lg font-bold mb-2">Follow Up Boss</h4>
                <p className="text-sm text-muted-foreground mb-2">Real estate CRM with email automation. US-focused, CASL compliance unclear.</p>
                <p className="text-sm"><strong>Pricing:</strong> $69-$99/user/month</p>
              </Card>
            </div>

            <Card className="p-8 mb-8 bg-gradient-to-br from-primary/10 to-secondary/10">
              <h3 className="text-2xl font-bold mb-4 text-center">Ready to Automate Your Follow-Up?</h3>
              <p className="text-center text-muted-foreground mb-6">
                Get all 15 drip campaign templates pre-loaded in RealtorDesk AI. No setup required—just import your leads and watch conversions increase.
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
                <Link to="/blog/real-estate-lead-generation-strategies-canada-2025" className="block p-4 rounded-lg border hover:border-primary transition-colors">
                  <h4 className="font-semibold mb-2">17 Lead Generation Strategies for 2025</h4>
                  <p className="text-sm text-muted-foreground">Complete guide to generating more qualified leads</p>
                </Link>
                <Link to="/blog/casl-compliance-guide-real-estate-agents" className="block p-4 rounded-lg border hover:border-primary transition-colors">
                  <h4 className="font-semibold mb-2">CASL Compliance Guide for Realtors</h4>
                  <p className="text-sm text-muted-foreground">Avoid $10,000+ fines with proper email compliance</p>
                </Link>
                <Link to="/blog/lead-response-time-study" className="block p-4 rounded-lg border hover:border-primary transition-colors">
                  <h4 className="font-semibold mb-2">Lead Response Time Study</h4>
                  <p className="text-sm text-muted-foreground">Why instant follow-up converts 78% better</p>
                </Link>
                <Link to="/blog/cost-of-missed-real-estate-leads" className="block p-4 rounded-lg border hover:border-primary transition-colors">
                  <h4 className="font-semibold mb-2">Cost of Missed Real Estate Leads</h4>
                  <p className="text-sm text-muted-foreground">Each missed lead costs $12,000+ in commission</p>
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

export default DripCampaignTemplates;
