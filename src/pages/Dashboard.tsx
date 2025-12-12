import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import StatCard from "@/components/dashboard/StatCard";
import HotLeadsWidget from "@/components/dashboard/HotLeadsWidget";
import TasksWidget from "@/components/dashboard/TasksWidget";
import DealsWidget from "@/components/dashboard/DealsWidget";
import MarketWidget from "@/components/dashboard/MarketWidget";
import { Users, Briefcase, CheckSquare, DollarSign, Crown, ArrowRight } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
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
  const { subscribed, subscriptionTier } = useSubscription();

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

  const getTrialDaysLeft = () => {
    if (!profile?.trial_ends_at) return 0;
    const endDate = new Date(profile.trial_ends_at);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
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
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar trialDaysLeft={getTrialDaysLeft()} />
      
      <div className="flex-1 lg:ml-0">
        <DashboardNavbar user={user} profile={profile} />
        
        <main className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Trial Banner */}
          {!subscribed && getTrialDaysLeft() > 0 && (
            <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Crown className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold">
                      {getTrialDaysLeft()} days left in your free trial
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Upgrade now to continue after your trial ends
                    </p>
                  </div>
                </div>
                <Link to="/billing">
                  <Button className="btn-gradient">
                    Upgrade Now <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.full_name?.split(' ')[0]}! 👋</h1>
            <p className="text-muted-foreground">
              You have <span className="font-semibold">{getTasksDueToday()} tasks</span> due today
              {hotLeads.length > 0 && (
                <> and <span className="font-semibold">{hotLeads.length} hot leads</span> to follow up</>
              )}
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="New Leads (This Month)"
              value={analytics?.monthly_leads || 0}
              change={analytics?.leads_change_percent || 0}
              trend={analytics?.leads_change_percent >= 0 ? "up" : "down"}
              icon={Users}
            />
            <StatCard
              title="Active Deals"
              value={analytics?.active_deals_count || 0}
              subtitle={`$${(analytics?.pipeline_value || 0).toLocaleString()} pipeline`}
              icon={Briefcase}
            />
            <StatCard
              title="Tasks Due Today"
              value={getTasksDueToday()}
              subtitle={getOverdueTasks() > 0 ? `${getOverdueTasks()} overdue` : undefined}
              trend={getOverdueTasks() > 0 ? "down" : "neutral"}
              icon={CheckSquare}
            />
            <StatCard
              title="Revenue YTD"
              value={`$${(analytics?.ytd_revenue || 0).toLocaleString()}`}
              subtitle={
                analytics?.annual_goal
                  ? `${Math.round((analytics.ytd_revenue / analytics.annual_goal) * 100)}% of annual goal`
                  : undefined
              }
              icon={DollarSign}
            />
          </div>

          {/* Widgets Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <HotLeadsWidget leads={hotLeads} />
              <TasksWidget tasks={todayTasks} onTaskComplete={handleTaskComplete} />
            </div>
            
            <div className="space-y-6">
              <MarketWidget defaultCity={profile?.city} />
            </div>
          </div>

          {/* Deals Pipeline - Full Width */}
          <DealsWidget stats={dealStats} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
