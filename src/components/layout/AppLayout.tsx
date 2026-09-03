import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import TrialExpiredModal from "@/components/dashboard/TrialExpiredModal";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface AppLayoutProps {
  children: ReactNode;
  user?: unknown;
  profile?: unknown;
}

const AppLayout = ({ children, user, profile }: AppLayoutProps) => {
  const { trialExpired, trialDaysLeft } = useSubscription();

  return (
    <div className="app h-screen flex w-full bg-background overflow-hidden">
      <TrialExpiredModal isOpen={trialExpired} />
      <DashboardSidebar trialDaysLeft={trialDaysLeft} />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardNavbar user={user} profile={profile} />

        {/* Six items in the /app sidebar (Tasks, Calendar, Properties,
            Campaigns, Market, Integrations) point at these legacy routes.
            Landing here replaces the entire chrome -- different sidebar,
            different navbar, different page-title convention -- and there was
            NO link back to /app from anywhere in this shell. A non-technical
            agent who clicked Tasks was stranded in the old product with no way
            home, and now had two Settings pages and two Reports pages showing
            different data.

            This bar is the minimum honest fix while the two shells still
            exist. The real resolution is porting these routes into /app; until
            then nobody gets trapped. */}
        <div className="border-b bg-muted/40 px-4 sm:px-6 py-2">
          <Link
            to="/app"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            Back to Desk
          </Link>
        </div>

        {/* overflow-x-hidden is a safety net against child elements that
            escape their container on narrow phones (Round 3 audit flagged
            documentElement.scrollWidth > clientWidth on /today at 420px).
            Page-level fixes address the specific overflowing elements;
            this prevents the entire viewport from scrolling sideways when
            any future regression slips one past. */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-4 sm:p-6 max-w-7xl mx-auto pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
