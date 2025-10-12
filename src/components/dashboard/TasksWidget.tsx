import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Plus, AlertCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  due_time?: string;
  priority: string;
  status: string;
  contact?: { first_name: string; last_name: string };
  deal?: { title: string };
}

interface TasksWidgetProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
}

const TasksWidget = ({ tasks, onTaskComplete }: TasksWidgetProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-muted";
    }
  };

  const handleTaskToggle = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus, completed_at: newStatus === "completed" ? new Date().toISOString() : null })
      .eq("id", taskId);

    if (error) {
      toast.error("Failed to update task");
      return;
    }

    onTaskComplete(taskId);
    toast.success(newStatus === "completed" ? "Task completed!" : "Task reopened");
  };

  const isOverdue = (dueTime?: string) => {
    if (!dueTime) return false;
    const now = new Date();
    const [hours, minutes] = dueTime.split(":");
    const taskTime = new Date();
    taskTime.setHours(parseInt(hours), parseInt(minutes));
    return taskTime < now;
  };

  if (tasks.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            Today's Tasks
          </CardTitle>
          <Link to="/tasks">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Task
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No tasks for today</p>
            <Link to="/tasks">
              <Button>Create Your First Task</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5" />
          Today's Tasks
        </CardTitle>
        <Link to="/tasks">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Task
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.slice(0, 5).map((task) => (
          <div
            key={task.id}
            className={`flex items-start gap-3 p-3 rounded-lg border ${
              task.status === "completed" ? "bg-accent/30" : "hover:bg-accent/50"
            } transition-colors`}
          >
            <Checkbox
              checked={task.status === "completed"}
              onCheckedChange={() => handleTaskToggle(task.id, task.status)}
              className="mt-1"
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <p className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                  {task.title}
                </p>
                {isOverdue(task.due_time) && task.status !== "completed" && (
                  <AlertCircle className="w-4 h-4 text-destructive" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {task.due_time && (
                  <span className={isOverdue(task.due_time) && task.status !== "completed" ? "text-destructive" : ""}>
                    {task.due_time}
                  </span>
                )}
                {task.contact && (
                  <Link to={`/contacts/${task.contact}`} className="hover:underline">
                    {task.contact.first_name} {task.contact.last_name}
                  </Link>
                )}
                {task.deal && (
                  <Link to={`/deals/${task.deal}`} className="hover:underline">
                    {task.deal.title}
                  </Link>
                )}
              </div>
            </div>
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)} shrink-0 mt-2`} />
          </div>
        ))}
        {tasks.length > 5 && (
          <Link to="/tasks" className="block">
            <Button variant="ghost" className="w-full">
              View All Tasks
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksWidget;
