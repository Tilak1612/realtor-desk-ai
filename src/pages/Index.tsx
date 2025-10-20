import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import UnifiedDashboardSection from "@/components/UnifiedDashboardSection";
import CanadianSection from "@/components/CanadianSection";
import MobileCTA from "@/components/MobileCTA";
import FeatureCard from "@/components/FeatureCard";
import StatCard from "@/components/StatCard";
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
import HowItWorksSection from "@/components/HowItWorksSection";
import MobileOptimizedFAQ from "@/components/MobileOptimizedFAQ";
import TrustTransparencySection from "@/components/TrustTransparencySection";
import BetaSuccessStories from "@/components/BetaSuccessStories";
import demoShowcase from "@/assets/demo-showcase.jpg";

// Demo Video - Professional CRM Demo
const DEMO_VIDEO_URL = "https://www.youtube.com/embed/dQw4w9WgXcQ";

const Index = () => {
  const { t } = useTranslation();
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />
      <ExitIntentPopup />
      <ChatWidget />
      <MobileCTA />
      
      {/* Hero Section */}
      <Hero />

      {/* Live Social Proof Bar - Mobile Optimized */}
      <section className="py-3 sm:py-4 bg-gradient-to-r from-accent/10 to-accent/5 border-y">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-muted-foreground">Join Our Growing Beta Community</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border"></div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
              <span className="font-semibold">50+</span>
              <span className="text-muted-foreground">Beta Participants</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border"></div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
              <span className="text-muted-foreground text-center sm:text-left">Limited Beta Spots Available</span>
            </div>
          </div>
          
          {/* Testimonials Disclaimer */}
          <p className="text-xs text-[#6B7280] text-center mt-8 max-w-3xl mx-auto">
            *Testimonials represent individual experiences from our pilot program. Results vary and are not guaranteed. Average results may differ.
          </p>
        </div>
      </section>

      {/* Trust & Transparency Section */}
      <TrustTransparencySection />

      {/* Problem Section */}
      <ProblemSection />

      {/* Solution Section */}
      <SolutionSection />

      {/* Unified Dashboard Section */}
      <UnifiedDashboardSection />

      {/* Canadian Market Section */}
      <CanadianSection />

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

      {/* Live Demo Section - Mobile Optimized */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl">{t('home.demo.title')}</h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
              {t('home.demo.description')}
            </p>
            
            {/* Demo Showcase - Touch Optimized */}
            <div 
              className="relative aspect-video rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl overflow-hidden mb-4 sm:mb-6 group cursor-pointer touch-manipulation active:scale-98 transition-transform"
              onClick={() => setIsVideoOpen(true)}
            >
              <img 
                src={demoShowcase} 
                alt="Realtor Desk AI Platform Demo - Dashboard showing property analytics, AI chat, and client management"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 group-active:bg-black/60 transition-colors">
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 text-primary ml-0.5 sm:ml-1" />
                  </div>
                  <p className="text-white font-medium text-sm sm:text-base">{t('home.demo.watchDemo')}</p>
                </div>
              </div>
            </div>
            
            {/* Video Modal */}
            <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
              <DialogContent className="max-w-[95vw] sm:max-w-5xl w-full p-0">
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
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/demo" className="w-full sm:w-auto">
                <Button size="lg" className="btn-gradient w-full sm:w-auto min-h-[52px]">
                  {t('home.demo.bookDemo')}
                </Button>
              </Link>
              <Link to="/features" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto min-h-[52px]">
                  {t('home.demo.exploreFeatures')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Beta Success Stories Section */}
      <BetaSuccessStories />

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
      <HowItWorksSection />

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
            
            {/* ROI Disclaimer */}
            <p className="text-xs text-[#6B7280] text-center mt-8">
              *ROI calculations are projections based on industry averages and pilot program data. Actual results depend on market conditions, lead quality, individual effort, and other factors. Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <MobileOptimizedFAQ />

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

      {/* Beta Program Notice */}
      <section className="py-8 bg-muted/50 border-t">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-sm font-semibold text-foreground mb-3">Beta Program Notice</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              RealtorDesk AI is currently in public beta. We're continuously improving based on user feedback. All features, pricing, and metrics are subject to change. Early adopters receive special lifetime pricing.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
