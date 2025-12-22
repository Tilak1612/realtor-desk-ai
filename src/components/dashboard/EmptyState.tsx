import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({ icon: Icon, title, description, ctaLabel, onAction }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-accent/30 rounded-lg border border-dashed border-border">
      <div className="p-3 bg-accent rounded-full mb-4">
        <Icon className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="text-base font-medium text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      {ctaLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {ctaLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
