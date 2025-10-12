import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Mail, Phone, MessageSquare, Calendar, FileText, Tag, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import LogActivityModal from "./LogActivityModal";

interface ActivityTimelineProps {
  contactId: string;
}

const ActivityTimeline = ({ contactId }: ActivityTimelineProps) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, [contactId]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("contact_activities")
        .select("*")
        .eq("contact_id", contactId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "email_sent":
      case "email_received":
        return <Mail className="h-4 w-4" />;
      case "call_made":
      case "call_received":
        return <Phone className="h-4 w-4" />;
      case "sms_sent":
      case "sms_received":
        return <MessageSquare className="h-4 w-4" />;
      case "meeting_held":
        return <Calendar className="h-4 w-4" />;
      case "note_added":
        return <FileText className="h-4 w-4" />;
      case "tag_added":
      case "tag_removed":
        return <Tag className="h-4 w-4" />;
      case "status_changed":
      case "deal_created":
      case "deal_updated":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Activity Timeline</CardTitle>
          <Button onClick={() => setIsLogModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Log Activity
          </Button>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No activity yet. Start by logging a call or sending an email.
              </p>
              <Button onClick={() => setIsLogModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Log First Activity
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {getActivityIcon(activity.activity_type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.description}
                          </p>
                        )}
                        {activity.metadata?.duration && (
                          <Badge variant="outline" className="mt-2">
                            Duration: {activity.metadata.duration}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(activity.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <LogActivityModal
        contactId={contactId}
        open={isLogModalOpen}
        onOpenChange={setIsLogModalOpen}
        onSuccess={fetchActivities}
      />
    </>
  );
};

export default ActivityTimeline;
