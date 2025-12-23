import { ReactNode } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import TrialExpiredModal from "@/components/dashboard/TrialExpiredModal";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface AppLayoutProps {
  children: ReactNode;
  user?: any;
  profile?: any;
}

const AppLayout = ({ children, user, profile }: AppLayoutProps) => {
  const { trialExpired, trialDaysLeft } = useSubscription();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full bg-background">
      <TrialExpiredModal isOpen={trialExpired} />
      <DashboardSidebar trialDaysLeft={trialDaysLeft} />
      
      {/* Main content - full width on mobile, flex-1 on desktop */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <DashboardNavbar user={user} profile={profile} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
