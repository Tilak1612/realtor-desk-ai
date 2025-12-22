import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RevenueBreakdownWidgetProps {
  ytdRevenue: number;
  closedDealsCount: number;
  grossVolume: number;
  commissionRate: number;
}

const RevenueBreakdownWidget = ({ ytdRevenue, closedDealsCount, grossVolume, commissionRate }: RevenueBreakdownWidgetProps) => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          Revenue & Commission
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-sm h-8" onClick={() => navigate("/deals")}>
          View deals <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground uppercase">Revenue YTD</span>
          <span className="text-2xl font-semibold text-foreground">${ytdRevenue.toLocaleString()}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Calculated from closed deals in {currentYear} using your default commission rate of {commissionRate}%.
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-t border-border">
            <span className="text-muted-foreground">Closed deals</span>
            <span className="font-medium text-foreground">{closedDealsCount}</span>
          </div>
          <div className="flex justify-between py-2 border-t border-border">
            <span className="text-muted-foreground">Gross volume</span>
            <span className="font-medium text-foreground">${grossVolume.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2 border-t border-border">
            <span className="text-muted-foreground">Commission rate</span>
            <span className="font-medium text-foreground">{commissionRate}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueBreakdownWidget;