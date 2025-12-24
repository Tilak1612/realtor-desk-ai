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
import { Bell, Search, User, Settings, LogOut, Plus, Building2, Briefcase, CheckSquare } from "lucide-react";
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
    <header className="sticky top-0 z-30 h-14 border-b border-border bg-card">
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        {/* Spacer for mobile menu button */}
        <div className="w-12 lg:hidden" />
        
        {/* Search Bar - Hidden on very small screens, visible on sm+ */}
        <form onSubmit={handleSearch} className="hidden sm:block flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contacts, properties, deals..."
              className="pl-9 h-9 text-sm bg-background border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Right side actions */}
        <div className="flex items-center gap-1 sm:gap-2 ml-auto">
          {/* Mobile Search Button */}
          <Button variant="ghost" size="icon" className="sm:hidden h-8 w-8">
            <Search className="h-4 w-4" />
          </Button>

          {/* Quick Add Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="h-8 gap-1.5 text-sm">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => handleQuickAdd("contact")} className="cursor-pointer text-sm">
                <User className="mr-2 h-4 w-4" />
                Contact
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleQuickAdd("property")} className="cursor-pointer text-sm">
                <Building2 className="mr-2 h-4 w-4" />
                Property
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleQuickAdd("deal")} className="cursor-pointer text-sm">
                <Briefcase className="mr-2 h-4 w-4" />
                Deal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleQuickAdd("task")} className="cursor-pointer text-sm">
                <CheckSquare className="mr-2 h-4 w-4" />
                Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-8 w-8">
                <Bell className="h-4 w-4" />
                {notificationCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel className="text-sm">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-1 p-1">
                <div className="p-2 hover:bg-accent rounded-md cursor-pointer">
                  <p className="text-sm font-medium">New lead: John Smith</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
                <div className="p-2 hover:bg-accent rounded-md cursor-pointer">
                  <p className="text-sm font-medium">Task due: Follow up with client</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
                <div className="p-2 hover:bg-accent rounded-md cursor-pointer">
                  <p className="text-sm font-medium">Deal closed: $450,000</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-sm">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {profile?.full_name ? getInitials(profile.full_name) : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{profile?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer text-sm">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer text-sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-sm text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
