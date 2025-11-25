import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, DollarSign, Users, Briefcase, Download } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const Reports = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

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
    { source: "Website", count: 120 },
    { source: "Referral", count: 85 },
    { source: "Social Media", count: 67 },
    { source: "Open House", count: 43 },
    { source: "Other", count: 28 },
  ];

  if (!user || !profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      <div className="flex flex-col flex-1">
        <DashboardNavbar user={user} profile={profile} />
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Reports & Analytics</h1>
              <p className="text-muted-foreground">
                Track your performance and business metrics
              </p>
            </div>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>

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

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="deals">Deals</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="leads" stroke="hsl(var(--primary))" strokeWidth={2} />
                      <Line type="monotone" dataKey="deals" stroke="hsl(var(--secondary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lead Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={leadSourceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="source" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leads">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Detailed lead analytics coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deals">
              <Card>
                <CardHeader>
                  <CardTitle>Deal Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Detailed deal analytics coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Detailed revenue analytics coming soon...</p>
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
