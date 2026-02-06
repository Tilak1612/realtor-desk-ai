import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogOut, User, Bell, Lock, Globe, Crown, CreditCard, Download, Trash2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/components/layout/AppLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<unknown>(null);
  const [profile, setProfile] = useState<unknown>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { subscribed, trialDaysLeft, trialExpired, subscriptionTier, trialEndsAt, subscriptionEnd } = useSubscription();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setUserId(user.id);
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(profileData);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: t('app.common.success'),
        description: t('app.auth.signOut'),
      });
      
      navigate("/login");
    } catch (error: unknown) {
      toast({
        title: t('app.common.error'),
        description: error.message || t('app.notifications.errorOccurred'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      const { data: contacts } = await supabase
        .from("contacts")
        .select("*")
        .eq("user_id", userId);

      const { data: deals } = await supabase
        .from("deals")
        .select("*")
        .eq("user_id", userId);

      const exportData = {
        profile,
        contacts,
        deals,
        exportDate: new Date().toISOString(),
        notice: "This data export complies with PIPEDA regulations"
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `realtordesk-data-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();

      toast({
        title: t('app.common.success'),
        description: t('app.common.export'),
      });
    } catch (error: unknown) {
      toast({
        title: t('app.common.error'),
        description: error.message || t('app.notifications.errorOccurred'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    toast({
      title: t('app.common.info'),
      description: "Please contact support@realtordesk.ai to request account deletion. We'll process your request within 30 days as required by PIPEDA.",
    });
  };

  return (
    <AppLayout user={user} profile={profile}>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold mb-1">{t('app.settings.title')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('app.settings.account')}
          </p>
        </div>

        <div className="space-y-6">
          {/* Subscription Status Section */}
          <Card className={subscribed ? "border-accent/30 bg-accent/5" : trialExpired ? "border-destructive/30 bg-destructive/5" : "border-primary/30 bg-primary/5"}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Crown className="w-4 h-4" />
                {t('trial.status.title', 'Subscription Status')}
              </CardTitle>
              <CardDescription className="text-xs">
                {subscribed 
                  ? t('trial.status.subscribed', 'Active Subscription')
                  : trialExpired 
                    ? t('trial.status.trialExpired', 'Trial Expired')
                    : t('trial.status.trialActive', 'Trial Active')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {subscribed ? (
                    <>
                      <Badge variant="default" className="bg-accent text-accent-foreground text-xs">
                        {subscriptionTier === 'agent' ? 'Agent Plan' : subscriptionTier === 'team' ? 'Team Plan' : 'Subscribed'}
                      </Badge>
                      {subscriptionEnd && (
                        <p className="text-xs text-muted-foreground">
                          Ends on {new Date(subscriptionEnd).toLocaleDateString()}
                        </p>
                      )}
                    </>
                  ) : trialExpired ? (
                    <>
                      <Badge variant="destructive" className="text-xs">
                        {t('trial.status.trialExpired', 'Trial Expired')}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {t('trial.expired.description', 'Subscribe now to continue using Realtor Desk')}
                      </p>
                    </>
                  ) : (
                    <>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                        {trialDaysLeft} days left in trial
                      </Badge>
                      {trialEndsAt && (
                        <p className="text-xs text-muted-foreground">
                          Ends on {new Date(trialEndsAt).toLocaleDateString()}
                        </p>
                      )}
                    </>
                  )}
                </div>
                <Link to="/billing">
                  <Button variant={subscribed ? "outline" : "default"} size="sm" className="h-8 text-xs">
                    <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                    {subscribed ? t('app.billing.manageBilling', 'Manage Billing') : t('trial.upgradeNow', 'Upgrade Now')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {t('app.settings.language')}
              </CardTitle>
              <CardDescription className="text-xs">
                {t('canadian.bilingual')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">{t('app.settings.language')}</h3>
                  <p className="text-xs text-muted-foreground">
                    English / Français
                  </p>
                </div>
                <LanguageSwitcher />
              </div>
            </CardContent>
          </Card>

          {/* Account Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                {t('app.settings.account')}
              </CardTitle>
              <CardDescription className="text-xs">
                {t('app.settings.account')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">{t('app.auth.signOut')}</h3>
                  <p className="text-xs text-muted-foreground">
                    {t('app.auth.signOut')}
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                  disabled={loading}
                  size="sm"
                  className="h-8 text-xs"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1.5" />
                  {loading ? t('app.common.loading') : t('app.auth.signOut')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Bell className="w-4 h-4" />
                {t('app.settings.notifications')}
              </CardTitle>
              <CardDescription className="text-xs">
                {t('app.settings.notifications')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {t('app.common.loading')}
              </p>
            </CardContent>
          </Card>

          {/* PIPEDA Compliance - Data Rights */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {t('app.settings.security')} (PIPEDA)
              </CardTitle>
              <CardDescription className="text-xs">
                {t('canadian.compliant')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">{t('app.common.export')}</h3>
                  <p className="text-xs text-muted-foreground">
                    {t('app.common.export')}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleExportData}
                  disabled={loading}
                  size="sm"
                  className="h-8 text-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  {t('app.common.export')}
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">{t('app.common.delete')}</h3>
                  <p className="text-xs text-muted-foreground">
                    {t('app.common.delete')}
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={loading} size="sm" className="h-8 text-xs">
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      {t('app.common.delete')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('app.common.confirm')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('app.common.confirm')} PIPEDA
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('app.common.cancel')}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {t('app.common.delete')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-xs">
                  <strong>{t('app.settings.security')}:</strong> PIPEDA
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {t('app.settings.security')}
              </CardTitle>
              <CardDescription className="text-xs">
                {t('app.settings.security')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {t('app.common.loading')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
