import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List } from "lucide-react";
import DealsStats from "@/components/deals/DealsStats";
import DealsKanban from "@/components/deals/DealsKanban";
import DealsList from "@/components/deals/DealsList";
import AddDealModal from "@/components/deals/AddDealModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TrialExpiredModal from "@/components/dashboard/TrialExpiredModal";
import { useSubscription } from "@/contexts/SubscriptionContext";

const Deals = () => {
  const { t } = useTranslation();
  const { trialExpired } = useSubscription();
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [filter, setFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(profileData);
      }
    };
    fetchUserData();
  }, []);

  const handleDealAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col lg:ml-0">
        <DashboardNavbar user={user} profile={profile} />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{t('app.deals.title')} {t('app.deals.pipeline')}</h1>
                <p className="text-sm text-muted-foreground mt-1">{t('app.deals.allDeals')}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder={t('app.common.filter')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('app.deals.allDeals')}</SelectItem>
                    <SelectItem value="active">{t('app.deals.active')}</SelectItem>
                    <SelectItem value="buyer">{t('app.deals.stages.viewing')}</SelectItem>
                    <SelectItem value="seller">{t('app.deals.stages.offer')}</SelectItem>
                    <SelectItem value="closing_this_month">{t('app.deals.stages.closing')}</SelectItem>
                    <SelectItem value="sold">{t('app.deals.won')}</SelectItem>
                    <SelectItem value="withdrawn">{t('app.deals.lost')}</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1 bg-muted rounded-md p-1">
                    <Button
                      variant={view === "kanban" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setView("kanban")}
                    >
                      <LayoutGrid className="h-4 w-4" />
                      <span className="ml-1 hidden sm:inline">{t('app.deals.pipeline')}</span>
                    </Button>
                    <Button
                      variant={view === "list" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setView("list")}
                    >
                      <List className="h-4 w-4" />
                      <span className="ml-1 hidden sm:inline">{t('app.common.all')}</span>
                    </Button>
                  </div>

                  <Button onClick={() => setIsAddModalOpen(true)} className="flex-1 sm:flex-initial">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">{t('app.deals.addDeal')}</span>
                    <span className="sm:hidden">{t('app.common.add')}</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <DealsStats filter={filter} refreshTrigger={refreshTrigger} />

            {/* Main Content */}
            {view === "kanban" ? (
              <DealsKanban filter={filter} refreshTrigger={refreshTrigger} />
            ) : (
              <DealsList filter={filter} refreshTrigger={refreshTrigger} />
            )}
          </div>
        </main>
      </div>

      <AddDealModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen}
        onDealAdded={handleDealAdded}
      />

      <TrialExpiredModal isOpen={trialExpired} />
    </div>
  );
};

export default Deals;
