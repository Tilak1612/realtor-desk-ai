import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import StatCard from "@/components/StatCard";
import TestimonialCard from "@/components/TestimonialCard";
import ROICalculator from "@/components/ROICalculator";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import ChatWidget from "@/components/ChatWidget";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  Brain, 
  MessageSquare, 
  ClipboardCheck, 
  AlertCircle, 
  Zap, 
  TrendingDown,
  FileText,
  MapPin,
  CheckCircle,
  Shield,
  Play
} from "lucide-react";
import demoShowcase from "@/assets/demo-showcase.jpg";

// YouTube Video Configuration - Replace with your actual video URL
const DEMO_VIDEO_URL = "https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE";

const Index = () => {
  const { t } = useTranslation();
  const [agentsCount, setAgentsCount] = useState(500);
  const [demosThisWeek, setDemosThisWeek] = useState(14);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Animate counters on mount
  useEffect(() => {
    const interval = setInterval(() => {
      setAgentsCount(prev => prev + 1);
    }, 30000); // Increment every 30 seconds for demo
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <ExitIntentPopup />
      <ChatWidget />
      
      {/* Hero Section */}
      <Hero />

      {/* Live Social Proof Bar */}
      <section className="py-4 bg-gradient-to-r from-accent/10 to-accent/5 border-y">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="font-semibold">{agentsCount} {t('home.socialProof.agents')}</span>
              <span className="text-muted-foreground">{t('home.socialProof.usingNow')}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border"></div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <span className="font-semibold">{demosThisWeek} {t('home.socialProof.demos')}</span>
              <span className="text-muted-foreground">{t('home.socialProof.bookedThisWeek')}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border"></div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span className="text-muted-foreground">{t('home.socialProof.joinAgents')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <h2 className="text-center mb-12">{t('home.credibility.title')}</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <Card className="p-6 text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">SOC 2 Compliant</h3>
              <p className="text-sm text-muted-foreground">
                Enterprise-grade security and data protection
              </p>
            </Card>
            <Card className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">PIPEDA Compliant</h3>
              <p className="text-sm text-muted-foreground">
                Full Canadian privacy law compliance
              </p>
            </Card>
            <Card className="p-6 text-center">
              <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">CREA Certified</h3>
              <p className="text-sm text-muted-foreground">
                Official CREA DDF® integration partner
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-6">{t('home.demo.title')}</h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t('home.demo.description')}
            </p>
            
            {/* Demo Showcase */}
            <div 
              className="relative aspect-video rounded-2xl shadow-2xl overflow-hidden mb-6 group cursor-pointer"
              onClick={() => setIsVideoOpen(true)}
            >
              <img 
                src={demoShowcase} 
                alt="Realtor Desk AI Platform Demo - Dashboard showing property analytics, AI chat, and client management"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Play className="w-10 h-10 text-primary ml-1" />
                  </div>
                  <p className="text-white font-medium">{t('home.demo.watchDemo')}</p>
                </div>
              </div>
            </div>
            
            {/* Video Modal */}
            <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
              <DialogContent className="max-w-5xl w-full p-0">
                <div className="relative aspect-video w-full">
                  <iframe
                    src={DEMO_VIDEO_URL}
                    title="Realtor Desk AI Product Demo"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </DialogContent>
            </Dialog>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/demo">
                <Button size="lg" className="btn-gradient">
                  {t('home.demo.bookDemo')}
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline">
                  {t('home.demo.exploreFeatures')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Integration Partners Section */}
      <section className="section-padding bg-background border-y">
        <div className="container-custom">
          <h2 className="text-center mb-12">Trusted by 500+ Canadian Real Estate Professionals</h2>
          
          {/* Integration Logos */}
          <div className="mb-12">
            <p className="text-center text-sm text-muted-foreground mb-8">Seamlessly integrates with your existing tools</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-items-center max-w-5xl mx-auto opacity-70">
              <div className="text-center">
                <Brain className="w-12 h-12 mx-auto mb-2" />
                <p className="text-xs font-semibold">CREA DDF®</p>
              </div>
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-2" />
                <p className="text-xs font-semibold">Brivity CRM</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                <p className="text-xs font-semibold">Follow Up Boss</p>
              </div>
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-2" />
                <p className="text-xs font-semibold">Gmail/Outlook</p>
              </div>
              <div className="text-center">
                <ClipboardCheck className="w-12 h-12 mx-auto mb-2" />
                <p className="text-xs font-semibold">Google Calendar</p>
              </div>
              <div className="text-center">
                <Shield className="w-12 h-12 mx-auto mb-2" />
                <p className="text-xs font-semibold">Zillow/Realtor.ca</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="I closed 14 additional deals in Q1 using Realtor Desk AI. The predictive lead scoring is a game-changer."
              name="Sarah Chen"
              title="Top Producer"
              company="Royal LePage Toronto"
            />
            <TestimonialCard
              quote="The bilingual AI chatbot captures leads 24/7. I wake up to qualified appointments every morning."
              name="Marc Dubois"
              title="Broker"
              company="RE/MAX Québec"
            />
            <TestimonialCard
              quote="My transaction closings went from 60 days to 35 days. The AI coordination is incredible."
              name="Priya Sharma"
              title="Sales Representative"
              company="Century 21 Vancouver"
            />
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="mb-4">The Hidden Costs of Outdated Real Estate Technology</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Traditional CRMs are holding Canadian realtors back from their full potential
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={TrendingDown}
              stat="12%"
              description="of agents use AI capabilities despite 72% using CRMs"
            />
            <StatCard
              icon={AlertCircle}
              stat="48%"
              description="of buyer inquiries receive NO response"
            />
            <StatCard
              icon={Zap}
              stat="15+"
              description="hours weekly spent on tasks that could be automated"
            />
            <StatCard
              icon={TrendingDown}
              stat="2-5%"
              description="lead conversion rate with traditional methods"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="mb-4">How Realtor Desk AI Works</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              From lead to closed deal in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center animate-fade-in-up">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-bold mb-3">Capture Leads</h3>
              <p className="text-muted-foreground">AI chatbot engages visitors 24/7, qualifying prospects automatically</p>
            </div>
            <div className="text-center animate-fade-in-up animation-delay-200">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-bold mb-3">Smart Follow-Up</h3>
              <p className="text-muted-foreground">Automated, personalized email & SMS campaigns nurture leads to conversion</p>
            </div>
            <div className="text-center animate-fade-in-up animation-delay-300">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-bold mb-3">MLS Integration</h3>
              <p className="text-muted-foreground">Sync with CREA DDF® to send perfect property matches instantly</p>
            </div>
            <div className="text-center animate-fade-in-up animation-delay-400">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
              <h3 className="text-xl font-bold mb-3">Close Deals</h3>
              <p className="text-muted-foreground">AI-powered transaction management ensures faster, smoother closings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Overview Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="mb-4">Meet Your AI-Powered Real Estate Operating System</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Transform how you work with intelligent automation designed specifically for Canadian realtors
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Brain}
              title="Predictive Lead Scoring"
              description="AI analyzes 40+ signals to identify hot leads 3-6 months early. Converts 18% vs industry 5%. Built on 500,000+ Canadian transactions"
              gradient
            />
            <FeatureCard
              icon={MessageSquare}
              title="24/7 Bilingual AI Chatbot"
              description="Captures leads in EN/FR, qualifies buyers, schedules showings, answers 200+ property questions. Never miss a 2 AM inquiry again"
              gradient
            />
            <FeatureCard
              icon={ClipboardCheck}
              title="Smart Transaction Coordinator"
              description="Automate status updates, document requests, deadline tracking. Cut closing time from 60 to 35 days with 99% accuracy"
              gradient
            />
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto animate-fade-in-up">
            <ROICalculator />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about Realtor Desk AI
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background p-6 rounded-lg">
              <h3 className="font-bold mb-2 flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                Does it integrate with MLS?
              </h3>
              <p className="text-sm text-muted-foreground">Yes, native CREA DDF® integration is included in all plans for seamless MLS data access across Canada.</p>
            </div>
            <div className="bg-background p-6 rounded-lg">
              <h3 className="font-bold mb-2 flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                Is the AI truly bilingual?
              </h3>
              <p className="text-sm text-muted-foreground">Absolutely. Our AI handles contextual English-French conversations naturally, not just translation.</p>
            </div>
            <div className="bg-background p-6 rounded-lg">
              <h3 className="font-bold mb-2 flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                Are you compliant with Canadian regulations?
              </h3>
              <p className="text-sm text-muted-foreground">Yes, we automatically adhere to RECO, BCFSA, RECA, and all provincial real estate regulations.</p>
            </div>
            <div className="bg-background p-6 rounded-lg">
              <h3 className="font-bold mb-2 flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                How secure is my client data?
              </h3>
              <p className="text-sm text-muted-foreground">SOC 2 compliant with enterprise-grade encryption. Your data is stored in Canadian data centers.</p>
            </div>
            <div className="bg-background p-6 rounded-lg">
              <h3 className="font-bold mb-2 flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                Can I cancel anytime?
              </h3>
              <p className="text-sm text-muted-foreground">Yes, all plans are month-to-month with no long-term contracts. Cancel anytime without penalty.</p>
            </div>
            <div className="bg-background p-6 rounded-lg">
              <h3 className="font-bold mb-2 flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                Can I import my existing contacts?
              </h3>
              <p className="text-sm text-muted-foreground">Yes, we support CSV imports from all major CRMs. Free migration assistance included.</p>
            </div>
            <div className="bg-background p-6 rounded-lg">
              <h3 className="font-bold mb-2 flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                What if I need to upgrade my plan?
              </h3>
              <p className="text-sm text-muted-foreground">You can upgrade or downgrade anytime. Changes take effect immediately with prorated billing.</p>
            </div>
            <div className="bg-background p-6 rounded-lg">
              <h3 className="font-bold mb-2 flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                What kind of support do you offer?
              </h3>
              <p className="text-sm text-muted-foreground">Email support on Starter, phone & chat on Professional, and 24/7 priority support on Enterprise.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & API Documentation Section */}
      <section className="section-padding bg-background border-y">
        <div className="container-custom">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="mb-4">Enterprise-Grade Security & Developer Tools</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Built for scale, secured for compliance, ready for integration
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Security Section */}
            <Card className="p-8">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-4">Security & Compliance</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span><strong>SOC 2 Type II Certified:</strong> Annual audits, penetration testing, 99.9% uptime SLA</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span><strong>PIPEDA Compliant:</strong> Right to access, delete, data portability. Breach notification &lt;72hrs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span><strong>CASL Compliant:</strong> Express consent tracking, auto-unsubscribe, 24-month proof retention</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span><strong>Canadian Data Centers:</strong> All data stored in Toronto/Vancouver. No cross-border transfer</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span><strong>Encryption:</strong> TLS 1.3 in transit, AES-256 at rest, end-to-end for sensitive docs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span><strong>Access Control:</strong> Role-based permissions, 2FA, SSO (Enterprise), audit logs</span>
                </li>
              </ul>
            </Card>

            {/* API & Integrations */}
            <Card className="p-8">
              <Brain className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-4">API & Integration Capabilities</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span><strong>REST API:</strong> Full CRUD access to contacts, deals, tasks. Rate limit: 1000 req/min</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span><strong>Webhooks:</strong> Real-time events (new lead, deal closed, task overdue)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span><strong>CRM Sync:</strong> Pre-built connectors for Brivity, Follow Up Boss, Salesforce, HubSpot</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span><strong>Calendar Integration:</strong> 2-way sync with Google/Outlook. Auto-create Zoom links</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span><strong>Email Platforms:</strong> Gmail, Outlook, MailChimp, SendGrid. SMTP/IMAP support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span><strong>Documentation:</strong> Interactive API docs, SDK (JavaScript/Python), Postman collection</span>
                </li>
              </ul>
              <Link to="/features" className="mt-4 inline-block">
                <Button variant="outline" size="sm">View Integration Library</Button>
              </Link>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="bg-muted/50 rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold mb-6">Platform Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold text-primary mb-1">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime SLA</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">&lt;2s</div>
                <div className="text-sm text-muted-foreground">AI Response Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">10K+</div>
                <div className="text-sm text-muted-foreground">Concurrent Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">Support (Enterprise)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container-custom text-center">
          <h2 className="mb-6 text-white">Join 500+ Canadian Agents Growing Their Business with AI</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Start closing more deals with AI-powered automation today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button size="lg" variant="secondary" className="text-lg">
                Start Closing More Deals
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" className="text-lg bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                Book Your Free Demo
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/80 font-semibold">
            ⚡ Limited spots available this month • Join 14 agents who signed up this week
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
