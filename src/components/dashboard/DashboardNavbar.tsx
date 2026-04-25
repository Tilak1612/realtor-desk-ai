import { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, User, Settings, LogOut, Plus, Building2, Briefcase, CheckSquare, Camera, Loader2, Trash2, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FeedbackDialog from "@/components/feedback/FeedbackDialog";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { COMMUNITY_URL, isCommunityEnabled } from "@/lib/community";

interface DashboardNavbarProps {
  user: any;
  profile: any;
}

const DashboardNavbar = ({ user, profile }: DashboardNavbarProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url ?? null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const notificationCount = 0; // TODO: wire to real notifications

  useEffect(() => {
    setAvatarUrl(profile?.avatar_url ?? null);
  }, [profile?.avatar_url]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user?.id) return;

    if (!file.type.startsWith("image/")) {
      toast.error(t("nav.avatarInvalidType", "Please select an image file"));
      return;
    }

    const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_BYTES) {
      toast.error(t("nav.avatarTooLarge", "Image is too large — max 5 MB"));
      return;
    }

    setAvatarUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast.success(t("nav.avatarUpdated", "Profile photo updated"));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t("nav.avatarFailed", "Failed to upload photo"));
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleAvatarRemove = async () => {
    if (!user?.id) return;
    setAvatarUploading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: null, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (error) throw error;

      setAvatarUrl(null);
      toast.success(t("nav.avatarRemoved", "Profile photo removed"));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t("nav.avatarRemoveFailed", "Failed to remove photo"));
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success(t('nav.signedOut', 'Signed out successfully'));
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleQuickAdd = (type: string) => {
    switch (type) {
      case "contact":
        navigate("/contacts");
        break;
      case "property":
        navigate("/properties");
        break;
      case "deal":
        navigate("/deals");
        break;
      case "task":
        navigate("/tasks");
        break;
    }
  };

  return (
    // Dark navy header to match the sidebar (both at bg-primary). Ghost
    // buttons inside inherit text-white via the root `text-white` class —
    // the default shadcn ghost variant has no fixed text color, so it
    // inherits from its parent chain.
    <header className="sticky top-0 z-30 h-14 border-b border-white/10 bg-primary text-white">
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        {/* Spacer for mobile menu button */}
        <div className="w-12 lg:hidden" />
        
        {/* Search Bar — hidden until global search is wired up to a real backend.
            Previously accepted input but did nothing (just toasted the query).
            To re-enable: wire handleSearch to a Supabase query across contacts/
            properties/deals and render a results dropdown. */}
        <div className="flex-1" />

        {/* Right side actions */}
        <div className="flex items-center gap-1 sm:gap-2 ml-auto">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Feedback Button */}
          <FeedbackDialog />

          {/* Quick Add Button — inverted to pop on the navy header. */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                className="h-8 gap-1.5 text-sm bg-white text-primary hover:bg-white/90 font-semibold"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">{t('nav.add', 'Add')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => handleQuickAdd("contact")} className="cursor-pointer text-sm">
                <User className="mr-2 h-4 w-4" />
                {t('nav.addContact', 'Contact')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleQuickAdd("property")} className="cursor-pointer text-sm">
                <Building2 className="mr-2 h-4 w-4" />
                {t('nav.addProperty', 'Property')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleQuickAdd("deal")} className="cursor-pointer text-sm">
                <Briefcase className="mr-2 h-4 w-4" />
                {t('nav.addDeal', 'Deal')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleQuickAdd("task")} className="cursor-pointer text-sm">
                <CheckSquare className="mr-2 h-4 w-4" />
                {t('nav.addTask', 'Task')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-8 w-8"
                aria-label={t('a11y.notifications', 'Notifications')}
              >
                <Bell className="h-4 w-4" />
                {notificationCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel className="text-sm">{t('nav.notifications', 'Notifications')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-4 text-center">
                <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{t('nav.noNotifications', 'No new notifications')}</p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Hidden avatar file input — triggered from dropdown menu item */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full p-0"
                disabled={avatarUploading}
                aria-label={t('a11y.accountMenu', 'Account menu')}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatarUrl ?? undefined} />
                  {/* Fallback must pop against the navy header — bg-primary
                      here would render navy-on-navy. */}
                  <AvatarFallback className="bg-white/15 text-white text-xs">
                    {profile?.full_name ? getInitials(profile.full_name) : "U"}
                  </AvatarFallback>
                </Avatar>
                {avatarUploading && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-background/80">
                    <Loader2 className="h-3 w-3 animate-spin" />
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{profile?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer text-sm"
                disabled={avatarUploading}
              >
                <Camera className="mr-2 h-4 w-4" />
                {avatarUploading
                  ? t('nav.uploadingPhoto', 'Uploading...')
                  : avatarUrl
                    ? t('nav.changePhoto', 'Change photo')
                    : t('nav.uploadPhoto', 'Upload photo')}
              </DropdownMenuItem>
              {avatarUrl && (
                <DropdownMenuItem
                  onClick={handleAvatarRemove}
                  className="cursor-pointer text-sm"
                  disabled={avatarUploading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('nav.removePhoto', 'Remove photo')}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer text-sm">
                <User className="mr-2 h-4 w-4" />
                {t('nav.profile', 'Profile')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer text-sm">
                <Settings className="mr-2 h-4 w-4" />
                {t('nav.settings', 'Settings')}
              </DropdownMenuItem>
              {isCommunityEnabled() && (
                <DropdownMenuItem asChild className="cursor-pointer text-sm">
                  <a
                    href={COMMUNITY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {t('nav.community', 'Community')}
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-sm text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                {t('nav.signOut', 'Sign out')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
