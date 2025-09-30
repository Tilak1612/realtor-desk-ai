import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: boolean;
}

const FeatureCard = ({ icon: Icon, title, description, gradient = false }: FeatureCardProps) => {
  return (
    <Card className="p-6 card-hover">
      <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 ${
        gradient 
          ? "bg-gradient-to-r from-primary to-secondary" 
          : "bg-primary/10"
      }`}>
        <Icon className={`w-7 h-7 ${gradient ? "text-white" : "text-primary"}`} />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </Card>
  );
};

export default FeatureCard;
