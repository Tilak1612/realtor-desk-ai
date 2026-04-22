import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { RDWordmark } from "../Logo";
import {
  IconHome,
  IconLead,
  IconMail,
  IconPipeline,
  IconCalendar,
  IconPie,
  IconCog,
  IconChevron,
  IconSparkles,
} from "../icons";

// Sidebar for /app/*. Matches rd-app.jsx AppShell sidebar — navy surface,
// workspace card, active route highlight with terra accent on the icon,
// optional count pill on each item, and a "Desk AI on duty" footer card.

export interface SidebarItem {
  label: string;
  to: string;
  icon: ReactNode;
  count?: number | string;
}

interface SidebarProps {
  workspace?: {
    name: string;
    tier: string;
    /** 2-letter mark shown in the small terra square. */
    mark: string;
  };
  items?: SidebarItem[];
  deskStatus?: {
    leadsThisWeek: number;
    avgResponse: string;
  };
}

export function Sidebar({
  workspace,
  items,
  deskStatus = { leadsThisWeek: 47, avgResponse: "38s" },
}: SidebarProps) {
  const location = useLocation();
  const { t } = useTranslation();

  const resolvedItems: SidebarItem[] = items ?? [
    { label: t("rd.sidebar.nav.dashboard", "Dashboard"), to: "/app", icon: <IconHome /> },
    { label: t("rd.sidebar.nav.leads", "Leads"), to: "/app/leads", icon: <IconLead /> },
    { label: t("rd.sidebar.nav.conversations", "Conversations"), to: "/app/inbox", icon: <IconMail /> },
    { label: t("rd.sidebar.nav.pipeline", "Pipeline"), to: "/app/pipeline", icon: <IconPipeline /> },
    { label: t("rd.sidebar.nav.automation", "Automation"), to: "/app/automation", icon: <IconCalendar /> },
    { label: t("rd.sidebar.nav.reports", "Reports"), to: "/app/reports", icon: <IconPie /> },
    { label: t("rd.sidebar.nav.settings", "Settings"), to: "/app/settings", icon: <IconCog /> },
  ];

  const resolvedWorkspace = workspace ?? {
    name: "Royal LePage · Sarah K.",
    tier: t("rd.sidebar.workspaceTier", "Team plan"),
    mark: "RL",
  };

  return (
    <aside className="h-full w-[240px] flex-shrink-0 bg-rd-navy-800 text-white px-3.5 py-5 flex flex-col gap-1">
      {/* Brand + collapse chevron */}
      <div className="flex items-center justify-between px-2.5 pb-4">
        {/* In-app chrome keeps the AI suffix; marketing surfaces use the
            plain "Realtor Desk" wordmark per the 2026-04 revision. */}
        <RDWordmark size={16} tone="paper" showAI />
        <button
          type="button"
          aria-label={t("rd.sidebar.collapse", "Collapse sidebar")}
          className="w-[22px] h-[22px] rounded-md bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/15"
        >
          <IconChevron />
        </button>
      </div>

      {/* Workspace card */}
      <div className="mx-1 mb-4 p-2.5 bg-white/[0.06] border border-white/10 rounded-rd-md flex items-center gap-2.5">
        <div className="w-[26px] h-[26px] rounded-[7px] bg-rd-terra-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
          {resolvedWorkspace.mark}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold truncate">{resolvedWorkspace.name}</div>
          <div className="text-[10px] text-white/50">{resolvedWorkspace.tier}</div>
        </div>
        <IconChevron className="text-white/50" />
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5">
        {resolvedItems.map((item) => {
          // Simple prefix match so /app/leads/123 keeps Leads active.
          const active =
            item.to === "/app"
              ? location.pathname === "/app"
              : location.pathname === item.to || location.pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-2.5 px-3 py-[9px] rounded-md text-[13px] font-medium transition-colors",
                active
                  ? "bg-white/[0.12] text-white"
                  : "text-white/70 hover:text-white hover:bg-white/[0.05]"
              )}
            >
              <span className={cn("flex", active ? "text-rd-terra-400" : "text-white/50")}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.count !== undefined && (
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-[2px] rounded-[10px]",
                    active ? "bg-rd-terra-600 text-white" : "bg-white/10 text-white/80"
                  )}
                >
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Desk AI status */}
      <div className="mt-auto p-3 bg-white/[0.04] border border-white/[0.06] rounded-rd-md">
        <div className="flex items-center gap-2 mb-2">
          <IconSparkles className="text-rd-terra-400 w-3 h-3" />
          <span className="text-[11px] font-semibold">
            {t("rd.sidebar.desk.title", "Desk AI · on duty")}
          </span>
        </div>
        <div className="text-[10px] text-white/55 leading-[1.4]">
          {t("rd.sidebar.desk.summary", "Answered {{count}} leads this week. Avg response {{response}}.", {
            count: deskStatus.leadsThisWeek,
            response: deskStatus.avgResponse,
          })}
        </div>
      </div>
    </aside>
  );
}
