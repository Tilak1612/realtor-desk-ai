import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WorkflowFeedbackWidgetProps {
  workflowName: string;
}

const WorkflowFeedbackWidget = ({ workflowName }: WorkflowFeedbackWidgetProps) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [wasHelpful, setWasHelpful] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleFeedbackClick = async (helpful: boolean) => {
    setWasHelpful(helpful);
    setShowFeedback(true);

    // Auto-submit if helpful, otherwise allow them to add comment
    if (helpful) {
      await submitFeedback(helpful, "");
    }
  };

  const submitFeedback = async (helpful: boolean, feedbackComment: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;

      // Note: This will work after database migration is run
      // For now, log to console
      console.log("Workflow feedback:", {
        helpful,
        comment: feedbackComment,
        workflow: workflowName
      });
      
      /* Uncomment after running database migration:
      await supabase.from("user_feedback").insert({
        user_id: session.user.id,
        was_helpful: helpful,
        comment: feedbackComment,
        page_url: window.location.href,
        feedback_type: "workflow",
        metadata: {
          workflow_name: workflowName,
        }
      });
      */

      setSubmitted(true);
      toast.success("Thanks for your feedback!");
      
      // Hide after 3 seconds
      setTimeout(() => {
        setShowFeedback(false);
        setSubmitted(false);
        setWasHelpful(null);
        setComment("");
      }, 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (wasHelpful !== null) {
      await submitFeedback(wasHelpful, comment);
    }
  };

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-900">
        <CardContent className="p-4">
          <p className="text-sm text-green-800 dark:text-green-200 text-center">
            ✓ Thank you for your feedback!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        {!showFeedback ? (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Was this workflow helpful?</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFeedbackClick(true)}
                className="hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-950"
              >
                <ThumbsUp className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFeedbackClick(false)}
                className="hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950"
              >
                <ThumbsDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : wasHelpful === false ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              We're sorry to hear that. What could we improve?
            </p>
            <Textarea
              placeholder="Tell us what wasn't working for you..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="resize-none text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowFeedback(false);
                  setWasHelpful(null);
                }}
              >
                Skip
              </Button>
              <Button size="sm" onClick={handleCommentSubmit}>
                <MessageSquare className="w-3 h-3 mr-1.5" />
                Submit
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default WorkflowFeedbackWidget;
