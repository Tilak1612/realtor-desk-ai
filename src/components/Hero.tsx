import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Play } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.jpg";

const Hero = () => {
  return (
    <section className="relative pt-24 sm:pt-28 md:pt-32 lg:pt-40 pb-16 sm:pb-20 md:pb-24 lg:pb-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 hero-gradient -z-10" />
      
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="animate-fade-in-up order-2 lg:order-1">
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
              <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] sm:text-xs font-medium">
                <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="whitespace-nowrap">CREA Certified</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] sm:text-xs font-medium">
                <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="whitespace-nowrap">SOC 2 Compliant</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] sm:text-xs font-medium">
                <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="whitespace-nowrap">2,000+ Canadian Agents</span>
              </span>
            </div>

            <h1 className="mb-4 sm:mb-6 leading-tight">
              Transform Your Real Estate Business with{" "}
              <span className="gradient-text">AI-Powered Intelligence</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
              The only AI platform built specifically for Canadian realtors - featuring CREA DDF® integration, 
              bilingual capabilities, and predictive analytics that increase conversions by 300%
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Link to="/demo" className="w-full sm:w-auto">
                <Button size="lg" className="btn-gradient text-base sm:text-lg w-full sm:w-auto">
                  Start Closing More Deals
                </Button>
              </Link>
            </div>

            {/* Trust Line */}
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              No credit card required • Cancel anytime • Free onboarding included
            </p>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative animate-fade-in animation-delay-200 order-1 lg:order-2">
            <div className="relative rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl md:shadow-2xl">
              <img
                src={heroDashboard}
                alt="Realtor Desk AI Dashboard showing AI analytics, property listings, and chat interface"
                className="w-full h-auto"
              />
              {/* Floating Badge */}
              <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 md:top-3 md:right-3 bg-background/95 backdrop-blur-sm rounded px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 shadow-md animate-scale-in animation-delay-400">
                <div className="text-sm sm:text-base md:text-lg font-bold gradient-text leading-none">300%</div>
                <div className="text-[8px] sm:text-[9px] text-muted-foreground mt-0.5">Increase</div>
              </div>
            </div>

            {/* Decorative Elements - Hidden on very small screens */}
            <div className="hidden sm:block absolute -top-10 -right-10 w-32 h-32 md:w-40 md:h-40 bg-primary/20 rounded-full blur-3xl -z-10" />
            <div className="hidden sm:block absolute -bottom-10 -left-10 w-32 h-32 md:w-40 md:h-40 bg-secondary/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
