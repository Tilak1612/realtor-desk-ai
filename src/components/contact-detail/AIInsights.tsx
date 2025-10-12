import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Clock, Target } from "lucide-react";

interface AIInsightsProps {
  contact: any;
}

const AIInsights = ({ contact }: AIInsightsProps) => {
  const leadScore = contact.ai_score || 0;
  
  // Mock AI insights (would be calculated by real AI)
  const engagement = Math.min(100, leadScore + Math.random() * 20);
  const behavior = Math.min(100, leadScore + Math.random() * 15);
  const budgetMatch = Math.min(100, leadScore - Math.random() * 10);
  const timeline = Math.min(100, leadScore + Math.random() * 10);
  
  const closeProbability = Math.round((engagement + behavior + budgetMatch + timeline) / 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Lead Score Breakdown */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Lead Score Breakdown</h4>
          
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Engagement</span>
                <span className="text-xs font-medium">{Math.round(engagement)}%</span>
              </div>
              <Progress value={engagement} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Behavior</span>
                <span className="text-xs font-medium">{Math.round(behavior)}%</span>
              </div>
              <Progress value={behavior} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Budget Match</span>
                <span className="text-xs font-medium">{Math.round(budgetMatch)}%</span>
              </div>
              <Progress value={budgetMatch} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Timeline</span>
                <span className="text-xs font-medium">{Math.round(timeline)}%</span>
              </div>
              <Progress value={timeline} className="h-2" />
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
          <p className="text-sm text-muted-foreground mb-2">
            Weekdays 10 AM - 12 PM
          </p>
          <p className="text-xs text-muted-foreground">
            Based on email open rates and response patterns
          </p>
        </div>

        {/* Recommended Actions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Recommended Actions</span>
          </div>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              Send pre-approval checklist
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Schedule property viewing
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Share market report
            </Button>
          </div>
        </div>

        {/* Last Updated */}
        <p className="text-xs text-muted-foreground text-center">
          Last updated: Just now
        </p>
      </CardContent>
    </Card>
  );
};

export default AIInsights;
