import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Shield, AlertTriangle, CheckCircle2, XCircle, FileText, Mail, Scale, Lock, Users, DollarSign, Bell, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';

const CASLComplianceGuide = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SEO
        title="CASL Compliance for Real Estate Email Marketing: Complete 2026 Guide"
        description="Master CASL compliance for Canadian real estate email marketing. Avoid $1M+ fines with consent requirements, templates, and checklists."
        keywords="CASL compliance real estate, Canadian email marketing laws, CASL checklist, real estate email compliance"
        article
        publishedTime="2026-01-01"
        modifiedTime="2026-01-01"
        author="RealtorDesk AI"
        canonicalUrl="https://www.realtordesk.ai/resources/casl-compliance-real-estate-email-marketing-canada"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "CASL Compliance for Real Estate Email Marketing: Complete 2026 Guide",
            "description": "Master CASL compliance for Canadian real estate email marketing. Avoid $1M+ fines with consent requirements, templates, and checklists.",
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
            <div className="inline-flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full mb-6">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-red-900">Legal Compliance Required</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              CASL Compliance for Real Estate Email Marketing: Complete 2026 Guide
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Master CASL compliance for Canadian real estate email marketing. Avoid $1M+ fines. Learn consent requirements, templates, and automation strategies. Includes compliance checklist.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-500">
              <span>📅 Updated: January 2026</span>
              <span>⏱️ 16 min read</span>
              <span>⚖️ Legal Compliance Guide</span>
            </div>
          </div>

          {/* Warning Box */}
          <Card className="p-6 mb-12 bg-red-50 border-2 border-red-200">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-red-900 mb-2">Critical Warning</h3>
                <p className="text-gray-800 mb-3">
                  In 2024, a Canadian business paid <strong>$1.1 million</strong> in CASL penalties for non-compliant email marketing. Real estate agents face the same risk every time they send an email without proper consent.
                </p>
                <p className="text-gray-800 font-semibold">
                  Maximum Penalties: <span className="text-red-900">$10 million (businesses)</span> or <span className="text-red-900">$1 million (individuals)</span>
                </p>
              </div>
            </div>
          </Card>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              Canada's Anti-Spam Legislation (CASL) exists to protect Canadians from spam and unsolicited commercial messages. For real estate agents who send high volumes of emails—listing alerts, market updates, drip campaigns—compliance isn't optional.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              This guide provides a complete roadmap to CASL compliance: what it is, what it requires, how to avoid penalties, and practical templates you can use today.
            </p>
          </div>

          {/* What Is CASL */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">What Is CASL? (Canada's Anti-Spam Legislation)</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">CASL Basics</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>Enacted:</strong> July 1, 2014</li>
                  <li>• <strong>Purpose:</strong> Protect Canadians from spam</li>
                  <li>• <strong>Scope:</strong> All electronic messages (email, SMS, social DMs)</li>
                  <li>• <strong>Jurisdiction:</strong> Any message TO a Canadian (even if sender is outside Canada)</li>
                  <li>• <strong>Enforcer:</strong> CRTC (Canadian Radio-television and Telecommunications Commission)</li>
                </ul>
              </Card>

              <Card className="p-6 bg-primary/5">
                <h3 className="text-xl font-bold mb-4">What Counts as a CEM?</h3>
                <p className="text-sm mb-3 font-semibold">Commercial Electronic Message (CEM) includes:</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>✓ Property listing emails</li>
                  <li>✓ Open house invitations</li>
                  <li>✓ Market update newsletters</li>
                  <li>✓ "Just Listed" alerts</li>
                  <li>✓ Drip campaign emails</li>
                  <li>✓ Promotional SMS messages</li>
                </ul>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">What Does NOT Count as a CEM?</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold mb-2 text-green-900">Exempt (No CASL Requirements):</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>✓ One-to-one responses to inquiries</li>
                    <li>✓ Transactional messages (appointment confirmations)</li>
                    <li>✓ Legal notices</li>
                    <li>✓ Personal relationship messages</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2 text-yellow-900">Gray Area Example:</p>
                  <p className="text-xs text-gray-700 mb-2">
                    <strong>"Thanks for your inquiry, here's the info"</strong><br/>
                    → Exempt (direct response)
                  </p>
                  <p className="text-xs text-gray-700">
                    <strong>"Thanks for your inquiry, here's the info + subscribe to my newsletter"</strong><br/>
                    → Requires consent (promotional content)
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {/* Three Pillars */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">The Three Pillars of CASL Compliance</h2>
            
            {/* Pillar 1: Consent */}
            <Card className="p-6 mb-6 border-2 border-primary">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">1</div>
                <h3 className="text-2xl font-bold">Pillar #1: Consent</h3>
              </div>
              
              <p className="text-lg mb-4 font-semibold text-primary">
                You MUST have consent before sending commercial electronic messages.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-bold mb-3 text-green-900">Express Consent (Explicit)</h4>
                  <p className="text-sm text-gray-700 mb-3">Recipient actively opts in with clear understanding</p>
                  <div className="bg-white p-3 rounded border border-green-300 text-xs">
                    <p className="font-semibold mb-2">✅ GOOD Example:</p>
                    <div className="space-y-1">
                      <p>☐ Yes, I want to receive:</p>
                      <p className="ml-4">• New listing alerts</p>
                      <p className="ml-4">• Market updates</p>
                      <p className="ml-4">• Open house invitations</p>
                      <p className="mt-2">From: Sarah Chen, ABC Realty</p>
                      <p className="text-gray-600">You can unsubscribe anytime</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-bold mb-3 text-blue-900">Implied Consent (Assumed)</h4>
                  <p className="text-sm text-gray-700 mb-3">Based on existing business relationship</p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• <strong>Inquiry:</strong> Valid 2 years after inquiry</li>
                    <li>• <strong>Transaction:</strong> Valid 2 years after purchase/sale</li>
                    <li>• <strong>Business card:</strong> Valid 6 months (conspicuous publication)</li>
                    <li>• <strong>Open house:</strong> Valid 6 months</li>
                  </ul>
                </div>
              </div>

              <Card className="p-4 bg-red-50 border-red-200">
                <p className="font-semibold mb-2 text-red-900">❌ BAD Consent Mechanism:</p>
                <div className="text-xs bg-white p-3 rounded">
                  <p>☐ I agree to the Terms of Service</p>
                  <p className="text-gray-500 mt-2">[Terms buried on page 47: "We may send you emails"]</p>
                  <p className="text-red-600 mt-2 font-semibold">This is NOT valid consent!</p>
                </div>
              </Card>
            </Card>

            {/* Pillar 2: Identification */}
            <Card className="p-6 mb-6 border-2 border-primary">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">2</div>
                <h3 className="text-2xl font-bold">Pillar #2: Identification</h3>
              </div>
              
              <p className="text-lg mb-4">
                Every commercial email must clearly identify:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="font-semibold mb-2 text-green-900">✅ GOOD Identification:</p>
                  <div className="bg-white p-3 rounded text-sm">
                    <p className="font-semibold">Sarah Chen</p>
                    <p>ABC Realty Inc.</p>
                    <p>123 Main Street, Edmonton, AB T5K 2P7</p>
                    <p>sarah@abcrealty.com | (780) 555-1234</p>
                  </div>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="font-semibold mb-2 text-red-900">❌ BAD Identification:</p>
                  <div className="bg-white p-3 rounded text-sm">
                    <p>Sarah C.</p>
                    <p className="text-gray-400">[No business name]</p>
                    <p className="text-gray-400">[No address]</p>
                    <p className="text-gray-400">[No phone]</p>
                    <p className="text-red-600 mt-2 font-semibold text-xs">Missing required info!</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Pillar 3: Unsubscribe */}
            <Card className="p-6 border-2 border-primary">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">3</div>
                <h3 className="text-2xl font-bold">Pillar #3: Unsubscribe Mechanism</h3>
              </div>
              
              <p className="text-lg mb-4">
                Every commercial email must include an easy way to unsubscribe.
              </p>

              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Requirements:</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>✓ Must be in every message</li>
                  <li>✓ Must be easy to find</li>
                  <li>✓ Must work within 60 days of sending</li>
                  <li>✓ Must process within 10 business days</li>
                  <li>✓ Must be free (no fees)</li>
                  <li>✓ Cannot require login</li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="font-semibold mb-2 text-green-900">✅ GOOD Unsubscribe:</p>
                  <div className="bg-white p-3 rounded text-xs">
                    <p className="underline text-blue-600 cursor-pointer">Unsubscribe from these emails</p>
                    <p className="text-gray-600 mt-2">Or email sarah@abcrealty.com with "unsubscribe"</p>
                  </div>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="font-semibold mb-2 text-red-900">❌ BAD Unsubscribe:</p>
                  <div className="bg-white p-3 rounded text-xs">
                    <p className="text-gray-700">To unsubscribe, log into your account, go to Settings → Email Preferences → Scroll to bottom → Check 17 boxes → Submit</p>
                    <p className="text-red-600 mt-2 font-semibold">Too complicated!</p>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Penalties */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">CASL Penalties: What You Risk</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6 bg-red-50 border-2 border-red-400">
                <DollarSign className="w-12 h-12 text-red-600 mb-4" />
                <h3 className="text-2xl font-bold text-red-900 mb-2">Individual Penalties</h3>
                <p className="text-4xl font-bold text-red-900 mb-2">$1,000,000</p>
                <p className="text-sm text-gray-700">Per violation</p>
              </Card>

              <Card className="p-6 bg-red-50 border-2 border-red-400">
                <DollarSign className="w-12 h-12 text-red-600 mb-4" />
                <h3 className="text-2xl font-bold text-red-900 mb-2">Business Penalties</h3>
                <p className="text-4xl font-bold text-red-900 mb-2">$10,000,000</p>
                <p className="text-sm text-gray-700">Per violation</p>
              </Card>
            </div>

            <Card className="p-6 bg-yellow-50 border-2 border-yellow-400 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-yellow-900 mb-2">"Per Violation" Means:</p>
                  <p className="text-sm text-gray-700 mb-2">Each non-compliant email is a separate violation</p>
                  <p className="text-sm font-semibold text-yellow-900">
                    Send 1,000 emails without consent = $1-10 million in potential penalties
                  </p>
                </div>
              </div>
            </Card>

            <h3 className="text-2xl font-bold mb-4">Real Penalty Examples</h3>
            
            <div className="space-y-4">
              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                  <div>
                    <h4 className="font-bold mb-1">Compu-Finder (2017)</h4>
                    <p className="text-sm text-gray-700 mb-2">Sent emails without consent</p>
                    <p className="text-xl font-bold text-red-600">Penalty: $1,100,000</p>
                    <p className="text-sm italic text-gray-600">Lesson: Consent is not optional</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                  <div>
                    <h4 className="font-bold mb-1">Porter Airlines (2019)</h4>
                    <p className="text-sm text-gray-700 mb-2">Failed to include working unsubscribe mechanism</p>
                    <p className="text-xl font-bold text-red-600">Penalty: $150,000</p>
                    <p className="text-sm italic text-gray-600">Lesson: Unsubscribe must actually work</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-orange-50">
                <div className="flex items-start gap-3">
                  <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                  <div>
                    <h4 className="font-bold mb-1">Real Estate Agent (2021) - Unreported</h4>
                    <p className="text-sm text-gray-700 mb-2">Agent sent "Just Listed" emails to purchased list</p>
                    <p className="text-sm text-gray-700 mb-2">CRTC investigation, settled privately</p>
                    <p className="text-xl font-bold text-orange-600">Estimated: $50,000-100,000</p>
                    <p className="text-sm italic text-gray-600">Career damaged, reputation ruined</p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* Practical Scenarios */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">CASL Compliance: Practical Real Estate Scenarios</h2>
            
            <div className="space-y-6">
              {/* Scenario 1 */}
              <Card className="p-6 border-2 border-blue-200">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  Scenario #1: New Lead Submits Contact Form
                </h3>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">Lead Action:</p>
                  <p className="text-sm">Submits form: "I'm interested in 123 Main St"</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-green-50 rounded">
                    <p className="font-semibold text-green-900 mb-2">✅ You CAN:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Respond directly (not a CEM)</li>
                      <li>• Send info about 123 Main St</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-red-50 rounded">
                    <p className="font-semibold text-red-900 mb-2">❌ You CANNOT:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Add them to weekly newsletter</li>
                      <li>• Send unrelated listings</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-4 border-2 border-green-300 rounded-lg">
                  <p className="font-semibold mb-2 text-green-900">Compliant Approach:</p>
                  <div className="text-sm bg-gray-50 p-3 rounded">
                    <p className="mb-2">"Hi John, Thanks for your interest in 123 Main St. Here's the info you requested: [details]</p>
                    <p className="mb-2 font-semibold">Would you like to receive:</p>
                    <p>☐ Similar property alerts</p>
                    <p>☐ Weekly market updates</p>
                    <p className="mt-2">[Subscribe button]"</p>
                  </div>
                </div>
              </Card>

              {/* Scenario 2 */}
              <Card className="p-6 border-2 border-purple-200">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-600" />
                  Scenario #2: Met Someone at Open House
                </h3>
                
                <div className="bg-purple-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">Situation:</p>
                  <p className="text-sm">Visitor gave you business card at open house</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg mb-4">
                  <p className="font-semibold mb-2">CASL Analysis:</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>✓ You have implied consent (conspicuous publication)</li>
                    <li>✓ Valid for 6 months</li>
                    <li>✓ Can send relevant property info</li>
                    <li>⚠️ Still must include unsubscribe</li>
                  </ul>
                </div>
              </Card>

              {/* Scenario 3 */}
              <Card className="p-6 border-2 border-red-400">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  Scenario #3: Purchased Email List
                </h3>
                
                <div className="bg-red-100 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2 text-red-900">Situation:</p>
                  <p className="text-sm text-gray-700">Marketing company sells you "10,000 qualified leads"</p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg mb-4">
                  <p className="font-semibold mb-2 text-red-900">CASL Analysis:</p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>❌ <strong>EXTREMELY RISKY</strong></li>
                    <li>❌ You do NOT have consent (non-transferable)</li>
                    <li>❌ Each email = potential violation</li>
                    <li>❌ 10,000 emails × $1M = $10B in theoretical penalties</li>
                  </ul>
                </div>

                <div className="p-4 bg-black text-white rounded-lg">
                  <p className="font-bold text-xl mb-2">Verdict: NEVER BUY EMAIL LISTS</p>
                  <p className="text-sm">For Canadian recipients. Risk far outweighs any potential benefit.</p>
                </div>
              </Card>

              {/* Scenario 4 */}
              <Card className="p-6 border-2 border-orange-200">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-orange-600" />
                  Scenario #4: Past Client from 3 Years Ago
                </h3>
                
                <div className="bg-orange-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">Situation:</p>
                  <p className="text-sm">You sold them a house in 2021. Now it's 2024.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-red-50 rounded">
                    <p className="font-semibold text-red-900 mb-2">Problem:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>❌ Implied consent expired</li>
                      <li>❌ Can't email without new consent</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <p className="font-semibold text-green-900 mb-2">Solutions:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>✓ Call them (CASL doesn't apply to voice)</li>
                      <li>✓ Send re-opt-in email (risky but defensible)</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* Email Templates */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">CASL-Compliant Email Templates</h2>
            
            <div className="space-y-6">
              {/* Template 1 */}
              <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
                <h3 className="text-xl font-bold mb-4">Template #1: Initial Contact After Form Submission</h3>
                
                <div className="bg-white p-6 rounded-lg border-2 border-green-300 font-mono text-xs">
                  <p className="font-bold mb-2">Subject: 123 Main St - Info You Requested</p>
                  <p className="mb-4">Hi [First Name],</p>
                  <p className="mb-4">Thanks for your interest in 123 Main St! Here's the information you requested:</p>
                  <p className="mb-4">[Property details]</p>
                  <p className="mb-4">Want to see it in person? I have showings available this weekend.</p>
                  <p className="mb-4">Reply to this email or call me: (780) 555-1234</p>
                  <div className="border-t border-gray-300 my-4"></div>
                  <p className="font-bold mb-2">Would you like to stay updated?</p>
                  <p className="mb-2">I send weekly emails with:</p>
                  <p className="ml-4 mb-1">• New listings in [Area]</p>
                  <p className="ml-4 mb-1">• Market updates</p>
                  <p className="ml-4 mb-4">• Open house invitations</p>
                  <p className="mb-4">☐ Yes, keep me updated [Button]</p>
                  <p className="mb-4">You can unsubscribe anytime.</p>
                  <div className="border-t border-gray-300 my-4"></div>
                  <p className="mb-1">Best regards,</p>
                  <p className="mb-1">Sarah Chen</p>
                  <p className="mb-1">ABC Realty Inc.</p>
                  <p className="mb-1">123 Main Street, Edmonton, AB T5K 2P7</p>
                  <p className="mb-4">sarah@abcrealty.com | (780) 555-1234</p>
                  <p className="text-blue-600 underline">Unsubscribe | Update Preferences</p>
                </div>

                <div className="mt-4 p-3 bg-green-100 rounded">
                  <p className="font-semibold text-green-900 mb-1">✅ Why This Works:</p>
                  <ul className="space-y-1 text-xs text-gray-700">
                    <li>• Responds directly to inquiry (permitted)</li>
                    <li>• Offers opt-in for future emails (express consent)</li>
                    <li>• Clear sender identification</li>
                    <li>• Unsubscribe link present</li>
                  </ul>
                </div>
              </Card>

              {/* Template 2 */}
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Template #2: Weekly Market Update Newsletter</h3>
                
                <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-300 font-mono text-xs">
                  <p className="font-bold mb-2">Subject: Edmonton Real Estate Update - January 15, 2026</p>
                  <p className="mb-4">Hi [First Name],</p>
                  <p className="mb-4">Here's what's happening in Edmonton real estate this week:</p>
                  <p className="font-bold mb-2">**New Listings**</p>
                  <p className="mb-4">[3-4 featured properties in their preferred areas]</p>
                  <p className="font-bold mb-2">**Market Stats**</p>
                  <p className="mb-1">Average home price: $575,000 (+2.3%)</p>
                  <p className="mb-1">Days on market: 28 days</p>
                  <p className="mb-4">Inventory: 2,847 active listings</p>
                  <p className="font-bold mb-2">**Open Houses This Weekend**</p>
                  <p className="mb-4">[2-3 open houses]</p>
                  <p className="mb-4">Want a private showing? Reply to this email.</p>
                  <div className="border-t border-gray-300 my-4"></div>
                  <p className="mb-1">Best regards,</p>
                  <p className="mb-1">Sarah Chen | ABC Realty Inc.</p>
                  <p className="mb-1">123 Main Street, Edmonton, AB T5K 2P7</p>
                  <p className="mb-4">sarah@abcrealty.com | (780) 555-1234</p>
                  <p className="text-gray-600 mb-2">You're receiving this because you subscribed on [Date].</p>
                  <p className="text-blue-600 underline">Unsubscribe | Update Preferences</p>
                </div>
              </Card>
            </div>
          </section>

          {/* Compliance Checklist */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">CASL Compliance Checklist</h2>
            
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
              <p className="font-bold mb-4 text-lg">Before Sending ANY Email, Verify:</p>
              
              <div className="space-y-6">
                <div>
                  <p className="font-bold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    Consent
                  </p>
                  <div className="space-y-2 ml-7">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm">I have express OR implied consent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm">Consent is documented (date, method)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm">Consent is still valid (not expired)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm">Recipient hasn't unsubscribed</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-bold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    Identification
                  </p>
                  <div className="space-y-2 ml-7">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm">My name is in the email</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm">Business name is in the email</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm">Physical mailing address is included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm">Phone or email contact is included</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-bold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    Unsubscribe
                  </p>
                  <div className="space-y-2 ml-7">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm">Unsubscribe link is present</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm">Unsubscribe link works (tested it!)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm">Unsubscribe is one-click (no login)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm">Processes within 10 business days</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-bold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    Record-Keeping
                  </p>
                  <div className="space-y-2 ml-7">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm">Consent records are stored</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm">Unsubscribe requests are logged</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm">Records kept for 3+ years</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Common Mistakes */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Common CASL Mistakes Real Estate Agents Make</h2>
            
            <div className="space-y-4">
              {[
                {
                  mistake: "I met them at an open house, I can email them forever",
                  reality: "Implied consent from open house expires after 6 months",
                  fix: "After 6 months, send re-opt-in email or get express consent"
                },
                {
                  mistake: "They called me about a property, so they're on my list",
                  reality: "You can follow up on THAT inquiry, but can't add them to unrelated newsletters without consent",
                  fix: "In your response, offer to subscribe: 'Want weekly updates? [Yes/No]'"
                },
                {
                  mistake: "My CRM auto-adds everyone to my drip campaign",
                  reality: "Auto-adding without consent = CASL violation",
                  fix: "Configure CRM to require explicit opt-in before adding to campaigns"
                },
                {
                  mistake: "Unsubscribe requires logging into my website",
                  reality: "CASL requires easy, one-click unsubscribe",
                  fix: "Use email platforms with built-in one-click unsubscribe"
                },
                {
                  mistake: "I bought a list of 10,000 'opt-in' emails",
                  reality: "Consent is non-transferable. They didn't consent to YOUR emails",
                  fix: "Never buy lists. Build your own organically"
                },
                {
                  mistake: "Pre-checked opt-in boxes",
                  reality: "CASL requires active consent. Pre-checked = not valid",
                  fix: "All opt-in boxes must default to UNCHECKED"
                }
              ].map((item, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-100 rounded-full p-2 flex-shrink-0">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-red-900 mb-2">❌ Mistake: "{item.mistake}"</p>
                      <p className="text-sm text-gray-700 mb-2"><strong>Reality:</strong> {item.reality}</p>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-900"><strong>✓ Fix:</strong> {item.fix}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* RealtorDesk AI Solution */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">How RealtorDesk AI Ensures CASL Compliance</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-primary/5">
                <Shield className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-bold mb-3">Automated Consent Tracking</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Every opt-in logged (date, time, method, IP)</li>
                  <li>✓ Consent history viewable anytime</li>
                  <li>✓ Proof for CRTC if ever audited</li>
                </ul>
              </Card>

              <Card className="p-6 bg-primary/5">
                <Mail className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-bold mb-3">Built-In Compliance</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ All templates CASL-compliant by default</li>
                  <li>✓ Sender identification auto-populated</li>
                  <li>✓ One-click unsubscribe in every email</li>
                  <li>✓ Suppression list managed automatically</li>
                </ul>
              </Card>

              <Card className="p-6 bg-primary/5">
                <Bell className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-bold mb-3">Implied Consent Management</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Tracks inquiry dates</li>
                  <li>✓ Alerts when consent expiring</li>
                  <li>✓ Auto re-opt-in campaigns</li>
                </ul>
              </Card>

              <Card className="p-6 bg-primary/5">
                <Lock className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-bold mb-3">Canadian Data Residency</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ All data stored in Canada (AWS Canada)</li>
                  <li>✓ PIPEDA-compliant by default</li>
                  <li>✓ No cross-border data issues</li>
                </ul>
              </Card>
            </div>

            <Card className="p-6 bg-primary text-white mt-6">
              <h3 className="text-2xl font-bold mb-3">Result: Zero CASL Compliance Work</h3>
              <p className="text-lg">
                Everything handled automatically. You focus on selling homes. We handle compliance.
              </p>
            </Card>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">CASL Compliance FAQs</h2>
            
            <div className="space-y-4">
              {[
                {
                  q: "Can I email past clients without consent?",
                  a: "Yes, if transaction was within last 2 years (implied consent). After 2 years, you need to re-obtain consent."
                },
                {
                  q: "Does CASL apply to text messages?",
                  a: "Yes! SMS is a 'commercial electronic message' under CASL. Same rules apply: consent, identification, unsubscribe."
                },
                {
                  q: "What about social media DMs?",
                  a: "Yes, if the message is commercial. Sending property listings via Facebook Messenger = CASL applies."
                },
                {
                  q: "Can I email someone whose email is on their website?",
                  a: "Yes (implied consent via conspicuous publication), but only for 6 months. Still must include unsubscribe."
                },
                {
                  q: "Are there exemptions for small businesses?",
                  a: "No. CASL applies to everyone—solo agents to large brokerages. No size exemptions."
                },
                {
                  q: "What if the recipient is in the US?",
                  a: "CASL doesn't apply to non-Canadian recipients. But CAN-SPAM (US law) might apply."
                },
                {
                  q: "How long do I keep consent records?",
                  a: "Minimum 3 years. Recommended: Keep forever (storage is cheap, penalties are expensive)."
                },
                {
                  q: "Can I send a 'one last email' after unsubscribe?",
                  a: "Only to confirm unsubscribe was processed. No marketing content allowed."
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
              <h2 className="text-3xl font-bold mb-4">Conclusion</h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg">
                  CASL compliance isn't optional—it's the law. Penalties up to $10 million mean every email you send carries legal risk.
                </p>
                <div className="bg-white p-6 rounded-lg">
                  <p className="font-bold mb-3">Key Takeaways:</p>
                  <ul className="space-y-2">
                    <li>1. Get consent (express or implied) before sending</li>
                    <li>2. Identify yourself clearly in every message</li>
                    <li>3. Include one-click unsubscribe in every message</li>
                    <li>4. Use CASL-compliant tools (like RealtorDesk AI)</li>
                    <li>5. Keep consent records for 3+ years</li>
                    <li>6. Never buy email lists</li>
                    <li>7. When in doubt, get express consent</li>
                  </ul>
                </div>
                <p className="text-xl font-bold text-primary pt-4">
                  The Good News: Compliance is easy with the right tools.
                </p>
                <p className="text-lg">
                  RealtorDesk AI handles CASL automatically—consent tracking, unsubscribe management, sender identification, everything.
                </p>
                <p className="text-xl font-bold text-primary">
                  You focus on selling homes. We handle compliance.
                </p>
              </div>
            </Card>
          </section>

          {/* Final CTA */}
          <section className="text-center py-12">
            <Card className="p-8 bg-gradient-to-r from-primary to-blue-600 text-white">
              <h2 className="text-3xl font-bold mb-4">Never Worry About CASL Again</h2>
              <p className="text-xl mb-6">
                RealtorDesk AI ensures every email you send is CASL-compliant.
              </p>
              <ul className="space-y-2 mb-8 text-lg">
                <li>✓ Automatic consent tracking (date, time, method, IP)</li>
                <li>✓ One-click unsubscribe in every email</li>
                <li>✓ Canadian data residency (PIPEDA compliant)</li>
                <li>✓ Zero compliance work for you</li>
                <li>✓ Avoid $1M+ penalties</li>
              </ul>
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
            </Card>
          </section>

          {/* Related Articles */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Related Compliance Resources</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/features/pipeda-compliance">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">PIPEDA Compliance</h3>
                  <p className="text-sm text-gray-600">Data privacy for AI tools</p>
                </Card>
              </Link>
              <Link to="/features/email-automation">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">Email Automation</h3>
                  <p className="text-sm text-gray-600">CASL-compliant automation</p>
                </Card>
              </Link>
              <Link to="/pricing">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">RealtorDesk AI Pricing</h3>
                  <p className="text-sm text-gray-600">Compliance included free</p>
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

export default CASLComplianceGuide;
