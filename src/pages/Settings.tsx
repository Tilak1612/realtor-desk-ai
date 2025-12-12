import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogOut, User, Bell, Lock, Palette, Download, Trash2, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Separator } from "@/components/ui/separator";
import LanguageSwitcher from "@/components/LanguageSwitcher";
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
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
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
    } catch (error: any) {
      toast({
        title: t('app.common.error'),
        description: error.message || t('app.notifications.errorOccurred'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // PIPEDA Compliance - Data Export
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
    } catch (error: any) {
      toast({
        title: t('app.common.error'),
        description: error.message || t('app.notifications.errorOccurred'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // PIPEDA Compliance - Account Deletion Request
  const handleDeleteAccount = () => {
    toast({
      title: t('app.common.info'),
      description: "Please contact support@realtordesk.ai to request account deletion. We'll process your request within 30 days as required by PIPEDA.",
    });
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col lg:ml-0">
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">{t('app.settings.title')}</h1>
            <p className="text-muted-foreground mb-6">
              {t('app.settings.account')}
            </p>

            <div className="space-y-6">
              {/* Language Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    {t('app.settings.language')}
                  </CardTitle>
                  <CardDescription>
                    {t('canadian.bilingual')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{t('app.settings.language')}</h3>
                      <p className="text-sm text-muted-foreground">
                        English / Français
                      </p>
                    </div>
                    <LanguageSwitcher />
                  </div>
                </CardContent>
              </Card>

              {/* Canadian Real Estate Profile */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🇨🇦 {t('app.settings.profile')}
                  </CardTitle>
                  <CardDescription>
                    {t('app.settings.province')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">{t('app.settings.province')}</label>
                      <select className="w-full p-2 border rounded-md bg-background">
                        <option value="">{t('app.settings.province')}</option>
                        <option value="ON">Ontario (ON)</option>
                        <option value="BC">British Columbia (BC)</option>
                        <option value="AB">Alberta (AB)</option>
                        <option value="QC">Quebec (QC)</option>
                        <option value="MB">Manitoba (MB)</option>
                        <option value="SK">Saskatchewan (SK)</option>
                        <option value="NS">Nova Scotia (NS)</option>
                        <option value="NB">New Brunswick (NB)</option>
                        <option value="NL">Newfoundland & Labrador (NL)</option>
                        <option value="PE">Prince Edward Island (PE)</option>
                        <option value="NT">Northwest Territories (NT)</option>
                        <option value="YT">Yukon (YT)</option>
                        <option value="NU">Nunavut (NU)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">{t('app.settings.timezone')}</label>
                      <select className="w-full p-2 border rounded-md bg-background">
                        <option value="America/Toronto">Eastern (EST/EDT)</option>
                        <option value="America/Halifax">Atlantic (AST/ADT)</option>
                        <option value="America/St_Johns">Newfoundland (NST/NDT)</option>
                        <option value="America/Winnipeg">Central (CST/CDT)</option>
                        <option value="America/Edmonton">Mountain (MST/MDT)</option>
                        <option value="America/Vancouver">Pacific (PST/PDT)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">{t('app.settings.licenseNumber')}</label>
                    <select className="w-full p-2 border rounded-md bg-background">
                      <option value="">{t('app.settings.licenseNumber')}</option>
                      <option value="RECO">RECO - Ontario</option>
                      <option value="BCFSA">BCFSA - British Columbia</option>
                      <option value="RECA">RECA - Alberta</option>
                      <option value="OACIQ">OACIQ - Quebec</option>
                      <option value="MRAC">MRAC - Manitoba</option>
                      <option value="SREC">SREC - Saskatchewan</option>
                      <option value="NSREC">NSREC - Nova Scotia</option>
                      <option value="RECNB">RECNB - New Brunswick</option>
                    </select>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm">
                      <strong>Note:</strong> {t('canadian.crea')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Account Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {t('app.settings.account')}
                  </CardTitle>
                  <CardDescription>
                    {t('app.settings.account')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{t('app.auth.signOut')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('app.auth.signOut')}
                      </p>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={handleLogout}
                      disabled={loading}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {loading ? t('app.common.loading') : t('app.auth.signOut')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    {t('app.settings.notifications')}
                  </CardTitle>
                  <CardDescription>
                    {t('app.settings.notifications')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t('app.common.loading')}
                  </p>
                </CardContent>
              </Card>

              {/* PIPEDA Compliance - Data Rights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    {t('app.settings.security')} (PIPEDA)
                  </CardTitle>
                  <CardDescription>
                    {t('canadian.compliant')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{t('app.common.export')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('app.common.export')}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleExportData}
                      disabled={loading}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {t('app.common.export')}
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{t('app.common.delete')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('app.common.delete')}
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={loading}>
                          <Trash2 className="w-4 h-4 mr-2" />
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
                    <p className="text-sm">
                      <strong>{t('app.settings.security')}:</strong> PIPEDA
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy & Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    {t('app.settings.security')}
                  </CardTitle>
                  <CardDescription>
                    {t('app.settings.security')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t('app.common.loading')}
                  </p>
                </CardContent>
              </Card>

              {/* Appearance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    {t('app.settings.profile')}
                  </CardTitle>
                  <CardDescription>
                    {t('app.settings.profile')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t('app.common.loading')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
