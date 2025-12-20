import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, DollarSign, Users, Briefcase, Download, Calendar, Filter, FileText } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { format, subDays, subMonths, startOfMonth, endOfMonth } from "date-fns";

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

  const exportToPDF = (reportName: string) => {
    // In a real implementation, this would use a PDF library like jsPDF or react-pdf
    toast({
      title: "PDF Export",
      description: `${reportName} PDF export will be available in the next update.`,
    });
  };

  const exportPipelineCSV = () => {
    const data = conversionData.map(d => ({
      stage: d.stage,
      count: d.count,
      percentage: `${d.percentage}%`
    }));
    exportToCSV(data, "pipeline-report", ["Stage", "Count", "Percentage"]);
  };

  const exportActivityCSV = () => {
    const data = activityData.map(d => ({
      date: d.date,
      calls: d.calls,
      emails: d.emails,
      meetings: d.meetings
    }));
    exportToCSV(data, "activity-report", ["Date", "Calls", "Emails", "Meetings"]);
  };

  const exportConversionCSV = () => {
    const data = monthlyData.map(d => ({
      month: d.month,
      leads: d.leads,
      deals: d.deals,
      revenue: `$${d.revenue.toLocaleString()}`
    }));
    exportToCSV(data, "conversion-report", ["Month", "Leads", "Deals", "Revenue"]);
  };

  if (!user || !profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 lg:ml-0">
        <DashboardNavbar user={user} profile={profile} />
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold">Reports & Analytics</h1>
              <p className="text-sm text-muted-foreground">
                Track your performance and business metrics
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Date Range Filter */}
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[140px] h-8 text-sm">
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

              {/* Source Filter */}
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[130px] h-8 text-sm">
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

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px] h-8 text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2.65M</div>
                <p className="text-xs text-muted-foreground">+23% from last period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">343</div>
                <p className="text-xs text-muted-foreground">+12% from last period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Closed Deals</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">63</div>
                <p className="text-xs text-muted-foreground">+8 from last period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18.4%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last period</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="pipeline" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="conversions">Conversions</TabsTrigger>
              <TabsTrigger value="sources">Lead Sources</TabsTrigger>
            </TabsList>

            {/* Pipeline Report */}
            <TabsContent value="pipeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Pipeline Report</CardTitle>
                      <CardDescription>{getDateRangeLabel()} • Showing deal progression</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={exportPipelineCSV}>
                        <Download className="h-4 w-4 mr-2" />
                        CSV
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => exportToPDF("Pipeline Report")}>
                        <FileText className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={conversionData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="stage" type="category" width={80} />
                      <Tooltip 
                        formatter={(value: number, name: string) => [value, name === "count" ? "Deals" : name]}
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activities Report */}
            <TabsContent value="activities" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Activity Report</CardTitle>
                      <CardDescription>{getDateRangeLabel()} • Calls, emails, and meetings</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={exportActivityCSV}>
                        <Download className="h-4 w-4 mr-2" />
                        CSV
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => exportToPDF("Activity Report")}>
                        <FileText className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
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

            {/* Conversions Report */}
            <TabsContent value="conversions" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Conversion Report</CardTitle>
                      <CardDescription>{getDateRangeLabel()} • Monthly performance</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={exportConversionCSV}>
                        <Download className="h-4 w-4 mr-2" />
                        CSV
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => exportToPDF("Conversion Report")}>
                        <FileText className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
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

            {/* Lead Sources */}
            <TabsContent value="sources" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Lead Sources</CardTitle>
                      <CardDescription>{getDateRangeLabel()} • Where your leads come from</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        const data = leadSourceData.map(d => ({ source: d.source, count: d.count }));
                        exportToCSV(data, "lead-sources", ["Source", "Count"]);
                      }}>
                        <Download className="h-4 w-4 mr-2" />
                        CSV
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={leadSourceData}
                          dataKey="count"
                          nameKey="source"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
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
                      {leadSourceData.map((source, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                            <span className="font-medium">{source.source}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold">{source.count}</span>
                            <span className="text-muted-foreground text-sm ml-2">
                              ({Math.round((source.count / leadSourceData.reduce((a, b) => a + b.count, 0)) * 100)}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Reports;