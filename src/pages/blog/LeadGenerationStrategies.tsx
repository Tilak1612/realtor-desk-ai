// Rewritten 2026-10-11 to follow the Realtor Desk fact sheet of that date.
//
// Removed: every cost-per-lead, conversion-rate, budget and "expected result"
// figure (none had a source on the page), including the "2,400+ agents / 5.2x"
// key takeaway, the "Canadian Market Reality Check" card, the worked ROI
// scenario, and the "78%", "80%", "73%", "3.2x", "35-60%" and "$10,000 fine"
// claims. Also removed: the section crediting Realtor Desk with a 24/7 chatbot,
// automatic booking, drip campaigns, lead capture from ad platforms and MLS,
// and built-in CASL/PIPEDA compliance, and the "Join 50+ Canadian agents"
// customer count.
//
// The seventeen strategies stay as steps a reader can follow. The order is no
// longer presented as a ranking.
//
// Second pass 2026-10-12: removed the remaining unsourced quantities (the
// "200-500 contacts" database size, "10 contacts per day / 50 min", "30-50
// homes" and the percentage budget splits), and two product statements the
// fact sheet does not support (a "sequence builder", and the assistant
// summarising conversations).
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Clock, Target, TrendingUp, Users, Zap, CheckCircle2, DollarSign, BarChart3, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import blogImage from "@/assets/blog-lead-generation-strategies.jpg";
import blogImageAvif from "@/assets/blog-lead-generation-strategies.avif";
import blogImageWebp from "@/assets/blog-lead-generation-strategies.webp";
import { Picture } from "@/components/Picture";
import { ProductScopeNote } from "@/components/marketing/ProductScopeNote";

