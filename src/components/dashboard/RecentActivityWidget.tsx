import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Activity, User, Home, Briefcase, CheckSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  type: "contact" | "property" | "deal" | "task";
  description: string;
  timestamp: string;
}

interface RecentActivityWidgetProps {
  userId: string;
}

const RecentActivityWidget = ({ userId }: RecentActivityWidgetProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        // Fetch recent contacts
        const { data: contacts } = await supabase
          .from("contacts")
          .select("id, first_name, last_name, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(3);

        // Fetch recent properties
        const { data: properties } = await supabase
          .from("properties")
          .select("id, title, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(3);

        // Fetch recent deals
        const { data: deals } = await supabase
          .from("deals")
          .select("id, title, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(3);

        // Fetch recent completed tasks
        const { data: tasks } = await supabase
          .from("tasks")
          .select("id, title, completed_at")
          .eq("user_id", userId)
          .eq("status", "completed")
          .order("completed_at", { ascending: false })
          .limit(3);

        const allActivities: ActivityItem[] = [];

        contacts?.forEach((contact) => {
          allActivities.push({
            id: `contact-${contact.id}`,
            type: "contact",
            description: `Added contact: ${contact.first_name} ${contact.last_name || ""}`.trim(),
            timestamp: contact.created_at,
          });
        });

        properties?.forEach((property) => {
          allActivities.push({
            id: `property-${property.id}`,
            type: "property",
            description: `Added property: ${property.title}`,
            timestamp: property.created_at,
          });
        });

        deals?.forEach((deal) => {
          allActivities.push({
            id: `deal-${deal.id}`,
            type: "deal",
            description: `Created deal: ${deal.title}`,
            timestamp: deal.created_at,
          });
        });

        tasks?.forEach((task) => {
          if (task.completed_at) {
            allActivities.push({
              id: `task-${task.id}`,
              type: "task",
              description: `Completed task: ${task.title}`,
              timestamp: task.completed_at,
            });
          }
        });

        // Sort by timestamp and take top 8
        allActivities.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setActivities(allActivities.slice(0, 8));
      } catch (error) {
        console.error("Error fetching activity:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchRecentActivity();
    }
  }, [userId]);

  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "contact":
        return <User className="h-3.5 w-3.5 text-primary" />;
      case "property":
        return <Home className="h-3.5 w-3.5 text-info" />;
      case "deal":
        return <Briefcase className="h-3.5 w-3.5 text-success" />;
      case "task":
        return <CheckSquare className="h-3.5 w-3.5 text-warning" />;
    }
  };

  const getTypeLabel = (type: ActivityItem["type"]) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-heading-3 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-muted animate-pulse rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-heading-3 flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-body-sm text-muted-foreground py-4">
            No recent activity yet. Start by adding a contact or property.
          </p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {activities.map((item) => (
              <li key={item.id} className="flex justify-between gap-3 py-1.5 border-b border-border/50 last:border-0">
                <div className="flex items-start gap-2 min-w-0">
                  <span className="mt-0.5">{getIcon(item.type)}</span>
                  <p className="text-body-sm truncate">{item.description}</p>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-meta text-muted-foreground uppercase">
                    {getTypeLabel(item.type)}
                  </span>
                  <span className="text-meta text-muted-foreground">
                    {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityWidget;