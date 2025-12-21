import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RevenueBreakdownWidgetProps {
  ytdRevenue: number;
  closedDealsCount: number;
  grossVolume: number;
  commissionRate: number;
}

const RevenueBreakdownWidget = ({
  ytdRevenue,
  closedDealsCount,
  grossVolume,
  commissionRate,
}: RevenueBreakdownWidgetProps) => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-heading-3 flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Revenue & Commission
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-meta text-muted-foreground uppercase">Revenue YTD</span>
          <span className="text-heading-2">${ytdRevenue.toLocaleString()}</span>
        </div>
        
        <p className="text-body-sm text-muted-foreground">
          Calculated from closed deals in {currentYear} using your default commission rate of {commissionRate}%.
        </p>
        
        <ul className="text-body-sm text-muted-foreground list-disc list-inside space-y-0.5">
          <li>{closedDealsCount} closed deal{closedDealsCount !== 1 ? "s" : ""} this year</li>
          <li>Gross volume: ${grossVolume.toLocaleString()}</li>
          <li>Commission rate: {commissionRate}%</li>
        </ul>
        
        <button
          onClick={() => navigate("/deals")}
          className="text-body-sm text-primary hover:underline"
        >
          View deals contributing to this total
        </button>
      </CardContent>
    </Card>
  );
};

export default RevenueBreakdownWidget;