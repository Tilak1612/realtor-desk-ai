import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Download, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { signOutIntentionally } from "@/lib/auth/signOut";
import {
  ACCOUNT_SUPPORT_EMAIL,
  clearLocalSession,
  requestAccountDeletion,
  type DeleteAccountFailure,
} from "@/lib/account/deleteAccount";
import { clearNativeExports } from "@/lib/account/exportFile";
// Importing this module also registers the `accountDeletion` strings (EN + FR).
import { accountDeletionEn as en } from "@/i18n/accountDeletion";

// "Delete my account", for real.
//
// This replaces a dialog whose confirm button showed a toast asking the person
// to email support: nothing was recorded, nothing was deleted, and the copy
// promised an email confirmation that nothing sent. Both app stores require
// that deletion can be started in the app and actually happens (Apple guideline
// 5.1.1(v), Google Play's account deletion requirement), and the website needs
// the same thing for the same reason, so this is one component for web and app.
//
// The copy describes supabase/functions/delete-account and nothing more. It is
// in src/i18n/accountDeletion.ts next to the list of what each sentence rests on.
//
// Every t() call passes the English string from that module as its default. The
// strings are registered at import, so the default is never what renders; it is
// there because src/i18n/__tests__/resolution.test.ts (rightly) refuses a key
// that would show as raw text if its bundle were ever missing.

interface DeleteAccountDialogProps {
  /**
   * profiles.is_demo. The shared demo / reviewer account must not be deletable:
   * an app reviewer pressing the button would take it away from everyone else.
   * The server refuses it as well; this only saves them the round trip.
   */
  isDemo: boolean;
  /** Parent is busy (still loading the user, or exporting). */
  disabled?: boolean;
  /** Runs the existing data export, offered inside the dialog before deleting. */
  onExport?: () => void;
}

const DELETED_ITEMS = ["profile", "contacts", "work", "files", "connections"] as const;
const KEPT_ITEMS = ["suppression", "billing", "backups"] as const;

const DeleteAccountDialog = ({ isDemo, disabled = false, onExport }: DeleteAccountDialogProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const demoNoteId = useId();
  const confirmInputId = useId();

  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [failure, setFailure] = useState<DeleteAccountFailure | null>(null);

  // The word is translated (DELETE / SUPPRIMER); the phrase sent to the server
  // is not. Case and stray spaces are forgiven because a phone keyboard
  // capitalises only the first letter and adds a space after a suggestion.
  const confirmWord = t("accountDeletion.dialog.confirmWord", en.dialog.confirmWord);
  const confirmed = typed.trim().toLocaleUpperCase() === confirmWord.toLocaleUpperCase();

  const handleOpenChange = (next: boolean) => {
    // Escape or a tap outside must not dismiss the dialog mid-request: the
    // deletion would carry on with nothing on screen to say how it ended.
    if (deleting) return;
    setOpen(next);
    if (!next) {
      setTyped("");
      setFailure(null);
    }
  };

  const handleDelete = async () => {
    if (!confirmed || deleting || isDemo) return;
    setDeleting(true);
    setFailure(null);

    const result = await requestAccountDeletion();
    if (!result.ok) {
      // The typed word is kept, so "Try again" is one press.
      setFailure(result.failure ?? "unknown");
      setDeleting(false);
      return;
    }

    // The account is gone. What is left is this device: any export file the app
    // wrote, and the session tokens.
    await clearNativeExports();
    try {
      const { error } = await signOutIntentionally();
      if (error) await clearLocalSession();
    } catch {
      await clearLocalSession();
    }

    // The toaster is mounted above the router, so this survives the navigation
    // and is what the person reads on /login.
    toast({
      title: t("accountDeletion.success.title", en.success.title),
      description: t("accountDeletion.success.body", en.success.body),
    });
    navigate("/login", { replace: true });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium">
            {t("app.settings.dataRights.deleteTitle", "Delete my account")}
          </h3>
          <p className="text-xs text-muted-foreground">{t("accountDeletion.row.desc", en.row.desc)}</p>
        </div>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="h-8 text-xs shrink-0"
          disabled={disabled || isDemo}
          aria-label={t("accountDeletion.row.button", en.row.button)}
          aria-describedby={isDemo ? demoNoteId : undefined}
          onClick={() => setOpen(true)}
        >
          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
          {t("app.common.delete")}
        </Button>
      </div>
      {isDemo && (
        <p id={demoNoteId} className="text-xs text-muted-foreground">
          {t("accountDeletion.row.demo", en.row.demo)}
        </p>
      )}

      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("accountDeletion.dialog.title", en.dialog.title)}</AlertDialogTitle>
            <AlertDialogDescription>{t("accountDeletion.dialog.intro", en.dialog.intro)}</AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-1">{t("accountDeletion.dialog.deletedTitle", en.dialog.deletedTitle)}</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {DELETED_ITEMS.map((key) => (
                  <li key={key}>{t("accountDeletion.dialog.deleted." + key, en.dialog.deleted[key])}</li>
                ))}
              </ul>
            </div>

            <p className="text-muted-foreground">{t("accountDeletion.dialog.subscription", en.dialog.subscription)}</p>

            <div>
              <h4 className="font-medium mb-1">{t("accountDeletion.dialog.keptTitle", en.dialog.keptTitle)}</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {KEPT_ITEMS.map((key) => (
                  <li key={key}>{t("accountDeletion.dialog.kept." + key, en.dialog.kept[key])}</li>
                ))}
              </ul>
            </div>

            {onExport && (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted p-3">
                <p className="text-xs">{t("accountDeletion.dialog.exportHint", en.dialog.exportHint)}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={onExport}
                  disabled={deleting || disabled}
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  {t("accountDeletion.dialog.exportButton", en.dialog.exportButton)}
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor={confirmInputId}>
                {t("accountDeletion.dialog.confirmLabel", {
                  word: confirmWord,
                  defaultValue: en.dialog.confirmLabel,
                })}
              </Label>
              <Input
                id={confirmInputId}
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                disabled={deleting}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="characters"
                spellCheck={false}
              />
            </div>

            {failure && !deleting && (
              <div
                role="alert"
                className="rounded-lg border border-destructive/50 p-3 text-sm text-destructive"
              >
                <p>{t("accountDeletion.error." + failure, en.error[failure])}</p>
                <p className="mt-1 text-xs">
                  {t("accountDeletion.error.support", en.error.support)}{" "}
                  <a className="underline" href={"mailto:" + ACCOUNT_SUPPORT_EMAIL}>
                    {ACCOUNT_SUPPORT_EMAIL}
                  </a>
                  .
                </p>
              </div>
            )}

            {deleting && (
              <p role="status" className="text-xs text-muted-foreground">
                {t("accountDeletion.dialog.deletingHint", en.dialog.deletingHint)}
              </p>
            )}
          </div>

          <AlertDialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={deleting}
            >
              {t("accountDeletion.dialog.cancel", en.dialog.cancel)}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={!confirmed || deleting || isDemo}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                  {t("accountDeletion.dialog.deleting", en.dialog.deleting)}
                </>
              ) : failure ? (
                t("accountDeletion.dialog.retry", en.dialog.retry)
              ) : (
                t("accountDeletion.dialog.submit", en.dialog.submit)
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteAccountDialog;
