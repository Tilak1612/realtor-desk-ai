import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Sidebar, type SidebarItem } from "./Sidebar";
import { TopNav } from "./TopNav";
import { useWorkspaceIdentity } from "@/hooks/rd/useWorkspaceIdentity";

// Full product shell. Renders the sidebar + topbar + scrollable main
// region. Drop this at the root of each /app/* page. The child region
// owns its own padding so dense tables (leads) and padded dashboards
// can coexist without fighting the shell.

interface AppShellProps {
  children: ReactNode;
  /** Optional override for the sidebar nav items. */
  sidebarItems?: SidebarItem[];
  /** Current user's display name; drives topbar avatar + sidebar workspace. */
  agentName?: string;
  /** Workspace metadata for the sidebar card. */
  workspace?: { name: string; tier: string; mark: string };
  hasUnread?: boolean;
}

export function AppShell({
  children,
  sidebarItems,
  agentName,
  workspace,
  hasUnread = true,
}: AppShellProps) {
  // Identity comes from the signed-in profile. Props still win so a caller
  // (or a story/test) can override, but there is no fabricated default.
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  // Close on route change and on Escape. Without the route handler the
  // drawer stays open behind the new page after a nav click.
  useEffect(() => setNavOpen(false), [location.pathname]);
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setNavOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navOpen]);

  const identity = useWorkspaceIdentity();
  const resolvedAgent = agentName ?? identity.agentName;
  const resolvedWorkspace = workspace ?? identity.workspace;

  // Route-level titles. Every /app page previously reused the marketing
  // <title>, so a signed-in dashboard tab could read "Sign in — Realtor
  // Desk" — wrong for tab-switching and for anyone with ten tabs open.
  const { t } = useTranslation();
  const TITLES: Record<string, string> = {
    "/app": t("rd.titles.dashboard", "Dashboard"),
    "/app/leads": t("rd.titles.leads", "Leads"),
    "/app/pipeline": t("rd.titles.pipeline", "Pipeline"),
    "/app/inbox": t("rd.titles.inbox", "Conversations"),
    "/app/automation": t("rd.titles.automation", "Automation"),
    "/app/reports": t("rd.titles.reports", "Reports"),
    "/app/settings": t("rd.titles.settings", "Settings"),
  };
  const base = "/" + location.pathname.split("/").slice(1, 3).join("/");
  const pageTitle = TITLES[location.pathname] ?? TITLES[base] ?? t("rd.titles.app", "App");

  return (
    <div className="rd-reset h-screen bg-rd-paper text-rd-ink-900 flex overflow-hidden">
      <Helmet>
        <title>{pageTitle} · RealtorDesk AI</title>
      </Helmet>
      {/* Backdrop. Below lg only; the rail is static from lg up. */}
      {navOpen && (
        <div
          className="fixed inset-0 z-40 bg-rd-ink-950/50 lg:hidden"
          onClick={() => setNavOpen(false)}
          aria-hidden="true"
        />
      )}
      <Sidebar
        items={sidebarItems}
        workspace={resolvedWorkspace}
        open={navOpen}
        onClose={() => setNavOpen(false)}
      />
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopNav
          agent={{ name: resolvedAgent }}
          hasUnread={hasUnread}
          onMenuClick={() => setNavOpen(true)}
        />
        <div className="flex-1 overflow-y-auto overflow-x-hidden">{children}</div>
      </main>
    </div>
  );
}
