import type {
  ConversationAuthor,
  ConversationChannel,
  ConversationMessage,
  Language,
} from "@/types/rd";

// Row shape for public.conversation_messages (Phase D). Stays
// decoupled from the full generated Database type so the mapper is
// unit-testable.

export interface ConversationMessageRow {
  id: string;
  lead_id: string;
  channel: string;
  author: string;
  author_name: string;
  body: string;
  language: string | null;
  sent_at: string;
  system_note: string | null;
}

export function mapConversationRow(row: ConversationMessageRow): ConversationMessage {
  return {
    id: row.id,
    leadId: row.lead_id,
    channel: normalizeChannel(row.channel),
    author: normalizeAuthor(row.author),
    authorName: row.author_name,
    body: row.body,
    language: row.language?.toLowerCase() === "fr" ? "FR" : "EN",
    sentAt: row.sent_at,
    systemNote: row.system_note ?? undefined,
  };
}

function normalizeChannel(raw: string): ConversationChannel {
  return raw === "sms" || raw === "email" ? raw : "chat";
}

function normalizeAuthor(raw: string): ConversationAuthor {
  switch (raw) {
    case "ai":
    case "lead":
    case "agent":
    case "system":
      return raw;
    default:
      return "agent";
  }
}

// Reverse — compose a row for INSERT. Caller supplies user_id + lead_id;
// we keep this pure so useSendMessage can add the auth id on the way in.
export function toInsertRow(
  m: Pick<ConversationMessage, "channel" | "author" | "authorName" | "body"> & {
    language?: Language;
    systemNote?: string;
  },
  ctx: { userId: string; leadId: string }
): Omit<ConversationMessageRow, "id" | "sent_at"> & { user_id: string; sent_at?: string } {
  return {
    user_id: ctx.userId,
    lead_id: ctx.leadId,
    channel: m.channel,
    author: m.author,
    author_name: m.authorName,
    body: m.body,
    language: (m.language ?? "EN").toLowerCase(),
    system_note: m.systemNote ?? null,
  };
}
