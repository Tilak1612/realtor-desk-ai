import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, CheckCircle2, Calendar, Clock } from "lucide-react";

interface TasksStatsProps {
  quickFilter: string;
  refreshTrigger: number;
  filters: unknown;
}

const TasksStats = ({ quickFilter, refreshTrigger, filters }: TasksStatsProps) => {
  const [stats, setStats] = useState({
    dueToday: 0,
    overdue: 0,
    completedToday: 0,
    thisWeek: 0
  });

  useEffect(() => {
    fetchStats();
  }, [quickFilter, refreshTrigger, filters]);

  const fetchStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayStr = today.toISOString().split('T')[0];
    
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    const weekStr = weekFromNow.toISOString().split('T')[0];

    // Due today
    const { data: todayTasks } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .eq("due_date", todayStr);

    // Overdue
    const { data: overdueTasks } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .lt("due_date", todayStr);

    // Completed today
    const { data: completedTasks } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .gte("completed_at", today.toISOString());

    // This week
    const { data: weekTasks } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .gte("due_date", todayStr)
      .lte("due_date", weekStr);

    setStats({
      dueToday: todayTasks?.length || 0,
      overdue: overdueTasks?.length || 0,
      completedToday: completedTasks?.length || 0,
      thisWeek: weekTasks?.length || 0
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Due Today</p>
              <p className="text-2xl font-bold">{stats.dueToday}</p>
            </div>
            <Calendar className="h-8 w-8 text-primary opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card className={stats.overdue > 0 ? "border-destructive" : ""}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className={`text-2xl font-bold ${stats.overdue > 0 ? "text-destructive" : ""}`}>
                {stats.overdue}
              </p>
            </div>
            <AlertCircle className={`h-8 w-8 ${stats.overdue > 0 ? "text-destructive" : "text-primary"} opacity-80`} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed Today</p>
              <p className="text-2xl font-bold">{stats.completedToday}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-primary opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold">{stats.thisWeek}</p>
            </div>
            <Clock className="h-8 w-8 text-primary opacity-80" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksStats;
