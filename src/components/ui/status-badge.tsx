import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = 
  // Property statuses
  | "active" 
  | "pending" 
  | "sold" 
  | "closed" 
  | "coming_soon" 
  | "off_market"
  // Lead statuses
  | "new"
  | "contacted"
  | "nurturing"
  | "hot"
  | "qualified"
  | "unqualified"
  | "converted"
  // Deal statuses
  | "open"
  | "under_contract"
  | "won"
  | "lost";

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
    className: "bg-status-active text-status-active-foreground border-transparent" 
  },
  pending: { 
    label: "Pending", 
    className: "bg-status-pending text-status-pending-foreground border-transparent" 
  },
  sold: { 
    label: "Sold", 
    className: "bg-status-sold text-status-sold-foreground border-transparent" 
  },
  closed: { 
    label: "Closed", 
    className: "bg-status-closed text-status-closed-foreground border-transparent" 
  },
  coming_soon: { 
    label: "Coming Soon", 
    className: "bg-[hsl(var(--status-coming-soon))] text-[hsl(var(--status-coming-soon-foreground))] border-transparent" 
  },
  off_market: { 
    label: "Off Market", 
    className: "bg-[hsl(var(--status-off-market))] text-[hsl(var(--status-off-market-foreground))] border-transparent" 
  },
  
  // Lead statuses
  new: { 
    label: "New", 
    className: "bg-status-new text-status-new-foreground border-transparent" 
  },
  contacted: { 
    label: "Contacted", 
    className: "bg-status-contacted text-status-contacted-foreground border-transparent" 
  },
  nurturing: { 
    label: "Nurturing", 
    className: "bg-status-nurturing text-status-nurturing-foreground border-transparent" 
  },
  hot: { 
    label: "Hot", 
    className: "bg-status-hot text-status-hot-foreground border-transparent" 
  },
  qualified: { 
    label: "Qualified", 
    className: "bg-status-qualified text-status-qualified-foreground border-transparent" 
  },
  unqualified: { 
    label: "Unqualified", 
    className: "bg-status-unqualified text-status-unqualified-foreground border-transparent" 
  },
  converted: { 
    label: "Converted", 
    className: "bg-status-converted text-status-converted-foreground border-transparent" 
  },
  
  // Deal statuses
  open: { 
    label: "Open", 
    className: "bg-status-open text-status-open-foreground border-transparent" 
  },
  under_contract: { 
    label: "Under Contract", 
    className: "bg-status-underContract text-status-underContract-foreground border-transparent" 
  },
  won: { 
    label: "Closed Won", 
    className: "bg-status-won text-status-won-foreground border-transparent" 
  },
  lost: { 
    label: "Closed Lost", 
    className: "bg-status-lost text-status-lost-foreground border-transparent" 
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