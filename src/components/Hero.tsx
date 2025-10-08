import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Play } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.jpg";

const Hero = () => {
  return (
    <section className="relative pt-32 md:pt-40 pb-20 md:pb-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 hero-gradient -z-10" />
      
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="animate-fade-in-up">
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                <CheckCircle className="w-3 h-3" />
                CREA Certified
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                <CheckCircle className="w-3 h-3" />
                SOC 2 Compliant
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                <CheckCircle className="w-3 h-3" />
                2,000+ Canadian Agents
              </span>
            </div>

            <h1 className="mb-6">
              Transform Your Real Estate Business with{" "}
              <span className="gradient-text">AI-Powered Intelligence</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              The only AI platform built specifically for Canadian realtors - featuring CREA DDF® integration, 
              bilingual capabilities, and predictive analytics that increase conversions by 300%
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/demo">
                <Button size="lg" className="btn-gradient text-lg w-full sm:w-auto">
                  Start Closing More Deals
                </Button>
              </Link>
            </div>

            {/* Trust Line */}
            <p className="text-sm text-muted-foreground">
              No credit card required • Cancel anytime • Free onboarding included
            </p>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative animate-fade-in animation-delay-200">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroDashboard}
                alt="Realtor Desk AI Dashboard showing AI analytics, property listings, and chat interface"
                className="w-full h-auto"
              />
              {/* Floating Badge */}
              <div className="absolute top-6 right-6 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg animate-scale-in animation-delay-400">
                <div className="text-3xl font-bold gradient-text">300%</div>
                <div className="text-xs text-muted-foreground">Conversion Increase</div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
