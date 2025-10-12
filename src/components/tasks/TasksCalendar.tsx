import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import TaskItem from "./TaskItem";

interface TasksCalendarProps {
  refreshTrigger: number;
  filters: any;
  onTaskUpdated: () => void;
}

const TasksCalendar = ({ refreshTrigger, filters, onTaskUpdated }: TasksCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState<any[]>([]);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<any[]>([]);

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger, filters]);

  useEffect(() => {
    if (selectedDate) {
      filterTasksByDate(selectedDate);
    }
  }, [selectedDate, tasks]);

  const fetchTasks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let query = supabase
      .from("tasks")
      .select(`
        *,
        contacts (first_name, last_name)
      `)
      .eq("user_id", user.id);

    // Apply filters
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

    const { data } = await query;
    setTasks(data || []);
  };

  const filterTasksByDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const filtered = tasks.filter(task => task.due_date === dateStr);
    setTasksForSelectedDate(filtered);
  };

  const getTaskCountForDate = (date: Date): number => {
    const dateStr = format(date, "yyyy-MM-dd");
    return tasks.filter(task => task.due_date === dateStr && task.status === "pending").length;
  };

  const modifiers = {
    hasTasks: (date: Date) => getTaskCountForDate(date) > 0
  };

  const modifiersStyles = {
    hasTasks: {
      fontWeight: "bold",
      textDecoration: "underline"
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Task Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className="rounded-md border pointer-events-auto"
          />
        </CardContent>
      </Card>

      {selectedDate && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Tasks for {format(selectedDate, "MMMM d, yyyy")}
              </CardTitle>
              <Badge variant="secondary">
                {tasksForSelectedDate.length} task{tasksForSelectedDate.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {tasksForSelectedDate.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No tasks scheduled for this date
              </p>
            ) : (
              tasksForSelectedDate.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isSelected={false}
                  onSelect={() => {}}
                  onTaskUpdated={onTaskUpdated}
                />
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TasksCalendar;
