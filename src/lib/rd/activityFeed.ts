import type { ActivityItem, ActivityKind } from "@/types/rd";

// How the v2 dashboard words a row of the merged activity feed.
//
// The feed joins two tables (useActivityFeed): conversation_messages, mapped to
// ids starting "msg:", and contact_activities, mapped to ids starting "act:".
// The shared mapper squeezes both into the v1 card's vocabulary, which was
// written around "Desk AI replied". Three things went wrong when v2 rendered it
// as a sentence:
//
//   1. A message the agent sent read "Maya added a note on Lucas", because the
//      mapper files every non-AI message under `agent_note`. It is a message.
//   2. An outbound message read "Desk AI replied to …". Nothing in the app sends
//      on its own — the composer always posts an agent-authored row — so the
//      sentence described behaviour the product does not have. A row whose
//      author really is "ai" keeps a Desk AI tag (that is what the data says),
//      but the sentence no longer claims a reply was made for the agent.
//   3. Sending a message also logs a bookkeeping row in contact_activities
//      (useSendMessage), titled "Message sent". The mapper uses the title as the
//      actor when no actor is recorded, giving "Message sent replied to Lucas",
//      directly under the message it duplicates.
//
// This file is v2-only on purpose: the v1 dashboard keeps the shared mapper's
// output untouched, so nothing changes for accounts without the flag.

export type FeedSentence = ActivityKind | "message_sent" | "logged";

const DUPLICATE_WINDOW_MS = 60_000;

/** True for a row that came from conversation_messages. */
export function isMessage(a: ActivityItem): boolean {
  return a.id.startsWith("msg:");
}

const isDeskAiActor = (actor: string | undefined): boolean => /^\s*desk\s*ai\s*$/i.test(actor ?? "");

/** True when the message row's author is Desk AI rather than the agent. */
export function isAiAuthored(a: ActivityItem): boolean {
  return isMessage(a) && a.kind === "ai_reply";
}

/**
 * Which sentence to render. `logged` is the neutral "Lead — what was logged"
 * form, used when a contact_activities row records no actor: the mapper falls
 * back to the row's title, and a title is not somebody who can call or reply.
 */
export function feedSentence(a: ActivityItem): FeedSentence {
  if (isMessage(a)) return "message_sent";
  const needsActor =
    a.kind === "ai_reply" ||
    a.kind === "ai_booked_showing" ||
    a.kind === "agent_called" ||
    a.kind === "agent_note";
  if (needsActor && a.actor === a.summary) return "logged";
  // A logged email or meeting whose recorded actor is Desk AI would render as
  // "Desk AI replied to Lucas" or "Desk AI booked a showing for Lucas". Nothing
  // in the product sends a reply or books a showing on its own, so a row like
  // that (seeded demo data, or an import) gets the neutral form too. A human
  // actor keeps the sentence: "Maya replied to Lucas" is a true thing to log.
  if ((a.kind === "ai_reply" || a.kind === "ai_booked_showing") && isDeskAiActor(a.actor)) return "logged";
  return a.kind;
}

const head = (s: string | undefined) => (s ?? "").replace(/…$/, "").slice(0, 40);

/**
 * Drops the contact_activities bookkeeping row that useSendMessage writes
 * beside every outbound message, so one send is one line. A logged activity is
 * only treated as that copy when it is for the same lead, within a minute of
 * the message, and starts with the same text.
 */
export function dedupeFeed(items: ActivityItem[]): ActivityItem[] {
  const messages = items.filter(isMessage);
  return items.filter((a) => {
    if (isMessage(a) || !a.leadId) return true;
    if (a.kind !== "ai_reply" && a.kind !== "agent_note") return true;
    const at = +new Date(a.at);
    return !messages.some(
      (m) =>
        m.leadId === a.leadId &&
        Math.abs(+new Date(m.at) - at) <= DUPLICATE_WINDOW_MS &&
        head(m.detail) !== "" &&
        head(m.detail) === head(a.detail)
    );
  });
}
