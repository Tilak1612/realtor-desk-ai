import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = 
  | "active" 
  | "pending" 
  | "sold" 
  | "closed" 
  | "coming_soon" 
  | "off_market"
  | "won"
  | "lost"
  | "new"
  | "contacted"
  | "qualified"
  | "unqualified"
  | "converted";

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: "sm" | "default";
}

const statusConfig: Record<string, { 
  label: string; 
  className: string;
}> = {
  // Property statuses
  active: { 
    label: "Active", 
    className: "bg-[hsl(var(--status-active))] text-[hsl(var(--status-active-foreground))] border-transparent" 
  },
  pending: { 
    label: "Pending", 
    className: "bg-[hsl(var(--status-pending))] text-[hsl(var(--status-pending-foreground))] border-transparent" 
  },
  sold: { 
    label: "Sold", 
    className: "bg-[hsl(var(--status-closed))] text-[hsl(var(--status-closed-foreground))] border-transparent" 
  },
  closed: { 
    label: "Closed", 
    className: "bg-[hsl(var(--status-closed))] text-[hsl(var(--status-closed-foreground))] border-transparent" 
  },
  coming_soon: { 
    label: "Coming Soon", 
    className: "bg-[hsl(var(--status-coming-soon))] text-[hsl(var(--status-coming-soon-foreground))] border-transparent" 
  },
  off_market: { 
    label: "Off Market", 
    className: "bg-[hsl(var(--status-off-market))] text-[hsl(var(--status-off-market-foreground))] border-transparent" 
  },
  
  // Deal statuses
  won: { 
    label: "Won", 
    className: "bg-[hsl(var(--status-active))] text-[hsl(var(--status-active-foreground))] border-transparent" 
  },
  lost: { 
    label: "Lost", 
    className: "bg-destructive text-destructive-foreground border-transparent" 
  },
  
  // Lead/Contact statuses
  new: { 
    label: "New", 
    className: "bg-[hsl(var(--status-coming-soon))] text-[hsl(var(--status-coming-soon-foreground))] border-transparent" 
  },
  contacted: { 
    label: "Contacted", 
    className: "bg-[hsl(var(--status-pending))] text-[hsl(var(--status-pending-foreground))] border-transparent" 
  },
  qualified: { 
    label: "Qualified", 
    className: "bg-[hsl(var(--status-active))] text-[hsl(var(--status-active-foreground))] border-transparent" 
  },
  unqualified: { 
    label: "Unqualified", 
    className: "bg-[hsl(var(--status-off-market))] text-[hsl(var(--status-off-market-foreground))] border-transparent" 
  },
  converted: { 
    label: "Converted", 
    className: "bg-[hsl(var(--status-closed))] text-[hsl(var(--status-closed-foreground))] border-transparent" 
  },
};

export function StatusBadge({ status, className, size = "default" }: StatusBadgeProps) {
  const normalizedStatus = status?.toLowerCase().replace(/\s+/g, "_") || "unknown";
  const config = statusConfig[normalizedStatus] || { 
    label: status || "Unknown", 
    className: "bg-muted text-muted-foreground" 
  };

  return (
    <Badge 
      className={cn(
        config.className,
        size === "sm" && "text-[10px] px-1.5 py-0.5",
        size === "default" && "text-xs px-2 py-0.5",
        "font-medium",
        className
      )}
    >
      {config.label}
    </Badge>
  );
}

export default StatusBadge;
