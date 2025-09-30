import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  stat: string;
  description: string;
}

const StatCard = ({ icon: Icon, stat, description }: StatCardProps) => {
  return (
    <Card className="p-6 text-center card-hover bg-gradient-to-br from-background to-muted">
      <Icon className="w-10 h-10 mx-auto mb-4 text-destructive" />
      <div className="text-3xl md:text-4xl font-bold mb-2 text-destructive">{stat}</div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
};

export default StatCard;
