import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogOut, User, Bell, Lock, Globe, Crown, CreditCard, Download, Trash2, Shield, Upload } from "lucide-react";
import MFASetup from "@/components/settings/MFASetup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/components/layout/AppLayout";

// Canonical DB value is the English name (so existing records don't
// need a migration); the FR label is a locale-scoped lookup. Official
// federally-recognized French names per the TBS Canadian Style Guide.
const CANADIAN_PROVINCES = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick",
  "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia",
  "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"
];

const PROVINCE_FR: Record<string, string> = {
  Alberta: "Alberta",
  "British Columbia": "Colombie-Britannique",
  Manitoba: "Manitoba",
  "New Brunswick": "Nouveau-Brunswick",
  "Newfoundland and Labrador": "Terre-Neuve-et-Labrador",
  "Northwest Territories": "Territoires du Nord-Ouest",
  "Nova Scotia": "Nouvelle-Écosse",
  Nunavut: "Nunavut",
  Ontario: "Ontario",
  "Prince Edward Island": "Île-du-Prince-Édouard",
  Quebec: "Québec",
  Saskatchewan: "Saskatchewan",
  Yukon: "Yukon",
};

const MAJOR_CITIES = [
  "Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa",
  "Winnipeg", "Quebec City", "Hamilton", "Kitchener", "London", "Victoria",
  "Halifax", "Oshawa", "Windsor", "Saskatoon", "Regina", "St. John's"
];

interface ProfileFormState {
  full_name: string;
  company_name: string;
  license_number: string;
  phone: string;
  province: string;
  city: string;
  primary_language: string;
  avatar_url: string;
}

