// Rewritten 2026-10-11 to follow the Realtor Desk fact sheet of that date.
//
// An earlier pass made the calculator's target rate a reader input and removed
// an invented testimonial. This pass removes the rest: the "487 leads /
// $2,100,000 / $336,000" opening box, the percentages attached to each kind of
// missed lead, the "average Canadian transaction" and conversion "benchmarks",
// the response-time table attributed to a Harvard Business Review study with
// no link, the "Canadian Real Estate Study (2024)" hour-of-day figures, the
// Agent A-D "real example", every "$90,000 a year" style figure, the ROI box
// that priced Realtor Desk at $3,588 a year and credited it with the reader's
// target rate, and the FAQ and closing copy that said AI replies in under
// three seconds, qualifies leads and books appointments.
//
// The average commission is now a reader input too, so the calculator supplies
// arithmetic and no operands.
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, DollarSign, TrendingDown, Clock, Target, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { SEO } from '@/components/SEO';
import { ProductScopeNote } from "@/components/marketing/ProductScopeNote";

const CostOfMissedLeads = () => {
  const [leads, setLeads] = useState(400);
  const [currentConversion, setCurrentConversion] = useState(1.2);

  // `aiConversion` was hardcoded to 2.7 -- an assertion that this product
  // converts leads at 2.7%, used to compute a dollar figure the page then
  // labelled the reader's "Lost Income".
  //
  // No such rate has ever been measured. Production has recorded zero deals.
  // It is the same fabrication as the "32s / -96%" hero KPI removed in
  // PR #173, except that this one produced a number about the reader's own
  // money, which is worse.
  //
  // It is now an input the reader controls, defaulted to a round figure and
  // labelled as their assumption. The calculator still does the arithmetic it
  // was built for; it just no longer supplies a claim as one of the operands.
  const [targetConversion, setTargetConversion] = useState(2.5);
  // Same reasoning for the commission: it was a constant 12000 presented as
  // the "average Canadian transaction". It is the reader's own figure now.
  const [avgCommission, setAvgCommission] = useState(10000);

  const currentDeals = (leads * currentConversion / 100);
  const currentIncome = currentDeals * avgCommission;
  const targetDeals = (leads * targetConversion / 100);
  const targetIncome = targetDeals * avgCommission;
  const difference = targetIncome - currentIncome;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SEO
        title="The Cost of Missed Real Estate Leads"
        description="Work out what missed and slow-answered leads cost you, using your own numbers. A calculator and a week-by-week plan for Canadian real estate agents."
        keywords="missed real estate leads, lead response time, real estate ROI, Canadian real estate leads, lead follow-up"
        article
        publishedTime="2025-01-01"
        modifiedTime="2026-10-11"
        author="Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/resources/cost-of-missed-real-estate-leads-canada"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "The Cost of Missed Real Estate Leads",
            "description": "Work out what missed and slow-answered leads cost you, using your own numbers. A calculator and a week-by-week plan for Canadian real estate agents.",
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
            <div className="inline-flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full mb-6">
              <TrendingDown className="w-4 h-4 text-red-700" />
              <span className="text-sm font-semibold text-red-900">Worksheet: Missed Leads</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              The Cost of Missed Real Estate Leads
            </h1>
            <ProductScopeNote className="mb-6" />
            <p className="text-xl text-gray-600 mb-8">
              A missed lead is a deal you could have won and did not. This page helps you find where yours go and put a figure on them using your own numbers.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-500">
              <span>Updated: October 2026</span>
              <span>7 min read</span>
              <span>Worksheet and calculator</span>
            </div>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              Most real estate agents think they're doing fine. They respond to leads "quickly enough." They follow up "pretty consistently." They're "working hard."
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              The difficulty is that a missed lead is silent. Nobody tells you that they went with the agent who answered first. Unless you keep a record, you cannot tell how many enquiries went unanswered or were answered late.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              This page quotes no industry averages, because we have none we can source. It shows you what to count and how to work out what the gap is worth to you.
            </p>
          </div>

          {/* What Counts as Missed Lead */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">What Counts as a "Missed Lead"?</h2>
            
            <Card className="p-6 mb-6 bg-blue-50">
              <p className="text-lg font-semibold mb-2">Definition:</p>
              <p className="text-gray-700">
                A lead that doesn't convert due to <strong>agent error</strong>, not buyer qualification. These are winnable deals that slip through the cracks.
              </p>
            </Card>

            <div className="space-y-6">
              {/* Type 1 */}
              <Card className="p-6 border-2 border-red-300">
                <div className="flex items-start gap-4">
                  <div className="bg-red-700 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 font-bold text-lg">1</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Never Contacted</h3>
                    <p className="text-gray-700 mb-3">Lead submits form → Agent doesn't see notification → Lead is never contacted</p>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="font-semibold text-red-900 mb-2">Cause:</p>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Poor CRM notification system</li>
                        <li>• Email goes to spam</li>
                        <li>• Agent disorganized</li>
                        <li>• No centralized lead inbox</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Type 2 */}
              <Card className="p-6 border-2 border-orange-300">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-700 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 font-bold text-lg">2</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Contacted Too Slowly</h3>
                    <p className="text-gray-700 mb-3">Lead submits form → Agent responds much later → Lead has already contacted other agents → One of them is already in conversation</p>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="font-semibold text-orange-900 mb-2">Cause:</p>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Manual follow-up process</li>
                        <li>• With a client when the enquiry arrives</li>
                        <li>• Away from computer</li>
                        <li>• No fixed times for checking new enquiries</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Type 3 */}
              <Card className="p-6 border-2 border-yellow-300">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-700 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 font-bold text-lg">3</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Inconsistent Follow-Up</h3>
                    <p className="text-gray-700 mb-3">Agent responds once or twice → Lead goes quiet → Agent forgets to follow up → Lead buys months later with a different agent</p>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="font-semibold text-yellow-900 mb-2">Cause:</p>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• No follow-up system</li>
                        <li>• No date set for the next contact</li>
                        <li>• Too busy with active clients</li>
                        <li>• Assumes "not interested" means "never interested"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Type 4 */}
              <Card className="p-6 border-2 border-purple-300">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 font-bold text-lg">4</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Poor Qualification</h3>
                    <p className="text-gray-700 mb-3">Agent doesn't ask qualifying questions → Wastes time on tire-kickers → Ignores hot leads thinking they're cold</p>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="font-semibold text-purple-900 mb-2">Cause:</p>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• No lead scoring system</li>
                        <li>• Intuition-based qualification</li>
                        <li>• Treats all leads equally</li>
                        <li>• Can't identify hot vs cold leads</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Type 5 */}
              <Card className="p-6 border-2 border-blue-300">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 font-bold text-lg">5</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">After-Hours Loss</h3>
                    <p className="text-gray-700 mb-3">Lead arrives at 9 PM → Agent responds next morning → Lead has already heard from another agent</p>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="font-semibold text-blue-900 mb-2">Cause:</p>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• No plan for evening and weekend enquiries</li>
                        <li>• Agent offline when people are browsing</li>
                        <li>• After-hours = next business day</li>
                        <li>• Work-life balance vs lead capture conflict</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 mt-6 bg-gray-50">
              <p className="text-lg font-bold mb-2">How much does each one cost you?</p>
              <p className="text-gray-700">We give no percentages for these five, because we have no sourced figures. The Week 1 audit further down shows you how to count your own.</p>
            </Card>
          </section>

          {/* The Math */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">The Math: What a Missed Lead Costs You</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                <DollarSign className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-4">Step 1: Your Net Commission per Deal</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span>Your typical sale price</span>
                    <span className="font-bold">your figure</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>× the commission rate on your side</span>
                    <span className="font-bold">your figure</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>× your share after the brokerage split</span>
                    <span className="font-bold">your figure</span>
                  </div>
                  <div className="border-t-2 border-primary pt-2 flex justify-between gap-4">
                    <span className="font-bold text-lg">= net to you per deal</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50">
                <Target className="w-12 h-12 text-green-700 mb-4" />
                <h3 className="text-xl font-bold mb-4">Step 2: Your Conversion Rate</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-1">Deals closed last year from leads</p>
                    <p className="text-gray-700">÷ leads received last year</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-1">= your current conversion rate</p>
                    <p className="text-gray-700">We publish no benchmark to compare it with.</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 bg-gradient-to-r from-gray-900 to-gray-700 text-white">
              <h3 className="text-2xl font-bold mb-4">Step 3: What the Gap Is Worth</h3>
              <p className="mb-3">Leads per year × your current rate × net commission = income from leads today.</p>
              <p className="mb-3">Leads per year × a rate you think you could reach × net commission = income at that rate.</p>
              <p>The difference between the two is what the gap is worth to you. The calculator below does this arithmetic.</p>
            </Card>
          </section>

          {/* Why speed matters */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Why Speed Matters</h2>

            <Card className="p-6 mb-6 bg-blue-50">
              <p className="text-gray-700 mb-3">
                Someone who has just sent an enquiry is thinking about it right now, and may send the same enquiry to more than one agent. The longer a reply takes, the more likely they are to be talking to someone else already.
              </p>
              <p className="text-gray-700">
                You will see precise multipliers quoted for response time. This page used to carry a table of them attributed to a study, with no link. We could not trace those figures to a source, so we have removed them.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Measure Your Own Response Time</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• For two weeks, note the time each enquiry arrived and the time you first replied</li>
                <li>• Split the list into weekday daytime, evenings and weekends</li>
                <li>• Mark the enquiries that never got a reply</li>
                <li>• Look at which group has the longest waits. That is where to start</li>
              </ul>
            </Card>
          </section>

          {/* After-Hours Problem */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">After-Hours Leads</h2>

            <Card className="p-6 mb-6 bg-blue-50">
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">
                  People browse listings after work and at weekends, so some of your enquiries arrive when you are not at your desk. How many is something only your own records can tell you: sort the last three months of enquiries by the hour they arrived.
                </p>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-bold mb-4">What you can do yourself</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Pick one time each evening to check and answer new enquiries</li>
                  <li>• Keep a saved first reply ready to personalise</li>
                  <li>• Answer overnight enquiries first thing, before anything else</li>
                  <li>• Arrange cover with a colleague for days you are fully booked</li>
                </ul>
              </Card>

              <Card className="p-6 bg-gray-50">
                <h3 className="font-bold mb-4">Automatic first-response tools</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Some vendors sell website chat or auto-reply products that acknowledge an enquiry at any hour. If you consider one, ask what it says to leads, who reviews it, and how it records consent.
                </p>
                <p className="text-sm text-gray-700">
                  Realtor Desk is not one of these. It has no chatbot and no automatic replies, and it does not qualify leads or book appointments on its own.
                </p>
              </Card>
            </div>
          </section>

          {/* Calculator */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Calculate YOUR Cost of Missed Leads</h2>
            
            <Card className="p-8 bg-gradient-to-r from-primary to-blue-600 text-white">
              <h3 className="text-2xl font-bold mb-6 text-center">Conversion Gap Calculator</h3>
              
              <div className="space-y-6 max-w-2xl mx-auto">
                <div>
                  {/* The label was present but unassociated: no htmlFor, no id.
                      Visually a label, programmatically nothing -- axe rates
                      that critical, and clicking the text did not focus the
                      field either. */}
                  <label htmlFor="calc-annual-leads" className="block mb-2 font-semibold">Annual Leads</label>
                  <input 
                    id="calc-annual-leads"
                    type="number" 
                    value={leads}
                    onChange={(e) => setLeads(Number(e.target.value))}
                    className="w-full p-3 rounded-lg text-gray-900 text-lg font-bold"
                  />
                </div>

                <div>
                  <label htmlFor="calc-conversion-rate" className="block mb-2 font-semibold">Current Conversion Rate (%)</label>
                  <input 
                    id="calc-conversion-rate"
                    type="number" 
                    value={currentConversion}
                    onChange={(e) => setCurrentConversion(Number(e.target.value))}
                    step="0.1"
                    className="w-full p-3 rounded-lg text-gray-900 text-lg font-bold"
                  />
                </div>

                <div>
                  <label htmlFor="calc-target-rate" className="block mb-2 font-semibold">
                    Target Conversion Rate (%)
                  </label>
                  <input
                    id="calc-target-rate"
                    type="number"
                    value={targetConversion}
                    onChange={(e) => setTargetConversion(Number(e.target.value))}
                    step="0.1"
                    className="w-full p-3 rounded-lg text-gray-900 text-lg font-bold"
                  />
                  <p className="mt-2 text-xs text-white/80">
                    Your assumption, not a Realtor Desk result. We have no published
                    conversion figures &mdash; see the FAQ.
                  </p>
                </div>

                <div>
                  <label htmlFor="calc-net-commission" className="block mb-2 font-semibold">
                    Your Net Commission per Deal ($)
                  </label>
                  <input
                    id="calc-net-commission"
                    type="number"
                    value={avgCommission}
                    onChange={(e) => setAvgCommission(Number(e.target.value))}
                    step="500"
                    className="w-full p-3 rounded-lg text-gray-900 text-lg font-bold"
                  />
                  <p className="mt-2 text-xs text-white/80">
                    The starting value is a placeholder, not an average. Replace it
                    with the figure from Step 1 above.
                  </p>
                </div>

                <div className="bg-white/20 p-6 rounded-lg space-y-4">
                  <div className="flex justify-between text-lg">
                    <span>Income at your current rate:</span>
                    <span className="font-bold">${currentIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Income at your target rate ({targetConversion}%):</span>
                    <span className="font-bold">${targetIncome.toLocaleString()}</span>
                  </div>
                  <div className="border-t-2 border-white/40 pt-4 flex justify-between">
                    <span className="text-2xl font-bold">Difference:</span>
                    <span className="text-4xl font-bold text-yellow-300">${difference.toLocaleString()}/year</span>
                  </div>
                </div>

                <p className="text-sm text-white/90">
                  This is arithmetic on the four numbers you entered. It is not a forecast, and it
                  says nothing about what any product, ours included, would do for your conversion rate.
                </p>
              </div>
            </Card>
          </section>

          {/* The "Case Study: Real Agent, Real Numbers" section stood here. Its invented testimonial was removed in an earlier pass, leaving a heading with nothing under it; the heading is now gone too. There is no case study to show. */}

          {/* Action Plan */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Action Plan: Find and Fix the Gaps</h2>

            <div className="space-y-4">
              {[
                {
                  week: "Week 1: Audit",
                  tasks: ["Count leads from last month", "Calculate response time", "Calculate conversion rate", "Identify where leads are falling through"]
                },
                {
                  week: "Week 2: Implement",
                  tasks: ["Choose a CRM and import your contacts", "Connect your lead sources", "Set up lead scoring and next-action reminders", "Write your own follow-up rules"]
                },
                {
                  week: "Week 3: Monitor",
                  tasks: ["Log the time to first reply for every new enquiry", "Count the enquiries that got no reply at all", "Count appointments booked", "Compare evenings and weekends with weekday daytime"]
                },
                {
                  week: "Week 4: Adjust",
                  tasks: ["Reread the replies you sent and rewrite the weak ones", "Adjust your qualifying questions", "Change the follow-up dates that did not work", "Recalculate your conversion rate"]
                },
                {
                  week: "Week 5-12: Keep Going",
                  tasks: ["Keep logging response time and conversion each month", "Compare each month with your Week 1 baseline", "Drop lead sources that do not pay for themselves", "Decide whether to add a lead source only once the leaks are fixed"]
                }
              ].map((phase, index) => (
                <Card key={index} className="p-6">
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                    {phase.week}
                  </h3>
                  <ul className="space-y-2">
                    {phase.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-gray-700">{task}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">FAQ: Cost of Missed Leads</h2>
            
            <div className="space-y-4">
              {[
                {
                  q: "How do I know if I'm missing leads?",
                  a: "Compare the enquiries you received with the enquiries you replied to, and note how long each reply took. If you cannot produce those numbers, start by logging them for a month. The Week 1 audit above sets out what to count."
                },
                {
                  q: "Why do leads get missed?",
                  a: "Usually for ordinary reasons: a notification was not seen, the reply came late because you were with a client, or nobody followed up a second time. Your own audit will show which of these applies to you."
                },
                {
                  q: "Should I hire an inside sales agent (ISA) or buy software?",
                  a: "They do different jobs. An ISA is a person who makes and takes calls for you; get quotes for what one costs in your market. A CRM organises your leads and reminds you what to do next. Realtor Desk is a CRM, not a replacement for an ISA: it does not call or reply to leads for you."
                },
                {
                  q: "Does Realtor Desk publish conversion or response-time results?",
                  a: "No. We have no published conversion, response-time or ROI figures for Realtor Desk. The calculator on this page runs only on the numbers you enter."
                },
                {
                  q: "How does the Realtor Desk trial work?",
                  a: "Realtor Desk is CAD $149 a month for a single agent, with a 14-day trial. A card is collected up front and nothing is charged before day 14."
                }
              ].map((item, index) => (
                <Card key={index} className="p-6">
                  <h3 className="font-bold mb-2">{item.q}</h3>
                  <p className="text-gray-700">{item.a}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Conclusion */}
          <section className="mb-12">
            <Card className="p-8 bg-gradient-to-r from-gray-50 to-blue-50">
              <h2 className="text-3xl font-bold mb-6">Conclusion</h2>

              <div className="space-y-4 text-gray-700">
                <p className="text-lg">
                  A missed lead is a deal you could have won. Leads are missed in ordinary ways: an enquiry nobody saw, a reply that came late, a follow-up that never happened, an evening enquiry answered the next day.
                </p>

                <div className="bg-white p-6 rounded-lg">
                  <p className="font-bold text-xl mb-3">What to do about it:</p>
                  <ul className="space-y-2">
                    <li>• Count your enquiries, your replies and how long each reply took</li>
                    <li>• Work out your own conversion rate and net commission per deal</li>
                    <li>• Use the calculator to see what closing the gap would be worth to you</li>
                    <li>• Fix the largest leak first, then measure again</li>
                  </ul>
                </div>
              </div>
            </Card>
          </section>

          {/* Where Realtor Desk fits */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Where Realtor Desk Fits</h2>
            <Card className="p-6">
              <p className="text-gray-700 mb-4">
                Realtor Desk is a CRM for a single Canadian real estate agent. It will not answer a lead for you, and we make no claim about what it does to your conversion rate. It addresses the organisational causes on this page:
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• One list of leads, with one conversation timeline per client</li>
                <li>• A rule-based lead score from 0 to 100, with the breakdown shown</li>
                <li>• A suggested next action and a time to take it</li>
                <li>• An in-app assistant that drafts a reply for you to review. Nothing is sent to a client without you</li>
                <li>• The date and source of consent recorded on each contact</li>
                <li>• French or English set per contact</li>
              </ul>
            </Card>
          </section>

          {/* Final CTA */}
          <section className="text-center py-12">
            <Card className="p-8 bg-gradient-to-r from-primary to-blue-600 text-white">
              <h2 className="text-4xl font-bold mb-4">See Who Is Waiting for a Reply</h2>
              <p className="text-xl mb-8">
                Realtor Desk keeps your leads in one list, scores them by visible rules and suggests what to do next. CAD $149 a month for a single agent.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                  <Link to="/signup">
                    Start Free 14-Day Trial <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-white text-primary hover:bg-gray-100">
                  <Link to="/pricing">See Pricing</Link>
                </Button>
              </div>
              <p className="text-sm mt-4">14-day trial. A card is collected up front and nothing is charged before day 14.</p>
            </Card>
          </section>

          {/* Related Articles */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Related Resources</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/blog/ai-chatbot-real-estate-websites-canada">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">Website Chatbots: A Category Guide</h3>
                  <p className="text-sm text-gray-600">A general guide. Realtor Desk does not offer a chatbot</p>
                </Card>
              </Link>
              <Link to="/resources/voice-ai-real-estate-lead-follow-up-canada">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">Voice AI: A Category Guide</h3>
                  <p className="text-sm text-gray-600">A general guide. Realtor Desk does not offer voice AI</p>
                </Card>
              </Link>
              <Link to="/pricing">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">Realtor Desk Pricing</h3>
                  <p className="text-sm text-gray-600">CAD $149 a month for a single agent, with a 14-day trial</p>
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

export default CostOfMissedLeads;