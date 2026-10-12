// Rewritten 2026-10-11 to follow the Realtor Desk fact sheet of that date.
//
// Removed: the claim that AI lifts conversion "from the industry average of 5%
// to 18%", "24/7 AI chatbots and voice agents" and document processing "in
// seconds" stated as settled fact, the "Canadian Advantage" paragraph implying
// DDF-backed AI and bilingual AI were available here, "modern platforms ensure
// compliance", the forecast that the AI future "is now", and the call to action
// about a "growing Canadian beta community" that would "close more deals and
// save 15+ hours per week". None of it had a source.
//
// What is left describes where vendors are applying AI in general, hedged and
// without figures, with a question to ask for each, then says what Realtor Desk
// does and does not do.
//
// The prose is static JSX on purpose: the prerenderer skips elements that
// contain an expression.
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
// SVG on the page; the .jpg twin for og:image, because social platforms
// do not render SVG and would show a card with no image at all.
import blogImage from "@/assets/brand/blog-ai-transformation.svg";
import blogImageSocial from "@/assets/brand/blog-ai-transformation.jpg";
import { Picture } from "@/components/Picture";
import { SEO } from "@/components/SEO";
import { ProductScopeNote } from "@/components/marketing/ProductScopeNote";

const AITransformation = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="How AI Is Transforming Canadian Real Estate"
        description="Where AI is showing up in Canadian real estate software: lead scoring, drafting, chatbots, pricing tools and marketing, with a question to ask each vendor."
        keywords="ai real estate canada, real estate ai tools, canadian realtors ai, lead scoring real estate, ai crm"
        image={blogImageSocial}
        article
        publishedTime="2025-01-15"
        modifiedTime="2026-10-11"
        author="Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/blog/ai-transformation"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "How AI Is Transforming Canadian Real Estate",
            "description": "Where AI is showing up in Canadian real estate software: lead scoring, drafting, chatbots, pricing tools and marketing, with a question to ask each vendor.",
            "author": { "@type": "Organization", "name": "Realtor Desk" },
            "publisher": { "@type": "Organization", "name": "Realtor Desk" },
            "datePublished": "2025-01-15",
            "dateModified": "2026-10-11"
          }
        ]}
      />
      <Navbar />

      <article className="pt-32 md:pt-40 pb-20">
        <div className="container-custom max-w-4xl">
          {/* Back Button */}
          <Link to="/resources">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Resources
            </Button>
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground flex-wrap">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-semibold">
                AI & Technology
              </span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>January 15, 2025</span>
              </div>
              <span>Updated October 11, 2026</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>4 min read</span>
              </div>
            </div>

            <h1 className="mb-6">
              How AI Is Transforming Canadian Real Estate
            </h1>
            <ProductScopeNote className="mb-6" />

            <p className="text-xl text-muted-foreground leading-relaxed">
              Where AI is showing up in the software Canadian agents use, what each kind of tool is sold as doing, and a question to ask before you rely on it.
            </p>
          </header>

          {/* Featured Image */}
          <Picture
            src={blogImage}
            width={1024}
            height={576}
            alt="AI technology transforming real estate"
            className="w-full rounded-lg mb-8 shadow-lg"
            priority
          />

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <h2>AI in Canadian Real Estate Software</h2>
            <p>
              Software vendors are adding AI features to the tools agents already use: CRMs, websites, marketing tools and pricing tools. Some of these features are useful and some are mostly a label. This article describes the main categories in general terms. It contains no performance figures, because we have none we can source.
            </p>

            <h2>1. Lead Scoring</h2>
            <p>
              Many CRMs rank leads with a score, based on things like email engagement, browsing behaviour, budget and timeline. Some scores follow fixed rules. Others come from a statistical model and are marketed as predictive. Ask which it is, and whether you can see why a lead received its score.
            </p>

            <h2>2. Automated Client Communication</h2>
            <p>
              Some products offer a website chatbot or a voice agent that answers enquiries, asks questions and proposes showing times. Others stop at drafting a message for you to send. Ask how consent is recorded before anything is sent, whether an automated reply says that it is automated, and how a conversation is handed to you.
            </p>

            <h2>3. Deal and Transaction Tracking</h2>
            <p>
              CRMs and back-office tools track deal stages and remind you of deadlines. Some vendors add document handling, such as pulling dates out of a contract. Ask who checks the result, because a missed or misread date is still your problem.
            </p>

            <h2>4. Market Analytics and Pricing</h2>
            <p>
              Some tools suggest a list price from comparable sales and neighbourhood data. Treat a suggestion as a starting point. A valuation is your professional judgment, and the tool does not carry your obligations to the seller.
            </p>

            <h2>5. Marketing</h2>
            <p>
              AI is used to write listing descriptions, email and social posts, and to pick which audience sees an ad. Review what it writes before it is published, and check that any email it sends goes only to people who have consented.
            </p>

            <h2>Canadian Specifics</h2>
            <p>
              Listing data in Canada usually reaches software through CREA DDF®, which is licensed. If a vendor says its AI works with listing data, ask whether its DDF® connection is live today. If you serve French-speaking clients, ask whether the tool writes and sends in French, and whether language can be set for each contact.
            </p>

            <h2>Privacy and Consent</h2>
            <p>
              PIPEDA and CASL apply to you and to how you use a tool. Software does not make anyone compliant. Ask where the data is stored, which outside services process it, and how consent is recorded. This is general information, not legal advice.
            </p>

            <h2>What's Next?</h2>
            <p>
              Vendors are promoting AI-assisted virtual tours, market forecasting and negotiation assistants. We cannot say which of these will prove useful. The same questions apply to each: what data does it use, who reviews the output, and what is sent in your name.
            </p>

            <h2>Where Realtor Desk Fits</h2>
            <p>
              Realtor Desk is a CRM for Canadian real estate agents, built for a single agent. Of the categories above, it covers lead scoring and drafting.
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
            </ul>
            <h3>What It Does Not Do</h3>
            <ul>
              <li>No website chatbot, no voice agent and no WhatsApp. No automatic replies or automatic showing booking.</li>
              <li>No transaction management, e-signature or document storage.</li>
              <li>No market data, pricing tool, lead generation or ads.</li>
              <li>A sequence builder exists, but scheduled email sequences are not switched on.</li>
              <li>Native CREA DDF® sync is on the roadmap and is not live yet.</li>
              <li>No seats, lead routing, shared pipeline or team inbox.</li>
            </ul>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-lg my-8">
              <h3 className="text-2xl font-bold mb-4">See Realtor Desk for Yourself</h3>
              <p className="mb-6">
                Realtor Desk is CAD $149 a month for a single agent, with a 14-day trial. A card is collected up front and nothing is charged before day 14.
              </p>
              <Link to="/demo">
                <Button size="lg" className="btn-gradient">
                  Book Your Free Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Share this article:
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default AITransformation;
