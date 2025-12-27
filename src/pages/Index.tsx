import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import MobileCTA from "@/components/MobileCTA";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import ChatWidget from "@/components/ChatWidget";
import ROICalculator from "@/components/ROICalculator";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  Brain, 
  MessageSquare, 
  ClipboardCheck, 
  Shield,
  Play,
  CheckCircle,
  Zap,
  FileText,
  ArrowRight
} from "lucide-react";

// Aura Components
import AuraHero from "@/components/aura/AuraHero";
import AuraProblemSection from "@/components/aura/AuraProblemSection";
import AuraSolutionSection from "@/components/aura/AuraSolutionSection";
import AuraStatsSection from "@/components/aura/AuraStatsSection";
import AuraFeatureGrid from "@/components/aura/AuraFeatureGrid";
import AuraCTASection from "@/components/aura/AuraCTASection";
import AuraSection from "@/components/aura/AuraSection";
import AuraCard from "@/components/aura/AuraCard";
import SpotlightCard from "@/components/aura/SpotlightCard";

import BetaSuccessStories from "@/components/BetaSuccessStories";
import DemoBookingSection from "@/components/DemoBookingSection";
import AudienceSegments from "@/components/AudienceSegments";
import demoShowcase from "@/assets/demo-showcase.jpg";

const DEMO_VIDEO_URL = "https://app.heygen.com/embeds/4c80de4c5d7a4392b50941050220df54";

