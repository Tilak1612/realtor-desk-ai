import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { nativePlatform } from "@/lib/native/platform";
// Importing this module also registers the `aiReport` strings (EN + FR). The
// English object doubles as the default for every t() call, so a key can never
// render as raw text.
import { aiReportEn as en } from "@/i18n/aiResponseReport";

// "Report this response", on every assistant message.
//
// /ai-assistant shows free-form model output. Google Play's AI-generated
// content policy requires a way, inside the app, to report or flag offensive
// output, and Apple's reviewers ask for the same. This is that control. It is
// on the web as well: a wrong answer is as reportable in a browser.
//
// A report is one row in user_feedback, the table WorkflowFeedbackWidget was
// written for, using only its existing columns:
//   feedback_type  "ai_response_report"   how the team finds these
//   was_helpful    false
//   comment        what the person typed, if anything
//   metadata       { reason, reported_text, reported_text_truncated, platform }
// Only the reported response is stored, cut to REPORTED_TEXT_MAX characters,
// and never the rest of the conversation: the other messages hold the agent's
// own prompts and whatever client detail they pasted in, and a report about one
// answer is not consent to file all of that.

export const AI_REPORT_FEEDBACK_TYPE = "ai_response_report";
const AI_REPORT_REASONS = ["inaccurate", "offensive", "other"] as const;
export const REPORTED_TEXT_MAX = 2000;
const COMMENT_MAX = 1000;

type Reason = (typeof AI_REPORT_REASONS)[number];

interface ReportAIResponseProps {
  /** The assistant message being reported. */
  responseText: string;
}

const ReportAIResponse = ({ responseText }: ReportAIResponseProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const groupId = useId();
  const commentId = useId();

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<Reason>("inaccurate");
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  // One report per message is enough; the control settles into "Reported".
  const [reported, setReported] = useState(false);

  const handleOpenChange = (next: boolean) => {
    if (sending) return;
    setOpen(next);
    if (!next) setFailed(false);
  };

  const handleSubmit = async () => {
    if (sending) return;
    setSending(true);
    setFailed(false);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase.from("user_feedback").insert({
        user_id: session.user.id,
        // The path, not the full URL: inside the app the origin is
        // capacitor://localhost and says nothing.
        page_url: window.location.pathname,
        feedback_type: AI_REPORT_FEEDBACK_TYPE,
        was_helpful: false,
        comment: comment.trim() ? comment.trim().slice(0, COMMENT_MAX) : null,
        metadata: {
          reason,
          reported_text: responseText.slice(0, REPORTED_TEXT_MAX),
          reported_text_truncated: responseText.length > REPORTED_TEXT_MAX,
          platform: nativePlatform(),
        },
      });
      if (error) throw error;

      setReported(true);
      setOpen(false);
      setComment("");
      toast({ title: t("aiReport.successTitle", en.successTitle), description: t("aiReport.successBody", en.successBody) });
    } catch {
      // Shown in the dialog, which stays open so the person can retry without
      // retyping. A report that silently went nowhere would be worse than none.
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="mt-2 h-7 px-2 text-xs text-muted-foreground"
        onClick={() => setOpen(true)}
        disabled={reported}
      >
        {reported ? <Check className="w-3 h-3 mr-1.5" /> : <Flag className="w-3 h-3 mr-1.5" />}
        {reported ? t("aiReport.reported", en.reported) : t("aiReport.trigger", en.trigger)}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("aiReport.title", en.title)}</DialogTitle>
            <DialogDescription>{t("aiReport.desc", en.desc)}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label id={groupId}>{t("aiReport.reasonLabel", en.reasonLabel)}</Label>
              <RadioGroup
                aria-labelledby={groupId}
                value={reason}
                onValueChange={(value) => setReason(value as Reason)}
                disabled={sending}
              >
                {AI_REPORT_REASONS.map((value) => (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={groupId + value} />
                    <Label htmlFor={groupId + value} className="cursor-pointer font-normal py-1.5">
                      {t("aiReport.reason." + value, en.reason[value])}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor={commentId}>{t("aiReport.commentLabel", en.commentLabel)}</Label>
              <Textarea
                id={commentId}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t("aiReport.commentPlaceholder", en.commentPlaceholder)}
                rows={3}
                maxLength={COMMENT_MAX}
                disabled={sending}
                className="resize-none text-sm"
              />
            </div>

            {failed && (
              <p role="alert" className="text-sm text-destructive">
                {t("aiReport.error", en.error)}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={sending}>
              {t("aiReport.cancel", en.cancel)}
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={sending}>
              {sending ? t("aiReport.sending", en.sending) : t("aiReport.submit", en.submit)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportAIResponse;
