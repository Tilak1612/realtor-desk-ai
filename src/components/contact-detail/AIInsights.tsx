import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Clock, Target, RefreshCw } from "lucide-react";
import { useLeadScore } from "@/hooks/useLeadScore";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface AIInsightsProps {
  contact: any;
}

const AIInsights = ({ contact }: AIInsightsProps) => {
  const { leadScore, loading, calculating, calculateLeadScore } = useLeadScore(contact.id);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-24" />
        </CardContent>
      </Card>
    );
  }

  const score = leadScore?.score || contact.ai_score || 0;
  const factors = leadScore?.factors || {
    engagement: 0,
    behavior: 0,
    budget_match: 0,
    timeline: 0,
    qualification: 0,
  };
  const closeProbability = leadScore?.prediction_confidence
    ? Math.round(leadScore.prediction_confidence * 100)
    : Math.round(score * 0.85);
  const recommendedActions = leadScore?.recommended_actions || [
    "Update contact information",
    "Calculate lead score",
  ];
  const optimalContactTime = leadScore?.optimal_contact_time || "Not enough data";
  const insights = leadScore?.insights || "Calculate the lead score to get AI insights.";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Insights
        </CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={calculateLeadScore}
          disabled={calculating}
        >
          <RefreshCw className={`h-4 w-4 ${calculating ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Lead Score Breakdown */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Lead Score Breakdown</h4>
          
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Engagement</span>
                <span className="text-xs font-medium">{factors.engagement}%</span>
              </div>
              <Progress value={factors.engagement} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Behavior</span>
                <span className="text-xs font-medium">{factors.behavior}%</span>
              </div>
              <Progress value={factors.behavior} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Budget Match</span>
                <span className="text-xs font-medium">{factors.budget_match}%</span>
              </div>
              <Progress value={factors.budget_match} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Timeline</span>
                <span className="text-xs font-medium">{factors.timeline}%</span>
              </div>
              <Progress value={factors.timeline} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Qualification</span>
                <span className="text-xs font-medium">{factors.qualification}%</span>
              </div>
              <Progress value={factors.qualification} className="h-2" />
            </div>
          </div>
        </div>

        {/* Close Probability */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Predicted Close Probability</span>
          </div>
          <p className="text-2xl font-bold text-primary">{closeProbability}%</p>
          <Badge variant="outline" className="mt-2">High Confidence</Badge>
        </div>

        {/* Best Contact Times */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Best Contact Times</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{optimalContactTime}</p>
          {optimalContactTime !== "Not enough data" && (
            <p className="text-xs text-muted-foreground">
              Based on email open rates and response patterns
            </p>
          )}
        </div>

        {/* Recommended Actions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Recommended Actions</span>
          </div>
          <div className="space-y-2">
            {recommendedActions.slice(0, 3).map((action, i) => (
              <Button key={i} variant="outline" size="sm" className="w-full justify-start text-left">
                {action}
              </Button>
            ))}
          </div>
        </div>

        {/* Insights */}
        {insights && (
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-xs text-muted-foreground">{insights}</p>
          </div>
        )}

        {/* Last Updated */}
        <p className="text-xs text-muted-foreground text-center">
          {leadScore?.calculated_at
            ? `Updated ${formatDistanceToNow(new Date(leadScore.calculated_at), {
                addSuffix: true,
              })}`
            : "Click refresh to calculate score"}
        </p>
      </CardContent>
    </Card>
  );
};

export default AIInsights;
