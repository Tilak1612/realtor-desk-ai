import type { Lead, PipelineStage } from "@/types/rd";
import { isOpenStage } from "./pipeline";

/**
 * Named lead-list views, reachable by URL (`/app/leads?view=due`). They exist so
 * every dashboard number opens the list it counts. Definitions match
 * lib/rd/dashboard: a follow-up date is a calendar day in local time, and only
 * open (not won/lost) leads are "due".
 */
export const LEAD_VIEWS = ["open", "due", "overdue", "new7d"] as const;
export type LeadView = (typeof LEAD_VIEWS)[number];

export function isLeadView(v: string | null): v is LeadView {
  return !!v && (LEAD_VIEWS as readonly string[]).includes(v);
}

const STAGES: readonly PipelineStage[] = ["new", "contacted", "qualified", "showing", "offer", "won", "lost"];
export function isStage(v: string | null): v is PipelineStage {
  return !!v && (STAGES as readonly string[]).includes(v);
}

function localDay(iso: string): number {
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).getTime();
  }
  const d = new Date(iso);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function applyLeadView(
  leads: Lead[],
  view: LeadView | null,
  stage: PipelineStage | null,
  now: Date = new Date()
): Lead[] {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  // Not today + 24h: a spring-forward day is 23 hours long.
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
  let out = leads;
  if (stage) out = out.filter((l) => l.stage === stage);
  switch (view) {
    case "open":
      return out.filter((l) => isOpenStage(l.stage));
    case "due":
      return out.filter((l) => isOpenStage(l.stage) && !!l.nextFollowupDate && localDay(l.nextFollowupDate) < tomorrow);
    case "overdue":
      return out.filter((l) => isOpenStage(l.stage) && !!l.nextFollowupDate && localDay(l.nextFollowupDate) < today);
    case "new7d": {
      const since = now.getTime() - 7 * 86_400_000;
      return out.filter((l) => !!l.createdAt && new Date(l.createdAt).getTime() >= since);
    }
    default:
      return out;
  }
}
