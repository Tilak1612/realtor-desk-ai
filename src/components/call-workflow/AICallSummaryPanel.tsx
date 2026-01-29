import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, FileText, Calendar, Loader2 } from "lucide-react";

interface AICallSummaryPanelProps {
  callNotes: string;
  aiSummary: {
    summary: string[];
    intent: string;
    tone: string;
    suggestedAction: string;
  } | null;
  generatingAI: boolean;
  onGenerateSummary: () => void;
  onApplySummary: () => void;
  onCreateFollowup: () => void;
}

const AICallSummaryPanel = ({
  callNotes,
  aiSummary,
  generatingAI,
  onGenerateSummary,
  onApplySummary,
  onCreateFollowup,
}: AICallSummaryPanelProps) => {
  const getToneColor = (tone: string) => {
    const colorMap: Record<string, string> = {
      positive: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      neutral: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      uncertain: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      negative: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return colorMap[tone.toLowerCase()] || colorMap.neutral;
  };

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Call Coach
        </CardTitle>
        <CardDescription>
          AI-powered insights to support your conversation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!aiSummary ? (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Add call notes and generate an AI summary to get insights and suggestions
            </p>
            <Button
              onClick={onGenerateSummary}
              disabled={generatingAI || !callNotes.trim()}
              className="w-full"
            >
              {generatingAI ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate AI Summary
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Call Summary</h4>
              <ul className="space-y-1.5">
                {aiSummary.summary.map((point, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Intent & Tone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-1">Intent</h4>
                <Badge variant="outline" className="text-xs">
                  {aiSummary.intent}
                </Badge>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-1">Tone</h4>
                <Badge className={`${getToneColor(aiSummary.tone)} text-xs`}>
                  {aiSummary.tone}
                </Badge>
              </div>
            </div>

            {/* Suggested Action */}
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="text-xs font-semibold text-primary mb-2 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Suggested Next Step
              </h4>
              <p className="text-sm text-foreground">
                {aiSummary.suggestedAction}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={onApplySummary}
              >
                <FileText className="w-4 h-4 mr-2" />
                Apply to Notes
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={onCreateFollowup}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Create Follow-up Task
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={onGenerateSummary}
                disabled={generatingAI}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Regenerate
              </Button>
            </div>
          </div>
        )}

        {/* Info Note */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            💡 The AI coach helps you reflect and decide—it doesn't make calls for you.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AICallSummaryPanel;
