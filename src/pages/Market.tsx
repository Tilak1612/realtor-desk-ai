import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, TrendingUp, TrendingDown, Home, DollarSign, Calendar } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Market = () => {
  const navigate = useNavigate();
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

  const marketData = {
    averagePrice: 1245000,
    priceChange: 8.5,
    medianDays: 18,
    inventory: 1243,
    activeListings: 867,
    soldLastMonth: 342,
  };

  const neighborhoods = [
    { name: "Downtown Core", avgPrice: 1450000, change: 12.3, trend: "up" },
    { name: "North York", avgPrice: 985000, change: 6.7, trend: "up" },
    { name: "Scarborough", avgPrice: 825000, change: -2.1, trend: "down" },
    { name: "Etobicoke", avgPrice: 1120000, change: 4.5, trend: "up" },
    { name: "East York", avgPrice: 965000, change: 7.8, trend: "up" },
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
              <h1 className="text-3xl font-bold">Market Intelligence</h1>
              <p className="text-muted-foreground">
                Real-time market data and trends for your area
              </p>
            </div>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[180px]">
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
          </div>

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

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Neighborhood Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {neighborhoods.map((neighborhood) => (
                  <div
                    key={neighborhood.name}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-semibold">{neighborhood.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Avg: ${neighborhood.avgPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={neighborhood.trend === "up" ? "default" : "destructive"}
                        className="flex items-center gap-1"
                      >
                        {neighborhood.trend === "up" ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {Math.abs(neighborhood.change)}%
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Insights</CardTitle>
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
