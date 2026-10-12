// Rewritten 2026-10-11 to follow the Realtor Desk fact sheet of that date.
//
// Removed: the "ROI of AI-Powered CRM" section (25-40% conversion lift, 10-15
// hours a week saved, 3-6 extra transactions, all unsourced), the claims that a
// CRM "must" store data on Canadian servers, "ensure compliance" and ship iOS
// and Android apps, the "AI revolution" framing of chatbots and predictive
// analytics as settled capability, and the closing call to action that said
// Realtor Desk would "transform your real estate business". The headline no
// longer reads "The AI CRM", which implied this product is the one described.
//
// What is left explains what the label covers, what a Canadian agent should ask
// a vendor, and what Realtor Desk does and does not do.
//
// The prose is static JSX on purpose: the prerenderer skips elements that
// contain an expression.
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Database, Shield, Globe, Smartphone, BarChart3, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
// SVG for the on-page image; PNG for og:image, because social platforms do
// not render SVG and an SVG there produces a card with no image at all.
import blogAICRM from "@/assets/brand/blog-ai-crm.svg";
import blogAICRMSocial from "@/assets/brand/blog-ai-crm.jpg";
import { SEO } from "@/components/SEO";
import { ProductScopeNote } from "@/components/marketing/ProductScopeNote";

