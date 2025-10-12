import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import CanadianMarket from "./pages/CanadianMarket";
import Demo from "./pages/Demo";
import Resources from "./pages/Resources";
import Integrations from "./pages/Integrations";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/canadian-market" element={<CanadianMarket />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/demo-requests" element={<AdminDemoRequests />} />
          
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
