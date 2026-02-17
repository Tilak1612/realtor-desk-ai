import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TasksFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
}

const TasksFilters = ({ filters, onFiltersChange }: TasksFiltersProps) => {
  const [contacts, setContacts] = useState<unknown[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const hasActiveFilters = filters.search || filters.priorities.length > 0 || 
    filters.types.length > 0 || filters.status.length > 0 || filters.contactId;

  if (isCollapsed) {
    return (
      <Button
        variant="outline"
        onClick={() => setIsCollapsed(false)}
        className="h-full"
      >
        Show Filters
      </Button>
    );
  }

  return (
    <Card className="hidden lg:block w-64 flex-shrink-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium">Filters</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(true)}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div>
          <Label htmlFor="search">Search Tasks</Label>
          <div className="relative mt-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search..."
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
            Clear Filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksFilters;
