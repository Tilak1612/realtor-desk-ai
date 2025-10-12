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

interface AddDealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDealAdded: () => void;
}

const AddDealModal = ({ open, onOpenChange, onDealAdded }: AddDealModalProps) => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contact_id: "",
    title: "",
    value: "",
    stage: "lead",
    probability: 50,
    expected_close_date: undefined as Date | undefined,
    notes: ""
  });

  useEffect(() => {
    if (open) {
      fetchContacts();
      resetForm();
    }
  }, [open]);

  const fetchContacts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("contacts")
      .select("id, first_name, last_name, email")
      .eq("user_id", user.id)
      .order("first_name");

    setContacts(data || []);
  };

  const resetForm = () => {
    setFormData({
      contact_id: "",
      title: "",
      value: "",
      stage: "lead",
      probability: 50,
      expected_close_date: undefined,
      notes: ""
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.contact_id || !formData.title || !formData.value) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("deals").insert({
      user_id: user.id,
      contact_id: formData.contact_id,
      title: formData.title,
      value: parseFloat(formData.value),
      stage: formData.stage,
      status: "active",
      probability: formData.probability,
      expected_close_date: formData.expected_close_date?.toISOString().split('T')[0] || null,
      notes: formData.notes || null
    });

    setLoading(false);

    if (error) {
      toast.error("Failed to create deal");
    } else {
      toast.success("Deal created successfully");
      onDealAdded();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Deal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="contact">Contact *</Label>
            <Select value={formData.contact_id} onValueChange={(v) => setFormData({...formData, contact_id: v})}>
              <SelectTrigger>
                <SelectValue placeholder="Select a contact" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map(contact => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.first_name} {contact.last_name} ({contact.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Deal Name / Property Address *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., 123 Main St Toronto"
            />
          </div>

          <div>
            <Label htmlFor="value">Deal Value (CAD) *</Label>
            <Input
              id="value"
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({...formData, value: e.target.value})}
              placeholder="450000"
            />
          </div>

          <div>
            <Label htmlFor="stage">Stage</Label>
            <Select value={formData.stage} onValueChange={(v) => setFormData({...formData, stage: v})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="viewing">Viewing</SelectItem>
                <SelectItem value="offer">Offer Made</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="closing">Closing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Probability: {formData.probability}%</Label>
            <Slider
              value={[formData.probability]}
              onValueChange={([v]) => setFormData({...formData, probability: v})}
              min={0}
              max={100}
              step={5}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Expected Close Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.expected_close_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.expected_close_date ? format(formData.expected_close_date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.expected_close_date}
                  onSelect={(date) => setFormData({...formData, expected_close_date: date})}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Additional details about this deal..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Deal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDealModal;
