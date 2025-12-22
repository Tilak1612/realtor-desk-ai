import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface DataImportCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  ctaLabel: string;
  onAction: () => void;
  badge?: string;
  disabled?: boolean;
}

const DataImportCard = ({ 
  title, 
  description, 
  icon: Icon, 
  ctaLabel, 
  onAction, 
  badge,
  disabled = false 
}: DataImportCardProps) => {
  return (
    <Card className="bg-card border-border hover:border-primary/30 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-accent/50 rounded-lg shrink-0">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-medium text-foreground">{title}</h3>
              {badge && (
                <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">{description}</p>
            <Button 
              size="sm" 
              className="h-8 text-sm"
              onClick={onAction}
              disabled={disabled}
            >
              {ctaLabel}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataImportCard;
