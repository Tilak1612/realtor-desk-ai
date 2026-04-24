import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const FeedbackDialog = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [comment, setComment] = useState("");
  const [includeUrl, setIncludeUrl] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error("Please provide some feedback");
      return;
    }

    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("You must be logged in to submit feedback");
        return;
      }

      const feedbackData = {
        user_id: session.user.id,
        feedback_type: category || "general",
        comment: comment,
        page_url: includeUrl ? window.location.href : null,
        metadata: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }
      };

      try {
        // Note: This will work after database migration is run
        // For now, log to console
        console.log("User feedback:", feedbackData);
        
        /* Uncomment after running database migration:
        const { error } = await supabase
          .from("user_feedback")
          .insert(feedbackData);

        if (error) throw error;
        */
      } catch (error) {
        console.error("Feedback table not available yet", error);
      }

      toast.success("Thank you for your feedback!");
      setComment("");
      setCategory("");
      setOpen(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Label is hidden on mobile — the icon-only trigger keeps the
            dashboard top bar from overflowing on 420px phones where
            LanguageSwitcher + Feedback + Add + Bell + Avatar all compete
            for the right-side row. aria-label preserves screen-reader
            access. */}
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          aria-label={t('nav.giveFeedback', 'Give Feedback')}
        >
          <MessageSquare className="w-4 h-4 sm:mr-1.5" />
          <span className="hidden sm:inline">{t('nav.giveFeedback', 'Give Feedback')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            Help us improve RealtorDesk AI. Your feedback is valuable to us!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category (optional)</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ui_issue">UI Issue</SelectItem>
                <SelectItem value="workflow_friction">Workflow Friction</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="feature_idea">Feature Idea</SelectItem>
                <SelectItem value="general">General Feedback</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Your Feedback</Label>
            <Textarea
              id="comment"
              placeholder="Tell us what's on your mind..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="include-url"
              checked={includeUrl}
              onChange={(e) => setIncludeUrl(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="include-url" className="text-sm text-muted-foreground cursor-pointer">
              Include current page URL
            </Label>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
