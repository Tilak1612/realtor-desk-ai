import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
}

const StatCard = ({ title, value, change, subtitle, icon: Icon, trend = "neutral" }: StatCardProps) => {
  const getTrendColor = () => {
    if (trend === "up") return "text-green-500";
    if (trend === "down") return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          {change !== undefined && (
            <div className={`flex items-center gap-1 ${getTrendColor()}`}>
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : trend === "down" ? (
                <TrendingDown className="w-4 h-4" />
              ) : null}
              <span className="text-sm font-medium">{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
