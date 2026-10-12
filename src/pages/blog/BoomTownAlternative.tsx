// 2026-10-11: rewritten to follow the 2026-10-11 Realtor Desk fact sheet.
// Removed: every BoomTown price, contract length, setup time, server
// location and "no AI / no compliance" claim (none had a source), the savings
// and first-year cost figures built on them, the unsourced prices and
// pros/cons for Follow Up Boss, Real Geeks, kvCORE and LionDesk, and the
// Realtor Desk claims the product does not support (sub-3-second AI response,
// voice AI, "PIPEDA/CASL built-in", predictive scoring, the Q3 2026 DDF date,
// small-team positioning, month-to-month and setup-time claims, "best for").
// Lines that state the existing Agent / Team prices were left as they were.
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, XCircle, DollarSign, Shield, AlertTriangle, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';

const ASK_VENDOR = "Ask the vendor";

// Realtor Desk column follows the fact sheet. The BoomTown column makes no
// claim: we have no dated source for BoomTown's features or terms.
const COMPARISON_ROWS = [
  { feature: "Price/Month", boomtown: "Ask the vendor for a written quote", realtorDesk: "$149-299 CAD" },
  { feature: "Contacts, deal pipeline, basic reports", boomtown: ASK_VENDOR, realtorDesk: "Yes" },
  { feature: "Lead score", boomtown: ASK_VENDOR, realtorDesk: "Rule-based, 0 to 100, with a visible breakdown" },
  { feature: "Drafted replies", boomtown: ASK_VENDOR, realtorDesk: "In-app assistant drafts; you review and send" },
  { feature: "Automatic replies to leads", boomtown: ASK_VENDOR, realtorDesk: "Not available" },
  { feature: "Automated email sequences", boomtown: ASK_VENDOR, realtorDesk: "Not available (builder exists; scheduled sending is not on)" },
  { feature: "Lead generation and ads", boomtown: ASK_VENDOR, realtorDesk: "Not available" },
  { feature: "IDX website", boomtown: ASK_VENDOR, realtorDesk: "Not available" },
  { feature: "Team seats and lead routing", boomtown: ASK_VENDOR, realtorDesk: "Not available" },
  { feature: "Transaction management", boomtown: ASK_VENDOR, realtorDesk: "Not available" },
  { feature: "Native CREA DDF® sync", boomtown: ASK_VENDOR, realtorDesk: "Not available (on the roadmap, not live yet)" },
  { feature: "Native mobile app", boomtown: ASK_VENDOR, realtorDesk: "Not available (responsive web app)" },
  { feature: "Consent date and source per contact", boomtown: ASK_VENDOR, realtorDesk: "Yes" },
  { feature: "Database hosted in Canada", boomtown: ASK_VENDOR, realtorDesk: "Yes" },
  { feature: "French or English per contact", boomtown: ASK_VENDOR, realtorDesk: "Yes" },
];

// Competitor lines are limited to what the fact sheet records from the
// vendors' own sites (checked 2026-10-02). Everything else points the reader
// to the vendor.
const VENDOR_ROWS = [
  {
    vendor: "BoomTown",
    price: "Ask the vendor for a written quote",
    notes: "Check the vendor's own site for current features",
  },
  {
    vendor: "Realtor Desk",
    price: "$149-299 CAD/month",
    notes: "Single-agent CRM. No lead generation, website or team features",
  },
  {
    vendor: "Follow Up Boss",
    price: "Grow plan shown at $69 per user a month ($58 on annual billing); currency not stated",
    notes: "Lists lead routing, a team inbox, calling and 250+ integrations",
  },
  {
    vendor: "Real Geeks",
    price: "Check the vendor's own pricing page",
    notes: "Check the vendor's own site for current features",
  },
  {
    vendor: "BoldTrail (formerly kvCORE)",
    price: "No published price; quotes on request",
    notes: "Check the vendor's own site for current features",
  },
  {
    vendor: "LionDesk",
    price: "Discontinued September 2025",
    notes: "Lone Wolf Technologies. No longer an option",
  },
];

