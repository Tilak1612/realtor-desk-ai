import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskItem from "./TaskItem";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  due_date: string;
  due_time: string | null;
  contact_id: string | null;
  deal_id: string | null;
  created_at: string;
  metadata: unknown | null;
  contacts?: {
    first_name: string;
    last_name: string;
  };
}

interface TaskFilters {
  search: string;
  priorities: string[];
  types: string[];
  status: string[];
  contactId: string;
}

interface TasksListProps {
  quickFilter: string;
  refreshTrigger: number;
  filters: TaskFilters;
  selectedTasks: string[];
  onTaskSelection: (tasks: string[]) => void;
  onTaskUpdated: () => void;
}

const TasksList = ({ quickFilter, refreshTrigger, filters, selectedTasks, onTaskSelection, onTaskUpdated }: TasksListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayStr = today.toISOString().split('T')[0];
    
    let query = supabase
      .from("tasks")
      .select(`
        *,
        contacts (first_name, last_name)
      `)
      .eq("user_id", user.id);

    // Apply quick filter
    if (quickFilter === "today") {
      query = query.eq("due_date", todayStr).eq("status", "pending");
    } else if (quickFilter === "week") {
      const weekFromNow = new Date(today);
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      query = query.gte("due_date", todayStr).lte("due_date", weekFromNow.toISOString().split('T')[0]).eq("status", "pending");
    } else if (quickFilter === "overdue") {
      query = query.lt("due_date", todayStr).eq("status", "pending");
    }

    // Apply advanced filters
    if (filters.search) {
      query = query.ilike("title", `%${filters.search}%`);
    }
    if (filters.priorities.length > 0) {
      query = query.in("priority", filters.priorities);
    }
    if (filters.status.length > 0) {
      query = query.in("status", filters.status);
    }
    if (filters.contactId) {
      query = query.eq("contact_id", filters.contactId);
    }

    const { data, error } = await query.order("due_date", { ascending: true });

    if (error) {
      toast.error("Failed to load tasks");
      setLoading(false);
      return;
    }

    setTasks((data || []) as unknown as Task[]);
    setLoading(false);
  }, [quickFilter, filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refreshTrigger]);

  const groupTasksByDate = (tasks: Task[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    const groups = {
      overdue: [] as Task[],
      today: [] as Task[],
      tomorrow: [] as Task[],
      thisWeek: [] as Task[],
      later: [] as Task[]
    };

    tasks.forEach(task => {
      if (task.status === "completed") return;
      
      const dueDate = new Date(task.due_date);
      const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

      if (dueDateOnly < today) {
        groups.overdue.push(task);
      } else if (dueDateOnly.getTime() === today.getTime()) {
        groups.today.push(task);
      } else if (dueDateOnly.getTime() === tomorrow.getTime()) {
        groups.tomorrow.push(task);
      } else if (dueDateOnly <= weekFromNow) {
        groups.thisWeek.push(task);
      } else {
        groups.later.push(task);
      }
    });

    return groups;
  };

  const groups = groupTasksByDate(tasks);

  const renderGroup = (title: string, tasks: Task[], isOverdue = false) => {
    if (tasks.length === 0) return null;

    return (
      <Card className={isOverdue ? "border-destructive" : ""}>
        <CardHeader>
          <CardTitle className={`text-lg ${isOverdue ? "text-destructive" : ""}`}>
            {title} ({tasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              isSelected={selectedTasks.includes(task.id)}
              onSelect={(selected) => {
                if (selected) {
                  onTaskSelection([...selectedTasks, task.id]);
                } else {
                  onTaskSelection(selectedTasks.filter(id => id !== task.id));
                }
              }}
              onTaskUpdated={onTaskUpdated}
            />
          ))}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

  return (
    <div className="space-y-4">
      {renderGroup("Overdue", groups.overdue, true)}
      {renderGroup("Today", groups.today)}
      {renderGroup("Tomorrow", groups.tomorrow)}
      {renderGroup("This Week", groups.thisWeek)}
      {renderGroup("Later", groups.later)}
      
      {tasks.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No tasks found. Create your first task to get started!
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TasksList;
