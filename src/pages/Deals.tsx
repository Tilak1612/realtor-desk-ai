import { useState, useEffect } from "react";
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

const Deals = () => {
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
      <div className="flex-1 flex flex-col">
        <DashboardNavbar user={user} profile={profile} />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">Deals Pipeline</h1>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-1 bg-muted rounded-md p-1">
                  <Button
                    variant={view === "kanban" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setView("kanban")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={view === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setView("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Deal
                </Button>
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
    </div>
  );
};

export default Deals;
