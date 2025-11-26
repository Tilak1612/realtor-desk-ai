import { useDraggable } from "@dnd-kit/core";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GripVertical, MapPin, Calendar, DollarSign } from "lucide-react";

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
  mls_number?: string;
  property_address?: string;
  listing_price?: number;
  commission_percentage?: number;
  closing_date?: string;
  property_type?: string;
  client_type?: string;
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
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getDaysInStage = () => {
    const updated = new Date(deal.updated_at);
    const now = new Date();
    const days = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const contactName = deal.contacts 
    ? `${deal.contacts.first_name} ${deal.contacts.last_name}`
    : "Unknown Contact";

  const initials = deal.contacts
    ? `${deal.contacts.first_name[0]}${deal.contacts.last_name[0]}`
    : "?";

  // Use listing_price if available, otherwise fall back to value
  const displayPrice = deal.listing_price || deal.value || 0;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-pointer hover:shadow-md transition-shadow ${isDragging ? "opacity-50 ring-2 ring-primary" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing mt-1">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="flex-1 min-w-0 space-y-2">
            {/* Header with client type and avatar */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm truncate">{deal.title}</p>
                  {deal.client_type && (
                    <Badge variant="outline" className="text-xs capitalize shrink-0">
                      {deal.client_type}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{contactName}</p>
              </div>
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
            </div>

            {/* Property Address */}
            {deal.property_address && (
              <div className="flex items-start gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span className="truncate">{deal.property_address}</span>
              </div>
            )}

            {/* Price and Property Type */}
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold">{formatCurrency(displayPrice)}</p>
              {deal.property_type && (
                <Badge variant="secondary" className="text-xs capitalize">
                  {deal.property_type}
                </Badge>
              )}
            </div>

            {/* MLS Number */}
            {deal.mls_number && (
              <div className="text-xs text-muted-foreground">
                MLS# {deal.mls_number}
              </div>
            )}

            {/* Footer with commission and days in stage */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
              <span>{getDaysInStage()} days in stage</span>
              {deal.commission_percentage && (
                <span className="font-medium text-primary">
                  {deal.commission_percentage}% comm.
                </span>
              )}
            </div>

            {/* Closing Date */}
            {deal.closing_date && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Closes: {new Date(deal.closing_date).toLocaleDateString('en-CA')}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DealCard;
