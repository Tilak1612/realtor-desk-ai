import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import ErrorBoundary from "@/components/ErrorBoundary";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent, trackPageView } from "@/utils/analytics";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import CookieConsent from "./components/CookieConsent";

// Critical path — eagerly loaded (landing, auth, 404)
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Route-level loading spinner
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

// Public /integrations page is marketing; authenticated users should land
// on the in-app Integration Hub instead of seeing the Sign In / Get Started CTA.
const IntegrationsRoute = () => {
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setHasSession(!!data.session));
  }, []);

  if (hasSession === null) return <PageLoader />;
  if (hasSession) return <Navigate to="/dashboard/integrations" replace />;
  return <Integrations />;
};

// ─── Lazy-loaded public pages ───
const Features = lazy(() => import("./pages/Features"));
const Pricing = lazy(() => import("./pages/Pricing"));
const CanadianMarket = lazy(() => import("./pages/CanadianMarket"));
const Demo = lazy(() => import("./pages/Demo"));
const Resources = lazy(() => import("./pages/Resources"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Integrations = lazy(() => import("./pages/Integrations"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Careers = lazy(() => import("./pages/Careers"));
const PIPEDACompliancePage = lazy(() => import("./pages/PIPEDACompliancePage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Contact = lazy(() => import("./pages/Contact"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));
const LeadMagnetFollowUp = lazy(() => import("./pages/LeadMagnetFollowUp"));
const FintracCompliance = lazy(() => import("./pages/FintracCompliance"));
const LoftyAlternative = lazy(() => import("./pages/LoftyAlternative"));

// ─── Lazy-loaded blog pages ───
const AITransformation = lazy(() => import("./pages/blog/AITransformation"));
const CreaDDF = lazy(() => import("./pages/blog/CreaDDF"));
const Compliance = lazy(() => import("./pages/blog/Compliance"));
const LeadConversion = lazy(() => import("./pages/blog/LeadConversion"));
const BilingualMarketing = lazy(() => import("./pages/blog/BilingualMarketing"));
const SuccessStory = lazy(() => import("./pages/blog/SuccessStory"));
const HousingForecast2025 = lazy(() => import("./pages/blog/HousingForecast2025"));
const AIAutomationSlowerMarket = lazy(() => import("./pages/blog/AIAutomationSlowerMarket"));
const LeadResponseTime = lazy(() => import("./pages/blog/LeadResponseTime"));
const AICRMGuide = lazy(() => import("./pages/blog/AICRMGuide"));
const TorontoVsVancouver = lazy(() => import("./pages/blog/TorontoVsVancouver"));
const PIPEDACompliance = lazy(() => import("./pages/blog/PIPEDACompliance"));
const FirstTimeBuyerGuide = lazy(() => import("./pages/blog/FirstTimeBuyerGuide"));
const SellHomeFast = lazy(() => import("./pages/blog/SellHomeFast"));
const EdmontonMarket2025 = lazy(() => import("./pages/blog/EdmontonMarket2025"));
const VsKvCore = lazy(() => import("./pages/blog/VsKvCore"));
const VsFollowUpBoss = lazy(() => import("./pages/blog/VsFollowUpBoss"));
const IxactAlternatives = lazy(() => import("./pages/blog/IxactAlternatives"));
const BestCRMCanada2025 = lazy(() => import("./pages/blog/BestCRMCanada2025"));
const AIvsTraditionalCRM = lazy(() => import("./pages/blog/AIvsTraditionalCRM"));
const VsLoftyCRM = lazy(() => import("./pages/blog/VsLoftyCRM"));
const BoomTownAlternative = lazy(() => import("./pages/blog/BoomTownAlternative"));
const VsPropertybase = lazy(() => import("./pages/blog/VsPropertybase"));
const AIChatbotGuide = lazy(() => import("./pages/blog/AIChatbotGuide"));
const VoiceAIGuide = lazy(() => import("./pages/blog/VoiceAIGuide"));
const CalgaryMarketingGuide = lazy(() => import("./pages/blog/CalgaryMarketingGuide"));
const CASLComplianceGuide = lazy(() => import("./pages/blog/CASLComplianceGuide"));
const CostOfMissedLeads = lazy(() => import("./pages/blog/CostOfMissedLeads"));
const LeadGenerationStrategies = lazy(() => import("./pages/blog/LeadGenerationStrategies"));
const OpenHouseDigitalSignIn = lazy(() => import("./pages/blog/OpenHouseDigitalSignIn"));
const DripCampaignTemplates = lazy(() => import("./pages/blog/DripCampaignTemplates"));
const RealEstateCRMBuyingGuide = lazy(() => import("./pages/blog/RealEstateCRMBuyingGuide"));
const LionDeskAlternative = lazy(() => import("./pages/blog/LionDeskAlternative"));

// ─── Lazy-loaded comparison & migration pages ───
const VsBoldTrail = lazy(() => import("./pages/VsBoldTrail"));
const VsLofty = lazy(() => import("./pages/VsLofty"));
const VsIxact = lazy(() => import("./pages/VsIxact"));
const VsWiseAgent = lazy(() => import("./pages/VsWiseAgent"));
const AIPoweredCRM = lazy(() => import("./pages/AIPoweredCRM"));
const SwitchFromBoldTrail = lazy(() => import("./pages/SwitchFromBoldTrail"));
const SwitchFromLofty = lazy(() => import("./pages/SwitchFromLofty"));
const SwitchFromIxact = lazy(() => import("./pages/SwitchFromIxact"));
const SwitchFromWiseAgent = lazy(() => import("./pages/SwitchFromWiseAgent"));
const SwitchFromLionDesk = lazy(() => import("./pages/SwitchFromLionDesk"));
const SwitchFromFollowUpBoss = lazy(() => import("./pages/SwitchFromFollowUpBoss"));
const AdminDemoRequests = lazy(() => import("./pages/AdminDemoRequests"));

// ─── Lazy-loaded auth pages (non-critical) ───
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// ─── Lazy-loaded protected (app) pages ───
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Today = lazy(() => import("./pages/Today"));
const CallWorkflow = lazy(() => import("./pages/CallWorkflow"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Contacts = lazy(() => import("./pages/Contacts"));
const ContactDetail = lazy(() => import("./pages/ContactDetail"));
const Billing = lazy(() => import("./pages/Billing"));
const Properties = lazy(() => import("./pages/Properties"));
const Deals = lazy(() => import("./pages/Deals"));
const Tasks = lazy(() => import("./pages/Tasks"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const Settings = lazy(() => import("./pages/Settings"));
const IntegrationHub = lazy(() => import("./pages/IntegrationHub"));
const Campaigns = lazy(() => import("./pages/Campaigns"));
const CalendarPage = lazy(() => import("./pages/Calendar"));
const Reports = lazy(() => import("./pages/Reports"));
const Market = lazy(() => import("./pages/Market"));
const Automations = lazy(() => import("./pages/Automations"));

const queryClient = new QueryClient();
const siteUrl = "https://www.realtordesk.ai";

const SeoDefaults = () => {
  const location = useLocation();
  const canonicalPath = location.pathname === "/" ? "" : location.pathname;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  const noindexPrefixes = [
    "/signup",
    "/login",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
    "/dashboard",
    "/today",
    "/onboarding",
    "/contacts",
    "/properties",
    "/deals",
    "/tasks",
    "/ai-assistant",
    "/campaigns",
    "/calendar",
    "/reports",
    "/market",
    "/automations",
    "/settings",
    "/profile",
    "/billing",
    "/admin",
    "/call-workflow",
  ];
  const shouldNoindex = noindexPrefixes.some((prefix) =>
    location.pathname === prefix || location.pathname.startsWith(`${prefix}/`)
  );

  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:url" content={canonicalUrl} />
      {shouldNoindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
};

const RouteAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    const pagePath = `${location.pathname}${location.search}${location.hash}`;
    trackPageView(pagePath, document.title);
  }, [location]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" || !session?.user) {
        return;
      }

      const pendingMethod = sessionStorage.getItem("ga_pending_signup_method");
      if (!pendingMethod) {
        return;
      }

      const firedKey = `ga_signup_fired_${session.user.id}`;
      if (sessionStorage.getItem(firedKey) === "1") {
        return;
      }

      trackEvent("sign_up", { method: pendingMethod });
      trackEvent("trial_start", { method: pendingMethod });
      sessionStorage.setItem(firedKey, "1");
      sessionStorage.removeItem("ga_pending_signup_method");
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return null;
};

// Preview refresh marker: harmless no-op comment to trigger a fresh rebuild.
const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <SeoDefaults />
          <RouteAnalytics />
          <SubscriptionProvider>
          <Suspense fallback={<PageLoader />}>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/canadian-market" element={<CanadianMarket />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/blog/ai-transformation" element={<AITransformation />} />
          <Route path="/blog/crea-ddf" element={<CreaDDF />} />
          <Route path="/blog/compliance" element={<Compliance />} />
          <Route path="/blog/lead-conversion" element={<LeadConversion />} />
          <Route path="/blog/bilingual-marketing" element={<BilingualMarketing />} />
          <Route path="/blog/success-story" element={<SuccessStory />} />
          <Route path="/canada-housing-market-forecast-2025-2026" element={<HousingForecast2025 />} />
          <Route path="/canadian-realtors-thrive-slower-market-ai-automation" element={<AIAutomationSlowerMarket />} />
          <Route path="/lead-response-time-canadian-realtors" element={<LeadResponseTime />} />
          <Route path="/ai-crm-canadian-real-estate-agents-guide" element={<AICRMGuide />} />
          <Route path="/toronto-vs-vancouver-real-estate-market-2025" element={<TorontoVsVancouver />} />
          <Route path="/pipeda-compliance-real-estate-ai-tools-canada" element={<PIPEDACompliance />} />
          <Route path="/first-time-home-buyer-guide-canada-2025" element={<FirstTimeBuyerGuide />} />
          <Route path="/sell-home-fast-canada-2025" element={<SellHomeFast />} />
          <Route path="/edmonton-real-estate-market-2025" element={<EdmontonMarket2025 />} />
          <Route path="/blog/vs-kvcore" element={<VsKvCore />} />
          <Route path="/blog/vs-follow-up-boss" element={<VsFollowUpBoss />} />
          <Route path="/blog/ixact-alternatives" element={<IxactAlternatives />} />
          <Route path="/blog/best-crm-canada-2025" element={<BestCRMCanada2025 />} />
          <Route path="/blog/ai-vs-traditional-crm" element={<AIvsTraditionalCRM />} />
          <Route path="/blog/vs-lofty-crm" element={<VsLoftyCRM />} />
          <Route path="/blog/boomtown-alternative-canada" element={<BoomTownAlternative />} />
          <Route path="/blog/vs-propertybase" element={<VsPropertybase />} />
          <Route path="/blog/ai-chatbot-real-estate-websites-canada" element={<AIChatbotGuide />} />
          <Route path="/resources/voice-ai-real-estate-lead-follow-up-canada" element={<VoiceAIGuide />} />
          <Route path="/resources/calgary-real-estate-marketing-strategies" element={<CalgaryMarketingGuide />} />
          <Route path="/resources/casl-compliance-real-estate-email-marketing-canada" element={<CASLComplianceGuide />} />
          <Route path="/resources/cost-of-missed-real-estate-leads-canada" element={<CostOfMissedLeads />} />
          <Route path="/resources/slow-follow-up-calculator-canadian-realtors" element={<LeadMagnetFollowUp />} />
          <Route path="/blog/real-estate-lead-generation-strategies-canada-2025" element={<LeadGenerationStrategies />} />
          <Route path="/blog/open-house-digital-sign-in-sheets-vs-paper-2025" element={<OpenHouseDigitalSignIn />} />
          <Route path="/blog/real-estate-drip-campaign-templates-canada-2025" element={<DripCampaignTemplates />} />
          <Route path="/blog/real-estate-crm-buying-guide" element={<RealEstateCRMBuyingGuide />} />
          <Route path="/blog/best-liondesk-alternative-canadian-realtors" element={<LionDeskAlternative />} />
          <Route path="/integrations" element={<IntegrationsRoute />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/pipeda-compliance" element={<PIPEDACompliancePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          <Route path="/admin/demo-requests" element={<AdminDemoRequests />} />

          {/* Auth Pages */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/today" element={<ProtectedRoute><Today /></ProtectedRoute>} />
          <Route path="/call-workflow/:contactId" element={<ProtectedRoute><CallWorkflow /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
          <Route path="/contacts/:id" element={<ProtectedRoute><ContactDetail /></ProtectedRoute>} />
          <Route path="/properties" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
          <Route path="/deals" element={<ProtectedRoute><Deals /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
          <Route path="/campaigns" element={<ProtectedRoute><Campaigns /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/market" element={<ProtectedRoute><Market /></ProtectedRoute>} />
          <Route path="/market-intelligence" element={<Navigate to="/market" replace />} />
          <Route path="/automations" element={<ProtectedRoute><Automations /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/dashboard/integrations" element={<ProtectedRoute><IntegrationHub /></ProtectedRoute>} />

          {/* Comparison Pages */}
          <Route path="/vs/boldtrail" element={<VsBoldTrail />} />
          <Route path="/vs/lofty" element={<VsLofty />} />
          <Route path="/vs/ixact" element={<VsIxact />} />
          <Route path="/vs/wise-agent" element={<VsWiseAgent />} />

          {/* Alternative Pages (for SEO) */}
          <Route path="/lofty-alternative" element={<LoftyAlternative />} />

          {/* AI Features */}
          <Route path="/features/ai-powered-crm" element={<AIPoweredCRM />} />

          {/* Migration Pages */}
          <Route path="/switch-from-boldtrail" element={<SwitchFromBoldTrail />} />
          <Route path="/switch-from-lofty" element={<SwitchFromLofty />} />
          <Route path="/switch-from-ixact" element={<SwitchFromIxact />} />
          <Route path="/switch-from-wise-agent" element={<SwitchFromWiseAgent />} />
          <Route path="/switch-from-liondesk" element={<SwitchFromLionDesk />} />
          <Route path="/switch-from-follow-up-boss" element={<SwitchFromFollowUpBoss />} />
          <Route path="/fintrac-compliance" element={<FintracCompliance />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          </SubscriptionProvider>
          <CookieConsent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
