import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronUp, ChevronDown, Building2, Users, Calendar, Bot, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ChecklistItem {
  id: string;
  step: number;
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  buttonText: string;
  statLabel: string;
  checkFn: () => Promise<number>;
}

interface OnboardingChecklistProps {
  userId: string;
  onDismiss?: () => void;
}

const OnboardingChecklist = ({ userId, onDismiss }: OnboardingChecklistProps) => {
  const [itemStats, setItemStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [expandedItem, setExpandedItem] = useState<string | null>("add_property");

  const checklistItems: ChecklistItem[] = [
    {
      id: "add_property",
      step: 1,
      title: "Add Properties",
      description: "Add your listings to start tracking deals and connecting with clients.",
      icon: Building2,
      path: "/properties",
      buttonText: "Add Property",
      statLabel: "Properties Added",
      checkFn: async () => {
        const { count } = await supabase
          .from("properties")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);
        return count || 0;
      },
    },
    {
      id: "add_contact",
      step: 2,
      title: "Add Contacts",
      description: "Import or create leads and clients to manage your relationships effectively.",
      icon: Users,
      path: "/contacts",
      buttonText: "Add Contact",
      statLabel: "Contacts Added",
      checkFn: async () => {
        const { count } = await supabase
          .from("contacts")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);
        return count || 0;
      },
    },
    {
      id: "create_task",
      step: 3,
      title: "Create Tasks",
      description: "Schedule follow-ups and stay on top of your daily activities.",
      icon: Calendar,
      path: "/tasks",
      buttonText: "Create Task",
      statLabel: "Tasks Created",
      checkFn: async () => {
        const { count } = await supabase
          .from("tasks")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);
        return count || 0;
      },
    },
    {
      id: "try_ai",
      step: 4,
      title: "Try AI Assistant",
      description: "Get intelligent insights and recommendations to close more deals.",
      icon: Bot,
      path: "/ai-assistant",
      buttonText: "Try AI",
      statLabel: "Conversations",
      checkFn: async () => {
        const { count } = await supabase
          .from("ai_conversations")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);
        return count || 0;
      },
    },
    {
      id: "setup_campaign",
      step: 5,
      title: "Explore Campaigns",
      description: "Set up email campaigns to nurture leads and stay connected with clients.",
      icon: Mail,
      path: "/campaigns",
      buttonText: "View Campaigns",
      statLabel: "Campaigns Created",
      checkFn: async () => {
        const { count } = await supabase
          .from("email_campaigns")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);
        return count || 0;
      },
    },
  ];

  useEffect(() => {
    const checkProgress = async () => {
      setLoading(true);
      const stats: Record<string, number> = {};
      
      for (const item of checklistItems) {
        try {
          stats[item.id] = await item.checkFn();
        } catch (e) {
          stats[item.id] = 0;
        }
      }
      
      setItemStats(stats);
      setLoading(false);
    };

    checkProgress();
  }, [userId]);

  const completedCount = Object.values(itemStats).filter(count => count > 0).length;
  const progress = (completedCount / checklistItems.length) * 100;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border">
        <div className="flex items-center gap-4 flex-1">
          <h2 className="text-base font-semibold text-foreground">Getting started checklist</h2>
          {/* Progress segments */}
          <div className="hidden md:flex items-center gap-1 flex-1 max-w-md">
            {checklistItems.map((item, index) => (
              <div
                key={item.id}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  (itemStats[item.id] || 0) > 0 
                    ? "bg-primary" 
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
        <Button
          variant="default"
          size="sm"
          className="h-8 text-xs"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Hide Checklist" : "Show Checklist"}
          {isOpen ? <ChevronUp className="ml-2 h-3 w-3" /> : <ChevronDown className="ml-2 h-3 w-3" />}
        </Button>
      </div>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="flex flex-col lg:flex-row">
          {/* Checklist Items */}
          <div className="flex-1 divide-y divide-border">
            {checklistItems.map((item) => {
              const Icon = item.icon;
              const isComplete = (itemStats[item.id] || 0) > 0;
              const isExpanded = expandedItem === item.id;
              
              return (
                <Collapsible
                  key={item.id}
                  open={isExpanded}
                  onOpenChange={() => setExpandedItem(isExpanded ? null : item.id)}
                >
                  <div className={`p-4 md:px-6 transition-colors ${isComplete ? "bg-muted/30" : "hover:bg-muted/20"}`}>
                    <div className="flex items-start gap-4">
                      {/* Step Number */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        isComplete 
                          ? "bg-primary/20 text-primary" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {item.step}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-sm font-medium ${isComplete ? "text-muted-foreground" : "text-foreground"}`}>
                            {item.title}
                          </h3>
                        </div>
                        
                        <CollapsibleContent>
                          <p className="text-xs text-muted-foreground mt-1 mb-3">
                            {item.description}
                          </p>
                        </CollapsibleContent>
                      </div>

                      {/* Action Button */}
                      <Button
                        asChild
                        variant="default"
                        size="sm"
                        className="h-8 text-xs flex-shrink-0"
                      >
                        <Link to={item.path}>
                          {item.buttonText}
                        </Link>
                      </Button>

                      {/* Expand Toggle */}
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>
                </Collapsible>
              );
            })}
          </div>

          {/* Stats Sidebar */}
          <div className="lg:w-64 bg-muted/30 border-t lg:border-t-0 lg:border-l border-border p-4 md:p-6 space-y-4">
            {checklistItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between lg:block">
                <span className="text-2xl font-bold text-foreground lg:block">
                  {itemStats[item.id] || 0}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.statLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingChecklist;