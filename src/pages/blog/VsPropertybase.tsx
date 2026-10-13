import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, XCircle, DollarSign, Brain, Building2, Users, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';

// 2026-10-11: rewritten against the 2026-10-11 fact sheet.
//
// Removed, about Propertybase: every price ($600-1,200+ USD a user, $10,000-
// 50,000 implementation, $150-250/hour consulting, "$214,000 over 3 years"),
// every timeline ("3-6 months", "6-12 month learning curve"), "No built-in AI",
// "contracts are typically 36 months" and the Salesforce characterisations.
// None had a source on the page. The Propertybase column now says "Ask the
// vendor" and the Propertybase section is a list of questions to put to them.
//
// Removed, about Realtor Desk: "Advanced AI (chat + voice + predictive)",
// "Sub-3-second AI chatbot (GPT-powered)", "Voice AI for phone automation",
// "Predictive lead scoring", "Built-in PIPEDA/CASL", "PIPEDA compliance by
// default", "AWS Canada data residency", "30+ pre-built integrations", "1-3
// day implementation", the "1-50 agents" positioning (it is a single-agent
// product), the five-user cost model, "3-Year Savings: $203,236", the invented
// ten-agent scenario with its conversion rates, "95% of Canadian real estate
// businesses" and every "Winner" verdict.
//
// Left as they were: the two plan-price lines in the pricing card.

