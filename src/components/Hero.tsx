import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Play } from "lucide-react";
import heroDashboardAI from "@/assets/hero-dashboard-ai.jpg";

const Hero = () => {
  return <section className="relative pt-20 sm:pt-24 md:pt-28 lg:pt-36 pb-12 sm:pb-16 md:pb-20 lg:pb-28 overflow-hidden">
      {/* Decorative Colored Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-[5%] w-16 h-16 rounded-full bg-[hsl(var(--decorative-purple))] opacity-30 blur-2xl animate-pulse" style={{
        animationDelay: '0s',
        animationDuration: '3s'
      }} />
        <div className="absolute top-[15%] right-[8%] w-32 h-32 rounded-full bg-[hsl(var(--decorative-orange))] opacity-40 blur-3xl animate-pulse" style={{
        animationDelay: '0.5s',
        animationDuration: '4s'
      }} />
        <div className="absolute top-[40%] left-[3%] w-24 h-24 rounded-full bg-[hsl(var(--decorative-blue))] opacity-35 blur-2xl animate-pulse" style={{
        animationDelay: '1s',
        animationDuration: '3.5s'
      }} />
        <div className="absolute bottom-[20%] left-[10%] w-20 h-20 rounded-full bg-[hsl(var(--decorative-pink))] opacity-30 blur-2xl animate-pulse" style={{
        animationDelay: '1.5s',
        animationDuration: '4s'
      }} />
        <div className="absolute bottom-[30%] right-[5%] w-40 h-40 rounded-full bg-[hsl(var(--decorative-yellow))] opacity-25 blur-3xl animate-pulse" style={{
        animationDelay: '2s',
        animationDuration: '5s'
      }} />
        <div className="absolute top-[60%] left-[45%] w-12 h-12 rounded-full bg-[hsl(var(--decorative-green))] opacity-35 blur-xl animate-pulse" style={{
        animationDelay: '0.8s',
        animationDuration: '3s'
      }} />
        <div className="absolute bottom-10 right-[15%] w-28 h-28 rounded-full bg-[hsl(var(--decorative-purple))] opacity-20 blur-3xl animate-pulse" style={{
        animationDelay: '1.2s',
        animationDuration: '4.5s'
      }} />
      </div>

      {/* Large Central Circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-background/60 backdrop-blur-sm border border-border/20 shadow-2xl pointer-events-none hidden lg:block" />
      
      <div className="container-custom relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* 14-Day Free Trial Badge */}
          <div className="flex justify-center mb-4 sm:mb-6 animate-fade-in-up">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold whitespace-nowrap">
              14-DAY FREE TRIAL
            </Badge>
          </div>

          {/* Main Title */}
          <h1 className="mb-4 sm:mb-6 md:mb-8 leading-[1.1] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold animate-fade-in-up animation-delay-200 max-w-4xl mx-auto bg-gradient-to-r from-[hsl(122_39%_49%)] via-[hsl(0_0%_85%)] to-[hsl(0_0%_35%)] bg-clip-text text-transparent px-2 sm:px-0">
            Built for Canadian Realtors. Powered by AI.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed animate-fade-in-up animation-delay-300 max-w-3xl mx-auto">
            Instant follow-ups, Canadian MLS data integration, and PIPEDA-aware data handling
          </p>

          {/* Trust Signals Line */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 animate-fade-in-up animation-delay-350">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-primary" />
              AI responds to leads instantly, 24/7
            </span>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-primary" />
              Canadian MLS data integration
            </span>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-primary" />
              Bilingual EN/FR
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 md:mb-10 animate-fade-in-up animation-delay-400 px-2 sm:px-0">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto min-h-[52px] sm:min-h-[56px] text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap">
                <span className="hidden sm:inline">START YOUR 14-DAY FREE TRIAL →</span>
                <span className="sm:hidden">Start Free Trial →</span>
              </Button>
            </Link>
            <Link to="/demo" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto min-h-[52px] sm:min-h-[56px] text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 rounded-xl border-2 hover:bg-secondary/50 transition-all duration-300 gap-2">
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Book Your Free Demo</span>
                <span className="sm:hidden">Book Demo</span>
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed animate-fade-in-up animation-delay-500 max-w-2xl mx-auto mb-12">
            <span className="italic">"Captured 3 leads in my first 48 hours I would have lost"</span>
            <br />
            <span className="text-xs sm:text-sm">— Sarah K., Toronto • Join 50+ Canadian agents</span>
          </p>

          {/* Hero Image */}
          <div className="relative animate-fade-in-up animation-delay-600 max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 backdrop-blur-sm">
              <img src={heroDashboardAI} alt="Realtor Desk dashboard showing AI automation in action - live call handling, bilingual chat, lead scoring, and automated follow-ups for Canadian real estate agents" className="w-full h-auto" />
              {/* AI Active Indicator */}
              <div className="absolute top-4 right-4 bg-accent text-accent-foreground backdrop-blur-md rounded-lg px-4 py-2.5 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent-foreground rounded-full animate-pulse"></div>
                  <div className="text-sm font-bold uppercase leading-none">🤖 AI Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;