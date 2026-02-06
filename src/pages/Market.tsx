import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, TrendingUp, TrendingDown, Home, DollarSign, Calendar, Download, Info, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/dashboard/StatCard";

const Market = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<unknown>(null);
  const [profile, setProfile] = useState<unknown>(null);
  const [selectedCity, setSelectedCity] = useState("Toronto");

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

  const priceTrendData = [
    { month: "Jul", avgPrice: 1180000, daysOnMarket: 22 },
    { month: "Aug", avgPrice: 1195000, daysOnMarket: 20 },
    { month: "Sep", avgPrice: 1210000, daysOnMarket: 19 },
    { month: "Oct", avgPrice: 1225000, daysOnMarket: 18 },
    { month: "Nov", avgPrice: 1235000, daysOnMarket: 17 },
    { month: "Dec", avgPrice: 1245000, daysOnMarket: 18 },
  ];

  const daysOnMarketData = [
    { range: "0-7 days", count: 85 },
    { range: "8-14 days", count: 142 },
    { range: "15-30 days", count: 198 },
    { range: "31-60 days", count: 267 },
    { range: "60+ days", count: 175 },
  ];

  const marketData = {
    averagePrice: 1245000,
    priceChange: 8.5,
    medianDays: 18,
    inventory: 1243,
    activeListings: 867,
    soldLastMonth: 342,
  };

  const neighborhoods = [
    { name: "Downtown Core", avgPrice: 1450000, change: 12.3, trend: "up", listings: 124, avgDom: 14 },
    { name: "North York", avgPrice: 985000, change: 6.7, trend: "up", listings: 198, avgDom: 21 },
    { name: "Scarborough", avgPrice: 825000, change: -2.1, trend: "down", listings: 156, avgDom: 28 },
    { name: "Etobicoke", avgPrice: 1120000, change: 4.5, trend: "up", listings: 142, avgDom: 19 },
    { name: "East York", avgPrice: 965000, change: 7.8, trend: "up", listings: 87, avgDom: 16 },
  ];

  const handleExportCSV = () => {
    const headers = ["Neighborhood", "Average Price", "Change %", "Trend", "Listings", "Avg Days on Market"];
    const rows = neighborhoods.map(n => [
      n.name,
      n.avgPrice,
      n.change,
      n.trend,
      n.listings,
      n.avgDom
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `market-snapshot-${selectedCity.toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Market data exported to CSV successfully.",
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
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl font-semibold">Market Snapshot</h1>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                Beta
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Sample market data for demonstration purposes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[150px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Toronto">Toronto</SelectItem>
                <SelectItem value="Vancouver">Vancouver</SelectItem>
                <SelectItem value="Calgary">Calgary</SelectItem>
                <SelectItem value="Montreal">Montreal</SelectItem>
                <SelectItem value="Ottawa">Ottawa</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleExportCSV}>
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Beta Notice */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Info className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Market Snapshot (Beta)</p>
                <p className="text-xs text-muted-foreground">
                  This feature displays sample market data for demonstration. Real MLS/CREA integration with live data is coming soon.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Average Price"
            value={`$${marketData.averagePrice.toLocaleString()}`}
            subtitle={`+${marketData.priceChange}% from last month`}
            icon={DollarSign}
            trend="up"
            change={marketData.priceChange}
          />
          <StatCard
            title="Median Days on Market"
            value={`${marketData.medianDays} days`}
            subtitle="Fast-moving market"
            icon={Calendar}
          />
          <StatCard
            title="Active Listings"
            value={marketData.activeListings}
            subtitle={`${marketData.soldLastMonth} sold last month`}
            icon={Home}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Price Trends (6 Months)
              </CardTitle>
              <CardDescription className="text-xs">Average listing price over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={priceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis 
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                    className="text-xs"
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, "Avg Price"]}
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avgPrice" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Days on Market Distribution
              </CardTitle>
              <CardDescription className="text-xs">How quickly properties sell</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={daysOnMarketData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="range" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    formatter={(value: number) => [value, "Properties"]}
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Neighborhood Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Neighborhood Trends</CardTitle>
            <CardDescription className="text-xs">Click on a neighborhood to see detailed comparables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 text-xs font-medium text-muted-foreground">Neighborhood</th>
                    <th className="pb-3 text-xs font-medium text-muted-foreground text-right">Avg Price</th>
                    <th className="pb-3 text-xs font-medium text-muted-foreground text-right">Change</th>
                    <th className="pb-3 text-xs font-medium text-muted-foreground text-right">Listings</th>
                    <th className="pb-3 text-xs font-medium text-muted-foreground text-right">Avg DOM</th>
                    <th className="pb-3 text-xs font-medium text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {neighborhoods.map((neighborhood) => (
                    <tr
                      key={neighborhood.name}
                      className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          <span className="text-sm font-medium">{neighborhood.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right text-sm">
                        ${neighborhood.avgPrice.toLocaleString()}
                      </td>
                      <td className="py-3 text-right">
                        <Badge
                          variant={neighborhood.trend === "up" ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {neighborhood.trend === "up" ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(neighborhood.change)}%
                        </Badge>
                      </td>
                      <td className="py-3 text-right text-sm">{neighborhood.listings}</td>
                      <td className="py-3 text-right text-sm">{neighborhood.avgDom} days</td>
                      <td className="py-3 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => {
                            toast({
                              title: "Coming Soon",
                              description: `Detailed comparables for ${neighborhood.name} will be available with MLS integration.`,
                            });
                          }}
                        >
                          View Comps
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Market;