const VsPropertybase = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SEO
        title="Propertybase vs Realtor Desk"
        description="Propertybase vs Realtor Desk for Canadian agents: what Realtor Desk does and does not do, and the questions to put to Propertybase before you choose."
        keywords="Propertybase vs Realtor Desk, Canadian real estate CRM comparison, Propertybase alternative Canada"
        article
        publishedTime="2025-01-01"
        modifiedTime="2026-10-11"
        author="Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/blog/vs-propertybase"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Propertybase vs Realtor Desk",
            "description": "Propertybase vs Realtor Desk for Canadian agents: what Realtor Desk does and does not do, and the questions to put to Propertybase before you choose.",
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
              Propertybase vs Realtor Desk
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Realtor Desk is a CRM for a single Canadian agent. This page sets out what it does, what it does not, and what to ask Propertybase.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-500">
              <span>Updated: October 2026</span>
              <span>Comparison Guide</span>
            </div>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              We build one of the products compared here, so weigh this accordingly.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              This page does not state Propertybase&rsquo;s prices, features or contract terms, because we have no dated reading of its own pages to cite. Where the table says &ldquo;Ask the vendor&rdquo;, that is the reason. An earlier version of this page quoted figures for Propertybase that had no source; they have been removed.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              What we can describe accurately is our own product. Realtor Desk is built for one agent. It has no seats, no lead assignment or routing, no shared pipeline and no team inbox, so a brokerage or a team should look elsewhere.
            </p>
          </div>

          {/* Quick Comparison */}
          <Card className="p-6 mb-12">
            <h2 className="text-2xl font-bold mb-6">Quick Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 font-semibold">Feature</th>
                    <th className="pb-3 font-semibold">Propertybase</th>
                    <th className="pb-3 font-semibold">Realtor Desk</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="py-3">Monthly Cost</td>
                    <td className="py-3">Ask the vendor</td>
                    <td className="py-3">$149-299 CAD</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Built for</td>
                    <td className="py-3">Ask the vendor</td>
                    <td className="py-3">A single agent</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Seats, lead routing, shared pipeline</td>
                    <td className="py-3">Ask the vendor</td>
                    <td className="py-3">Not available</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">AI</td>
                    <td className="py-3">Ask the vendor</td>
                    <td className="py-3">An in-app assistant drafts a reply or summarises a thread; you send every message</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Lead score</td>
                    <td className="py-3">Ask the vendor</td>
                    <td className="py-3">Rule-based, 0 to 100, with a visible breakdown</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Voice agent or lead-facing chatbot</td>
                    <td className="py-3">Ask the vendor</td>
                    <td className="py-3">Not available</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">French</td>
                    <td className="py-3">Ask the vendor</td>
                    <td className="py-3">French or English set per contact</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Consent records</td>
                    <td className="py-3">Ask the vendor</td>
                    <td className="py-3">Date and source of consent on each contact</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Data hosting</td>
                    <td className="py-3">Ask the vendor</td>
                    <td className="py-3">Production database hosted in Canada</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Transaction management, e-signature, back office</td>
                    <td className="py-3">Ask the vendor</td>
                    <td className="py-3">Not available</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">IDX website, lead generation</td>
                    <td className="py-3">Ask the vendor</td>
                    <td className="py-3">Not available</td>
                  </tr>
                  <tr>
                    <td className="py-3">Native mobile app</td>
                    <td className="py-3">Ask the vendor</td>
                    <td className="py-3">Not available (responsive web app)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* What is Propertybase */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">What to ask Propertybase</h2>

            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-8 h-8 text-blue-600" />
                <h3 className="text-xl font-bold">Get the answers in writing</h3>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">
                  We do not describe Propertybase here, because we have nothing sourced to say. Its own site and its sales team are the right place for that. These are the questions worth putting to them before you compare.
                </p>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6 bg-blue-50 border-blue-200">
                <h3 className="font-bold mb-3 text-blue-900">About the product:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>Who is it built for: one agent, a team or a brokerage?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>Do the interface and client email work in French?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>Is a consent date and source stored on each contact?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>Where is the customer database hosted?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>What does it support for Canadian listing data?</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 bg-gray-100">
                <h3 className="font-bold mb-3">About the cost:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <DollarSign className="w-4 h-4 text-gray-600 mt-0.5" />
                    <span>What is the price per user, and in which currency?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <DollarSign className="w-4 h-4 text-gray-600 mt-0.5" />
                    <span>Is there an implementation or setup fee?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <DollarSign className="w-4 h-4 text-gray-600 mt-0.5" />
                    <span>How long does setup take, and who does it?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <DollarSign className="w-4 h-4 text-gray-600 mt-0.5" />
                    <span>What is the contract length, and what does leaving early cost?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <DollarSign className="w-4 h-4 text-gray-600 mt-0.5" />
                    <span>In what format can you export your contacts?</span>
                  </li>
                </ul>
              </Card>
            </div>
          </section>

          {/* What is Realtor Desk */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">What is Realtor Desk?</h2>

            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-8 h-8 text-primary" />
                <h3 className="text-xl font-bold">A CRM for one Canadian agent</h3>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">
                  <strong>What it holds:</strong> Contacts, one conversation timeline per client, a drag-and-drop deal pipeline with totals in CAD, and basic reports.
                </p>
                <p className="text-gray-700">
                  <strong>Who it is for:</strong> A single agent. There are no seats, no lead assignment or routing, no shared pipeline and no team inbox.
                </p>
                <p className="text-gray-700">
                  <strong>The AI:</strong> A rule-based lead score from 0 to 100 with a visible breakdown, a suggested next action, and an in-app assistant that drafts a reply or summarises the thread on the contact you have open. Nothing is sent to a client without you.
                </p>
                <p className="text-gray-700">
                  <strong>Form:</strong> A responsive web app. There is no native mobile app.
                </p>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6 bg-green-50 border-green-200">
                <h3 className="font-bold mb-3 text-green-900">Realtor Desk at a glance:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-700 mt-0.5" />
                    <span>Affordable ($149-299 CAD/month)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-700 mt-0.5" />
                    <span>French or English set per contact; the interface and client email both work in French</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-700 mt-0.5" />
                    <span>Records the date and source of consent on each contact, and refuses to send from the inbox or by SMS when none is on file</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-700 mt-0.5" />
                    <span>Production database hosted in Canada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-700 mt-0.5" />
                    <span>Zapier, Make and n8n can push leads in; SMS goes through Twilio and email through your own SMTP server</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-700 mt-0.5" />
                    <span>Contacts import from a CSV file</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 bg-yellow-50 border-yellow-200">
                <h3 className="font-bold mb-3 text-yellow-900">What Realtor Desk does not do:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-yellow-700 mt-0.5" />
                    <span>No seats, lead routing, shared pipeline or team reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-yellow-700 mt-0.5" />
                    <span>No transaction management, e-signature, document storage or back office</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-yellow-700 mt-0.5" />
                    <span>No lead-facing chatbot, automatic replies or voice agent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-yellow-700 mt-0.5" />
                    <span>No automated email sequences switched on</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-yellow-700 mt-0.5" />
                    <span>No IDX website, lead generation or market data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-yellow-700 mt-0.5" />
                    <span>Native CREA DDF® sync is on the roadmap and is not live yet</span>
                  </li>
                </ul>
              </Card>
            </div>

            <Card className="p-6 bg-primary/5 border-primary">
              <h3 className="font-bold mb-3">Pricing (CAD):</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Agent Plan: $149/month</li>
                <li>• Team Plan: $299/month</li>
                <li>• 14-day trial; a card is collected up front and nothing is charged before day 14</li>
              </ul>
            </Card>
          </section>

          {/* Key Differences */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">What to compare, and how</h2>

            {/* Who it is built for */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">1. Who it is built for</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-semibold mb-2">Ask Propertybase:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• How many users does each plan cover?</li>
                    <li>• How are leads assigned across a team?</li>
                    <li>• What does an administrator need to set up?</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Realtor Desk:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Built for a single agent</li>
                    <li>• No seats, lead routing or shared pipeline</li>
                    <li>• Contacts import from a CSV file</li>
                    <li>• French set per contact</li>
                  </ul>
                </div>
              </div>

              <p className="text-sm font-semibold text-gray-600">If you need more than one user, Realtor Desk is the wrong choice.</p>
            </Card>

            {/* AI */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">2. What the AI does</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-semibold mb-2">Ask Propertybase:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Which AI features are included, and which cost extra?</li>
                    <li>• Does anything send to a client without your approval?</li>
                    <li>• Can you see why a lead was scored as it was?</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Realtor Desk:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• A rule-based lead score from 0 to 100, with a visible breakdown</li>
                    <li>• A suggested next action and a time to take it</li>
                    <li>• An in-app assistant that drafts a reply or summarises a thread</li>
                    <li>• No lead-facing chatbot, no automatic replies and no voice agent</li>
                  </ul>
                </div>
              </div>

              <p className="text-sm font-semibold text-gray-600">The score is rule-based. It is not machine learning.</p>
            </Card>

            {/* Canadian specifics. This was "Canadian Compliance ... Built-in
                PIPEDA/CASL". Software does not make anyone compliant, so the
                card now says what the product records and where the data sits. */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">3. Consent, language and data location</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-semibold mb-2">Ask Propertybase:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Is a consent date and source stored on each contact?</li>
                    <li>• What happens when you try to send without consent?</li>
                    <li>• Do the interface and client email work in French?</li>
                    <li>• Where is the customer database hosted?</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Realtor Desk:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Records the date and source of consent on each contact</li>
                    <li>• Refuses to send from the inbox or by SMS when no consent is on file</li>
                    <li>• Stops automated email to a contact who has withdrawn</li>
                    <li>• French or English set per contact</li>
                    <li>• Production database hosted in Canada</li>
                  </ul>
                </div>
              </div>

              <p className="text-sm font-semibold text-gray-600">Software does not make anyone compliant. Some outside services Realtor Desk uses (SMS, email delivery, AI drafting) may process data outside Canada.</p>
            </Card>

            {/* Cost. The five-user, three-year cost model that stood here was
                built on Propertybase figures with no source, and on a seat
                count Realtor Desk does not sell. */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">4. Cost</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-semibold mb-2">Ask Propertybase:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• For a written quote covering every user you need</li>
                    <li>• Whether setup, training and support are billed separately</li>
                    <li>• The contract length and the cost of leaving early</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Realtor Desk:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• CAD $149 a month for a single agent</li>
                    <li>• 14-day trial, with a card collected up front</li>
                    <li>• Nothing is charged before day 14</li>
                  </ul>
                </div>
              </div>

              <p className="text-sm font-semibold text-gray-600">Compare the written quote with our published price. We are not going to guess the other side of that sum.</p>
            </Card>
          </section>

          {/* Use Case Analysis */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Who Should Consider Realtor Desk?</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Look Elsewhere If:</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-gray-500 mt-0.5" />
                    <span>You run a team or a brokerage and need seats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-gray-500 mt-0.5" />
                    <span>You need lead assignment, a shared pipeline or a team inbox</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-gray-500 mt-0.5" />
                    <span>You need transaction management, e-signature or a back office</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-gray-500 mt-0.5" />
                    <span>You want an IDX website or lead generation from the same vendor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-gray-500 mt-0.5" />
                    <span>You need a native mobile app</span>
                  </li>
                </ul>
                <p className="text-sm font-semibold mt-4 text-gray-600 italic">
                  Realtor Desk does none of these. Ask Propertybase which of them it covers.
                </p>
              </Card>

              <Card className="p-6 border-2 border-primary bg-primary/5">
                <h3 className="text-xl font-bold mb-4">Consider Realtor Desk If:</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span>You work alone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span>You want contacts, one timeline per client and a pipeline in CAD</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span>Some of your clients are served in French</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span>You want the date and source of consent kept on each contact</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span>You want a price you can read before you speak to anyone</span>
                  </li>
                </ul>
                <p className="text-sm font-semibold mt-4 text-primary italic">
                  The 14-day trial is the way to check the fit on your own leads.
                </p>
              </Card>
            </div>
          </section>

          {/* A "Real-World Scenario: Team of 10 Agents" section stood here. It
              was not a real scenario: the lead volume, response times and
              conversion rates on both sides were invented, and it modelled a
              ten-agent team on a product built for one agent. Removed
              2026-10-11. */}

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">FAQ: Propertybase vs Realtor Desk</h2>

            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="font-bold mb-2">Is Realtor Desk a replacement for Propertybase?</h3>
                <p className="text-gray-700">
                  Only for a single agent who wants a CRM and nothing wider. Realtor Desk has no seats, no lead routing, no transaction management and no back office, so it cannot stand in for a platform that a team or a brokerage runs on.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Can Realtor Desk scale to a team or a brokerage?</h3>
                <p className="text-gray-700">
                  No. It is a single-agent product: no seats, no lead assignment or routing, no shared pipeline and no team inbox. If you need those, look at products built for teams.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">What should I ask Propertybase before I compare?</h3>
                <p className="text-gray-700">
                  The price per user and its currency, any implementation or setup fee, how long setup takes and who does it, the contract length, and the format your contacts export in. Get the answers in writing.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Can I bring my contacts from Propertybase into Realtor Desk?</h3>
                <p className="text-gray-700">
                  If you can export them to a CSV file, yes. The import brings in contacts only: consent records, deals and history are not imported, and duplicates are not merged. Check your Propertybase contract terms with Propertybase before you move.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">What does the AI in Realtor Desk do?</h3>
                <p className="text-gray-700">
                  It scores each lead from 0 to 100 by rule and shows the breakdown, suggests a next action, and drafts a reply or summarises the thread on the contact you have open. Nothing is sent to a client without you. There is no lead-facing chatbot and no voice agent.
                </p>
              </Card>
            </div>
          </section>

          {/* Conclusion */}
          <section className="mb-12">
            <Card className="p-8 bg-gradient-to-r from-gray-50 to-blue-50">
              <h2 className="text-3xl font-bold mb-4">Conclusion</h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg">
                  Realtor Desk is a CRM for one Canadian agent, at a published price, with French per contact and a consent record on each contact.
                </p>
                <p className="text-lg">
                  It is not a platform for a team or a brokerage. If that is what you need, it is the wrong product; ask Propertybase and other vendors what they offer for teams.
                </p>
                <p className="text-lg">
                  Ask Propertybase for a written quote, then put the two side by side on what you actually use.
                </p>
              </div>
            </Card>
          </section>

          {/* Final CTA */}
          <section className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Try It on Your Own Leads</h2>
            <p className="text-xl text-gray-600 mb-8">
              Try Realtor Desk free for 14 days. A card is required to start; you're not charged until the trial ends.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/signup">
                  Start Free Trial <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </section>

          {/* Related Articles */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Related Comparisons</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/blog/best-crm-canada-2025">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">Best CRM for Canadian Agents 2025</h3>
                  <p className="text-sm text-gray-600">How the options compare</p>
                </Card>
              </Link>
              <Link to="/blog/vs-lofty-crm">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">Lofty CRM vs Realtor Desk</h3>
                  <p className="text-sm text-gray-600">Side-by-side comparison</p>
                </Card>
              </Link>
              <Link to="/blog/boomtown-alternative-canada">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">BoomTown Alternatives</h3>
                  <p className="text-sm text-gray-600">Options for Canadian agents</p>
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

export default VsPropertybase;
