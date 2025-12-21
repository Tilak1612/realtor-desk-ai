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
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          {change !== undefined && (
            <div className={`flex items-center gap-1 ${getTrendColor()}`}>
              {trend === "up" ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : trend === "down" ? (
                <TrendingDown className="w-3.5 h-3.5" />
              ) : null}
              <span className="text-meta font-medium">{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className="space-y-0.5">
          <p className="text-meta text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="text-heading-2">{value}</p>
          {subtitle && (
            <p className="text-meta text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
