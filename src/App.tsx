import { Toaster } from "@/components/ui/toaster";
import { lazyWithRetry } from "@/lib/router/lazyWithRetry";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate, useParams } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent, trackPageView } from "@/utils/analytics";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import RequireBilling from "./components/RequireBilling";
import CookieConsent from "./components/CookieConsent";
import SiteAssistant from "./components/marketing/SiteAssistant";
import { SkipToContent } from "./components/SkipToContent";

// Critical path — eagerly loaded (landing, auth, 404)
// Phase 2 redesign: new marketing pages live under src/pages/rd/.
// These replace Index/Features/Pricing/VsBoldTrail at their routes while
// the legacy files are left in the tree for reference; they will be
// deleted in a post-launch cleanup pass. See feat/rd-redesign-phase-2-marketing.
import RDHome from "./pages/rd/Home";
import RDFeatures from "./pages/rd/Features";
import RDPricing from "./pages/rd/Pricing";
import RDCompareBoldtrail from "./pages/rd/CompareBoldtrail";
// Phase 3 redesign: product surfaces under /app/*. Lazy-loaded so the
// paper-bg shell doesn't bloat the marketing bundle.
const RDAppDashboard = lazyWithRetry(() => import("./pages/rd/app/Dashboard"));
const AppNotFound = lazyWithRetry(() => import("./pages/rd/app/NotFound"));
const RDAppLeads = lazyWithRetry(() => import("./pages/rd/app/Leads"));
const RDAppLeadDetail = lazyWithRetry(() => import("./pages/rd/app/LeadDetail"));
const RDAppPipeline = lazyWithRetry(() => import("./pages/rd/app/Pipeline"));
const RDAppInbox = lazyWithRetry(() => import("./pages/rd/app/Inbox"));
const RDAppAutomation = lazyWithRetry(() => import("./pages/rd/app/Automation"));
const RDAppReports = lazyWithRetry(() => import("./pages/rd/app/Reports"));
// Phase 4 replaces the legacy /onboarding route with the 5-step redesign.
const RDOnboarding = lazyWithRetry(() => import("./pages/rd/Onboarding"));
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";