const LeadGenerationStrategies = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Real Estate Lead Generation in Canada"
        description="17 real estate lead generation strategies for Canadian agents, with steps for each: sphere of influence, referrals, ads, content, open houses and follow-up."
        keywords="real estate lead generation Canada, realtor marketing strategies, real estate leads Canada, lead generation for realtors, real estate digital marketing"
        image={blogImage}
        article
        publishedTime="2025-01-29"
        modifiedTime="2026-10-12"
        author="Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/blog/real-estate-lead-generation-strategies-canada-2025"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "17 Real Estate Lead Generation Strategies for Canadian Agents",
            "description": "17 real estate lead generation strategies for Canadian agents, with steps for each: sphere of influence, referrals, ads, content, open houses and follow-up.",
            "author": { "@type": "Organization", "name": "Realtor Desk" },
            "publisher": { "@type": "Organization", "name": "Realtor Desk" },
            "datePublished": "2025-01-29",
            "dateModified": "2026-10-12"
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
                <span>January 29, 2025 · Updated October 12, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>11 min read</span>
              </div>
            </div>

            <h1 className="mb-6">
              17 Real Estate Lead Generation Strategies for Canadian Agents
            </h1>
            <ProductScopeNote className="mb-6" />

            <p className="text-xl text-muted-foreground leading-relaxed">
              Seventeen ways Canadian agents find clients, with steps you can follow for each. This guide quotes no cost or conversion figures, because we have none we can source. It shows you how to track your own.
            </p>
          </header>

          {/* Featured Image */}
          <div className="mb-12">
            <Picture
            src={blogImage}
            avif={blogImageAvif}
            webp={blogImageWebp}
            width={1200}
            height={630}
            alt="Real estate agents discussing lead generation strategies"
            className="w-full rounded-2xl shadow-xl"
            priority
          />
          </div>

          <Card className="p-6 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <h3 className="text-lg font-bold mb-3 flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary" />
              Key Takeaway
            </h3>
            <p className="text-base mb-0">
              Do not rely on one channel. Pick three or four strategies you can keep up, and track each one so that you know what it costs you and what it brings in.
            </p>
          </Card>

          <div className="prose prose-lg max-w-none">
            <h2 className="flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Why Lead Generation is Different in Canada
            </h2>

            <p>
              Lead generation advice written for the United States needs adjusting before it fits Canada. CASL (Canada's Anti-Spam Legislation) governs commercial email and text messages, PIPEDA and provincial privacy laws govern personal information, Quebec and other markets work in French, and MLS systems differ by province.
            </p>

            <Card className="p-6 mb-6 border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20">
              <h4 className="text-lg font-bold mb-2">Five Numbers to Track Yourself</h4>
              <ul className="space-y-2 mb-0">
                <li>Cost per lead, by source</li>
                <li>Lead-to-appointment rate</li>
                <li>Appointment-to-deal rate</li>
                <li>Cost to acquire one client</li>
                <li>Your average commission per deal</li>
              </ul>
              <p className="mt-3 mb-0 text-sm">
                We publish no benchmarks for these. They vary by city, source and agent, and the only figures worth planning around are your own.
              </p>
            </Card>

            <h2 className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              17 Lead Generation Strategies
            </h2>

            <p>
              The order below is not a ranking. Each strategy comes with steps to carry it out. What it costs and how well it converts depends on your market, so measure it.
            </p>

            <h3>
              1. Sphere of Influence (SOI) Marketing
            </h3>

            <Card className="p-6 mb-6">
              <p className="mb-4">
                <strong>Why agents use it:</strong> Your sphere of influence (friends, family, past clients, acquaintances) already knows you, so you are not starting from nothing.
              </p>
              <div>
                <p className="font-semibold mb-2">Implementation Steps:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-700 flex-shrink-0 mt-0.5" />
                    <span>Put everyone you know into one contact database (a CRM helps)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-700 flex-shrink-0 mt-0.5" />
                    <span>Send monthly market updates with hyperlocal data</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-700 flex-shrink-0 mt-0.5" />
                    <span>Set a number of contacts to call or text each day, and keep to it</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-700 flex-shrink-0 mt-0.5" />
                    <span>Host quarterly client appreciation events</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-700 flex-shrink-0 mt-0.5" />
                    <span>Send personalized birthday/anniversary cards (set a reminder in your CRM)</span>
                  </li>
                </ul>
              </div>
            </Card>

            <h3>
              2. Referral Partnership Program
            </h3>

            <Card className="p-6 mb-6">
              <p className="mb-4">
                <strong>Why agents use it:</strong> A referral from someone the client already trusts (a mortgage broker, home inspector or lawyer) arrives with some of that trust attached.
              </p>
              <div>
                <p className="font-semibold mb-2">Referral Partners to Approach:</p>
                <ul className="space-y-2">
                  <li>• Mortgage brokers</li>
                  <li>• Home inspectors</li>
                  <li>• Real estate lawyers/notaries</li>
                  <li>• Financial advisors</li>
                  <li>• Interior designers and stagers</li>
                  <li>• General contractors and renovators</li>
                  <li>• Property managers</li>
                </ul>
                <p className="mt-4 text-sm text-muted-foreground">
                  <strong>Before you offer a referral fee:</strong> check your provincial regulator's and your brokerage's rules on who may be paid one. A reciprocal referral arrangement is a common alternative.
                </p>
              </div>
            </Card>

            <h3>
              3. Facebook & Instagram Ads (Local Targeting)
            </h3>

            <Card className="p-6 mb-6">
              <p className="mb-4">
                <strong>Why agents use it:</strong> You can show an ad to people in the area you work. Housing ads are subject to Meta's own targeting restrictions, so read the current rules before you plan a campaign.
              </p>
              <div>
                <p className="font-semibold mb-2">Ad Types to Test:</p>
                <ul className="space-y-2">
                  <li>• A home valuation offer</li>
                  <li>• First-time buyer guides with mortgage calculator</li>
                  <li>• "Just Sold" posts with photos (with your client's permission)</li>
                  <li>• Virtual tour videos of current listings</li>
                  <li>• Neighborhood market reports (monthly)</li>
                </ul>
                <p className="mt-4 font-semibold">Setting a Budget:</p>
                <p className="text-sm mb-0">
                  Start with an amount you can afford to spend for two or three months while you learn what a lead costs in your market. Run one ad type at a time so you can tell which one is working.
                </p>
              </div>
            </Card>

            <h3>4. Google Local Services Ads (LSA)</h3>

            <p>
              Google Local Services Ads are a pay-per-lead format that Google shows above its regular search ads. Whether the format is offered to real estate agents depends on where you work.
            </p>

            <Card className="p-5 mb-6 bg-primary/5">
              <p className="mb-2"><strong>Cost:</strong> set by Google and varies by market. Check Google's own page for current pricing.</p>
              <p className="mb-2"><strong>For:</strong> you pay for a lead rather than a click, and the person contacting you was searching for an agent.</p>
              <p className="mb-0"><strong>Against:</strong> not offered everywhere, and Google sets its own verification requirements.</p>
            </Card>

            <h3>5. SEO & Content Marketing (Long-term Play)</h3>

            <p>
              Useful content that ranks in search for the questions buyers and sellers ask can bring enquiries without an advertising cost. It takes time to write and time to rank.
            </p>

            <Card className="p-6 mb-6">
              <p className="font-semibold mb-3">SEO Content Ideas for Canadian Agents:</p>
              <ul className="space-y-2">
                <li>• "[Your City] neighborhood guides"</li>
                <li>• "Houses for sale in [neighborhood]"</li>
                <li>• "First-time home buyer guide [province]"</li>
                <li>• "[City] real estate market report" (name your data source)</li>
                <li>• "How much does it cost to buy a house in [city]"</li>
                <li>• "Best schools in [neighborhood]"</li>
                <li>• "CMHC insurance requirements Canada"</li>
              </ul>
              <p className="mt-4 text-sm">
                <strong>Timeline:</strong> this is slow. Expect months rather than weeks before search traffic arrives, and there is no guarantee that it will.
              </p>
            </Card>

            <h3>6. Open House Sign-In with Same-Day Follow-Up</h3>

            <p>
              A paper sign-in sheet is hard to read and easy to lose. A digital form on a tablet gives you legible details and a record of who agreed to hear from you.
            </p>

            <Card className="p-5 mb-6 bg-green-50 dark:bg-green-950/20">
              <p className="mb-3"><strong>Strategy:</strong></p>
              <ul className="space-y-2 mb-0">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-700 flex-shrink-0 mt-0.5" />
                  <span>Use a tablet with a digital sign-in form that asks for consent to follow up</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-700 flex-shrink-0 mt-0.5" />
                  <span>Send a text the same day with the property details and your contact information, to visitors who agreed</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-700 flex-shrink-0 mt-0.5" />
                  <span>Follow up by email that evening with similar listings</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-700 flex-shrink-0 mt-0.5" />
                  <span>Call the visitors who asked detailed questions within 24 hours</span>
                </li>
              </ul>
            </Card>

            <h3>7. Email Drip Campaigns (Automated Nurturing)</h3>

            <p>
              Most leads aren't ready to transact immediately. A scheduled series of emails from an email marketing tool keeps you in touch until they are. Under CASL, every message needs the recipient's consent and a working unsubscribe link. Realtor Desk does not run email sequences unattended, so it does not send drip campaigns.
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
                    <li>• Emails 9-12: Client stories (with permission) and current market conditions, with your data source named</li>
                  </ul>
                </li>
                <li>
                  <strong>2. Seller Nurture Sequence (8 emails over 3 months)</strong>
                  <ul className="mt-2 ml-4 space-y-1 text-sm text-muted-foreground">
                    <li>• Email 1: Free home valuation</li>
                    <li>• Email 2: Preparing your home for sale checklist</li>
                    <li>• Emails 3-5: Recent sales in their neighborhood</li>
                    <li>• Emails 6-8: Local market data, with your data source named</li>
                  </ul>
                </li>
              </ul>
            </Card>

            <h3>8. Video Marketing (YouTube & Social)</h3>

            <p>
              Video lets a prospective client see and hear you before they ever get in touch, which a static post cannot do.
            </p>

            <Card className="p-5 mb-6 bg-primary/5">
              <p className="font-semibold mb-3">Video Types to Try:</p>
              <ol className="space-y-2 mb-0">
                <li><strong>1. Virtual home tours</strong></li>
                <li><strong>2. Neighborhood walkthrough videos</strong></li>
                <li><strong>3. Market update videos</strong> (monthly, 3-5 minutes, with your data source named)</li>
                <li><strong>4. "Just Sold" client testimonials</strong> (real clients, with their permission)</li>
                <li><strong>5. First-time buyer tips</strong></li>
                <li><strong>6. Q&A videos</strong> (answer the questions you are asked most)</li>
              </ol>
            </Card>

            <h3>9. A Website Chatbot (a Tool From Other Vendors)</h3>

            <p>
              People browse listings in the evening and at weekends, when you are not at your desk. A website chatbot is one way to acknowledge those visitors and collect their details. Realtor Desk does not offer a website chatbot; this describes a category of product sold by other vendors.
            </p>

            <Card className="p-6 mb-6 border-l-4 border-l-primary">
              <p className="mb-3">
                <strong>What to look for if you trial one:</strong>
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Zap className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <span>It replies straight away and says clearly that it is automated</span>
                </li>
                <li className="flex items-start">
                  <Zap className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <span>It asks a few useful questions (budget, timeline, property type)</span>
                </li>
                <li className="flex items-start">
                  <Zap className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <span>You can see where its listing information comes from</span>
                </li>
                <li className="flex items-start">
                  <Zap className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <span>It records consent before you follow up by email or text</span>
                </li>
                <li className="flex items-start">
                  <Zap className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <span>It hands over to you for anything it cannot answer</span>
                </li>
              </ul>
              <p className="mt-4 text-sm">
                Ask the vendor for a trial and compare enquiries received during it with the same period before. Do not rely on a vendor's quoted uplift.
              </p>
            </Card>

            <h3>10. LinkedIn Networking (B2B Opportunities)</h3>

            <p>
              LinkedIn is where you can reach people who handle corporate relocation, investors and other professionals. It is worth a look if those are the clients you want.
            </p>

            <h3>11. Direct Mail</h3>

            <p>
              Direct mail can reach homeowners who do not see or respond to online ads. Make each piece specific to the street or the home rather than sending a generic flyer.
            </p>

            <Card className="p-5 mb-6 bg-amber-50 dark:bg-amber-950/20">
              <p className="font-semibold mb-2">Formats to Try:</p>
              <ul className="space-y-2 mb-0">
                <li>• "Just Sold" postcards to the homes around each sale</li>
                <li>• Personalized market reports to homeowners (not generic flyers)</li>
                <li>• Handwritten notes to high-value prospects</li>
                <li>• Home anniversary cards ("You bought 5 years ago - let's talk equity")</li>
              </ul>
            </Card>

            <h3>12-17. Additional Strategies (Quick Overview)</h3>

            <div className="space-y-4">
              <Card className="p-4">
                <h4 className="font-bold mb-2">12. Paid Placement on Listing Portals</h4>
                <p className="text-sm text-muted-foreground mb-0">Portals sell advertising and lead programs to agents. Check each portal's own pricing page, and ask how many other agents receive the same lead.</p>
              </Card>

              <Card className="p-4">
                <h4 className="font-bold mb-2">13. Community Sponsorships & Events</h4>
                <p className="text-sm text-muted-foreground mb-0">Builds local name recognition. Hard to trace to individual deals, so ask new clients how they heard of you.</p>
              </Card>

              <Card className="p-4">
                <h4 className="font-bold mb-2">14. Door Knocking & Expired Listings</h4>
                <p className="text-sm text-muted-foreground mb-0">Costs time rather than money. Check your regulator's rules, the National Do Not Call List and any no-soliciting bylaws first.</p>
              </Card>

              <Card className="p-4">
                <h4 className="font-bold mb-2">15. Retargeting Ads (Pixel-Based)</h4>
                <p className="text-sm text-muted-foreground mb-0">Shows your ads to people who visited your website and left. Disclose the tracking in your privacy policy.</p>
              </Card>

              <Card className="p-4">
                <h4 className="font-bold mb-2">16. Webinars & Virtual Seminars</h4>
                <p className="text-sm text-muted-foreground mb-0">Attendees have chosen to spend time with you. Takes preparation and a topic people want.</p>
              </Card>

              <Card className="p-4">
                <h4 className="font-bold mb-2">17. Partnership with New Construction Developers</h4>
                <p className="text-sm text-muted-foreground mb-0">Introductions to buyers of new builds. Terms vary by developer, so get them in writing.</p>
              </Card>
            </div>

            <h2 className="flex items-center gap-2 mt-12">
              <BarChart3 className="w-6 h-6 text-primary" />
              Example Lead Generation Mix by Budget
            </h2>

            <p>
              Each list runs from the channel to lean on most to the one to lean on least. We give no percentage splits and no expected lead counts, because we have no data to base them on.
            </p>

            <Card className="p-6 mb-6">
              <h4 className="font-bold mb-4">Small Budget: Mostly Your Own Time</h4>
              <ul className="space-y-2">
                <li>• Sphere of Influence marketing (time investment)</li>
                <li>• Facebook/Instagram ads</li>
                <li>• Open house strategy with follow-up</li>
                <li>• Content marketing (SEO: write on a schedule you can keep)</li>
              </ul>
            </Card>

            <Card className="p-6 mb-6">
              <h4 className="font-bold mb-4">Medium Budget: Adding Paid Channels</h4>
              <ul className="space-y-2">
                <li>• Facebook/Instagram ads</li>
                <li>• Search ads</li>
                <li>• SOI marketing + referral program</li>
                <li>• Video marketing production</li>
                <li>• Software: CRM and any other tools you choose</li>
              </ul>
            </Card>

            <Card className="p-6 mb-6">
              <h4 className="font-bold mb-4">Larger Budget: Several Paid Channels</h4>
              <ul className="space-y-2">
                <li>• Facebook/Instagram ads</li>
                <li>• Search ads</li>
                <li>• Listing portal advertising</li>
                <li>• Content marketing + SEO help</li>
                <li>• Retargeting campaigns</li>
                <li>• Community sponsorships</li>
              </ul>
            </Card>

            <h2 className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-primary" />
              How to Work Out Your Own Return
            </h2>

            <Card className="p-6 mb-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
              <h4 className="font-bold mb-4">The Arithmetic, Using Your Figures</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span>Monthly marketing spend:</span>
                  <span className="font-semibold">your figure</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Leads generated per month:</span>
                  <span className="font-semibold">your count</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Appointments:</span>
                  <span className="font-semibold">leads × your lead-to-appointment rate</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Deals:</span>
                  <span className="font-semibold">appointments × your appointment-to-deal rate</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Revenue from leads:</span>
                  <span className="font-semibold">deals × your average commission</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-green-700 pt-2">
                  <span>Return:</span>
                  <span>(revenue − spend) ÷ spend</span>
                </div>
              </div>
              <p className="mt-4 mb-0 text-sm">
                Use at least three months of your own records. One good or bad month tells you very little.
              </p>
            </Card>

            <h2>Common Lead Generation Mistakes to Avoid</h2>

            <Card className="p-6 mb-8 border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20">
              <ul className="space-y-3 mb-0">
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 mr-2 text-red-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Replying late:</strong> Someone who enquires may contact more than one agent. Decide in advance how enquiries get answered while you are with clients.
                  </div>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 mr-2 text-red-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Relying on one lead source:</strong> Diversify to protect against algorithm changes and market shifts.
                  </div>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 mr-2 text-red-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>No follow-up system:</strong> One reply is rarely enough. Set a date for the next contact every time you speak to someone.
                  </div>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 mr-2 text-red-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Ignoring CASL:</strong> Commercial emails and texts need consent and a working unsubscribe mechanism, and the law provides for monetary penalties. The official guidance is at fightspam.gc.ca.
                  </div>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 mr-2 text-red-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Not tracking metrics:</strong> Track cost per lead, conversion rates and return for each source, or you cannot tell which ones to keep.
                  </div>
                </li>
              </ul>
            </Card>

            <h2>Where Realtor Desk Fits</h2>

            <p>
              Realtor Desk does not generate leads, run ads or capture visitors on your website. It is a CRM for a single Canadian real estate agent, for keeping track of the leads these strategies bring in:
            </p>

            <Card className="p-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">One List of Leads</h4>
                    <p className="text-sm text-muted-foreground mb-0">Contacts with one conversation timeline per client. Zapier, Make and n8n can push leads in from your other tools.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">A Rule-Based Lead Score</h4>
                    <p className="text-sm text-muted-foreground mb-0">Each lead gets a score from 0 to 100, with the breakdown shown: engagement, behaviour, budget match, timeline and qualification.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">A Suggested Next Action</h4>
                    <p className="text-sm text-muted-foreground mb-0">It suggests what to do next and a time to do it.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">A Drafting Assistant</h4>
                    <p className="text-sm text-muted-foreground mb-0">An in-app assistant drafts text for you to review. Nothing is sent to a client without you.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">A Consent Record, and French per Contact</h4>
                    <p className="text-sm text-muted-foreground mb-0">It records the date and source of consent on each contact and refuses to send from the inbox or by SMS when none is on file. Language is set to French or English per contact. Software does not make anyone compliant.</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 mb-8 bg-gradient-to-br from-primary/10 to-secondary/10">
              <h3 className="text-2xl font-bold mb-4 text-center">Keep the Leads You Generate in One Place</h3>
              <p className="text-center text-muted-foreground mb-6">
                Realtor Desk is CAD $149 a month for a single agent, with a 14-day trial. A card is collected up front and nothing is charged before day 14.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/pricing">
                  <Button size="lg" className="text-base">
                    Start Free 14-Day Trial
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button size="lg" variant="outline" className="text-base">
                    Book a Demo
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Related Articles */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-xl font-bold mb-6">Related Articles</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Link to="/lead-response-time-canadian-realtors" className="block p-4 rounded-lg border hover:border-primary transition-colors">
                  <h4 className="font-semibold mb-2">Why Canadian Agents Lose Hot Leads</h4>
                  <p className="text-sm text-muted-foreground">Where new enquiries go cold, and a routine for replying sooner</p>
                </Link>
                <Link to="/blog/ai-chatbot-real-estate-websites-canada" className="block p-4 rounded-lg border hover:border-primary transition-colors">
                  <h4 className="font-semibold mb-2">AI Chatbots for Real Estate Websites</h4>
                  <p className="text-sm text-muted-foreground">A category guide. Realtor Desk does not offer a chatbot</p>
                </Link>
                <Link to="/resources/cost-of-missed-real-estate-leads-canada" className="block p-4 rounded-lg border hover:border-primary transition-colors">
                  <h4 className="font-semibold mb-2">The Cost of Missed Real Estate Leads</h4>
                  <p className="text-sm text-muted-foreground">Work out what slow follow-up costs, using your own numbers</p>
                </Link>
                <Link to="/resources/casl-compliance-real-estate-email-marketing-canada" className="block p-4 rounded-lg border hover:border-primary transition-colors">
                  <h4 className="font-semibold mb-2">CASL Guide for Realtors</h4>
                  <p className="text-sm text-muted-foreground">Consent and unsubscribe rules for real estate email</p>
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