const AICRMGuide = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="AI CRM for Canadian Real Estate Agents"
        description="What an AI CRM is, and what Canadian real estate agents should ask a vendor about consent, data location, French and listing data before choosing one."
        keywords="AI CRM for Canadian Realtors, real estate CRM Canada, CRM consent records, questions to ask a CRM vendor"
        image={blogAICRMSocial}
        article
        publishedTime="2025-01-18"
        modifiedTime="2026-10-11"
        author="Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/ai-crm-canadian-real-estate-agents-guide"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "AI CRM for Canadian Real Estate Agents",
            "description": "What an AI CRM is, and what Canadian real estate agents should ask a vendor about consent, data location, French and listing data before choosing one.",
            "author": { "@type": "Organization", "name": "Realtor Desk" },
            "publisher": { "@type": "Organization", "name": "Realtor Desk" },
            "datePublished": "2025-01-18",
            "dateModified": "2026-10-11"
          }
        ]}
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-24 pb-16">
          <article className="container mx-auto px-4 max-w-4xl">
            <Link to="/resources" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Resources
            </Link>

            <header className="mb-8">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 flex-wrap">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">Technology Guide</span>
                <span>January 18, 2025</span>
                <span>Updated October 11, 2026</span>
                <span>5 min read</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                AI CRM for Canadian Real Estate Agents: What to Check
              </h1>
              <ProductScopeNote className="mb-6" />
              <p className="text-xl text-muted-foreground">
                A plain guide to what vendors mean by an AI CRM, what a Canadian agent should ask before choosing one, and where our own product fits. We build a CRM ourselves, so weigh this accordingly.
              </p>
            </header>

            {/* Alt corrected. It read "Canadian Realtor reviewing analytics on
                an AI-powered CRM dashboard" while the image was a stock photo
                of a woman in pyjamas on a bed with a laptop -- describing
                something the picture did not show. */}
            <img
              loading="lazy"
              decoding="async"
              src={blogAICRM}
              width={1200}
              height={630}
              alt="Article header: an AI CRM for Canadian agents"
              className="w-full h-64 md:h-96 object-cover rounded-xl mb-12"
            />

            <div className="prose prose-lg max-w-none">
              <p>
                A CRM (customer relationship management system) is where an agent keeps contacts, conversations and deals. More and more of them are sold as AI-powered. That label covers several different things, and for a Canadian agent a few questions about consent, data location, French and listing data matter as much as the AI.
              </p>

              <h2 className="flex items-center gap-3 text-2xl font-bold mt-12 mb-6">
                <Database className="w-6 h-6 text-primary" />
                What a Real Estate CRM Is For
              </h2>
              <p>
                A CRM is the record of who you know, what you have said to them and where each deal stands. If you are working from spreadsheets and your inbox, it replaces both.
              </p>
              <p>A real estate CRM is generally sold as doing some or all of these:</p>
              <ul>
                <li><strong>Capturing leads</strong> from your website, ad forms and other sources without retyping</li>
                <li><strong>Keeping a history</strong> of emails, calls, texts, viewings and notes for each client</li>
                <li><strong>Prompting follow-up</strong> through reminders, tasks and, in some products, scheduled messages</li>
                <li><strong>Bringing in listing data</strong>, in Canada usually through CREA DDF®</li>
                <li><strong>Keeping consent records</strong> that you can rely on under Canadian privacy and anti-spam law</li>
              </ul>
              <p>
                No single product does all of them equally well, so check each one against how you work.
              </p>

              <h2 className="text-2xl font-bold mt-12 mb-6">What AI Means in a CRM</h2>
              <p>
                Vendors use the term for different features. These are the common ones, with a question to put to each vendor.
              </p>
              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="bg-muted/50 p-6 rounded-xl">
                  <h4 className="font-bold mb-2">Lead Scoring</h4>
                  <p className="text-sm text-muted-foreground mb-0">A number that ranks leads so you know who to call first. Ask whether it is rule-based or a statistical model, and whether you can see why a lead got its score.</p>
                </div>
                <div className="bg-muted/50 p-6 rounded-xl">
                  <h4 className="font-bold mb-2">Drafting</h4>
                  <p className="text-sm text-muted-foreground mb-0">Text written for you to review and send. Ask what the draft is based on and whether anything can go out without you.</p>
                </div>
                <div className="bg-muted/50 p-6 rounded-xl">
                  <h4 className="font-bold mb-2">Chatbots and Voice Agents</h4>
                  <p className="text-sm text-muted-foreground mb-0">Some CRMs offer a website chatbot that replies to visitors, or software that answers calls. Ask the vendor how consent is recorded and whether the reply says it is automated.</p>
                </div>
                <div className="bg-muted/50 p-6 rounded-xl">
                  <h4 className="font-bold mb-2">Automated Sequences</h4>
                  <p className="text-sm text-muted-foreground mb-0">Messages sent on a schedule or a trigger. Ask whether consent is checked before each send and how an unsubscribe is honoured.</p>
                </div>
              </div>
              <p>
                Some vendors also describe predictive features, such as flagging which past clients may move again. Ask what data the prediction uses and how it has been tested.
              </p>

              <h2 className="flex items-center gap-3 text-2xl font-bold mt-12 mb-6">
                <CheckCircle className="w-6 h-6 text-primary" />
                What Canadian Agents Should Check
              </h2>

              <h3 className="flex items-center gap-2 text-xl font-bold mt-8 mb-4">
                <Globe className="w-5 h-5 text-primary" />
                1. CREA DDF® and Listing Data
              </h3>
              <p>
                The Canadian Real Estate Association's Data Distribution Facility provides standardized access to listing data. If you want listings in your CRM without copying them by hand, ask whether the vendor's DDF® connection is live today, not planned. If it is not live, ask how listings get in.
              </p>

              <h3 className="flex items-center gap-2 text-xl font-bold mt-8 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                2. Privacy and Consent
              </h3>
              <p>
                The Personal Information Protection and Electronic Documents Act (PIPEDA) and Canada's anti-spam legislation (CASL) apply to you and to how you use a tool. Software does not make anyone compliant. Ask the vendor:
              </p>
              <ul>
                <li>Where is the database hosted, and which outside services process data elsewhere?</li>
                <li>Does it record the date and source of consent for each contact?</li>
                <li>Does it stop sending to a contact who has withdrawn consent?</li>
                <li>How do I export or delete one person's data on request?</li>
                <li>Who at the vendor can access my data?</li>
              </ul>
              <p>
                This is general information, not legal advice.
              </p>

              <h3 className="text-xl font-bold mt-8 mb-4">3. French and English</h3>
              <p>
                If you serve clients in Quebec or in bilingual communities, ask how the CRM handles French: the interface, the email your clients receive, and whether language can be set for each contact. Language obligations are yours to meet, so check them with someone qualified.
              </p>

              <h3 className="flex items-center gap-2 text-xl font-bold mt-8 mb-4">
                <Smartphone className="w-5 h-5 text-primary" />
                4. Use on Your Phone
              </h3>
              <p>
                Much of the job happens away from a desk. Some CRMs have native iOS and Android apps; others are responsive web apps that run in the phone's browser. Either can work. During a trial, open a contact, add a note and reply to a lead from your phone.
              </p>

              <h3 className="flex items-center gap-2 text-xl font-bold mt-8 mb-4">
                <BarChart3 className="w-5 h-5 text-primary" />
                5. Reporting
              </h3>
              <p>Write down the questions you want answered and check the CRM can answer them:</p>
              <ul>
                <li>Which lead sources produce closed deals?</li>
                <li>How long does it take from first contact to closing?</li>
                <li>Where are deals getting stuck in my pipeline?</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-6">Questions to Ask Before You Choose</h2>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl my-8">
                <p className="font-semibold mb-4">Ask each vendor:</p>
                <ul className="space-y-2 mb-0">
                  <li>✓ Which AI features are live today, and which are planned?</li>
                  <li>✓ Does anything reach a client without my review?</li>
                  <li>✓ Is it built for one agent or for a team, and which am I?</li>
                  <li>✓ What is the total cost over twelve months, and in which currency?</li>
                  <li>✓ What support is available, and during which hours?</li>
                  <li>✓ Can I try it with my own leads before I commit?</li>
                  <li>✓ How do I get my data out if I leave?</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold mt-12 mb-6">What We Cannot Tell You</h2>
              <p>
                We have no conversion, time-saved or revenue figures to offer for AI CRMs in general or for our own product. Vendor figures are hard to compare, because each is measured differently. Run a trial with your own leads and judge by what you see.
              </p>

              <h2 className="text-2xl font-bold mt-12 mb-6">Common Mistakes to Avoid</h2>
              <ul>
                <li><strong>Choosing on the feature list instead of your needs:</strong> The CRM with the most features is not necessarily the right one for your business.</li>
                <li><strong>Not checking connections:</strong> If your CRM does not connect to your email, website and lead sources, you will move data by hand.</li>
                <li><strong>Not testing on a phone:</strong> If it is awkward on your phone, you will not use it in the field.</li>
                <li><strong>Leaving privacy and consent to the software:</strong> The obligations stay with you, whatever the tool records.</li>
                <li><strong>Switching on automation you will not review:</strong> Know what is sent in your name before it is sent.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-6">Where Realtor Desk Fits</h2>
              <p>
                Realtor Desk is a CRM for Canadian real estate agents, built for a single agent. Of the AI features described above, it has lead scoring, a suggested next action and drafting.
              </p>
              <h3 className="text-xl font-bold mt-8 mb-4">What It Does</h3>
              <ul>
                <li>Contacts, one conversation timeline per client, a drag-and-drop deal pipeline with totals in CAD, and basic reports.</li>
                <li>A lead score from 0 to 100. It is rule-based, with a visible breakdown: engagement, behaviour, budget match, timeline and qualification. It is not machine learning.</li>
                <li>A suggested next action and a time to take it.</li>
                <li>An in-app assistant that drafts a reply or summarises the thread on the contact you have open. Nothing is sent to a client without you.</li>
                <li>French or English, set per contact. The interface and client email both work in French.</li>
                <li>A consent record: the date and source of consent on each contact. It refuses to send from the inbox or by SMS when no consent is on file.</li>
                <li>A production database hosted in Canada. Some outside services (SMS, email delivery, AI drafting) may process data outside Canada.</li>
              </ul>
              <h3 className="text-xl font-bold mt-8 mb-4">What It Does Not Do</h3>
              <ul>
                <li>No website chatbot, no voice agent and no WhatsApp. No automatic replies or automatic showing booking.</li>
                <li>No seats, lead routing, shared pipeline or team inbox.</li>
                <li>A sequence builder exists, but scheduled email sequences are not switched on.</li>
                <li>Native CREA DDF® sync is on the roadmap and is not live yet. A single listing can be imported from a Realtor.ca address or an MLS number.</li>
                <li>No native iOS or Android app. It is a responsive web app.</li>
              </ul>

              <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-8 rounded-xl mt-12">
                <h3 className="text-xl font-bold mb-4">See Realtor Desk for Yourself</h3>
                <p className="mb-6">
                  Realtor Desk is CAD $149 a month for a single agent, with a 14-day trial. A card is collected up front and nothing is charged before day 14. Book a demo and put the questions above to us.
                </p>
                <Link
                  to="/demo"
                  className="inline-flex items-center bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Book a Free Demo
                </Link>
              </div>
            </div>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AICRMGuide;
