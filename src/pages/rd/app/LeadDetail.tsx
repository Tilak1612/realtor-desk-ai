import { Link, useParams } from "react-router-dom";
import { AppShell } from "@/components/rd/layout/AppShell";
import {
  RDButton,
  RDBadge,
  RDAvatar,
  IconSparkles,
  IconPhone,
  IconCalendar,
  IconCheck,
  IconHome,
  IconArrow,
} from "@/components/rd";
import { findLead, findConversation } from "@/data/rd";
import type { ConversationMessage, Lead } from "@/types/rd";
import { cn } from "@/lib/utils";

// /app/leads/:id — Lead detail per rd-app.jsx Artboard_LeadDetail.
// Two-column layout: conversation on the left, lead sidebar on the right.

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const lead = id ? findLead(id) : undefined;
  const messages = id ? findConversation(id) : [];

  if (!lead) {
    return (
      <AppShell>
        <div className="p-10 text-center">
          <h1 className="text-xl font-semibold">Lead not found</h1>
          <p className="text-rd-ink-500 mt-2">
            The lead <span className="font-mono text-rd-ink-700">{id}</span> isn't in the mock
            dataset.
          </p>
          <Link to="/app/leads" className="inline-block mt-6">
            <RDButton variant="outline" trailingIcon={<IconArrow />}>
              Back to leads
            </RDButton>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] h-full overflow-hidden">
        <ConversationPane lead={lead} messages={messages} />
        <LeadSidebar lead={lead} />
      </div>
    </AppShell>
  );
}

/* ────────────────────────────────────────────────────────── */

