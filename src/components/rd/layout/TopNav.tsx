import { useTranslation } from "react-i18next";
import { RDInput } from "../Input";
import { RDBadge } from "../Badge";
import { RDAvatar } from "../Avatar";
import { IconBell, IconDot, IconSearch } from "../icons";
import { cn } from "@/lib/utils";

// Product topbar (AppShell topbar in rd-app.jsx). Command search, a live
// status pill, EN/FR toggle (now wired to i18n.changeLanguage), bell
// with unread dot, and the current agent's avatar.

interface TopNavProps {
  agent: { name: string };
  hasUnread?: boolean;
  /** Visual state only — true means the AI side is online. */
  isLive?: boolean;
}

export function TopNav({ agent, hasUnread = true, isLive = true }: TopNavProps) {
  const { t, i18n } = useTranslation();
  const active = (i18n.language || "en").toLowerCase().startsWith("fr") ? "fr" : "en";

  function setLang(next: "en" | "fr") {
    if (next !== active) void i18n.changeLanguage(next);
  }

  return (
    <div className="flex items-center gap-4 px-7 py-3.5 border-b border-rd-line bg-white">
      {/* Command search */}
      <div className="flex-1 max-w-[420px]">
        <RDInput
          variant="inset"
          placeholder={t("rd.topnav.search", "Search leads, listings, conversations…")}
          leading={<IconSearch />}
          trailing={<span className="text-[11px] text-rd-ink-400 font-rd-mono">⌘K</span>}
        />
      </div>

      <div className="ml-auto flex items-center gap-3.5">
        {isLive && (
          <RDBadge tone="success" size="sm">
            <IconDot />
            {t("rd.topnav.live", "Live")}
          </RDBadge>
        )}
        <div
          className="text-xs font-semibold text-rd-ink-600 flex gap-1.5"
          role="group"
          aria-label={t("rd.topnav.language", "Language")}
        >
          <button
            type="button"
            onClick={() => setLang("en")}
            className={cn(
              "cursor-pointer transition-colors",
              active === "en" ? "text-rd-ink-900" : "opacity-40 hover:opacity-80"
            )}
            aria-pressed={active === "en"}
          >
            EN
          </button>
          <span className="opacity-40">/</span>
          <button
            type="button"
            onClick={() => setLang("fr")}
            className={cn(
              "cursor-pointer transition-colors",
              active === "fr" ? "text-rd-ink-900" : "opacity-40 hover:opacity-80"
            )}
            aria-pressed={active === "fr"}
          >
            FR
          </button>
        </div>
        <button
          type="button"
          className="relative w-[30px] h-[30px] bg-rd-ink-50 rounded-rd-sm flex items-center justify-center text-rd-ink-600 hover:bg-rd-ink-100"
          aria-label={t("rd.topnav.notifications", "Notifications")}
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
