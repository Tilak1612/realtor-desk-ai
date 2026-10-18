import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSession } from "@/hooks/rd/useSession";
import { hasAiConsent, recordAiConsent } from "@/lib/aiConsent";

/**
 * `ensure()` resolves true when an AI feature may send data: at once if the
 * person already allowed it (or on the website), otherwise after they answer
 * the dialog. Render `dialog` once in the page that uses it.
 */
export function useAiConsent() {
  const { t } = useTranslation();
  const { user } = useSession();
  const userId = user?.id ?? null;
  const [open, setOpen] = useState(false);
  const pending = useRef<((allowed: boolean) => void) | null>(null);

  const ensure = useCallback((): Promise<boolean> => {
    if (hasAiConsent(userId)) return Promise.resolve(true);
    return new Promise<boolean>((resolve) => {
      pending.current = resolve;
      setOpen(true);
    });
  }, [userId]);

  const answer = (allowed: boolean) => {
    if (allowed && userId) recordAiConsent(userId);
    setOpen(false);
    pending.current?.(allowed && Boolean(userId));
    pending.current = null;
  };

  const dialog = (
    <AlertDialog open={open} onOpenChange={(o) => !o && open && answer(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("rd.shared.aiConsent.title")}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-sm">
              <p>{t("rd.shared.aiConsent.what")}</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>{t("rd.shared.aiConsent.anthropic")}</li>
                <li>{t("rd.shared.aiConsent.openai")}</li>
              </ul>
              <p>{t("rd.shared.aiConsent.where")}</p>
              <p>
                <Link to="/privacy-policy" className="underline">
                  {t("rd.shared.aiConsent.policy")}
                </Link>
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => answer(false)}>{t("rd.shared.aiConsent.decline")}</AlertDialogCancel>
          <AlertDialogAction onClick={() => answer(true)}>{t("rd.shared.aiConsent.allow")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { ensure, dialog };
}
