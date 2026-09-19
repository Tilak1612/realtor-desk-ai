import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface TaskFilterState {
  search: string;
  priorities: string[];
  types: string[];
  status: string[];
  contactId: string;
}

interface TasksFiltersProps {
  filters: TaskFilterState;
  onFiltersChange: (filters: TaskFilterState) => void;
}

const PANEL_ID = "tasks-filters-panel";

const TasksFilters = ({ filters, onFiltersChange }: TasksFiltersProps) => {
  const [contacts, setContacts] = useState<Array<{ id: string; first_name: string; last_name: string }>>([]);
  const { t } = useTranslation();
  // DEVICE PARITY. This panel -- search, priority, type, status, contact and
  // clear -- was `hidden lg:block`, under a comment reading "Hidden on
  // mobile". Below 1024px there was no way to search tasks or filter by
  // anything beyond the quick chips. It now renders at every width: a sidebar
  // at lg, a disclosure above the list below it.
  //
  // Collapsed by default below lg, so the list is not pushed off a phone
  // screen; open by default at lg, as before. `null` = the user has not
  // chosen yet, so crossing the breakpoint follows the default rather than a
  // stale first-paint guess.
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [userCollapsed, setUserCollapsed] = useState<boolean | null>(null);
  const isCollapsed = userCollapsed ?? !isDesktop;
  const setIsCollapsed = (v: boolean) => setUserCollapsed(v);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("contacts")
      .select("id, first_name, last_name")
      .eq("user_id", user.id)
      .order("first_name");

    setContacts(data || []);
  };

  const handlePriorityToggle = (priority: string) => {
    const newPriorities = filters.priorities.includes(priority)
      ? filters.priorities.filter((p: string) => p !== priority)
      : [...filters.priorities, priority];
    onFiltersChange({ ...filters, priorities: newPriorities });
  };

  const handleTypeToggle = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter((t: string) => t !== type)
      : [...filters.types, type];
    onFiltersChange({ ...filters, types: newTypes });
  };

  const handleStatusToggle = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s: string) => s !== status)
      : [...filters.status, status];
    onFiltersChange({ ...filters, status: newStatus });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      priorities: [],
      types: [],
      status: [],
      contactId: ""
    });
  };

  const activeCount =
    (filters.search ? 1 : 0) +
    filters.priorities.length +
    filters.types.length +
    filters.status.length +
    (filters.contactId ? 1 : 0);
  const hasActiveFilters = activeCount > 0;

  if (isCollapsed) {
    return (
      // The count matters most on a phone: collapsed, this button is the only
      // sign that the list below is filtered at all.
      <Button
        variant="outline"
        onClick={() => setIsCollapsed(false)}
        aria-expanded={false}
        aria-controls={PANEL_ID}
        className="w-full lg:w-auto lg:h-full justify-center"
      >
        {t("app.tasks.filters.show", "Show filters")}
        {hasActiveFilters && (
          <span className="ml-2 rounded-full bg-primary text-primary-foreground text-xs px-2 py-0.5">
            {activeCount}
          </span>
        )}
      </Button>
    );
  }

  return (
    <Card id={PANEL_ID} className="w-full lg:w-64 flex-shrink-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium">{t("app.tasks.filters.title", "Filters")}</CardTitle>
        {/* Was an unnamed icon button: a screen reader said only "button". */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(true)}
          aria-label={t("app.tasks.filters.hide", "Hide filters")}
          aria-expanded={true}
          aria-controls={PANEL_ID}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div>
          <Label htmlFor="search">{t("app.tasks.filters.search", "Search tasks")}</Label>
          <div className="relative mt-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder={t("app.tasks.filters.searchPlaceholder", "Search…")}
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-8"
            />
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <Label>Priority</Label>
          <div className="space-y-2 mt-2">
            {["urgent", "high", "medium", "low"].map(priority => (
              <div key={priority} className="flex items-center space-x-2">
                <Checkbox
                  id={`priority-${priority}`}
                  checked={filters.priorities.includes(priority)}
                  onCheckedChange={() => handlePriorityToggle(priority)}
                />
                <Label
                  htmlFor={`priority-${priority}`}
                  className="text-sm font-normal capitalize cursor-pointer"
                >
                  {priority}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Task Type Filter */}
        <div>
          <Label>Task Type</Label>
          <div className="space-y-2 mt-2">
            {["call", "email", "meeting", "viewing", "followup", "other"].map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={filters.types.includes(type)}
                  onCheckedChange={() => handleTypeToggle(type)}
                />
                <Label
                  htmlFor={`type-${type}`}
                  className="text-sm font-normal capitalize cursor-pointer"
                >
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <Label>Status</Label>
          <div className="space-y-2 mt-2">
            {["pending", "completed"].map(status => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={filters.status.includes(status)}
                  onCheckedChange={() => handleStatusToggle(status)}
                />
                <Label
                  htmlFor={`status-${status}`}
                  className="text-sm font-normal capitalize cursor-pointer"
                >
                  {status}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Filter */}
        <div>
          <Label htmlFor="contact">Contact</Label>
          <Select 
            value={filters.contactId || "all"} 
            onValueChange={(v) => onFiltersChange({ ...filters, contactId: v === "all" ? "" : v })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="All contacts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All contacts</SelectItem>
              {contacts.map(contact => (
                <SelectItem key={contact.id} value={contact.id}>
                  {contact.first_name} {contact.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="w-full"
          >
            {t("app.tasks.filters.clear", "Clear filters")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksFilters;
