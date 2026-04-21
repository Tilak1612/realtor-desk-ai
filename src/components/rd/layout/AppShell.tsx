import type { ReactNode } from "react";
import { Sidebar, type SidebarItem } from "./Sidebar";
import { TopNav } from "./TopNav";

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
  agentName = "Sarah Khoury",
  workspace,
  hasUnread = true,
}: AppShellProps) {
  return (
    <div className="rd-reset h-screen bg-rd-paper text-rd-ink-900 flex overflow-hidden">
      <Sidebar items={sidebarItems} workspace={workspace} />
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopNav agent={{ name: agentName }} hasUnread={hasUnread} />
        <div className="flex-1 overflow-y-auto overflow-x-hidden">{children}</div>
      </main>
    </div>
  );
}
