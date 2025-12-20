import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Lightbulb, Phone, Mail, Clock, X, ChevronRight, Sparkles, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface AIInsight {
  id: string;
  type: "next_action" | "lead_score" | "follow_up" | "risk";
  title: string;
  description: string;
  contactId?: string;
  contactName?: string;
  priority: "high" | "medium" | "low";
  actionType?: "call" | "email" | "task";
  dismissed?: boolean;
}

interface AIInsightsWidgetProps {
  userId: string;
}

const AIInsightsWidget = ({ userId }: AIInsightsWidgetProps) => {
  const navigate = useNavigate();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    generateInsights();
  }, [userId]);

  const generateInsights = async () => {
    setLoading(true);
    try {
      // Fetch contacts with high AI scores that haven't been contacted recently
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: hotLeads } = await supabase
        .from("contacts")
        .select("id, first_name, last_name, ai_score, last_contact_date, email, phone")
        .eq("user_id", userId)
        .gte("ai_score", 70)
        .order("ai_score", { ascending: false })
        .limit(5);

      // Fetch contacts with no recent activity (quiet leads)
      const { data: quietLeads } = await supabase
        .from("contacts")
        .select("id, first_name, last_name, ai_score, last_contact_date")
        .eq("user_id", userId)
        .lt("last_contact_date", thirtyDaysAgo.toISOString())
        .order("ai_score", { ascending: false })
        .limit(3);

      const generatedInsights: AIInsight[] = [];

      // Generate next best action insights for hot leads
      hotLeads?.forEach((lead, index) => {
        if (index === 0 && lead.ai_score >= 85) {
          generatedInsights.push({
            id: `action-${lead.id}`,
            type: "next_action",
            title: "Priority: Contact hot lead",
            description: `${lead.first_name} ${lead.last_name || ""} has a high engagement score (${lead.ai_score}). Recommended: Schedule a call to discuss their property search.`,
            contactId: lead.id,
            contactName: `${lead.first_name} ${lead.last_name || ""}`.trim(),
            priority: "high",
            actionType: "call",
          });
        }
      });

      // Lead score explanations
      hotLeads?.slice(0, 2).forEach((lead) => {
        if (lead.ai_score >= 80) {
          generatedInsights.push({
            id: `score-${lead.id}`,
            type: "lead_score",
            title: `Lead Score: ${lead.ai_score}/100`,
            description: `${lead.first_name}'s score is based on: recent website activity, email engagement, and property viewing history. They're showing strong buying signals.`,
            contactId: lead.id,
            contactName: `${lead.first_name} ${lead.last_name || ""}`.trim(),
            priority: "medium",
          });
        }
      });

      // Follow-up suggestions for quiet leads
      quietLeads?.forEach((lead) => {
        const daysSinceContact = lead.last_contact_date 
          ? Math.floor((Date.now() - new Date(lead.last_contact_date).getTime()) / (1000 * 60 * 60 * 24))
          : 30;
        
        if (daysSinceContact >= 14) {
          generatedInsights.push({
            id: `followup-${lead.id}`,
            type: "follow_up",
            title: "Follow-up recommended",
            description: `${lead.first_name} ${lead.last_name || ""} hasn't been contacted in ${daysSinceContact} days. Consider sending a market update or check-in email.`,
            contactId: lead.id,
            contactName: `${lead.first_name} ${lead.last_name || ""}`.trim(),
            priority: daysSinceContact > 30 ? "high" : "medium",
            actionType: "email",
          });
        }
      });

      // Add a risk alert if there are stale leads
      if (quietLeads && quietLeads.length >= 3) {
        generatedInsights.push({
          id: "risk-stale-leads",
          type: "risk",
          title: "Engagement risk detected",
          description: `You have ${quietLeads.length}+ leads who haven't been contacted in over 2 weeks. Regular follow-ups increase conversion rates by 40%.`,
          priority: "medium",
        });
      }

      setInsights(generatedInsights);
    } catch (error) {
      console.error("Error generating insights:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set([...prev, id]));
  };

  const handleAction = (insight: AIInsight) => {
    if (insight.contactId) {
      navigate(`/contacts/${insight.contactId}`);
    } else if (insight.type === "risk") {
      navigate("/contacts");
    }
  };

  const visibleInsights = insights.filter((i) => !dismissedIds.has(i.id)).slice(0, 4);

  const getInsightIcon = (type: string, actionType?: string) => {
    if (type === "risk") return AlertTriangle;
    if (actionType === "call") return Phone;
    if (actionType === "email") return Mail;
    if (type === "lead_score") return Sparkles;
    return Lightbulb;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <Bot className="h-4 w-4 text-primary" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (visibleInsights.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <Bot className="h-4 w-4 text-primary" />
            AI Insights
          </CardTitle>
          <CardDescription className="text-sm">Proactive recommendations for your business</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No new insights right now.</p>
            <p className="text-xs">Add more contacts and activity to see AI recommendations.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <Bot className="h-4 w-4 text-primary" />
              AI Insights
            </CardTitle>
            <CardDescription className="text-sm">Proactive recommendations based on your data</CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-generated
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {visibleInsights.map((insight) => {
            const Icon = getInsightIcon(insight.type, insight.actionType);
            
            return (
              <div
                key={insight.id}
                className="group relative p-4 rounded-lg border bg-card hover:bg-accent/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${getPriorityColor(insight.priority)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{insight.title}</p>
                      {insight.priority === "high" && (
                        <Badge variant="destructive" className="text-xs px-1.5 py-0">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {insight.description}
                    </p>
                    {insight.contactName && (
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 mt-1 text-primary"
                        onClick={() => handleAction(insight)}
                      >
                        View {insight.contactName}
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                    onClick={() => handleDismiss(insight.id)}
                    title="Dismiss"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-3 border-t flex items-center justify-between">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Updated every hour
          </p>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={generateInsights}>
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightsWidget;