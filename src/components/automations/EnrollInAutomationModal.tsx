import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Zap, 
  UserPlus, 
  TrendingUp, 
  Tag, 
  Target, 
  Users, 
  Clock,
  Loader2
} from "lucide-react";

interface EnrollInAutomationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactId: string;
  contactName: string;
}

interface Automation {
  id: string;
  name: string;
  description: string | null;
  trigger_type: string;
  status: string;
}

const triggerIcons: Record<string, typeof UserPlus> = {
  new_lead: UserPlus,
  lead_score_change: TrendingUp,
  tag_added: Tag,
  deal_stage_change: Target,
  manual: Users,
  schedule: Clock,
};

const EnrollInAutomationModal = ({ 
  open, 
  onOpenChange, 
  contactId, 
  contactName 
}: EnrollInAutomationModalProps) => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchAutomations();
    }
  }, [open]);

  const fetchAutomations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("email_automations")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching automations:", error);
      toast.error("Failed to load automations");
    } else {
      setAutomations(data || []);
    }
    setLoading(false);
  };

  const handleEnroll = async (automationId: string) => {
    setEnrolling(automationId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("run-automation", {
        body: {
          automationId,
          contactId,
          action: "enroll",
        },
      });

      if (error) throw error;

      toast.success(`${contactName} enrolled in automation`);
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error enrolling contact:", error);
      toast.error(error.message || "Failed to enroll contact");
    } finally {
      setEnrolling(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enroll in Automation</DialogTitle>
          <DialogDescription>
            Choose an automation to enroll {contactName} in
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : automations.length === 0 ? (
          <div className="text-center py-8">
            <Zap className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No active automations available.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Create and activate an automation first.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {automations.map((automation) => {
              const TriggerIcon = triggerIcons[automation.trigger_type] || Zap;
              return (
                <Card 
                  key={automation.id} 
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleEnroll(automation.id)}
                >
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <TriggerIcon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{automation.name}</p>
                        {automation.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {automation.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {enrolling === automation.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Enroll
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollInAutomationModal;
