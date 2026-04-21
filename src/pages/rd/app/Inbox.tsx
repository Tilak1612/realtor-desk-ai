import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/rd/layout/AppShell";
import {
  RDButton,
  RDBadge,
  RDAvatar,
  IconSparkles,
  IconSearch,
  IconPhone,
  IconCalendar,
} from "@/components/rd";
import { MOCK_LEADS, MOCK_CONVERSATIONS } from "@/data/rd";
import type { ConversationMessage, Lead } from "@/types/rd";
import { cn } from "@/lib/utils";
import { useLeads } from "@/hooks/rd/useLeads";
import {
  useConversation,
  useInboxThreads,
  useSendMessage,
} from "@/hooks/rd/useConversation";

// /app/inbox — conversations list + active thread per rd-app-extra.jsx
// Artboard_Inbox.
//
// Data sources (Phase D):
//   - Lead list   : useLeads() (from Phase A); falls back to MOCK_LEADS
//                   while the user has no contacts so the page is still
//                   legible during onboarding.
//   - Latest msg  : useInboxThreads() returns a map leadId → last message,
//                   used to drive preview + unread state; falls back to
//                   MOCK_CONVERSATIONS when no live messages exist.
//   - Active pane : useConversation(activeId) for the full thread.
//   - Composer    : useSendMessage() posts an agent-authored row.

type FilterKey = "all" | "unread" | "ai" | "mine";

export default function Inbox() {
  const { leads: liveLeads, loading: leadsLoading } = useLeads();
  const { latestByLead } = useInboxThreads();
  const leadSource: Lead[] = !leadsLoading && liveLeads.length > 0 ? liveLeads : MOCK_LEADS;

  const threadsWithConversations = useMemo(() => {
    return leadSource.filter((l) => latestByLead[l.id] || MOCK_CONVERSATIONS[l.id]?.length);
  }, [leadSource, latestByLead]);

  const [activeId, setActiveId] = useState<string>(
    threadsWithConversations[0]?.id ?? leadSource[0]?.id ?? ""
  );
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  const threads = useMemo(() => {
    let items = leadSource;
    if (filter === "ai") items = items.filter((l) => l.aiHandling);
    if (filter === "mine") items = items.filter((l) => !l.aiHandling);
    if (filter === "unread") {
      items = items.filter((l) => {
        const last = latestByLead[l.id] ?? MOCK_CONVERSATIONS[l.id]?.slice(-1)[0];
        return last?.author === "lead";
      });
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      items = items.filter((l) => l.name.toLowerCase().includes(q));
    }
    return items;
  }, [filter, query, leadSource, latestByLead]);

  const activeLead = leadSource.find((l) => l.id === activeId);

  return (
    <AppShell>
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] h-full overflow-hidden">
        <ThreadList
          threads={threads}
          activeId={activeId}
          onSelect={setActiveId}
          filter={filter}
          onFilter={setFilter}
          query={query}
          onQuery={setQuery}
          latestByLead={latestByLead}
        />
        <ActivePane lead={activeLead} />
      </div>
    </AppShell>
  );
}

/* ────────────────────────────────────────────────────────── */

