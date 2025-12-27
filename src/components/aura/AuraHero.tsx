import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Zap, Play, Star, ArrowRight, CheckCircle, Bot, MessageSquare, Mail } from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import heroDashboardAI from "@/assets/hero-dashboard-ai.jpg";

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
          <main className="z-10 container lg:px-12 grid lg:grid-cols-2 gap-16 mx-auto py-20 px-6 relative items-center">
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
                  Close More Deals Faster with RealtorDesk
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-muted-foreground text-lg leading-relaxed mb-6 max-w-lg font-light">
                Instant follow-ups, CREA DDF integration, and complete PIPEDA compliance
              </p>

              {/* Trust Signals Line */}
              <div className="flex flex-wrap gap-4 mb-10 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Avg. response time: 47 seconds
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  CREA DDF® integrated
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Bilingual EN/FR
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <button className="group flex overflow-hidden uppercase transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(234,88,12,0.5)] focus:outline-none text-sm font-bold text-white tracking-widest rounded-full py-4 px-10 relative items-center justify-center">
                    {/* Animated Border Beam */}
                    <div className="absolute inset-0 -z-20 rounded-full overflow-hidden p-[1px]">
                      <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,hsl(var(--primary))_360deg)]" style={{ animation: 'beam-spin 3s linear infinite' }}></div>
                      <div className="absolute inset-[1px] rounded-full bg-card"></div>
                    </div>

                    {/* Inner Background */}
                    <div className="-z-10 overflow-hidden bg-card rounded-full absolute top-[2px] right-[2px] bottom-[2px] left-[2px]">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-primary/10 blur-2xl rounded-full pointer-events-none transition-colors duration-500 group-hover:bg-primary/30"></div>
                    </div>

                    <span className="relative z-10 text-white/90 transition-colors group-hover:text-white">
                      START YOUR 14-DAY FREE TRIAL
                    </span>
                    <ArrowRight className="relative z-10 ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </Link>

                <Link to="/demo">
                  <button className="hover:bg-white/5 transition-all flex text-base font-medium text-muted-foreground bg-white/5 rounded-full py-4 px-8 items-center justify-center relative overflow-hidden group/btn border border-white/10">
                    <span className="text-base font-medium text-foreground/80 tracking-tight relative z-10">
                      Book Your Free Demo
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
                  <p className="text-muted-foreground italic">"Captured 3 leads in my first 48 hours I would have lost"</p>
                  <p className="text-xs text-muted-foreground mt-1">— Sarah K., Toronto • Join 50+ Canadian agents</p>
                </div>
              </div>
            </div>

            {/* Right Column: Bento Grid */}
            <div className="relative w-full flex items-center justify-center lg:justify-end">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[520px]">
                {/* Left Tall Card: AI Chatbot */}
                <div className="sm:row-span-2 flex flex-col overflow-hidden group hover:border-white/20 transition-all duration-500 bg-secondary rounded-[32px] p-6 relative shadow-xl justify-between min-h-[320px]">
                  <div className="z-10 flex flex-col h-full relative">
                    <div className="self-start inline-flex text-xs font-bold text-green-400 bg-green-500/10 border-green-500/20 border rounded-lg mb-6 py-1.5 px-3 backdrop-blur-lg gap-2 items-center">
                      <CheckCircle className="w-3 h-3" />
                      {t('hero.aiActive', 'AI Active')}
                    </div>

                    <div className="flex flex-col gap-4 mt-auto mb-auto items-center">
                      <div className="flex items-center gap-[3px] h-8 opacity-60">
                        {[3, 8, 6, 4, 5].map((h, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-full ${i > 0 && i < 4 ? 'bg-primary animate-pulse' : 'bg-white/20'}`}
                            style={{ height: `${h * 4}px`, animationDelay: `${i * 0.2}s` }}
                          ></div>
                        ))}
                      </div>

                      <div className="relative w-full">
                        <div className="flex bg-gradient-to-br from-white/10 to-white/0 rounded-xl py-3 px-4 relative shadow-lg backdrop-blur-xl gap-3 items-center border border-white/10">
                          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">{t('hero.processing', 'Processing')}</div>
                            <div className="text-sm font-mono text-white">{t('hero.leadCapture', 'Lead Capture')}</div>
                          </div>
                          <CheckCircle className="w-4 h-4 ml-auto text-green-400" />
                        </div>
                      </div>

                      <button className="flex hover:scale-110 transition-all cursor-pointer text-primary bg-primary/10 w-10 h-10 rounded-full mt-2 backdrop-blur-lg items-center justify-center border border-primary/20">
                        <Zap className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-white tracking-tight mb-2">{t('hero.aiChatbot', '24/7 AI Chatbot')}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed font-light">{t('hero.chatbotDesc', 'Capture leads while you sleep.')}</p>
                    </div>
                  </div>
                </div>

                {/* Right Top: Email Automation */}
                <div className="flex flex-col overflow-hidden group hover:border-white/20 transition-all duration-500 text-center bg-secondary rounded-[32px] p-6 relative shadow-xl items-center min-h-[150px]">
                  <h3 className="relative z-10 text-base font-medium text-foreground/80 mb-4">{t('hero.emailAuto', 'Email Automation')}</h3>
                  <div className="relative z-10 w-full flex justify-center mt-auto h-16 items-end">
                    <div className="relative w-full max-w-[140px] h-full flex items-center justify-center">
                      <div className="absolute w-20 h-px bg-white/10 top-1/2 left-1/2 -translate-x-1/2"></div>
                      <div className="flex -translate-x-12 z-10 text-muted-foreground bg-gradient-to-br from-white/10 to-white/0 w-10 h-10 rounded-lg absolute shadow-lg backdrop-blur-lg items-center justify-center border border-white/10">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="flex z-10 text-muted-foreground bg-gradient-to-br from-white/10 to-white/0 w-10 h-10 rounded-lg absolute shadow-lg backdrop-blur-lg translate-x-12 items-center justify-center border border-white/10">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="absolute w-3 h-3 bg-primary rounded-full z-20 animate-ping"></div>
                    </div>
                  </div>
                </div>

                {/* Right Bottom: Dashboard Preview */}
                <div className="flex flex-col overflow-hidden group hover:border-white/20 transition-all duration-500 bg-secondary rounded-[32px] p-4 relative shadow-xl items-center min-h-[150px] border border-white/5">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <img 
                      src={heroDashboardAI} 
                      alt={t('hero.dashboardAlt', 'RealtorDesk AI Dashboard')}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary to-transparent"></div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-xs text-white/80 font-medium">{t('hero.unifiedDashboard', 'Unified Dashboard')}</p>
                    </div>
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