const BoomTownAlternative = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SEO
        title="BoomTown Alternative for Canada"
        description="Considering BoomTown in Canada? What to check before you buy or switch: lead-generation bundles, contract terms, and consent and data handling."
        keywords="BoomTown alternative Canada, BoomTown alternatives, Canadian real estate CRM, BoomTown vs Realtor Desk"
        article
        publishedTime="2025-01-01"
        modifiedTime="2026-10-11"
        author="Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/blog/boomtown-alternative-canada"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "BoomTown Alternative for Canada",
            "description": "Considering BoomTown in Canada? What to check before you buy or switch: lead-generation bundles, contract terms, and consent and data handling.",
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
              BoomTown Alternative for Canada
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              What to check before you buy BoomTown or switch away from it: price and currency, what is bundled, contract terms, and how consent and client data are handled in Canada.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-500">
              <span>Updated: October 2026</span>
              <span>6 min read</span>
              <span>Alternative guide</span>
            </div>
          </div>

          {/* Disclosure */}
          <Card className="p-6 mb-12">
            <p className="text-gray-700">
              We build one of the products compared here, so weigh this accordingly.
            </p>
          </Card>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              We do not print a BoomTown price or feature list here. Ask BoomTown for a written quote and check its own site for current features.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              This page covers the questions worth asking, the other vendors agents look at, and what our own product, Realtor Desk, does and does not do.
            </p>
          </div>

          {/* What to check */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">What to Check Before You Buy or Switch</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Price and Currency</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• What is the monthly price, in writing, and in which currency?</li>
                  <li>• Are there setup or onboarding fees?</li>
                  <li>• Is advertising spend included or billed on top?</li>
                </ul>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">What Is Bundled</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Does the quote include lead generation or a website?</li>
                  <li>• Can you buy the CRM on its own?</li>
                  <li>• Can you keep using your own lead sources?</li>
                </ul>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Contract Terms</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• How long is the term, and how does it renew?</li>
                  <li>• What does it cost to cancel early?</li>
                  <li>• What can you export if you leave, and in what format?</li>
                </ul>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Team or Single Agent</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Is there a minimum number of seats?</li>
                  <li>• Which features only matter if you run a team?</li>
                  <li>• What would a single agent actually use?</li>
                </ul>
              </Card>

              <Card className="p-6 md:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Consent and Client Data</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Where is client data stored, and which outside services process it?</li>
                  <li>• How does the product record consent, and what happens when a contact withdraws it?</li>
                  <li>• Can you work with clients in French?</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Top 5 Alternatives */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">BoomTown Alternatives to Look At</h2>
            <p className="text-gray-700 mb-6">
              Our own product is listed first. That is not a ranking.
            </p>

            {/* Realtor Desk */}
            <Card className="p-8 mb-8 border-2 border-primary bg-primary/5">
              <div className="mb-4">
                <h3 className="text-2xl font-bold">Realtor Desk</h3>
                <p className="text-primary font-semibold">A CRM for Canadian real estate agents</p>
              </div>

              <p className="text-gray-700 mb-4">
                <strong>What It Is:</strong> A single-agent CRM. There are no seats, no lead assignment or routing, no shared pipeline and no team inbox. It runs as a responsive web app, and there is no native iOS or Android app.
              </p>

              <div className="mb-6">
                <h4 className="font-bold mb-3">What It Does:</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-700 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Contacts and Pipeline</p>
                      <p className="text-sm text-gray-600">Contacts, one conversation timeline per client, a drag-and-drop deal pipeline with totals in CAD, and basic reports</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-700 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Lead Score</p>
                      <p className="text-sm text-gray-600">A rule-based score from 0 to 100 with a visible breakdown: engagement, behaviour, budget match, timeline and qualification</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-700 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Next Action and Drafting</p>
                      <p className="text-sm text-gray-600">It suggests a next action and a time to take it. An in-app assistant drafts a reply or summarises the thread on the contact you have open. Nothing is sent to a client without you</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-700 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Consent Record</p>
                      <p className="text-sm text-gray-600">Records the date and source of consent on each contact, refuses to send from the inbox or by SMS when no consent is on file, and stops automated email to a contact who has withdrawn</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-700 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">French and English</p>
                      <p className="text-sm text-gray-600">French or English set per contact. The interface and client email both work in French</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-700 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">No Lead Gen Bundling</p>
                      <p className="text-sm text-gray-600">CRM only, use your own lead sources</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-700 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Connections</p>
                      <p className="text-sm text-gray-600">Zapier, Make and n8n can push leads in. SMS goes through Twilio, and email through your own SMTP server</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-700 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Imports</p>
                      <p className="text-sm text-gray-600">Contacts from a CSV file, and a single listing from a Realtor.ca address or an MLS number</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold mb-3">What It Does Not Do:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                    <span>No lead generation, ads or IDX website</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                    <span>No team seats, lead routing, shared pipeline or team reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                    <span>No automatic replies to leads, no lead-facing chatbot and no voice AI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                    <span>No automated email sequences. A sequence builder exists, but scheduled sending is not switched on</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                    <span>No automatic appointment booking. Google Calendar and Outlook connect, but appointment sync is not live</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                    <span>Native CREA DDF® sync is on the roadmap and is not live yet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                    <span>No transaction management, e-signature or document storage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                    <span>The CSV import does not bring in consent records, deals or history, and it does not merge duplicates</span>
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="font-bold mb-3">Pricing:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Agent: $149 CAD/month</li>
                  <li>• Team: $299 CAD/month</li>
                  <li>• 14-day free trial</li>
                  <li>• A card is collected up front and nothing is charged before day 14</li>
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="font-bold mb-3">Who It Suits:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• A single agent in Canada</li>
                  <li>• Agents with their own lead sources and website</li>
                  <li>• Agents who work with French-speaking clients</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-lg mb-6">
                <h4 className="font-bold mb-3">Comparison to BoomTown:</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-2 pr-4">Feature</th>
                        <th className="text-left pb-2 pr-4">BoomTown</th>
                        <th className="text-left pb-2">Realtor Desk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARISON_ROWS.map((row) => (
                        <tr key={row.feature} className="border-b last:border-b-0">
                          <td className="py-2 pr-4">{row.feature}</td>
                          <td className="py-2 pr-4">{row.boomtown}</td>
                          <td className="py-2">{row.realtorDesk}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  We have no dated source for BoomTown's features or terms, so that column sends you to the vendor.
                </p>
              </div>

              <div className="flex gap-4">
                <Button asChild size="lg">
                  <Link to="/demo">
                    Try Realtor Desk <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </Card>

            {/* Follow Up Boss */}
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-bold mb-3">Follow Up Boss</h3>
              <p className="text-gray-700 mb-2">
                A real estate CRM. On 2026-10-02 its own site showed the Grow plan at $69 per user a month ($58 on annual billing), currency not stated, and listed lead routing, a team inbox, calling and 250+ integrations.
              </p>
              <p className="text-sm text-gray-700">
                Check the vendor's own site for current pricing and features.
              </p>
            </Card>

            {/* Real Geeks */}
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-bold mb-3">Real Geeks</h3>
              <p className="text-gray-700 mb-2">
                A real estate website and CRM product.
              </p>
              <p className="text-sm text-gray-700">
                Check the vendor's own site for current pricing and features.
              </p>
            </Card>

            {/* BoldTrail (formerly kvCORE) */}
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-bold mb-3">BoldTrail (formerly kvCORE)</h3>
              <p className="text-gray-700 mb-2">
                A real estate CRM platform. On 2026-10-02 its own site published no prices. It quotes on request.
              </p>
              <p className="text-sm text-gray-700">
                Check the vendor's own site for current pricing and features.
              </p>
            </Card>

            {/* LionDesk */}
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-bold mb-3">LionDesk</h3>
              <p className="text-gray-700">
                LionDesk was discontinued in September 2025 (Lone Wolf Technologies), so it is no longer an option.
              </p>
            </Card>
          </section>

          {/* Vendor price summary */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">What Each Vendor Publishes on Price</h2>

            <Card className="p-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-3 pr-4">Vendor</th>
                    <th className="text-left pb-3 pr-4">Published price</th>
                    <th className="text-left pb-3 pr-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {VENDOR_ROWS.map((row) => (
                    <tr key={row.vendor} className="border-b last:border-b-0">
                      <td className="py-3 pr-4 font-semibold">{row.vendor}</td>
                      <td className="py-3 pr-4">{row.price}</td>
                      <td className="py-3 pr-4">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-600 mt-4">
                The Follow Up Boss and BoldTrail lines were checked on the vendors' own sites on 2026-10-02. Check each vendor's own site for current pricing and features.
              </p>
            </Card>
          </section>

          {/* Buying the pieces separately */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Buying the Pieces Separately</h2>

            <p className="text-gray-700 mb-6">
              Realtor Desk is a CRM only. If you move from an all-in-one platform to a standalone CRM, you supply the other pieces yourself. Price each one before you compare totals with any quote.
            </p>

            <Card className="p-6 mb-6">
              <h3 className="font-bold mb-4">What You Would Line Up:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• RealtorDesk AI CRM: $299/month = $3,588/year</li>
                <li>• Your own website: get a quote from your web provider</li>
                <li>• Lead generation: your own advertising budget</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-4">The Trade-Off:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• You choose your own lead sources</li>
                <li>• You can change components independently</li>
                <li>• You manage more than one supplier</li>
                <li>• Realtor Desk does not run ads, host an IDX website or route leads to a team</li>
              </ul>
            </Card>
          </section>

          {/* Consent and data handling */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Consent and Data Handling in Canada</h2>

            <p className="text-gray-700 mb-6">
              Canadian privacy and anti-spam rules affect how you collect, store and message client contacts. Software does not make anyone compliant, so ask your broker or a lawyer what applies to you, and put these questions to every vendor.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Where Data Lives
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Where is the database hosted?</li>
                  <li>• Which outside services process client data, and where?</li>
                  <li>• What does the contract say about access and deletion?</li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  Consent and Withdrawal
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Does the product record when and how each contact gave consent?</li>
                  <li>• What happens to automated email when a contact withdraws?</li>
                  <li>• Can you edit the templates to suit your own legal advice?</li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  French-Speaking Clients
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Can you set a client's language?</li>
                  <li>• Does client email work in French?</li>
                  <li>• Is the interface available in French?</li>
                </ul>
              </Card>

              <Card className="p-6 bg-green-50 border-green-200">
                <h3 className="font-bold mb-3 flex items-center gap-2 text-green-900">
                  <CheckCircle2 className="w-5 h-5 text-green-700" />
                  What Realtor Desk offers
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Database hosted in Canada</li>
                  <li>• Consent date and source recorded per contact</li>
                  <li>• French or English set per contact</li>
                  <li>• Priced in Canadian dollars</li>
                </ul>
              </Card>
            </div>

            <p className="text-sm text-gray-700">
              For Realtor Desk, some outside services (SMS, email delivery, AI drafting) may process data outside Canada. It refuses to send from the inbox or by SMS when no consent is on file, and it stops automated email to a contact who has withdrawn.
            </p>
          </section>

          {/* A "Real Agent Experiences" section stood here. All of it was
              invented:
          
                - three BoomTown "user reviews" with star ratings, presented as
                  coming FROM G2 and headed "from G2, 3.6/5 stars". Attributing
                  made-up quotes to a named third-party review platform is a
                  representation about both BoomTown and G2.
                - "Canadian Agent Feedback" from "Michael, Toronto", claiming
                  costs dropped 93% and conversion increased 200% after
                  switching. Production has recorded zero deals; neither figure
                  describes anything measured.
                - "RealtorDesk AI User Reviews", five stars, for a product with
                  one paying subscription.
          
              The brief prohibits generating testimonials and ratings, and
              CLAUDE.md prohibits fabricating case studies. Removed rather than
              softened: there is no honest edit of an invented review. */}

          {/* Decision Framework */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Decision Framework: Should You Switch?</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-bold mb-4 text-lg">Stay with BoomTown If:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ It is working for you and the quote suits your budget</li>
                  <li>✓ You run a team and need seats, lead routing or a shared pipeline</li>
                  <li>✓ You want your CRM, website and lead generation from one supplier</li>
                </ul>
              </Card>

              <Card className="p-6 border-2 border-primary bg-primary/5">
                <h3 className="font-bold mb-4 text-lg">Consider Realtor Desk If:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ You are a single agent in Canada</li>
                  <li>✓ You already have your own lead sources and website</li>
                  <li>✓ You want consent recorded per contact and the database hosted in Canada</li>
                  <li>✓ You work with French-speaking clients</li>
                  <li>✓ You want a price in Canadian dollars</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">FAQ: BoomTown Alternatives</h2>

            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="font-bold mb-2">Is BoomTown worth the price?</h3>
                <p className="text-gray-700">
                  That depends on the quote you get and on your own numbers. Ask for the price in writing, with the currency, any setup fees and any advertising spend, then compare it with what a CRM, a website and your own advertising would cost you separately.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">What happens to my data if I leave BoomTown?</h3>
                <p className="text-gray-700">
                  Ask BoomTown before you sign: what you can export, in what format, and what happens to your website and lead sources. Realtor Desk imports contacts from a CSV file. The import does not bring in consent records, deals or history, and it does not merge duplicates.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Is Realtor Desk really a BoomTown alternative?</h3>
                <p className="text-gray-700">
                  Only for the CRM part, and only for a single agent. Realtor Desk does not include lead generation, ads, an IDX website, lead routing or team features. If you need those from one vendor, it is not a replacement.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Does Realtor Desk reply to leads automatically?</h3>
                <p className="text-gray-700">
                  No. It suggests a next action and a time to take it, and an in-app assistant drafts a reply or summarises the thread on the contact you have open. Nothing is sent to a client without you.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">What does the Realtor Desk trial cost?</h3>
                <p className="text-gray-700">
                  The trial runs for 14 days. A card is collected up front and nothing is charged before day 14.
                </p>
              </Card>
            </div>
          </section>

          {/* Conclusion */}
          <section className="mb-12">
            <Card className="p-8 bg-gradient-to-r from-gray-50 to-blue-50">
              <h2 className="text-3xl font-bold mb-4">Conclusion</h2>
              <div className="space-y-4 text-gray-700">
                <p>BoomTown and Realtor Desk are different kinds of product, so the choice is mostly about what you need from one supplier.</p>
                <p>If you want a CRM, lead generation and a website from one vendor, or you run a team, Realtor Desk is not a replacement.</p>
                <p>If you are a single agent in Canada with your own lead sources, Realtor Desk is a small CRM with consent recorded per contact, the database hosted in Canada and French set per contact.</p>
                <p className="text-xl font-bold text-primary pt-4">
                  Get BoomTown's quote in writing, and try Realtor Desk on a few real contacts before you decide.
                </p>
              </div>
            </Card>
          </section>

          {/* Final CTA */}
          <section className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Try Realtor Desk for 14 Days</h2>
            <p className="text-xl text-gray-600 mb-8">
              A card is collected up front and nothing is charged before day 14.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/signup">
                  Start the 14-Day Trial <ArrowRight className="ml-2" />
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
                  <h3 className="font-bold mb-2">Best CRM for Canadian Real Estate Agents</h3>
                  <p className="text-sm text-gray-600">CRM comparison guide</p>
                </Card>
              </Link>
              <Link to="/blog/vs-kvcore">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">Realtor Desk vs kvCORE for Canadian Agents</h3>
                  <p className="text-sm text-gray-600">Side-by-side comparison</p>
                </Card>
              </Link>
              <Link to="/blog/vs-lofty-crm">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">Lofty CRM Review for Canadian Agents</h3>
                  <p className="text-sm text-gray-600">Vendor review</p>
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

export default BoomTownAlternative;
