import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Repeat, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import TaskTemplates, { TaskTemplate } from "./TaskTemplates";

interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskAdded: () => void;
}

const AddTaskModal = ({ open, onOpenChange, onTaskAdded }: AddTaskModalProps) => {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState<Array<{ id: string; first_name: string; last_name: string; email: string }>>([]);
  const [deals, setDeals] = useState<Array<{ id: string; title: string; stage: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [addAnother, setAddAnother] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: undefined as Date | undefined,
    due_time: "",
    priority: "medium",
    task_type: "other",
    contact_id: "",
    deal_id: "",
    reminder: "none",
    is_recurring: false,
    recurring_interval: "weekly" as "daily" | "weekly" | "monthly" | "yearly",
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
      reminder: "none",
      is_recurring: false,
      recurring_interval: "weekly",
    });
    setShowTemplates(true);
  };

  const handleTemplateSelect = (template: TaskTemplate) => {
    setFormData(prev => ({
      ...prev,
      title: template.title,
      description: template.description,
      task_type: template.task_type,
      priority: template.priority,
      is_recurring: template.isRecurring || false,
      recurring_interval: (template.recurringInterval as "daily" | "weekly" | "monthly" | "yearly") || "weekly",
    }));
    setShowTemplates(false);
  };

  const handleSubmit = async (e: React.FormEvent, addAnother = false) => {
    e.preventDefault();
    
    if (!formData.title || !formData.due_date) {
      toast.error(t("app.modals.addTask.fillRequired"));
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
    });

    setLoading(false);

    if (error) {
      toast.error(t("app.modals.addTask.failedCreate"));
    } else {
      toast.success(t("app.modals.addTask.successCreate"));
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
          <DialogTitle>{t("app.modals.addTask.title")}</DialogTitle>
        </DialogHeader>

        {/* Templates Section */}
        {showTemplates && (
          <div className="border-b pb-4 mb-4">
            <TaskTemplates onSelectTemplate={handleTemplateSelect} />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2 text-xs"
              onClick={() => setShowTemplates(false)}
            >
              <ChevronUp className="h-3 w-3 mr-1" />
              Hide templates
            </Button>
          </div>
        )}

        {!showTemplates && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs mb-2"
            onClick={() => setShowTemplates(true)}
          >
            <ChevronDown className="h-3 w-3 mr-1" />
            Show templates
          </Button>
        )}

        <form noValidate onSubmit={(e) => handleSubmit(e, addAnother)} className="space-y-4">
          <div>
            <Label htmlFor="title">{t("app.modals.addTask.taskTitle")} *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder={t("app.modals.addTask.titlePlaceholder")}
            />
          </div>

          <div>
            <Label htmlFor="description">{t("app.modals.addTask.description")}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder={t("app.modals.addTask.descriptionPlaceholder")}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("app.modals.addTask.dueDate")} *</Label>
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
                    {formData.due_date ? format(formData.due_date, "PPP") : t("app.modals.addTask.pickDate")}
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
              <Label htmlFor="due_time">{t("app.modals.addTask.dueTime")}</Label>
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
              <Label htmlFor="priority">{t("app.modals.addTask.priority")}</Label>
              <Select value={formData.priority} onValueChange={(v) => setFormData({...formData, priority: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t("app.modals.addTask.priorities.low")}</SelectItem>
                  <SelectItem value="medium">{t("app.modals.addTask.priorities.medium")}</SelectItem>
                  <SelectItem value="high">{t("app.modals.addTask.priorities.high")}</SelectItem>
                  <SelectItem value="urgent">{t("app.modals.addTask.priorities.urgent")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="task_type">{t("app.modals.addTask.taskType")}</Label>
              <Select value={formData.task_type} onValueChange={(v) => setFormData({...formData, task_type: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">{t("app.modals.addTask.taskTypes.call")}</SelectItem>
                  <SelectItem value="email">{t("app.modals.addTask.taskTypes.email")}</SelectItem>
                  <SelectItem value="meeting">{t("app.modals.addTask.taskTypes.meeting")}</SelectItem>
                  <SelectItem value="viewing">{t("app.modals.addTask.taskTypes.viewing")}</SelectItem>
                  <SelectItem value="followup">{t("app.modals.addTask.taskTypes.followup")}</SelectItem>
                  <SelectItem value="other">{t("app.modals.addTask.taskTypes.other")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="contact">{t("app.modals.addTask.associatedContact")}</Label>
            <Select value={formData.contact_id} onValueChange={(v) => setFormData({...formData, contact_id: v})}>
              <SelectTrigger>
                <SelectValue placeholder={t("app.modals.addTask.selectContactOptional")} />
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
              <Label htmlFor="deal">{t("app.modals.addTask.associatedDeal")}</Label>
              <Select value={formData.deal_id} onValueChange={(v) => setFormData({...formData, deal_id: v})}>
                <SelectTrigger>
                  <SelectValue placeholder={t("app.modals.addTask.selectDealOptional")} />
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

          {/* Recurring Task Section */}
          <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Repeat className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="is_recurring" className="font-medium">Recurring Task</Label>
              </div>
              <Switch
                id="is_recurring"
                checked={formData.is_recurring}
                onCheckedChange={(checked) => setFormData({...formData, is_recurring: checked})}
              />
            </div>
            
            {formData.is_recurring && (
              <div className="pt-2">
                <Label htmlFor="recurring_interval">Repeat every</Label>
                <Select 
                  value={formData.recurring_interval} 
                  onValueChange={(v: string) => setFormData({...formData, recurring_interval: v as "daily" | "weekly" | "monthly" | "yearly"})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Day</SelectItem>
                    <SelectItem value="weekly">Week</SelectItem>
                    <SelectItem value="monthly">Month</SelectItem>
                    <SelectItem value="yearly">Year</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  A new task will be automatically created after you complete this one.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("app.modals.addTask.cancel")}
            </Button>
            <Button 
              type="submit" 
              variant="outline"
              onClick={() => setAddAnother(true)}
              disabled={loading}
            >
              {t("app.modals.addTask.addAnother")}
            </Button>
            <Button 
              type="submit"
              onClick={() => setAddAnother(false)}
              disabled={loading}
            >
              {loading ? t("app.modals.addTask.creating") : t("app.modals.addTask.addTask")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;