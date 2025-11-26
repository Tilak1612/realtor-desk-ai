import { useState, useEffect } from "react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Plus, List, Calendar as CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import TasksStats from "@/components/tasks/TasksStats";
import TasksList from "@/components/tasks/TasksList";
import TasksCalendar from "@/components/tasks/TasksCalendar";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import TasksFilters from "@/components/tasks/TasksFilters";
import BulkActions from "@/components/tasks/BulkActions";

const Tasks = () => {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [quickFilter, setQuickFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    priorities: [] as string[],
    types: [] as string[],
    status: [] as string[],
    contactId: ""
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(profileData);
      }
    };
    fetchUserData();
  }, []);

  const handleTaskAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const quickFilterButtons = [
    { label: "All", value: "all" },
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "Overdue", value: "overdue" }
  ];

  return (
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col lg:ml-0">
        <DashboardNavbar user={user} profile={profile} />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">Tasks</h1>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Quick Filters */}
                <div className="flex gap-2">
                  {quickFilterButtons.map(btn => (
                    <Button
                      key={btn.value}
                      variant={quickFilter === btn.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setQuickFilter(btn.value)}
                    >
                      {btn.label}
                    </Button>
                  ))}
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-muted rounded-md p-1">
                  <Button
                    variant={view === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setView("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={view === "calendar" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setView("calendar")}
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </div>

                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </div>

            {/* Stats */}
            <TasksStats 
              quickFilter={quickFilter} 
              refreshTrigger={refreshTrigger}
              filters={filters}
            />

            {/* Bulk Actions */}
            {selectedTasks.length > 0 && (
              <BulkActions
                selectedTasks={selectedTasks}
                onClearSelection={() => setSelectedTasks([])}
                onTasksUpdated={handleTaskAdded}
              />
            )}

            {/* Main Content */}
            <div className="flex gap-6">
              {/* Filters Sidebar */}
              <TasksFilters
                filters={filters}
                onFiltersChange={setFilters}
              />

              {/* Content Area */}
              <div className="flex-1">
                {view === "list" ? (
                  <TasksList
                    quickFilter={quickFilter}
                    refreshTrigger={refreshTrigger}
                    filters={filters}
                    selectedTasks={selectedTasks}
                    onTaskSelection={setSelectedTasks}
                    onTaskUpdated={handleTaskAdded}
                  />
                ) : (
                  <TasksCalendar
                    refreshTrigger={refreshTrigger}
                    filters={filters}
                    onTaskUpdated={handleTaskAdded}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <AddTaskModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen}
        onTaskAdded={handleTaskAdded}
      />
    </div>
  );
};

export default Tasks;