const EMPTY_PROFILE_FORM: ProfileFormState = {
  full_name: "",
  company_name: "",
  license_number: "",
  phone: "",
  province: "",
  city: "",
  primary_language: "english",
  avatar_url: "",
};
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
  const { t, i18n } = useTranslation();
  const isFr = (i18n.language || "en").toLowerCase().startsWith("fr");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [user, setUser] = useState<unknown>(null);
  const [profile, setProfile] = useState<unknown>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileFormState>(EMPTY_PROFILE_FORM);
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

        if (profileData) {
          setProfileForm({
            full_name: profileData.full_name ?? "",
            company_name: profileData.company_name ?? "",
            license_number: profileData.license_number ?? "",
            phone: profileData.phone ?? "",
            province: profileData.province ?? "",
            city: profileData.city ?? "",
            primary_language: profileData.primary_language ?? "english",
            avatar_url: profileData.avatar_url ?? "",
          });
        }

        // Check MFA status
        const { data: factors } = await supabase.auth.mfa.listFactors();
        setMfaEnabled((factors?.totp?.length ?? 0) > 0);
      }
    };
    fetchData();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setAvatarUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      setProfileForm((prev) => ({ ...prev, avatar_url: publicUrl }));
      toast({
        title: t("app.common.success"),
        description: t("onboarding.profile.avatarUploaded", "Avatar uploaded!"),
      });
    } catch (error: unknown) {
      toast({
        title: t("app.common.error"),
        description: error instanceof Error ? error.message : t("onboarding.profile.avatarFailed", "Failed to upload avatar"),
        variant: "destructive",
      });
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setProfileSaving(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          full_name: profileForm.full_name,
          company_name: profileForm.company_name,
          license_number: profileForm.license_number,
          phone: profileForm.phone,
          province: profileForm.province,
          city: profileForm.city,
          primary_language: profileForm.primary_language,
          avatar_url: profileForm.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      toast({
        title: t("app.common.success"),
        description: t("app.settings.profileUpdated", "Profile updated"),
      });
    } catch (error: unknown) {
      toast({
        title: t("app.common.error"),
        description: error instanceof Error ? error.message : t("app.notifications.errorOccurred"),
        variant: "destructive",
      });
    } finally {
      setProfileSaving(false);
    }
  };

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
          {/* Profile Section */}
          <Card id="profile">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                {t("app.settings.profile", "Profile")}
              </CardTitle>
              <CardDescription className="text-xs">
                {t("app.settings.profileDesc", "Update your name, brokerage, and contact details")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {profileForm.avatar_url ? (
                        <img src={profileForm.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={avatarUploading}
                      aria-label={t("onboarding.profile.uploadPhoto", "Upload photo")}
                    />
                    {avatarUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full text-xs">
                        {t("app.common.uploading", "Uploading...")}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("app.settings.avatarHint", "Click the avatar to upload a new photo")}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">{t("onboarding.profile.fullName", "Full Name")}</Label>
                    <Input
                      id="full_name"
                      value={profileForm.full_name}
                      onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company_name">{t("onboarding.profile.companyName", "Company/Brokerage Name")}</Label>
                    <Input
                      id="company_name"
                      value={profileForm.company_name}
                      onChange={(e) => setProfileForm({ ...profileForm, company_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="license_number">{t("onboarding.profile.licenseNumber", "Real Estate License Number")}</Label>
                    <Input
                      id="license_number"
                      value={profileForm.license_number}
                      onChange={(e) => setProfileForm({ ...profileForm, license_number: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("app.settings.phone", "Phone")}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="province">{t("onboarding.profile.province", "Province")}</Label>
                    <Select
                      value={profileForm.province}
                      onValueChange={(value) => setProfileForm({ ...profileForm, province: value })}
                    >
                      <SelectTrigger id="province">
                        <SelectValue placeholder={t("app.settings.selectProvince", "Select province")} />
                      </SelectTrigger>
                      <SelectContent>
                        {CANADIAN_PROVINCES.map((prov) => (
                          <SelectItem key={prov} value={prov}>
                            {isFr ? PROVINCE_FR[prov] ?? prov : prov}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">{t("onboarding.profile.city", "City")}</Label>
                    <Select
                      value={profileForm.city}
                      onValueChange={(value) => setProfileForm({ ...profileForm, city: value })}
                    >
                      <SelectTrigger id="city">
                        <SelectValue placeholder={t("app.settings.selectCity", "Select city")} />
                      </SelectTrigger>
                      <SelectContent>
                        {MAJOR_CITIES.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>{t("onboarding.profile.primaryLanguage", "Primary Language")}</Label>
                  <RadioGroup
                    value={profileForm.primary_language}
                    onValueChange={(value) => setProfileForm({ ...profileForm, primary_language: value })}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="english" id="lang-english" />
                      <Label htmlFor="lang-english" className="cursor-pointer font-normal">English</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="french" id="lang-french" />
                      <Label htmlFor="lang-french" className="cursor-pointer font-normal">French</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id="lang-both" />
                      <Label htmlFor="lang-both" className="cursor-pointer font-normal">Both (Bilingual)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={profileSaving || avatarUploading}>
                    {profileSaving ? t("app.common.saving", "Saving...") : t("app.common.save", "Save")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

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
                {t('app.settings.notifications.label', 'Notifications')}
              </CardTitle>
              <CardDescription className="text-xs">
                {t('app.settings.notifications.desc', 'Manage your email and push notification preferences')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">{t('app.settings.notifications.email', 'Email notifications')}</h3>
                  <p className="text-xs text-muted-foreground">{t('app.settings.notifications.emailDesc', 'Receive email alerts for new leads and deal updates')}</p>
                </div>
                <Badge variant="secondary" className="text-xs">{t('app.settings.notifications.comingSoon', 'Coming Soon')}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">{t('app.settings.notifications.sms', 'SMS notifications')}</h3>
                  <p className="text-xs text-muted-foreground">{t('app.settings.notifications.smsDesc', 'Get text alerts for urgent follow-ups')}</p>
                </div>
                <Badge variant="secondary" className="text-xs">{t('app.settings.notifications.comingSoon', 'Coming Soon')}</Badge>
              </div>
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
                  <h3 className="text-sm font-medium">
                    {t("app.settings.dataRights.exportTitle", "Export my data")}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {t(
                      "app.settings.dataRights.exportDesc",
                      "Download everything we store about you as a JSON file (PIPEDA access right)."
                    )}
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
                  <h3 className="text-sm font-medium">
                    {t("app.settings.dataRights.deleteTitle", "Delete my account")}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {t(
                      "app.settings.dataRights.deleteDesc",
                      "Erase your profile and all associated data (PIPEDA right to erasure). Processed within 30 days."
                    )}
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
                      <AlertDialogTitle>
                        {t("app.settings.dataRights.confirmTitle", "Delete your account?")}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {t(
                          "app.settings.dataRights.confirmBody",
                          "This is a PIPEDA right-to-erasure request. We'll confirm by email and fully erase your data within 30 days. Undo is not available once processed."
                        )}
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

          {/* Privacy & Security — 2FA */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {t("app.settings.twoFactor.title", "Two-Factor Authentication (2FA)")}
              </CardTitle>
              <CardDescription className="text-xs">
                {t("app.settings.twoFactor.subtitle", "Protect your account with two-factor authentication")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MFASetup
                mfaEnabled={mfaEnabled}
                onStatusChange={async () => {
                  const { data: factors } = await supabase.auth.mfa.listFactors();
                  setMfaEnabled((factors?.totp?.length ?? 0) > 0);
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
