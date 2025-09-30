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

      {/* Social Proof Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="mb-4">Trusted by Top Canadian Realtors</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Join thousands of agents who have transformed their business with Brainfy AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Brainfy AI helped me close 14 additional deals in Q1 by identifying off-market sellers. The predictive intelligence is incredible."
              name="Sarah Chen"
              title="Agent"
              company="Royal LePage Toronto"
            />
            <TestimonialCard
              quote="The bilingual AI chatbot captures leads 24/7. I wake up to qualified appointments every morning. Game changer."
              name="Marc Dubois"
              title="Broker"
              company="RE/MAX Québec"
            />
            <TestimonialCard
              quote="Transaction management went from chaos to cruise control. My closings are 3 weeks faster and stress-free."
              name="Priya Sharma"
              title="Sales Representative"
              company="Century 21 Vancouver"
            />
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
          <h2 className="mb-6 text-white">Join 2,000+ Canadian Agents Growing Their Business with AI</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Start your 14-day free trial today and experience the future of real estate
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button size="lg" variant="secondary" className="text-lg">
                Start Your 14-Day Free Trial
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" className="text-lg bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                Schedule a Personalized Demo
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/80">
            No credit card required • Cancel anytime • Free onboarding included
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
