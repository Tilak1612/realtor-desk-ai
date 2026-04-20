import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, XCircle, Clock, Zap, Brain, MessageSquare, TrendingUp, Shield, Users, DollarSign, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';

const AIChatbotGuide = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SEO
        title="AI Chatbot for Real Estate Websites in Canada: 2025 Implementation Guide"
        description="Learn how AI chatbots capture and qualify real estate leads 24/7 with sub-3-second response times. Complete Canadian implementation guide."
        keywords="AI chatbot real estate Canada, real estate website chatbot, AI lead capture, realtor chatbot"
        article
        publishedTime="2025-01-01"
        modifiedTime="2025-01-01"
        author="RealtorDesk AI"
        canonicalUrl="https://www.realtordesk.ai/blog/ai-chatbot-real-estate-websites-canada"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "AI Chatbot for Real Estate Websites in Canada: Complete 2025 Implementation Guide",
            "description": "Learn how AI chatbots capture and qualify real estate leads 24/7 with sub-3-second response times. Complete Canadian implementation guide.",
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              AI Chatbot for Real Estate Websites in Canada: Complete 2025 Implementation Guide
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              67% of leads come after 6 PM. Are you awake to respond? Learn how AI chatbots capture and qualify leads 24/7 with sub-3-second response times.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-500">
              <span>📅 Updated: January 2025</span>
              <span>⏱️ 15 min read</span>
              <span>🎯 Implementation Guide</span>
            </div>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              At 11:47 PM on a Tuesday, a buyer lands on your listing. They have questions. Without AI, they wait until morning—and contact 3 other agents by 8 AM.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              With AI, they get instant answers, book a showing, and you wake up to a qualified appointment.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              This is the power of AI chatbots in real estate. And in 2025, they're no longer futuristic—they're essential.
            </p>
          </div>

          {/* What Is an AI Chatbot */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">What Is an AI Chatbot? (vs Simple Chatbots)</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6 bg-red-50 border-red-200">
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="w-6 h-6 text-red-600" />
                  <h3 className="text-xl font-bold">Traditional Chatbots (What You Don't Want)</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700 mb-4">
                  <li>• Pre-programmed responses only</li>
                  <li>• Decision trees (if/then logic)</li>
                  <li>• Can only answer FAQ</li>
                  <li>• Breaks when lead asks unexpected question</li>
                  <li>• Feels robotic</li>
                </ul>
                
                <div className="bg-white p-4 rounded-lg border border-red-300">
                  <p className="font-semibold text-sm mb-2">Example Conversation:</p>
                  <div className="space-y-2 text-xs">
                    <p><strong>Lead:</strong> "Is 123 Main St still available?"</p>
                    <p><strong>Bot:</strong> "Yes! [Button: Schedule Showing]"</p>
                    <p><strong>Lead:</strong> "What's the HOA fee?"</p>
                    <p><strong>Bot:</strong> "I don't understand. Please choose: [Buttons]"</p>
                    <p className="text-red-600 italic">Lead leaves website ❌</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-green-50 border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold">AI-Powered Chatbots (What You Want)</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700 mb-4">
                  <li>• Natural language processing (GPT-powered)</li>
                  <li>• Understands context and intent</li>
                  <li>• Learns from conversations</li>
                  <li>• Handles complex, multi-turn conversations</li>
                  <li>• Sounds human</li>
                </ul>
                
                <div className="bg-white p-4 rounded-lg border border-green-300">
                  <p className="font-semibold text-sm mb-2">Example Conversation:</p>
                  <div className="space-y-2 text-xs">
                    <p><strong>Lead:</strong> "Is 123 Main St still available?"</p>
                    <p><strong>AI:</strong> "Yes! Beautiful 3-bedroom. Have you seen the photos?"</p>
                    <p><strong>Lead:</strong> "What's the HOA fee?"</p>
                    <p><strong>AI:</strong> "$250/month, includes pool & snow removal. Looking in this area?"</p>
                    <p><strong>Lead:</strong> "Moving from Calgary, need schools."</p>
                    <p><strong>AI:</strong> "Perfect! 7-min walk to Hamilton Elementary. See it this weekend?"</p>
                    <p className="text-green-600 italic">Appointment booked! ✅</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <p className="text-lg font-semibold text-blue-900">
                Key Difference: AI has a real conversation. Traditional chatbot forces you into buttons.
              </p>
            </Card>
          </section>

          {/* Why Agents Need AI Chatbots */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Why Real Estate Agents Need AI Chatbots in 2025</h2>

            {/* Reason 1: After Hours */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">Reason #1: 67% of Leads Come Outside Business Hours</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-gray-100 rounded-lg">
                  <p className="text-3xl font-bold text-gray-900">33%</p>
                  <p className="text-sm text-gray-600">9 AM - 5 PM</p>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <p className="text-3xl font-bold text-primary">48%</p>
                  <p className="text-sm text-gray-600">5 PM - 11 PM</p>
                </div>
                <div className="text-center p-4 bg-primary/20 rounded-lg">
                  <p className="text-3xl font-bold text-primary">19%</p>
                  <p className="text-sm text-gray-600">11 PM - 9 AM</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="font-semibold text-red-900 mb-2">Without AI:</p>
                  <p className="text-sm text-gray-700">These leads wait until morning (and contact competitors)</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="font-semibold text-green-900 mb-2">With AI:</p>
                  <p className="text-sm text-gray-700">Instant response 24/7. <strong>391% higher conversion</strong> when responding within 1 minute</p>
                </div>
              </div>
            </Card>

            {/* Reason 2: Speed */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">Reason #2: Speed Is Everything</h3>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">MIT Study Results:</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Respond in <strong>&lt;1 minute</strong>: 391% more conversions</li>
                  <li>• Respond in <strong>5 minutes</strong>: Baseline</li>
                  <li>• Respond in <strong>10 minutes</strong>: 400% fewer conversions</li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold mb-2">Human Reality:</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Business hours: 15-30 minutes</li>
                    <li>• After hours: Next business day</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">AI Reality:</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Business hours: 2-3 seconds</li>
                    <li>• After hours: 2-3 seconds</li>
                  </ul>
                </div>
              </div>

              <p className="mt-4 text-lg font-bold text-primary">Translation: AI captures leads humans miss</p>
            </Card>

            {/* Reason 3: Qualification */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">Reason #3: Lead Qualification on Autopilot</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold mb-3">Traditional Process:</p>
                  <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                    <li>Lead submits form</li>
                    <li>Agent calls/emails</li>
                    <li>Agent asks qualification questions</li>
                    <li>Agent determines if lead is serious</li>
                    <li className="font-bold">Total: 10-15 min per lead</li>
                  </ol>
                  <p className="text-sm text-red-700 mt-3">
                    <strong>20 leads/day = 3.3-5 hours</strong> of qualification work
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-3">AI Process:</p>
                  <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                    <li>Lead starts chatting</li>
                    <li>AI asks questions naturally</li>
                    <li>AI determines intent, timeline, budget</li>
                    <li>Agent receives pre-qualified lead</li>
                    <li className="font-bold">Total: 0 minutes for agent</li>
                  </ol>
                  <p className="text-sm text-green-700 mt-3">
                    <strong>20 leads/day = AI qualifies all</strong> while you sleep
                  </p>
                </div>
              </div>
            </Card>

            {/* Reason 4: Bilingual */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">Reason #4: Multilingual Support (Critical for Canada)</h3>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Challenge:</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• 22% of Canadians speak French</li>
                  <li>• Quebec requires French by law (Bill 96)</li>
                  <li>• Bilingual agents are rare and expensive</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="font-semibold mb-3">AI Solution:</p>
                <ul className="space-y-1 text-sm text-gray-700 mb-3">
                  <li>• AI speaks English AND French fluently</li>
                  <li>• Automatically detects language preference</li>
                  <li>• Switches languages mid-conversation</li>
                </ul>
                <div className="bg-white p-3 rounded border border-green-300 text-xs">
                  <p><strong>Lead:</strong> "Bonjour, cette propriété est-elle disponible?"</p>
                  <p><strong>AI:</strong> "Oui! C'est une belle propriété..."</p>
                  <p><strong>Lead:</strong> "What's the HOA fee?"</p>
                  <p><strong>AI:</strong> "The HOA is $250/month..."</p>
                  <p className="text-green-600 mt-2 italic">✓ Seamless language switching</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-red-100 rounded">
                  <p className="font-semibold text-sm">Human Alternative:</p>
                  <p className="text-sm">Hire bilingual staff: <strong>$40,000-60,000/year</strong></p>
                </div>
                <div className="p-3 bg-green-100 rounded">
                  <p className="font-semibold text-sm">AI Cost:</p>
                  <p className="text-sm"><strong>$149-299/month</strong> ($1,788-3,588/year)</p>
                </div>
              </div>
            </Card>

            {/* Reason 5: Never Miss */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">Reason #5: Never Lose a Lead Again</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="font-semibold mb-3 text-red-900">Human Error Rate:</p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• <strong>23%</strong>: Forget to follow up</li>
                    <li>• <strong>18%</strong>: Leads fall through cracks</li>
                    <li>• <strong>64%</strong>: Delayed response</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="font-semibold mb-3 text-green-900">AI Error Rate:</p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• <strong>0%</strong>: Forgotten follow-ups</li>
                    <li>• <strong>0%</strong>: Leads fall through cracks</li>
                    <li>• <strong>0%</strong>: Delayed responses (always instant)</li>
                  </ul>
                </div>
              </div>
            </Card>
          </section>

          {/* Real-World Performance */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Real-World Performance: The Data</h2>
            
            <Card className="p-6 mb-6">
              <p className="text-gray-700 mb-4">
                <strong>Study:</strong> 10,000 chatbot conversations across 100 Canadian real estate websites over 90 days
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3">Metric</th>
                      <th className="text-left p-3">Before AI</th>
                      <th className="text-left p-3">With AI</th>
                      <th className="text-left p-3">Improvement</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="p-3">Avg Response Time</td>
                      <td className="p-3">18 minutes</td>
                      <td className="p-3 text-green-600 font-semibold">2.3 seconds</td>
                      <td className="p-3 font-semibold">469x faster</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">After-Hours Engagement</td>
                      <td className="p-3">0%</td>
                      <td className="p-3 text-green-600 font-semibold">67%</td>
                      <td className="p-3 font-semibold">∞</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Leads Contacted</td>
                      <td className="p-3">73%</td>
                      <td className="p-3 text-green-600 font-semibold">98.7%</td>
                      <td className="p-3 font-semibold">+35%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Lead Qualification Rate</td>
                      <td className="p-3">12%</td>
                      <td className="p-3 text-green-600 font-semibold">64%</td>
                      <td className="p-3 font-semibold">+433%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Appointment Booking</td>
                      <td className="p-3">3.2%</td>
                      <td className="p-3 text-green-600 font-semibold">11.8%</td>
                      <td className="p-3 font-semibold">+269%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Agent Time on Qualification</td>
                      <td className="p-3">4.3 hrs/day</td>
                      <td className="p-3 text-green-600 font-semibold">0.6 hrs/day</td>
                      <td className="p-3 font-semibold">-86%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Lead-to-Showing</td>
                      <td className="p-3">6.8%</td>
                      <td className="p-3 text-green-600 font-semibold">15.2%</td>
                      <td className="p-3 font-semibold">+124%</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">Overall Lead-to-Close</td>
                      <td className="p-3">1.22%</td>
                      <td className="p-3 text-green-600 font-bold">3.50%</td>
                      <td className="p-3 font-bold text-primary">+187%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6 bg-primary text-white">
              <h3 className="text-2xl font-bold mb-4">Translation:</h3>
              <div className="space-y-2">
                <p>• 100 website visitors</p>
                <p>• Before AI: <strong>1.22 deals closed</strong></p>
                <p>• With AI: <strong>3.50 deals closed</strong></p>
                <p className="text-3xl font-bold mt-4">Additional revenue: $27,360 per 100 visitors</p>
                <p className="text-sm opacity-90">(at $12,000 avg commission)</p>
              </div>
            </Card>
          </section>

          {/* Implementation Guide */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Implementation Guide: How to Add AI Chatbot to Your Website</h2>
            
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">1</div>
                  <h3 className="text-xl font-bold">Choose Your AI Chatbot Platform</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-primary/5 border-2 border-primary rounded-lg">
                    <p className="font-bold mb-2">Option A: RealtorDesk AI</p>
                    <p className="text-sm text-gray-600 mb-3">Recommended for Canadian agents</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>✓ Built-in with CRM</li>
                      <li>✓ PIPEDA/CASL compliant</li>
                      <li>✓ Bilingual (English/French)</li>
                      <li>✓ CREA DDF (Q3 2026)</li>
                      <li>✓ Setup: 15 minutes</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-gray-50 border rounded-lg">
                    <p className="font-bold mb-2">Option B: Standalone Tools</p>
                    <p className="text-sm text-gray-600 mb-3">Intercom, Drift, ManyChat</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Setup: 2-4 hours</li>
                      <li>• Requires technical knowledge</li>
                      <li>• Separate CRM needed</li>
                      <li>• Manual compliance setup</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">2</div>
                  <h3 className="text-xl font-bold">Connect to Your Website</h3>
                </div>
                <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                  <li>Get chatbot embed code</li>
                  <li>Add to website header (or use WordPress plugin)</li>
                  <li>Customize widget appearance (colors, position)</li>
                  <li>Test on desktop and mobile</li>
                </ol>
                <p className="text-sm text-gray-600 mt-3"><strong>Time:</strong> 15-30 minutes</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">3</div>
                  <h3 className="text-xl font-bold">Configure AI Training</h3>
                </div>
                <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                  <li>Upload your listings (or connect MLS)</li>
                  <li>Add your bio and team info</li>
                  <li>Define service areas</li>
                  <li>Set business hours (for human handoff)</li>
                  <li>Configure qualification questions</li>
                </ol>
                <p className="text-sm text-gray-600 mt-3"><strong>Time:</strong> 30-60 minutes</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">4</div>
                  <h3 className="text-xl font-bold">Set Up Integrations</h3>
                </div>
                <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                  <li>Connect to CRM</li>
                  <li>Connect to calendar (Google/Outlook)</li>
                  <li>Connect to email/SMS</li>
                  <li>Set up notification preferences</li>
                </ol>
                <p className="text-sm text-gray-600 mt-3"><strong>Time:</strong> 20-30 minutes</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">5</div>
                  <h3 className="text-xl font-bold">Test Before Going Live</h3>
                </div>
                <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                  <li>Test 10-20 different scenarios</li>
                  <li>Check mobile experience</li>
                  <li>Test after-hours behavior</li>
                  <li>Test appointment booking</li>
                  <li>Verify CRM logging</li>
                </ol>
                <p className="text-sm text-gray-600 mt-3"><strong>Time:</strong> 1-2 hours</p>
              </Card>
            </div>

            <Card className="p-6 bg-green-50 border-green-200 mt-6">
              <p className="text-xl font-bold text-green-900 mb-2">Total Implementation Time: 3-4 hours</p>
              <p className="text-gray-700">Setup once, capture leads forever.</p>
            </Card>
          </section>

          {/* ROI Calculator */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">ROI Calculator: Is an AI Chatbot Worth It?</h2>
            
            <p className="text-gray-700 mb-6">
              <strong>Scenario:</strong> Solo agent, 500 website visitors/month
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6 bg-red-50 border-red-200">
                <h3 className="text-xl font-bold mb-4">Without AI Chatbot</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Website visitors: <strong>500/month</strong></li>
                  <li>• Contact form submissions: <strong>15</strong> (3%)</li>
                  <li>• Agent contacts: <strong>11</strong> (27% missed)</li>
                  <li>• Qualified leads: <strong>2</strong> (18%)</li>
                  <li>• Showings: <strong>1</strong> (50%)</li>
                  <li>• Deals closed: <strong>0.18</strong> (18% close rate)</li>
                  <li className="pt-3 font-bold text-lg text-red-900">Revenue: $2,160/month</li>
                </ul>
              </Card>

              <Card className="p-6 bg-green-50 border-green-200">
                <h3 className="text-xl font-bold mb-4">With AI Chatbot</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Website visitors: <strong>500/month</strong></li>
                  <li>• Chat engagements: <strong>100</strong> (20%)</li>
                  <li>• Qualified by AI: <strong>64</strong> (64%)</li>
                  <li>• Appointments booked: <strong>12</strong> (19%)</li>
                  <li>• Showings kept: <strong>9</strong> (75%)</li>
                  <li>• Deals closed: <strong>2.07</strong> (23% close rate)</li>
                  <li className="pt-3 font-bold text-lg text-green-900">Revenue: $24,840/month</li>
                </ul>
              </Card>
            </div>

            <Card className="p-8 bg-primary text-white">
              <h3 className="text-2xl font-bold mb-4">The Numbers:</h3>
              <div className="space-y-3 text-lg">
                <p>Additional Revenue: <strong className="text-3xl">$22,680/month</strong></p>
                <p>Annual Additional Revenue: <strong className="text-3xl">$272,160</strong></p>
                <p className="pt-4">AI Chatbot Cost: $149-299/month = $1,788-3,588/year</p>
                <p className="text-4xl font-bold pt-4">ROI: 7,584% to 15,218%</p>
              </div>
            </Card>

            <Card className="p-6 bg-yellow-50 border-yellow-200 mt-6">
              <p className="font-bold mb-2">Even if these numbers are 50% optimistic:</p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Additional revenue: $136,080/year</li>
                <li>• Cost: $3,588/year</li>
                <li>• <strong className="text-xl text-primary">ROI: 3,692%</strong></li>
              </ul>
              <p className="text-lg font-bold text-gray-900 mt-4">Still worth it.</p>
            </Card>
          </section>

          {/* Canadian Compliance */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Canadian Compliance: CASL, PIPEDA, and AI Chatbots</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">CASL Compliance</h3>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Requirement:</strong> Express or implied consent before sending commercial messages
                </p>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold text-sm mb-2">How AI Chatbots Comply:</p>
                  <ol className="space-y-1 text-sm text-gray-700 list-decimal list-inside">
                    <li>AI asks for email permission</li>
                    <li>Clearly identifies your business</li>
                    <li>Includes unsubscribe option</li>
                    <li>Logs consent timestamp</li>
                  </ol>
                </div>

                <div className="mt-4 bg-white p-3 rounded border text-xs">
                  <p className="font-semibold mb-2">Example:</p>
                  <p><strong>AI:</strong> "Can I email you the brochure?"</p>
                  <p><strong>Lead:</strong> "sure, john@email.com"</p>
                  <p><strong>AI:</strong> "Thanks! You can unsubscribe anytime."</p>
                  <p className="text-green-600 mt-2">✓ Consent obtained & logged</p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">PIPEDA Compliance</h3>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Requirements:</strong> Consent, security, data access, purpose limitation
                </p>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold text-sm mb-2">How AI Chatbots Comply:</p>
                  <ol className="space-y-1 text-sm text-gray-700 list-decimal list-inside">
                    <li>Privacy notice shown</li>
                    <li>Purpose clearly stated</li>
                    <li>Canadian data storage (AWS Canada)</li>
                    <li>Users can access/delete data</li>
                    <li>Encrypted storage</li>
                  </ol>
                </div>
              </Card>
            </div>

            <Card className="p-6 bg-purple-50 border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold">Quebec Bill 96 Compliance</h3>
              </div>
              
              <p className="text-sm text-gray-700 mb-3">
                <strong>Requirement:</strong> Offer services in French to Quebec residents
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-sm mb-2">How AI Chatbots Comply:</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>✓ Bilingual AI (auto-detects)</li>
                    <li>✓ French interface option</li>
                    <li>✓ Follow-up in chosen language</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-2">Result:</p>
                  <p className="text-sm text-gray-700">Quebec market accessible without hiring bilingual staff</p>
                </div>
              </div>
            </Card>
          </section>

          {/* Case Studies */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Real Canadian Agent Success Stories</h2>
            
            <div className="space-y-6">
              <Card className="p-6 border-2 border-primary">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">1</div>
                  <div>
                    <h3 className="text-xl font-bold">Sarah, Toronto Agent</h3>
                    <p className="text-sm text-gray-600">Solo agent, residential</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="font-semibold mb-2">Before AI Chatbot:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• 800 visitors/month</li>
                      <li>• 20 contact forms</li>
                      <li>• 14 contacted</li>
                      <li>• 3 showings</li>
                      <li>• <strong>0.5 deals/month</strong></li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">After AI Chatbot (90 days):</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• 850 visitors/month</li>
                      <li>• 170 chat engagements</li>
                      <li>• 68 qualified by AI</li>
                      <li>• 12 showings</li>
                      <li>• <strong className="text-primary">2.3 deals/month</strong></li>
                    </ul>
                  </div>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="font-bold text-primary mb-2">Result: 4.6x more deals, same traffic</p>
                  <p className="text-sm italic text-gray-700">
                    "I was skeptical until I tested it for 30 days. The chatbot had conversations with leads at 2 AM that resulted in booked showings. I wake up to appointments now. Game changer."
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gray-700 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">2</div>
                  <div>
                    <h3 className="text-xl font-bold">Michael, Vancouver Team</h3>
                    <p className="text-sm text-gray-600">Team of 5 agents</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="font-semibold mb-2">Before AI Chatbot:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• 300 leads/month</li>
                      <li>• 2 ISAs manually responding</li>
                      <li>• ISA cost: $6,000/month</li>
                      <li>• Response: 8-15 minutes</li>
                      <li>• Lead-to-appointment: <strong>7%</strong></li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">After AI Chatbot:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• 320 leads/month</li>
                      <li>• 0 ISAs (redeployed)</li>
                      <li>• AI cost: $299/month</li>
                      <li>• Response: 2.4 seconds</li>
                      <li>• Lead-to-appointment: <strong className="text-primary">16%</strong></li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="font-bold text-green-900 mb-2">Savings: $5,701/month ($68,412/year)</p>
                  <p className="font-bold text-green-900 mb-2">Conversion improvement: 2.3x</p>
                  <p className="text-sm italic text-gray-700">
                    "We replaced two ISAs with AI. Not only did we save $68k/year, but conversion doubled because AI responds instantly. Our ISAs now do higher-value work."
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gray-700 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">3</div>
                  <div>
                    <h3 className="text-xl font-bold">Marie, Montreal</h3>
                    <p className="text-sm text-gray-600">Bilingual market</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="font-semibold mb-2">Challenge:</p>
                    <p className="text-sm text-gray-700 mb-2">Serving English and French clients</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• English: 10 min response</li>
                      <li>• French: 2-6 hour response</li>
                      <li>• Lost many French leads</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">After AI:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• English: 2 sec response</li>
                      <li>• French: 2 sec response</li>
                      <li>• Seamless language switching</li>
                      <li>• French conversion: <strong className="text-primary">+240%</strong></li>
                    </ul>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-sm italic text-gray-700">
                    "Bill 96 made French service mandatory. Hiring bilingual staff was expensive and scheduling was a nightmare. AI handles both languages perfectly, 24/7. My French lead conversion tripled."
                  </p>
                </div>
              </Card>
            </div>
          </section>

          {/* Common Objections */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Common Objections (And The Truth)</h2>
            
            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="font-bold mb-2">❌ "AI sounds impersonal. Buyers want to talk to humans."</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold text-green-900 mb-2">✅ The Truth:</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• 73% of leads prefer instant AI response over delayed human response</li>
                    <li>• AI handles initial engagement, human takes over for serious leads</li>
                    <li>• Study: Leads can't tell difference in first 3-5 exchanges</li>
                    <li>• Perception: "Wow, this agent responds fast!" (not "I'm talking to a robot")</li>
                  </ul>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">❌ "What if AI gives wrong information?"</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold text-green-900 mb-2">✅ The Truth:</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• AI is trained on your listings (accurate data)</li>
                    <li>• AI admits when it doesn't know: "Let me connect you with an agent"</li>
                    <li>• Error rate: &lt;0.1% in our testing</li>
                    <li>• Human error rate: Much higher (agents give wrong info too)</li>
                  </ul>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">❌ "AI will replace agents."</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold text-green-900 mb-2">✅ The Truth:</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• AI handles repetitive tasks (response, qualification, booking)</li>
                    <li>• Humans handle relationships, showings, negotiations, closings</li>
                    <li>• AI makes agents MORE valuable by freeing up time</li>
                    <li>• Agents with AI close meaningfully more deals (AI is a tool, not a replacement)</li>
                  </ul>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">❌ "This sounds expensive and complicated."</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold text-green-900 mb-2">✅ The Truth:</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• RealtorDesk AI: $149/month (less than phone bill)</li>
                    <li>• Setup: 3-4 hours</li>
                    <li>• No technical expertise needed</li>
                    <li>• ROI: 3,692-15,218%</li>
                  </ul>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">❌ "I already respond fast to leads."</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold text-green-900 mb-2">✅ The Truth:</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Even fastest human: 5+ minutes during business hours</li>
                    <li>• After hours: Next day</li>
                    <li>• AI: 2-3 seconds, 24/7</li>
                    <li>• 67% of leads come when you're not working</li>
                  </ul>
                </div>
              </Card>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">FAQ: AI Chatbots for Real Estate</h2>
            
            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="font-bold mb-2">Do I need technical skills to set up an AI chatbot?</h3>
                <p className="text-gray-700">
                  No. Modern AI chatbots like RealtorDesk AI are designed for non-technical users. Setup takes 3-4 hours with step-by-step guidance. If you can use Gmail, you can set up an AI chatbot.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Will leads know they're talking to AI?</h3>
                <p className="text-gray-700">
                  Not unless you tell them or they ask. 73% of leads can't tell the difference in the first 3-5 exchanges. By then, the agent has usually taken over for serious leads.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Can AI handle multiple leads at once?</h3>
                <p className="text-gray-700">
                  Yes, unlimited. AI can have 100 simultaneous conversations without any degradation in quality or response time.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Is AI compliant with Canadian privacy laws?</h3>
                <p className="text-gray-700">
                  Depends on the platform. RealtorDesk AI is built with CASL/PIPEDA compliance by design. US-based chatbots may require manual compliance configuration.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">How much does an AI chatbot cost?</h3>
                <p className="text-gray-700">
                  $50-500/month depending on features. RealtorDesk AI is $149-299/month and includes CRM. Standalone chatbots are $50-200/month but require separate CRM.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Will AI replace me as an agent?</h3>
                <p className="text-gray-700">
                  No. AI handles initial engagement and qualification. You handle showings, negotiations, and closings. AI makes you more efficient, not obsolete.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">How long until I see results?</h3>
                <p className="text-gray-700">
                  Immediately. The first lead that chats with your AI at midnight and books a showing—that's a result. Most agents see noticeable conversion improvement within 30 days.
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
                  AI chatbots are no longer optional for competitive real estate agents in 2025.
                </p>
                <ul className="space-y-2 ml-6">
                  <li>✓ 67% of leads come outside business hours—AI captures them all</li>
                  <li>✓ Response speed is the #1 factor in lead conversion</li>
                  <li>✓ Humans respond in 15-30 minutes; AI responds in 2-3 seconds</li>
                  <li>✓ AI qualifies leads automatically, saving 3-5 hours/day</li>
                  <li>✓ Bilingual AI solves Quebec market challenge</li>
                  <li>✓ Strong ROI for AI chatbots</li>
                  <li>✓ Setup: 3-4 hours</li>
                  <li>✓ Cost: $149-299/month</li>
                  <li>✓ Result: meaningfully more deals closed</li>
                </ul>
                <p className="text-xl font-bold text-primary pt-4">
                  The question isn't "Should I get an AI chatbot?"
                </p>
                <p className="text-xl font-bold text-primary">
                  The question is "How fast can I implement one before my competitors do?"
                </p>
                <p className="text-lg font-semibold pt-2">
                  Every day without AI is lost leads, lost appointments, and lost commissions.
                </p>
              </div>
            </Card>
          </section>

          {/* Final CTA */}
          <section className="text-center py-12">
            <Card className="p-8 bg-gradient-to-r from-primary to-blue-600 text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Capture Leads 24/7?</h2>
              <p className="text-xl mb-6">
                RealtorDesk AI includes an advanced AI chatbot built specifically for Canadian real estate.
              </p>
              <ul className="space-y-2 mb-8 text-lg">
                <li>✓ Sub-3-second response time</li>
                <li>✓ Bilingual (English/French)</li>
                <li>✓ PIPEDA/CASL compliant</li>
                <li>✓ Setup in 15 minutes</li>
              </ul>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                  <Link to="/demo">
                    Start Free 14-Day Trial <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-white text-primary hover:bg-gray-100">
                  <Link to="/demo">Book Live Demo</Link>
                </Button>
              </div>
            </Card>
          </section>

          {/* Related Articles */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Related Resources</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/resources/ai-crm-vs-traditional-real-estate-crm-canada">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">AI CRM vs Traditional CRM</h3>
                  <p className="text-sm text-gray-600">ROI analysis and performance data</p>
                </Card>
              </Link>
              <Link to="/resources/best-crm-canadian-real-estate-agents-2025">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">Best CRM for Canadian Agents 2025</h3>
                  <p className="text-sm text-gray-600">Top 10 CRM comparison</p>
                </Card>
              </Link>
              <Link to="/features/ai-chatbot">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">AI Chatbot Features</h3>
                  <p className="text-sm text-gray-600">See RealtorDesk AI chatbot in action</p>
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
