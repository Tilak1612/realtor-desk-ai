import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface WinLossModalProps {
  deal: any;
  type: "won" | "lost";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const WinLossModal = ({ deal, type, open, onOpenChange, onSuccess }: WinLossModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    closeDate: new Date(),
    finalPrice: deal?.value?.toString() || "",
    commission: "",
    lostReason: "",
    notes: "",
    followUpDate: undefined as Date | undefined
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updateData: Record<string, any> = {
      stage: type === "won" ? "sold" : "withdrawn",
      status: type === "won" ? "closed" : "withdrawn",
      updated_at: new Date().toISOString()
    };

    if (type === "won") {
      if (!formData.finalPrice) {
        toast.error("Please enter the final sale price");
        setLoading(false);
        return;
      }
      updateData.value = parseFloat(formData.finalPrice);
      updateData.metadata = {
        ...deal.metadata,
        close_date: formData.closeDate.toISOString(),
        commission: formData.commission ? parseFloat(formData.commission) : null,
        win_notes: formData.notes
      };

      // Update user analytics
      const { data: { user } } = await supabase.auth.getUser();
      if (user && formData.commission) {
        const { data: analytics } = await supabase
          .from("user_analytics")
          .select("ytd_revenue")
          .eq("user_id", user.id)
          .single();

        const currentRevenue = analytics?.ytd_revenue || 0;
        const newRevenue = currentRevenue + parseFloat(formData.commission);

        await supabase
          .from("user_analytics")
          .upsert({
            user_id: user.id,
            ytd_revenue: newRevenue,
            updated_at: new Date().toISOString()
          });
      }
    } else {
      updateData.metadata = {
        ...deal.metadata,
        lost_reason: formData.lostReason,
        lost_notes: formData.notes,
        follow_up_date: formData.followUpDate?.toISOString()
      };
    }

    const { error } = await supabase
      .from("deals")
      .update(updateData)
      .eq("id", deal.id);

    setLoading(false);

    if (error) {
      toast.error(`Failed to mark transaction as ${type === "won" ? "sold" : "withdrawn"}`);
    } else {
      toast.success(`Transaction marked as ${type === "won" ? "Sold" : "Withdrawn"}!`);
      onSuccess();
      onOpenChange(false);
    }
  };

  if (!deal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === "won" ? "Mark Transaction as Sold 🎉" : "Mark Transaction as Withdrawn"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "won" ? (
            <>
              <div>
                <Label>Close Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.closeDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.closeDate}
                      onSelect={(date) => date && setFormData({...formData, closeDate: date})}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="finalPrice">Final Sale Price (CAD) *</Label>
                <Input
                  id="finalPrice"
                  type="number"
                  value={formData.finalPrice}
                  onChange={(e) => setFormData({...formData, finalPrice: e.target.value})}
                  placeholder="450000"
                />
              </div>

              <div>
                <Label htmlFor="commission">Commission Earned (CAD)</Label>
                <Input
                  id="commission"
                  type="number"
                  value={formData.commission}
                  onChange={(e) => setFormData({...formData, commission: e.target.value})}
                  placeholder="15000"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Celebration details, learnings, etc..."
                  rows={3}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="lostReason">Reason for Withdrawal</Label>
                <Select value={formData.lostReason} onValueChange={(v) => setFormData({...formData, lostReason: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price too high</SelectItem>
                    <SelectItem value="competitor">Chose another agent</SelectItem>
                    <SelectItem value="timing">Bad timing</SelectItem>
                    <SelectItem value="financing">Financing fell through</SelectItem>
                    <SelectItem value="cold_feet">Client changed mind</SelectItem>
                    <SelectItem value="property_issues">Property issues found</SelectItem>
                    <SelectItem value="listing_expired">Listing expired</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Why was this transaction withdrawn? What can we learn?"
                  rows={3}
                />
              </div>

              <div>
                <Label>Follow-up Date for Re-engagement</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.followUpDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.followUpDate ? format(formData.followUpDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.followUpDate}
                      onSelect={(date) => setFormData({...formData, followUpDate: date})}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : `Mark as ${type === "won" ? "Sold" : "Withdrawn"}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WinLossModal;
