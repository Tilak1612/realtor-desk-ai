import { useState, useEffect } from "react";
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

interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskAdded: () => void;
}

const AddTaskModal = ({ open, onOpenChange, onTaskAdded }: AddTaskModalProps) => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [addAnother, setAddAnother] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: undefined as Date | undefined,
    due_time: "",
    priority: "medium",
    task_type: "other",
    contact_id: "",
    deal_id: "",
    reminder: "none"
  });

  useEffect(() => {
    if (open) {
      fetchContacts();
      resetForm();
    }
  }, [open]);

  useEffect(() => {
    if (formData.contact_id) {
      fetchDeals(formData.contact_id);
    } else {
      setDeals([]);
      setFormData(prev => ({ ...prev, deal_id: "" }));
    }
  }, [formData.contact_id]);

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

  const fetchDeals = async (contactId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("deals")
      .select("id, title, stage")
      .eq("user_id", user.id)
      .eq("contact_id", contactId)
      .eq("status", "active");

    setDeals(data || []);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      due_date: undefined,
      due_time: "",
      priority: "medium",
      task_type: "other",
      contact_id: "",
      deal_id: "",
      reminder: "none"
    });
  };

  const handleSubmit = async (e: React.FormEvent, addAnother = false) => {
    e.preventDefault();
    
    if (!formData.title || !formData.due_date) {
      toast.error("Please fill in required fields");
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("tasks").insert({
      user_id: user.id,
      title: formData.title,
      description: formData.description || null,
      due_date: formData.due_date.toISOString().split('T')[0],
      due_time: formData.due_time || null,
      priority: formData.priority,
      status: "pending",
      contact_id: formData.contact_id || null,
      deal_id: formData.deal_id || null,
      metadata: {
        task_type: formData.task_type,
        reminder: formData.reminder
      }
    });

    setLoading(false);

    if (error) {
      toast.error("Failed to create task");
    } else {
      toast.success("Task created successfully");
      onTaskAdded();
      
      if (addAnother) {
        resetForm();
      } else {
        onOpenChange(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => handleSubmit(e, addAnother)} className="space-y-4">
          <div>
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Call client about property viewing"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Additional details..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Due Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.due_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.due_date ? format(formData.due_date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.due_date}
                    onSelect={(date) => setFormData({...formData, due_date: date})}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="due_time">Due Time</Label>
              <Input
                id="due_time"
                type="time"
                value={formData.due_time}
                onChange={(e) => setFormData({...formData, due_time: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(v) => setFormData({...formData, priority: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="task_type">Task Type</Label>
              <Select value={formData.task_type} onValueChange={(v) => setFormData({...formData, task_type: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="viewing">Viewing</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="contact">Associated Contact</Label>
            <Select value={formData.contact_id} onValueChange={(v) => setFormData({...formData, contact_id: v})}>
              <SelectTrigger>
                <SelectValue placeholder="Select a contact (optional)" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map(contact => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.first_name} {contact.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.contact_id && deals.length > 0 && (
            <div>
              <Label htmlFor="deal">Associated Deal</Label>
              <Select value={formData.deal_id} onValueChange={(v) => setFormData({...formData, deal_id: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a deal (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {deals.map(deal => (
                    <SelectItem key={deal.id} value={deal.id}>
                      {deal.title} ({deal.stage})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="reminder">Reminder</Label>
            <Select value={formData.reminder} onValueChange={(v) => setFormData({...formData, reminder: v})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="15min">15 minutes before</SelectItem>
                <SelectItem value="1hour">1 hour before</SelectItem>
                <SelectItem value="1day">1 day before</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="outline"
              onClick={() => setAddAnother(true)}
              disabled={loading}
            >
              Add & Add Another
            </Button>
            <Button 
              type="submit"
              onClick={() => setAddAnother(false)}
              disabled={loading}
            >
              {loading ? "Creating..." : "Add Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
