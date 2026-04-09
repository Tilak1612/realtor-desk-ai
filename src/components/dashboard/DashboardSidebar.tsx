import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  Building2,
  Zap,
  Plug,
} from "lucide-react";
import logo from "@/assets/realtor-desk-icon.png";

interface DashboardSidebarProps {
  trialDaysLeft?: number;
}

interface EntityCounts {
  contacts: number;
  properties: number;
  deals: number;
}

const DashboardSidebar = ({ trialDaysLeft = 60 }: DashboardSidebarProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [counts, setCounts] = useState<EntityCounts>({ contacts: 0, properties: 0, deals: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;
      
      const [contactsRes, propertiesRes, dealsRes] = await Promise.all([
        supabase.from("contacts").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("property_listings").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("deals").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("status", "active"),
      ]);

      setCounts({
        contacts: contactsRes.count || 0,
        properties: propertiesRes.count || 0,
        deals: dealsRes.count || 0,
      });
    };

    fetchCounts();
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: t('app.sidebar.today', 'Today'), path: "/today", featured: true },
    { icon: Users, label: t('app.sidebar.contacts'), path: "/contacts", count: counts.contacts },
    { icon: Briefcase, label: t('app.sidebar.deals'), path: "/deals", count: counts.deals },
    { icon: Mail, label: t('app.sidebar.campaigns'), path: "/campaigns" },
    { icon: Calendar, label: t('app.sidebar.calendar'), path: "/calendar" },
    { icon: TrendingUp, label: t('app.sidebar.reports'), path: "/reports" },
    { icon: Settings, label: t('app.sidebar.settings'), path: "/settings" },
  ];

  const advancedItems = [
    { icon: Bot, label: t('app.sidebar.aiAssistant'), path: "/ai-assistant" },
    { icon: Zap, label: t('app.sidebar.automations', 'Automations'), path: "/automations" },
    { icon: Building2, label: t('app.sidebar.properties'), path: "/properties", count: counts.properties },
    { icon: MapPin, label: t('app.sidebar.market'), path: "/market" },
    { icon: CheckSquare, label: t('app.sidebar.tasks'), path: "/tasks" },
    { icon: CreditCard, label: t('app.sidebar.billing'), path: "/billing" },
    { icon: Plug, label: t('app.sidebar.integrations', 'Integrations'), path: "/dashboard/integrations" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button - Fixed position, always visible on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2.5 bg-card border border-border rounded-lg shadow-lg"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <Link
          to="/today"
          className="flex items-center gap-2.5 h-14 px-4 border-b border-border hover:bg-accent/50 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <img src={logo} alt="Realtor Desk" className="h-7 w-auto" />
          <span className="text-sm font-semibold text-foreground">Realtor Desk</span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <div className="space-y-4">
            {/* Main Navigation */}
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all duration-150 text-sm ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </span>
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      isActive(item.path)
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-white/10 text-white/50"
                    }`}>
                      {item.count}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Advanced Section */}
            <div className="space-y-1">
              <div className="px-3 py-2 flex items-center gap-2">
                <div className="flex-1 h-px bg-white/10" />
                <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                  {t('app.sidebar.advanced', 'Advanced')}
                </h3>
              </div>
              {advancedItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all duration-150 text-sm ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </span>
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      isActive(item.path)
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-white/10 text-white/50"
                    }`}>
                      {item.count}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Upgrade Badge */}
        {trialDaysLeft > 0 && (
          <div className="p-3 border-t border-border">
            <div className="bg-accent/50 p-3 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <Badge variant="secondary" className="text-xs font-medium">
                  {t('app.sidebar.trialActive')}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{trialDaysLeft}</span> {t('app.sidebar.daysLeft')}
              </p>
              <Link to="/billing">
                <Button className="w-full h-8 text-xs" size="sm">
                  {t('app.sidebar.upgradeNow')}
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
