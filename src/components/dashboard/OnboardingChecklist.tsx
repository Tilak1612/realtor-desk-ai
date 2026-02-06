import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ArrowRight, Building2, Users, Calendar, Mail, Bot, X, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  checkFn: () => Promise<boolean>;
}

interface OnboardingChecklistProps {
  userId: string;
  onDismiss?: () => void;
}

const OnboardingChecklist = ({ userId, onDismiss }: OnboardingChecklistProps) => {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  const checklistItems: ChecklistItem[] = useMemo(() => [
    {
      id: "add_property",
      title: "Add your first property",
      description: "List a property to start tracking",
      icon: Building2,
      path: "/properties",
      checkFn: async () => {
        const { count } = await supabase
          .from("properties")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);
        return (count || 0) > 0;
      },
    },
    {
      id: "add_contact",
      title: "Add your first contact",
      description: "Import or create a lead/client",
      icon: Users,
      path: "/contacts",
      checkFn: async () => {
        const { count } = await supabase
          .from("contacts")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);
        return (count || 0) > 0;
      },
    },
    {
      id: "create_task",
      title: "Create a task",
      description: "Schedule your first follow-up",
      icon: Calendar,
      path: "/tasks",
      checkFn: async () => {
        const { count } = await supabase
          .from("tasks")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);
        return (count || 0) > 0;
      },
    },
    {
      id: "try_ai",
      title: "Try the AI Assistant",
      description: "Ask a question to get started",
      icon: Bot,
      path: "/ai-assistant",
      checkFn: async () => {
        const { count } = await supabase
          .from("ai_conversations")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);
        return (count || 0) > 0;
      },
    },
    {
      id: "setup_campaign",
      title: "Explore email campaigns",
      description: "See automation options",
      icon: Mail,
      path: "/campaigns",
      checkFn: async () => {
        // This is always unchecked until they visit
        return false;
      },
    },
  ], [userId]);

  useEffect(() => {
    const checkProgress = async () => {
      setLoading(true);
      const completed = new Set<string>();
      
      for (const item of checklistItems) {
        try {
          const isComplete = await item.checkFn();
          if (isComplete) {
            completed.add(item.id);
          }
        } catch (e) {
          // Silently fail individual checks
        }
      }
      
      setCompletedItems(completed);
      setLoading(false);
    };

    checkProgress();
  }, [checklistItems]);

  const progress = (completedItems.size / checklistItems.length) * 100;
  const allComplete = completedItems.size === checklistItems.length;

  if (dismissed || allComplete) {
    return null;
  }

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-medium">Getting Started</CardTitle>
            <Badge variant="secondary" className="ml-2 text-xs">
              {completedItems.size}/{checklistItems.length}
            </Badge>
          </div>
          {onDismiss && (
            <Button variant="ghost" size="icon" onClick={() => { setDismissed(true); onDismiss?.(); }}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CardDescription className="text-sm">Complete these steps to get the most out of Realtor Desk</CardDescription>
        <Progress value={progress} className="h-1.5 mt-2" />
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {checklistItems.map((item) => {
            const isComplete = completedItems.has(item.id);
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.id} 
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isComplete 
                    ? "bg-accent/50 opacity-60" 
                    : "bg-background hover:bg-accent/30 cursor-pointer"
                }`}
              >
                <div className={`flex-shrink-0 ${isComplete ? "text-accent" : "text-muted-foreground"}`}>
                  {isComplete ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>
                <Icon className="h-4 w-4 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isComplete ? "line-through text-muted-foreground" : ""}`}>
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.description}
                  </p>
                </div>
                {!isComplete && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                )}
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingChecklist;