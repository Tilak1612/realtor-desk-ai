// Rewritten 2026-10-11 to follow the Realtor Desk fact sheet of that date.
//
// Removed: every unsourced figure (share of leads arriving after hours,
// response times in seconds, conversion multiples attributed to an unnamed
// study, a "10,000 conversations" results table, revenue per 100 visitors,
// staffing and vendor cost ranges, setup times, error rates); three scripted
// "success stories"; the "objections and the truth" section; the step-by-step
// implementation guide with time estimates; statements that a chatbot
// "complies" with CASL, PIPEDA or Quebec language law; and the closing
// checklists that read as promises about a product Realtor Desk does not sell.
//
// Kept: the scope note, the "work out your own number" section and the FAQ
// answers already corrected on 2026-10-02. The sample conversation is now
// labelled as an illustration with no outcome claimed. The visible FAQ is
// rendered from the one FAQS array. Realtor Desk has no website chatbot, and
// the closing section says so.
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { ProductScopeNote } from "@/components/marketing/ProductScopeNote";

// The visible FAQ is rendered from this array. There is no FAQPage JSON-LD on
// this page; if one is added, build it from this array too so the two cannot
// drift apart.
const FAQS = [
  {
    q: "Do I need technical skills to set up an AI chatbot?",
    a: "Not usually, but setup effort varies by vendor. Ask for a realistic estimate in writing and a reference from an agent who has done it.",
  },
  {
    q: "Will leads know they are talking to AI?",
    a: "That depends on how the tool is set up. Ask the vendor whether the chat identifies itself as automated, and decide what you want visitors to be told before you switch it on.",
  },
  {
    q: "Is AI compliant with Canadian privacy laws?",
    a: "Depends on the platform. Ask where the vendor stores and processes data, and whether it records consent. Realtor Desk does not offer a website chatbot.",
  },
  {
    q: "How much does an AI chatbot cost?",
    a: "It varies by vendor and by what is bundled, so ask for a written quote that covers setup, usage limits and any contract term. Realtor Desk does not sell a chatbot.",
  },
  {
    q: "Will AI replace me as an agent?",
    a: "No. A chatbot can answer a first question and collect contact details. Showings, advice, negotiation and closing remain your work.",
  },
  {
    q: "How long until I see results?",
    a: "There is no reliable general answer. Record your own inquiries, appointments and deals for a set period before and after, and judge the tool on that.",
  },
];

