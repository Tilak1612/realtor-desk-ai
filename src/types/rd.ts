// RealtorDesk AI redesign — shared domain types.
//
// Phase 1 deliverable. These types back the mock data in src/data/rd/*
// and will be the contract the backend-wiring phases target. They are
// scoped to the UI the redesigned screens actually render — nothing
// speculative. Extend in place when a later phase needs more fields.

export type Language = "EN" | "FR";

/** Sidebar accent colour used by the score bar + chips. */
export type LeadScoreBand = "hot" | "warm" | "cool" | "cold";

/** Lead lifecycle stage. String-literal union so TS catches typos in
 *  kanban + table code. Values mirror the redesign's columns. */
export type PipelineStage =
  | "new"
  | "contacted"
  | "qualified"
  | "showing"
  | "offer"
  | "won"
  | "lost";

/** Acquisition channel. Kept loose enough that marketing teams can add
 *  new values without a code change. */
export type LeadSource = "DDF" | "Form" | "Ads" | "Referral" | "Other";

/** A single lead — the core row in /app/leads and the header on
 *  /app/leads/:id. */
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  language: Language;
  source: LeadSource;
  /** Primary listing interest surfaced in the table row. */
  listing: string;
  /** City or neighbourhood tag used by FilterBar and PipelineCard. */
  city?: string;
  stage: PipelineStage;
  /** 0–100 — renderable via <Score /> which bands this into hot/warm/cool/cold. */
  score: number;
  /** Relative label like "32s ago" / "yesterday". Prefer pre-formatted
   *  strings so locale switches happen in one helper, not in every row. */
  lastActivity: string;
  /** Whether the AI is currently handling this lead autonomously. */
  aiHandling: boolean;
  /** Suggested next step surfaced by the AI. */
  aiNextBest?: string;
  /** Hot / Warm / Cold pill colouring on pipeline cards. */
  temperature?: LeadScoreBand;
  /** Budget hint rendered on the lead detail page. */
  budgetCad?: number;
  /** CASL consent timestamp. Absent = not yet collected. */
  caslConsentAt?: string;
  /** Assigned agent id; null when AI-only. */
  assignedAgentId?: string | null;
}

/** A single message in a conversation (Inbox + lead detail).
 *  Covers the three content channels the design supports: chat
 *  (website widget), SMS, email. */
export type ConversationChannel = "chat" | "sms" | "email";
export type ConversationAuthor = "ai" | "lead" | "agent" | "system";

export interface ConversationMessage {
  id: string;
  leadId: string;
  channel: ConversationChannel;
  author: ConversationAuthor;
  /** UI label; e.g. "Desk AI", "Sarah K.", "Émilie". */
  authorName: string;
  body: string;
  language: Language;
  /** ISO timestamp. Rendered relative via date-fns. */
  sentAt: string;
  /** Optional CASL note surfaced above system messages. */
  systemNote?: string;
}

/** Rollup metadata for a pipeline column header. */
export interface PipelineStageMeta {
  id: PipelineStage;
  label: string;
  /** Count of leads in the stage. */
  count: number;
  /** Total deal value in CAD. */
  valueCad: number;
  /** Tailwind colour class for the stage dot / progress segment. */
  toneClass: string;
}

/** Dashboard "AI activity" feed items + /app/leads/:id timeline. */
export type ActivityKind =
  | "ai_reply"
  | "ai_booked_showing"
  | "lead_viewed_listing"
  | "agent_called"
  | "agent_note"
  | "stage_changed"
  | "consent_captured"
  | "automation_step";

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  /** Absolute timestamp (ISO). */
  at: string;
  /** Display label of whoever acted (AI, agent name, etc). */
  actor: string;
  /** Short sentence describing what happened. */
  summary: string;
  /** Optional sub-line (listing, language flag, quote snippet). */
  detail?: string;
  /** Associated lead id. */
  leadId?: string;
  language?: Language;
}

/** Automation sequence — /app/automation list + editor. */
export type AutomationTriggerKind =
  | "lead.created"
  | "lead.wentCold"
  | "showing.scheduled"
  | "consent.captured";

export type AutomationStepKind = "wait" | "email" | "sms" | "task" | "ai_followup";

export interface AutomationStep {
  id: string;
  kind: AutomationStepKind;
  /** "Wait 24h", "Send bilingual welcome", etc. */
  label: string;
  /** Wait steps use duration in hours; other steps ignore it. */
  hours?: number;
  /** Email/sms template identifier. */
  templateId?: string;
}

export interface AutomationSequence {
  id: string;
  name: string;
  trigger: AutomationTriggerKind;
  active: boolean;
  /** When the sequence last fired. */
  lastRunAt?: string;
  /** Success / total runs in the last 30 days. */
  stats30d: { sent: number; opened: number; replied: number };
  steps: AutomationStep[];
}

/** /app/reports — single metric card + chart point. */
export type ReportMetricKey =
  | "response_time_avg"
  | "leads_this_week"
  | "showings_booked"
  | "pipeline_value"
  | "source_roi";

export interface ReportMetric {
  key: ReportMetricKey;
  label: string;
  value: string; // preformatted for display, e.g. "38s", "$4.8M"
  /** Arrow direction + trend label: "+18%", "−14%". */
  delta?: string;
  deltaTone?: "success" | "danger" | "neutral";
  /** Sparkline points normalized 0..1 for the <Spark /> component. */
  spark?: number[];
}

/** /onboarding — five-step wizard state, persisted to user_onboarding. */
export type OnboardingStepId =
  | "welcome"
  | "profile"
  | "connect_ddf"
  | "ai_voice"
  | "go_live";

export interface OnboardingState {
  currentStep: OnboardingStepId;
  completed: Partial<Record<OnboardingStepId, string /* ISO */>>;
  profile?: {
    fullName: string;
    brokerage: string;
    province: string;
    licenseNumber?: string;
    preferredLanguage: Language;
  };
  ddfConnection?: {
    boardName: string;
    connectedAt: string;
    listingCount: number;
  };
  /** Prompt/voice persona the user picked in step 4. */
  aiPersona?: "professional" | "warm" | "witty";
}
