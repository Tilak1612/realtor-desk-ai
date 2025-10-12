import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  Bot,
  Mail,
  Calendar,
  TrendingUp,
  MapPin,
  Settings,
  Menu,
  X,
  Sparkles,
  CreditCard,
} from "lucide-react";
import logo from "@/assets/realtor-desk-logo.png";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Contacts", path: "/contacts" },
  { icon: Briefcase, label: "Deals", path: "/app/deals" },
  { icon: CheckSquare, label: "Tasks", path: "/app/tasks" },
  { icon: Bot, label: "AI Chatbot", path: "/chatbot" },
  { icon: Mail, label: "Campaigns", path: "/campaigns" },
  { icon: Calendar, label: "Calendar", path: "/calendar" },
  { icon: TrendingUp, label: "Reports", path: "/reports" },
  { icon: MapPin, label: "Market Intelligence", path: "/market" },
  { icon: CreditCard, label: "Billing", path: "/app/billing" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

interface DashboardSidebarProps {
  trialDaysLeft?: number;
}

const DashboardSidebar = ({ trialDaysLeft = 60 }: DashboardSidebarProps) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background border rounded-lg shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-background border-r flex flex-col transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-3 p-6 border-b hover:bg-accent/50 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <img src={logo} alt="Realtor Desk AI" className="h-10 w-auto" />
          <span className="text-lg font-bold gradient-text">Realtor Desk AI</span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive(item.path)
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-accent text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Upgrade Badge */}
        {trialDaysLeft > 0 && (
          <div className="p-4 border-t">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <Badge variant="secondary" className="font-semibold">
                  Trial Active
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{trialDaysLeft} days</span> left in your
                trial
              </p>
              <Link to="/app/billing">
                <Button className="w-full btn-gradient" size="sm">
                  Upgrade Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default DashboardSidebar;
