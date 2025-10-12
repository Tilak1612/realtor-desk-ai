import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LeadScoreBadgeProps {
  score: number | null;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const LeadScoreBadge = ({ score, size = "md", showLabel = false }: LeadScoreBadgeProps) => {
  if (!score && score !== 0) {
    return (
      <Badge variant="outline" className={size === "sm" ? "text-xs" : ""}>
        -
      </Badge>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "bg-green-500 hover:bg-green-600 text-white";
    if (score >= 70) return "bg-orange-500 hover:bg-orange-600 text-white";
    if (score >= 50) return "bg-yellow-500 hover:bg-yellow-600 text-white";
    return "bg-muted text-muted-foreground";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "🔥 Hot";
    if (score >= 70) return "Warm";
    if (score >= 50) return "Cool";
    return "Cold";
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  };

  return (
    <Badge className={cn(getScoreColor(score), sizeClasses[size])}>
      {showLabel ? getScoreLabel(score) : score}
    </Badge>
  );
};

export default LeadScoreBadge;
