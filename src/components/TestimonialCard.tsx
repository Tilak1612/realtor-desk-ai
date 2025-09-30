import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  company: string;
}

const TestimonialCard = ({ quote, name, title, company }: TestimonialCardProps) => {
  return (
    <Card className="p-6 card-hover bg-gradient-to-br from-background to-muted">
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-accent text-accent" />
        ))}
      </div>

      {/* Quote */}
      <p className="text-foreground mb-6 leading-relaxed">"{quote}"</p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-sm text-muted-foreground">
            {title}, {company}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TestimonialCard;
