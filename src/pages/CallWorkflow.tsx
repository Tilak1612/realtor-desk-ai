import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  Save,
  X,
  Tag,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AICallSummaryPanel from "@/components/call-workflow/AICallSummaryPanel";
import WorkflowFeedbackWidget from "@/components/feedback/WorkflowFeedbackWidget";

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  tags: string[];
  stage: string;
  notes: string;
  last_contact_date: string | null;
  next_followup_date: string | null;
}

const CallWorkflow = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { contactId } = useParams<{ contactId: string }>();
  
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [contact, setContact] = useState<Contact | null>(null);
  const [contactQueue, setContactQueue] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Call workflow state
  const [callOutcome, setCallOutcome] = useState<string>("");
  const [callNotes, setCallNotes] = useState<string>("");
  const [nextStepType, setNextStepType] = useState<string>("");
  const [nextStepDate, setNextStepDate] = useState<string>("");
  const [nextStepTime, setNextStepTime] = useState<string>("09:00");
  const [newStage, setNewStage] = useState<string>("");
  
  // AI panel state
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [aiSummary, setAISummary] = useState<any>(null);
  const [generatingAI, setGeneratingAI] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
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

        setProfile(profileData);

        // Get contact queue from location state
        const queue = location.state?.contactQueue || [contactId];
        setContactQueue(queue);
        setCurrentIndex(queue.indexOf(contactId));

        await fetchContactData(contactId!);
      } catch (error: any) {
        console.error("Error:", error);
        toast.error("Failed to load contact");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [contactId, navigate]);

  const fetchContactData = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      // Type assertion for contact data with optional fields
      const contactData: any = data;
      setContact(contactData);
      setNewStage(contactData.stage || "");
      setCallNotes(contactData.notes || "");
    } catch (error) {
      console.error("Error fetching contact:", error);
      toast.error("Failed to load contact details");
    }
  };

  const handleGenerateAISummary = async () => {
    if (!callNotes.trim()) {
      toast.error("Please add some call notes first");
      return;
    }

    setGeneratingAI(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-call-summary', {
        body: { 
          notes: callNotes,
          contactName: `${contact?.first_name} ${contact?.last_name}`,
          currentStage: contact?.stage,
        }
      });

      if (error) throw error;

      setAISummary(data);
      toast.success("AI summary generated!");
    } catch (error) {
      console.error("Error generating AI summary:", error);
      toast.error("Failed to generate AI summary");
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleApplyAISummary = () => {
    if (aiSummary?.summary) {
      const summaryText = `\n\n--- AI Summary ---\n${aiSummary.summary.join('\n')}\nIntent: ${aiSummary.intent}\nTone: ${aiSummary.tone}`;
      setCallNotes(prev => prev + summaryText);
      toast.success("Summary added to notes");
    }
  };

  const handleCreateFollowupFromAI = () => {
    if (aiSummary?.suggestedAction) {
      const action = aiSummary.suggestedAction;
      
      // Parse the AI suggestion to set next step
      if (action.toLowerCase().includes('email')) {
        setNextStepType('email');
      } else if (action.toLowerCase().includes('call')) {
        setNextStepType('call');
      } else if (action.toLowerCase().includes('meeting')) {
        setNextStepType('meeting');
      } else {
        setNextStepType('other');
      }

      // Try to extract days from suggestion
      const daysMatch = action.match(/(\d+)\s*days?/i);
      if (daysMatch) {
        const days = parseInt(daysMatch[1]);
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);
        setNextStepDate(futureDate.toISOString().split('T')[0]);
      } else {
        // Default to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setNextStepDate(tomorrow.toISOString().split('T')[0]);
      }

      toast.success("Follow-up task created from AI suggestion");
    }
  };

  const logAdoptionEvent = async (eventType: string, metadata?: any) => {
    try {
      // Note: This will work after database migration is run
      // For now, just log to console
      console.log("Adoption event:", eventType, metadata);
      
      /* Uncomment after running database migration:
      await supabase.from("adoption_events").insert({
        user_id: user.id,
        event_type: eventType,
        metadata: metadata,
      });
      */
    } catch (error) {
      console.error("Error logging adoption event:", error);
    }
  };

  const handleSave = async (andNext: boolean = false) => {
    if (!contact) return;

    setSaving(true);
    try {
      // Update contact
      const updates: any = {
        notes: callNotes,
        stage: newStage || contact.stage,
        last_contact_date: new Date().toISOString(),
      };

      if (nextStepDate) {
        const datetime = `${nextStepDate}T${nextStepTime}:00`;
        updates.next_followup_date = datetime;
      }

      const { error: updateError } = await supabase
        .from("contacts")
        .update(updates)
        .eq("id", contact.id);

      if (updateError) throw updateError;

      // Log call outcome as activity
      if (callOutcome) {
        try {
          // Use existing activities table with proper activity_type
          await supabase.from("activities").insert({
            user_id: user.id,
            activity_type: "call_made",
            title: `Call with ${contact.first_name} ${contact.last_name || ''}`,
            description: `Outcome: ${callOutcome}${callNotes ? '\n\n' + callNotes : ''}`,
            start_date: new Date().toISOString(),
            contact_id: contact.id,
          });
        } catch (activityError) {
          console.error("Error logging activity:", activityError);
        }

        // Log adoption event
        await logAdoptionEvent("call_logged", { 
          contact_id: contact.id,
          outcome: callOutcome 
        });
      }

      // Create follow-up task
      if (nextStepType && nextStepDate) {
        const datetime = `${nextStepDate}T${nextStepTime}:00`;
        await supabase.from("tasks").insert({
          user_id: user.id,
          contact_id: contact.id,
          title: `${nextStepType.charAt(0).toUpperCase() + nextStepType.slice(1)} follow-up: ${contact.first_name} ${contact.last_name}`,
          description: callNotes,
          due_date: datetime,
          priority: "medium",
          status: "pending",
        });

        // Log adoption event
        await logAdoptionEvent("followup_scheduled", {
          contact_id: contact.id,
          type: nextStepType,
          date: datetime,
        });
      }

      // Log stage change
      if (newStage && newStage !== contact.stage) {
        await logAdoptionEvent("deal_stage_changed", {
          contact_id: contact.id,
          old_stage: contact.stage,
          new_stage: newStage,
        });
      }

      toast.success("Call saved successfully!");

      if (andNext) {
        handleNextContact();
      } else {
        navigate("/today");
      }
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save call details");
    } finally {
      setSaving(false);
    }
  };

  const handleNextContact = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < contactQueue.length) {
      const nextContactId = contactQueue[nextIndex];
      navigate(`/call-workflow/${nextContactId}`, {
        state: { contactQueue }
      });
      setCurrentIndex(nextIndex);
      // Reset form
      setCallOutcome("");
      setCallNotes("");
      setNextStepType("");
      setNextStepDate("");
      setNextStepTime("09:00");
      setAISummary(null);
      fetchContactData(nextContactId);
    } else {
      toast.success("All calls completed!");
      navigate("/today");
    }
  };

  const handlePreviousContact = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      const prevContactId = contactQueue[prevIndex];
      navigate(`/call-workflow/${prevContactId}`, {
        state: { contactQueue }
      });
      setCurrentIndex(prevIndex);
    }
  };

  const getStageLabel = (stage: string) => {
    const stageMap: Record<string, string> = {
      new_lead: 'New Lead',
      cold_lead: 'Cold Lead',
      warm_lead: 'Warm Lead',
      hot_lead: 'Hot Lead',
      viewing: 'Viewing',
      offer: 'Offer',
      negotiation: 'Negotiation',
      under_contract: 'Under Contract',
      closed: 'Closed',
      lost: 'Lost',
      past_client: 'Past Client',
      sphere: 'Sphere',
    };
    return stageMap[stage] || stage;
  };

  if (loading) {
    return (
      <AppLayout user={user} profile={profile}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading contact...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!contact) {
    return (
      <AppLayout user={user} profile={profile}>
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg">Contact not found</p>
          <Button className="mt-4" onClick={() => navigate("/today")}>
            Back to Today
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user} profile={profile}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/today")}
            >
              <X className="w-4 h-4 mr-1" />
              Exit
            </Button>
            <div className="text-sm text-muted-foreground">
              Contact {currentIndex + 1} of {contactQueue.length}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentIndex === 0}
              onClick={handlePreviousContact}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentIndex === contactQueue.length - 1}
              onClick={handleNextContact}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Call Workflow */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">
                      {contact.first_name} {contact.last_name}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-primary/10 text-primary">
                        {getStageLabel(contact.stage)}
                      </Badge>
                      {contact.tags?.map((tag) => (
                        <Badge key={tag} variant="outline">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {contact.phone && (
                  <a 
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary hover:bg-accent/50 transition-all group"
                  >
                    <Phone className="w-5 h-5 text-primary" />
                    <span className="font-medium">{contact.phone}</span>
                  </a>
                )}
                {contact.email && (
                  <a 
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary hover:bg-accent/50 transition-all group"
                  >
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="font-medium">{contact.email}</span>
                  </a>
                )}
              </CardContent>
            </Card>

            {/* Call Now Button */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Call Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <a href={`tel:${contact.phone}`} className="block">
                  <Button 
                    size="lg" 
                    className="w-full h-14 text-lg font-semibold"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </Button>
                </a>
                
                <div>
                  <Label htmlFor="call-outcome">Call Outcome</Label>
                  <Select value={callOutcome} onValueChange={setCallOutcome}>
                    <SelectTrigger id="call-outcome">
                      <SelectValue placeholder="Select outcome..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no_answer">No answer</SelectItem>
                      <SelectItem value="voicemail">Left voicemail</SelectItem>
                      <SelectItem value="spoke_interested">Spoke – interested</SelectItem>
                      <SelectItem value="spoke_not_interested">Spoke – not interested</SelectItem>
                      <SelectItem value="needs_followup">Needs follow-up</SelectItem>
                      <SelectItem value="wrong_number">Wrong number</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Call Notes</CardTitle>
                <CardDescription>
                  Record details from your conversation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="What did you discuss? Any important details to remember..."
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
              </CardContent>
            </Card>

            {/* Next Step */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Next Step</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="next-step-type">Action Type</Label>
                  <Select value={nextStepType} onValueChange={setNextStepType}>
                    <SelectTrigger id="next-step-type">
                      <SelectValue placeholder="Select next step..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">Follow-up call</SelectItem>
                      <SelectItem value="email">Send email</SelectItem>
                      <SelectItem value="sms">Send SMS</SelectItem>
                      <SelectItem value="meeting">Book meeting</SelectItem>
                      <SelectItem value="campaign">Add to campaign</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="next-step-date">Date</Label>
                    <Input
                      id="next-step-date"
                      type="date"
                      value={nextStepDate}
                      onChange={(e) => setNextStepDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="next-step-time">Time</Label>
                    <Input
                      id="next-step-time"
                      type="time"
                      value={nextStepTime}
                      onChange={(e) => setNextStepTime(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pipeline Update */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Update Pipeline Stage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={newStage === "hot_lead" ? "default" : "outline"}
                    onClick={() => setNewStage("hot_lead")}
                  >
                    Mark as Hot Lead
                  </Button>
                  <Button
                    variant={newStage === "viewing" ? "default" : "outline"}
                    onClick={() => setNewStage("viewing")}
                  >
                    Move to Viewing
                  </Button>
                  <Button
                    variant={newStage === "under_contract" ? "default" : "outline"}
                    onClick={() => setNewStage("under_contract")}
                  >
                    Under Contract
                  </Button>
                  <Button
                    variant={newStage === "closed" ? "default" : "outline"}
                    onClick={() => setNewStage("closed")}
                  >
                    Mark as Closed
                  </Button>
                  <Button
                    variant={newStage === "lost" ? "default" : "outline"}
                    onClick={() => setNewStage("lost")}
                  >
                    Mark as Lost
                  </Button>
                  <Button
                    variant={newStage === "past_client" ? "default" : "outline"}
                    onClick={() => setNewStage("past_client")}
                  >
                    Past Client
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={() => handleSave(true)}
                disabled={saving || !callOutcome}
              >
                {saving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Save & Next Contact
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleSave(false)}
                disabled={saving}
              >
                <Save className="w-5 h-5 mr-2" />
                Save & Close
              </Button>
            </div>

            {/* Workflow Feedback */}
            <WorkflowFeedbackWidget workflowName="Call Workflow" />
          </div>

          {/* AI Call Summary Panel */}
          {showAIPanel && (
            <div className="lg:col-span-1">
              <AICallSummaryPanel
                callNotes={callNotes}
                aiSummary={aiSummary}
                generatingAI={generatingAI}
                onGenerateSummary={handleGenerateAISummary}
                onApplySummary={handleApplyAISummary}
                onCreateFollowup={handleCreateFollowupFromAI}
              />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default CallWorkflow;
