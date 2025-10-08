import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { Brain } from "lucide-react";

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  const pricingData = {
    starter: {
      monthly: 99,
      yearly: 99 * 12 * 0.85, // 15% discount
      discount: "15%"
    },
    professional: {
      monthly: 249,
      yearly: 249 * 12 * 0.80, // 20% discount
      discount: "20%"
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <h1 className="mb-6 animate-fade-in-up">
            Transparent Pricing for <span className="gradient-text">Every Stage of Your Business</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Choose the perfect plan for your business needs
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8 animate-fade-in-up animation-delay-300">
            <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-8 rounded-full p-0 border-2"
            >
              <div className={`absolute w-6 h-6 rounded-full bg-primary transition-transform ${isYearly ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </Button>
            <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            <span className="text-sm font-semibold text-accent">
              Save up to 25%
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <PricingCard
              name="STARTER"
              price={isYearly ? Math.round(pricingData.starter.yearly / 12).toString() : pricingData.starter.monthly.toString()}
              description="Best for: Solo agents and new licensees"
              billingPeriod={isYearly ? "year" : "month"}
              discount={isYearly ? pricingData.starter.discount : undefined}
              yearlyPrice={isYearly ? pricingData.starter.yearly : undefined}
              features={[
                "Up to 500 contacts",
                "Predictive lead scoring",
                "Basic AI chatbot (website only)",
                "Email automation (1,000 emails/month)",
                "Mobile app access",
                "CREA DDF® integration",
                "1 team member",
                "Email support",
              ]}
              ctaText="Start Closing More Deals"
              ctaLink="/demo"
            />

            <PricingCard
              name="PROFESSIONAL"
              price={isYearly ? Math.round(pricingData.professional.yearly / 12).toString() : pricingData.professional.monthly.toString()}
              description="Best for: Individual agents and small teams"
              billingPeriod={isYearly ? "year" : "month"}
              discount={isYearly ? pricingData.professional.discount : undefined}
              yearlyPrice={isYearly ? pricingData.professional.yearly : undefined}
              features={[
                "Unlimited contacts",
                "Advanced AI chatbot (SMS, email, social media)",
                "Conversational intelligence & sentiment analysis",
                "Transaction management with AI orchestration",
                "Marketing automation & content generation",
                "Predictive market intelligence",
                "5 team members",
                "Phone & chat support",
                "Custom integrations",
              ]}
              popular
              ctaText="Start Closing More Deals"
              ctaLink="/demo"
            />

            <PricingCard
              name="ENTERPRISE"
              price="Custom"
              description="Best for: Brokerages and large teams"
              features={[
                "Unlimited team members",
                "White-label options",
                "Advanced analytics & reporting",
                "Dedicated account manager",
                "Custom AI model training",
                "API access",
                "Priority 24/7 support",
                "Brokerage compliance tools",
                "Multi-office management",
              ]}
              ctaText="Book Your Free Demo"
              ctaLink="/demo"
            />
          </div>
        </div>
      </section>

      {/* Add-Ons Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <h2 className="text-center mb-12">Enhance Your Plan with Add-Ons</h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold gradient-text mb-2">$49/month</div>
              <h3 className="font-bold mb-2">Virtual Staging AI</h3>
              <p className="text-sm text-muted-foreground">Unlimited virtual staging for all your listings</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-2xl font-bold gradient-text mb-2">$79/month</div>
              <h3 className="font-bold mb-2">Advanced Market Reports</h3>
              <p className="text-sm text-muted-foreground">Branded reports with your logo and branding</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-2xl font-bold gradient-text mb-2">$199/month</div>
              <h3 className="font-bold mb-2">Lead Generation Module</h3>
              <p className="text-sm text-muted-foreground">Targeted seller/buyer lead identification</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Guarantees Section */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-center mb-12">Our Guarantees to You</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-8 text-center">
              <Shield className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">30-Day Money-Back Guarantee</h3>
              <p className="text-muted-foreground">
                Close at least one additional deal in your first 30 days or get a full refund. No questions asked.
              </p>
            </Card>
            
            <Card className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">No Contracts, Cancel Anytime</h3>
              <p className="text-muted-foreground">
                All plans are month-to-month. Cancel anytime with one click. No penalties, no hassles.
              </p>
            </Card>
            
            <Card className="p-8 text-center">
              <Brain className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Free Setup & Migration</h3>
              <p className="text-muted-foreground">
                We'll migrate your contacts and data from any CRM for free. Plus complimentary onboarding and training.
              </p>
            </Card>
          </div>
          
          <Card className="p-12 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <Shield className="w-20 h-20 text-accent flex-shrink-0" />
              <div>
                <h2 className="mb-4">Our Promise: See Results in 30 Days or Your Money Back</h2>
                <p className="text-lg text-muted-foreground">
                  We're so confident in our platform that we guarantee you'll close at least one additional deal in your first 30 days, or we'll refund your entire subscription.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom max-w-3xl">
          <h2 className="text-center mb-12">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-background rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                Do I need to sign a long-term contract?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                No, all plans are month-to-month with no commitment. Cancel anytime without penalty.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-background rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                Is CREA DDF® integration included?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes, native CREA DDF® integration is included in all plans at no extra cost.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-background rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                Can I try before I buy?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Absolutely! Schedule a personalized demo to see all features in action before making your decision.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-background rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                What if I exceed my contact limit?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We'll notify you when you're approaching your limit, and you can upgrade to the next tier seamlessly without losing any data.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-background rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                Do you offer training?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes, free onboarding and training are included with all plans. We'll help you get up and running quickly.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
