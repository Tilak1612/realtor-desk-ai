import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import CanadianMarket from "./pages/CanadianMarket";
import Demo from "./pages/Demo";
import Resources from "./pages/Resources";
import HowItWorks from "./pages/HowItWorks";
import AITransformation from "./pages/blog/AITransformation";
import CreaDDF from "./pages/blog/CreaDDF";
import Compliance from "./pages/blog/Compliance";
import LeadConversion from "./pages/blog/LeadConversion";
import BilingualMarketing from "./pages/blog/BilingualMarketing";
import SuccessStory from "./pages/blog/SuccessStory";
import HousingForecast2025 from "./pages/blog/HousingForecast2025";
import AIAutomationSlowerMarket from "./pages/blog/AIAutomationSlowerMarket";
import LeadResponseTime from "./pages/blog/LeadResponseTime";
import AICRMGuide from "./pages/blog/AICRMGuide";
import TorontoVsVancouver from "./pages/blog/TorontoVsVancouver";
import PIPEDACompliance from "./pages/blog/PIPEDACompliance";
import FirstTimeBuyerGuide from "./pages/blog/FirstTimeBuyerGuide";
import SellHomeFast from "./pages/blog/SellHomeFast";
import EdmontonMarket2025 from "./pages/blog/EdmontonMarket2025";
import VsKvCore from "./pages/blog/VsKvCore";
import VsFollowUpBoss from "./pages/blog/VsFollowUpBoss";
import IxactAlternatives from "./pages/blog/IxactAlternatives";
import BestCRMCanada2025 from "./pages/blog/BestCRMCanada2025";
import AIvsTraditionalCRM from "./pages/blog/AIvsTraditionalCRM";
import VsLoftyCRM from "./pages/blog/VsLoftyCRM";
import BoomTownAlternative from "./pages/blog/BoomTownAlternative";
import VsPropertybase from "./pages/blog/VsPropertybase";
import AIChatbotGuide from "./pages/blog/AIChatbotGuide";
import VoiceAIGuide from "./pages/blog/VoiceAIGuide";
import CalgaryMarketingGuide from "./pages/blog/CalgaryMarketingGuide";
import CASLComplianceGuide from "./pages/blog/CASLComplianceGuide";
import CostOfMissedLeads from "./pages/blog/CostOfMissedLeads";
import LeadGenerationStrategies from "./pages/blog/LeadGenerationStrategies";
import OpenHouseDigitalSignIn from "./pages/blog/OpenHouseDigitalSignIn";
import DripCampaignTemplates from "./pages/blog/DripCampaignTemplates";
import Integrations from "./pages/Integrations";
import PIPEDACompliancePage from "./pages/PIPEDACompliancePage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import AdminDemoRequests from "./pages/AdminDemoRequests";
import VsBoldTrail from "./pages/VsBoldTrail";
import VsLofty from "./pages/VsLofty";
import VsIxact from "./pages/VsIxact";
import VsWiseAgent from "./pages/VsWiseAgent";
import AIPoweredCRM from "./pages/AIPoweredCRM";
import SwitchFromBoldTrail from "./pages/SwitchFromBoldTrail";
import SwitchFromLofty from "./pages/SwitchFromLofty";
import SwitchFromIxact from "./pages/SwitchFromIxact";
import SwitchFromWiseAgent from "./pages/SwitchFromWiseAgent";
import LoftyAlternative from "./pages/LoftyAlternative";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Today from "./pages/Today";
import CallWorkflow from "./pages/CallWorkflow";
import Onboarding from "./pages/Onboarding";
import Contacts from "./pages/Contacts";
import ContactDetail from "./pages/ContactDetail";
import Billing from "./pages/Billing";
import Properties from "./pages/Properties";
import Deals from "./pages/Deals";
import Tasks from "./pages/Tasks";
import AIAssistant from "./pages/AIAssistant";
import Settings from "./pages/Settings";
import Campaigns from "./pages/Campaigns";
import CalendarPage from "./pages/Calendar";
import Reports from "./pages/Reports";
import Market from "./pages/Market";
import Automations from "./pages/Automations";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();
const siteUrl = "https://realtordesk.ai";
const GA_MEASUREMENT_ID = "G-95T79D2KJ7";

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
    if (typeof window.gtag !== "function") {
      return;
    }

    const pagePath = `${location.pathname}${location.search}${location.hash}`;
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: pagePath,
      page_title: document.title,
    });
  }, [location]);

  return null;
};

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
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/canadian-market" element={<CanadianMarket />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/resources" element={<Resources />} />
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
          <Route path="/blog/real-estate-lead-generation-strategies-canada-2025" element={<LeadGenerationStrategies />} />
          <Route path="/blog/open-house-digital-sign-in-sheets-vs-paper-2025" element={<OpenHouseDigitalSignIn />} />
          <Route path="/blog/real-estate-drip-campaign-templates-canada-2025" element={<DripCampaignTemplates />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/pipeda-compliance" element={<PIPEDACompliancePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/demo-requests" element={<AdminDemoRequests />} />
          
          {/* Auth Pages */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/today" element={<Today />} />
          <Route path="/call-workflow/:contactId" element={<CallWorkflow />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/contacts/:id" element={<ContactDetail />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/market" element={<Market />} />
          <Route path="/automations" element={<Automations />} />
          <Route path="/settings" element={<Settings />} />
          
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
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
          </SubscriptionProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
