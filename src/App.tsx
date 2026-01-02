import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Integrations from "./pages/Integrations";
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
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
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

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
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
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/faq" element={<FAQ />} />
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
