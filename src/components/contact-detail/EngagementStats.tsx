import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mail, MousePointer, Eye, Clock } from "lucide-react";

interface EngagementStatsProps {
  contactId: string;
}

const EngagementStats = ({ contactId }: EngagementStatsProps) => {
  // Mock data (would come from analytics in production)
  const stats = {
    emailsSent: 12,
    emailsOpened: 9,
    linksClicked: 5,
    websiteVisits: 8,
    documentsViewed: 3,
    avgResponseTime: "2.5 hours",
  };

  const openRate = Math.round((stats.emailsOpened / stats.emailsSent) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Engagement Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="text-xs">Emails Sent</span>
            </div>
            <p className="text-2xl font-bold">{stats.emailsSent}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span className="text-xs">Opened</span>
            </div>
            <p className="text-2xl font-bold">{stats.emailsOpened}</p>
            <Progress value={openRate} className="h-1" />
            <span className="text-xs text-muted-foreground">{openRate}%</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MousePointer className="h-4 w-4" />
              <span className="text-xs">Links Clicked</span>
            </div>
            <p className="text-2xl font-bold">{stats.linksClicked}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span className="text-xs">Website Visits</span>
            </div>
            <p className="text-2xl font-bold">{stats.websiteVisits}</p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Avg Response Time</span>
          </div>
          <p className="text-lg font-semibold">{stats.avgResponseTime}</p>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Documents viewed: {stats.documentsViewed}</p>
          <p className="mt-1">Last visit: 2 days ago</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementStats;
