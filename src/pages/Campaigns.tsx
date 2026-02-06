import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Plus, Send, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/dashboard/StatCard";

const Campaigns = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<unknown>(null);
  const [profile, setProfile] = useState<unknown>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUser(session.user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      setProfile(profileData);
    };

    checkAuth();
  }, [navigate]);

  const campaigns = [
    {
      id: 1,
      name: "Spring Market Update",
      status: "active",
      sent: 245,
      opened: 189,
      clicked: 67,
      openRate: 77,
    },
    {
      id: 2,
      name: "New Listing Alert",
      status: "scheduled",
      sent: 0,
      opened: 0,
      clicked: 0,
      openRate: 0,
    },
    {
      id: 3,
      name: "Holiday Greetings",
      status: "draft",
      sent: 0,
      opened: 0,
      clicked: 0,
      openRate: 0,
    },
  ];

  if (!user || !profile) {
    return (
      <AppLayout user={user} profile={profile}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user} profile={profile}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Email Campaigns</h1>
            <p className="text-sm text-muted-foreground">
              Manage and track your email marketing campaigns
            </p>
          </div>
          <Button size="sm" className="h-8 text-xs">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New Campaign
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Total Campaigns"
            value={12}
            subtitle="+2 from last month"
            icon={Mail}
            trend="up"
            change={20}
          />
          <StatCard
            title="Emails Sent"
            value="1,284"
            subtitle="+18% from last month"
            icon={Send}
            trend="up"
            change={18}
          />
          <StatCard
            title="Avg. Open Rate"
            value="68%"
            subtitle="+5% from last month"
            icon={Users}
            trend="up"
            change={5}
          />
          <StatCard
            title="Click Rate"
            value="24%"
            subtitle="+3% from last month"
            icon={TrendingUp}
            trend="up"
            change={3}
          />
        </div>

        {/* Campaigns List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Recent Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium">{campaign.name}</h3>
                      <Badge
                        variant={
                          campaign.status === "active"
                            ? "default"
                            : campaign.status === "scheduled"
                            ? "secondary"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Sent: {campaign.sent}</span>
                      <span>Opened: {campaign.opened}</span>
                      <span>Clicked: {campaign.clicked}</span>
                      {campaign.openRate > 0 && (
                        <span className="text-green-600 font-medium">
                          {campaign.openRate}% open rate
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Campaigns;
