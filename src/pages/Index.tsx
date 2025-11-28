import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import UnifiedDashboardSection from "@/components/UnifiedDashboardSection";
import CanadianSection from "@/components/CanadianSection";
import MobileCTA from "@/components/MobileCTA";
import FeatureCard from "@/components/FeatureCard";
import StatCard from "@/components/StatCard";
import ROICalculator from "@/components/ROICalculator";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import ChatWidget from "@/components/ChatWidget";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  Brain, 
  MessageSquare, 
  ClipboardCheck, 
  AlertCircle, 
  Zap, 
  TrendingDown,
  FileText,
  MapPin,
  CheckCircle,
  Shield,
  Play
} from "lucide-react";
import HowItWorksSection from "@/components/HowItWorksSection";
import TrustTransparencySection from "@/components/TrustTransparencySection";
import BetaSuccessStories from "@/components/BetaSuccessStories";
import DemoBookingSection from "@/components/DemoBookingSection";
import demoShowcase from "@/assets/demo-showcase.jpg";

// Demo Video - HeyGen Product Demo (Embed URL)
const DEMO_VIDEO_URL = "https://app.heygen.com/embeds/4c80de4c5d7a4392b50941050220df54";

const Index = () => {
  const { t } = useTranslation();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />
      <CookieConsent />
      <ExitIntentPopup />
      <ChatWidget />
      <MobileCTA />
      
      {/* Hero Section */}
      <Hero />

      {/* Live Social Proof Bar - Mobile Optimized */}
      <section className="py-3 sm:py-4 bg-gradient-to-r from-accent/10 to-accent/5 border-y">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-muted-foreground">{t('indexPage.socialProof.banner')}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border"></div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
              <span className="font-semibold">50+</span>
              <span className="text-muted-foreground">{t('indexPage.socialProof.betaParticipants')}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border"></div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
              <span className="text-muted-foreground text-center sm:text-left">{t('indexPage.socialProof.limitedSpots')}</span>
            </div>
          </div>
          
          {/* Testimonials Disclaimer */}
          <p className="text-xs text-muted-foreground text-center mt-8 max-w-3xl mx-auto">
            {t('betaCommunity.testimonialDisclaimer')}
          </p>
        </div>
      </section>

      {/* Trust & Transparency Section */}
      <TrustTransparencySection />

      {/* Problem Section */}
      <ProblemSection />

      {/* Solution Section */}
      <SolutionSection />

      {/* Unified Dashboard Section */}
      <UnifiedDashboardSection />

      {/* Canadian Market Section */}
      <CanadianSection />

      {/* Credibility Section */}
      <section className="section-padding bg-background" aria-label="Security and Compliance">
        <div className="container-custom">
          <h2 className="text-center mb-12">{t('home.credibility.title')}</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <Card className="p-6 text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">{t('indexPage.credibility.soc2Title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('indexPage.credibility.soc2Desc')}
              </p>
            </Card>
            <Card className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">{t('indexPage.credibility.pipedaTitle')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('indexPage.credibility.pipedaDesc')}
              </p>
            </Card>
            <Card className="p-6 text-center">
              <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">{t('indexPage.credibility.creaTitle')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('indexPage.credibility.creaDesc')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Live Demo Section - Mobile Optimized */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5" aria-label="Product Demo">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl">{t('home.demo.title')}</h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
              {t('home.demo.description')}
            </p>
            
            {/* Demo Showcase - Touch Optimized */}
            <div 
              className="relative aspect-video rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl overflow-hidden mb-4 sm:mb-6 group cursor-pointer touch-manipulation active:scale-98 transition-transform"
              onClick={() => {
                const consentString = localStorage.getItem("cookie-consent");
                let canLoadVideo = false;

                if (consentString) {
                  // Assuming consent object has { necessary: true, analytics: boolean, marketing: boolean }
                  const consentData = JSON.parse(consentString);
                  if (consentData.analytics || consentData.marketing) {
                    canLoadVideo = true;
                  }
                }

                if (canLoadVideo && DEMO_VIDEO_URL) {
                  // Load video if consent is granted AND URL is configured
                  setVideoSrc(DEMO_VIDEO_URL);
                  setIsVideoOpen(true);
                } else if (!DEMO_VIDEO_URL) {
                  // Show placeholder if URL is not configured
                  setIsVideoOpen(true);
                } else {
                  // If no consent or rejected, show alert
                  alert("Please accept marketing or analytics cookies via the banner at the bottom to watch the video.");
                }
              }}
            >
              <img 
                src={demoShowcase} 
                alt="RealtorDesk AI platform demo showcasing AI chatbot for property inquiries, lead scoring dashboard, and automated client management for Canadian real estate agents"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 group-active:bg-black/60 transition-colors">
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 text-primary ml-0.5 sm:ml-1" />
                  </div>
                  <p className="text-white font-medium text-sm sm:text-base">{t('home.demo.watchDemo')}</p>
                </div>
              </div>
            </div>
            
            {/* Video Modal - Privacy Compliant Lazy Loading */}
            <Dialog open={isVideoOpen} onOpenChange={(open) => {
              setIsVideoOpen(open);
              if (!open) {
                // Clear video src when modal closes
                setVideoSrc("");
              }
            }}>
              <DialogContent className="max-w-[95vw] sm:max-w-5xl w-full p-0 overflow-hidden">
                <DialogTitle className="sr-only">Product Demo Video</DialogTitle>
                <DialogDescription className="sr-only">
                  Watch our product demo showcasing Realtor Desk AI features
                </DialogDescription>
                <div className="relative aspect-video w-full bg-black">
                  {videoSrc ? (
                    <iframe
                      src={videoSrc}
                      title="Realtor Desk AI Product Demo"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                      loading="lazy"
                      style={{ border: 0 }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <p className="text-muted-foreground">Please add your demo video URL to DEMO_VIDEO_URL constant</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/demo" className="w-full sm:w-auto">
                <Button size="lg" className="btn-gradient w-full sm:w-auto min-h-[52px]">
                  {t('home.demo.bookDemo')}
                </Button>
              </Link>
              <Link to="/features" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto min-h-[52px]">
                  {t('home.demo.exploreFeatures')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Beta Success Stories Section */}
      <BetaSuccessStories />

      {/* Demo Booking Section */}
      <DemoBookingSection />

      {/* Problem Statement Section */}
      <section className="section-padding bg-muted" aria-label="Industry Challenges">
        <div className="container-custom">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="mb-4">{t('indexPage.problemStatement.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('indexPage.problemStatement.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={TrendingDown}
              stat="12%"
              description={t('indexPage.problemStatement.stat1')}
            />
            <StatCard
              icon={AlertCircle}
              stat="48%"
              description={t('indexPage.problemStatement.stat2')}
            />
            <StatCard
              icon={Zap}
              stat="15+"
              description={t('indexPage.problemStatement.stat3')}
            />
            <StatCard
              icon={TrendingDown}
              stat="2-5%"
              description={t('indexPage.problemStatement.stat4')}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Solution Overview Section */}
      <section className="section-padding" aria-label="AI Features and Capabilities">
        <div className="container-custom">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="mb-4">{t('indexPage.solutionOverview.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('indexPage.solutionOverview.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Brain}
              title={t('indexPage.solutionOverview.feature1Title')}
              description={t('indexPage.solutionOverview.feature1Desc')}
              gradient
            />
            <FeatureCard
              icon={MessageSquare}
              title={t('indexPage.solutionOverview.feature2Title')}
              description={t('indexPage.solutionOverview.feature2Desc')}
              gradient
            />
            <FeatureCard
              icon={ClipboardCheck}
              title={t('indexPage.solutionOverview.feature3Title')}
              description={t('indexPage.solutionOverview.feature3Desc')}
              gradient
            />
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="section-padding bg-muted" aria-label="ROI Calculator">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto animate-fade-in-up">
            <ROICalculator />
            
            {/* ROI Disclaimer */}
            <p className="text-xs text-muted-foreground text-center mt-8">
              {t('indexPage.roiDisclaimer')}
            </p>
          </div>
        </div>
      </section>


      {/* Security & API Documentation Section */}
      <section className="section-padding bg-background border-y" aria-label="Security and Integration Documentation">
        <div className="container-custom">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="mb-4">{t('indexPage.security.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('indexPage.security.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Security Section */}
            <Card className="p-8">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-4">{t('indexPage.security.securityTitle')}</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span><strong>{t('indexPage.security.sec1')}</strong> {t('indexPage.security.sec1Desc')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span><strong>{t('indexPage.security.sec2')}</strong> {t('indexPage.security.sec2Desc')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span><strong>{t('indexPage.security.sec3')}</strong> {t('indexPage.security.sec3Desc')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span><strong>{t('indexPage.security.sec4')}</strong> {t('indexPage.security.sec4Desc')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span><strong>{t('indexPage.security.sec5')}</strong> {t('indexPage.security.sec5Desc')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span><strong>{t('indexPage.security.sec6')}</strong> {t('indexPage.security.sec6Desc')}</span>
                </li>
              </ul>
            </Card>

            {/* API & Integrations */}
            <Card className="p-8">
              <Brain className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-4">{t('indexPage.security.apiTitle')}</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span><strong>{t('indexPage.security.api1')}</strong> {t('indexPage.security.api1Desc')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span><strong>{t('indexPage.security.api2')}</strong> {t('indexPage.security.api2Desc')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span><strong>{t('indexPage.security.api3')}</strong> {t('indexPage.security.api3Desc')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span><strong>{t('indexPage.security.api4')}</strong> {t('indexPage.security.api4Desc')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span><strong>{t('indexPage.security.api5')}</strong> {t('indexPage.security.api5Desc')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span><strong>{t('indexPage.security.api6')}</strong> {t('indexPage.security.api6Desc')}</span>
                </li>
              </ul>
              <Link to="/features" className="mt-4 inline-block">
                <Button variant="outline" size="sm">{t('indexPage.security.viewIntegrations')}</Button>
              </Link>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="bg-muted/50 rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold mb-6">{t('indexPage.security.performanceTitle')}</h3>
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
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container-custom text-center">
          <h2 className="mb-6 text-white">{t('indexPage.finalCTA.title')}</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            {t('indexPage.finalCTA.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="text-lg">
                {t('indexPage.finalCTA.startTrial')}
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" className="text-lg bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                {t('indexPage.finalCTA.bookDemo')}
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/80 font-semibold">
            {t('indexPage.finalCTA.note')}
          </p>
        </div>
      </section>

      {/* Beta Program Notice */}
      <section className="py-8 bg-muted/50 border-t">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-sm font-semibold text-foreground mb-3">{t('indexPage.betaNotice.title')}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('indexPage.betaNotice.description')}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
