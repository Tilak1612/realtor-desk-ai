import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Zap, Play, Star, ArrowRight, CheckCircle, Bot, BarChart2, Sparkles, Bold, Italic, LinkIcon } from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import heroDashboardAI from "@/assets/hero-dashboard-ai.jpg";

const AudioWave = () => (
  <div className="flex items-center gap-1 h-10">
    {[16, 24, 32, 20, 12].map((height, i) => (
      <div
        key={i}
        className="w-1 bg-primary rounded-sm animate-audio-wave"
        style={{ 
          height: `${height}px`,
          animationDelay: `${i * 0.1}s`
        }}
      />
    ))}
  </div>
);

const AuraHero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen pt-32 lg:pt-40 pb-20">
      {/* Background Image Overlay */}
      <div className="fixed inset-0 -z-50 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-b from-background via-background/95 to-background"></div>
      </div>

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
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-8">
                <Zap className="w-3.5 h-3.5" />
                {t('hero.badge', '14-Day Free Trial')}
              </div>

              {/* Main Title */}
              <h1 className="lg:text-7xl leading-[1.05] text-4xl sm:text-5xl md:text-6xl font-semibold mb-8 tracking-tight text-white">
                {t('hero.titlePart1', 'Transform Your')}
                <br />
                <span className="text-muted-foreground">{t('hero.titlePart2', 'Real Estate')}</span>
                {' '}{t('hero.titlePart3', 'With')}
                <br />
                <span className="text-primary">{t('hero.titlePart4', 'AI Power')}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg">
                {t('hero.subtitle')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-5">
                <Link to="/signup">
                  <button className="group relative flex items-center justify-center gap-3 bg-card text-white px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-card/80 transition-all border border-white/10 shadow-lg hover:shadow-primary/10 hover:border-primary/30">
                    {t('hero.getStarted', 'Start Your 14-Day Free Trial')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>

                <Link to="/demo">
                  <button className="group flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-white/10 text-white hover:bg-white/5 transition-all text-sm font-medium">
                    {t('hero.watchDemo', 'Book Your Free Demo')}
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <Play className="w-3 h-3 ml-0.5" fill="currentColor" />
                    </div>
                  </button>
                </Link>
              </div>

              {/* Avatar Group / Social Proof */}
              <div className="mt-12 flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-card bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xs font-bold text-primary">JM</div>
                  <div className="w-10 h-10 rounded-full border-2 border-card bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center text-xs font-bold text-blue-400">SK</div>
                  <div className="w-10 h-10 rounded-full border-2 border-card bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center text-xs font-bold text-green-400">ML</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p className="text-white font-medium">{t('hero.socialProof', 'Join 50+ Beta Realtors')}</p>
                  <div className="flex items-center gap-1 text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Bento Grid */}
            <div className="relative w-full">
              <div className="grid grid-cols-2 gap-5 h-[500px]">
                {/* Card 1: AI Chatbot (Tall Left) */}
                <div className="bento-card col-span-1 row-span-2 p-8 flex flex-col justify-between relative group overflow-hidden bg-card rounded-3xl border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-0.5">
                  {/* Gradient Glow */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>

                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[11px] font-semibold uppercase tracking-wider">
                      <CheckCircle className="w-2.5 h-2.5" />
                      {t('hero.aiActive', 'AI Active')}
                    </div>
                  </div>

                  {/* Visual: Animated Interactions */}
                  <div className="relative flex-1 flex flex-col items-center justify-center py-8">
                    {/* Audio Wave */}
                    <div className="mb-8">
                      <AudioWave />
                    </div>

                    {/* Floating Notification Card */}
                    <div className="glass-panel p-4 rounded-xl flex items-center gap-4 w-full max-w-[220px] shadow-2xl animate-float bg-card/50 backdrop-blur-md border border-white/5">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                          {t('hero.processing', 'Processing')}
                        </div>
                        <div className="text-sm text-white font-medium leading-none">
                          {t('hero.leadCapture', 'Lead Capture')}
                        </div>
                      </div>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>

                  {/* Footer Content */}
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-full bg-card border border-white/10 flex items-center justify-center text-primary mb-4">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-1">
                      {t('hero.aiChatbot', '24/7 AI Chatbot')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('hero.chatbotDesc', 'Capture leads while you sleep.')}
                    </p>
                  </div>
                </div>

                {/* Card 2: Email Automation (Top Right) */}
                <div className="bento-card col-span-1 h-[240px] p-6 relative bg-card rounded-3xl border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden group flex flex-col">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] pointer-events-none"></div>
                  
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <h3 className="text-sm font-medium text-foreground/80">
                      {t('hero.emailAuto', 'Smart Email')}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/75 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                      <span className="text-[10px] font-medium text-primary">
                        AI Active
                      </span>
                    </div>
                  </div>

                  {/* Email Editor Mock */}
                  <div className="relative z-10 flex-1 bg-background/40 rounded-lg border border-white/10 flex flex-col overflow-hidden backdrop-blur-sm transition-colors group-hover:border-white/20">
                    {/* Toolbar */}
                    <div className="h-9 border-b border-white/5 flex items-center px-3 gap-3 bg-white/[0.02]">
                      <div className="flex items-center gap-1.5 opacity-50">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/60"></div>
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/60"></div>
                      </div>
                      <div className="h-3 w-px bg-white/10"></div>
                      <div className="flex items-center gap-2.5 text-muted-foreground">
                        <Bold className="w-3 h-3 hover:text-foreground transition-colors cursor-pointer" />
                        <Italic className="w-3 h-3 hover:text-foreground transition-colors cursor-pointer" />
                        <LinkIcon className="w-3 h-3 hover:text-foreground transition-colors cursor-pointer" />
                      </div>
                      <div className="flex-1"></div>
                      <div className="flex items-center gap-1.5 text-primary bg-primary/10 px-2 py-0.5 rounded text-[10px] font-medium border border-primary/20">
                        <Sparkles className="w-2.5 h-2.5" />
                        Write
                      </div>
                    </div>
                    <div className="p-4 space-y-2.5">
                      <div className="flex gap-2 mb-2">
                        <div className="w-8 h-2 bg-muted-foreground/30 rounded-sm"></div>
                        <div className="w-20 h-2 bg-muted-foreground/20 rounded-sm"></div>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full"></div>
                      <div className="h-1.5 w-5/6 bg-muted rounded-full"></div>
                      <div className="h-1.5 w-4/6 bg-muted rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Unified Dashboard (Bottom Right) */}
                <div className="bento-card col-span-1 h-[240px] relative group overflow-hidden rounded-3xl border border-white/5 hover:border-white/10 transition-all duration-300">
                  <img 
                    src={heroDashboardAI} 
                    alt={t('hero.dashboardAlt', 'Dashboard')}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <h3 className="text-sm font-medium text-white mb-1">
                      {t('hero.unifiedDashboard', 'Unified Dashboard')}
                    </h3>
                    <div className="flex gap-1 mt-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60"></div>
                    </div>
                  </div>

                  {/* Floating Mini UI element */}
                  <div className="absolute top-6 left-6 right-6 bg-card/80 backdrop-blur-md border border-white/10 rounded-lg p-3 flex items-center gap-3 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <BarChart2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground">Total Leads</div>
                      <div className="text-xs font-bold text-white">
                        1,248
                        <span className="text-green-500 font-normal ml-1">+12%</span>
                      </div>
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
