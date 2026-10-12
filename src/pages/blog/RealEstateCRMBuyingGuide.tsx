// Rewritten 2026-10-11 to follow the Realtor Desk fact sheet of that date.
//
// Removed: the "wrong CRM costs $12,000-$18,000 a year" opener, every response
// time, conversion, time-saved and lost-lead percentage, the "78% of buyers"
// line, the price bands in the decision framework and pricing sections, the
// unsourced competitor prices and feature claims (IXACT Contact, LionDesk,
// HubSpot, Wise Agent, "US-based CRMs don't include these"), the PIPEDA fine
// figure, the "lead messages you on Facebook at 10 PM" scenario, the "Best CRMs
// by Situation" ranking that named Realtor Desk best for solo agents as
// "PIPEDA compliant" with DDF "coming Q3 2026", and the "analyzed 20+ CRMs and
// interviewed dozens of agents" author note.
//
// Competitor facts that remain are the ones on the fact sheet, checked on the
// vendors' own sites on 2026-10-02. The guide now lists what to check and what
// to ask, then says what Realtor Desk does and does not do.
//
// The prose is static JSX on purpose: the prerenderer skips elements that
// contain an expression.
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, TrendingUp, Shield, Users, Zap, DollarSign, HeadphonesIcon } from "lucide-react";
import { SEO } from "@/components/SEO";
// SVG on the page; the .jpg twin for og:image, because social platforms
// do not render SVG and would show a card with no image at all.
import blogImage from "@/assets/brand/blog-ai-crm-guide.svg";
import blogImageSocial from "@/assets/brand/blog-ai-crm-guide.jpg";
import { Picture } from "@/components/Picture";
import { ProductScopeNote } from "@/components/marketing/ProductScopeNote";

