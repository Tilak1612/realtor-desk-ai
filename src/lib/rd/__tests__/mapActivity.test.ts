import { describe, it, expect } from "vitest";
import {
  mapContactActivity,
  mapConversationActivity,
  type ContactActivityRow,
  type ConversationFeedRow,
} from "@/lib/rd/mapActivity";

// Regression coverage for the unified activity-feed mappers (dashboard
// timeline). Added by audit 2026-06-21.

const actRow: ContactActivityRow = {
  id: "a1",
  contact_id: "lead-1",
  activity_type: "note_added",
  title: "Note added",
  description: "Spoke with buyer",
  metadata: {},
  created_at: "2026-06-01T10:00:00Z",
};

describe("mapContactActivity", () => {
  it("prefixes id, carries lead/summary/detail, and maps timestamp", () => {
    const a = mapContactActivity(actRow);
    expect(a.id).toBe("act:a1");
    expect(a.leadId).toBe("lead-1");
    expect(a.summary).toBe("Note added");
    expect(a.detail).toBe("Spoke with buyer");
    expect(a.at).toBe("2026-06-01T10:00:00Z");
  });

  it("maps activity_type to the feed's ActivityKind", () => {
    const kind = (t: string) => mapContactActivity({ ...actRow, activity_type: t }).kind;
    expect(kind("email_sent")).toBe("ai_reply");
    expect(kind("call_made")).toBe("agent_called");
    expect(kind("meeting_held")).toBe("ai_booked_showing");
    expect(kind("status_changed")).toBe("stage_changed");
    expect(kind("property_viewed")).toBe("lead_viewed_listing");
    expect(kind("totally_unknown")).toBe("agent_note");
  });

  it("uses metadata.actor when present, else falls back to title", () => {
    expect(mapContactActivity({ ...actRow, metadata: { actor: "Desk AI" } }).actor).toBe("Desk AI");
    expect(mapContactActivity(actRow).actor).toBe("Note added");
  });

  it("derives language from metadata, undefined when absent", () => {
    expect(mapContactActivity({ ...actRow, metadata: { language: "fr" } }).language).toBe("FR");
    expect(mapContactActivity({ ...actRow, metadata: { language: "en" } }).language).toBe("EN");
    expect(mapContactActivity(actRow).language).toBeUndefined();
  });
});

const convRow: ConversationFeedRow = {
  id: "m1",
  lead_id: "lead-2",
  author: "ai",
  author_name: "Jane Buyer",
  body: "Hello there",
  language: "fr",
  sent_at: "2026-06-02T12:00:00Z",
};

describe("mapConversationActivity", () => {
  it("marks AI authors as ai_reply with a 'Replied to' summary", () => {
    const a = mapConversationActivity(convRow);
    expect(a.id).toBe("msg:m1");
    expect(a.kind).toBe("ai_reply");
    expect(a.summary).toBe("Replied to Jane Buyer");
    expect(a.language).toBe("FR");
  });

  it("marks non-AI authors as agent_note", () => {
    const a = mapConversationActivity({ ...convRow, author: "agent", author_name: "Sam Agent", language: null });
    expect(a.kind).toBe("agent_note");
    expect(a.summary).toBe("Sam Agent — message sent");
    expect(a.language).toBe("EN");
  });

  it("truncates long bodies with an ellipsis", () => {
    const long = "x".repeat(200);
    const a = mapConversationActivity({ ...convRow, body: long });
    expect(a.detail!.length).toBeLessThanOrEqual(140);
    expect(a.detail!.endsWith("…")).toBe(true);
  });

  it("leaves short bodies untouched", () => {
    expect(mapConversationActivity({ ...convRow, body: "short" }).detail).toBe("short");
  });
});
