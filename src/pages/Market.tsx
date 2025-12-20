import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, TrendingUp, TrendingDown, Home, DollarSign, Calendar, Download, Info, BarChart3 } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useToast } from "@/hooks/use-toast";

const Market = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
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

  // Sample price trend data
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
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-semibold">Market Snapshot</h1>
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
                <SelectTrigger className="w-[150px] h-8 text-sm">
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
              <Button variant="outline" onClick={handleExportCSV} size="sm" className="h-8 text-xs">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Beta Notice */}
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Market Snapshot (Beta)</p>
                  <p className="text-sm text-muted-foreground">
                    This feature displays sample market data for demonstration. Real MLS/CREA integration with live data is coming soon. 
                    Data shown is illustrative and should not be used for actual market analysis.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Stats */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Price</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${marketData.averagePrice.toLocaleString()}
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{marketData.priceChange}% from last month
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Median Days on Market</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{marketData.medianDays} days</div>
                <p className="text-xs text-muted-foreground">Fast-moving market</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{marketData.activeListings}</div>
                <p className="text-xs text-muted-foreground">
                  {marketData.soldLastMonth} sold last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-2 mb-6">
            {/* Price Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Price Trends (6 Months)
                </CardTitle>
                <CardDescription>Average listing price over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
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

            {/* Days on Market Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Days on Market Distribution
                </CardTitle>
                <CardDescription>How quickly properties sell</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
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

          {/* Neighborhood Table with Drill-down */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Neighborhood Trends</CardTitle>
                  <CardDescription>Click on a neighborhood to see detailed comparables</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-medium text-muted-foreground">Neighborhood</th>
                      <th className="pb-3 font-medium text-muted-foreground text-right">Avg Price</th>
                      <th className="pb-3 font-medium text-muted-foreground text-right">Change</th>
                      <th className="pb-3 font-medium text-muted-foreground text-right">Listings</th>
                      <th className="pb-3 font-medium text-muted-foreground text-right">Avg DOM</th>
                      <th className="pb-3 font-medium text-muted-foreground text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {neighborhoods.map((neighborhood) => (
                      <tr
                        key={neighborhood.name}
                        className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="font-medium">{neighborhood.name}</span>
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          ${neighborhood.avgPrice.toLocaleString()}
                        </td>
                        <td className="py-4 text-right">
                          <Badge
                            variant={neighborhood.trend === "up" ? "default" : "destructive"}
                            className="flex items-center gap-1 w-fit ml-auto"
                          >
                            {neighborhood.trend === "up" ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {Math.abs(neighborhood.change)}%
                          </Badge>
                        </td>
                        <td className="py-4 text-right">{neighborhood.listings}</td>
                        <td className="py-4 text-right">{neighborhood.avgDom} days</td>
                        <td className="py-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
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

          {/* Market Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Market Insights</CardTitle>
              <CardDescription>AI-generated insights based on market data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold mb-1">🔥 Hot Market Alert</h4>
                  <p className="text-sm text-muted-foreground">
                    Downtown Core is experiencing high demand with properties selling 40% faster
                    than the city average.
                  </p>
                </div>
                <div className="p-4 bg-secondary/10 rounded-lg">
                  <h4 className="font-semibold mb-1">💡 Investment Opportunity</h4>
                  <p className="text-sm text-muted-foreground">
                    East York shows strong growth potential with prices up 7.8% and increasing
                    buyer interest.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-1">📊 Market Forecast</h4>
                  <p className="text-sm text-muted-foreground">
                    Analysts predict continued growth in the {selectedCity} market with an
                    expected 5-8% increase over the next quarter.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Market;