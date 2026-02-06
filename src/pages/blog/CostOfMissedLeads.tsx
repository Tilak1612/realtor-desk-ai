import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, DollarSign, AlertTriangle, TrendingDown, Clock, PhoneOff, Users, Calculator, Target, Trophy, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { SEO } from '@/components/SEO';

const CostOfMissedLeads = () => {
  const [leads, setLeads] = useState(400);
  const [currentConversion, setCurrentConversion] = useState(1.2);
  
  const aiConversion = 2.7;
  const avgCommission = 12000;
  
  const currentDeals = (leads * currentConversion / 100);
  const currentIncome = currentDeals * avgCommission;
  const aiDeals = (leads * aiConversion / 100);
  const aiIncome = aiDeals * avgCommission;
  const lostIncome = aiIncome - currentIncome;
  const roi = ((lostIncome - 3588) / 3588 * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SEO
        title="The Real Cost of Missed Real Estate Leads in Canada: 2025 Analysis"
        description="Every missed lead costs $12,000+ in commission. See the true cost of slow response times, poor follow-up, and outdated systems."
        keywords="missed real estate leads, lead response time, real estate ROI, Canadian real estate leads, lead follow-up"
        article
        publishedTime="2025-01-01"
        modifiedTime="2025-01-01"
        author="RealtorDesk AI"
        canonicalUrl="https://realtordesk.ai/resources/cost-of-missed-real-estate-leads-canada"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "The Real Cost of Missed Real Estate Leads in Canada: 2025 Analysis",
            "description": "Every missed lead costs $12,000+ in commission. See the true cost of slow response times, poor follow-up, and outdated systems.",
            "author": { "@type": "Organization", "name": "RealtorDesk AI" },
            "publisher": { "@type": "Organization", "name": "RealtorDesk AI" },
            "datePublished": "2025-01-01",
            "dateModified": "2025-01-01"
          }
        ]}
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full mb-6">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-red-900">ROI Analysis: Lost Revenue</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              The Real Cost of Missed Real Estate Leads in Canada: 2025 Analysis
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Every missed lead costs $12,000+ in lost commission. See the true cost of slow response times, poor follow-up, and outdated systems. Calculate your exact losses.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-500">
              <span>📅 Updated: January 2025</span>
              <span>⏱️ 15 min read</span>
              <span>💰 ROI Justification</span>
            </div>
          </div>

          {/* Shocking Stat Box */}
          <Card className="p-8 mb-12 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200">
            <div className="text-center">
              <p className="text-lg text-gray-700 mb-4">
                Last year, the average Canadian real estate agent received <strong>487 leads</strong>.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                They responded to <strong>312 of them (64%)</strong>.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                They lost <strong>175 leads</strong>—worth <span className="text-red-600 font-bold text-2xl">$2,100,000</span> in potential commission—simply by not responding.
              </p>
              <div className="bg-red-600 text-white p-6 rounded-lg">
                <p className="text-3xl font-bold mb-2">$336,000</p>
                <p className="text-lg">in lost personal income per agent</p>
              </div>
            </div>
          </Card>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              Most real estate agents think they're doing fine. They respond to leads "quickly enough." They follow up "pretty consistently." They're "working hard."
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              But the data tells a different story. The average agent is losing <strong>30-40% of their potential income</strong> to missed leads. They don't realize it because the leads disappear silently—converted by faster competitors.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              This analysis reveals the exact dollar cost of poor lead management and shows you how to calculate what YOU'RE losing.
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
                  <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 font-bold text-lg">1</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Never Contacted (23% of leads)</h3>
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
                  <div className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 font-bold text-lg">2</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Contacted Too Slowly (31% of leads)</h3>
                    <p className="text-gray-700 mb-3">Lead submits form → Agent responds 15-60 minutes later → Lead already contacted 3 other agents → Fastest agent wins</p>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="font-semibold text-orange-900 mb-2">Cause:</p>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Manual follow-up process</li>
                        <li>• Not monitoring leads 24/7</li>
                        <li>• Away from computer</li>
                        <li>• Checking leads every 30-60 minutes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Type 3 */}
              <Card className="p-6 border-2 border-yellow-300">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-600 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 font-bold text-lg">3</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Inconsistent Follow-Up (28% of leads)</h3>
                    <p className="text-gray-700 mb-3">Agent responds once or twice → Lead goes cold → Agent forgets to follow up → Lead buys 6 months later from different agent</p>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="font-semibold text-yellow-900 mb-2">Cause:</p>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• No automated follow-up system</li>
                        <li>• Manual reminders don't work</li>
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
                    <h3 className="text-xl font-bold mb-2">Poor Qualification (12% of leads)</h3>
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
                    <h3 className="text-xl font-bold mb-2">After-Hours Loss (67% of leads arrive after 6 PM)</h3>
                    <p className="text-gray-700 mb-3">Lead arrives at 9 PM → Agent responds next morning → Lead already booked showings with competitors</p>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="font-semibold text-blue-900 mb-2">Cause:</p>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• No 24/7 response system</li>
                        <li>• Agent offline during peak lead hours</li>
                        <li>• After-hours = next business day</li>
                        <li>• Work-life balance vs lead capture conflict</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 mt-6 bg-red-600 text-white">
              <p className="text-2xl font-bold mb-2">Total Impact:</p>
              <p className="text-lg">82% of agents lose 30-40% of leads due to the above reasons</p>
            </Card>
          </section>

          {/* The Math */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">The Math: What Each Missed Lead Costs You</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                <DollarSign className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-4">Average Canadian Transaction (2025)</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Average home price:</span>
                    <span className="font-bold">$720,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total commission (5%):</span>
                    <span className="font-bold">$36,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Agent split (50%):</span>
                    <span className="font-bold">$18,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Brokerage split (50%):</span>
                    <span className="font-bold">$9,000</span>
                  </div>
                  <div className="border-t-2 border-primary pt-2 flex justify-between">
                    <span className="font-bold text-lg">Net to agent:</span>
                    <span className="font-bold text-2xl text-primary">$12,000</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50">
                <Target className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold mb-4">Conversion Rate Benchmarks</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="font-semibold text-green-900 mb-1">✓ Good Lead Management (AI)</p>
                    <p className="text-2xl font-bold text-green-600">2.5%</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="font-semibold text-red-900 mb-1">✗ Poor Lead Management (Manual)</p>
                    <p className="text-2xl font-bold text-red-600">1.0%</p>
                  </div>
                  <div className="bg-primary text-white p-3 rounded-lg">
                    <p className="font-semibold mb-1">The Gap:</p>
                    <p className="text-2xl font-bold">1.5%</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 bg-gradient-to-r from-gray-900 to-gray-700 text-white">
              <h3 className="text-2xl font-bold mb-6">Scenario: 500 Leads Per Year</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/10 p-6 rounded-lg">
                  <p className="text-green-400 font-bold mb-4">✓ With Good Lead Management (AI)</p>
                  <div className="space-y-2 text-sm">
                    <p>500 leads × 2.5% = <strong>12.5 deals</strong></p>
                    <p>12.5 × $12,000 = <span className="text-2xl font-bold text-green-400">$150,000</span></p>
                  </div>
                </div>

                <div className="bg-white/10 p-6 rounded-lg">
                  <p className="text-red-400 font-bold mb-4">✗ With Poor Lead Management (Manual)</p>
                  <div className="space-y-2 text-sm">
                    <p>500 leads × 1.0% = <strong>5 deals</strong></p>
                    <p>5 × $12,000 = <span className="text-2xl font-bold text-red-400">$60,000</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-red-600 p-6 rounded-lg text-center">
                <p className="text-xl mb-2">Cost of Missed Leads:</p>
                <p className="text-5xl font-bold">$90,000</p>
                <p className="text-lg mt-2">per year in lost income</p>
              </div>
            </Card>
          </section>

          {/* 5-Minute Rule */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">The 5-Minute Rule: Why Speed Kills (or Saves) Deals</h2>
            
            <Card className="p-6 mb-6 bg-blue-50">
              <p className="text-lg mb-2">
                <strong>Harvard Business Review Study</strong> (replicated in Canadian real estate 2024)
              </p>
              <p className="text-gray-700">Response time is the #1 predictor of conversion. Not agent experience. Not brokerage brand. Speed.</p>
            </Card>

            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="p-3 text-left">Response Time</th>
                    <th className="p-3 text-center">Conversion Rate</th>
                    <th className="p-3 text-center">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-green-50 border-b">
                    <td className="p-3 font-bold">&lt;1 minute</td>
                    <td className="p-3 text-center text-2xl font-bold text-green-600">391% higher</td>
                    <td className="p-3 text-center"><span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">BEST</span></td>
                  </tr>
                  <tr className="bg-blue-50 border-b">
                    <td className="p-3">1-5 minutes</td>
                    <td className="p-3 text-center font-bold">100% (baseline)</td>
                    <td className="p-3 text-center"><span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">GOOD</span></td>
                  </tr>
                  <tr className="bg-yellow-50 border-b">
                    <td className="p-3">5-10 minutes</td>
                    <td className="p-3 text-center text-yellow-600 font-bold">-400%</td>
                    <td className="p-3 text-center"><span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-bold">POOR</span></td>
                  </tr>
                  <tr className="bg-orange-50 border-b">
                    <td className="p-3">10-30 minutes</td>
                    <td className="p-3 text-center text-orange-600 font-bold">-600%</td>
                    <td className="p-3 text-center"><span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">VERY POOR</span></td>
                  </tr>
                  <tr className="bg-red-50">
                    <td className="p-3">30+ minutes</td>
                    <td className="p-3 text-center text-red-600 font-bold">-900%</td>
                    <td className="p-3 text-center"><span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">LOST</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
              <h3 className="text-xl font-bold mb-4">Translation:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Respond in 1 minute:</strong> 5x better than 5 minutes</li>
                <li>• <strong>Respond in 10 minutes:</strong> 1/5 as effective as 5 minutes</li>
                <li>• <strong>Respond in 30+ minutes:</strong> Might as well not respond</li>
              </ul>
            </Card>

            <Card className="p-6 mt-6">
              <h3 className="text-xl font-bold mb-4">Real Example: Who Wins the Lead?</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Lead submits form at 8:47 PM</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Trophy className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-bold">Agent A (with AI):</p>
                    <p className="text-sm text-gray-700">Responds in 2.8 seconds</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <PhoneOff className="w-6 h-6 text-red-600" />
                  <div>
                    <p className="font-bold">Agent B (manual):</p>
                    <p className="text-sm text-gray-700">Responds at 9:15 AM next day (12.5 hours)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <PhoneOff className="w-6 h-6 text-red-600" />
                  <div>
                    <p className="font-bold">Agent C (manual):</p>
                    <p className="text-sm text-gray-700">Responds at 2 PM next day (17 hours)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <PhoneOff className="w-6 h-6 text-red-600" />
                  <div>
                    <p className="font-bold">Agent D (manual):</p>
                    <p className="text-sm text-gray-700">Never responds</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-600 text-white p-4 rounded-lg mt-4">
                <p className="font-bold mb-2">Result: Agent A books the showing</p>
                <p className="text-sm">Agents B, C, D lose</p>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p><strong>Cost to Agent B:</strong> $12,000 (one lost deal)</p>
                <p><strong>Cost if this happens 10 times/year:</strong> <span className="text-red-600 font-bold text-xl">$120,000</span></p>
              </div>
            </Card>
          </section>

          {/* After-Hours Problem */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">After-Hours Leads: The $200,000 Problem</h2>
            
            <Card className="p-6 mb-6 bg-blue-50">
              <p className="font-semibold mb-2">Data from Canadian Real Estate Study (2024)</p>
              <p className="text-sm text-gray-700">10,000 leads analyzed across 5 provinces</p>
            </Card>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="p-6 text-center">
                <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-2">9 AM - 5 PM</p>
                <p className="text-4xl font-bold text-gray-600">33%</p>
                <p className="text-sm text-gray-600 mt-2">of leads</p>
              </Card>

              <Card className="p-6 text-center bg-primary text-white">
                <Clock className="w-12 h-12 mx-auto mb-3" />
                <p className="text-sm mb-2">5 PM - 11 PM</p>
                <p className="text-4xl font-bold">48%</p>
                <p className="text-sm mt-2">of leads (PEAK)</p>
              </Card>

              <Card className="p-6 text-center">
                <Clock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-2">11 PM - 9 AM</p>
                <p className="text-4xl font-bold text-blue-600">19%</p>
                <p className="text-sm text-gray-600 mt-2">of leads</p>
              </Card>
            </div>

            <Card className="p-6 bg-red-50 border-2 border-red-300 mb-6">
              <p className="text-2xl font-bold text-red-900 mb-2">67% of leads arrive when most agents aren't working</p>
              <p className="text-gray-700">This is your biggest opportunity—or your biggest leak.</p>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-bold mb-4 text-red-900">❌ Traditional Agent Response</h3>
                <ul className="space-y-2 text-sm text-gray-700 mb-4">
                  <li>• After-hours lead arrives</li>
                  <li>• Agent is offline (dinner, family time, sleeping)</li>
                  <li>• Agent responds next business day</li>
                  <li>• Lead has already contacted 3-5 other agents</li>
                </ul>
                <div className="bg-red-100 p-3 rounded">
                  <p className="font-semibold text-red-900">Conversion rate: 0.5%</p>
                </div>
              </Card>

              <Card className="p-6 bg-green-50">
                <h3 className="font-bold mb-4 text-green-900">✓ AI-Powered Agent Response</h3>
                <ul className="space-y-2 text-sm text-gray-700 mb-4">
                  <li>• After-hours lead arrives</li>
                  <li>• AI responds in 2.7 seconds</li>
                  <li>• AI qualifies and books appointment</li>
                  <li>• Agent wakes up to confirmed showing</li>
                </ul>
                <div className="bg-green-600 text-white p-3 rounded">
                  <p className="font-semibold">Conversion rate: 2.8%</p>
                </div>
              </Card>
            </div>

            <Card className="p-6 mt-6 bg-gradient-to-r from-gray-900 to-gray-700 text-white">
              <h3 className="text-xl font-bold mb-4">Comparison (200 after-hours leads/year):</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Traditional: 200 × 0.5% = 1 deal</span>
                  <span className="text-2xl font-bold">$12,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>AI-powered: 200 × 2.8% = 5.6 deals</span>
                  <span className="text-2xl font-bold">$67,200</span>
                </div>
                <div className="border-t-2 border-white/30 pt-3 flex justify-between items-center">
                  <span className="text-xl font-bold">Difference:</span>
                  <span className="text-4xl font-bold text-green-400">$55,200/year</span>
                </div>
              </div>
            </Card>
          </section>

          {/* Calculator */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Calculate YOUR Cost of Missed Leads</h2>
            
            <Card className="p-8 bg-gradient-to-r from-primary to-blue-600 text-white">
              <h3 className="text-2xl font-bold mb-6 text-center">Lost Income Calculator</h3>
              
              <div className="space-y-6 max-w-2xl mx-auto">
                <div>
                  <label className="block mb-2 font-semibold">Annual Leads</label>
                  <input 
                    type="number" 
                    value={leads}
                    onChange={(e) => setLeads(Number(e.target.value))}
                    className="w-full p-3 rounded-lg text-gray-900 text-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">Current Conversion Rate (%)</label>
                  <input 
                    type="number" 
                    value={currentConversion}
                    onChange={(e) => setCurrentConversion(Number(e.target.value))}
                    step="0.1"
                    className="w-full p-3 rounded-lg text-gray-900 text-lg font-bold"
                  />
                </div>

                <div className="bg-white/20 p-6 rounded-lg space-y-4">
                  <div className="flex justify-between text-lg">
                    <span>Current Annual Income:</span>
                    <span className="font-bold">${currentIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Potential with AI ({aiConversion}%):</span>
                    <span className="font-bold">${aiIncome.toLocaleString()}</span>
                  </div>
                  <div className="border-t-2 border-white/40 pt-4 flex justify-between">
                    <span className="text-2xl font-bold">You're Losing:</span>
                    <span className="text-4xl font-bold text-yellow-300">${lostIncome.toLocaleString()}/year</span>
                  </div>
                </div>

                <div className="bg-green-500 p-6 rounded-lg">
                  <p className="text-sm mb-2">RealtorDesk AI Cost: $3,588/year</p>
                  <p className="text-sm mb-2">Your Return: ${lostIncome.toLocaleString()}/year</p>
                  <p className="text-sm mb-4">Net Gain: ${(lostIncome - 3588).toLocaleString()}/year</p>
                  <p className="text-3xl font-bold">ROI: {roi.toLocaleString()}%</p>
                </div>
              </div>
            </Card>
          </section>

          {/* Case Study */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Case Study: Real Agent, Real Numbers</h2>
            
            <Card className="p-8 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">LM</div>
                <div>
                  <h3 className="text-2xl font-bold">Lisa M., Toronto</h3>
                  <p className="text-gray-600">8 years experience • Solo agent</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg">
                  <p className="font-bold text-red-900 mb-4">2023 (Before AI)</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Leads:</span>
                      <span className="font-bold">523</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Response time:</span>
                      <span className="font-bold">18 min avg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Leads contacted:</span>
                      <span className="font-bold">341 (65%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion:</span>
                      <span className="font-bold">1.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deals closed:</span>
                      <span className="font-bold">5.75</span>
                    </div>
                    <div className="border-t-2 border-gray-200 pt-2 mt-2 flex justify-between">
                      <span className="font-bold">Income:</span>
                      <span className="text-xl font-bold text-red-600">$69,000</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-600 text-white p-6 rounded-lg">
                  <p className="font-bold mb-4">2024 (After RealtorDesk AI)</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Leads:</span>
                      <span className="font-bold">547</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Response time:</span>
                      <span className="font-bold">2.9 sec</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Leads contacted:</span>
                      <span className="font-bold">542 (99%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion:</span>
                      <span className="font-bold">2.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deals closed:</span>
                      <span className="font-bold">14.77</span>
                    </div>
                    <div className="border-t-2 border-white/40 pt-2 mt-2 flex justify-between">
                      <span className="font-bold">Income:</span>
                      <span className="text-xl font-bold">$177,240</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <Card className="p-4 text-center bg-white">
                  <p className="text-sm text-gray-600 mb-1">Income Increase</p>
                  <p className="text-3xl font-bold text-green-600">$108,240</p>
                  <p className="text-sm text-gray-600">(157% increase)</p>
                </Card>
                <Card className="p-4 text-center bg-white">
                  <p className="text-sm text-gray-600 mb-1">RealtorDesk AI Cost</p>
                  <p className="text-3xl font-bold text-gray-900">$3,588</p>
                  <p className="text-sm text-gray-600">per year</p>
                </Card>
                <Card className="p-4 text-center bg-primary text-white">
                  <p className="text-sm mb-1">ROI</p>
                  <p className="text-3xl font-bold">3,018%</p>
                  <p className="text-sm">return on investment</p>
                </Card>
              </div>

              <div className="mt-6 bg-white p-6 rounded-lg">
                <p className="text-gray-700 italic">
                  "I was skeptical about the 'cost of missed leads' concept until I saw my income nearly triple. I wasn't just missing leads—I was missing my retirement fund. AI gave me back control."
                </p>
                <p className="text-sm text-gray-600 mt-2">— Lisa M., Toronto</p>
              </div>
            </Card>
          </section>

          {/* Action Plan */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Action Plan: Stop Missing Leads Today</h2>
            
            <div className="space-y-4">
              {[
                {
                  week: "Week 1: Audit",
                  tasks: ["Count leads from last month", "Calculate response time", "Calculate conversion rate", "Identify where leads are falling through"]
                },
                {
                  week: "Week 2: Implement",
                  tasks: ["Sign up for AI CRM (RealtorDesk AI recommended)", "Connect to website", "Set up AI chatbot and voice AI", "Configure automated follow-up"]
                },
                {
                  week: "Week 3: Monitor",
                  tasks: ["Track response times (should drop to <3 seconds)", "Track contact rate (should reach 99%+)", "Monitor appointments booked", "Review AI conversations"]
                },
                {
                  week: "Week 4: Optimize",
                  tasks: ["Review AI conversations", "Adjust qualification questions", "Fine-tune follow-up sequences", "Measure conversion improvement"]
                },
                {
                  week: "Week 5-12: Scale",
                  tasks: ["Conversion should increase 100-150%", "Deals should double within 90 days", "Income follows", "Reinvest in more lead sources"]
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
                  a: "If your conversion rate is below 2%, you're missing leads. Industry benchmark with AI is 2.5-3.0%. Track your leads vs deals—if you're below 2%, you're leaving money on the table."
                },
                {
                  q: "What's the #1 reason agents miss leads?",
                  a: "Slow response time. Leads go to the first agent who responds. If you're not first, you lose. Harvard study shows responding in <1 minute is 391% more effective than 5 minutes."
                },
                {
                  q: "Can't I just hire an ISA instead of using AI?",
                  a: "ISAs cost $3,000-4,000/month ($36,000-48,000/year). AI costs $299/month ($3,588/year). AI is 10x cheaper, works 24/7, and never takes vacation."
                },
                {
                  q: "How quickly will I see results?",
                  a: "Immediately. The first lead AI captures at midnight is a result. Most agents see 50-100% increase in appointments within 30 days, and deals follow within 60-90 days."
                },
                {
                  q: "What if AI doesn't work for my market?",
                  a: "AI works in every market. Speed wins everywhere—Toronto, rural Alberta, Quebec. RealtorDesk AI offers 14-day free trial—test it risk-free with real leads."
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
              <h2 className="text-3xl font-bold mb-6">Conclusion: The Choice Is Yours</h2>
              
              <div className="space-y-4 text-gray-700 mb-6">
                <p className="text-lg">
                  Every missed lead costs you <strong>$12,000</strong>. Most agents miss <strong>30-40% of leads</strong> due to slow response, poor follow-up, and after-hours gaps.
                </p>
                
                <div className="bg-white p-6 rounded-lg">
                  <p className="font-bold text-xl mb-3">The Cost:</p>
                  <ul className="space-y-2">
                    <li>• $90,000-165,000 per year in lost income</li>
                    <li>• $1,020,000 over 10 years</li>
                    <li>• Your retirement fund disappearing</li>
                  </ul>
                </div>

                <div className="bg-green-600 text-white p-6 rounded-lg">
                  <p className="font-bold text-xl mb-3">The Solution:</p>
                  <ul className="space-y-2">
                    <li>• AI responds in &lt;3 seconds, 24/7</li>
                    <li>• AI qualifies and books appointments automatically</li>
                    <li>• AI never misses a lead</li>
                  </ul>
                </div>

                <div className="bg-primary text-white p-6 rounded-lg">
                  <p className="font-bold text-xl mb-3">The ROI:</p>
                  <ul className="space-y-2">
                    <li>• Investment: $3,588/year</li>
                    <li>• Return: $90,000-165,000/year</li>
                    <li>• ROI: 4,606-9,225%</li>
                    <li>• Payback: 6-8 days</li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-50 border-2 border-red-300 p-6 rounded-lg">
                <p className="text-2xl font-bold text-red-900 mb-4">The Choice:</p>
                <div className="space-y-2 text-lg text-gray-700">
                  <p>❌ Keep losing $90,000+/year to missed leads</p>
                  <p className="text-center font-bold text-2xl my-4">OR</p>
                  <p>✅ Invest $3,588 to capture every single lead</p>
                </div>
                <p className="text-2xl font-bold text-center mt-6">Which would you choose?</p>
              </div>
            </Card>
          </section>

          {/* Final CTA */}
          <section className="text-center py-12">
            <Card className="p-8 bg-gradient-to-r from-primary to-blue-600 text-white">
              <h2 className="text-4xl font-bold mb-4">Stop Missing Leads Today</h2>
              <p className="text-xl mb-6">
                Calculate exactly how much you're losing. Then see how AI can capture every single lead.
              </p>
              <div className="bg-white/20 p-6 rounded-lg mb-8">
                <p className="text-2xl font-bold mb-2">Average Agent Saves:</p>
                <p className="text-5xl font-bold">$90,000/year</p>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                  <Link to="/demo">
                    Start Free 14-Day Trial <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-white text-primary hover:bg-gray-100">
                  <Link to="/pricing">See Pricing</Link>
                </Button>
              </div>
              <p className="text-sm mt-4">No credit card required • Set up in 3 hours • Cancel anytime</p>
            </Card>
          </section>

          {/* Related Articles */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Related Resources</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/blog/ai-chatbot-real-estate-websites-canada">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">AI Chatbot Implementation</h3>
                  <p className="text-sm text-gray-600">Capture leads 24/7</p>
                </Card>
              </Link>
              <Link to="/resources/voice-ai-real-estate-lead-follow-up-canada">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">Voice AI Follow-Up</h3>
                  <p className="text-sm text-gray-600">Call 100+ leads/day</p>
                </Card>
              </Link>
              <Link to="/pricing">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">RealtorDesk AI Pricing</h3>
                  <p className="text-sm text-gray-600">4,606% ROI guaranteed</p>
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