import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { useTranslation } from "react-i18next";

const CANADIAN_PROVINCES = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick",
  "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia",
  "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"
];

const MAJOR_CITIES = [
  "Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa",
  "Winnipeg", "Quebec City", "Hamilton", "Kitchener", "London", "Victoria",
  "Halifax", "Oshawa", "Windsor", "Saskatoon", "Regina", "St. John's"
];

interface ProfileSetupProps {
  profileData: any;
  onNext: (data: any) => Promise<void>;
  onSkip: () => void;
  userId: string | null;
}

const ProfileSetup = ({ profileData, onNext, onSkip, userId }: ProfileSetupProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    avatar_url: profileData.avatar_url || "",
    full_name: profileData.full_name || "",
    company_name: profileData.company_name || "",
    license_number: profileData.license_number || "",
    city: profileData.city || "",
    province: profileData.province || "",
    primary_language: profileData.primary_language || "english",
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setFormData({ ...formData, avatar_url: publicUrl });
      toast.success(t('onboarding.profile.avatarUploaded', 'Avatar uploaded!'));
    } catch (error: unknown) {
      toast.error(t('onboarding.profile.avatarFailed', 'Failed to upload avatar'));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onNext(formData);
    } catch {
      toast.error(t('onboarding.profile.saveFailed', 'Failed to save profile'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">{t('onboarding.profile.title', "Let's Set Up Your Profile")}</h2>
        <p className="text-muted-foreground">{t('onboarding.profile.subtitle', 'Tell us about yourself to personalize your experience')}</p>
      </div>

      {/* Avatar Upload */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {formData.avatar_url ? (
              <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <Upload className="w-12 h-12 text-primary" />
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={uploading}
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
              <span className="text-sm">Uploading...</span>
            </div>
          )}
        </div>
      </div>
      <p className="text-center text-sm text-muted-foreground -mt-4">
        Click to upload your photo (optional)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">{t('onboarding.profile.fullName', 'Full Name')} *</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company_name">{t('onboarding.profile.companyName', 'Company/Brokerage Name')} *</Label>
          <Input
            id="company_name"
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="license_number">{t('onboarding.profile.licenseNumber', 'Real Estate License Number')}</Label>
          <Input
            id="license_number"
            value={formData.license_number}
            onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="province">{t('onboarding.profile.province', 'Province')} *</Label>
          <Select value={formData.province} onValueChange={(value) => setFormData({ ...formData, province: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select province" />
            </SelectTrigger>
            <SelectContent>
              {CANADIAN_PROVINCES.map((prov) => (
                <SelectItem key={prov} value={prov}>{prov}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="city">{t('onboarding.profile.city', 'City')} *</Label>
          <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
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
        <Label>{t('onboarding.profile.primaryLanguage', 'Primary Language')} *</Label>
        <RadioGroup value={formData.primary_language} onValueChange={(value) => setFormData({ ...formData, primary_language: value })}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="english" id="english" />
            <Label htmlFor="english" className="cursor-pointer">English</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="french" id="french" />
            <Label htmlFor="french" className="cursor-pointer">French</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="both" />
            <Label htmlFor="both" className="cursor-pointer">Both (Bilingual)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? t('app.common.saving', 'Saving...') : t('app.common.continue', 'Continue')}
        </Button>
        <Button type="button" variant="ghost" onClick={onSkip}>
          {t('app.common.skip', 'Skip for now')}
        </Button>
      </div>
    </form>
  );
};

export default ProfileSetup;
