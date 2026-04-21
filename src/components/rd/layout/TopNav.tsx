import { RDInput } from "../Input";
import { RDBadge } from "../Badge";
import { RDAvatar } from "../Avatar";
import { IconBell, IconDot, IconSearch } from "../icons";

// Product topbar (AppShell topbar in rd-app.jsx). Command search, a live
// status pill, EN/FR toggle readout, bell with unread dot, and the
// current agent's avatar.

interface TopNavProps {
  agent: { name: string };
  hasUnread?: boolean;
  /** Visual state only for Phase 1 — wiring lands in a later phase. */
  isLive?: boolean;
}

export function TopNav({ agent, hasUnread = true, isLive = true }: TopNavProps) {
  return (
    <div className="flex items-center gap-4 px-7 py-3.5 border-b border-rd-line bg-white">
      {/* Command search */}
      <div className="flex-1 max-w-[420px]">
        <RDInput
          variant="inset"
          placeholder="Search leads, listings, conversations…"
          leading={<IconSearch />}
          trailing={<span className="text-[11px] text-rd-ink-400 font-rd-mono">⌘K</span>}
        />
      </div>

      <div className="ml-auto flex items-center gap-3.5">
        {isLive && (
          <RDBadge tone="success" size="sm">
            <IconDot />
            Live
          </RDBadge>
        )}
        <div className="text-xs font-semibold text-rd-ink-600 flex gap-1.5" aria-label="Language">
          <span className="text-rd-ink-900">EN</span>
          <span className="opacity-40">/</span>
          <span>FR</span>
        </div>
        <button
          type="button"
          className="relative w-[30px] h-[30px] bg-rd-ink-50 rounded-rd-sm flex items-center justify-center text-rd-ink-600 hover:bg-rd-ink-100"
          aria-label="Notifications"
        >
          <IconBell />
          {hasUnread && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rd-terra-600 rounded-full" />
          )}
        </button>
        <RDAvatar name={agent.name} size={30} />
      </div>
    </div>
  );
}
