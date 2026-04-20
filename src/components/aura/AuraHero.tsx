import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Zap, Play, Star, ArrowRight, CheckCircle, Bot, MessageSquare, Mail, Users } from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import heroAgentsTablet from "@/assets/hero-agents-tablet.jpg";

const AuraHero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen pt-20 sm:pt-28 lg:pt-40 pb-20">
      {/* Vertical Lines Background */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center w-full max-w-7xl mx-auto px-6">
        <div className="w-full h-full border-x border-dashed border-white/5 flex justify-center relative">
          <div className="h-full w-px bg-white/5 absolute left-1/4"></div>
          <div className="h-full w-px bg-white/5"></div>
          <div className="h-full w-px bg-white/5 absolute right-1/4"></div>
        </div>
      </div>

      <SpotlightCard className="mx-4 sm:mx-6 max-w-7xl xl:mx-auto z-10">
        <div className="flex flex-col min-h-[800px] lg:min-h-[700px] z-10 justify-center relative">
          {/* Section Number */}
          <div className="absolute top-8 right-8 z-20 pointer-events-none">
            <span className="font-mono text-sm font-bold text-white/10 tracking-widest">01</span>
          </div>

          {/* Inner Background Grid */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20 grid-pattern"></div>

          {/* Main Hero Content */}
          <main className="z-10 container lg:px-12 grid lg:grid-cols-2 gap-12 mx-auto py-20 px-6 relative items-center">
            {/* Left Column: Text */}
            <div className="max-w-2xl relative">
              {/* Badge */}
              <div className="aura-badge mb-6">
                <Zap className="w-4 h-4" />
                {t('hero.badge', '14-Day Free Trial')}
              </div>

              {/* Main Title */}
              <div className="relative mb-8">
                <div className="absolute inset-0 blur-3xl bg-primary/20 animate-pulse-glow rounded-full scale-150 -z-10"></div>
                <h1 className="lg:text-6xl leading-[1.05] text-4xl sm:text-5xl tracking-tighter gradient-text-animated relative">
                  {t('hero.title', 'Close More Deals Faster with RealtorDesk')}
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-muted-foreground text-lg leading-relaxed mb-6 max-w-lg font-light">
                {t('hero.subtitle', 'Instant follow-ups, PIPEDA-aware data handling, and bilingual EN/FR')}
              </p>

              {/* Trust Signals Line */}
              <div className="flex flex-wrap gap-4 mb-10 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  {t('hero.bullet1', 'AI responds to leads instantly, 24/7')}
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  {t('hero.bullet2', 'Built for Canadian agents — PIPEDA, CASL, bilingual EN/FR')}
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  {t('hero.bullet3', 'Bilingual EN/FR')}
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <button className="group flex overflow-hidden uppercase transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(234,88,12,0.5)] focus:outline-none text-sm font-bold text-white tracking-widest rounded-full py-4 px-10 relative items-center justify-center">
                    <div className="absolute inset-0 -z-20 rounded-full overflow-hidden p-[1px]">
                      <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,hsl(var(--primary))_360deg)]" style={{ animation: 'beam-spin 3s linear infinite' }}></div>
                      <div className="absolute inset-[1px] rounded-full bg-card"></div>
                    </div>
                    <div className="-z-10 overflow-hidden bg-card rounded-full absolute top-[2px] right-[2px] bottom-[2px] left-[2px]">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-primary/10 blur-2xl rounded-full pointer-events-none transition-colors duration-500 group-hover:bg-primary/30"></div>
                    </div>
                    <span className="relative z-10 text-white/90 transition-colors group-hover:text-white">
                      {t('hero.getStarted', 'START YOUR 14-DAY FREE TRIAL')}
                    </span>
                    <ArrowRight className="relative z-10 ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </Link>

                <Link to="/demo">
                  <button className="hover:bg-white/5 transition-all flex text-base font-medium text-muted-foreground bg-white/5 rounded-full py-4 px-8 items-center justify-center relative overflow-hidden group/btn border border-white/10">
                    <span className="text-base font-medium text-foreground/80 tracking-tight relative z-10">
                      {t('hero.watchDemo', 'Book Your Free Demo')}
                    </span>
                    <Play className="w-4 h-4 ml-2 opacity-70 relative z-10 group-hover/btn:scale-110 transition-transform" fill="currentColor" />
                  </button>
                </Link>
              </div>

              {/* Social Proof */}
              <div className="mt-12 flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-card bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xs font-bold text-primary">JM</div>
                  <div className="w-10 h-10 rounded-full border-2 border-card bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center text-xs font-bold text-blue-400">SK</div>
                  <div className="w-10 h-10 rounded-full border-2 border-card bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center text-xs font-bold text-green-400">ML</div>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground italic">{t('hero.testimonial', '"Captured 3 leads in my first 48 hours I would have lost"')}</p>
                  <p className="text-xs text-muted-foreground mt-1">— Sarah K., Toronto • {t('hero.joinAgents', 'Join 50+ Canadian agents')}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Professional Hero Image */}
            <div className="relative w-full flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-[560px]">
                <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-white/10">
                  <img
                    src={heroAgentsTablet}
                    alt={t('hero.imageAlt', 'Professional real estate agents using RealtorDesk on tablet')}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
                </div>

                <div className="absolute -top-4 -right-4 bg-card/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/10 hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">{t('hero.activeAgents', 'Active Agents')}</div>
                      <div className="text-lg font-bold text-white">+999 {t('hero.leads', 'Leads')}</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-card/90 backdrop-blur-xl rounded-2xl py-3 px-4 shadow-xl border border-white/10 hidden sm:block">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-white">{t('hero.aiActive', 'AI Active')}</span>
                    <span className="text-xs text-muted-foreground">• 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Trust Line */}
          <p className="text-xs sm:text-sm text-muted-foreground text-center px-6 pb-8 max-w-2xl mx-auto">
            {t('hero.trustLine')}
          </p>
        </div>
      </SpotlightCard>
    </section>
  );
};

export default AuraHero;
