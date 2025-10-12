import { useDraggable } from "@dnd-kit/core";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GripVertical } from "lucide-react";

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
  metadata: any;
  contacts?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface DealCardProps {
  deal: Deal;
  isDragging?: boolean;
  onClick: () => void;
}

const DealCard = ({ deal, isDragging, onClick }: DealCardProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: deal.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getDaysInStage = () => {
    const updated = new Date(deal.updated_at);
    const now = new Date();
    const days = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getProbabilityColor = (prob: number) => {
    if (prob >= 75) return "bg-green-500";
    if (prob >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  const contactName = deal.contacts 
    ? `${deal.contacts.first_name} ${deal.contacts.last_name}`
    : "Unknown Contact";

  const initials = deal.contacts
    ? `${deal.contacts.first_name[0]}${deal.contacts.last_name[0]}`
    : "?";

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-pointer hover:shadow-md transition-shadow ${isDragging ? "opacity-50" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing mt-1">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <p className="font-medium text-sm truncate">{deal.title}</p>
                <p className="text-xs text-muted-foreground truncate">{contactName}</p>
              </div>
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold">{formatCurrency(deal.value || 0)}</p>
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={`${getProbabilityColor(deal.probability || 0)} text-white text-xs`}
                >
                  {deal.probability}%
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {getDaysInStage()} days
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DealCard;
