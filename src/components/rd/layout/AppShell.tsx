import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
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

  return (
    <div className="rd-reset h-screen bg-rd-paper text-rd-ink-900 flex overflow-hidden">
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