function ConversationPane({ lead, messages }: { lead: Lead; messages: ConversationMessage[] }) {
  return (
    <div className="flex flex-col border-r border-rd-line overflow-hidden min-h-0">
      {/* Breadcrumb + header */}
      <div className="px-7 py-4 border-b border-rd-line flex items-center gap-4 flex-wrap">
        <div className="text-xs text-rd-ink-500">
          <Link to="/app/leads" className="hover:text-rd-ink-900">
            Leads
          </Link>
          <span className="mx-1.5">›</span>
          <span className="text-rd-ink-900 font-semibold">{lead.name}</span>
        </div>
        <RDBadge tone={lead.score >= 80 ? "terra" : lead.score >= 60 ? "navy" : "neutral"} size="sm">
          {lead.score >= 80 ? "Hot" : lead.score >= 60 ? "Warm" : "Cold"} · {lead.score}
        </RDBadge>
        <span
          className={cn(
            "text-[9px] font-bold tracking-[0.06em] rounded-[3px] px-1.5 py-[1px]",
            lead.language === "FR"
              ? "bg-rd-terra-100 text-rd-terra-800"
              : "bg-rd-navy-100 text-rd-navy-800"
          )}
        >
          {lead.language}
        </span>
        <div className="ml-auto flex gap-2">
          <RDButton variant="outline" size="sm" icon={<IconPhone />}>
            Call
          </RDButton>
          <RDButton variant="outline" size="sm" icon={<IconCalendar />}>
            Book showing
          </RDButton>
          <RDButton variant="terra" size="sm" icon={<IconSparkles />}>
            Take over
          </RDButton>
        </div>
      </div>

      {/* AI banner */}
      {lead.aiHandling && (
        <div className="px-7 py-3 bg-rd-terra-100 border-b border-rd-terra-200 flex items-center gap-2.5 text-[13px]">
          <div className="w-[22px] h-[22px] rounded-[6px] bg-rd-terra-600 text-white flex items-center justify-center flex-shrink-0">
            <IconSparkles />
          </div>
          <span className="text-rd-terra-900">
            <strong className="font-semibold">
              Desk AI is replying{lead.language === "FR" ? " in French" : ""}.
            </strong>{" "}
            You'll be pinged if the lead asks for a human or shares a phone number.
          </span>
          <button
            type="button"
            className="ml-auto text-xs font-semibold text-rd-terra-800 hover:underline"
          >
            Settings →
          </button>
        </div>
      )}

      {/* Thread */}
      <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-3.5 bg-rd-paper-2">
        {messages.length === 0 ? (
          <div className="text-center text-sm text-rd-ink-500 py-10">
            No conversation yet. When the website widget or email channel receives a message, it
            will appear here.
          </div>
        ) : (
          <ThreadGroups messages={messages} />
        )}
      </div>

      {/* Composer */}
      <div className="px-7 py-3.5 border-t border-rd-line bg-white">
        <div className="border border-rd-line rounded-[12px] px-3.5 py-2.5 flex flex-col gap-2">
          <div className="text-[13px] text-rd-ink-400 min-h-[36px]">
            Reply as Sarah (AI will pause)…
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-4 text-xs text-rd-ink-500">
              <SuggestionBtn>
                <IconSparkles className="w-3 h-3" />
                Draft with AI
              </SuggestionBtn>
              <SuggestionBtn>Attach listing</SuggestionBtn>
              <SuggestionBtn>Template ▾</SuggestionBtn>
            </div>
            <RDButton variant="primary" size="sm">
              Send
            </RDButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuggestionBtn({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-rd-ink-600 hover:text-rd-ink-900"
    >
      {children}
    </button>
  );
}

/* ────────────────────────────────────────────────────────── */

function ThreadGroups({ messages }: { messages: ConversationMessage[] }) {
  // Group messages by day label (Yesterday / Today / ISO date).
  const groups: Record<string, ConversationMessage[]> = {};
  messages.forEach((m) => {
    const key = dayLabel(m.sentAt);
    groups[key] ??= [];
    groups[key].push(m);
  });

  return (
    <>
      {Object.entries(groups).map(([day, msgs]) => (
        <section key={day} className="flex flex-col gap-3.5">
          <DayMarker>{day}</DayMarker>
          {msgs.map((m) => (
            <Msg key={m.id} message={m} />
          ))}
        </section>
      ))}
    </>
  );
}

function dayLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const diffDays = Math.round((startOfDay(now) - startOfDay(d)) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

function DayMarker({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 my-1 text-rd-ink-500 text-[11px] font-bold uppercase tracking-[0.08em]">
      <div className="flex-1 h-px bg-rd-line" />
      <span>{children}</span>
      <div className="flex-1 h-px bg-rd-line" />
    </div>
  );
}

function Msg({ message }: { message: ConversationMessage }) {
  const { author, authorName, body, sentAt, language } = message;
  const time = new Date(sentAt).toLocaleTimeString("en-CA", {
    hour: "numeric",
    minute: "2-digit",
  });

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
    <div
      className={cn(
        "flex gap-2.5 items-start",
        isSelf ? "flex-row-reverse" : "flex-row"
      )}
    >
      {!isSelf ? (
        <RDAvatar name={authorName} size={28} tone="var(--rd-terra-700)" />
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
      <div className="max-w-[75%]">
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
            isSelf && !isAI && "bg-rd-navy-800 text-white rounded-[14px_4px_14px_14px]"
          )}
        >
          {body}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */

function LeadSidebar({ lead }: { lead: Lead }) {
  return (
    <div className="overflow-y-auto px-7 py-6 bg-white">
      {/* Header */}
      <div className="flex items-center gap-3.5 mb-6">
        <RDAvatar name={lead.name} size={56} tone="var(--rd-terra-700)" />
        <div>
          <h2 className="text-[22px] font-semibold tracking-[-0.01em]">{lead.name}</h2>
          <div className="text-[13px] text-rd-ink-500 mt-0.5">
            {lead.city ?? "—"} · {lead.source}
          </div>
        </div>
      </div>

      {/* Score card */}
      <div className="bg-rd-ink-900 text-white rounded-[12px] p-5 mb-5">
        <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-rd-terra-400">
          AI lead score
        </div>
        <div className="flex items-baseline gap-2.5 mt-1.5">
          <div className="text-[48px] font-bold tracking-[-0.02em]">{lead.score}</div>
          <div className="text-xs text-white/60">
            / 100 · {lead.score >= 80 ? "Hot" : lead.score >= 60 ? "Warm" : "Cold"}
          </div>
        </div>
        <div className="mt-3.5 grid grid-cols-2 gap-2.5 text-xs">
          <ScoreCrit label="Intent" pct={Math.min(100, lead.score + 3)} />
          <ScoreCrit label="Urgency" pct={Math.max(40, lead.score - 4)} />
          <ScoreCrit label="Budget fit" pct={lead.score} />
          <ScoreCrit label="Timeline" pct={Math.min(100, lead.score - 2)} />
        </div>
      </div>

      {/* Contact */}
      <Section title="Contact">
        <KVRow k="Email" v={lead.email} />
        <KVRow k="Phone" v={lead.phone} />
        <KVRow
          k="Language"
          v={
            <span>
              <strong>{lead.language === "FR" ? "French" : "English"}</strong>{" "}
              <span className="text-rd-ink-400">· auto-detected</span>
            </span>
          }
        />
        <KVRow
          k="Consent"
          v={
            lead.caslConsentAt ? (
              <span className="text-rd-success inline-flex items-center gap-1">
                <IconCheck /> CASL on file · {formatShort(lead.caslConsentAt)}
              </span>
            ) : (
              <span className="text-rd-ink-500">Not captured yet</span>
            )
          }
        />
      </Section>

      {/* Buying profile */}
      <Section title="Buying profile">
        <KVRow
          k="Budget"
          v={lead.budgetCad ? formatCad(lead.budgetCad) : <span className="text-rd-ink-500">—</span>}
        />
        <KVRow k="Areas" v={lead.city ?? "—"} />
        <KVRow k="Stage" v={lead.stage.replace("_", " ")} />
        {lead.aiNextBest && <KVRow k="AI next step" v={lead.aiNextBest} />}
      </Section>

      {/* Viewed listings */}
      <Section title="Viewed listings">
        <ListingCard addr={lead.listing} meta="Primary interest" />
      </Section>

      {/* Timeline */}
      <Section title="Timeline">
        <Timeline lead={lead} />
      </Section>
    </div>
  );
}

function ScoreCrit({ label, pct }: { label: string; pct: number }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-white/70">{label}</span>
        <span className="font-semibold">{pct}</span>
      </div>
      <div className="h-[3px] bg-white/10 rounded-[2px]">
        <div className="h-full bg-rd-terra-400 rounded-[2px]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 pb-5 border-b border-rd-line last:border-b-0 last:mb-0 last:pb-0">
      <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-rd-ink-500 mb-2.5">
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
}

function KVRow({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 py-1.5 text-[13px]">
      <div className="text-rd-ink-500">{k}</div>
      <div className="text-rd-ink-900 break-words">{v}</div>
    </div>
  );
}

function ListingCard({ addr, meta }: { addr: string; meta: string }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 border border-rd-line rounded-[10px]">
      <div className="w-12 h-12 rounded-rd-sm bg-rd-navy-100 text-rd-navy-800 flex items-center justify-center flex-shrink-0">
        <IconHome />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold truncate">{addr}</div>
        <div className="text-[11px] text-rd-ink-500 mt-0.5 truncate">{meta}</div>
      </div>
    </div>
  );
}

function Timeline({ lead }: { lead: Lead }) {
  // Deterministic timeline derived from the lead — real events live in
  // activity_feed once backend wiring lands.
  const events: { t: string; txt: string; ai: boolean }[] = [
    { t: lead.lastActivity, txt: lead.aiNextBest ?? "Most recent activity", ai: lead.aiHandling },
    { t: "Captured", txt: `Lead captured via ${lead.source}`, ai: false },
  ];
  return (
    <div className="relative pl-5">
      <div className="absolute left-1 top-1.5 bottom-1.5 w-px bg-rd-line" />
      {events.map((e, i) => (
        <div key={i} className="relative mb-3 text-xs">
          <div
            className={cn(
              "absolute -left-5 top-1 w-[9px] h-[9px] rounded-full border-2 border-white",
              e.ai ? "bg-rd-terra-600" : "bg-rd-navy-700"
            )}
          />
          <div className="text-rd-ink-500 font-semibold">{e.t}</div>
          <div className="text-rd-ink-900 mt-0.5">{e.txt}</div>
        </div>
      ))}
    </div>
  );
}

function formatShort(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCad(cents: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(cents);
}
