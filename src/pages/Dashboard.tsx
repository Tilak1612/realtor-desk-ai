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
    // Calculate this month's date range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    
    // Fetch new leads this month (count from contacts table)
    const { count: monthlyLeadsCount } = await supabase
      .from("contacts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", startOfMonth);

    // Fetch active deals count and pipeline value
    const { data: dealsData } = await supabase
      .from("deals")
      .select("stage, value, listing_price")
      .eq("user_id", userId)
      .eq("status", "active");

    const activeDealsCount = dealsData?.length || 0;
    // Use listing_price as fallback if value is null
    const pipelineValue = dealsData?.reduce((sum, deal) => sum + Number(deal.value || deal.listing_price || 0), 0) || 0;

    // Set analytics from live data
    setAnalytics({
      monthly_leads: monthlyLeadsCount || 0,
      leads_change_percent: 0,
      active_deals_count: activeDealsCount,
      pipeline_value: pipelineValue,
      ytd_revenue: 0,
      annual_goal: 0,
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
        <p>{t('app.dashboard.loading')}</p>
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
        
        <main className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Trial Banner */}
          {!subscribed && trialDaysLeft > 0 && (
            <TrialBanner daysLeft={trialDaysLeft} />
          )}

          {/* Welcome Section */}
          <div>
            <h1 className="text-xl md:text-2xl font-semibold mb-1">{t('app.dashboard.welcomeBack')}, {profile?.full_name?.split(' ')[0]}! 👋</h1>
            <p className="text-sm text-muted-foreground">
              {t('app.dashboard.tasksDueToday', { count: getTasksDueToday() }).replace('{{count}}', String(getTasksDueToday()))}
              {hotLeads.length > 0 && (
                <> {t('app.dashboard.hotLeadsToFollow', { count: hotLeads.length }).replace('{{count}}', String(hotLeads.length))}</>
              )}
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              subtitle={`$${(analytics?.pipeline_value || 0).toLocaleString()} ${t('app.dashboard.pipeline')}`}
              icon={Briefcase}
            />
            <StatCard
              title={t('app.dashboard.tasksDue')}
              value={getTasksDueToday()}
              subtitle={getOverdueTasks() > 0 ? `${getOverdueTasks()} ${t('app.dashboard.overdue')}` : undefined}
              trend={getOverdueTasks() > 0 ? "down" : "neutral"}
              icon={CheckSquare}
            />
            <StatCard
              title={t('app.dashboard.revenueYTD')}
              value={`$${(analytics?.ytd_revenue || 0).toLocaleString()}`}
              subtitle={
                analytics?.annual_goal
                  ? `${Math.round((analytics.ytd_revenue / analytics.annual_goal) * 100)}% ${t('app.dashboard.ofAnnualGoal')}`
                  : undefined
              }
              icon={DollarSign}
            />
          </div>

          {/* Onboarding Checklist for new users */}
          {user && (hotLeads.length === 0 || todayTasks.length === 0) && (
            <OnboardingChecklist userId={user.id} />
          )}

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
            <h2 className="text-lg font-semibold">Data Import Tools</h2>
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