function ThreadList({
  threads,
  activeId,
  onSelect,
  filter,
  onFilter,
  query,
  onQuery,
  latestByLead,
}: {
  threads: Lead[];
  activeId: string;
  onSelect: (id: string) => void;
  filter: FilterKey;
  onFilter: (f: FilterKey) => void;
  query: string;
  onQuery: (q: string) => void;
  latestByLead: Record<string, ConversationMessage>;
}) {
  const { t } = useTranslation();
  // Unread = most recent message in a thread was authored by the lead.
  const unreadCount = threads.filter((l) => {
    const last = latestByLead[l.id] ?? MOCK_CONVERSATIONS[l.id]?.slice(-1)[0];
    return last?.author === "lead" && l.id !== activeId;
  }).length;
  return (
    <div className="flex flex-col border-r border-rd-line bg-white overflow-hidden min-h-0">
      <div className="px-5 py-4 border-b border-rd-line">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">
            {t("rd.pages.inbox.title", "Conversations")}
          </h2>
          <RDBadge tone="terra" size="sm">
            {t("rd.common.unreadCount", "{{count}} unread", { count: unreadCount })}
          </RDBadge>
        </div>
        <div className="flex items-center gap-2 bg-rd-ink-50 border border-rd-line rounded-rd-sm px-3 py-1.5 text-rd-ink-500">
          <IconSearch />
          <input
            type="text"
            placeholder={t("rd.inbox.searchConversations", "Search conversations…")}
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[13px] text-rd-ink-900 placeholder:text-rd-ink-400"
          />
        </div>
        <div className="flex gap-1.5 mt-3">
          {(["all", "unread", "ai", "mine"] as const).map((f) => {
            const label =
              f === "all"
                ? t("rd.tabs.inbox.all", "All")
                : f === "unread"
                ? t("rd.tabs.inbox.unread", "Unread")
                : f === "ai"
                ? t("rd.tabs.inbox.ai", "AI")
                : t("rd.tabs.inbox.mine", "Mine");
            return (
              <button
                key={f}
                type="button"
                onClick={() => onFilter(f)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-semibold rounded-rd-pill border transition-colors",
                  filter === f
                    ? "bg-rd-navy-800 text-white border-rd-navy-800"
                    : "bg-transparent text-rd-ink-600 border-rd-line"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {threads.length === 0 && (
          <div className="p-6 text-center text-sm text-rd-ink-500">
            {t("rd.common.noConversationsMatch", "No conversations match.")}
          </div>
        )}
        {threads.map((lead) => (
          <ThreadRow
            key={lead.id}
            lead={lead}
            active={lead.id === activeId}
            onSelect={() => onSelect(lead.id)}
            lastMessage={latestByLead[lead.id]}
          />
        ))}
      </div>
    </div>
  );
}

function ThreadRow({
  lead,
  active,
  onSelect,
  lastMessage,
}: {
  lead: Lead;
  active: boolean;
  onSelect: () => void;
  lastMessage: ConversationMessage | undefined;
}) {
  const last = lastMessage ?? MOCK_CONVERSATIONS[lead.id]?.slice(-1)[0];
  const preview = last?.body ?? "No messages yet.";
  const timeLabel = last ? new Date(last.sentAt).toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" }) : lead.lastActivity;
  const hasUnread = !active && last?.author === "lead";

  const stageLabel = lead.score >= 80 ? "Hot" : lead.score >= 60 ? "Warm" : "Cold";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full text-left px-5 py-3.5 border-b border-rd-line flex gap-3 transition-colors",
        active ? "bg-rd-navy-100 border-l-[3px] border-l-rd-navy-800" : "border-l-[3px] border-l-transparent",
        hasUnread && !active && "bg-rd-paper-2"
      )}
    >
      <div className="relative flex-shrink-0">
        <RDAvatar name={lead.name} size={38} />
        {lead.aiHandling && (
          <div
            title="AI handling"
            className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-rd-terra-600 text-white border-2 border-white rounded-full flex items-center justify-center"
          >
            <IconSparkles className="w-[8px] h-[8px]" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={cn("text-[13px] truncate", hasUnread ? "font-bold" : "font-semibold")}>
              {lead.name}
            </span>
            <span
              className={cn(
                "text-[9px] font-bold tracking-[0.06em] rounded-[3px] px-1 py-[1px] flex-shrink-0",
                lead.language === "FR"
                  ? "bg-rd-terra-100 text-rd-terra-800"
                  : "bg-rd-navy-100 text-rd-navy-800"
              )}
            >
              {lead.language}
            </span>
          </div>
          <span className="text-[10px] text-rd-ink-500 font-semibold flex-shrink-0">{timeLabel}</span>
        </div>
        <div
          className={cn(
            "text-xs leading-[1.4] truncate",
            hasUnread ? "text-rd-ink-800" : "text-rd-ink-500"
          )}
        >
          {preview}
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span
            className={cn(
              "text-[9px] font-bold tracking-[0.04em] rounded-[3px] px-1.5 py-[1px]",
              stageLabel === "Hot" && "bg-rd-terra-100 text-rd-terra-800",
              stageLabel === "Warm" && "bg-rd-navy-100 text-rd-navy-800",
              stageLabel === "Cold" && "bg-rd-ink-100 text-rd-ink-700"
            )}
          >
            {stageLabel} · {lead.score}
          </span>
        </div>
      </div>
    </button>
  );
}

/* ────────────────────────────────────────────────────────── */

function ActivePane({ lead }: { lead: Lead | undefined }) {
  const { t } = useTranslation();
  const { messages: liveMessages } = useConversation(lead?.id);
  const mockMessages = lead ? MOCK_CONVERSATIONS[lead.id] ?? [] : [];
  const messages: ConversationMessage[] =
    liveMessages.length > 0 ? liveMessages : mockMessages;

  const send = useSendMessage();
  const [draft, setDraft] = useState("");
  const canSend = !!lead && draft.trim().length > 0 && !send.isPending;

  const handleSend = () => {
    if (!lead) return;
    const body = draft.trim();
    if (!body) return;
    send.mutate(
      { leadId: lead.id, body, language: lead.language },
      { onSuccess: () => setDraft("") }
    );
  };

  if (!lead) {
    return (
      <div className="flex items-center justify-center h-full bg-rd-paper-2 text-rd-ink-500 text-sm">
        {t("rd.inbox.selectConversation", "Select a conversation from the left.")}
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden bg-rd-paper-2 min-h-0">
      {/* Active header */}
      <div className="px-7 py-3.5 border-b border-rd-line bg-white flex items-center gap-3.5 flex-wrap">
        <RDAvatar name={lead.name} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[15px] font-semibold">{lead.name}</span>
            <RDBadge
              tone={lead.score >= 80 ? "terra" : lead.score >= 60 ? "navy" : "neutral"}
              size="sm"
            >
              {lead.score >= 80 ? "Hot" : lead.score >= 60 ? "Warm" : "Cold"} · {lead.score}
            </RDBadge>
            <span className="text-[11px] text-rd-ink-500">· {lead.listing}</span>
          </div>
          <div className="text-[11px] text-rd-ink-500 mt-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rd-success" />
            {t("rd.common.active", "Active")} ·{" "}
            {lead.aiHandling
              ? t("rd.inbox.deskAiReplying", "Desk AI replying")
              : t("rd.inbox.manualHandling", "Manual handling")}
          </div>
        </div>
        <div className="flex gap-1.5">
          <IconActionBtn aria-label={t("rd.actions.call", "Call")}>
            <IconPhone />
          </IconActionBtn>
          <IconActionBtn aria-label={t("rd.actions.bookShowing", "Book showing")}>
            <IconCalendar />
          </IconActionBtn>
          <RDButton variant="terra" size="sm" icon={<IconSparkles />}>
            {t("rd.actions.takeOver", "Take over")}
          </RDButton>
        </div>
      </div>

      {/* Thread */}
      <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-3.5">
        {messages.length === 0 && (
          <div className="text-center text-sm text-rd-ink-500 py-10">
            {t(
              "rd.inbox.emptyThread",
              "No messages yet. When a lead replies to a drip or sends a chat, it appears here."
            )}
          </div>
        )}
        {messages.map((m, i) => (
          <MsgBubble key={m.id} message={m} flag={i === messages.length - 1 && m.author === "lead"} />
        ))}
      </div>

      {/* Suggested reply + composer */}
      <div className="px-7 py-3.5 border-t border-rd-line bg-white">
        <div className="bg-rd-terra-100 border border-rd-terra-200 rounded-[10px] px-3.5 py-2.5 mb-3 flex items-center gap-2.5 text-xs">
          <IconSparkles className="text-rd-terra-600 flex-shrink-0" />
          <span className="text-rd-terra-900 flex-1">
            <strong className="font-semibold">
              {t("rd.inbox.suggestedReply", "Suggested reply:")}
            </strong>{" "}
            "Hi {lead.name.split(" ")[0]} — Sarah here. I'm free today between 2–4 PM PST. Does a quick call at 2:30 work?"
          </span>
          <button
            type="button"
            className="text-[11px] font-bold bg-rd-terra-600 text-white px-2.5 py-1 rounded-rd-sm"
          >
            {t("rd.actions.use", "Use")}
          </button>
        </div>
        <div className="border border-rd-line rounded-[12px] px-3.5 py-2.5">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && canSend) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={t("rd.inbox.composerPlaceholder", "Type a message to the lead…")}
            rows={2}
            className="w-full bg-transparent outline-none text-[13px] text-rd-ink-900 placeholder:text-rd-ink-400 resize-none min-h-[36px]"
          />
          {send.error && (
            <div className="text-[11px] text-rd-danger">{send.error.message}</div>
          )}
          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-4 text-xs text-rd-ink-600">
              <button type="button" className="inline-flex items-center gap-1.5 font-semibold">
                <IconSparkles className="w-3 h-3" />
                {t("rd.actions.draftWithAi", "Draft with AI")}
              </button>
              <button type="button" className="font-semibold">
                {t("rd.actions.attachListing", "Attach listing")}
              </button>
            </div>
            <RDButton
              variant="primary"
              size="sm"
              onClick={handleSend}
              disabled={!canSend}
            >
              {send.isPending
                ? t("rd.actions.sending", "Sending…")
                : t("rd.actions.send", "Send")}
            </RDButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconActionBtn({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="w-8 h-8 border border-rd-line bg-white rounded-rd-sm flex items-center justify-center text-rd-ink-600 hover:bg-rd-ink-50"
      {...rest}
    >
      {children}
    </button>
  );
}

function MsgBubble({ message, flag }: { message: ConversationMessage; flag: boolean }) {
  const { author, authorName, body, sentAt, language } = message;
  const time = new Date(sentAt).toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" });

  if (author === "system") {
    return (
      <div className="text-center text-[11px] text-rd-ink-500 italic py-1">
        {message.systemNote ?? body}
      </div>
    );
  }

  const isSelf = author === "agent" || author === "ai";
  const isAI = author === "ai";

  return (
    <div className={cn("flex gap-2.5 items-start", isSelf ? "flex-row-reverse" : "flex-row")}>
      {!isSelf ? (
        <RDAvatar name={authorName} size={28} />
      ) : (
        <div
          className={cn(
            "w-7 h-7 rounded-full text-white flex items-center justify-center flex-shrink-0",
            isAI ? "bg-rd-terra-600" : "bg-rd-navy-800"
          )}
        >
          {isAI ? <IconSparkles /> : authorName.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="max-w-[72%]">
        <div
          className={cn(
            "flex items-center gap-2 mb-1 text-[11px] text-rd-ink-500",
            isSelf ? "flex-row-reverse" : "flex-row"
          )}
        >
          <span className="font-semibold text-rd-ink-700">
            {isAI ? "Desk AI" : isSelf ? "You" : authorName}
          </span>
          {language && (
            <span
              className={cn(
                "text-[9px] font-bold tracking-[0.06em] rounded-[3px] px-1 py-[1px]",
                language === "FR"
                  ? "bg-rd-terra-100 text-rd-terra-800"
                  : "bg-rd-navy-100 text-rd-navy-800"
              )}
            >
              {language}
            </span>
          )}
          <span>{time}</span>
        </div>
        <div
          className={cn(
            "px-3.5 py-2.5 text-[13.5px] leading-[1.5]",
            !isSelf && "bg-white text-rd-ink-900 border border-rd-line rounded-[4px_14px_14px_14px]",
            isSelf && isAI && "bg-rd-terra-600 text-white rounded-[14px_4px_14px_14px]",
            isSelf && !isAI && "bg-rd-navy-800 text-white rounded-[14px_4px_14px_14px]",
            flag && "ring-4 ring-rd-terra-200"
          )}
        >
          {body}
        </div>
        {flag && (
          <div className="text-right text-[10px] text-rd-terra-700 font-bold mt-1 tracking-[0.04em]">
            ⚑ FLAGGED FOR YOU
          </div>
        )}
      </div>
    </div>
  );
}
