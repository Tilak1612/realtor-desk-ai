import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mail, MousePointer, Eye, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import type { EngagementStat } from "@/types/contact";

interface EngagementStatsProps { contactId: string; }

const defaultStats: EngagementStat = {
  id: "", contact_id: "", emails_sent: 0, emails_opened: 0, emails_clicked: 0,
  emails_replied: 0, website_visits: 0, documents_viewed: 0, properties_viewed: 0,
  avg_session_duration: 0, last_email_opened: null, created_at: "", updated_at: "",
};

const EngagementStats = ({ contactId }: EngagementStatsProps) => {
  const [stats, setStats] = useState<EngagementStat>(defaultStats);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("engagement_stats").select("*").eq("contact_id", contactId).single();
      if (error && error.code !== "PGRST116") throw error;
      setStats((data as EngagementStat) || defaultStats);
    } catch { /* silently handled */ } finally { setLoading(false); }
  }, [contactId]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  if (loading) return (<Card><CardHeader><Skeleton className="h-5 w-32" /></CardHeader><CardContent><Skeleton className="h-24" /></CardContent></Card>);

  const openRate = (stats.emails_sent || 0) > 0 ? Math.round(((stats.emails_opened || 0) / (stats.emails_sent || 1)) * 100) : 0;

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Engagement Stats</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /><span className="text-xs">Emails Sent</span></div>
            <p className="text-2xl font-bold">{stats.emails_sent || 0}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground"><Eye className="h-4 w-4" /><span className="text-xs">Opened</span></div>
            <p className="text-2xl font-bold">{stats.emails_opened || 0}</p>
            <Progress value={openRate} className="h-1" /><span className="text-xs text-muted-foreground">{openRate}%</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground"><MousePointer className="h-4 w-4" /><span className="text-xs">Links Clicked</span></div>
            <p className="text-2xl font-bold">{stats.emails_clicked || 0}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground"><Eye className="h-4 w-4" /><span className="text-xs">Website Visits</span></div>
            <p className="text-2xl font-bold">{stats.website_visits || 0}</p>
          </div>
        </div>
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 mb-2"><Clock className="h-4 w-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">Avg Session</span></div>
          <p className="text-lg font-semibold">{(stats.avg_session_duration || 0) > 0 ? `${Math.floor((stats.avg_session_duration || 0) / 60)} min` : "No data"}</p>
        </div>
        <div className="text-xs text-muted-foreground">
          <p>Documents viewed: {stats.documents_viewed || 0}</p>
          {stats.last_email_opened && <p className="mt-1">Last activity: {formatDistanceToNow(new Date(stats.last_email_opened), { addSuffix: true })}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementStats;
