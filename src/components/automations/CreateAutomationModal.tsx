import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  UserPlus, 
  TrendingUp, 
  Tag, 
  Target, 
  Users, 
  Clock,
  Mail,
  MessageSquare,
  Plus,
  Trash2,
  GripVertical
} from "lucide-react";

interface CreateAutomationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

interface AutomationStep {
  id: string;
  action_type: "send_email" | "send_sms" | "wait" | "add_tag" | "create_task";
  action_config: {
    subject?: string;
    body?: string;
    delay_days?: number;
    tag_name?: string;
    task_title?: string;
    sms_message?: string;
  };
}

const triggerOptions = [
  { value: "new_lead", label: "New Lead Added", icon: UserPlus, description: "When a new contact is added" },
  { value: "lead_score_change", label: "Lead Score Changes", icon: TrendingUp, description: "When a contact's score changes" },
  { value: "tag_added", label: "Tag Added", icon: Tag, description: "When a specific tag is added" },
  { value: "deal_stage_change", label: "Deal Stage Change", icon: Target, description: "When a deal moves stages" },
  { value: "manual", label: "Manual Trigger", icon: Users, description: "Manually enroll contacts" },
];

const CreateAutomationModal = ({ open, onOpenChange, onCreated }: CreateAutomationModalProps) => {
  const [step, setStep] = useState<"details" | "steps">("details");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [triggerType, setTriggerType] = useState("");
  const [automationSteps, setAutomationSteps] = useState<AutomationStep[]>([]);

  const resetForm = () => {
    setStep("details");
    setName("");
    setDescription("");
    setTriggerType("");
    setAutomationSteps([]);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const addStep = (type: AutomationStep["action_type"]) => {
    const newStep: AutomationStep = {
      id: crypto.randomUUID(),
      action_type: type,
      action_config: type === "wait" ? { delay_days: 1 } : {},
    };
    setAutomationSteps([...automationSteps, newStep]);
  };

  const updateStep = (id: string, config: AutomationStep["action_config"]) => {
    setAutomationSteps(automationSteps.map(s => 
      s.id === id ? { ...s, action_config: { ...s.action_config, ...config } } : s
    ));
  };

  const removeStep = (id: string) => {
    setAutomationSteps(automationSteps.filter(s => s.id !== id));
  };

  const handleCreate = async () => {
    if (!name || !triggerType) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (automationSteps.length === 0) {
      toast.error("Please add at least one step");
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Create the automation
      const { data: automation, error: automationError } = await supabase
        .from("email_automations")
        .insert({
          user_id: session.user.id,
          name,
          description: description || null,
          trigger_type: triggerType,
          status: "draft",
        })
        .select()
        .single();

      if (automationError) throw automationError;

      // Create the steps
      const stepsToInsert = automationSteps.map((s, index) => ({
        automation_id: automation.id,
        step_order: index + 1,
        action_type: s.action_type,
        action_config: s.action_config,
      }));

      const { error: stepsError } = await supabase
        .from("automation_steps")
        .insert(stepsToInsert);

      if (stepsError) throw stepsError;

      toast.success("Automation created successfully!");
      handleClose();
      onCreated();
    } catch (error: unknown) {
      console.error("Error creating automation:", error);
      toast.error(error.message || "Failed to create automation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "details" ? "Create Email Automation" : "Add Automation Steps"}
          </DialogTitle>
          <DialogDescription>
            {step === "details" 
              ? "Set up a trigger to automatically engage your contacts"
              : "Define what happens when the automation runs"
            }
          </DialogDescription>
        </DialogHeader>

        {step === "details" ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Automation Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Welcome Sequence"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What does this automation do?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Trigger *</Label>
              <div className="grid grid-cols-1 gap-2">
                {triggerOptions.map((trigger) => (
                  <Card 
                    key={trigger.value}
                    className={`cursor-pointer transition-all ${
                      triggerType === trigger.value 
                        ? "ring-2 ring-primary bg-primary/5" 
                        : "hover:bg-accent"
                    }`}
                    onClick={() => setTriggerType(trigger.value)}
                  >
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <trigger.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{trigger.label}</p>
                        <p className="text-xs text-muted-foreground">{trigger.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button 
                onClick={() => setStep("steps")}
                disabled={!name || !triggerType}
              >
                Next: Add Steps
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Steps List */}
            <div className="space-y-3">
              {automationSteps.map((s, index) => (
                <Card key={s.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <GripVertical className="w-4 h-4" />
                        <span className="text-xs font-medium">#{index + 1}</span>
                      </div>
                      <div className="flex-1 space-y-3">
                        {s.action_type === "send_email" && (
                          <>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-primary" />
                              <span className="font-medium text-sm">Send Email</span>
                            </div>
                            <Input
                              placeholder="Email subject"
                              value={s.action_config.subject || ""}
                              onChange={(e) => updateStep(s.id, { subject: e.target.value })}
                            />
                            <Textarea
                              placeholder="Email body (supports {{first_name}}, {{last_name}} variables)"
                              value={s.action_config.body || ""}
                              onChange={(e) => updateStep(s.id, { body: e.target.value })}
                              rows={3}
                            />
                          </>
                        )}
                        {s.action_type === "wait" && (
                          <>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-orange-500" />
                              <span className="font-medium text-sm">Wait</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="1"
                                className="w-20"
                                value={s.action_config.delay_days || 1}
                                onChange={(e) => updateStep(s.id, { delay_days: parseInt(e.target.value) })}
                              />
                              <span className="text-sm text-muted-foreground">days</span>
                            </div>
                          </>
                        )}
                        {s.action_type === "add_tag" && (
                          <>
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4 text-green-500" />
                              <span className="font-medium text-sm">Add Tag</span>
                            </div>
                            <Input
                              placeholder="Tag name"
                              value={s.action_config.tag_name || ""}
                              onChange={(e) => updateStep(s.id, { tag_name: e.target.value })}
                            />
                          </>
                        )}
                        {s.action_type === "create_task" && (
                          <>
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-blue-500" />
                              <span className="font-medium text-sm">Create Task</span>
                            </div>
                            <Input
                              placeholder="Task title"
                              value={s.action_config.task_title || ""}
                              onChange={(e) => updateStep(s.id, { task_title: e.target.value })}
                            />
                          </>
                        )}
                        {s.action_type === "send_sms" && (
                          <>
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-green-500" />
                              <span className="font-medium text-sm">Send SMS</span>
                            </div>
                            <Textarea
                              placeholder="SMS message (supports {{first_name}}, {{last_name}} variables). Max 160 chars for single SMS."
                              value={s.action_config.sms_message || ""}
                              onChange={(e) => updateStep(s.id, { sms_message: e.target.value })}
                              rows={2}
                            />
                            <p className="text-xs text-muted-foreground">
                              {(s.action_config.sms_message || "").length}/160 characters
                            </p>
                          </>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => removeStep(s.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add Step Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => addStep("send_email")} className="gap-1">
                <Mail className="w-3 h-3" /> Send Email
              </Button>
              <Button variant="outline" size="sm" onClick={() => addStep("send_sms")} className="gap-1">
                <MessageSquare className="w-3 h-3" /> Send SMS
              </Button>
              <Button variant="outline" size="sm" onClick={() => addStep("wait")} className="gap-1">
                <Clock className="w-3 h-3" /> Wait
              </Button>
              <Button variant="outline" size="sm" onClick={() => addStep("add_tag")} className="gap-1">
                <Tag className="w-3 h-3" /> Add Tag
              </Button>
              <Button variant="outline" size="sm" onClick={() => addStep("create_task")} className="gap-1">
                <Target className="w-3 h-3" /> Create Task
              </Button>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("details")}>
                Back
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose}>Cancel</Button>
                <Button 
                  onClick={handleCreate} 
                  disabled={loading || automationSteps.length === 0}
                >
                  {loading ? "Creating..." : "Create Automation"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateAutomationModal;