const Index = () => {
  const { t } = useTranslation();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-background">
      <Navbar />
      <CookieConsent />
      <ExitIntentPopup />
      <ChatWidget />
      <MobileCTA />
      
      {/* Hero Section */}
      <AuraHero />

      {/* Audience Segments - For Agents, Teams, Brokers */}
      <AudienceSegments />

      {/* Live Social Proof Bar */}
      <SpotlightCard className="mx-4 sm:mx-6 max-w-7xl xl:mx-auto mt-4">
        <div className="bg-card rounded-[40px] py-6 px-6 sm:px-12">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-muted-foreground">{t('indexPage.socialProof.banner')}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border"></div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="font-semibold text-white">50+</span>
              <span className="text-muted-foreground">{t('indexPage.socialProof.betaParticipants')}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border"></div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">{t('indexPage.socialProof.limitedSpots')}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-6 max-w-3xl mx-auto">
            {t('betaCommunity.testimonialDisclaimer')}
          </p>
        </div>
      </SpotlightCard>

      {/* Trust & Transparency Section */}
      <AuraSection
        sectionNumber="02"
        badge={t('trustTransparency.badge', 'Trust & Transparency')}
        badgeIcon={<Shield className="w-4 h-4" />}
        title={t('trustTransparency.title', 'Built on Honesty')}
        subtitle={t('trustTransparency.subtitle', 'We believe in transparent communication about our beta program')}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <AuraCard className="text-center">
            <Zap className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">{t('trustTransparency.beta.title', 'Beta Program')}</h3>
            <p className="text-sm text-muted-foreground">{t('trustTransparency.beta.desc', 'Early access with special pricing')}</p>
          </AuraCard>
          <AuraCard className="text-center">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">{t('trustTransparency.results.title', 'Real Results')}</h3>
            <p className="text-sm text-muted-foreground">{t('trustTransparency.results.desc', 'Verified testimonials from beta users')}</p>
          </AuraCard>
          <AuraCard className="text-center">
            <Shield className="w-8 h-8 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">{t('trustTransparency.security.title', 'Security First')}</h3>
            <p className="text-sm text-muted-foreground">{t('trustTransparency.security.desc', 'Enterprise-grade data protection')}</p>
          </AuraCard>
          <AuraCard className="text-center">
            <FileText className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">{t('trustTransparency.canadian.title', 'Canadian Built')}</h3>
            <p className="text-sm text-muted-foreground">{t('trustTransparency.canadian.desc', 'Made for Canadian realtors')}</p>
          </AuraCard>
        </div>
      </AuraSection>

      {/* Problem Section */}
      <AuraProblemSection />

      {/* Solution Section */}
      <AuraSolutionSection />

      {/* Stats Section */}
      <AuraStatsSection />

      {/* Feature Grid / Credibility */}
      <AuraFeatureGrid />

      {/* Live Demo Section */}
      <AuraSection
        sectionNumber="05"
        badge={t('home.demo.badge', 'See It In Action')}
        badgeIcon={<Play className="w-4 h-4" />}
        title={t('home.demo.title')}
        subtitle={t('home.demo.description')}
      >
        <div className="max-w-4xl mx-auto">
          <div 
            className="relative aspect-video rounded-[24px] shadow-2xl overflow-hidden mb-8 group cursor-pointer border border-white/10"
            onClick={() => {
              const consentString = localStorage.getItem("cookie-consent");
              let canLoadVideo = false;
              if (consentString) {
                const consentData = JSON.parse(consentString);
                if (consentData.analytics || consentData.marketing) {
                  canLoadVideo = true;
                }
              }
              if (canLoadVideo && DEMO_VIDEO_URL) {
                setVideoSrc(DEMO_VIDEO_URL);
                setIsVideoOpen(true);
              } else if (!DEMO_VIDEO_URL) {
                setIsVideoOpen(true);
              } else {
                alert("Please accept marketing or analytics cookies via the banner at the bottom to watch the video.");
              }
            }}
          >
            <img 
              src={demoShowcase} 
              alt="Realtor Desk platform demo"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 text-white ml-1" fill="currentColor" />
                </div>
                <p className="text-white font-medium">{t('home.demo.watchDemo')}</p>
              </div>
            </div>
          </div>
          
          <Dialog open={isVideoOpen} onOpenChange={(open) => {
            setIsVideoOpen(open);
            if (!open) setVideoSrc("");
          }}>
            <DialogContent className="max-w-[95vw] sm:max-w-5xl w-full p-0 overflow-hidden bg-card border-white/10">
              <DialogTitle className="sr-only">Product Demo Video</DialogTitle>
              <DialogDescription className="sr-only">
                Watch our product demo showcasing Realtor Desk features
              </DialogDescription>
              <div className="relative aspect-video w-full bg-black">
                {videoSrc ? (
                  <iframe
                    src={videoSrc}
                    title="Realtor Desk Product Demo"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary">
                    <p className="text-muted-foreground">Please add your demo video URL</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <button className="group flex overflow-hidden uppercase transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(234,88,12,0.5)] focus:outline-none text-sm font-bold text-white tracking-widest rounded-full py-4 px-10 relative items-center justify-center">
                <div className="absolute inset-0 -z-20 rounded-full overflow-hidden p-[1px]">
                  <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,hsl(var(--primary))_360deg)]" style={{ animation: 'beam-spin 3s linear infinite' }}></div>
                  <div className="absolute inset-[1px] rounded-full bg-card"></div>
                </div>
                <div className="-z-10 overflow-hidden bg-card rounded-full absolute top-[2px] right-[2px] bottom-[2px] left-[2px]">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-primary/10 blur-2xl rounded-full pointer-events-none transition-colors duration-500 group-hover:bg-primary/30"></div>
                </div>
                <span className="relative z-10">{t('home.demo.bookDemo')}</span>
                <ArrowRight className="relative z-10 ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Link>
            <Link to="/features">
              <button className="hover:bg-white/10 transition-all flex text-base font-medium text-foreground bg-white/5 rounded-full py-4 px-8 items-center justify-center border border-white/10">
                {t('home.demo.exploreFeatures')}
              </button>
            </Link>
          </div>
        </div>
      </AuraSection>

      {/* Beta Success Stories */}
      <SpotlightCard className="mx-4 sm:mx-6 max-w-7xl xl:mx-auto mt-4">
        <div className="bg-card rounded-[40px] py-16 px-6 sm:px-12">
          <BetaSuccessStories />
        </div>
      </SpotlightCard>

      {/* Demo Booking Section */}
      <SpotlightCard className="mx-4 sm:mx-6 max-w-7xl xl:mx-auto mt-4">
        <div className="bg-card rounded-[40px] py-16 px-6 sm:px-12">
          <DemoBookingSection />
        </div>
      </SpotlightCard>

      {/* ROI Calculator Section */}
      <AuraSection
        sectionNumber="06"
        badge={t('roi.badge', 'Calculate Your ROI')}
        badgeIcon={<Brain className="w-4 h-4" />}
        title={t('roi.title', 'See Your Potential Savings')}
        subtitle={t('roi.subtitle', 'Discover how much time and money you could save with AI automation')}
        dark
      >
        <div className="max-w-5xl mx-auto">
          <ROICalculator />
          <p className="text-xs text-muted-foreground text-center mt-8">
            {t('indexPage.roiDisclaimer')}
          </p>
        </div>
      </AuraSection>

      {/* Security & API Section */}
      <AuraSection
        sectionNumber="07"
        badge={t('indexPage.security.badge', 'Security & Integrations')}
        badgeIcon={<Shield className="w-4 h-4" />}
        title={t('indexPage.security.title')}
        subtitle={t('indexPage.security.subtitle')}
      >
        <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-5xl mx-auto">
          <AuraCard>
            <Shield className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-medium text-white mb-4">{t('indexPage.security.securityTitle')}</h3>
            <ul className="space-y-3 text-sm">
              {['sec1', 'sec2', 'sec3', 'sec4', 'sec5', 'sec6'].map((key) => (
                <li key={key} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <strong className="text-white">{t(`indexPage.security.${key}`)}</strong> {t(`indexPage.security.${key}Desc`)}
                  </span>
                </li>
              ))}
            </ul>
          </AuraCard>

          <AuraCard>
            <Brain className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-medium text-white mb-4">{t('indexPage.security.apiTitle')}</h3>
            <ul className="space-y-3 text-sm">
              {['api1', 'api2', 'api3', 'api4', 'api5', 'api6'].map((key) => (
                <li key={key} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <strong className="text-white">{t(`indexPage.security.${key}`)}</strong> {t(`indexPage.security.${key}Desc`)}
                  </span>
                </li>
              ))}
            </ul>
            <Link to="/features" className="mt-4 inline-block">
              <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                {t('indexPage.security.viewIntegrations')} →
              </button>
            </Link>
          </AuraCard>
        </div>

        {/* Performance Metrics */}
        <div className="bg-secondary rounded-[24px] p-8 text-center max-w-4xl mx-auto">
          <h3 className="text-xl font-medium text-white mb-6">{t('indexPage.security.performanceTitle')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-primary mb-1">99.9%</div>
              <div className="text-sm text-muted-foreground">{t('indexPage.security.perf1')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">&lt;2s</div>
              <div className="text-sm text-muted-foreground">{t('indexPage.security.perf2')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">10K+</div>
              <div className="text-sm text-muted-foreground">{t('indexPage.security.perf3')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">{t('indexPage.security.perf4')}</div>
            </div>
          </div>
        </div>
      </AuraSection>

      {/* Final CTA Section */}
      <AuraCTASection />

      {/* Beta Program Notice */}
      <SpotlightCard className="mx-4 sm:mx-6 max-w-7xl xl:mx-auto mt-4 mb-8">
        <div className="bg-secondary rounded-[40px] py-8 px-6 sm:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-sm font-semibold text-white mb-3">{t('indexPage.betaNotice.title')}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('indexPage.betaNotice.description')}
            </p>
          </div>
        </div>
      </SpotlightCard>

      <Footer />
    </div>
  );
};

export default Index;