const RealEstateCRMBuyingGuide = () => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "How to Choose a Real Estate CRM in Canada",
    "description": "How to choose a real estate CRM in Canada: map your workflow, define must-have features, check integrations and run a trial before committing.",
    "image": "https://www.realtordesk.ai/blog-ai-crm-guide.jpg",
    "author": {
      "@type": "Organization",
      "name": "Realtor Desk"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Realtor Desk",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.realtordesk.ai/favicon-512x512.png"
      }
    },
    "datePublished": "2026-01-29",
    "dateModified": "2026-10-11"
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="How to Choose a Real Estate CRM in Canada"
        description="How to choose a real estate CRM in Canada: map your workflow, define must-have features, check integrations and run a trial before committing."
        keywords="how to choose real estate CRM, real estate CRM Canada, real estate CRM comparison, CRM buying guide, real estate software selection, choosing CRM for agents"
        canonicalUrl="https://www.realtordesk.ai/blog/real-estate-crm-buying-guide"
        structuredData={[articleSchema]}
      />
      <Navbar />

      <article className="container max-w-4xl mx-auto px-4 pt-32 pb-20">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/resources" className="hover:text-primary">Resources</Link>
            <span>/</span>
            <span>CRM Buying Guide</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            How to Choose a Real Estate CRM in Canada
          </h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 flex-wrap">
            <time dateTime="2026-01-29">January 29, 2026</time>
            <span>•</span>
            <span>Updated October 11, 2026</span>
            <span>•</span>
            <span>8 min read</span>
            <span>•</span>
            <span>CRM Strategy</span>
          </div>

          <ProductScopeNote className="mb-4" />
          <p className="text-sm text-muted-foreground mb-8">
            We build one of the products compared here, so weigh this accordingly.
          </p>

          <Picture
            src={blogImage}
            width={1024}
            height={640}
            alt="Real Estate CRM Selection Guide"
            className="w-full h-[400px] object-cover rounded-xl mb-8"
            priority
          />
        </header>

        <div className="prose prose-lg max-w-none">
          <p className="lead text-xl text-muted-foreground mb-8">
            A CRM is something you use every day for years, and moving out of one takes effort. This guide lists what to check, what to ask each vendor and how to run a trial. It does not rank products.
          </p>

          <Card className="p-6 bg-primary/5 border-primary/20 mb-8">
            <h3 className="text-lg font-bold mb-4">Quick Decision Framework</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span><strong>Solo agent:</strong> a single-agent CRM is enough. You do not need seats, lead routing or team reports, so do not pay for them.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span><strong>Team:</strong> you need lead routing, a shared pipeline and a team inbox. Confirm each one exists before you sign; not every CRM has them.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span><strong>Brokerage:</strong> you are likely also buying back office and transaction management. These products are usually quoted on request.</span>
              </li>
            </ul>
          </Card>

          <h2>Start With Your Own Workflow</h2>
          <p>
            Before you look at any product, write down where your leads come from, how you follow up today, and what you forget or do twice. The right CRM is the one that fits that list and that you will keep up to date.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Signs of a Good Fit
              </h3>
              <ul className="space-y-2 text-sm">
                <li>• New leads arrive without retyping</li>
                <li>• You can see what is due today</li>
                <li>• Each client has one history you can read</li>
                <li>• You can explain the monthly bill</li>
                <li>• You can get your data out</li>
              </ul>
            </Card>

            <Card className="p-6 bg-red-50 dark:bg-red-950/20">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                Signs of a Poor Fit
              </h3>
              <ul className="space-y-2 text-sm">
                <li>• You keep a spreadsheet alongside it</li>
                <li>• You pay for features you never open</li>
                <li>• Messages go out that you did not review</li>
                <li>• Charges appear that you did not expect</li>
                <li>• You cannot tell where your data is stored</li>
              </ul>
            </Card>
          </div>

          <h2>Ten Things to Check in Any Real Estate CRM</h2>

          <h3 className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            1. Lead Capture and First Response
          </h3>
          <p>
            Leads from your website and ad forms should arrive in the CRM without retyping. Some CRMs also offer a website chatbot or an automatic text reply to new enquiries.
          </p>
          <Card className="p-4 bg-green-50 dark:bg-green-950/20 my-4">
            <p className="text-sm mb-2"><strong>Ask the vendor:</strong></p>
            <ul className="text-sm space-y-1">
              <li>• Which of my lead sources connect directly, and which need a tool such as Zapier?</li>
              <li>• If there is an automatic reply, how is consent recorded before it is sent?</li>
              <li>• Can I review or switch off automatic replies?</li>
              <li>• How am I notified of a new lead?</li>
            </ul>
          </Card>

          <h3 className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            2. Privacy and Consent (PIPEDA and CASL)
          </h3>
          <p>
            PIPEDA and CASL apply to you, not to your software. A CRM does not make anyone compliant, but it can keep the records you need. Ask:
          </p>
          <ul>
            <li>Where is the database hosted, and which outside services process data elsewhere?</li>
            <li>Does it record the date and source of consent for each contact?</li>
            <li>Does it stop sending to a contact who has withdrawn consent?</li>
            <li>How do I export or delete one person's data?</li>
          </ul>
          <p className="italic text-muted-foreground">
            This is general information, not legal advice. Put the same questions to every vendor, wherever they are based.
          </p>

          <h3 className="flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            3. Listing Data and CREA DDF®
          </h3>
          <p>
            If you want listings to flow into the CRM automatically, ask whether the vendor has a native CREA DDF® connection that is live today, not planned. If it is not live, ask how listings get in and how much of that is manual.
          </p>

          <h3>4. Lead Scoring and Qualification</h3>
          <p>
            Many CRMs score leads, and some ask qualifying questions by chat or text. Ask:
          </p>
          <ul>
            <li>Is the score rule-based or produced by a statistical model?</li>
            <li>Can I see why a lead received its score?</li>
            <li>If the software asks questions for me, can I read the transcript?</li>
            <li>Does anything reach a lead without my review?</li>
          </ul>

          <h3>5. Communication Channels</h3>
          <p>
            Clients reach agents by email, text, phone and social apps. Check which channels the CRM actually sends and receives on, and whether they all land in one history per client. Do not assume a channel is covered because it appears on a features page.
          </p>

          <h3 className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            6. Pipeline and Deal Management
          </h3>
          <p>
            A visual pipeline shows every deal from first contact to closing. Decide which of these you need, because not every CRM includes them all:
          </p>
          <ul>
            <li>Drag-and-drop deal stages</li>
            <li>Tasks and reminders tied to a deal</li>
            <li>Document storage and e-signature</li>
            <li>Commission tracking</li>
          </ul>

          <h3>7. Email and SMS Automation</h3>
          <p>
            Some CRMs send scheduled sequences: a welcome series for a new lead, a follow-up after a showing, a periodic check-in with past clients. Ask whether scheduled sending is switched on today, whether it checks consent before each send, and how an unsubscribe is honoured.
          </p>

          <h3>8. Reporting</h3>
          <p>
            Write down the questions you want answered and check the CRM can answer them:
          </p>
          <ul>
            <li>Which lead sources produce closed deals?</li>
            <li>How long does a lead take to reach closing?</li>
            <li>Where do deals stall in my pipeline?</li>
            <li>What is in my pipeline for the next few months?</li>
          </ul>

          <h3>9. Use on Your Phone</h3>
          <p>
            Much of the job happens away from a desk. Some CRMs have native iOS and Android apps; others are responsive web apps that run in the phone's browser. Either can work. During the trial, try these from your phone:
          </p>
          <ul>
            <li>Reply to a lead</li>
            <li>Add a note after a meeting</li>
            <li>Move a deal to the next stage</li>
          </ul>

          <h3 className="flex items-center gap-2">
            <HeadphonesIcon className="w-6 h-6 text-primary" />
            10. Support
          </h3>
          <p>
            Ask what hours support is open and through which channels. Then test it: send a real question during the trial and note how long a useful answer takes.
          </p>

          <h2>Pricing Models: What You Are Paying For</h2>

          <h3 className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-primary" />
            Per-User Pricing
          </h3>
          <p>
            Each person on the account pays. The cost follows team size. Follow Up Boss, for example, shows its Grow plan at $69 per user a month ($58 on annual billing) on its own site, with the currency not stated, and lists lead routing, a team inbox, calling and 250+ integrations (checked October 2, 2026).
          </p>

          <h3>One Price for One Agent</h3>
          <p>
            A single-agent product has one price and no seats. Realtor Desk is CAD $149 a month for a single agent.
          </p>

          <h3>Quoted on Request</h3>
          <p>
            Some vendors publish no prices. Lofty and BoldTrail (formerly kvCORE) quote on request (checked October 2, 2026). Ask for a written quote that covers twelve months.
          </p>

          <h3>Free Tiers</h3>
          <p>
            Some general-purpose CRMs have a free tier. Check which features sit behind the paid tiers before you build your process on it.
          </p>

          <Card className="p-6 bg-amber-50 dark:bg-amber-950/20 my-8">
            <h3 className="text-lg font-bold mb-4">Costs to Ask About</h3>
            <ul className="space-y-2">
              <li>• <strong>Setup fees:</strong> ask every vendor directly — several quote them privately rather than publishing</li>
              <li>• <strong>Integration fees:</strong> is each connection included or charged separately?</li>
              <li>• <strong>SMS and voice usage:</strong> who bills for messages and minutes, and at what rate?</li>
              <li>• <strong>Storage:</strong> is there a limit, and what happens past it?</li>
              <li>• <strong>Training and onboarding:</strong> included or extra?</li>
              <li>• <strong>Currency:</strong> is the price in Canadian or US dollars?</li>
            </ul>
            <p className="mt-4 font-semibold">
              Always calculate <strong>Total Cost of Ownership</strong> over 12 months, not just the advertised monthly price.
            </p>
          </Card>

          <h2>How to Test a CRM Before Committing</h2>

          <h3>Step 1: Start a Trial</h3>
          <p>
            Shortlist two or three CRMs. For each, check whether a card is required to start and on which day the first charge happens.
          </p>

          <h3>Step 2: Import Real Data</h3>
          <p>
            Test with real contacts, not invented ones. Ask what an import brings across: contacts only, or also consent records, deals and history.
          </p>

          <h3>Step 3: Run These Specific Tests</h3>
          <ul>
            <li><strong>Lead test:</strong> Submit your own lead form and see how and when you are notified</li>
            <li><strong>Mobile test:</strong> Try managing a lead entirely from your phone</li>
            <li><strong>Integration test:</strong> Connect your email, calendar, and one lead source</li>
            <li><strong>Automation test:</strong> Set up one simple follow-up and confirm it does what the vendor says</li>
            <li><strong>Support test:</strong> Contact support with a question and note the response</li>
          </ul>

          <h3>Step 4: Ask Current Users</h3>
          <p>
            Ask agents in your brokerage or board who use the product day to day what they like and what they regret.
          </p>

          <h2>Things to Be Careful About</h2>

          <div className="space-y-4 my-8">
            <Card className="p-4 border-l-4 border-red-500">
              <p className="font-bold text-red-700">No Way to Try It</p>
              <p className="text-sm mt-2">Ask for a trial, or a monthly plan you can cancel, before you commit to anything longer.</p>
            </Card>

            <Card className="p-4 border-l-4 border-red-500">
              <p className="font-bold text-red-700">Long Contracts</p>
              <p className="text-sm mt-2">Ask whether you can pay monthly, what it costs to leave early, and how you get your data out.</p>
            </Card>

            <Card className="p-4 border-l-4 border-red-500">
              <p className="font-bold text-red-700">Repeated Complaints in Reviews</p>
              <p className="text-sm mt-2">Read recent reviews on independent sites and look for the same problem raised by different people.</p>
            </Card>

            <Card className="p-4 border-l-4 border-red-500">
              <p className="font-bold text-red-700">Canadian Needs Left Unanswered</p>
              <p className="text-sm mt-2">Ask about where data is hosted, French, listing data and the billing currency. A vague answer is an answer.</p>
            </Card>

            <Card className="p-4 border-l-4 border-red-500">
              <p className="font-bold text-red-700">Quote-Only Pricing</p>
              <p className="text-sm mt-2">It is not a fault in itself, but it makes comparison harder. Get the quote in writing.</p>
            </Card>
          </div>

          <h2>FAQ: Real Estate CRM Selection</h2>

          <h3>Should I choose a real estate-specific CRM or a general CRM?</h3>
          <p>
            A real estate CRM usually arrives with pipeline stages and fields that fit a transaction. A general CRM can be configured to do the same, and that takes setup time. Choose the one you will actually keep up to date.
          </p>

          <h3>Can I switch CRMs later if I change my mind?</h3>
          <p>
            Yes, but moving takes effort. Before you start with any CRM, ask what you can export (contacts, notes, deals, history) and in what format.
          </p>

          <h3>Do I need AI features or is a basic CRM enough?</h3>
          <p>
            Not necessarily. Decide which tasks you want help with, such as ranking leads or drafting replies, and whether you are comfortable with software sending anything without your review. A basic CRM used every day beats an advanced one left unopened.
          </p>

          <h3>How long should I test a CRM before deciding?</h3>
          <p>
            Long enough to take a real lead from first contact through a follow-up. Use the whole trial period.
          </p>

          <h3>What is a common mistake agents make when choosing a CRM?</h3>
          <p>
            Choosing on price or on the length of the feature list alone. Compare what each one costs over a year against the work you will actually do in it.
          </p>

          <h2>What We Can Say About Specific Vendors</h2>

          <p>
            We do not rank products here. These points come from the vendors' own sites, checked October 2, 2026. Confirm them yourself before you decide.
          </p>

          <div className="space-y-4 my-8">
            <Card className="p-6">
              <h3 className="font-bold mb-2">Follow Up Boss</h3>
              <p className="text-sm text-muted-foreground">Grow plan shown at $69 per user a month ($58 on annual billing), currency not stated. Lists lead routing, a team inbox, calling and 250+ integrations.</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-2">Lofty</h3>
              <p className="text-sm text-muted-foreground">Publishes no prices. Pricing is quoted on request.</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-2">BoldTrail (formerly kvCORE)</h3>
              <p className="text-sm text-muted-foreground">Publishes no prices. Pricing is quoted on request.</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-2">LionDesk</h3>
              <p className="text-sm text-muted-foreground">Discontinued in September 2025 (Lone Wolf Technologies). Older guides that recommend it are out of date.</p>
            </Card>
          </div>

          <h2>Where Realtor Desk Fits</h2>

          <p>
            Realtor Desk is a CRM for Canadian real estate agents, built for a single agent. It is CAD $149 a month.
          </p>

          <h3>What It Does</h3>
          <ul>
            <li>Contacts, one conversation timeline per client, a drag-and-drop deal pipeline with totals in CAD, and basic reports.</li>
            <li>A lead score from 0 to 100. It is rule-based, with a visible breakdown: engagement, behaviour, budget match, timeline and qualification. It is not machine learning.</li>
            <li>A suggested next action and a time to take it.</li>
            <li>An in-app assistant that drafts a reply or summarises the thread on the contact you have open. Nothing is sent to a client without you.</li>
            <li>French or English, set per contact. The interface and client email both work in French.</li>
            <li>A consent record: the date and source of consent on each contact. It refuses to send from the inbox or by SMS when no consent is on file.</li>
            <li>A production database hosted in Canada. Some outside services (SMS, email delivery, AI drafting) may process data outside Canada.</li>
            <li>Zapier, Make and n8n can push leads in. Twilio sends SMS. Email goes through your own SMTP server.</li>
            <li>Contacts import from a CSV. The import does not bring consent, deals or history, and does not merge duplicates.</li>
          </ul>

          <h3>What It Does Not Do</h3>
          <ul>
            <li>No seats, lead routing, shared pipeline or team inbox. A team needs a different product.</li>
            <li>No website chatbot, no voice agent and no WhatsApp. No automatic replies or automatic showing booking.</li>
            <li>A sequence builder exists, but scheduled email sequences are not switched on.</li>
            <li>Native CREA DDF® sync is on the roadmap and is not live yet. A single listing can be imported from a Realtor.ca address or an MLS number.</li>
            <li>Google Calendar and Outlook connect, but appointment sync is not live.</li>
            <li>No transaction management, e-signature, document storage or commission tracking.</li>
            <li>No native iOS or Android app. It is a responsive web app.</li>
          </ul>

          <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 my-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                Try Realtor Desk
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Realtor Desk has a 14-day trial. A card is collected up front and nothing is charged before day 14. Run the tests in this guide against it, as you would with any other CRM.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start 14-Day Trial
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Book a 30-Min Demo
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Cancel anytime before you're charged
              </p>
            </div>
          </Card>

          <div className="border-t pt-8 mt-12">
            <p className="text-sm text-muted-foreground">
              <strong>About this guide:</strong> Written by the Realtor Desk team. We build one of the products in this category. Last updated October 2026.
            </p>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default RealEstateCRMBuyingGuide;
