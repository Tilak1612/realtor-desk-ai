import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Calendar, Filter, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { format } from "date-fns";
import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/dashboard/StatCard";
import { DollarSign, Users, Briefcase, TrendingUp } from "lucide-react";

const Reports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [dateRange, setDateRange] = useState("30d");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUser(session.user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      setProfile(profileData);
    };

    checkAuth();
  }, [navigate]);

  const monthlyData = [
    { month: "Jan", leads: 45, deals: 8, revenue: 320000 },
    { month: "Feb", leads: 52, deals: 10, revenue: 425000 },
    { month: "Mar", leads: 48, deals: 9, revenue: 380000 },
    { month: "Apr", leads: 61, deals: 12, revenue: 510000 },
    { month: "May", leads: 55, deals: 11, revenue: 465000 },
    { month: "Jun", leads: 58, deals: 13, revenue: 548000 },
  ];

  const leadSourceData = [
    { source: "Website", count: 120, color: "hsl(var(--primary))" },
    { source: "Referral", count: 85, color: "hsl(var(--secondary))" },
    { source: "Social Media", count: 67, color: "hsl(var(--accent))" },
    { source: "Open House", count: 43, color: "hsl(var(--muted))" },
    { source: "Other", count: 28, color: "hsl(var(--destructive))" },
  ];

  const conversionData = [
    { stage: "Leads", count: 343, percentage: 100 },
    { stage: "Contacted", count: 275, percentage: 80 },
    { stage: "Qualified", count: 165, percentage: 48 },
    { stage: "Viewing", count: 98, percentage: 29 },
    { stage: "Offer", count: 72, percentage: 21 },
    { stage: "Closed", count: 63, percentage: 18 },
  ];

  const activityData = [
    { date: "Mon", calls: 12, emails: 28, meetings: 3 },
    { date: "Tue", calls: 15, emails: 32, meetings: 5 },
    { date: "Wed", calls: 8, emails: 24, meetings: 2 },
    { date: "Thu", calls: 18, emails: 35, meetings: 4 },
    { date: "Fri", calls: 14, emails: 30, meetings: 6 },
  ];

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case "7d": return "Last 7 Days";
      case "30d": return "Last 30 Days";
      case "90d": return "Last 90 Days";
      case "12m": return "Last 12 Months";
      default: return "Last 30 Days";
    }
  };

  const exportToCSV = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
      headers.join(","),
      ...data.map(row => headers.map(h => row[h.toLowerCase().replace(/ /g, "_")] || row[h.toLowerCase()] || "").join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `${filename}.csv downloaded successfully.`,
    });
  };

  if (!user || !profile) {
    return (
      <AppLayout user={user} profile={profile}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

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

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value="$2.65M"
            subtitle="+23% from last period"
            icon={DollarSign}
            trend="up"
            change={23}
          />
          <StatCard
            title="Total Leads"
            value={343}
            subtitle="+12% from last period"
            icon={Users}
            trend="up"
            change={12}
          />
          <StatCard
            title="Closed Deals"
            value={63}
            subtitle="+8 from last period"
            icon={Briefcase}
            trend="up"
            change={15}
          />
          <StatCard
            title="Conversion Rate"
            value="18.4%"
            subtitle="+2.1% from last period"
            icon={TrendingUp}
            trend="up"
            change={2}
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
                    <CardDescription className="text-xs">{getDateRangeLabel()} • Showing deal progression</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={conversionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="stage" type="category" width={80} className="text-xs" />
                    <Tooltip 
                      formatter={(value: number) => [value, "Deals"]}
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-medium">Activity Report</CardTitle>
                    <CardDescription className="text-xs">{getDateRangeLabel()} • Calls, emails, and meetings</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                    />
                    <Bar dataKey="calls" fill="hsl(var(--primary))" name="Calls" />
                    <Bar dataKey="emails" fill="hsl(var(--secondary))" name="Emails" />
                    <Bar dataKey="meetings" fill="hsl(var(--accent))" name="Meetings" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversions" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-medium">Conversion Report</CardTitle>
                    <CardDescription className="text-xs">{getDateRangeLabel()} • Monthly performance</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis yAxisId="left" className="text-xs" />
                    <YAxis yAxisId="right" orientation="right" className="text-xs" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="leads" stroke="hsl(var(--primary))" strokeWidth={2} name="Leads" />
                    <Line yAxisId="left" type="monotone" dataKey="deals" stroke="hsl(var(--secondary))" strokeWidth={2} name="Deals" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-medium">Lead Sources</CardTitle>
                    <CardDescription className="text-xs">{getDateRangeLabel()} • Where your leads come from</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={leadSourceData}
                        dataKey="count"
                        nameKey="source"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ source, count }) => `${source}: ${count}`}
                      >
                        {leadSourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {leadSourceData.map((source) => (
                      <div key={source.source} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                          <span className="text-sm">{source.source}</span>
                        </div>
                        <span className="text-sm font-medium">{source.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Reports;
