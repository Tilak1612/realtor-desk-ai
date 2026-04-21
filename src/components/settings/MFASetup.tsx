import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Shield, ShieldCheck, ShieldOff, Loader2 } from "lucide-react";
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

interface MFASetupProps {
  mfaEnabled: boolean;
  onStatusChange: () => void;
}

const MFASetup = ({ mfaEnabled, onStatusChange }: MFASetupProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [enrolling, setEnrolling] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    setEnrolling(true);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "RealtorDesk AI",
      });

      if (error) throw error;

      setQrCode(data.totp.qr_code);
      setFactorId(data.id);
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : t("app.settings.twoFactor.enrollFailed", "Failed to start MFA enrollment");
      toast({ title: t("common.error", "Error"), description: msg, variant: "destructive" });
      setEnrolling(false);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!factorId || verifyCode.length !== 6) return;
    setLoading(true);
    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: verifyCode,
      });

      if (verifyError) throw verifyError;

      toast({
        title: t("app.settings.twoFactor.enabledToastTitle", "2FA Enabled"),
        description: t(
          "app.settings.twoFactor.enabledToastDesc",
          "Two-factor authentication is now active on your account."
        ),
      });
      setEnrolling(false);
      setQrCode(null);
      setFactorId(null);
      setVerifyCode("");
      onStatusChange();
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : t("app.settings.twoFactor.verifyFailed", "Verification failed");
      toast({ title: t("common.error", "Error"), description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async () => {
    setLoading(true);
    try {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totpFactor = factors?.totp?.[0];

      if (!totpFactor) {
        toast({
          title: t("app.settings.twoFactor.noFactor", "No 2FA factor found"),
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.auth.mfa.unenroll({ factorId: totpFactor.id });
      if (error) throw error;

      toast({
        title: t("app.settings.twoFactor.disabledToastTitle", "2FA Disabled"),
        description: t(
          "app.settings.twoFactor.disabledToastDesc",
          "Two-factor authentication has been removed."
        ),
      });
      onStatusChange();
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : t("app.settings.twoFactor.disableFailed", "Failed to disable 2FA");
      toast({ title: t("common.error", "Error"), description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (enrolling && qrCode) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Shield className="w-4 h-4 text-primary" />
          {t("app.settings.twoFactor.setupHeading", "Set up Two-Factor Authentication")}
        </div>
        <p className="text-xs text-muted-foreground">
          {t(
            "app.settings.twoFactor.setupHelp",
            "Scan this QR code with your authenticator app (Google Authenticator, Authy, or 1Password), then enter the 6-digit code below."
          )}
        </p>
        <div className="flex justify-center p-4 bg-white rounded-lg">
          <img src={qrCode} alt={t("app.settings.twoFactor.qrAlt", "TOTP QR Code")} className="w-48 h-48" />
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="000000"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            className="font-mono text-center text-lg tracking-widest"
          />
          <Button onClick={handleVerify} disabled={loading || verifyCode.length !== 6} size="sm">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              t("app.settings.twoFactor.verify", "Verify")
            )}
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setEnrolling(false);
            setQrCode(null);
          }}
        >
          {t("common.cancel", "Cancel")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium flex items-center gap-2">
          {mfaEnabled ? (
            <ShieldCheck className="w-4 h-4 text-green-600" />
          ) : (
            <ShieldOff className="w-4 h-4 text-muted-foreground" />
          )}
          {t("app.settings.twoFactor.title", "Two-Factor Authentication (2FA)")}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {mfaEnabled
            ? t(
                "app.settings.twoFactor.activeBody",
                "Your account is protected with TOTP-based 2FA."
              )
            : t(
                "app.settings.twoFactor.inactiveBody",
                "Add an extra layer of security with an authenticator app."
              )}
        </p>
      </div>
      {mfaEnabled ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs" disabled={loading}>
              {t("app.settings.twoFactor.disable", "Disable 2FA")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t(
                  "app.settings.twoFactor.disableConfirmTitle",
                  "Disable Two-Factor Authentication?"
                )}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t(
                  "app.settings.twoFactor.disableConfirmBody",
                  "This will make your account less secure. You can re-enable it at any time."
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("common.cancel", "Cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleUnenroll}
                className="bg-destructive text-destructive-foreground"
              >
                {t("app.settings.twoFactor.disable", "Disable 2FA")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Button onClick={handleEnroll} size="sm" className="h-8 text-xs" disabled={loading}>
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
          ) : (
            <Shield className="w-3.5 h-3.5 mr-1.5" />
          )}
          {t("app.settings.twoFactor.enable", "Enable 2FA")}
        </Button>
      )}
    </div>
  );
};

export default MFASetup;
