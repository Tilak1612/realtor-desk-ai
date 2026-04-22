import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Plus, Send, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/dashboard/StatCard";

const Campaigns = () => {
  const { t } = useTranslation();
  const comingSoonMessage = t(
    "app.campaigns.comingSoon",
    "Email campaigns are coming soon — we'll let you know the moment they're live."
  );
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
            <h1 className="text-2xl md:text-3xl font-semibold">
              {t("app.campaigns.title", "Email campaigns")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t(
                "app.campaigns.subtitle",
                "Manage and track your email marketing campaigns"
              )}
            </p>
          </div>
          <Button size="sm" className="h-8 text-xs" onClick={() => toast.info(comingSoonMessage)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            {t("app.campaigns.newCampaign", "New campaign")}
          </Button>
        </div>

        {/* Stats — all zeros until campaigns are wired up */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title={t("app.campaigns.stats.total", "Total campaigns")}
            value={0}
            subtitle={t("app.campaigns.stats.startSending", "Start sending to see metrics")}
            icon={Mail}
          />
          <StatCard
            title={t("app.campaigns.stats.sent", "Emails sent")}
            value={0}
            subtitle={t("app.campaigns.stats.startSending", "Start sending to see metrics")}
            icon={Send}
          />
          <StatCard
            title={t("app.campaigns.stats.openRate", "Avg. open rate")}
            value="—"
            subtitle={t("app.campaigns.stats.requiresSent", "Requires sent campaigns")}
            icon={Users}
          />
          <StatCard
            title={t("app.campaigns.stats.clickRate", "Click rate")}
            value="—"
            subtitle={t("app.campaigns.stats.requiresSent", "Requires sent campaigns")}
            icon={TrendingUp}
          />
        </div>

        {/* Empty state */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">
              {t("app.campaigns.recent", "Recent campaigns")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-medium mb-1">
                {t("app.campaigns.empty.title", "No campaigns yet")}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mb-4">
                {t(
                  "app.campaigns.empty.body",
                  "Create your first email campaign to stay in touch with leads and clients."
                )}
              </p>
              <Button size="sm" className="h-8 text-xs" onClick={() => toast.info(comingSoonMessage)}>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                {t("app.campaigns.empty.cta", "Create your first campaign")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Campaigns;
