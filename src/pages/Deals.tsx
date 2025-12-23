import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import DealsStats from "@/components/deals/DealsStats";
import DealsKanban from "@/components/deals/DealsKanban";
import DealsList from "@/components/deals/DealsList";
import AddDealModal from "@/components/deals/AddDealModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Deals = () => {
  const { t } = useTranslation();
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
    <AppLayout user={user} profile={profile}>
      <div className="space-y-6">
        {/* Top Bar */}
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">{t('app.deals.title')} {t('app.deals.pipeline')}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{t('app.deals.allDeals')}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[180px] h-8 text-xs">
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

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 bg-muted rounded-md p-0.5">
                <Button
                  variant={view === "kanban" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={() => setView("kanban")}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span className="ml-1 hidden sm:inline">{t('app.deals.pipeline')}</span>
                </Button>
                <Button
                  variant={view === "list" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={() => setView("list")}
                >
                  <List className="h-3.5 w-3.5" />
                  <span className="ml-1 hidden sm:inline">{t('app.common.all')}</span>
                </Button>
              </div>

              <Button size="sm" className="h-8 text-xs" onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-3.5 w-3.5 mr-1.5" />
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

      <AddDealModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen}
        onDealAdded={handleDealAdded}
      />
    </AppLayout>
  );
};

export default Deals;
