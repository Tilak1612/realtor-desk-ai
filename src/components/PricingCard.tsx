import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText: string;
  ctaLink: string;
  billingPeriod?: string;
  discount?: string;
  yearlyPrice?: number;
}

const PricingCard = ({
  name,
  price,
  description,
  features,
  popular = false,
  ctaText,
  ctaLink,
  billingPeriod = "month",
  discount,
  yearlyPrice,
}: PricingCardProps) => {
  return (
    <Card className={`p-8 card-hover relative ${popular ? "border-2 border-primary shadow-xl" : ""}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Star className="w-3 h-3" />
            Most Popular
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        {discount && (
          <div className="mb-2">
            <span className="inline-block bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-semibold">
              Save {discount}
            </span>
          </div>
        )}
        
        <div className="flex items-baseline gap-1">
          {price !== "Custom" ? (
            <>
              <span className="text-4xl font-bold gradient-text">${price}</span>
              <span className="text-muted-foreground">/{billingPeriod}</span>
            </>
          ) : (
            <span className="text-4xl font-bold gradient-text">{price}</span>
          )}
        </div>
        
        {yearlyPrice && (
          <p className="text-sm text-muted-foreground mt-2">
            Billed ${Math.round(yearlyPrice)} annually
          </p>
        )}
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <Link to={ctaLink}>
        <Button className={`w-full ${popular ? "btn-gradient" : ""}`} variant={popular ? "default" : "outline"}>
          {ctaText}
        </Button>
      </Link>
    </Card>
  );
};

export default PricingCard;
