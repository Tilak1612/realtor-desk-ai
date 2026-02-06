import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Trash2, Phone, Mail, Calendar, Home, User, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import EditTaskModal from "./EditTaskModal";

interface TaskItemProps {
  task: unknown;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onTaskUpdated: () => void;
}

const TaskItem = ({ task, isSelected, onSelect, onTaskUpdated }: TaskItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async (checked: boolean) => {
    setIsCompleting(true);
    const { error } = await supabase
      .from("tasks")
      .update({
        status: checked ? "completed" : "pending",
        completed_at: checked ? new Date().toISOString() : null
      })
      .eq("id", task.id);

    setIsCompleting(false);

    if (error) {
      toast.error("Failed to update task");
    } else {
      toast.success(checked ? "Task completed!" : "Task marked as pending");
      setTimeout(() => onTaskUpdated(), checked ? 2000 : 0);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    const { error } = await supabase.from("tasks").delete().eq("id", task.id);
    
    if (error) {
      toast.error("Failed to delete task");
    } else {
      toast.success("Task deleted");
      onTaskUpdated();
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-blue-500",
      medium: "bg-amber-500",
      high: "bg-orange-500",
      urgent: "bg-red-500"
    };
    return colors[priority] || "bg-gray-500";
  };

  const getTaskTypeIcon = (metadata: unknown) => {
    const type = metadata?.task_type || "other";
    const icons: Record<string, unknown> = {
      call: Phone,
      email: Mail,
      meeting: Calendar,
      viewing: Home,
      followup: User
    };
    const Icon = icons[type] || User;
    return <Icon className="h-4 w-4" />;
  };

  const formatTime = (time: string | null) => {
    if (!time) return "";
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const contactName = task.contacts 
    ? `${task.contacts.first_name} ${task.contacts.last_name}`
    : null;

  const initials = task.contacts
    ? `${task.contacts.first_name[0]}${task.contacts.last_name[0]}`
    : "?";

  return (
    <>
      <div className={`flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-all ${
        task.status === "completed" ? "opacity-50" : ""
      } ${isSelected ? "bg-accent" : ""}`}>
        <Checkbox
          checked={task.status === "completed" || isSelected}
          onCheckedChange={(checked) => {
            if (task.status !== "completed") {
              onSelect(checked as boolean);
            }
          }}
          disabled={isCompleting}
          className="mt-1"
        />

        <div 
          className="flex-1 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-start gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full mt-1.5 ${getPriorityColor(task.priority)}`} />
            <div className="flex-1">
              <p className={`font-medium ${task.status === "completed" ? "line-through" : ""}`}>
                {task.title}
              </p>
              {expanded && task.description && (
                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(task.due_date).toLocaleDateString()}
              {task.due_time && <span className="ml-1">{formatTime(task.due_time)}</span>}
            </div>

            {contactName && (
              <Link 
                to={`/contacts/${task.contact_id}`}
                className="flex items-center gap-1 hover:text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                {contactName}
              </Link>
            )}

            <div className="flex items-center gap-1">
              {getTaskTypeIcon(task.metadata)}
              <span className="capitalize">{task.metadata?.task_type || "other"}</span>
            </div>

            <Badge variant="outline" className="capitalize">
              {task.priority}
            </Badge>
          </div>
        </div>

        <Checkbox
          checked={task.status === "completed"}
          onCheckedChange={handleComplete}
          disabled={isCompleting}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <EditTaskModal
        task={task}
        open={isEditing}
        onOpenChange={setIsEditing}
        onTaskUpdated={onTaskUpdated}
      />
    </>
  );
};

export default TaskItem;
