import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Flame, Mail, Phone, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Lead {
  id: string;
  name: string;
  email: string;
  ai_score: number;
  insight: string;
  best_contact_time?: string;
  avatar_url?: string;
}

interface HotLeadsWidgetProps {
  leads: Lead[];
}

const HotLeadsWidget = ({ leads }: HotLeadsWidgetProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (leads.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-heading-3">
            <Flame className="w-4 h-4 text-orange-500" />
            Hot Leads (AI Scored 80+)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-body-sm text-muted-foreground mb-3">No hot leads yet</p>
            <Link to="/contacts">
              <Button size="sm" className="text-body-sm">Add Contacts</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-heading-3">
          <Flame className="w-4 h-4 text-orange-500" />
          Hot Leads (AI Scored 80+)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={lead.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-primary text-meta">
                {getInitials(lead.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-body-sm font-medium truncate">{lead.name}</p>
                  <p className="text-meta text-muted-foreground truncate">{lead.email}</p>
                </div>
                <Badge className={`${getScoreColor(lead.ai_score)} text-white text-meta shrink-0`}>
                  {lead.ai_score}
                </Badge>
              </div>
              <p className="text-meta text-muted-foreground line-clamp-1">{lead.insight}</p>
              {lead.best_contact_time && (
                <p className="text-meta text-muted-foreground">
                  Best time: {lead.best_contact_time}
                </p>
              )}
              <div className="flex gap-1.5 flex-wrap">
                <Button size="sm" variant="outline" className="h-6 text-meta px-2">
                  <Phone className="w-3 h-3 mr-1" />
                  Call
                </Button>
                <Button size="sm" variant="outline" className="h-6 text-meta px-2">
                  <Mail className="w-3 h-3 mr-1" />
                  Email
                </Button>
                <Button size="sm" variant="outline" className="h-6 text-meta px-2">
                  <Calendar className="w-3 h-3 mr-1" />
                  Schedule
                </Button>
              </div>
            </div>
          </div>
        ))}
        <Link to="/contacts" className="block">
          <Button variant="ghost" size="sm" className="w-full h-7 text-meta">
            View All Leads
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default HotLeadsWidget;
