import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  previousValue?: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  comparisonLabel?: string;
}

const StatCard = ({ 
  title, 
  value, 
  change, 
  previousValue,
  subtitle, 
  icon: Icon, 
  trend = "neutral",
  comparisonLabel = "vs last month"
}: StatCardProps) => {
  const getTrendColor = () => {
    if (trend === "up") return "text-green-500";
    if (trend === "down") return "text-destructive";
    return "text-muted-foreground";
  };

  const getTrendBgColor = () => {
    if (trend === "up") return "bg-green-500/10";
    if (trend === "down") return "bg-destructive/10";
    return "bg-muted";
  };

  return (
    <Card className="bg-card border-border hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-accent/50 rounded-lg">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          {change !== undefined && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
              getTrendBgColor(),
              getTrendColor()
            )}>
              {trend === "up" ? (
                <TrendingUp className="w-3 h-3" />
              ) : trend === "down" ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <Minus className="w-3 h-3" />
              )}
              <span>{change > 0 ? "+" : ""}{change}%</span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {previousValue !== undefined && change !== undefined && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className={cn("font-medium", getTrendColor())}>
                {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
              </span>
              <span>{previousValue} {comparisonLabel}</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
