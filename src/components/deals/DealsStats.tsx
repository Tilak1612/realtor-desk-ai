import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, DollarSign, Target, Clock } from "lucide-react";

interface DealsStatsProps {
  filter: string;
  refreshTrigger: number;
}

const DealsStats = ({ filter, refreshTrigger }: DealsStatsProps) => {
  const [stats, setStats] = useState({
    activeDeals: 0,
    totalValue: 0,
    wonThisMonth: { count: 0, value: 0 },
    avgCycleTime: 0
  });

  useEffect(() => {
    fetchStats();
  }, [filter, refreshTrigger]);

  const fetchStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let query = supabase
      .from("deals")
      .select("*")
      .eq("user_id", user.id);

    if (filter === "active") {
      query = query.eq("status", "active");
    } else if (filter === "won") {
      query = query.eq("stage", "won");
    } else if (filter === "lost") {
      query = query.eq("stage", "lost");
    }

    const { data: deals } = await query;

    if (deals) {
      const activeDeals = deals.filter(d => d.status === "active" && d.stage !== "sold" && d.stage !== "withdrawn");
      // Use listing_price if available, otherwise fall back to value
      const totalValue = activeDeals.reduce((sum, d) => sum + (Number(d.listing_price || d.value) || 0), 0);
      
      const wonDeals = deals.filter(d => 
        d.stage === "sold" && 
        new Date(d.updated_at) >= startOfMonth
      );
      const wonValue = wonDeals.reduce((sum, d) => sum + (Number(d.listing_price || d.value) || 0), 0);

      // Calculate average cycle time
      const closedDeals = deals.filter(d => d.stage === "sold" || d.stage === "withdrawn");
      const avgCycleTime = closedDeals.length > 0
        ? closedDeals.reduce((sum, d) => {
            const created = new Date(d.created_at);
            const updated = new Date(d.updated_at);
            const days = Math.floor((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
            return sum + days;
          }, 0) / closedDeals.length
        : 0;

      setStats({
        activeDeals: activeDeals.length,
        totalValue,
        wonThisMonth: { count: wonDeals.length, value: wonValue },
        avgCycleTime: Math.round(avgCycleTime)
      });
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Transactions</p>
              <p className="text-2xl font-bold">{stats.activeDeals}</p>
            </div>
            <Target className="h-8 w-8 text-primary opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Pipeline Value</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-primary opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Sold This Month</p>
              <p className="text-2xl font-bold">{stats.wonThisMonth.count}</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(stats.wonThisMonth.value)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Close Time</p>
              <p className="text-2xl font-bold">{stats.avgCycleTime}</p>
              <p className="text-xs text-muted-foreground">days</p>
            </div>
            <Clock className="h-8 w-8 text-primary opacity-80" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealsStats;
