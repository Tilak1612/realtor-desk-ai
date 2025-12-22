import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Flame, ChevronRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Lead {
  id: string;
  name: string;
  email?: string;
  ai_score?: number;
  insight?: string;
}

interface HotLeadsWidgetProps {
  leads: Lead[];
}

const HotLeadsWidget = ({ leads }: HotLeadsWidgetProps) => {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-status-hot";
    if (score >= 80) return "text-warning";
    return "text-primary";
  };

  if (leads.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Flame className="h-4 w-4 text-status-hot" />
            Hot Leads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-8 text-center bg-accent/30 rounded-lg border border-dashed border-border">
            <Users className="w-6 h-6 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-3">No hot leads yet</p>
            <Button size="sm" onClick={() => navigate("/contacts")}>Add Contact</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Flame className="h-4 w-4 text-status-hot" />
          Hot Leads
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-sm h-8" onClick={() => navigate("/contacts")}>
          View all <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leads.slice(0, 5).map((lead) => (
            <div
              key={lead.id}
              className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/contacts/${lead.id}`)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {getInitials(lead.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">{lead.insight || lead.email}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-lg font-semibold ${getScoreColor(lead.ai_score || 0)}`}>
                  {lead.ai_score || 0}
                </span>
                <p className="text-xs text-muted-foreground">Score</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HotLeadsWidget;
