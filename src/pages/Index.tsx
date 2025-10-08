import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import StatCard from "@/components/StatCard";
import TestimonialCard from "@/components/TestimonialCard";
import ROICalculator from "@/components/ROICalculator";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  MessageSquare, 
  ClipboardCheck, 
  AlertCircle, 
  Zap, 
  TrendingDown,
  FileText,
  MapPin,
  CheckCircle
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />

      {/* Trust & Integration Partners Section */}
      <section className="section-padding bg-background border-y">
        <div className="container-custom">
          <h2 className="text-center mb-12">Trusted by 500+ Canadian Real Estate Professionals</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center justify-items-center max-w-4xl mx-auto mb-16 opacity-60">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-2" />
              <p className="font-semibold">CREA Certified</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-2" />
              <p className="font-semibold">Google Partner</p>
            </div>
            <div className="text-center">
              <Brain className="w-16 h-16 mx-auto mb-2" />
              <p className="font-semibold">Microsoft AI</p>
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
              title="Predictive Lead Intelligence"
              description="AI identifies high-probability buyers/sellers 3-6 months before they list, increasing conversion rates from 5% to 18%"
              gradient
            />
            <FeatureCard
              icon={MessageSquare}
              title="24/7 Bilingual AI Agent"
              description="Engage leads in English or French, qualify prospects, and schedule showings automatically - even at 2 AM"
              gradient
            />
            <FeatureCard
              icon={ClipboardCheck}
              title="Intelligent Transaction Management"
              description="Reduce closing time from 60 days to 35 days with AI-powered coordination and risk prediction"
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

      {/* Canadian-Specific Features Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="mb-4">Built for the Canadian Real Estate Market</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Not adapted - designed from the ground up for Canadian realtors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={FileText}
              title="CREA DDF® Integration"
              description="Access national MLS data seamlessly"
            />
            <FeatureCard
              icon={CheckCircle}
              title="Provincial Compliance Engine"
              description="Automatic adherence to RECO, BCFSA, RECA regulations"
            />
            <FeatureCard
              icon={MessageSquare}
              title="True Bilingual AI"
              description="Not just translation, contextual English-French communication"
            />
            <FeatureCard
              icon={MapPin}
              title="Canadian Market Intelligence"
              description="CMHC data, Bank of Canada rates, provincial policies integrated"
            />
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
