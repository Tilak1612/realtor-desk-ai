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
import TodayFocusWidget from "@/components/dashboard/TodayFocusWidget";
import RecentActivityWidget from "@/components/dashboard/RecentActivityWidget";
import RevenueBreakdownWidget from "@/components/dashboard/RevenueBreakdownWidget";
import { ImportListingsWidget } from "@/components/dashboard/ImportListingsWidget";
import { AgentIntelligenceWidget } from "@/components/dashboard/AgentIntelligenceWidget";
import { QuickAreaImportWidget } from "@/components/dashboard/QuickAreaImportWidget";
import { ImportHistoryWidget } from "@/components/dashboard/ImportHistoryWidget";
import { Users, Briefcase, CheckSquare, DollarSign } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [hotLeads, setHotLeads] = useState<any[]>([]);
  const [todayTasks, setTodayTasks] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState({
    ytdRevenue: 0,
    closedDealsCount: 0,
    grossVolume: 0,
    commissionRate: 2.5,
  });
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
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const yearStart = new Date(now.getFullYear(), 0, 1).toISOString();
    
    const { count: monthlyLeadsCount } = await supabase
      .from("contacts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", startOfMonth);

    const { data: dealsData } = await supabase
      .from("deals")
      .select("stage, value, listing_price, commission_percentage, status, closing_date")
      .eq("user_id", userId);

    const { data: propertiesData } = await supabase
      .from("properties")
      .select("price, status")
      .eq("user_id", userId);

    const activeDeals = dealsData?.filter(d => d.status === "active") || [];
    const activeDealsCount = activeDeals.length;
    const pipelineValue = activeDeals.reduce((sum, deal) => sum + Number(deal.value || deal.listing_price || 0), 0);

    const closedDeals = dealsData?.filter(d => 
      d.status === "won" && 
      d.closing_date && 
      new Date(d.closing_date) >= new Date(yearStart)
    ) || [];

    const grossVolume = closedDeals.reduce((sum, deal) => {
      return sum + Number(deal.value || deal.listing_price || 0);
    }, 0);
    
    const ytdRevenue = closedDeals.reduce((sum, deal) => {
      const dealValue = Number(deal.value || deal.listing_price || 0);
      const commission = deal.commission_percentage || 2.5;
      return sum + (dealValue * commission / 100);
    }, 0);

    const soldProperties = propertiesData?.filter(p => p.status === "sold") || [];
    const propertiesRevenue = soldProperties.reduce((sum, prop) => {
      return sum + (Number(prop.price || 0) * 0.025);
    }, 0);

    const totalYtdRevenue = ytdRevenue + propertiesRevenue;

    setRevenueData({
      ytdRevenue: totalYtdRevenue,
      closedDealsCount: closedDeals.length,
      grossVolume,
      commissionRate: 2.5,
    });

    setAnalytics({
      monthly_leads: monthlyLeadsCount || 0,
      leads_change_percent: 0,
      active_deals_count: activeDealsCount,
      pipeline_value: pipelineValue,
      ytd_revenue: totalYtdRevenue,
      annual_goal: 150000,
    });

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

    if (dealsData) {
      const stats: any = {
        lead: { count: 0, value: 0 },
        viewing: { count: 0, value: 0 },
        offer: { count: 0, value: 0 },
        negotiation: { count: 0, value: 0 },
        closing: { count: 0, value: 0 },
      };

      dealsData.filter(d => d.status === "active").forEach(deal => {
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

  const getTasksDueToday = () => todayTasks.filter(t => t.status !== "completed").length;
  const getOverdueTasks = () => {
    const now = new Date();
    return todayTasks.filter(task => {
      if (!task.due_time || task.status === "completed") return false;
      const [hours, minutes] = task.due_time.split(":");
      const taskTime = new Date();
      taskTime.setHours(parseInt(hours), parseInt(minutes));
      return taskTime < now;
    }).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-body-sm">{t('app.dashboard.loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      <TrialExpiredModal isOpen={trialExpired} />
      <DashboardSidebar trialDaysLeft={trialDaysLeft} />
      
      <div className="flex-1 lg:ml-0">
        <DashboardNavbar user={user} profile={profile} />
        
        <main className="p-4 md:p-5 space-y-4">
          {!subscribed && trialDaysLeft > 0 && (
            <TrialBanner daysLeft={trialDaysLeft} />
          )}

          {/* Welcome - Compact */}
          <div className="pb-1">
            <h1 className="text-heading-1">{t('app.dashboard.welcomeBack')}, {profile?.full_name?.split(' ')[0]}!</h1>
            <p className="text-body-sm text-muted-foreground">
              {getTasksDueToday()} tasks due today
              {hotLeads.length > 0 && ` • ${hotLeads.length} hot leads to follow up`}
            </p>
          </div>

          {/* Row 1 - Action First: Today Focus + Tasks Due */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2">
              <TodayFocusWidget 
                tasksDueToday={getTasksDueToday()} 
                hotLeadsCount={hotLeads.length}
                overdueCount={getOverdueTasks()}
              />
            </div>
            <div>
              <TasksWidget tasks={todayTasks} onTaskComplete={handleTaskComplete} />
            </div>
          </div>

          {/* Row 2 - Opportunity: Hot Leads + Pipeline Summary */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2">
              <HotLeadsWidget leads={hotLeads} />
            </div>
            <div>
              {/* Pipeline Summary Stats */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  title={t('app.dashboard.newLeadsThisMonth')}
                  value={analytics?.monthly_leads || 0}
                  change={analytics?.leads_change_percent || 0}
                  trend={analytics?.leads_change_percent >= 0 ? "up" : "down"}
                  icon={Users}
                />
                <StatCard
                  title={t('app.dashboard.activeDeals')}
                  value={analytics?.active_deals_count || 0}
                  subtitle={`$${(analytics?.pipeline_value || 0).toLocaleString()}`}
                  icon={Briefcase}
                />
                <StatCard
                  title={t('app.dashboard.tasksDue')}
                  value={getTasksDueToday()}
                  subtitle={getOverdueTasks() > 0 ? `${getOverdueTasks()} overdue` : undefined}
                  trend={getOverdueTasks() > 0 ? "down" : "neutral"}
                  icon={CheckSquare}
                />
                <StatCard
                  title={t('app.dashboard.revenueYTD')}
                  value={`$${(analytics?.ytd_revenue || 0).toLocaleString()}`}
                  subtitle={
                    analytics?.annual_goal
                      ? `${Math.round((analytics.ytd_revenue / analytics.annual_goal) * 100)}% of goal`
                      : undefined
                  }
                  icon={DollarSign}
                />
              </div>
            </div>
          </div>

          {/* Row 3 - Context: Recent Activity + Revenue */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2">
              {user && <RecentActivityWidget userId={user.id} />}
            </div>
            <div>
              <RevenueBreakdownWidget
                ytdRevenue={revenueData.ytdRevenue}
                closedDealsCount={revenueData.closedDealsCount}
                grossVolume={revenueData.grossVolume}
                commissionRate={revenueData.commissionRate}
              />
            </div>
          </div>

          {/* Row 4 - Pipeline Overview */}
          <DealsWidget stats={dealStats} />

          {/* Row 5 - Onboarding & Data Health (only for new users) */}
          {user && (hotLeads.length === 0 || todayTasks.length === 0) && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <OnboardingChecklist userId={user.id} />
              <MarketWidget defaultCity={profile?.city} />
            </div>
          )}

          {/* Row 6 - Import Tools */}
          <div className="space-y-4">
            <h2 className="text-heading-2">Data Import Tools</h2>
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