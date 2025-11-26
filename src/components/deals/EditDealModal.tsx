import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EditDealModalProps {
  deal: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDealUpdated: () => void;
}

const EditDealModal = ({ deal, open, onOpenChange, onDealUpdated }: EditDealModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    value: "",
    stage: "new_lead",
    probability: 50,
    expected_close_date: undefined as Date | undefined,
    notes: "",
    mls_number: "",
    property_address: "",
    listing_price: "",
    commission_percentage: "2.5",
    closing_date: undefined as Date | undefined,
    property_type: "",
    client_type: "",
  });

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || "",
        value: deal.value?.toString() || "",
        stage: deal.stage || "new_lead",
        probability: deal.probability || 50,
        expected_close_date: deal.expected_close_date ? new Date(deal.expected_close_date) : undefined,
        notes: deal.notes || "",
        mls_number: deal.mls_number || "",
        property_address: deal.property_address || "",
        listing_price: deal.listing_price?.toString() || "",
        commission_percentage: deal.commission_percentage?.toString() || "2.5",
        closing_date: deal.closing_date ? new Date(deal.closing_date) : undefined,
        property_type: deal.property_type || "",
        client_type: deal.client_type || "",
      });
    }
  }, [deal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error("Please fill in the title");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("deals")
      .update({
        title: formData.title,
        value: formData.value ? parseFloat(formData.value) : null,
        stage: formData.stage,
        probability: formData.probability,
        expected_close_date: formData.expected_close_date?.toISOString().split('T')[0] || null,
        notes: formData.notes || null,
        mls_number: formData.mls_number || null,
        property_address: formData.property_address || null,
        listing_price: formData.listing_price ? parseFloat(formData.listing_price) : null,
        commission_percentage: formData.commission_percentage ? parseFloat(formData.commission_percentage) : 2.5,
        closing_date: formData.closing_date?.toISOString().split('T')[0] || null,
        property_type: formData.property_type || null,
        client_type: formData.client_type || null,
        updated_at: new Date().toISOString()
      })
      .eq("id", deal.id);

    setLoading(false);

    if (error) {
      toast.error("Failed to update transaction");
      console.error(error);
    } else {
      toast.success("Transaction updated successfully");
      onDealUpdated();
      onOpenChange(false);
    }
  };

  if (!deal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Transaction Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Downtown Condo Purchase"
            />
          </div>

          {/* Client Type and Property Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client_type">Client Type</Label>
              <Select value={formData.client_type} onValueChange={(v) => setFormData({...formData, client_type: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="property_type">Property Type</Label>
              <Select value={formData.property_type} onValueChange={(v) => setFormData({...formData, property_type: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Property Address and MLS */}
          <div>
            <Label htmlFor="property_address">Property Address</Label>
            <Input
              id="property_address"
              value={formData.property_address}
              onChange={(e) => setFormData({...formData, property_address: e.target.value})}
              placeholder="123 Main St, Toronto, ON M1A 1A1"
            />
          </div>

          <div>
            <Label htmlFor="mls_number">MLS Number</Label>
            <Input
              id="mls_number"
              value={formData.mls_number}
              onChange={(e) => setFormData({...formData, mls_number: e.target.value})}
              placeholder="C1234567"
            />
          </div>

          {/* Listing Price and Commission */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="listing_price">Listing Price (CAD)</Label>
              <Input
                id="listing_price"
                type="number"
                value={formData.listing_price}
                onChange={(e) => setFormData({...formData, listing_price: e.target.value})}
                placeholder="750000"
              />
            </div>

            <div>
              <Label htmlFor="commission_percentage">Commission %</Label>
              <Input
                id="commission_percentage"
                type="number"
                step="0.1"
                value={formData.commission_percentage}
                onChange={(e) => setFormData({...formData, commission_percentage: e.target.value})}
                placeholder="2.5"
              />
            </div>
          </div>

          {/* Stage */}
          <div>
            <Label htmlFor="stage">Stage</Label>
            <Select value={formData.stage} onValueChange={(v) => setFormData({...formData, stage: v})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new_lead">New Lead</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="showing_scheduled">Showing Scheduled</SelectItem>
                <SelectItem value="offer_made">Offer Made</SelectItem>
                <SelectItem value="under_contract">Under Contract</SelectItem>
                <SelectItem value="closing">Closing</SelectItem>
                <SelectItem value="sold">Sold/Closed</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Probability */}
          <div>
            <Label>Deal Probability: {formData.probability}%</Label>
            <Slider
              value={[formData.probability]}
              onValueChange={([v]) => setFormData({...formData, probability: v})}
              min={0}
              max={100}
              step={5}
              className="mt-2"
            />
          </div>

          {/* Closing Date */}
          <div>
            <Label>Expected Closing Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.closing_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.closing_date ? format(formData.closing_date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.closing_date}
                  onSelect={(date) => setFormData({...formData, closing_date: date})}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Additional details about this transaction..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDealModal;