const AIChatbotGuide = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SEO
        title="AI Chatbot for Canadian Real Estate Sites"
        description="What a website chatbot does on a real estate site, the consent and privacy questions it raises in Canada, and what to ask a vendor before you buy."
        keywords="AI chatbot real estate Canada, real estate website chatbot, AI lead capture, realtor chatbot"
        article
        publishedTime="2025-01-01"
        modifiedTime="2026-10-11"
        author="Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/blog/ai-chatbot-real-estate-websites-canada"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "AI Chatbot for Canadian Real Estate Sites",
            "description": "What a website chatbot does on a real estate site, the consent and privacy questions it raises in Canada, and what to ask a vendor before you buy.",
            "author": { "@type": "Organization", "name": "Realtor Desk" },
            "publisher": { "@type": "Organization", "name": "Realtor Desk" },
            "datePublished": "2025-01-01",
            "dateModified": "2026-10-11"
          }
        ]}
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              AI Chatbot for Canadian Real Estate Sites
            </h1>
            <ProductScopeNote className="mb-6" />
            <p className="text-xl text-gray-600 mb-8">
              What a website chatbot does on a real estate site, the consent and privacy questions it raises in Canada, and what to ask a vendor before you buy.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-500">
              <span>Updated: October 2026</span>
              <span>4 min read</span>
              <span>Buyer guide</span>
            </div>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              A website chatbot is a chat window on your site that answers a visitor and collects their contact details when you are not there to do it. Several vendors sell one to real estate agents, on its own or bundled with a CRM.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We have no measured results to offer for any chatbot, so this guide quotes no figures. It covers what these tools do, where they fall short, and what to check before you pay for one.
            </p>
          </div>

          {/* What Is an AI Chatbot */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">What a website chatbot does</h2>
            <p className="text-gray-700 mb-4">
              There are two broad kinds. A scripted chatbot follows a decision tree: the visitor picks from buttons and the tool replies with text you prepared. It is predictable, and it stops being useful when the question is not on the list.
            </p>
            <p className="text-gray-700 mb-6">
              A chatbot built on a large language model accepts free text and can handle a follow-up question. It is more flexible and less predictable, because it can state something wrong with confidence.
            </p>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <p className="font-semibold text-blue-900 mb-3">
                Illustration only. This is an invented exchange that shows the kind of conversation these tools are built for. It is not a transcript, and it does not show a result.
              </p>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Visitor:</strong> Is the listing on Main Street still available?</p>
                <p><strong>Chatbot:</strong> It is still shown as listed. Would you like the agent to confirm that with you?</p>
                <p><strong>Visitor:</strong> Yes. What are the condo fees?</p>
                <p><strong>Chatbot:</strong> I do not have that detail, so I will pass the question to the agent. What is the best email address to reach you, and may the agent contact you there?</p>
                <p><strong>Visitor:</strong> Sure, here is my email.</p>
                <p><strong>Chatbot:</strong> Thank you. The agent will reply to you directly.</p>
              </div>
            </Card>
          </section>

          {/* What it can and cannot do */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">What a chatbot can and cannot do</h2>
            <p className="text-gray-700 mb-4">
              A chatbot can acknowledge an inquiry when you are with a client or asleep, answer simple questions from the information you give it, and collect contact details for you to follow up.
            </p>
            <p className="text-gray-700 mb-4">
              It cannot show a home, advise on price or take responsibility for an answer. Check what it is allowed to say about a listing, where that information comes from, and whether it hands the conversation to you when it does not know.
            </p>
            <p className="text-gray-700 mb-4">
              If you work with French-speaking clients, test the tool in French yourself. A feature list will not tell you how it reads.
            </p>
          </section>

          {/* ROI Calculator */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Is an AI chatbot worth it? Work out your own number</h2>

            {/* A worked model stood here: 100 chat engagements, 64 "qualified by
                AI", 12 appointments, "$24,840/month" revenue, and "ROI: 7,584% to
                15,218%", priced at Realtor Desk's plan. Every step rate in it was
                invented, and Realtor Desk does not sell a chatbot, so it modelled
                a product that does not exist. Removed 2026-10-02. */}
            <p className="text-gray-700 mb-4">
              Any vendor&rsquo;s ROI figure rests on conversion rates that depend on
              your market, your lead sources and how you follow up, so a headline
              percentage tells you little. A fair test takes four numbers from your own
              business:
            </p>
            <ol className="space-y-2 text-gray-700 list-decimal pl-6 mb-4">
              <li>How many inquiries you get a month, and how many arrive outside your working hours.</li>
              <li>What share of those you answer within the hour today.</li>
              <li>Your own rate from inquiry to appointment to closed deal, from your records.</li>
              <li>The vendor&rsquo;s written quote, including setup, usage limits and contract term.</li>
            </ol>
            <p className="text-gray-700">
              Run those through our{" "}
              <Link className="underline" to="/resources/slow-follow-up-calculator-canadian-realtors">
                slow follow-up calculator
              </Link>{" "}
              and treat the answer as a range, not a promise.
            </p>
          </section>

          {/* Consent and privacy in Canada */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Consent and privacy in Canada</h2>
            <p className="text-gray-700 mb-4">
              This is general information, not legal advice. Check your own obligations with your brokerage, your regulator or a lawyer. No software makes you compliant by being installed.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>PIPEDA.</strong> A chatbot that collects a name, an email address or a phone number is collecting personal information. PIPEDA is the federal privacy law for private-sector organizations, and some provinces have their own. A visitor should be able to see what is being collected and why.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>CASL.</strong> Answering a question a visitor asked in the chat is one thing. Sending marketing email or text messages afterwards is another: CASL requires consent for commercial electronic messages, and you should be able to show when and how you got it.
            </p>
            <p className="text-gray-700 mb-2">Ask the vendor:</p>
            <ul className="space-y-2 text-gray-700 list-disc pl-6">
              <li>Where conversation data is stored and processed, including by any outside AI provider.</li>
              <li>How consent is recorded: the date, the wording the visitor saw and the source.</li>
              <li>Whether you can export consent records and transcripts, and delete a visitor on request.</li>
              <li>Whether the chat tells visitors they are talking to an automated tool.</li>
            </ul>
          </section>

          {/* Vendor questions */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">What to ask a vendor before you buy</h2>
            <ul className="space-y-2 text-gray-700 list-disc pl-6">
              <li>Where does the listing information come from, and how often is it updated?</li>
              <li>What does the tool say when it does not know the answer?</li>
              <li>How and when does a conversation hand off to me, and how am I notified?</li>
              <li>How do leads reach my CRM, and what gets passed along with them?</li>
              <li>What happens to my transcripts and contacts if I cancel?</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Check the vendor&rsquo;s own pricing page and get the quote in writing. We do not list or rank chatbot vendors here because we have not tested them.
            </p>
          </section>

          {/* FAQ: rendered from the FAQS array at the top of this file */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">FAQ: AI Chatbots for Real Estate</h2>

            <div className="space-y-4">
              {FAQS.map((f) => (
                <Card key={f.q} className="p-6">
                  <h3 className="font-bold mb-2">{f.q}</h3>
                  <p className="text-gray-700">{f.a}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Where Realtor Desk fits */}
          <section className="py-12">
            <Card className="p-8 bg-gradient-to-r from-primary to-blue-600 text-white">
              <h2 className="text-3xl font-bold mb-4 text-center">Where Realtor Desk fits</h2>
              <p className="text-xl mb-6 text-center">
                Realtor Desk does not offer a website chatbot. It is a CRM that scores leads and suggests a next action.
              </p>
              <ul className="space-y-2 mb-6 text-lg list-disc pl-6">
                <li>It is a CRM for a single Canadian real estate agent, at CAD $149 a month.</li>
                <li>Zapier, Make and n8n can push leads into it. If you use a chat tool from another vendor, ask that vendor whether it connects to one of them.</li>
                <li>Each lead gets a rule-based score from 0 to 100 with the breakdown shown, and an in-app assistant drafts a reply for you to review. Nothing is sent to a client without you.</li>
                <li>It records the date and source of consent on each contact. The production database is hosted in Canada; some outside services (SMS, email delivery, AI drafting) may process data outside Canada.</li>
              </ul>
              <p className="mb-8 text-center">
                The trial runs 14 days. A card is collected up front and nothing is charged before day 14.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                  <Link to="/signup">
                    Start the 14-day trial <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-white text-primary hover:bg-gray-100">
                  <Link to="/demo">Book a demo</Link>
                </Button>
              </div>
            </Card>
          </section>

          {/* Related Articles */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Related Resources</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/blog/ai-vs-traditional-crm">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">AI CRM vs Traditional CRM</h3>
                  <p className="text-sm text-gray-600">How the two differ, and what to ask a vendor</p>
                </Card>
              </Link>
              <Link to="/blog/best-crm-canada-2025">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">Best CRM for Canadian Real Estate Agents</h3>
                  <p className="text-sm text-gray-600">How to choose a real estate CRM in Canada</p>
                </Card>
              </Link>
              <Link to="/features">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">Realtor Desk features</h3>
                  <p className="text-sm text-gray-600">See what Realtor Desk does today</p>
                </Card>
              </Link>
            </div>
          </section>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIChatbotGuide;