// Redirect that carries the route param across. <Navigate to="/app/leads/:id">
// would navigate to the literal string ":id".
const RedirectWithId = ({ to }: { to: string }) => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`${to}/${id ?? ""}`} replace />;
};

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
// Features + Pricing now render via Phase 2 RD* imports above; the legacy
// page files were deleted in chore/rd-redesign-legacy-cleanup.
const CanadianMarket = lazyWithRetry(() => import("./pages/CanadianMarket"));
const Demo = lazyWithRetry(() => import("./pages/Demo"));
const Resources = lazyWithRetry(() => import("./pages/Resources"));
const Roadmap = lazyWithRetry(() => import("./pages/Roadmap"));
const HowItWorks = lazyWithRetry(() => import("./pages/HowItWorks"));
const Integrations = lazyWithRetry(() => import("./pages/Integrations"));
const FAQ = lazyWithRetry(() => import("./pages/FAQ"));
const Careers = lazyWithRetry(() => import("./pages/Careers"));
const Partners = lazyWithRetry(() => import("./pages/Partners"));
const PartnersApply = lazyWithRetry(() => import("./pages/PartnersApply"));
const PartnersTerms = lazyWithRetry(() => import("./pages/PartnersTerms"));
const PIPEDACompliancePage = lazyWithRetry(() => import("./pages/PIPEDACompliancePage"));
const PrivacyPolicy = lazyWithRetry(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazyWithRetry(() => import("./pages/TermsOfService"));
const Contact = lazyWithRetry(() => import("./pages/Contact"));
const Unsubscribe = lazyWithRetry(() => import("./pages/Unsubscribe"));
const LeadMagnetFollowUp = lazyWithRetry(() => import("./pages/LeadMagnetFollowUp"));
const FintracCompliance = lazyWithRetry(() => import("./pages/FintracCompliance"));
const LoftyAlternative = lazyWithRetry(() => import("./pages/LoftyAlternative"));

// ─── Lazy-loaded blog pages ───
const AITransformation = lazyWithRetry(() => import("./pages/blog/AITransformation"));
const CommunityLaunch = lazyWithRetry(() => import("./pages/blog/CommunityLaunch"));
const CreaDDF = lazyWithRetry(() => import("./pages/blog/CreaDDF"));
const Compliance = lazyWithRetry(() => import("./pages/blog/Compliance"));
const LeadConversion = lazyWithRetry(() => import("./pages/blog/LeadConversion"));
const BilingualMarketing = lazyWithRetry(() => import("./pages/blog/BilingualMarketing"));
const HousingForecast2025 = lazyWithRetry(() => import("./pages/blog/HousingForecast2025"));
const AIAutomationSlowerMarket = lazyWithRetry(() => import("./pages/blog/AIAutomationSlowerMarket"));
const LeadResponseTime = lazyWithRetry(() => import("./pages/blog/LeadResponseTime"));
const AICRMGuide = lazyWithRetry(() => import("./pages/blog/AICRMGuide"));
const TorontoVsVancouver = lazyWithRetry(() => import("./pages/blog/TorontoVsVancouver"));
const PIPEDACompliance = lazyWithRetry(() => import("./pages/blog/PIPEDACompliance"));
const FirstTimeBuyerGuide = lazyWithRetry(() => import("./pages/blog/FirstTimeBuyerGuide"));
const SellHomeFast = lazyWithRetry(() => import("./pages/blog/SellHomeFast"));
const EdmontonMarket2025 = lazyWithRetry(() => import("./pages/blog/EdmontonMarket2025"));
const VsKvCore = lazyWithRetry(() => import("./pages/blog/VsKvCore"));
const VsFollowUpBoss = lazyWithRetry(() => import("./pages/blog/VsFollowUpBoss"));
const IxactAlternatives = lazyWithRetry(() => import("./pages/blog/IxactAlternatives"));
const BestCRMCanada2025 = lazyWithRetry(() => import("./pages/blog/BestCRMCanada2025"));
const AIvsTraditionalCRM = lazyWithRetry(() => import("./pages/blog/AIvsTraditionalCRM"));
const VsLoftyCRM = lazyWithRetry(() => import("./pages/blog/VsLoftyCRM"));
const BoomTownAlternative = lazyWithRetry(() => import("./pages/blog/BoomTownAlternative"));
const VsPropertybase = lazyWithRetry(() => import("./pages/blog/VsPropertybase"));
const AIChatbotGuide = lazyWithRetry(() => import("./pages/blog/AIChatbotGuide"));
const VoiceAIGuide = lazyWithRetry(() => import("./pages/blog/VoiceAIGuide"));
const CalgaryMarketingGuide = lazyWithRetry(() => import("./pages/blog/CalgaryMarketingGuide"));
const CASLComplianceGuide = lazyWithRetry(() => import("./pages/blog/CASLComplianceGuide"));
const CostOfMissedLeads = lazyWithRetry(() => import("./pages/blog/CostOfMissedLeads"));
const LeadGenerationStrategies = lazyWithRetry(() => import("./pages/blog/LeadGenerationStrategies"));
const OpenHouseDigitalSignIn = lazyWithRetry(() => import("./pages/blog/OpenHouseDigitalSignIn"));
const DripCampaignTemplates = lazyWithRetry(() => import("./pages/blog/DripCampaignTemplates"));
const RealEstateCRMBuyingGuide = lazyWithRetry(() => import("./pages/blog/RealEstateCRMBuyingGuide"));
const LionDeskAlternative = lazyWithRetry(() => import("./pages/blog/LionDeskAlternative"));
const DatabaseReactivation = lazyWithRetry(() => import("./pages/blog/DatabaseReactivation"));

// ─── Lazy-loaded comparison & migration pages ───
const VsBoldTrail = lazyWithRetry(() => import("./pages/VsBoldTrail"));
const VsLofty = lazyWithRetry(() => import("./pages/VsLofty"));
const VsIxact = lazyWithRetry(() => import("./pages/VsIxact"));
const VsWiseAgent = lazyWithRetry(() => import("./pages/VsWiseAgent"));
const AIPoweredCRM = lazyWithRetry(() => import("./pages/AIPoweredCRM"));
const SwitchFromBoldTrail = lazyWithRetry(() => import("./pages/SwitchFromBoldTrail"));
const SwitchFromLofty = lazyWithRetry(() => import("./pages/SwitchFromLofty"));
const SwitchFromIxact = lazyWithRetry(() => import("./pages/SwitchFromIxact"));
const SwitchFromWiseAgent = lazyWithRetry(() => import("./pages/SwitchFromWiseAgent"));
const SwitchFromLionDesk = lazyWithRetry(() => import("./pages/SwitchFromLionDesk"));
const SwitchFromFollowUpBoss = lazyWithRetry(() => import("./pages/SwitchFromFollowUpBoss"));
const AdminDemoRequests = lazyWithRetry(() => import("./pages/AdminDemoRequests"));

// ─── Lazy-loaded auth pages (non-critical) ───
const VerifyEmail = lazyWithRetry(() => import("./pages/VerifyEmail"));
const ForgotPassword = lazyWithRetry(() => import("./pages/ForgotPassword"));
const ResetPassword = lazyWithRetry(() => import("./pages/ResetPassword"));

// ─── Lazy-loaded protected (app) pages ───
const Dashboard = lazyWithRetry(() => import("./pages/Dashboard"));
const Today = lazyWithRetry(() => import("./pages/Today"));
const CallWorkflow = lazyWithRetry(() => import("./pages/CallWorkflow"));
// /onboarding now renders the Phase 4 RDOnboarding (5-step flow).
// The legacy Onboarding page file was deleted in the cleanup pass.
const Contacts = lazyWithRetry(() => import("./pages/Contacts"));
const ContactDetail = lazyWithRetry(() => import("./pages/ContactDetail"));
const Billing = lazyWithRetry(() => import("./pages/Billing"));
const Properties = lazyWithRetry(() => import("./pages/Properties"));
const Deals = lazyWithRetry(() => import("./pages/Deals"));
const Tasks = lazyWithRetry(() => import("./pages/Tasks"));
const AIAssistant = lazyWithRetry(() => import("./pages/AIAssistant"));
const Settings = lazyWithRetry(() => import("./pages/Settings"));
const IntegrationHub = lazyWithRetry(() => import("./pages/IntegrationHub"));
const Campaigns = lazyWithRetry(() => import("./pages/Campaigns"));
const CalendarPage = lazyWithRetry(() => import("./pages/Calendar"));
const Reports = lazyWithRetry(() => import("./pages/Reports"));
const Market = lazyWithRetry(() => import("./pages/Market"));
const Automations = lazyWithRetry(() => import("./pages/Automations"));

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
    // The entire authenticated RD shell. Its absence here meant /app and every
    // route beneath it served `<meta name="robots" content="index, follow,
    // max-image-preview:large, ...>` in production -- actively inviting Google
    // to crawl the logged-in product, not merely failing to discourage it.
    // robots.txt did not cover it either (it lists /dashboard, /settings,
    // /billing but not /app).
    "/app",
  ];
  const shouldNoindex = noindexPrefixes.some((prefix) =>
    location.pathname === prefix || location.pathname.startsWith(`${prefix}/`)
  );

  // Same react-helmet-async / React 19 problem as SEO.tsx: this rendered
  // nothing, so authenticated routes were never actually marked noindex
  // despite the prefix list below saying they should be.
  useEffect(() => {
    const upsert = (sel: string, make: () => HTMLElement, apply: (el: HTMLElement) => void) => {
      let el = document.head.querySelector<HTMLElement>(sel);
      if (!el) { el = make(); document.head.appendChild(el); }
      apply(el);
    };
    upsert('link[rel="canonical"]:not([hreflang])',
      () => Object.assign(document.createElement("link"), { rel: "canonical" }),
      (el) => el.setAttribute("href", canonicalUrl));
    upsert('meta[property="og:url"]',
      () => { const m = document.createElement("meta"); m.setAttribute("property", "og:url"); return m; },
      (el) => el.setAttribute("content", canonicalUrl));
    if (shouldNoindex) {
      upsert('meta[name="robots"]',
        () => { const m = document.createElement("meta"); m.setAttribute("name", "robots"); return m; },
        (el) => el.setAttribute("content", "noindex, nofollow"));
    }
  }, [canonicalUrl, shouldNoindex]);

  return null;
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
          <SkipToContent />
          <ScrollToTop />
          <SeoDefaults />
          <RouteAnalytics />
          <SubscriptionProvider>
          <Suspense fallback={<PageLoader />}>
          {/* Focus target for the skip link above. tabIndex=-1 makes it
              programmatically focusable without being in the Tab order.
              Every route renders inside this container. */}
          <div id="main-content" tabIndex={-1} className="outline-none">
          <Routes>
          <Route path="/" element={<RDHome />} />
          <Route path="/features" element={<RDFeatures />} />
          <Route path="/pricing" element={<RDPricing />} />
          <Route path="/canadian-market" element={<CanadianMarket />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/blog/ai-transformation" element={<AITransformation />} />
          <Route path="/blog/community-launch" element={<CommunityLaunch />} />
          <Route path="/blog/crea-ddf" element={<CreaDDF />} />
          <Route path="/blog/compliance" element={<Compliance />} />
          <Route path="/blog/lead-conversion" element={<LeadConversion />} />
          <Route path="/blog/bilingual-marketing" element={<BilingualMarketing />} />
          {/* /blog/success-story was a fabricated case study — a named agent at
              a named real brokerage, with invented quotes and metrics, carrying
              Article JSON-LD. Removed rather than corrected; redirected because
              the URL is in the sitemap and indexed. */}
          <Route path="/blog/success-story" element={<Navigate to="/resources" replace />} />
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
          <Route path="/real-estate-database-reactivation-canada" element={<DatabaseReactivation />} />
          <Route path="/integrations" element={<IntegrationsRoute />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/partners/apply" element={<PartnersApply />} />
          <Route path="/partners/terms" element={<PartnersTerms />} />
          <Route path="/pipeda-compliance" element={<PIPEDACompliancePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          <Route path="/admin/demo-requests" element={<AdminDemoRequests />} />

          {/* Auth Pages */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {/* Common URL aliases — bookmarks and external links land here */}
          <Route path="/sign-in" element={<Navigate to="/login" replace />} />
          <Route path="/signin" element={<Navigate to="/login" replace />} />
          <Route path="/sign-up" element={<Navigate to="/signup" replace />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/today" element={<Navigate to="/app" replace />} />
          <Route path="/call-workflow/:contactId" element={<ProtectedRoute><RequireBilling><CallWorkflow /></RequireBilling></ProtectedRoute>} />
          <Route path="/dashboard" element={<Navigate to="/app" replace />} />
          {/* Phase 3 redesign: /app/* product surfaces. Behind ProtectedRoute
              so the agent must be signed in, consistent with /dashboard. */}
          <Route path="/app" element={<ProtectedRoute><RequireBilling><RDAppDashboard /></RequireBilling></ProtectedRoute>} />
          <Route path="/app/leads" element={<ProtectedRoute><RequireBilling><RDAppLeads /></RequireBilling></ProtectedRoute>} />
          <Route path="/app/leads/:id" element={<ProtectedRoute><RequireBilling><RDAppLeadDetail /></RequireBilling></ProtectedRoute>} />
          <Route path="/app/pipeline" element={<ProtectedRoute><RequireBilling><RDAppPipeline /></RequireBilling></ProtectedRoute>} />
          <Route path="/app/inbox" element={<ProtectedRoute><RequireBilling><RDAppInbox /></RequireBilling></ProtectedRoute>} />
          <Route path="/app/automation" element={<ProtectedRoute><RequireBilling><RDAppAutomation /></RequireBilling></ProtectedRoute>} />
          <Route path="/app/reports" element={<ProtectedRoute><RequireBilling><RDAppReports /></RequireBilling></ProtectedRoute>} />
          {/* Settings is deliberately NOT behind RequireBilling: a user who
              has not paid must still be able to manage their account and
              sign out. Same for the in-app 404. */}
          <Route path="/app/settings" element={<ProtectedRoute><Settings appChrome /></ProtectedRoute>} />
          {/* Any other /app/* path is a signed-in user hitting a missing app
              route. Falling through to the public catch-all rendered the
              marketing 404 with a "Sign in" header, which reads as a logout. */}
          <Route path="/app/*" element={<ProtectedRoute><AppNotFound /></ProtectedRoute>} />
          {/* Phase 4 redesign: /onboarding now renders the 5-step flow.
              Legacy Onboarding.tsx is left in the tree for reference. */}
          <Route path="/onboarding" element={<ProtectedRoute><RDOnboarding /></ProtectedRoute>} />
          <Route path="/contacts" element={<Navigate to="/app/leads" replace />} />
          <Route path="/contacts/:id" element={<RedirectWithId to="/app/leads" />} />
          <Route path="/properties" element={<ProtectedRoute><RequireBilling><Properties /></RequireBilling></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
          <Route path="/deals" element={<Navigate to="/app/pipeline" replace />} />
          <Route path="/tasks" element={<ProtectedRoute><RequireBilling><Tasks /></RequireBilling></ProtectedRoute>} />
          <Route path="/ai-assistant" element={<ProtectedRoute><RequireBilling><AIAssistant /></RequireBilling></ProtectedRoute>} />
          <Route path="/campaigns" element={<ProtectedRoute><RequireBilling><Campaigns /></RequireBilling></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><RequireBilling><CalendarPage /></RequireBilling></ProtectedRoute>} />
          <Route path="/reports" element={<Navigate to="/app/reports" replace />} />
          <Route path="/market" element={<ProtectedRoute><RequireBilling><Market /></RequireBilling></ProtectedRoute>} />
          <Route path="/market-intelligence" element={<Navigate to="/market" replace />} />
          <Route path="/automations" element={<Navigate to="/app/automation" replace />} />
          {/* Settings lives in the /app shell now. The legacy top-level path
              redirects so old links (and the legacy dashboard nav) don't strand
              users in the retired chrome. */}
          <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
          <Route path="/profile" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/dashboard/integrations" element={<ProtectedRoute><RequireBilling><IntegrationHub /></RequireBilling></ProtectedRoute>} />

          {/* Comparison Pages */}
          <Route path="/vs/boldtrail" element={<VsBoldTrail />} />
          {/* Phase 2 redesign: /compare/boldtrail uses the new comparison page.
              /vs/boldtrail continues to render the legacy VsBoldTrail page for SEO. */}
          <Route path="/compare/boldtrail" element={<RDCompareBoldtrail />} />
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
          </div>
          </Suspense>
          </SubscriptionProvider>
          <CookieConsent />
          <SiteAssistant />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
