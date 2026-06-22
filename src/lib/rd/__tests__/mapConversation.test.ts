import { describe, it, expect } from "vitest";
import {
  mapConversationRow,
  toInsertRow,
  type ConversationMessageRow,
} from "@/lib/rd/mapConversation";

// Regression coverage for the conversation message mapper + insert composer
// (Phase D messaging). Added by audit 2026-06-21.

const row: ConversationMessageRow = {
  id: "m1",
  lead_id: "lead-1",
  channel: "sms",
  author: "ai",
  author_name: "Desk AI",
  body: "Bonjour",
  language: "fr",
  sent_at: "2026-06-02T12:00:00Z",
  system_note: null,
};

describe("mapConversationRow", () => {
  it("maps a row into a ConversationMessage", () => {
    expect(mapConversationRow(row)).toEqual({
      id: "m1",
      leadId: "lead-1",
      channel: "sms",
      author: "ai",
      authorName: "Desk AI",
      body: "Bonjour",
      language: "FR",
      sentAt: "2026-06-02T12:00:00Z",
      systemNote: undefined,
    });
  });

  it("normalizes unknown channels to chat, known ones pass through", () => {
    expect(mapConversationRow({ ...row, channel: "email" }).channel).toBe("email");
    expect(mapConversationRow({ ...row, channel: "whatsapp" }).channel).toBe("chat");
  });

  it("normalizes unknown authors to agent", () => {
    expect(mapConversationRow({ ...row, author: "system" }).author).toBe("system");
    expect(mapConversationRow({ ...row, author: "bot" }).author).toBe("agent");
  });

  it("maps language and preserves a system note", () => {
    const m = mapConversationRow({ ...row, language: "en", system_note: "auto-reply" });
    expect(m.language).toBe("EN");
    expect(m.systemNote).toBe("auto-reply");
  });
});

describe("toInsertRow", () => {
  it("composes an insert row with auth context, lowercased language", () => {
    const out = toInsertRow(
      { channel: "chat", author: "agent", authorName: "Sam", body: "hi", language: "FR" },
      { userId: "u1", leadId: "l1" }
    );
    expect(out).toEqual({
      user_id: "u1",
      lead_id: "l1",
      channel: "chat",
      author: "agent",
      author_name: "Sam",
      body: "hi",
      language: "fr",
      system_note: null,
    });
  });

  it("defaults language to en and system_note to null", () => {
    const out = toInsertRow(
      { channel: "sms", author: "ai", authorName: "Desk AI", body: "yo" },
      { userId: "u1", leadId: "l1" }
    );
    expect(out.language).toBe("en");
    expect(out.system_note).toBeNull();
  });
});
