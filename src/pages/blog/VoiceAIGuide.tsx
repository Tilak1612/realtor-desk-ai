// Rewritten 2026-10-11 to follow the Realtor Desk fact sheet of that date.
//
// Removed: every unsourced figure (answer, response, conversion, no-show and
// "sounds human" rates, calls per day, latency, cost per call, ISA salary and
// savings, the "$149-299 with unlimited calls" price), the "18,000 calls" study
// table, the ROI calculator, the three "success stories", the "day in the
// life" opening, the setup-time checklist, the named standalone vendors, and
// every passage that presented voice AI as a Realtor Desk feature ("Includes
// Voice AI with CRM", "PIPEDA/CASL compliant", a sample call placed "from
// RealtorDesk"). Also removed the specific legal statements (one-party
// consent, an 18-month window, "voice calls are exempt from CASL", 90-day
// deletion); the Canadian section now states the questions in general terms
// and points to the CRTC and the Office of the Privacy Commissioner.
//
// Realtor Desk does not offer voice AI and it is not on the 2026 roadmap.
//
// Body copy is kept as plain JSX prose on purpose: the prerenderer skips any
// element that contains an expression or a map().

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, XCircle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { ProductScopeNote } from "@/components/marketing/ProductScopeNote";

const VoiceAIGuide = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SEO
        title="Voice AI for Real Estate Follow-Up"
        description="What a voice AI agent does on a real estate call, what it cannot do, the consent and recording questions it raises in Canada, and what to ask a vendor."
        keywords="voice AI for real estate, AI lead follow-up, real estate voice assistant, voice AI consent Canada"
        article
        publishedTime="2026-01-01"
        modifiedTime="2026-10-11"
        author="Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/resources/voice-ai-real-estate-lead-follow-up-canada"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Voice AI for Real Estate Follow-Up",
            "description": "What a voice AI agent does on a real estate call, what it cannot do, the consent and recording questions it raises in Canada, and what to ask a vendor.",
            "author": { "@type": "Organization", "name": "Realtor Desk" },
            "publisher": { "@type": "Organization", "name": "Realtor Desk" },
            "datePublished": "2026-01-01",
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
              Voice AI for Real Estate Follow-Up
            </h1>
            <ProductScopeNote className="mb-6" />
            <p className="text-xl text-gray-600 mb-8">
              A general guide to voice AI for lead follow-up: what a voice agent does on a call, what it cannot do, the consent, disclosure and recording questions it raises in Canada, and what to ask a vendor before you buy.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-500">
              <span>Updated: October 2026</span>
              <span>General guide</span>
            </div>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              Voice AI vendors pitch real estate agents on software that phones a lead, holds a conversation and reports back. This guide makes no performance claims: we have no data of our own on voice AI, and we have not verified anyone else's.
            </p>
          </div>

          {/* What a voice agent is */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">What a voice agent is</h2>
            <p className="text-gray-700 mb-4">
              A voice agent is software that holds a spoken conversation over the phone. It turns the caller's speech into text, passes that text to a language model that decides what to say, and turns the reply back into speech.
            </p>
            <p className="text-gray-700">
              A robocall plays a recording or a keypad menu. A voice agent responds to what the person says, within the limits of the script and the information you gave it.
            </p>
          </section>

          {/* Can and cannot */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">What it does, and what it cannot do</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-700" />
                  <h3 className="text-xl font-bold">What a voice agent does</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
                  <li>Calls or answers a lead and asks the questions you scripted, such as area and timeline.</li>
                  <li>Answers simple questions from information you supplied, such as an open house time.</li>
                  <li>Hands the call to you, or takes a message, when it reaches something it should not answer.</li>
                  <li>Saves a recording, a transcript or a summary for you to review.</li>
                </ul>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="w-6 h-6 text-red-700" />
                  <h3 className="text-xl font-bold">What it cannot do</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
                  <li>Know anything you did not give it. A language model can state a wrong detail with confidence, so limit what it may answer.</li>
                  <li>Advise on price, financing, contracts or representation. Those conversations are yours.</li>
                  <li>Take responsibility for consent, disclosure or record keeping. That stays with you.</li>
                  <li>Replace the relationship. A lead who wanted a person may not welcome a machine.</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Sample call */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">What a call can sound like</h2>
            <Card className="p-6 bg-blue-50 border-blue-200">
              <p className="text-sm text-gray-700 mb-4">
                <strong>Illustration only.</strong> This is an invented exchange that shows the kind of call such a tool is built for. It is not a transcript, not a Realtor Desk feature, and not a claim about how leads respond.
              </p>
              <div className="space-y-2 text-sm text-gray-700 bg-white p-4 rounded-lg border border-blue-200">
                <p><strong>Assistant:</strong> Hello, this is an automated assistant calling for [agent name] at [brokerage]. This call is being recorded. You asked about [listing address] yesterday. Is now a good time?</p>
                <p><strong>Lead:</strong> Sure. Is it still available?</p>
                <p><strong>Assistant:</strong> I will have [agent name] confirm that with you. May I ask which area and timeline you have in mind?</p>
                <p><strong>Lead:</strong> The west end, some time this spring.</p>
                <p><strong>Assistant:</strong> Thank you. [Agent name] will call you back to arrange a time.</p>
              </div>
              <p className="text-sm text-gray-700 mt-4">
                The opening says the caller is automated, who it is calling for, and that the call is recorded. The availability question goes to the agent instead of being guessed.
              </p>
            </Card>
          </section>

          {/* Canada: consent, disclosure, recording */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-7 h-7 text-primary" />
              <h2 className="text-3xl font-bold">Consent, disclosure and recording in Canada</h2>
            </div>

            <Card className="p-6 mb-6 bg-gray-50">
              <p className="text-sm text-gray-700">
                This section is general information, not legal advice. Read the regulators' own guidance and speak to a lawyer or your brokerage before you turn on automated calling or texting.
              </p>
            </Card>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Consent</h3>
                <p className="text-gray-700">
                  Treat an automated call or text that promotes your services as a commercial message that needs the recipient's consent. Canada's anti-spam law (CASL) covers commercial electronic messages such as texts and email. Keep a record of when and how each person agreed. Our <Link to="/resources/casl-compliance-real-estate-email-marketing-canada" className="text-primary underline">CASL guide for real estate email</Link> covers the email side.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">Telemarketing rules and the National Do Not Call List</h3>
                <p className="text-gray-700">
                  Outbound calls that promote a service may fall under the CRTC's telemarketing rules, which include the National Do Not Call List and rules for automated calling. Do not assume that one web inquiry covers every later call.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">Disclosure</h3>
                <p className="text-gray-700">
                  Have the assistant say at the start of every call that it is automated and on whose behalf it is calling, and give the person a way to reach you.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">Recording and transcripts</h3>
                <p className="text-gray-700">
                  Recording a call and storing a transcript is collecting personal information under Canada's private-sector privacy law (PIPEDA), so tell the caller at the start that the call is recorded and why. Provincial privacy laws may also apply.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">Where recordings are stored</h3>
                <p className="text-gray-700">
                  Ask the vendor where recordings and transcripts are stored, which other companies process them, how long they are kept and how you delete one.
                </p>
              </div>
            </div>

            <p className="text-gray-700 mt-6">
              For the rules themselves, go to the CRTC at <a href="https://crtc.gc.ca" target="_blank" rel="noopener noreferrer" className="text-primary underline">crtc.gc.ca</a> for CASL, telemarketing and the National Do Not Call List, and to the Office of the Privacy Commissioner of Canada at <a href="https://www.priv.gc.ca" target="_blank" rel="noopener noreferrer" className="text-primary underline">priv.gc.ca</a> for PIPEDA.
            </p>
          </section>

          {/* Questions for a vendor */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">What to ask a vendor</h2>
            <Card className="p-6">
              <ul className="space-y-3 text-gray-700 list-disc pl-5">
                <li>Does the assistant say it is automated, and on whose behalf it is calling, at the start of every call?</li>
                <li>How does it check consent before it dials or texts, and how does it handle the National Do Not Call List?</li>
                <li>Where are recordings and transcripts stored, and can they be kept in Canada?</li>
                <li>What happens when the caller asks something outside the script, or asks for a person?</li>
                <li>What does it write to my CRM, and can I review a call before anything else goes to the lead?</li>
                <li>What is the full monthly cost at my call volume, including any usage charges?</li>
                <li>Can I test it on my own number before any lead hears it?</li>
              </ul>
            </Card>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">FAQ: Voice AI for Real Estate</h2>

            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="font-bold mb-2">Is voice AI legal in Canada?</h3>
                <p className="text-gray-700">
                  It depends on who you call, what consent you hold and how the call is made. Consent, telemarketing and privacy rules can all apply. This is general information, not legal advice; ask a lawyer about your own situation.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">How much does voice AI cost?</h3>
                <p className="text-gray-700">
                  Pricing varies by vendor and can include usage charges on top of a subscription. We do not quote other vendors' prices here. Check each vendor's own pricing page.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Does voice AI work in Quebec (French)?</h3>
                <p className="text-gray-700">
                  Ask the vendor for a French sample call and judge it yourself. To be clear about our own product: Realtor Desk does not ship an inbound voice agent today and it is not on the 2026 roadmap. In Realtor Desk, French or English is set per contact, and the assistant drafts a reply for you to review and send.
                </p>
              </Card>
            </div>
          </section>

          {/* Where Realtor Desk fits */}
          <section className="py-12">
            <Card className="p-8 bg-gradient-to-r from-primary to-blue-600 text-white">
              <h2 className="text-3xl font-bold mb-4 text-center">Where Realtor Desk fits</h2>
              <p className="text-xl mb-6">
                Realtor Desk does not offer voice AI, and it is not on the 2026 roadmap. It is a CRM that scores leads and suggests a next action.
              </p>
              <p className="mb-6">
                It is built for a single Canadian real estate agent. The lead score runs from 0 to 100, is rule-based and shows its breakdown. Nothing is sent to a client without you.
              </p>
              <ul className="space-y-2 mb-6 text-lg">
                <li>✓ Suggests who to contact next</li>
                <li>✓ Drafts replies in English or French</li>
                <li>✓ Records consent date and source</li>
                <li>✓ You send every message</li>
              </ul>
              <p className="mb-8">
                The production database is hosted in Canada; some outside services (SMS, email delivery, AI drafting) may process data outside Canada. Realtor Desk is CAD $149 a month for a single agent, with a 14-day trial. A card is collected up front and nothing is charged before day 14.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                  <Link to="/signup">
                    Start 14-day trial <ArrowRight className="ml-2" />
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
              <Link to="/blog/ai-chatbot-real-estate-websites-canada">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">AI Chatbot Guide</h3>
                  <p className="text-sm text-gray-600">A general guide to website chatbots</p>
                </Card>
              </Link>
              <Link to="/blog/ai-vs-traditional-crm">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">AI CRM vs Traditional CRM</h3>
                  <p className="text-sm text-gray-600">How the two approaches differ</p>
                </Card>
              </Link>
              <Link to="/features">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">Realtor Desk features</h3>
                  <p className="text-sm text-gray-600">See what the product does today</p>
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

export default VoiceAIGuide;
