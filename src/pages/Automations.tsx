import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Zap, 
  Mail, 
  Clock, 
  Users, 
  Play, 
  Pause, 
  MoreVertical,
  TrendingUp,
  Target,
  UserPlus,
  Tag
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import CreateAutomationModal from "@/components/automations/CreateAutomationModal";

interface Profile {
  full_name: string;
  email: string;
  avatar_url?: string;
  subscription_tier?: string;
  subscription_status?: string;
}

interface Automation {
  id: string;
  name: string;
  description: string | null;
  trigger_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  steps_count?: number;
  enrollments_count?: number;
}

const triggerIcons: Record<string, typeof UserPlus> = {
  new_lead: UserPlus,
  lead_score_change: TrendingUp,
  tag_added: Tag,
  deal_stage_change: Target,
  manual: Users,
  schedule: Clock,
};

const triggerLabels: Record<string, string> = {
  new_lead: "New Lead Added",
  lead_score_change: "Lead Score Changes",
  tag_added: "Tag Added",
  deal_stage_change: "Deal Stage Change",
  manual: "Manual Trigger",
  schedule: "Scheduled",
};

const Automations = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<unknown>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchAutomations = useCallback(async () => {
    const { data, error } = await supabase
      .from("email_automations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching automations:", error);
      toast.error(t('automations.loadFailed', 'Failed to load automations'));
      return;
    }

    setAutomations(data || []);
  }, [t]);

  const checkAuthAndFetch = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }
    setUser(session.user);
    
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();
    
    if (profileData) {
      setProfile(profileData as Profile);
    }

    await fetchAutomations();
    setLoading(false);
  }, [fetchAutomations, navigate]);

  useEffect(() => {
    checkAuthAndFetch();
  }, [checkAuthAndFetch]);

  const toggleAutomationStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    
    const { error } = await supabase
      .from("email_automations")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update automation status");
      return;
    }

    toast.success(`Automation ${newStatus === "active" ? "activated" : "paused"}`);
    fetchAutomations();
  };

  const deleteAutomation = async (id: string) => {
    const { error } = await supabase
      .from("email_automations")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete automation");
      return;
    }

    toast.success("Automation deleted");
    fetchAutomations();
  };

  const stats = {
    total: automations.length,
    active: automations.filter(a => a.status === "active").length,
    totalEnrollments: automations.reduce((sum, a) => sum + (a.enrollments_count || 0), 0),
  };

  if (loading) {
    return (
      <AppLayout user={user} profile={profile}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user} profile={profile}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Email Automations</h1>
            <p className="text-muted-foreground">
              Create automated email sequences to nurture leads and engage contacts
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Automation
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Automations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Play className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.active}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalEnrollments}</p>
                  <p className="text-sm text-muted-foreground">Contacts Enrolled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Automations List */}
        {automations.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No automations yet</h3>
                  <p className="text-muted-foreground">
                    Create your first automation to start engaging contacts automatically
                  </p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Your First Automation
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {automations.map((automation) => {
              const TriggerIcon = triggerIcons[automation.trigger_type] || Zap;
              return (
                <Card key={automation.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <TriggerIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{automation.name}</h3>
                            <Badge 
                              variant={automation.status === "active" ? "default" : "secondary"}
                              className="capitalize"
                            >
                              {automation.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {automation.description || triggerLabels[automation.trigger_type]}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {automation.steps_count || 0} steps
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {automation.enrollments_count || 0} enrolled
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={automation.status === "active"}
                          onCheckedChange={() => toggleAutomationStatus(automation.id, automation.status)}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toast.info("Edit coming soon")}>
                              Edit Automation
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info("Duplicate coming soon")}>
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => deleteAutomation(automation.id)}
                              className="text-destructive"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <CreateAutomationModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreated={fetchAutomations}
      />
    </AppLayout>
  );
};

export default Automations;
