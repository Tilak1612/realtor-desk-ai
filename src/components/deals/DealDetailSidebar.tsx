import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { ExternalLink, Pencil, Trash2, Trophy, XCircle } from "lucide-react";
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

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this deal?")) return;

    const { error } = await supabase.from("deals").delete().eq("id", deal.id);
    
    if (error) {
      toast.error("Failed to delete deal");
    } else {
      toast.success("Deal deleted");
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

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{deal.title}</SheetTitle>
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

            {/* Deal Details */}
            <div className="space-y-3">
              <h3 className="font-semibold">Deal Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Value</p>
                  <p className="font-semibold">{formatCurrency(deal.value || 0)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Stage</p>
                  <Badge>{deal.stage}</Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Probability</p>
                  <p className="font-semibold">{deal.probability}%</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline">{deal.status}</Badge>
                </div>

                {deal.expected_close_date && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Expected Close</p>
                    <p className="font-semibold">
                      {new Date(deal.expected_close_date).toLocaleDateString()}
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
                Edit Deal
              </Button>

              {deal.stage !== "won" && deal.stage !== "lost" && (
                <>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleMarkAs("won")}
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Mark as Won
                  </Button>

                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleMarkAs("lost")}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Mark as Lost
                  </Button>
                </>
              )}

              <Button 
                className="w-full" 
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Deal
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
