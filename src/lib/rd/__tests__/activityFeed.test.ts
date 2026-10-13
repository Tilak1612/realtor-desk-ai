import { describe, it, expect } from "vitest";
import type { ActivityItem } from "@/types/rd";
import { dedupeFeed, feedSentence, isAiAuthored } from "../activityFeed";
import { mapContactActivity, mapConversationActivity } from "../mapActivity";

// Built through the real mappers, so these fail if the mapper's output shape
// (id prefixes, actor fallback) ever changes under the v2 card.

const AT = "2026-10-09T15:00:00.000Z";
const message = (author: string, body = "Merci d’être passé à la visite libre!"): ActivityItem =>
  mapConversationActivity({
    id: "m1",
    lead_id: "lead-1",
    author,
    author_name: author === "ai" ? "Desk AI" : "You",
    body,
    language: "fr",
    sent_at: AT,
  });
const logged = (activity_type: string, title: string, o: Partial<{ description: string; metadata: unknown; created_at: string }> = {}): ActivityItem =>
  mapContactActivity({
    id: "a1",
    contact_id: "lead-1",
    activity_type,
    title,
    description: o.description ?? null,
    metadata: o.metadata ?? {},
    created_at: o.created_at ?? AT,
  });

describe("feedSentence", () => {
  it("calls a message the agent sent a message, not a note", () => {
    expect(feedSentence(message("agent"))).toBe("message_sent");
  });

  it("does not say Desk AI replied for an AI-authored row, but keeps the tag", () => {
    const row = message("ai");
    expect(feedSentence(row)).toBe("message_sent");
    expect(isAiAuthored(row)).toBe(true);
    expect(isAiAuthored(message("agent"))).toBe(false);
  });

  it("uses the neutral form when a logged activity has no actor", () => {
    // The mapper falls back to the title, which gave "Message sent replied to …".
    expect(feedSentence(logged("email_sent", "Message sent"))).toBe("logged");
    expect(feedSentence(logged("call_made", "Called about the offer"))).toBe("logged");
    expect(feedSentence(logged("meeting_held", "Showing at 12 Elm"))).toBe("logged");
    expect(feedSentence(logged("note_added", "Prefers evenings"))).toBe("logged");
  });

  it("does not say Desk AI replied or booked a showing for a logged activity", () => {
    // Seeded demo rows carry metadata.actor "Desk AI". The product sends and books nothing itself.
    expect(feedSentence(logged("email_sent", "Reply", { metadata: { actor: "Desk AI" } }))).toBe("logged");
    expect(feedSentence(logged("meeting_held", "Showing", { metadata: { actor: "Desk AI" } }))).toBe("logged");
  });

  it("keeps the kind's own sentence when an actor is recorded or none is needed", () => {
    expect(feedSentence(logged("call_made", "Call", { metadata: { actor: "Maya" } }))).toBe("agent_called");
    expect(feedSentence(logged("status_changed", "Moved to Qualified"))).toBe("stage_changed");
  });
});

describe("dedupeFeed", () => {
  const body = "Merci d’être passé à la visite libre!";

  it("drops the bookkeeping row written beside an outbound message", () => {
    const rows = [message("agent", body), logged("email_sent", "Message sent", { description: body })];
    expect(dedupeFeed(rows).map((r) => r.id)).toEqual(["msg:m1"]);
  });

  it("matches a long message whose feed copy was truncated", () => {
    const long = "A".repeat(300);
    const rows = [message("agent", long), logged("email_sent", "Message sent", { description: long.slice(0, 280) })];
    expect(dedupeFeed(rows)).toHaveLength(1);
  });

  it("keeps a logged email that is not a copy of a message", () => {
    const later = new Date(+new Date(AT) + 10 * 60_000).toISOString();
    expect(dedupeFeed([message("agent", body), logged("email_sent", "Sent listing PDF", { description: body, created_at: later })])).toHaveLength(2);
    expect(dedupeFeed([message("agent", body), logged("email_sent", "Sent listing PDF", { description: "Different text" })])).toHaveLength(2);
    expect(dedupeFeed([message("agent", body), logged("call_made", "Call", { description: body })])).toHaveLength(2);
  });
});
