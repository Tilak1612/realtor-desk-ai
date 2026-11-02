// The rule-based lead score, as computed by
// supabase/functions/calculate-lead-score/index.ts ("The rule-based score is
// the source of truth"). The homepage scorer runs this so a visitor sees the
// product's own arithmetic, not a marketing approximation of it.
//
// Keep the weights in step with the edge function. leadScoreRules.test.ts
// reads that file and fails if its weights change without this one.

export type Timeline = "0-30_days" | "1-3_months" | "3-6_months" | "6+_months" | "not_specified";

export interface ScoreInput {
  stats: {
    emails_sent: number;
    emails_opened: number;
    emails_clicked: number;
    emails_replied: number;
    /** Opened an email in the last 7 days. */
    opened_recently: boolean;
    website_visits: number;
    properties_viewed: number;
    documents_viewed: number;
    /** Seconds. */
    avg_session_duration: number;
  };
  budget?: { min: number; max: number } | null;
  timeline: Timeline;
  pre_approved: boolean;
}

export type ActionKey =
  | "scheduleViewing" | "sendPreapproval" | "prepareOffer"
  | "marketReport" | "shareMatches" | "followUpCall"
  | "nurtureCampaign" | "newsletter" | "reengage"
  | "updateContact" | "verifyTimeline" | "longNurture";

export interface ScoreResult {
  total: number;
  /** Each part as a percentage of its own maximum, as the app displays it. */
  factors: { engagement: number; behavior: number; budget_match: number; timeline: number; qualification: number };
  actions: ActionKey[];
}

const TIMELINE_POINTS: Record<Timeline, number> = {
  "0-30_days": 15,
  "1-3_months": 12,
  "3-6_months": 8,
  "6+_months": 4,
  not_specified: 2,
};

export function scoreLead(input: ScoreInput): ScoreResult {
  const s = input.stats;

  // 1. Engagement (30, plus 5 for a recent open)
  let engagement = 0;
  if (s.emails_sent > 0) {
    engagement += (s.emails_opened / s.emails_sent) * 10;
    engagement += (s.emails_clicked / s.emails_sent) * 10;
    engagement += (s.emails_replied / s.emails_sent) * 10;
  }
  if (s.opened_recently) engagement += 5;

  // 2. Behaviour (30)
  let behavior = Math.min((s.website_visits / 10) * 10, 10);
  behavior += Math.min((s.properties_viewed / 5) * 10, 10);
  behavior += Math.min((s.documents_viewed / 3) * 5, 5);
  if (s.avg_session_duration > 180) behavior += 5;

  // 3. Budget match (20). The function defaults to 15 with no budget on file.
  let budget = 15;
  if (input.budget?.min && input.budget?.max) {
    const range = input.budget.max - input.budget.min;
    budget = range > 500000 ? 20 : range > 200000 ? 15 : 10;
  }

  // 4. Timeline (15)
  const timeline = TIMELINE_POINTS[input.timeline];

  // 5. Qualification (5)
  const qualification = input.pre_approved ? 5 : 0;

  const total = Math.min(Math.round(engagement + behavior + budget + timeline + qualification), 100);

  let actions: ActionKey[];
  if (total >= 80) {
    actions = ["scheduleViewing", ...(input.pre_approved ? [] : (["sendPreapproval"] as ActionKey[])), "prepareOffer"];
  } else if (total >= 60) {
    actions = ["marketReport", "shareMatches", "followUpCall"];
  } else if (total >= 40) {
    actions = ["nurtureCampaign", "newsletter", "reengage"];
  } else {
    actions = ["updateContact", "verifyTimeline", "longNurture"];
  }

  return {
    total,
    factors: {
      engagement: Math.round((engagement / 30) * 100),
      behavior: Math.round((behavior / 30) * 100),
      budget_match: Math.round((budget / 20) * 100),
      timeline: Math.round((timeline / 15) * 100),
      qualification: Math.round((qualification / 5) * 100),
    },
    actions,
  };
}

// ── The homepage scorer's inputs ─────────────────────────────────────────
// A visitor answers four plain questions; each answer stands for the activity
// the app would have recorded. Engagement assumes three emails sent.

export type Engagement = "none" | "opens" | "replies";
export type ListingsViewed = 0 | 1 | 3 | 5;

export interface ScorerAnswers {
  timeline: Timeline;
  preApproved: boolean;
  engagement: Engagement;
  listings: ListingsViewed;
}

export function answersToInput(a: ScorerAnswers): ScoreInput {
  const email = {
    none: { emails_opened: 0, emails_clicked: 0, emails_replied: 0, opened_recently: false },
    opens: { emails_opened: 3, emails_clicked: 1, emails_replied: 0, opened_recently: true },
    replies: { emails_opened: 3, emails_clicked: 2, emails_replied: 2, opened_recently: true },
  }[a.engagement];
  return {
    stats: {
      emails_sent: 3,
      ...email,
      // Each listing viewed is roughly two site visits; three or more is a
      // session long enough to earn the time-on-site points.
      website_visits: a.listings * 2,
      properties_viewed: a.listings,
      documents_viewed: 0,
      avg_session_duration: a.listings >= 3 ? 240 : 60,
    },
    budget: null,
    timeline: a.timeline,
    pre_approved: a.preApproved,
  };
}
