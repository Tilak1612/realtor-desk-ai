import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Password change for the Settings security section. 2FA already existed
// (MFASetup); this was the missing half — there was no way to change a
// password anywhere in the product.
//
// Reauthentication: supabase.auth.updateUser({ password }) works on the
// current session alone. To stop a walk-up attacker with an unlocked
// laptop from silently rotating the password, we verify the CURRENT
// password first via signInWithPassword. That call also refreshes the
// session, so the subsequent update runs on fresh credentials.
//
// OAuth-only accounts (Google) have no password to verify; Supabase
// reports the signup provider on the user object, and we hide this card
// for them rather than present a form that can only fail.

export function useHasPasswordAuth(): boolean | null {
  const [has, setHas] = useState<boolean | null>(null);
  useEffect(() => {
    let mounted = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      const identities = data.user?.identities ?? [];
      setHas(identities.some((i) => i.provider === "email"));
    });
    return () => { mounted = false; };
  }, []);
  return has;
}

export default function ChangePassword() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (next.length < 8) {
      setError(t("app.settings.password.tooShort", "New password must be at least 8 characters."));
      return;
    }
    if (next !== confirm) {
      setError(t("app.settings.password.mismatch", "New passwords don't match."));
      return;
    }
    if (next === current) {
      setError(t("app.settings.password.sameAsOld", "New password must be different from the current one."));
      return;
    }

    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const email = userData.user?.email;
      if (!email) throw new Error(t("app.settings.password.noSession", "You're not signed in."));

      // Verify the current password before allowing the change.
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email,
        password: current,
      });
      if (reauthError) {
        setError(t("app.settings.password.wrongCurrent", "Current password is incorrect."));
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: next });
      if (updateError) throw updateError;

      setCurrent(""); setNext(""); setConfirm("");
      toast({
        title: t("app.common.success", "Success"),
        description: t("app.settings.password.changed", "Your password has been changed."),
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pw-current">
          {t("app.settings.password.current", "Current password")}
        </Label>
        <Input
          id="pw-current"
          type="password"
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pw-new">
            {t("app.settings.password.new", "New password")}
          </Label>
          <Input
            id="pw-new"
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            required
            minLength={8}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pw-confirm">
            {t("app.settings.password.confirm", "Confirm new password")}
          </Label>
          <Input
            id="pw-confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" disabled={saving || !current || !next || !confirm}>
        {saving
          ? t("app.settings.password.saving", "Changing…")
          : t("app.settings.password.change", "Change password")}
      </Button>
    </form>
  );
}
