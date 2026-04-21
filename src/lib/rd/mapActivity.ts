import type { ActivityItem, ActivityKind, Language } from "@/types/rd";

// Maps public.contact_activities + public.conversation_messages rows
// into the redesign's unified ActivityItem shape. Both sources are
// queried by useActivityFeed(); this mapper normalizes them into a
// single timeline for the dashboard card.

export interface ContactActivityRow {
  id: string;
  contact_id: string;
  activity_type: string;
  title: string;
  description: string | null;
  metadata: unknown;
  created_at: string;
}

export interface ConversationFeedRow {
  id: string;
  lead_id: string;
  author: string;
  author_name: string;
  body: string;
  language: string | null;
  sent_at: string;
}

export function mapContactActivity(row: ContactActivityRow): ActivityItem {
  const meta = (row.metadata ?? {}) as Record<string, unknown>;
  return {
    id: `act:${row.id}`,
    kind: mapActivityKind(row.activity_type),
    at: row.created_at,
    actor: typeof meta.actor === "string" ? meta.actor : row.title,
    summary: row.title,
    detail: row.description ?? undefined,
    leadId: row.contact_id,
    language: normalizeLanguage(meta.language),
  };
}

export function mapConversationActivity(row: ConversationFeedRow): ActivityItem {
  const kind: ActivityKind = row.author === "ai" ? "ai_reply" : "agent_note";
  return {
    id: `msg:${row.id}`,
    kind,
    at: row.sent_at,
    actor: row.author_name,
    summary:
      row.author === "ai"
        ? `Replied to ${row.author_name}`
        : `${row.author_name} — message sent`,
    detail: truncate(row.body, 140),
    leadId: row.lead_id,
    language: row.language?.toLowerCase() === "fr" ? "FR" : "EN",
  };
}

function mapActivityKind(raw: string): ActivityKind {
  switch (raw) {
    case "email_sent":
    case "email_received":
      return "ai_reply"; // best proxy on the feed today
    case "call_made":
    case "call_received":
      return "agent_called";
    case "meeting_held":
      return "ai_booked_showing";
    case "note_added":
      return "agent_note";
    case "status_changed":
      return "stage_changed";
    case "property_viewed":
      return "lead_viewed_listing";
    default:
      return "agent_note";
  }
}

function normalizeLanguage(v: unknown): Language | undefined {
  if (typeof v !== "string") return undefined;
  return v.toLowerCase() === "fr" ? "FR" : "EN";
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1).trimEnd() + "…";
}
