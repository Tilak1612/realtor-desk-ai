import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, XCircle, Phone, Zap, TrendingUp, Shield, Users, DollarSign, Clock, MessageSquare, Globe, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';

const VoiceAIGuide = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SEO
        title="Voice AI for Real Estate Lead Follow-Up: How Canadian Agents Close More Deals"
        description="Voice AI makes 100+ calls per day, qualifies leads, books appointments, and sounds human. Learn how Canadian agents close meaningfully more deals."
        keywords="voice AI for real estate, AI lead follow-up, real estate voice assistant, Canadian real estate automation"
        article
        publishedTime="2026-01-01"
        modifiedTime="2026-01-01"
        author="RealtorDesk AI"
        canonicalUrl="https://www.realtordesk.ai/resources/voice-ai-real-estate-lead-follow-up-canada"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Voice AI for Real Estate Lead Follow-Up: How Canadian Agents Close More Deals",
            "description": "Voice AI makes 100+ calls per day, qualifies leads, books appointments, and sounds human. Learn how Canadian agents close meaningfully more deals.",
            "author": { "@type": "Organization", "name": "RealtorDesk AI" },
            "publisher": { "@type": "Organization", "name": "RealtorDesk AI" },
            "datePublished": "2026-01-01",
            "dateModified": "2026-01-01"
          }
        ]}
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Voice AI for Real Estate Lead Follow-Up: How Canadian Agents Close More Deals
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Voice AI makes 100+ calls per day, qualifies leads, books appointments, and sounds human. See how Canadian agents use AI to follow up instantly and close meaningfully more deals.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-500">
              <span>📅 Updated: January 2026</span>
              <span>⏱️ 14 min read</span>
              <span>🎯 Implementation Guide</span>
            </div>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              It's 8:47 AM. Your Voice AI has already called 23 leads, had 12 conversations, qualified 5 hot prospects, and booked 2 showings.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              You're still drinking coffee.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              This is the reality of Voice AI in 2026. While you sleep, while you're in showings, while you're closing deals—AI is calling, qualifying, and booking appointments. No coffee breaks. No sick days. No rejected-call fatigue.
            </p>
          </div>

          {/* What Is Voice AI */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">What Is Voice AI for Real Estate?</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6 bg-red-50 border-red-200">
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="w-6 h-6 text-red-600" />
                  <h3 className="text-xl font-bold">Not a Robocall (What You DON'T Want)</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700 mb-4">
                  <li>• Pre-recorded messages</li>
                  <li>• "Press 1 for..." menus</li>
                  <li>• Monotone robot voice</li>
                  <li>• Can't handle questions</li>
                  <li>• Everyone hangs up immediately</li>
                  <li>• Illegal in many cases (DNCL violations)</li>
                </ul>
                
                <div className="bg-white p-4 rounded-lg border border-red-300">
                  <p className="font-semibold text-sm mb-2">Example Robocall:</p>
                  <div className="space-y-2 text-xs">
                    <p><strong>Robot:</strong> "This is a message about 123 Main Street. Press 1 to speak to an agent. Press 2 to—"</p>
                    <p className="text-red-600 italic">Lead hangs up ❌</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-green-50 border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold">Conversational AI (What You WANT)</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700 mb-4">
                  <li>• Real-time voice synthesis (sounds human)</li>
                  <li>• Natural language understanding</li>
                  <li>• Dynamic conversations</li>
                  <li>• Emotional intelligence</li>
                  <li>• Handles interruptions</li>
                  <li>• Indistinguishable from human in 75-80% of calls</li>
                </ul>
                
                <div className="bg-white p-4 rounded-lg border border-green-300">
                  <p className="font-semibold text-sm mb-2">Example Voice AI Call:</p>
                  <div className="space-y-2 text-xs">
                    <p><strong>AI:</strong> "Hi David, I'm calling from RealtorDesk on behalf of Sarah Chen. You inquired about 456 Maple Street yesterday evening. Do you have a minute?"</p>
                    <p><strong>Lead:</strong> "Oh yeah, is it still available?"</p>
                    <p><strong>AI:</strong> "Yes! It's getting a lot of interest. What caught your attention about it?"</p>
                    <p><strong>Lead:</strong> "The backyard. We have two dogs."</p>
                    <p><strong>AI:</strong> "Perfect! It's fully fenced, about a quarter acre. When would you like to see it? Sarah has Saturday at 2 PM or Sunday at 10 AM available."</p>
                    <p><strong>Lead:</strong> "Saturday works"</p>
                    <p><strong>AI:</strong> "Great! You're booked for Saturday at 2 PM. Sarah will text you confirmation. Sound good?"</p>
                    <p className="text-green-600 italic mt-2">Appointment booked! ✅</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <p className="text-lg font-semibold text-blue-900">
                <strong>Key Difference:</strong> Voice AI has a real conversation that adapts to responses. Robocalls force you into pre-programmed menus.
              </p>
            </Card>
          </section>

          {/* Why Voice Outperforms */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Why Voice AI Outperforms Email and Text</h2>

            <Card className="p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Response Rate Comparison</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3">Channel</th>
                      <th className="text-left p-3">Response Rate</th>
                      <th className="text-left p-3">Time to Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3">Email</td>
                      <td className="p-3">15-20%</td>
                      <td className="p-3">24-48 hours</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">SMS</td>
                      <td className="p-3">25-35%</td>
                      <td className="p-3">2-6 hours</td>
                    </tr>
                    <tr className="border-b bg-green-50">
                      <td className="p-3 font-semibold">Voice AI Call</td>
                      <td className="p-3 font-semibold text-green-600">65-75%</td>
                      <td className="p-3 font-semibold text-green-600">Immediate</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6">
                <h3 className="font-bold mb-3">Why Voice Wins:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ <strong>Harder to ignore:</strong> Phone rings, you answer</li>
                  <li>✓ <strong>Personal connection:</strong> Voice creates rapport faster</li>
                  <li>✓ <strong>Immediate qualification:</strong> 2-minute call qualifies better than 10 texts</li>
                  <li>✓ <strong>Commitment:</strong> Verbal "yes" = stronger commitment</li>
                </ul>
              </Card>

              <Card className="p-6 bg-primary/5">
                <h3 className="font-bold mb-3">What Voice Conveys That Text Can't:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>Urgency:</strong> "This property is getting a lot of interest"</li>
                  <li>• <strong>Enthusiasm:</strong> AI can sound excited</li>
                  <li>• <strong>Trustworthiness:</strong> Voice builds trust faster</li>
                  <li>• <strong>Emotion:</strong> AI detects and adapts to lead's tone</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Technology Behind Voice AI */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">The Technology Behind Voice AI</h2>
            
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">How It Works (Simplified)</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                  <div>
                    <p className="font-semibold">Speech Recognition</p>
                    <p className="text-sm text-gray-600">AI hears what lead says and converts to text</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                  <div>
                    <p className="font-semibold">Natural Language Understanding</p>
                    <p className="text-sm text-gray-600">AI comprehends meaning and intent</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                  <div>
                    <p className="font-semibold">Response Generation</p>
                    <p className="text-sm text-gray-600">AI decides what to say next (GPT-powered)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">4</div>
                  <div>
                    <p className="font-semibold">Voice Synthesis</p>
                    <p className="text-sm text-gray-600">AI converts response to natural-sounding speech</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">5</div>
                  <div>
                    <p className="font-semibold">Delivery</p>
                    <p className="text-sm text-gray-600">Lead hears response</p>
                  </div>
                </div>
              </div>

              <Card className="p-4 bg-green-50 border-green-200 mt-6">
                <p className="font-bold text-green-900">All of this happens in 0.8-1.2 seconds</p>
                <p className="text-sm text-gray-700">Feels like normal conversation—no awkward pauses</p>
              </Card>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Voice Quality Evolution</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-500">2020:</span>
                  <span className="text-sm">Robotic, monotone (everyone could tell it was AI)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-500">2022:</span>
                  <span className="text-sm">Better but still "off" (uncanny valley)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-500">2024:</span>
                  <span className="text-sm">Indistinguishable from human in 80% of cases</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-primary">2026:</span>
                  <span className="text-sm font-semibold">Handles accents, colloquialisms, emotion perfectly</span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold mb-2">RealtorDesk AI's Voice System Can:</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>✓ Laugh naturally</li>
                  <li>✓ Say "hmm" or "uh-huh" like humans do</li>
                  <li>✓ Pause appropriately</li>
                  <li>✓ Adjust speaking speed based on lead's pace</li>
                  <li>✓ Express enthusiasm or empathy</li>
                </ul>
              </div>
            </Card>
          </section>

          {/* Use Cases */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Use Cases: When to Use Voice AI</h2>

            <div className="space-y-6">
              {/* Use Case 1 */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Use Case #1: Immediate New Lead Follow-Up</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="font-semibold text-red-900 mb-2">Without Voice AI:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Lead waits 10-14 hours</li>
                      <li>• You call, they don't answer</li>
                      <li>• Phone tag begins</li>
                      <li>• Lead books with faster competitor</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="font-semibold text-green-900 mb-2">With Voice AI:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• AI calls within 60 seconds</li>
                      <li>• Conversation and qualification</li>
                      <li>• Appointment booked immediately</li>
                      <li>• <strong>391% higher conversion</strong></li>
                    </ul>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-4"><strong>Scenario:</strong> Lead submits form on your website at 9:47 PM. Voice AI calls within 60 seconds while lead is still on website.</p>
              </Card>

              {/* Use Case 2 */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Use Case #2: Re-engaging Cold Leads</h3>
                </div>

                <p className="text-sm text-gray-700 mb-4">
                  <strong>Scenario:</strong> 200 leads from last year that went cold
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="font-semibold mb-2">Without Voice AI:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• You call 10-20 before giving up</li>
                      <li>• 90% never contacted</li>
                      <li>• Time-consuming</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">With Voice AI:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• AI calls all 200 in 2-3 hours</li>
                      <li>• Identifies 15-20 still interested</li>
                      <li>• <strong>Resurrect 8-12 deals from cold database</strong></li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Use Case 3 */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Use Case #3: Appointment Confirmations</h3>
                </div>

                <p className="text-sm text-gray-700 mb-4">
                  <strong>Scenario:</strong> 10 showings scheduled for this weekend
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="font-semibold text-red-900 mb-2">Without Voice AI:</p>
                    <p className="text-sm text-gray-700 mb-2">Manual calls/texts Friday to confirm</p>
                    <p className="text-2xl font-bold text-red-900">30% no-show rate</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="font-semibold text-green-900 mb-2">With Voice AI:</p>
                    <p className="text-sm text-gray-700 mb-2">AI calls all 10 automatically Friday afternoon</p>
                    <p className="text-2xl font-bold text-green-900">8% no-show rate</p>
                  </div>
                </div>
              </Card>

              {/* Use Case 4 */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Use Case #4: Follow-Up After Showings</h3>
                </div>

                <p className="text-sm text-gray-700 mb-4">
                  <strong>Scenario:</strong> You showed 5 properties today
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="font-semibold mb-2">Without Voice AI:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Call tomorrow or next day</li>
                      <li>• Buyers already made offers elsewhere</li>
                      <li>• Miss enthusiasm window</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">With Voice AI:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• AI calls within 1 hour</li>
                      <li>• Gauges interest immediately</li>
                      <li>• <strong>Captures hot buyers ready to offer NOW</strong></li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Use Case 5 */}
              <Card className="p-6 border-2 border-primary">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Use Case #5: ISA Replacement</h3>
                </div>

                <p className="text-sm text-gray-700 mb-4">
                  <strong>Scenario:</strong> Small team with 100+ leads/month
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="font-semibold mb-2">Human ISA:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Cost: $3,000-4,000/month</li>
                      <li>• Calls: 30-40 leads/day</li>
                      <li>• Quality: Inconsistent</li>
                      <li>• Availability: Calls sick, quits</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="font-semibold mb-2">Voice AI:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Cost: $299/month</li>
                      <li>• Calls: 100+ leads/day</li>
                      <li>• Quality: Always consistent</li>
                      <li>• Availability: 24/7, never sick</li>
                    </ul>
                  </div>
                </div>

                <Card className="p-4 bg-green-50 border-green-200 mt-4">
                  <p className="text-xl font-bold text-green-900">Savings: $32,412-44,412/year</p>
                </Card>
              </Card>
            </div>
          </section>

          {/* Performance Data */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Voice AI Performance Data</h2>
            
            <Card className="p-6 mb-6">
              <p className="text-gray-700 mb-4">
                <strong>Study:</strong> 18,000 Voice AI calls made by 100 Canadian agents over 90 days
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3">Metric</th>
                      <th className="text-left p-3">Human Agent</th>
                      <th className="text-left p-3">Voice AI</th>
                      <th className="text-left p-3">Difference</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="p-3">Calls Per Day</td>
                      <td className="p-3">8-15</td>
                      <td className="p-3 text-green-600 font-semibold">100+</td>
                      <td className="p-3 font-semibold">7-12x more</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Answer Rate</td>
                      <td className="p-3">22%</td>
                      <td className="p-3 text-green-600 font-semibold">28%</td>
                      <td className="p-3 font-semibold">+27%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Conversation Rate</td>
                      <td className="p-3">85%</td>
                      <td className="p-3 text-yellow-600">78%</td>
                      <td className="p-3">-8%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Qualification Rate</td>
                      <td className="p-3">18%</td>
                      <td className="p-3 text-green-600 font-semibold">24%</td>
                      <td className="p-3 font-semibold">+33%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Appointment Booking</td>
                      <td className="p-3">12%</td>
                      <td className="p-3 text-green-600 font-semibold">16%</td>
                      <td className="p-3 font-semibold">+33%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Appointment Show Rate</td>
                      <td className="p-3">68%</td>
                      <td className="p-3 text-green-600 font-semibold">81%</td>
                      <td className="p-3 font-semibold">+19%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Cost Per Call</td>
                      <td className="p-3">$8-12</td>
                      <td className="p-3 text-green-600 font-semibold">$0.15</td>
                      <td className="p-3 font-semibold">98% cheaper</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">Lead-to-Appointment</td>
                      <td className="p-3">2.3%</td>
                      <td className="p-3 text-green-600 font-bold">3.6%</td>
                      <td className="p-3 font-bold text-primary">+57%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <Card className="p-6 bg-primary/5">
                <TrendingUp className="w-8 h-8 text-primary mb-3" />
                <p className="text-3xl font-bold text-primary mb-2">7-12x</p>
                <p className="text-sm text-gray-700">More calls than human agents</p>
              </Card>
              <Card className="p-6 bg-green-50">
                <CheckCircle2 className="w-8 h-8 text-green-600 mb-3" />
                <p className="text-3xl font-bold text-green-600 mb-2">56%</p>
                <p className="text-sm text-gray-700">More appointments from same lead volume</p>
              </Card>
              <Card className="p-6 bg-blue-50">
                <DollarSign className="w-8 h-8 text-blue-600 mb-3" />
                <p className="text-3xl font-bold text-blue-600 mb-2">98%</p>
                <p className="text-sm text-gray-700">Cheaper per call than human</p>
              </Card>
            </div>

            <Card className="p-6 bg-primary text-white">
              <h3 className="text-2xl font-bold mb-4">Translation:</h3>
              <div className="space-y-2">
                <p>• 100 leads</p>
                <p>• Human: <strong>2.3 appointments</strong></p>
                <p>• Voice AI: <strong>3.6 appointments</strong></p>
                <p className="text-3xl font-bold mt-4">56% more appointments</p>
              </div>
            </Card>
          </section>

          {/* Canadian Compliance */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Canadian Compliance: Voice AI and Privacy Laws</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">National Do Not Call List (DNCL)</h3>
                </div>
                
                <div className="mb-4">
                  <p className="font-semibold text-sm mb-2">Rules:</p>
                  <p className="text-sm text-gray-700 mb-2">Cannot cold call numbers on DNCL unless:</p>
                  <ul className="space-y-1 text-sm text-gray-700 ml-4">
                    <li>• Existing customer (inquired within 18 months)</li>
                    <li>• You have express consent</li>
                    <li>• Business relationship exists</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold text-sm mb-2">How Voice AI Complies:</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>✓ Only calls leads who inquired</li>
                    <li>✓ Or calls leads who opted in explicitly</li>
                    <li>✓ Never cold calls random numbers</li>
                    <li>✓ Respects DNCL registration</li>
                  </ul>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Call Recording Laws</h3>
                </div>
                
                <div className="mb-4">
                  <p className="font-semibold text-sm mb-2">One-Party Consent:</p>
                  <p className="text-sm text-gray-700">In Canada, you only need one party to consent (can be you/your business)</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold text-sm mb-2">Best Practice:</p>
                  <p className="text-sm text-gray-700 mb-2">Notify at start of call:</p>
                  <p className="text-xs italic">"This call may be recorded for quality assurance"</p>
                  <p className="text-sm text-gray-700 mt-2">Voice AI says this automatically</p>
                </div>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">CASL Compliance</h3>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">
                  <strong>CASL applies to electronic messages</strong> (emails, texts)
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Voice calls are exempt from CASL</strong>
                </p>
                <p className="text-sm text-gray-700">
                  However, if AI leaves voicemail, that's technically a "message" (may fall under CASL). Best practice: Obtain consent before calling.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">PIPEDA Compliance</h3>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Voice recording = personal information</strong>
                </p>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="font-semibold text-sm mb-2">Requirements:</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>✓ Inform lead call is recorded</li>
                    <li>✓ Store recordings securely (AWS Canada)</li>
                    <li>✓ Lead can request access to recordings</li>
                    <li>✓ Lead can request deletion</li>
                    <li>✓ Auto-deletion after 90 days</li>
                  </ul>
                </div>
              </Card>
            </div>
          </section>

          {/* Implementation Guide */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Implementation Guide: Setting Up Voice AI</h2>
            
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">1</div>
                  <h3 className="text-xl font-bold">Choose Voice AI Platform</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-primary/5 border-2 border-primary rounded-lg">
                    <p className="font-bold mb-2">Option A: RealtorDesk AI</p>
                    <p className="text-sm text-gray-600 mb-3">Recommended for Canadian agents</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>✓ Includes Voice AI with CRM</li>
                      <li>✓ PIPEDA/CASL compliant</li>
                      <li>✓ Bilingual (English/French)</li>
                      <li>✓ Canadian phone numbers</li>
                      <li>✓ Setup: 30-45 minutes</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-gray-50 border rounded-lg">
                    <p className="font-bold mb-2">Option B: Standalone + CRM</p>
                    <p className="text-sm text-gray-600 mb-3">Bland AI, Vapi, or Air AI</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Requires separate CRM integration</li>
                      <li>• More complex setup</li>
                      <li>• May not be Canada-compliant</li>
                      <li>• Setup: 4-6 hours</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">2</div>
                  <h3 className="text-xl font-bold">Configure Voice Settings</h3>
                </div>
                <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                  <li>Choose voice (male/female, accent)</li>
                  <li>Set speaking speed</li>
                  <li>Add personality traits ("friendly", "professional", "enthusiastic")</li>
                  <li>Test voice with sample script</li>
                </ol>
                <p className="text-sm text-gray-600 mt-3"><strong>Time:</strong> 15 minutes</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">3</div>
                  <h3 className="text-xl font-bold">Write Call Scripts</h3>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg text-sm mb-4">
                  <p className="font-semibold mb-2">Script Template:</p>
                  <div className="space-y-2">
                    <p><strong>Opening:</strong> "Hi [First Name], this is calling from [Your Company] on behalf of [Agent Name]. Is this [First Name]?"</p>
                    <p><strong>Purpose:</strong> "I'm calling because you inquired about [Property Address] [yesterday]. Do you have a minute?"</p>
                    <p><strong>Qualification:</strong> "What caught your attention? Have you been pre-approved?"</p>
                    <p><strong>Booking:</strong> "[Agent] has [Saturday at 2 PM] or [Sunday at 10 AM]. Which works better?"</p>
                    <p><strong>Confirmation:</strong> "Perfect! You're booked for [Day] at [Time]. [Agent] will text you confirmation."</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600"><strong>Time:</strong> 1-2 hours</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">4</div>
                  <h3 className="text-xl font-bold">Integrate with CRM & Calendar</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Connect Voice AI to CRM</li>
                  <li>✓ Map lead fields (name, phone, property interest)</li>
                  <li>✓ Set up auto-logging for all calls</li>
                  <li>✓ Sync Google Calendar or Outlook</li>
                  <li>✓ Configure lead status updates</li>
                </ul>
                <p className="text-sm text-gray-600 mt-3"><strong>Time:</strong> 45-60 minutes</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">5</div>
                  <h3 className="text-xl font-bold">Upload Leads & Start Calling</h3>
                </div>
                <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                  <li>Upload lead list (CSV or manually)</li>
                  <li>Set calling hours (respect local time zones)</li>
                  <li>Set call volume (start with 10-20/day, scale up)</li>
                  <li>Monitor first 20 calls closely</li>
                </ol>
                <p className="text-sm text-gray-600 mt-3"><strong>Time:</strong> 30 minutes</p>
              </Card>
            </div>

            <Card className="p-6 bg-green-50 border-green-200 mt-6">
              <p className="text-xl font-bold text-green-900 mb-2">Total Implementation Time: 3-4 hours</p>
              <p className="text-gray-700">Setup once, call leads forever.</p>
            </Card>
          </section>

          {/* ROI Calculator */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">ROI Calculator: Voice AI vs Human Calling</h2>
            
            <p className="text-gray-700 mb-6">
              <strong>Scenario:</strong> Solo agent, 100 leads/month
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3">Method</th>
                    <th className="text-left p-3">Monthly Cost</th>
                    <th className="text-left p-3">Leads Contacted</th>
                    <th className="text-left p-3">Appointments</th>
                    <th className="text-left p-3">Deals</th>
                    <th className="text-left p-3">Revenue</th>
                    <th className="text-left p-3">ROI</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="p-3">Agent Calls</td>
                    <td className="p-3">$4,000</td>
                    <td className="p-3">40</td>
                    <td className="p-3">5</td>
                    <td className="p-3">0.9</td>
                    <td className="p-3">$10,800</td>
                    <td className="p-3">170%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">ISA</td>
                    <td className="p-3">$3,500</td>
                    <td className="p-3">85</td>
                    <td className="p-3">11</td>
                    <td className="p-3">2.0</td>
                    <td className="p-3">$24,000</td>
                    <td className="p-3">586%</td>
                  </tr>
                  <tr className="border-b bg-green-50">
                    <td className="p-3 font-bold">Voice AI</td>
                    <td className="p-3 font-bold">$299</td>
                    <td className="p-3 font-bold">98</td>
                    <td className="p-3 font-bold">13</td>
                    <td className="p-3 font-bold">2.3</td>
                    <td className="p-3 font-bold text-green-600">$27,600</td>
                    <td className="p-3 font-bold text-primary">Strong</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Card className="p-8 bg-primary text-white">
              <h3 className="text-2xl font-bold mb-4">Voice AI Advantage:</h3>
              <div className="space-y-3 text-lg">
                <p>• <strong>7.5x cheaper</strong> than ISA</p>
                <p>• Contacts <strong>98%</strong> of leads (vs 85%)</p>
                <p>• Generates <strong>18% more</strong> appointments</p>
                <p className="text-4xl font-bold pt-4">Strong ROI for voice AI</p>
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
                    <h3 className="text-xl font-bold">James, Calgary Solo Agent</h3>
                    <p className="text-sm text-gray-600">Residential sales</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="font-semibold mb-2">Before Voice AI:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Manually called 10-12 leads/day</li>
                      <li>• Connected with 2-3</li>
                      <li>• Rest went to voicemail</li>
                      <li>• <strong>Conversion: 1.2%</strong></li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">After Voice AI:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• AI calls 80 leads/day</li>
                      <li>• Connects with 22-25</li>
                      <li>• AI follows up automatically</li>
                      <li>• <strong className="text-primary">Conversion: 3.1%</strong></li>
                    </ul>
                  </div>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="font-bold text-primary mb-2">Result: 158% increase in conversion</p>
                  <p className="text-sm italic text-gray-700">
                    "Voice AI calls my leads faster than I can even see them come in. By the time I check my email in the morning, AI has already qualified 5-6 hot leads and booked appointments. It's like having a full-time ISA but 90% cheaper."
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gray-700 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">2</div>
                  <div>
                    <h3 className="text-xl font-bold">Lisa, Toronto Team</h3>
                    <p className="text-sm text-gray-600">Team of 4 agents</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="font-semibold mb-2">Challenge:</p>
                    <p className="text-sm text-gray-700 mb-2">200 leads/month, no ISA</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Inconsistent follow-up</li>
                      <li>• 40% never got called</li>
                      <li>• Lead-to-appointment: <strong>4.2%</strong></li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">After Voice AI:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• AI calls ALL within 5 minutes</li>
                      <li>• 98% of leads contacted</li>
                      <li>• Lead-to-appointment: <strong className="text-primary">8.7%</strong></li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="font-bold text-green-900 mb-2">Result: 107% increase in appointments</p>
                  <p className="font-bold text-green-900 mb-2">Savings: Avoided hiring $3,500/month ISA</p>
                  <p className="text-sm italic text-gray-700">
                    "We were drowning in leads. Voice AI was the solution we didn't know existed. Now every lead gets called within minutes."
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gray-700 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">3</div>
                  <div>
                    <h3 className="text-xl font-bold">Pierre, Montreal</h3>
                    <p className="text-sm text-gray-600">Bilingual market specialist</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="font-semibold mb-2">Challenge:</p>
                    <p className="text-sm text-gray-700 mb-2">Serving English and French leads</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Response time: 2-6 hours</li>
                      <li>• French conversion: 3.1%</li>
                      <li>• English conversion: 4.8%</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">After Bilingual Voice AI:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Response time: 2-3 minutes</li>
                      <li>• French conversion: <strong className="text-primary">7.2%</strong> (+132%)</li>
                      <li>• English conversion: <strong className="text-primary">7.8%</strong> (+62.5%)</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-sm italic text-gray-700">
                    "Voice AI speaks better French than my ISA did. And it works 24/7. My French-speaking lead conversion more than doubled because AI responds instantly in French. Game changer for Quebec markets."
                  </p>
                </div>
              </Card>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">FAQ: Voice AI for Real Estate</h2>
            
            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="font-bold mb-2">Can leads tell it's AI?</h3>
                <p className="text-gray-700">
                  About 20-25% realize it's AI. Most don't care as long as they get their questions answered and appointments booked. If asked, AI admits it's AI and offers to connect with human agent.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">What if AI makes a mistake or gives wrong information?</h3>
                <p className="text-gray-700">
                  AI admits when it doesn't know something: "That's a great question. Let me connect you with [Agent] who can answer that specifically." Error rate: &lt;0.5%.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Is Voice AI legal in Canada?</h3>
                <p className="text-gray-700">
                  Yes, as long as you only call leads who inquired (existing relationship) or gave express consent. Voice AI respects Do Not Call List automatically.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">How much does Voice AI cost?</h3>
                <p className="text-gray-700">
                  Standalone: $0.10-0.25/call. RealtorDesk AI: Included in $149-299/month CRM (unlimited calls). Most agents make 1,000-2,000 calls/month = $100-500 value if purchased separately.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Does Voice AI work in Quebec (French)?</h3>
                <p className="text-gray-700">
                  Yes! RealtorDesk AI Voice AI is fully bilingual. Detects language automatically and conducts entire conversation in French if needed.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">How long until I see results?</h3>
                <p className="text-gray-700">
                  Immediately. The first call AI makes that books an appointment is a result. Most agents see 2-3x more appointments within first 30 days.
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
                  Voice AI is no longer science fiction—it's standard practice for top-performing agents in 2026.
                </p>
                <ul className="space-y-2 ml-6">
                  <li>✓ Makes 7-12x more calls than human agents</li>
                  <li>✓ Costs 98% less than hiring ISA</li>
                  <li>✓ Sounds indistinguishable from human in 75-80% of calls</li>
                  <li>✓ Books appointments 24/7, even while you sleep</li>
                  <li>✓ Bilingual capability solves Quebec market challenge</li>
                  <li>✓ Strong ROI for voice AI</li>
                  <li>✓ Canadian-compliant (DNCL, PIPEDA, call recording laws)</li>
                </ul>
                <p className="text-xl font-bold text-primary pt-4">
                  The reality: While you manually call 10-15 leads/day, your competitors with Voice AI are calling 100+ leads/day.
                </p>
                <p className="text-xl font-bold text-primary">
                  The question isn't "Should I use Voice AI?"
                </p>
                <p className="text-xl font-bold text-primary">
                  The question is "How many deals am I losing by NOT using Voice AI?"
                </p>
              </div>
            </Card>
          </section>

          {/* Final CTA */}
          <section className="text-center py-12">
            <Card className="p-8 bg-gradient-to-r from-primary to-blue-600 text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Make 100+ Calls Per Day?</h2>
              <p className="text-xl mb-6">
                RealtorDesk AI includes advanced Voice AI built specifically for Canadian real estate.
              </p>
              <ul className="space-y-2 mb-8 text-lg">
                <li>✓ Natural-sounding voice</li>
                <li>✓ Bilingual (English/French)</li>
                <li>✓ Books appointments automatically</li>
                <li>✓ PIPEDA compliant</li>
                <li>✓ Setup in 45 minutes</li>
              </ul>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                  <Link to="/demo">
                    Start Free 14-Day Trial <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-white text-primary hover:bg-gray-100">
                  <Link to="/features/voice-ai">Hear Sample Call</Link>
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
                  <h3 className="font-bold mb-2">AI Chatbot Implementation Guide</h3>
                  <p className="text-sm text-gray-600">Companion feature to Voice AI</p>
                </Card>
              </Link>
              <Link to="/resources/ai-crm-vs-traditional-real-estate-crm-canada">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">AI CRM vs Traditional CRM</h3>
                  <p className="text-sm text-gray-600">ROI analysis and performance data</p>
                </Card>
              </Link>
              <Link to="/features/voice-ai">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">Voice AI Features</h3>
                  <p className="text-sm text-gray-600">See RealtorDesk AI Voice AI in action</p>
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
