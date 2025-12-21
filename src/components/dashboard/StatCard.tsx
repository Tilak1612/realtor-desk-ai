import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
}

const StatCard = ({ title, value, subtitle }: StatCardProps) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
        {title}
      </p>
      <p className="text-3xl font-bold text-foreground">
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;