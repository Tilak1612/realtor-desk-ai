import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Trash2, AlertCircle, Calendar, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BulkActionsProps {
  selectedTasks: string[];
  onClearSelection: () => void;
  onTasksUpdated: () => void;
}

const BulkActions = ({ selectedTasks, onClearSelection, onTasksUpdated }: BulkActionsProps) => {
  const [loading, setLoading] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>();

  const handleCompleteAll = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("tasks")
      .update({ 
        status: "completed",
        completed_at: new Date().toISOString()
      })
      .in("id", selectedTasks);

    setLoading(false);
    
    if (error) {
      toast.error("Failed to complete tasks");
    } else {
      toast.success(`${selectedTasks.length} task(s) completed`);
      onTasksUpdated();
      onClearSelection();
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedTasks.length} task(s)?`)) return;

    setLoading(true);
    const { error } = await supabase
      .from("tasks")
      .delete()
      .in("id", selectedTasks);

    setLoading(false);
    
    if (error) {
      toast.error("Failed to delete tasks");
    } else {
      toast.success(`${selectedTasks.length} task(s) deleted`);
      onTasksUpdated();
      onClearSelection();
    }
  };

  const handleChangePriority = async () => {
    if (!newPriority) {
      toast.error("Please select a priority");
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("tasks")
      .update({ priority: newPriority })
      .in("id", selectedTasks);

    setLoading(false);
    
    if (error) {
      toast.error("Failed to update priority");
    } else {
      toast.success(`Priority updated for ${selectedTasks.length} task(s)`);
      onTasksUpdated();
      setNewPriority("");
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleDate) {
      toast.error("Please select a date");
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("tasks")
      .update({ due_date: rescheduleDate.toISOString().split('T')[0] })
      .in("id", selectedTasks);

    setLoading(false);
    
    if (error) {
      toast.error("Failed to reschedule tasks");
    } else {
      toast.success(`${selectedTasks.length} task(s) rescheduled`);
      onTasksUpdated();
      setRescheduleDate(undefined);
    }
  };

  return (
    <Card className="border-primary">
      <CardContent className="py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            <span className="font-medium">
              {selectedTasks.length} task{selectedTasks.length !== 1 ? "s" : ""} selected
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCompleteAll}
              disabled={loading}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Complete
            </Button>

            <div className="flex items-center gap-1">
              <Select value={newPriority} onValueChange={setNewPriority}>
                <SelectTrigger className="w-32 h-9">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="outline"
                onClick={handleChangePriority}
                disabled={loading || !newPriority}
              >
                Apply
              </Button>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className={cn(!rescheduleDate && "text-muted-foreground")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {rescheduleDate ? format(rescheduleDate, "MMM d") : "Reschedule"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={rescheduleDate}
                  onSelect={setRescheduleDate}
                  initialFocus
                  className="pointer-events-auto"
                />
                {rescheduleDate && (
                  <div className="p-3 border-t">
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={handleReschedule}
                      disabled={loading}
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            <Button
              size="sm"
              variant="destructive"
              onClick={handleDeleteAll}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSelection}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkActions;
