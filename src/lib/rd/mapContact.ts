import type { Lead, LeadSource, Language, PipelineStage } from "@/types/rd";

// Pure mapper: public.contacts row → Lead.
//
// The contacts table is older than the redesign so the columns don't
// line up 1:1. Anything this function doesn't pull from a first-class
// column lives in contacts.metadata (jsonb) — when that key is missing
// we fall back to a sensible default. This keeps the UI working on
// legacy rows while letting new writes carry redesign-specific fields.

// Minimal shape of the contacts row we actually touch. Matches the
// generated Supabase types but stays decoupled so the mapper can be
// unit-tested without pulling the full Database type.
export interface ContactRow {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  ai_score: number | null;
  lead_score: number | null;
  status: string | null;
  source: string | null;
  preferred_language: string | null;
  last_contact_date: string | null;
  consent_date: string | null;
  metadata?: unknown;
}

export function mapContactToLead(row: ContactRow): Lead {
  const meta = (row.metadata ?? {}) as Record<string, unknown>;
  return {
    id: row.id,
    name: joinName(row.first_name, row.last_name),
    email: row.email,
    phone: row.phone ?? "",
    language: normalizeLanguage(row.preferred_language),
    source: normalizeSource(row.source),
    listing: asString(meta.listing) ?? "New lead",
    city: asString(meta.city),
    stage: normalizeStage(row.status),
    score: row.ai_score ?? row.lead_score ?? 0,
    lastActivity: formatLastActivity(row.last_contact_date),
    aiHandling: meta.aiHandling === true,
    aiNextBest: asString(meta.aiNextBest),
    budgetCad: typeof meta.budgetCad === "number" ? meta.budgetCad : undefined,
    caslConsentAt: row.consent_date ?? undefined,
    assignedAgentId: asString(meta.assignedAgentId) ?? null,
  };
}

function joinName(first: string, last: string | null): string {
  return last ? `${first} ${last}`.trim() : first.trim();
}

function normalizeLanguage(raw: string | null): Language {
  return raw?.toLowerCase() === "fr" ? "FR" : "EN";
}

function normalizeSource(raw: string | null): LeadSource {
  const v = (raw ?? "").toLowerCase();
  if (v.includes("ddf") || v.includes("crea")) return "DDF";
  if (v.includes("form") || v.includes("website")) return "Form";
  if (v.includes("ad") || v.includes("facebook") || v.includes("google")) return "Ads";
  if (v.includes("referr")) return "Referral";
  return "Other";
}

function normalizeStage(raw: string | null): PipelineStage {
  const v = (raw ?? "new").toLowerCase().replace(/\s+/g, "_");
  const allowed: PipelineStage[] = [
    "new",
    "contacted",
    "qualified",
    "showing",
    "offer",
    "won",
    "lost",
  ];
  return (allowed as string[]).includes(v) ? (v as PipelineStage) : "new";
}

/** Format an ISO timestamp as a short relative label that matches the
 *  design ("32s ago", "6m ago", "yesterday"). Pure so the leads table
 *  renders deterministically across renders. */
export function formatLastActivity(iso: string | null | undefined): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";

  const now = Date.now();
  const delta = Math.max(0, now - then);
  const sec = Math.floor(delta / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}
