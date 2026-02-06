import { ReactNode } from "react";
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
    <div className="app min-h-screen flex w-full bg-background">
      <TrialExpiredModal isOpen={trialExpired} />
      <DashboardSidebar trialDaysLeft={trialDaysLeft} />
      
      <div className="flex-1 flex flex-col lg:ml-0">
        <DashboardNavbar user={user} profile={profile} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
