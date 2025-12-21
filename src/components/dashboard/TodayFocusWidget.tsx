import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, CheckCircle2, Phone, Mail, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TodayFocusWidgetProps {
  tasksDueToday: number;
  hotLeadsCount: number;
  overdueCount: number;
}

const TodayFocusWidget = ({ tasksDueToday, hotLeadsCount, overdueCount }: TodayFocusWidgetProps) => {
  const navigate = useNavigate();

  const focusItems = [
    {
      icon: CheckCircle2,
      label: "Tasks due today",
      value: tasksDueToday,
      color: "text-primary",
      action: () => navigate("/tasks"),
    },
    {
      icon: Phone,
      label: "Hot leads to follow up",
      value: hotLeadsCount,
      color: "text-warning",
      action: () => navigate("/contacts"),
    },
  ];

  if (overdueCount > 0) {
    focusItems.push({
      icon: Calendar,
      label: "Overdue tasks",
      value: overdueCount,
      color: "text-destructive",
      action: () => navigate("/tasks"),
    });
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-heading-3 flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          Today's Focus
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {focusItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-background/50 hover:bg-background transition-colors"
            >
              <span className="flex items-center gap-2">
                <item.icon className={`h-4 w-4 ${item.color}`} />
                <span className="text-body-sm">{item.label}</span>
              </span>
              <span className={`text-heading-3 ${item.color}`}>{item.value}</span>
            </button>
          ))}
          
          {tasksDueToday === 0 && hotLeadsCount === 0 && overdueCount === 0 && (
            <div className="text-center py-4">
              <p className="text-body-sm text-muted-foreground mb-2">
                You're all caught up! Great job.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="text-body-sm"
                onClick={() => navigate("/contacts")}
              >
                Find new leads
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayFocusWidget;