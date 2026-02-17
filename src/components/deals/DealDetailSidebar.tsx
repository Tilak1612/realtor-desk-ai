import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { ExternalLink, Pencil, Trash2, Trophy, XCircle, MapPin, Hash, DollarSign, Calendar, Percent } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import WinLossModal from "./WinLossModal";
import EditDealModal from "./EditDealModal";

interface DealDetailSidebarProps {
  deal: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDealUpdated: () => void;
}

const DealDetailSidebar = ({ deal, open, onOpenChange, onDealUpdated }: DealDetailSidebarProps) => {
  const [winLossOpen, setWinLossOpen] = useState(false);
  const [winLossType, setWinLossType] = useState<"won" | "lost">("won");
  const [editModalOpen, setEditModalOpen] = useState(false);

  if (!deal) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const calculateCommission = () => {
    const price = deal.listing_price || deal.value || 0;
    const percentage = deal.commission_percentage || 2.5;
    return (price * percentage) / 100;
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    const { error } = await supabase.from("deals").delete().eq("id", deal.id);
    
    if (error) {
      toast.error("Failed to delete transaction");
    } else {
      toast.success("Transaction deleted");
      onDealUpdated();
      onOpenChange(false);
    }
  };

  const handleMarkAs = (type: "won" | "lost") => {
    setWinLossType(type);
    setWinLossOpen(true);
  };

  const contactName = deal.contacts 
    ? `${deal.contacts.first_name} ${deal.contacts.last_name}`
    : "Unknown Contact";

  const displayPrice = deal.listing_price || deal.value || 0;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-[95vw] sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{deal.title}</SheetTitle>
            {deal.client_type && (
              <Badge variant="outline" className="w-fit capitalize mt-2">
                {deal.client_type}
              </Badge>
            )}
          </SheetHeader>

          <div className="space-y-6 mt-6">
            {/* Contact Info */}
            <div>
              <h3 className="font-semibold mb-2">Contact</h3>
              <Link 
                to={`/contacts/${deal.contact_id}`}
                className="flex items-center gap-2 text-primary hover:underline"
              >
                {contactName}
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>

            <Separator />

            {/* Property Details */}
            {(deal.property_address || deal.mls_number || deal.property_type) && (
              <>
                <div className="space-y-3">
                  <h3 className="font-semibold">Property Details</h3>
                  
                  {deal.property_address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">{deal.property_address}</p>
                      </div>
                    </div>
                  )}

                  {deal.mls_number && (
                    <div className="flex items-start gap-2">
                      <Hash className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">MLS Number</p>
                        <p className="font-medium">{deal.mls_number}</p>
                      </div>
                    </div>
                  )}

                  {deal.property_type && (
                    <div>
                      <p className="text-sm text-muted-foreground">Property Type</p>
                      <Badge variant="secondary" className="capitalize mt-1">
                        {deal.property_type}
                      </Badge>
                    </div>
                  )}
                </div>
                <Separator />
              </>
            )}

            {/* Financial Details */}
            <div className="space-y-3">
              <h3 className="font-semibold">Financial Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Listing Price</p>
                  <p className="font-semibold text-lg">{formatCurrency(displayPrice)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Stage</p>
                  <Badge className="mt-1">{deal.stage.replace(/_/g, ' ')}</Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Probability</p>
                  <p className="font-semibold">{deal.probability}%</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline" className="mt-1">{deal.status}</Badge>
                </div>

                {deal.commission_percentage && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Commission Rate</p>
                      <p className="font-semibold">{deal.commission_percentage}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Est. Commission</p>
                      <p className="font-semibold text-primary">{formatCurrency(calculateCommission())}</p>
                    </div>
                  </>
                )}

                {deal.closing_date && (
                  <div className="sm:col-span-2">
                    <p className="text-sm text-muted-foreground">Expected Closing</p>
                    <p className="font-semibold">
                      {new Date(deal.closing_date).toLocaleDateString('en-CA', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                )}

                {deal.expected_close_date && (
                  <div className="sm:col-span-2">
                    <p className="text-sm text-muted-foreground">Expected Close</p>
                    <p className="font-semibold">
                      {new Date(deal.expected_close_date).toLocaleDateString('en-CA', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {deal.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {deal.notes}
                  </p>
                </div>
              </>
            )}

            <Separator />

            {/* Actions */}
            <div className="space-y-2">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => setEditModalOpen(true)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Transaction
              </Button>

              {deal.stage !== "sold" && deal.stage !== "withdrawn" && (
                <>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleMarkAs("won")}
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Mark as Sold
                  </Button>

                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleMarkAs("lost")}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Mark as Withdrawn
                  </Button>
                </>
              )}

              <Button 
                className="w-full" 
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Transaction
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <WinLossModal
        deal={deal}
        type={winLossType}
        open={winLossOpen}
        onOpenChange={setWinLossOpen}
        onSuccess={() => {
          onDealUpdated();
          onOpenChange(false);
        }}
      />

      <EditDealModal
        deal={deal}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onDealUpdated={onDealUpdated}
      />
    </>
  );
};

export default DealDetailSidebar;
