import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, User, Settings, LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DashboardNavbarProps {
  user: any;
  profile: any;
}

const DashboardNavbar = ({ user, profile }: DashboardNavbarProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const notificationCount = 3;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Searching for: ${searchQuery}`);
      // Implement search functionality
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleQuickAdd = (type: string) => {
    switch (type) {
      case "contact":
        navigate("/contacts");
        break;
      case "property":
        navigate("/properties");
        break;
      case "deal":
        navigate("/deals");
        break;
      case "task":
        navigate("/tasks");
        break;
    }
  };

  return (
    <header className="sticky top-0 z-30 h-12 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-12 items-center gap-3 px-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contacts, properties, deals, tasks"
              className="pl-7 pr-20 h-7 text-body-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-meta text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              Multi-entity
            </span>
          </div>
        </form>

        {/* Quick Add Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="h-7 gap-1 text-body-sm">
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => handleQuickAdd("contact")} className="cursor-pointer text-body-sm">
              <User className="mr-2 h-3.5 w-3.5" />
              Contact
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleQuickAdd("property")} className="cursor-pointer text-body-sm">
              <Settings className="mr-2 h-3.5 w-3.5" />
              Property
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleQuickAdd("deal")} className="cursor-pointer text-body-sm">
              <Settings className="mr-2 h-3.5 w-3.5" />
              Deal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleQuickAdd("task")} className="cursor-pointer text-body-sm">
              <Settings className="mr-2 h-3.5 w-3.5" />
              Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-7 w-7">
              <Bell className="h-3.5 w-3.5" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 flex items-center justify-center p-0 text-[9px]"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="text-body-sm">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-1 p-1">
              <div className="p-2 hover:bg-accent rounded-md cursor-pointer">
                <p className="text-body-sm font-medium">New lead: John Smith</p>
                <p className="text-meta text-muted-foreground">2 minutes ago</p>
              </div>
              <div className="p-2 hover:bg-accent rounded-md cursor-pointer">
                <p className="text-body-sm font-medium">Task due: Follow up with client</p>
                <p className="text-meta text-muted-foreground">1 hour ago</p>
              </div>
              <div className="p-2 hover:bg-accent rounded-md cursor-pointer">
                <p className="text-body-sm font-medium">Deal closed: $450,000</p>
                <p className="text-meta text-muted-foreground">3 hours ago</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-body-sm">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-7 w-7 rounded-full p-0">
              <Avatar className="h-7 w-7">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground text-meta">
                  {profile?.full_name ? getInitials(profile.full_name) : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-0.5">
                <p className="text-body-sm font-medium">{profile?.full_name || "User"}</p>
                <p className="text-meta text-muted-foreground">{profile?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer text-body-sm">
              <User className="mr-2 h-3.5 w-3.5" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer text-body-sm">
              <Settings className="mr-2 h-3.5 w-3.5" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-body-sm text-destructive">
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardNavbar;