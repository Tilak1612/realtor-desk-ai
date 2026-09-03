import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { RDBadge } from "../Badge";
import { RDAvatar } from "../Avatar";
import { IconDot, IconMenu } from "../icons";
import { cn } from "@/lib/utils";

// Product topbar (AppShell topbar in rd-app.jsx). Command search, a live
// status pill, EN/FR toggle (now wired to i18n.changeLanguage), bell
// with unread dot, and the current agent's avatar.
//
// The avatar is now a real account menu. Before this there was NO sign-out
// anywhere in the /app shell — `grep signOut src/components/rd src/pages/rd`
// returned nothing, and the only control lived on the legacy Settings page.
// On a shared brokerage machine that is a security problem, not a convenience
// gap. The menu also surfaces Settings and Billing, which were otherwise
// unreachable without leaving the shell.

interface TopNavProps {
  agent: { name: string };
  /** Opens the mobile nav drawer. Only rendered below lg. */
  onMenuClick?: () => void;
  /** Visual state only — true means the AI side is online. */
  isLive?: boolean;
}

// hasUnread and isLive both defaulted to TRUE and no caller ever passed
// either, so every page rendered a green "Live" pill and a red unread dot
// permanently -- for a notification system that does not exist. Defaulting
// to false means the indicators only ever appear if something real sets them.
export function TopNav({ agent, isLive = false, onMenuClick }: TopNavProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const active = (i18n.language || "en").toLowerCase().startsWith("fr") ? "fr" : "en";

  function setLang(next: "en" | "fr") {
    if (next !== active) void i18n.changeLanguage(next);
  }

  return (
    <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-7 py-3.5 border-b border-rd-line bg-white">
      {/* Drawer toggle — the only way into navigation below lg. */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label={t("rd.topnav.openNav", "Open navigation")}
        aria-controls="rd-app-nav"
        className="lg:hidden -ml-1 w-9 h-9 rounded-md flex items-center justify-center text-rd-ink-600 hover:bg-rd-ink-100 flex-shrink-0"
      >
        <IconMenu />
      </button>

      {/* Command search removed. It was the most prominent control in the
          product and had no value, no onChange and no handler — typing into it
          did nothing at all. A decorative search box on a CRM is worse than no
          search box, because it is the first thing an agent reaches for.
          Restore it with a real query implementation, not before. */}
      <div className="flex-1 min-w-0" />

      <div className="ml-auto flex items-center gap-3.5">
        {isLive && (
          <RDBadge tone="success" size="sm" className="hidden sm:inline-flex">
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
        {/* Notification bell removed: it had no onClick, and there is no
            notification system behind it (see AppShell). It rendered as a live
            control that silently did nothing. */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              aria-label={t("rd.topnav.account", "Account menu")}
              className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-navy-400 focus-visible:ring-offset-2"
            >
              <RDAvatar name={agent.name} size={30} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 min-w-[13rem] rounded-rd-sm border border-rd-line bg-white p-1 shadow-[0_8px_24px_rgba(11,37,64,0.12)]"
            >
              <div className="px-3 py-2 border-b border-rd-line mb-1">
                <div className="text-[13px] font-semibold text-rd-ink-900 truncate">{agent.name}</div>
              </div>
              <DropdownMenu.Item asChild>
                <Link
                  to="/app/settings"
                  className="block px-3 py-2 text-[13px] text-rd-ink-700 rounded-rd-sm outline-none hover:bg-rd-ink-50 data-[highlighted]:bg-rd-ink-50 cursor-pointer"
                >
                  {t("rd.topnav.settings", "Settings")}
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <Link
                  to="/billing"
                  className="block px-3 py-2 text-[13px] text-rd-ink-700 rounded-rd-sm outline-none hover:bg-rd-ink-50 data-[highlighted]:bg-rd-ink-50 cursor-pointer"
                >
                  {t("rd.topnav.billing", "Plan & billing")}
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-rd-line my-1" />
              <DropdownMenu.Item
                onSelect={async () => {
                  // Imported lazily: a module-level import would drag the
                  // Supabase client into this layout component's module graph,
                  // which then throws "supabaseUrl is required" anywhere the
                  // env is absent — including the component tests in CI.
                  const { supabase } = await import("@/integrations/supabase/client");
                  await supabase.auth.signOut();
                  navigate("/login", { replace: true });
                }}
                className="px-3 py-2 text-[13px] text-rd-danger rounded-rd-sm outline-none hover:bg-rd-danger-bg data-[highlighted]:bg-rd-danger-bg cursor-pointer"
              >
                {t("rd.topnav.signOut", "Sign out")}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
}
