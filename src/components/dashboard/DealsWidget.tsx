import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface DealStats {
  lead: { count: number; value: number };
  viewing: { count: number; value: number };
  offer: { count: number; value: number };
  negotiation: { count: number; value: number };
  closing: { count: number; value: number };
}

interface DealsWidgetProps {
  stats: DealStats;
}

const DealsWidget = ({ stats }: DealsWidgetProps) => {
  const stages = [
    { key: "lead", label: "Lead", color: "bg-gray-500" },
    { key: "viewing", label: "Viewing", color: "bg-blue-500" },
    { key: "offer", label: "Offer", color: "bg-yellow-500" },
    { key: "negotiation", label: "Negotiation", color: "bg-orange-500" },
    { key: "closing", label: "Closing", color: "bg-green-500" },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalDeals = Object.values(stats).reduce((sum, stage) => sum + stage.count, 0);

  if (totalDeals === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <TrendingUp className="w-4 h-4" />
            Active Deals Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No active deals yet</p>
            <Link to="/deals">
              <Button>Create Your First Deal</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <TrendingUp className="w-4 h-4" />
          Active Deals Pipeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Pipeline Visualization */}
          <div className="grid grid-cols-5 gap-4">
            {stages.map((stage) => {
              const stageStats = stats[stage.key as keyof DealStats];
              return (
                <Link
                  key={stage.key}
                  to={`/deals?stage=${stage.key}`}
                  className="text-center hover:bg-accent/50 p-4 rounded-lg transition-colors"
                >
                  <div className="space-y-1">
                    <div className={`h-1.5 ${stage.color} rounded-full mb-2`} />
                    <p className="text-xs font-medium text-muted-foreground">{stage.label}</p>
                    <p className="text-xl font-semibold">{stageStats.count}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(stageStats.value)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Summary */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Total Pipeline Value</p>
              <p className="text-lg font-semibold">
                {formatCurrency(
                  Object.values(stats).reduce((sum, stage) => sum + stage.value, 0)
                )}
              </p>
            </div>
            <Link to="/deals">
              <Button variant="outline">
                View All Deals
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DealsWidget;
