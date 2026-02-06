import { useDroppable } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DealCard from "./DealCard";

interface Stage {
  key: string;
  label: string;
  color: string;
}

interface Deal {
  id: string;
  title: string;
  stage: string;
  status: string;
  value: number;
  probability: number;
  contact_id: string;
  created_at: string;
  updated_at: string;
  expected_close_date: string | null;
  notes: string | null;
  metadata: unknown;
  contacts?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface KanbanColumnProps {
  stage: Stage;
  deals: Deal[];
  totalValue: number;
  onDealClick: (deal: Deal) => void;
}

const KanbanColumn = ({ stage, deals, totalValue, onDealClick }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.key,
  });

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className="flex-shrink-0 w-72 md:w-80 snap-center md:snap-align-none">
      <Card className={`${isOver ? "ring-2 ring-primary" : ""}`}>
        <CardHeader className="pb-3 px-3 md:px-6 pt-4 md:pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${stage.color}`} />
              <CardTitle className="text-xs md:text-sm font-medium">
                {stage.label}
              </CardTitle>
              <Badge variant="secondary" className="text-xs">{deals.length}</Badge>
            </div>
          </div>
          {totalValue > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(totalValue)}
            </p>
          )}
        </CardHeader>
        <CardContent ref={setNodeRef} className="space-y-2 min-h-[200px] px-3 md:px-6">
          {deals.map(deal => (
            <DealCard
              key={deal.id}
              deal={deal}
              onClick={() => onDealClick(deal)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default KanbanColumn;
