import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserPlus, Link as LinkIcon, Brain, Settings, Rocket, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.jpg";

const HowItWorks = () => {
  // SEO: Update document title and meta for how it works page
  if (typeof document !== 'undefined') {
    document.title = "How Real Estate CRM Works | AI Tools for Realtors Setup Guide | RealtorDesk AI";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Get started with the best CRM for real estate agents in 20 minutes. Easy AI tools for Realtors setup, real estate lead generation software configuration, virtual tour integration.');
    }
  }

  const steps = [
    {
      number: 1,
      icon: UserPlus,
      title: "Sign Up",
      time: "2 minutes",
      description: "Create your account and choose your plan. No credit card required for 14-day trial.",
      details: [
        "Enter your name, email, and brokerage info",
        "Choose your subscription tier",
        "Verify your email address",
        "Access your dashboard immediately"
      ]
    },
    {
      number: 2,
      icon: LinkIcon,
      title: "Connect Your Tools",
      time: "5 minutes",
      description: "Link your CRM, email, website, and phone system with simple one-click integrations.",
      details: [
        "Connect existing CRM (Follow Up Boss, Brivity, etc.)",
        "Link Gmail or Outlook email",
        "Add website widget code snippet",
        "Import existing contacts (CSV or direct sync)"
      ]
    },
    {
      number: 3,
      icon: Brain,
      title: "Train Your AI",
      time: "10 minutes",
      description: "Teach the AI about your properties, style, and preferences. Our wizard makes it easy.",
      details: [
        "Upload current listings and property info",
        "Add frequently asked questions",
        "Define your communication style",
        "Set qualification criteria for leads",
        "Configure notification preferences"
      ]
    },
    {
      number: 4,
      icon: Settings,
      title: "Customize",
      time: "5 minutes",
      description: "Fine-tune greetings, response templates, and escalation rules to match your workflow.",
      details: [
        "Customize chatbot greeting messages",
        "Set business hours and after-hours behavior",
        "Create response templates",
        "Define when to escalate to human",
        "Configure lead routing rules"
      ]
    },
    {
      number: 5,
      icon: Rocket,
      title: "Go Live",
      time: "Instant",
      description: "Flip the switch and watch your AI team start capturing and qualifying leads 24/7.",
      details: [
        "Enable chatbot on your website",
        "Activate email automation",
        "Turn on voice agent",
        "Start receiving lead notifications",
        "Monitor dashboard for real-time activity"
      ]
    },
    {
      number: 6,
      icon: TrendingUp,
      title: "Optimize & Scale",
      time: "Ongoing",
      description: "Review analytics, improve responses, and watch your conversion rates soar.",
      details: [
        "Review weekly performance reports",
        "Refine AI responses based on data",
        "A/B test different approaches",
        "Scale up as you grow",
        "Access ongoing support & training"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-secondary/10 to-primary/10">
        <div className="container-custom text-center">
          <h1 className="mb-6 animate-fade-in-up">
            Get Up and Running in <span className="gradient-text">20 Minutes</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            From signup to capturing leads in less time than it takes to drive to a showing. No technical skills required.
          </p>
        </div>
      </section>

      {/* Step-by-Step Timeline */}
      <section className="section-padding">
        <div className="container-custom max-w-6xl">
          <div className="space-y-12">
            {steps.map((step, idx) => (
              <div key={step.number} className="relative animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Left: Visual */}
                  <div className={`${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                    <Card className="p-8 card-hover">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center text-2xl font-bold">
                          {step.number}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{step.title}</h3>
                          <p className="text-sm text-muted-foreground">⏱️ {step.time}</p>
                        </div>
                      </div>
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <step.icon className="w-10 h-10 text-primary" />
                      </div>
                    </Card>
                  </div>

                  {/* Right: Details */}
                  <div className={`${idx % 2 === 1 ? 'md:order-1' : ''}`}>
                    <p className="text-lg text-muted-foreground mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIdx) => (
                        <li key={detailIdx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Connector Line */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-12">
                    <ArrowRight className="w-8 h-8 text-primary rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="mb-6">Your Command Center Awaits</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Everything you need to manage leads, conversations, and deals in one beautiful interface
            </p>
            
            <div className="rounded-2xl overflow-hidden shadow-2xl mb-8">
              <img
                src={heroDashboard}
                alt="Realtor Desk AI Dashboard"
                className="w-full"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <h3 className="font-bold mb-2">Unified Inbox</h3>
                <p className="text-sm text-muted-foreground">All conversations in one place</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-bold mb-2">AI Insights</h3>
                <p className="text-sm text-muted-foreground">Smart lead scoring & recommendations</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-bold mb-2">Real-time Analytics</h3>
                <p className="text-sm text-muted-foreground">Track performance & ROI</p>
              </Card>
            </div>

            <Link to="/signup">
              <Button size="lg" className="btn-gradient">
                Start Your 14-Day Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="text-center">
              <h2 className="mb-4">We're Here to Help Every Step</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our Canadian-based support team ensures you never feel stuck
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div>
                  <h3 className="font-bold mb-2">📚 Video Tutorials</h3>
                  <p className="text-sm text-muted-foreground">Step-by-step guides for every feature</p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">💬 Live Chat</h3>
                  <p className="text-sm text-muted-foreground">Instant answers during business hours</p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">🎓 Free Onboarding</h3>
                  <p className="text-sm text-muted-foreground">Personalized setup assistance</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                <strong>Average setup time: 22 minutes</strong> (based on 500+ agent onboardings)
              </p>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
