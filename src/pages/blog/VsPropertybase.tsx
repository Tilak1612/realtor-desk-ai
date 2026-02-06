import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, XCircle, DollarSign, Clock, Zap, Brain, Building2, Users, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';

const VsPropertybase = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SEO
        title="Propertybase vs RealtorDesk AI: Enterprise vs Agile for Canadian Teams"
        description="Propertybase is enterprise-grade. Compare costs, complexity, and results vs RealtorDesk AI for Canadian real estate teams."
        keywords="Propertybase vs RealtorDesk AI, Canadian real estate CRM comparison, Salesforce real estate CRM alternative"
        article
        publishedTime="2025-01-01"
        modifiedTime="2025-01-01"
        author="RealtorDesk AI"
        canonicalUrl="https://realtordesk.ai/blog/vs-propertybase"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Propertybase vs RealtorDesk AI: Enterprise vs Agile for Canadian Teams",
            "description": "Propertybase is enterprise-grade. Compare costs, complexity, and results vs RealtorDesk AI for Canadian real estate teams.",
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
              Propertybase vs RealtorDesk AI: Enterprise vs Agile for Canadian Teams
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Propertybase is enterprise-grade. But do you need enterprise complexity, or do you need results?
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-500">
              <span>📅 Updated: January 2025</span>
              <span>⏱️ 9 min read</span>
              <span>🎯 Comparison Guide</span>
            </div>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              Propertybase brings enterprise-level Salesforce power to real estate. That sounds impressive—until you realize it comes with enterprise-level complexity, enterprise-level implementation times, and enterprise-level costs.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              For Canadian real estate teams, the question isn't "Can Propertybase do it?" The question is "Do you need a Salesforce developer and 4 months of implementation to run your real estate business?"
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              This comparison shows you the real differences between enterprise complexity and agile simplicity—and why most Canadian teams are choosing the latter.
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
                    <th className="pb-3 font-semibold">RealtorDesk AI</th>
                    <th className="pb-3 font-semibold text-primary">Winner</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="py-3">Monthly Cost</td>
                    <td className="py-3">$600-1,200+ USD</td>
                    <td className="py-3">$149-299 CAD</td>
                    <td className="py-3 text-primary font-semibold">RealtorDesk AI</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Implementation Time</td>
                    <td className="py-3">3-6 months</td>
                    <td className="py-3">1-3 days</td>
                    <td className="py-3 text-primary font-semibold">RealtorDesk AI</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Implementation Cost</td>
                    <td className="py-3">$10,000-50,000</td>
                    <td className="py-3">$0</td>
                    <td className="py-3 text-primary font-semibold">RealtorDesk AI</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">AI Capabilities</td>
                    <td className="py-3">None built-in</td>
                    <td className="py-3">Advanced (chat + voice + predictive)</td>
                    <td className="py-3 text-primary font-semibold">RealtorDesk AI</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Canadian Compliance</td>
                    <td className="py-3">Manual setup required</td>
                    <td className="py-3">Built-in PIPEDA/CASL</td>
                    <td className="py-3 text-primary font-semibold">RealtorDesk AI</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Customization</td>
                    <td className="py-3">Unlimited (requires developer)</td>
                    <td className="py-3">Pre-configured for real estate</td>
                    <td className="py-3 text-gray-600 font-semibold">Propertybase</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Learning Curve</td>
                    <td className="py-3">6-12 months</td>
                    <td className="py-3">1-2 weeks</td>
                    <td className="py-3 text-primary font-semibold">RealtorDesk AI</td>
                  </tr>
                  <tr>
                    <td className="py-3">Best For</td>
                    <td className="py-3">Large brokerages (100+ agents)</td>
                    <td className="py-3">Solo to mid-size (1-50 agents)</td>
                    <td className="py-3 text-gray-600 font-semibold">Depends</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* What is Propertybase */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">What is Propertybase?</h2>
            
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-8 h-8 text-blue-600" />
                <h3 className="text-xl font-bold">The Salesforce-Powered CRM</h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  <strong>Foundation:</strong> Built on Salesforce platform (enterprise CRM infrastructure)
                </p>
                <p className="text-gray-700">
                  <strong>Target Market:</strong> Large brokerages and enterprise real estate operations
                </p>
                <p className="text-gray-700">
                  <strong>Core Promise:</strong> "Unlimited customization with Salesforce power"
                </p>
                <p className="text-gray-700">
                  <strong>Reality:</strong> Unlimited customization requires unlimited budget and technical expertise
                </p>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6 bg-blue-50 border-blue-200">
                <h3 className="font-bold mb-3 text-blue-900">Propertybase Strengths:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>Built on proven Salesforce infrastructure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>Unlimited customization potential</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>Enterprise-grade security and reliability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>Scales to thousands of agents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>Access to Salesforce ecosystem</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 bg-red-50 border-red-200">
                <h3 className="font-bold mb-3 text-red-900">Propertybase Challenges:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                    <span>Expensive ($600-1,200+ USD/month + implementation)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                    <span>3-6 month implementation timeline</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                    <span>Requires Salesforce expertise (consultants needed)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                    <span>Complex interface (6-12 month learning curve)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                    <span>No built-in AI automation</span>
                  </li>
                </ul>
              </Card>
            </div>

            <Card className="p-6 bg-gray-100">
              <h3 className="font-bold mb-3">Pricing (USD):</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Base Platform: $600-1,200/month per user</li>
                <li>• Implementation: $10,000-50,000 (one-time)</li>
                <li>• Training: $5,000-15,000</li>
                <li>• Ongoing Consulting: $150-250/hour</li>
                <li className="font-bold text-base pt-2">First Year (5 users): $60,000-100,000+</li>
              </ul>
            </Card>
          </section>

          {/* What is RealtorDesk AI */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">What is RealtorDesk AI?</h2>
            
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-8 h-8 text-primary" />
                <h3 className="text-xl font-bold">The AI-First Agile CRM</h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  <strong>Foundation:</strong> Purpose-built for Canadian real estate (standalone platform)
                </p>
                <p className="text-gray-700">
                  <strong>Target Market:</strong> Solo agents to mid-size teams (1-50 agents)
                </p>
                <p className="text-gray-700">
                  <strong>Core Promise:</strong> "AI automation that works out of the box"
                </p>
                <p className="text-gray-700">
                  <strong>Reality:</strong> Delivers on promise with minimal setup
                </p>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6 bg-green-50 border-green-200">
                <h3 className="font-bold mb-3 text-green-900">RealtorDesk AI Strengths:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Affordable ($149-299 CAD/month)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>1-3 day implementation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>No technical expertise required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Simple interface (1-2 week learning curve)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Advanced AI built-in (chat + voice + predictive)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Canadian compliance built-in (PIPEDA/CASL)</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 bg-yellow-50 border-yellow-200">
                <h3 className="font-bold mb-3 text-yellow-900">RealtorDesk AI Limitations:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <span>Limited customization (pre-configured workflows)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <span>Not built for enterprises (100+ agents)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <span>No Salesforce ecosystem access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <span>Newer platform (less brand recognition)</span>
                  </li>
                </ul>
              </Card>
            </div>

            <Card className="p-6 bg-primary/5 border-primary">
              <h3 className="font-bold mb-3">Pricing (CAD):</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Agent Plan: $149/month</li>
                <li>• Team Plan: $299/month</li>
                <li>• Implementation: $0</li>
                <li>• Training: $0 (15-min video)</li>
                <li>• Support: Included</li>
                <li className="font-bold text-base pt-2 text-primary">First Year (5 users): $3,588</li>
              </ul>
            </Card>
          </section>

          {/* Key Differences */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Key Differences: Enterprise vs Agile</h2>

            {/* Platform Foundation */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">1. Platform Foundation</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-semibold mb-2">Propertybase:</h4>
                  <p className="text-sm text-gray-700 mb-2">Built on Salesforce (complex, powerful)</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Requires Salesforce knowledge</li>
                    <li>• Inherits Salesforce complexity</li>
                    <li>• Unlimited customization potential</li>
                    <li>• Needs ongoing developer support</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">RealtorDesk AI:</h4>
                  <p className="text-sm text-gray-700 mb-2">Built as standalone (simple, focused)</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• No technical knowledge required</li>
                    <li>• Purpose-built for real estate</li>
                    <li>• Pre-configured workflows</li>
                    <li>• Self-service platform</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-sm font-semibold text-gray-600">Winner: Depends on need (Propertybase for unlimited customization, RealtorDesk AI for simplicity)</p>
            </Card>

            {/* Implementation Time */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">2. Implementation Time</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-semibold mb-2">Propertybase: 3-6 months</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Month 1: Requirements gathering</li>
                    <li>• Month 2-3: Salesforce configuration</li>
                    <li>• Month 4: Data migration</li>
                    <li>• Month 5: Testing</li>
                    <li>• Month 6: Training and go-live</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">RealtorDesk AI: 1-3 days</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Day 1: Account setup (automated)</li>
                    <li>• Day 2: Data import (CSV upload)</li>
                    <li>• Day 3: Team onboarding (15-min video)</li>
                    <li>• Go-live: Immediate</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-lg font-bold text-primary">Winner: RealtorDesk AI</p>
            </Card>

            {/* AI Capabilities */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">3. AI Capabilities</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-semibold mb-2">Propertybase:</h4>
                  <p className="text-sm text-gray-700 mb-2">No built-in AI</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Can integrate third-party AI tools</li>
                    <li>• Requires custom development</li>
                    <li>• Additional cost per integration</li>
                    <li>• No native voice AI</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">RealtorDesk AI:</h4>
                  <p className="text-sm text-gray-700 mb-2">Advanced AI built-in</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Sub-3-second AI chatbot (GPT-powered)</li>
                    <li>• Voice AI for phone automation</li>
                    <li>• Predictive lead scoring</li>
                    <li>• Works out of the box</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-lg font-bold text-primary">Winner: RealtorDesk AI</p>
            </Card>

            {/* Canadian Compliance */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">4. Canadian Compliance</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-semibold mb-2">Propertybase:</h4>
                  <p className="text-sm text-gray-700 mb-2">Manual setup required</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Salesforce can be configured for PIPEDA</li>
                    <li>• Requires legal consultation</li>
                    <li>• Must build custom consent workflows</li>
                    <li>• No bilingual templates</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">RealtorDesk AI:</h4>
                  <p className="text-sm text-gray-700 mb-2">Built-in PIPEDA/CASL</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• PIPEDA compliance by default</li>
                    <li>• CASL-compliant email templates</li>
                    <li>• Automated consent tracking</li>
                    <li>• Bilingual (English/French)</li>
                    <li>• AWS Canada data residency</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-lg font-bold text-primary">Winner: RealtorDesk AI</p>
            </Card>

            {/* Customization */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">5. Customization</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-semibold mb-2">Propertybase:</h4>
                  <p className="text-sm text-gray-700 mb-2">Unlimited (requires Salesforce developer)</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Custom objects and fields</li>
                    <li>• Custom workflows and automation</li>
                    <li>• Custom integrations via API</li>
                    <li>• Cost: $150-250/hour for development</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">RealtorDesk AI:</h4>
                  <p className="text-sm text-gray-700 mb-2">Pre-configured for real estate</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Standard real estate workflows</li>
                    <li>• Configurable fields and tags</li>
                    <li>• 30+ pre-built integrations</li>
                    <li>• No coding required</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-sm font-semibold text-gray-600">Winner: Propertybase (if you need unlimited custom development)</p>
            </Card>

            {/* Cost */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">6. Total Cost of Ownership</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Propertybase (5 users):</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li><strong>Year 1:</strong></li>
                    <li>• Platform: $800/user/mo × 5 × 12 = $48,000</li>
                    <li>• Implementation: $25,000</li>
                    <li>• Training: $10,000</li>
                    <li>• Consulting: $15,000</li>
                    <li className="font-bold text-base pt-2">Total: $98,000</li>
                    
                    <li className="pt-3"><strong>Year 2-3:</strong></li>
                    <li>• Platform: $48,000/year</li>
                    <li>• Ongoing support: $10,000/year</li>
                    <li className="font-bold text-base pt-2">Total: $58,000/year</li>
                    
                    <li className="pt-3 font-bold text-lg text-red-900">3-Year Total: $214,000</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">RealtorDesk AI (5 users):</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li><strong>Year 1:</strong></li>
                    <li>• Platform: $299/mo × 12 = $3,588</li>
                    <li>• Implementation: $0</li>
                    <li>• Training: $0</li>
                    <li>• Support: Included</li>
                    <li className="font-bold text-base pt-2">Total: $3,588</li>
                    
                    <li className="pt-3"><strong>Year 2-3:</strong></li>
                    <li>• Platform: $3,588/year</li>
                    <li>• Support: Included</li>
                    <li className="font-bold text-base pt-2">Total: $3,588/year</li>
                    
                    <li className="pt-3 font-bold text-lg text-green-900">3-Year Total: $10,764</li>
                  </ul>
                </div>
              </div>

              <div className="bg-primary text-white p-6 rounded-lg">
                <p className="text-2xl font-bold">3-Year Savings: $203,236</p>
              </div>

              <p className="text-lg font-bold text-primary mt-4">Winner: RealtorDesk AI</p>
            </Card>
          </section>

          {/* Use Case Analysis */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Use Case Analysis: Who Should Choose Which?</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Choose Propertybase If:</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                    <span>Large brokerage (100+ agents)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                    <span>Need custom Salesforce integrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                    <span>Have dedicated IT team</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                    <span>Budget $100,000+/year for CRM</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                    <span>Complex custom workflows required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                    <span>Already using Salesforce ecosystem</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                    <span>Can wait 4-6 months for implementation</span>
                  </li>
                </ul>
                <p className="text-sm font-semibold mt-4 text-gray-600 italic">
                  Reality: This describes &lt;5% of Canadian real estate businesses
                </p>
              </Card>

              <Card className="p-6 border-2 border-primary bg-primary/5">
                <h3 className="text-xl font-bold mb-4">Choose RealtorDesk AI If:</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span>Solo agent to mid-size team (1-50 agents)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span>Want AI automation that works immediately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span>No IT staff (need self-service platform)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span>Budget under $5,000/year for CRM</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span>Standard real estate workflows sufficient</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span>Canadian compliance is priority (PIPEDA/CASL)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span>Need to be productive within days, not months</span>
                  </li>
                </ul>
                <p className="text-sm font-semibold mt-4 text-primary italic">
                  Reality: This describes 95% of Canadian real estate businesses
                </p>
              </Card>
            </div>
          </section>

          {/* Real-World Comparison */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Real-World Scenario: Team of 10 Agents</h2>
            
            <p className="text-gray-700 mb-6">
              <strong>Context:</strong> Team of 10 agents, 200 leads/month, $12,000 avg commission
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-red-50 border-red-200">
                <h3 className="text-xl font-bold mb-4">Propertybase Path</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold">Cost:</p>
                    <ul className="ml-4 space-y-1 text-gray-700">
                      <li>• $8,000/month subscription</li>
                      <li>• $25,000 implementation</li>
                      <li>• Year 1 total: $121,000</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-semibold">Timeline:</p>
                    <ul className="ml-4 space-y-1 text-gray-700">
                      <li>• Month 1-4: Implementation</li>
                      <li>• Month 5-6: Training</li>
                      <li>• Month 7+: Full productivity</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-semibold">Lead Response:</p>
                    <ul className="ml-4 space-y-1 text-gray-700">
                      <li>• Manual follow-up (no AI)</li>
                      <li>• 10-15 minute response time</li>
                      <li>• 2.1% conversion rate</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-semibold">Training Required:</p>
                    <ul className="ml-4 space-y-1 text-gray-700">
                      <li>• 40+ hours per user</li>
                      <li>• Ongoing Salesforce training</li>
                      <li>• Complex workflows</li>
                    </ul>
                  </div>
                  
                  <div className="pt-3">
                    <p className="font-bold">Result:</p>
                    <p className="text-gray-700">High cost, long implementation, manual processes</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-green-50 border-green-200">
                <h3 className="text-xl font-bold mb-4">RealtorDesk AI Path</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold">Cost:</p>
                    <ul className="ml-4 space-y-1 text-gray-700">
                      <li>• $299/month subscription</li>
                      <li>• $0 implementation</li>
                      <li>• Year 1 total: $3,588</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-semibold">Timeline:</p>
                    <ul className="ml-4 space-y-1 text-gray-700">
                      <li>• Day 1: Setup complete</li>
                      <li>• Day 2: Data imported</li>
                      <li>• Day 3+: Full productivity</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-semibold">Lead Response:</p>
                    <ul className="ml-4 space-y-1 text-gray-700">
                      <li>• AI automation (24/7)</li>
                      <li>• 2.7 second response time</li>
                      <li>• 4.2% conversion rate (2x)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-semibold">Training Required:</p>
                    <ul className="ml-4 space-y-1 text-gray-700">
                      <li>• 15-minute video per user</li>
                      <li>• Intuitive interface</li>
                      <li>• Pre-configured workflows</li>
                    </ul>
                  </div>
                  
                  <div className="pt-3">
                    <p className="font-bold text-green-900">Result:</p>
                    <p className="text-gray-700">Low cost, instant implementation, AI automation</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 bg-primary text-white mt-6">
              <h3 className="text-xl font-bold mb-4">Comparison Summary:</h3>
              <ul className="space-y-2">
                <li>✓ RealtorDesk AI costs $117,412 LESS in Year 1</li>
                <li>✓ RealtorDesk AI productive 6 months faster</li>
                <li>✓ RealtorDesk AI 2x conversion rate (due to AI speed)</li>
                <li>✓ RealtorDesk AI requires 1% of the training time</li>
              </ul>
            </Card>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">FAQ: Propertybase vs RealtorDesk AI</h2>
            
            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="font-bold mb-2">Is Propertybase overkill for most teams?</h3>
                <p className="text-gray-700">
                  Yes. Unless you need Salesforce-level customization for enterprise workflows, simpler alternatives like RealtorDesk AI work better and cost 95% less.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Can RealtorDesk AI scale to enterprise?</h3>
                <p className="text-gray-700">
                  The Brokerage plan supports up to 50 agents. For true enterprise operations (500+ agents), Propertybase may be more appropriate. Enterprise plan coming 2026.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Is Salesforce expertise required for Propertybase?</h3>
                <p className="text-gray-700">
                  Yes. Implementation and ongoing management require Salesforce developers. Expect to pay $150-250/hour for consulting.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Can I migrate from Propertybase to RealtorDesk AI?</h3>
                <p className="text-gray-700">
                  Yes, but consider contract terms. Propertybase contracts are typically 36 months with early termination penalties. Data export is straightforward (CSV).
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Which has better AI capabilities?</h3>
                <p className="text-gray-700">
                  RealtorDesk AI by far. Propertybase has no built-in AI—you'd need to integrate third-party tools at additional cost.
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
                  <strong>Propertybase = Enterprise power, enterprise complexity, enterprise cost</strong>
                </p>
                <p className="text-lg">
                  <strong>RealtorDesk AI = Focused features, AI automation, affordable pricing</strong>
                </p>
                <p className="text-lg">
                  For 95% of Canadian real estate teams, RealtorDesk AI is the smarter choice.
                </p>
                <p className="text-xl font-bold text-primary pt-4">
                  Save $200,000+ over 3 years while getting better AI automation and faster results.
                </p>
              </div>
            </Card>
          </section>

          {/* Final CTA */}
          <section className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Choose Agile Over Enterprise Complexity</h2>
            <p className="text-xl text-gray-600 mb-8">
              Try RealtorDesk AI free for 14 days. No credit card required.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/demo">
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
              <Link to="/resources/best-crm-canadian-real-estate-agents-2025">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">Best CRM for Canadian Agents 2025</h3>
                  <p className="text-sm text-gray-600">Comprehensive top 10 ranking</p>
                </Card>
              </Link>
              <Link to="/resources/vs-lofty-crm">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">Lofty CRM vs RealtorDesk AI</h3>
                  <p className="text-sm text-gray-600">Feature bloat vs simplicity</p>
                </Card>
              </Link>
              <Link to="/resources/boomtown-alternative-canada">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">BoomTown Alternatives</h3>
                  <p className="text-sm text-gray-600">Top 5 for Canadian agents</p>
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
