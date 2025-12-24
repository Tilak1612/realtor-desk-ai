import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Plus, List, Calendar as CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import TasksStats from "@/components/tasks/TasksStats";
import TasksList from "@/components/tasks/TasksList";
import TasksCalendar from "@/components/tasks/TasksCalendar";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import TasksFilters from "@/components/tasks/TasksFilters";
import BulkActions from "@/components/tasks/BulkActions";
import { toast } from "sonner";

const Tasks = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [view, setView] = useState<"list" | "calendar">("list");
  const [quickFilter, setQuickFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/login");
          return;
        }

        setUser(session.user);

        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;

        if (!profileData?.onboarding_completed) {
          navigate("/onboarding");
          return;
        }

        setProfile(profileData);
      } catch (error: any) {
        toast.error(t('app.notifications.errorOccurred'));
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate, t]);

  const handleTaskAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const quickFilterButtons = [
    { label: t('app.tasks.allTasks'), value: "all" },
    { label: t('app.tasks.today'), value: "today" },
    { label: t('app.tasks.upcoming'), value: "week" },
    { label: t('app.tasks.overdue'), value: "overdue" }
  ];

  if (loading) {
    return (
      <AppLayout user={user} profile={profile}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-sm text-muted-foreground">{t('app.common.loading')}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user} profile={profile}>
      <div className="space-y-6">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">{t('app.tasks.title')}</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Filters */}
            <div className="flex gap-1">
              {quickFilterButtons.map(btn => (
                <Button
                  key={btn.value}
                  variant={quickFilter === btn.value ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={() => setQuickFilter(btn.value)}
                >
                  {btn.label}
                </Button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-0.5 bg-muted rounded-md p-0.5">
              <Button
                variant={view === "list" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setView("list")}
              >
                <List className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={view === "calendar" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setView("calendar")}
              >
                <CalendarIcon className="h-3.5 w-3.5" />
              </Button>
            </div>

            <Button size="sm" className="h-8 text-xs" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              {t('app.tasks.addTask')}
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

      <AddTaskModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen}
        onTaskAdded={handleTaskAdded}
      />
    </AppLayout>
  );
};

export default Tasks;
