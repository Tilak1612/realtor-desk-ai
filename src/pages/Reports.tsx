import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Calendar, Filter, BarChart3 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/dashboard/StatCard";
import { DollarSign, Users, Briefcase, TrendingUp } from "lucide-react";

interface ReportStats {
  totalRevenue: number;
  totalLeads: number;
  closedDeals: number;
  activeDeals: number;
  pipelineByStage: { stage: string; count: number }[];
}

const EMPTY_STATS: ReportStats = {
  totalRevenue: 0,
  totalLeads: 0,
  closedDeals: 0,
  activeDeals: 0,
  pipelineByStage: [],
};

const formatCurrency = (value: number) => {
  if (value === 0) return "$0";
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toLocaleString("en-CA")}`;
};

const Reports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<unknown>(null);
  const [profile, setProfile] = useState<unknown>(null);
  const [stats, setStats] = useState<ReportStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30d");
  const [sourceFilter, setSourceFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUser(session.user);
      const userId = session.user.id;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      setProfile(profileData);

      const [contactsRes, dealsRes] = await Promise.all([
        supabase.from("contacts").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("deals").select("stage, status, value, listing_price").eq("user_id", userId),
      ]);

      const deals = dealsRes.data ?? [];
      const closed = deals.filter((d) => d.status === "won" || d.stage === "closed");
      const active = deals.filter((d) => d.status !== "won" && d.stage !== "closed");
      const revenue = closed.reduce(
        (sum, d) => sum + Number(d.listing_price ?? d.value ?? 0),
        0
      );

      const stageCounts = active.reduce<Record<string, number>>((acc, d) => {
        const key = d.stage ?? "unknown";
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      }, {});
      const pipelineByStage = Object.entries(stageCounts).map(([stage, count]) => ({ stage, count }));

      setStats({
        totalRevenue: revenue,
        totalLeads: contactsRes.count ?? 0,
        closedDeals: closed.length,
        activeDeals: active.length,
        pipelineByStage,
      });
      setLoading(false);
    };

    load();
  }, [navigate]);

  const hasAnyData = useMemo(
    () => stats.totalLeads > 0 || stats.closedDeals > 0 || stats.activeDeals > 0,
    [stats]
  );

  const conversionRate = useMemo(() => {
    if (stats.totalLeads === 0) return "—";
    return `${((stats.closedDeals / stats.totalLeads) * 100).toFixed(1)}%`;
  }, [stats]);

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case "7d": return "Last 7 Days";
      case "30d": return "Last 30 Days";
      case "90d": return "Last 90 Days";
      case "12m": return "Last 12 Months";
      default: return "Last 30 Days";
    }
  };

  const exportPipelineCSV = () => {
    if (stats.pipelineByStage.length === 0) {
      toast({ title: "Nothing to export", description: "No pipeline data yet." });
      return;
    }
    const headers = ["Stage", "Count"];
    const csv = [
      headers.join(","),
      ...stats.pipelineByStage.map((row) => `${row.stage},${row.count}`),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pipeline-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: "Export Complete", description: "pipeline.csv downloaded successfully." });
  };

  if (!user || !profile || loading) {
    return (
      <AppLayout user={user} profile={profile}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  const EmptyChartState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
        <BarChart3 className="h-5 w-5 text-primary" />
      </div>
      <p className="text-sm font-medium mb-1">No data yet</p>
      <p className="text-xs text-muted-foreground max-w-sm mb-4">{message}</p>
      <Link to="/contacts">
        <Button size="sm" className="h-8 text-xs">Import contacts</Button>
      </Link>
    </div>
  );

  return (
    <AppLayout user={user} profile={profile}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Reports & Analytics</h1>
            <p className="text-sm text-muted-foreground">
              Track your performance and business metrics
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="12m">Last 12 Months</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <Filter className="h-3.5 w-3.5 mr-1.5" />
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="open_house">Open House</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats — all real counts, zeros when empty */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Closed Revenue"
            value={formatCurrency(stats.totalRevenue)}
            subtitle="From won deals"
            icon={DollarSign}
          />
          <StatCard
            title="Total Leads"
            value={stats.totalLeads}
            subtitle="Contacts in your CRM"
            icon={Users}
          />
          <StatCard
            title="Closed Deals"
            value={stats.closedDeals}
            subtitle={`${stats.activeDeals} active in pipeline`}
            icon={Briefcase}
          />
          <StatCard
            title="Conversion Rate"
            value={conversionRate}
            subtitle={stats.totalLeads > 0 ? "Closed / total leads" : "Requires leads and deals"}
            icon={TrendingUp}
          />
        </div>

        {/* Charts */}
        <Tabs defaultValue="pipeline" className="space-y-4">
          <TabsList className="h-8">
            <TabsTrigger value="pipeline" className="text-xs h-7">Pipeline</TabsTrigger>
            <TabsTrigger value="activities" className="text-xs h-7">Activities</TabsTrigger>
            <TabsTrigger value="conversions" className="text-xs h-7">Conversions</TabsTrigger>
            <TabsTrigger value="sources" className="text-xs h-7">Lead Sources</TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-medium">Pipeline Report</CardTitle>
                    <CardDescription className="text-xs">{getDateRangeLabel()} • Active deals by stage</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={exportPipelineCSV}>
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {stats.pipelineByStage.length === 0 ? (
                  <EmptyChartState message="Pipeline data will appear once you add deals with stages." />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.pipelineByStage} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis dataKey="stage" type="category" width={100} className="text-xs" />
                      <Tooltip
                        formatter={(value: number) => [value, "Deals"]}
                        contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Activity Report</CardTitle>
                <CardDescription className="text-xs">{getDateRangeLabel()} • Calls, emails, and meetings</CardDescription>
              </CardHeader>
              <CardContent>
                <EmptyChartState message="Activity tracking will appear once calls, emails, and meetings are logged." />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversions" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Conversion Report</CardTitle>
                <CardDescription className="text-xs">{getDateRangeLabel()} • Monthly performance</CardDescription>
              </CardHeader>
              <CardContent>
                {hasAnyData ? (
                  <EmptyChartState message="Historical trend view is coming soon. For now, see the KPI cards above." />
                ) : (
                  <EmptyChartState message="Conversion trends will appear once you have leads and closed deals." />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Lead Sources</CardTitle>
                <CardDescription className="text-xs">{getDateRangeLabel()} • Where your leads come from</CardDescription>
              </CardHeader>
              <CardContent>
                <EmptyChartState message="Source breakdown will appear once contacts are tagged with an acquisition source." />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Reports;
