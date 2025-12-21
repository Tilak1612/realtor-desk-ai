import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import StatCard from "@/components/dashboard/StatCard";
import HotLeadsWidget from "@/components/dashboard/HotLeadsWidget";
import TasksWidget from "@/components/dashboard/TasksWidget";
import DealsWidget from "@/components/dashboard/DealsWidget";
import MarketWidget from "@/components/dashboard/MarketWidget";
import TrialBanner from "@/components/dashboard/TrialBanner";
import TrialExpiredModal from "@/components/dashboard/TrialExpiredModal";
import OnboardingChecklist from "@/components/dashboard/OnboardingChecklist";
import AIInsightsWidget from "@/components/dashboard/AIInsightsWidget";
import { ImportListingsWidget } from "@/components/dashboard/ImportListingsWidget";
import { AgentIntelligenceWidget } from "@/components/dashboard/AgentIntelligenceWidget";
import { QuickAreaImportWidget } from "@/components/dashboard/QuickAreaImportWidget";
import { ImportHistoryWidget } from "@/components/dashboard/ImportHistoryWidget";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, UserPlus } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [hotLeads, setHotLeads] = useState<any[]>([]);
  const [todayTasks, setTodayTasks] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState("30");
  const [dealStats, setDealStats] = useState<any>({
    lead: { count: 0, value: 0 },
    viewing: { count: 0, value: 0 },
    offer: { count: 0, value: 0 },
    negotiation: { count: 0, value: 0 },
    closing: { count: 0, value: 0 },
  });
  const [loading, setLoading] = useState(true);
  const { subscribed, trialDaysLeft, trialExpired } = useSubscription();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/login");
          return;
        }

        setUser(session.user);

        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;

        if (!profileData?.onboarding_completed) {
          navigate("/onboarding");
          return;
        }

        setProfile(profileData);
        await fetchDashboardData(session.user.id);
      } catch (error: any) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const fetchDashboardData = async (userId: string) => {
    // Calculate date range
    const now = new Date();
    const daysAgo = parseInt(dateRange);
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    
    // Fetch contacts count
    const { count: contactsCount } = await supabase
      .from("contacts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    // Fetch properties count
    const { count: propertiesCount } = await supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    // Fetch active deals count and pipeline value
    const { data: dealsData } = await supabase
      .from("deals")
      .select("stage, value, listing_price")
      .eq("user_id", userId)
      .eq("status", "active");

    const activeDealsCount = dealsData?.length || 0;
    const pipelineValue = dealsData?.reduce((sum, deal) => sum + Number(deal.value || deal.listing_price || 0), 0) || 0;

    // Fetch tasks count
    const { count: tasksCount } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .neq("status", "completed");

    // Set analytics from live data
    setAnalytics({
      contacts_count: contactsCount || 0,
      properties_count: propertiesCount || 0,
      active_deals_count: activeDealsCount,
      pipeline_value: pipelineValue,
      tasks_pending: tasksCount || 0,
    });

    // Fetch hot leads (AI score >= 80)
    const { data: leadsData } = await supabase
      .from("contacts")
      .select("*")
      .eq("user_id", userId)
      .gte("ai_score", 80)
      .order("ai_score", { ascending: false })
      .limit(5);

    if (leadsData) {
      setHotLeads(leadsData.map(lead => ({
        ...lead,
        name: `${lead.first_name || ""} ${lead.last_name || ""}`.trim() || "Unknown",
        insight: (lead.metadata as any)?.insight || "New lead",
      })));
    }

    // Fetch today's tasks
    const today = new Date().toISOString().split('T')[0];
    const { data: tasksData } = await supabase
      .from("tasks")
      .select(`
        *,
        contact:contacts(first_name, last_name),
        deal:deals(title)
      `)
      .eq("user_id", userId)
      .eq("due_date", today)
      .order("due_time", { ascending: true });

    if (tasksData) {
      setTodayTasks(tasksData);
    }

    // Set deal statistics by stage
    if (dealsData) {
      const stats: any = {
        lead: { count: 0, value: 0 },
        viewing: { count: 0, value: 0 },
        offer: { count: 0, value: 0 },
        negotiation: { count: 0, value: 0 },
        closing: { count: 0, value: 0 },
      };

      dealsData.forEach(deal => {
        if (stats[deal.stage]) {
          stats[deal.stage].count++;
          stats[deal.stage].value += Number(deal.value || deal.listing_price || 0);
        }
      });

      setDealStats(stats);
    }
  };

  const handleTaskComplete = (taskId: string) => {
    setTodayTasks(tasks => tasks.filter(t => t.id !== taskId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">{t('app.dashboard.loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Trial Expired Modal - blocks all access */}
      <TrialExpiredModal isOpen={trialExpired} />
      
      <DashboardSidebar trialDaysLeft={trialDaysLeft} />
      
      <div className="flex-1 lg:ml-0">
        <DashboardNavbar user={user} profile={profile} />
        
        <main className="p-4 md:p-6 space-y-6">
          {/* Trial Banner */}
          {!subscribed && trialDaysLeft > 0 && (
            <TrialBanner daysLeft={trialDaysLeft} />
          )}

          {/* Header with Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                className="h-8 text-xs"
                onClick={() => navigate("/contacts")}
              >
                <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                Add new contact
              </Button>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="h-8 w-28 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 py-4 border-b border-border">
            <StatCard
              title="Total Contacts"
              value={analytics?.contacts_count || 0}
              subtitle="(To-date)"
            />
            <StatCard
              title="Properties Listed"
              value={analytics?.properties_count || 0}
              subtitle="(To-date)"
            />
            <StatCard
              title="Active Deals"
              value={analytics?.active_deals_count || 0}
              subtitle="(To-date)"
            />
            <StatCard
              title="Pipeline Value"
              value={`$${((analytics?.pipeline_value || 0) / 1000).toFixed(0)}k`}
              subtitle={`(${dateRange} days)`}
            />
            <StatCard
              title="Pending Tasks"
              value={analytics?.tasks_pending || 0}
              subtitle={`(${dateRange} days)`}
            />
          </div>

          {/* Onboarding Checklist */}
          {user && <OnboardingChecklist userId={user.id} />}

          {/* Widgets Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {user && <AIInsightsWidget userId={user.id} />}
              <HotLeadsWidget leads={hotLeads} />
              <TasksWidget tasks={todayTasks} onTaskComplete={handleTaskComplete} />
            </div>
            
            <div className="space-y-6">
              <MarketWidget defaultCity={profile?.city} />
            </div>
          </div>

          {/* Deals Pipeline - Full Width */}
          <DealsWidget stats={dealStats} />

          {/* Realtor.ca Import Tools */}
          <div className="space-y-6">
            <h2 className="text-base font-semibold text-foreground">Data Import Tools</h2>
            <ImportListingsWidget />
            <AgentIntelligenceWidget />
            <QuickAreaImportWidget />
            <ImportHistoryWidget />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;