import type { ActivityItem } from "@/types/rd";

// AI activity feed on /app dashboard + event timeline on /app/leads/:id.
// Ordered newest-first. Times are ISO; the UI formats to relative labels.

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: "act_1",
    kind: "ai_reply",
    at: "2026-04-21T04:17:00Z",
    actor: "Desk AI",
    summary: "Replied to Hassan Ahmed about Lorne Park school catchments.",
    detail: "3-message thread, booked school-tour window Saturday.",
    leadId: "lead_hassan",
    language: "EN",
  },
  {
    id: "act_2",
    kind: "ai_booked_showing",
    at: "2026-04-21T03:48:00Z",
    actor: "Desk AI",
    summary: "Booked showing for Émilie Tremblay · Le Plateau condo.",
    detail: "Saturday 7:00 PM — parking confirmed. CASL consent logged.",
    leadId: "lead_emilie",
    language: "FR",
  },
  {
    id: "act_3",
    kind: "ai_reply",
    at: "2026-04-21T03:03:00Z",
    actor: "Desk AI",
    summary: "Qualified Chen Wei's budget at $1.1M CAD.",
    detail: "Added Richmond townhome to watchlist.",
    leadId: "lead_chen",
    language: "EN",
  },
  {
    id: "act_4",
    kind: "stage_changed",
    at: "2026-04-20T19:22:00Z",
    actor: "Sarah Khoury",
    summary: "Moved Marc-Antoine Lévesque → Offer.",
    detail: "Mile End loft · $820K. Signing tomorrow morning.",
    leadId: "lead_marc_antoine",
    language: "FR",
  },
  {
    id: "act_5",
    kind: "consent_captured",
    at: "2026-04-20T11:08:00Z",
    actor: "Desk AI",
    summary: "CASL consent captured for Olivia Kenner.",
    detail: "Implied — property inquiry via website form.",
    leadId: "lead_olivia",
    language: "EN",
  },
];
