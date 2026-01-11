import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Calendar, Home, FileText, Users, Clock, Repeat } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface TaskTemplate {
  id: string;
  title: string;
  description: string;
  task_type: string;
  priority: string;
  icon: React.ComponentType<{ className?: string }>;
  isRecurring?: boolean;
  recurringInterval?: string;
}

interface TaskTemplatesProps {
  onSelectTemplate: (template: TaskTemplate) => void;
}

const TaskTemplates = ({ onSelectTemplate }: TaskTemplatesProps) => {
  const { t } = useTranslation();

  const templates: TaskTemplate[] = [
    {
      id: "follow-up-call",
      title: "Follow-up Call",
      description: "Schedule a follow-up call with a lead or client",
      task_type: "call",
      priority: "high",
      icon: Phone,
    },
    {
      id: "send-listings",
      title: "Send Property Listings",
      description: "Email curated property listings to buyer",
      task_type: "email",
      priority: "medium",
      icon: Mail,
    },
    {
      id: "schedule-showing",
      title: "Schedule Showing",
      description: "Book a property viewing appointment",
      task_type: "viewing",
      priority: "high",
      icon: Home,
    },
    {
      id: "client-meeting",
      title: "Client Meeting",
      description: "In-person or virtual meeting with client",
      task_type: "meeting",
      priority: "medium",
      icon: Users,
    },
    {
      id: "contract-review",
      title: "Contract Review",
      description: "Review and prepare contract documents",
      task_type: "other",
      priority: "high",
      icon: FileText,
    },
    {
      id: "weekly-check-in",
      title: "Weekly Check-in",
      description: "Regular weekly touchpoint with active clients",
      task_type: "call",
      priority: "medium",
      icon: Repeat,
      isRecurring: true,
      recurringInterval: "weekly",
    },
    {
      id: "monthly-market-update",
      title: "Monthly Market Update",
      description: "Send monthly market report to database",
      task_type: "email",
      priority: "low",
      icon: Calendar,
      isRecurring: true,
      recurringInterval: "monthly",
    },
    {
      id: "anniversary-reminder",
      title: "Home Anniversary",
      description: "Annual home purchase anniversary reminder",
      task_type: "followup",
      priority: "low",
      icon: Clock,
      isRecurring: true,
      recurringInterval: "yearly",
    },
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Quick start with a template:
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-primary hover:bg-accent/50 transition-colors text-left group"
            >
              <div className="p-2 rounded-full bg-accent group-hover:bg-primary/10">
                <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium line-clamp-1">{template.title}</p>
                {template.isRecurring && (
                  <Badge variant="outline" className="text-[10px] mt-1 h-4">
                    <Repeat className="h-2 w-2 mr-1" />
                    {template.recurringInterval}
                  </Badge>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TaskTemplates;
