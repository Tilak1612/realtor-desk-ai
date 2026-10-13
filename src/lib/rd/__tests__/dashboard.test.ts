import { describe, expect, it } from "vitest";
import {
  awaitsReply,
  buildNextUp,
  computeSummary,
  consentOf,
  pctChange,
  MIN_RESPONSE_SAMPLE,
  type DashContact,
  type DashInput,
  type DashMessage,
} from "../dashboard";

// Fixed clock: Friday 2026-10-09 10:00 local.
const NOW = new Date(2026, 9, 9, 10, 0, 0);
const MIN = 60_000;
const DAY = 86_400_000;
const ago = (ms: number) => new Date(NOW.getTime() - ms).toISOString();
const dateOnly = (offsetDays: number) => {
  const d = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

let n = 0;
function contact(over: Partial<DashContact> = {}): DashContact {
  n += 1;
  return {
    id: `c${n}`,
    first_name: `First${n}`,
    last_name: "Last",
    email: `p${n}@example.com`,
    phone: "416-555-0100",
    stage: "contacted",
    source: "Referral",
    preferred_language: "en",
    ai_score: 50,
    created_at: ago(60 * DAY),
    last_contact_date: ago(2 * DAY),
    next_followup_date: null,
    casl_consent: true,
    consent_given: null,
    consent_date: null,
    unsubscribed: false,
    budget: null,
    ...over,
  };
}
const input = (contacts: DashContact[], messages: DashMessage[] = [], tasks: DashInput["tasks"] = []): DashInput => ({
  contacts,
  messages,
  tasks,
});

describe("computeSummary", () => {
  it("counts every contact, not a capped page — 600 open leads report 600", () => {
    const many = Array.from({ length: 600 }, () => contact({ budget: 100_000 }));
    const s = computeSummary(input(many), NOW);
    expect(s.openLeads).toBe(600);
    expect(s.pipelineValue).toBe(60_000_000);
    expect(s.totalContacts).toBe(600);
  });

  it("excludes won and lost from open leads and pipeline, but counts won per source", () => {
    const s = computeSummary(
      input([
        contact({ stage: "won", budget: 900_000, source: "Open house" }),
        contact({ stage: "lost", budget: 500_000 }),
        contact({ stage: "offer", budget: "750000", source: "Open house" }),
      ]),
      NOW
    );
    expect(s.openLeads).toBe(1);
    expect(s.pipelineValue).toBe(750_000);
    expect(s.stages.find((x) => x.stage === "offer")).toEqual({ stage: "offer", count: 1, value: 750_000 });
    expect(s.sources.find((x) => x.source === "Open house")).toEqual({ source: "Open house", leads: 2, won: 1 });
  });

  it("maps the legacy 'new_lead' stage to new", () => {
    const s = computeSummary(input([contact({ stage: "new_lead" })]), NOW);
    expect(s.stages.find((x) => x.stage === "new")!.count).toBe(1);
  });

  it("splits new leads into this week vs the week before", () => {
    const s = computeSummary(
      input([
        contact({ created_at: ago(1 * DAY) }),
        contact({ created_at: ago(6 * DAY) }),
        contact({ created_at: ago(8 * DAY) }),
        contact({ created_at: ago(30 * DAY) }),
      ]),
      NOW
    );
    expect(s.newLeads7d).toBe(2);
    expect(s.newLeadsPrev7d).toBe(1);
  });

  it("treats a follow-up date as a calendar day: today is due, yesterday is due and overdue", () => {
    const s = computeSummary(
      input([
        contact({ next_followup_date: dateOnly(0) }),
        contact({ next_followup_date: dateOnly(-1) }),
        contact({ next_followup_date: dateOnly(1) }),
      ]),
      NOW
    );
    expect(s.followupsDue).toBe(2);
    expect(s.followupsOverdue).toBe(1);
  });

  it("counts a lead as awaiting reply only when their message is the last one", () => {
    const a = contact();
    const b = contact();
    const s = computeSummary(
      input(
        [a, b],
        [
          { lead_id: a.id, author: "lead", sent_at: ago(30 * MIN) },
          { lead_id: b.id, author: "lead", sent_at: ago(60 * MIN) },
          { lead_id: b.id, author: "agent", sent_at: ago(50 * MIN) },
        ]
      ),
      NOW
    );
    expect(s.awaitingReply).toBe(1);
  });

  it("reports no first-response median below the minimum sample", () => {
    const c = contact();
    const msgs: DashMessage[] = [];
    for (let i = 0; i < MIN_RESPONSE_SAMPLE - 1; i++) {
      msgs.push({ lead_id: c.id, author: "lead", sent_at: ago((i + 1) * DAY) });
      msgs.push({ lead_id: c.id, author: "ai", sent_at: ago((i + 1) * DAY - 4 * MIN) });
    }
    const s = computeSummary(input([c], msgs), NOW);
    expect(s.firstResponseMedianMin).toBeNull();
    expect(s.firstResponseSample).toBe(MIN_RESPONSE_SAMPLE - 1);
  });

  it("computes the median minutes from the first unanswered lead message to the reply", () => {
    const leads = Array.from({ length: 5 }, () => contact());
    const msgs: DashMessage[] = [];
    [2, 4, 6, 8, 100].forEach((mins, i) => {
      const at = (i + 1) * DAY;
      msgs.push({ lead_id: leads[i].id, author: "lead", sent_at: ago(at) });
      // a second lead message before the reply must not restart the clock
      msgs.push({ lead_id: leads[i].id, author: "lead", sent_at: ago(at - 1 * MIN) });
      msgs.push({ lead_id: leads[i].id, author: "agent", sent_at: ago(at - mins * MIN) });
    });
    const s = computeSummary(input(leads, msgs), NOW);
    expect(s.firstResponseMedianMin).toBe(6);
  });

  it("counts consent among open leads, with unsubscribed overriding consent", () => {
    const s = computeSummary(
      input([
        contact({ casl_consent: true }),
        contact({ casl_consent: false, consent_given: true }),
        contact({ casl_consent: false, consent_given: false }),
        contact({ casl_consent: true, unsubscribed: true }),
      ]),
      NOW
    );
    expect(s.consent).toEqual({ open: 4, consented: 2, unsubscribed: 1 });
  });
});

describe("suppression and dates", () => {
  it("a suppressed address blocks email in the queue and counts as unsubscribed", () => {
    const a = contact({ ai_score: 95, casl_consent: true, email: "Gone@Example.com" });
    const q = buildNextUp({ ...input([a]), suppressedEmails: ["gone@example.com"] }, NOW);
    expect(q[0].consent).toBe("unsubscribed");
    const s = computeSummary({ ...input([a]), suppressedEmails: ["gone@example.com"] }, NOW);
    expect(s.consent).toEqual({ open: 1, consented: 0, unsubscribed: 1 });
  });

  it("on a spring-forward day, tomorrow's follow-up is not due today", () => {
    // CI runs in UTC, which has no DST, so the zone is pinned for this test
    // only (Node re-reads TZ at runtime) and restored after. 2027-03-14 is 23
    // hours long in Edmonton; "today + 24h" lands at 1 a.m. on the 15th.
    const prev = process.env.TZ;
    process.env.TZ = "America/Edmonton";
    try {
      const springForward = new Date(2027, 2, 14, 10, 0, 0);
      const tomorrowMorning = new Date(2027, 2, 15, 0, 30, 0).toISOString();
      const s = computeSummary(input([contact({ next_followup_date: tomorrowMorning })]), springForward);
      expect(s.followupsDue).toBe(0);
    } finally {
      if (prev === undefined) delete process.env.TZ;
      else process.env.TZ = prev;
    }
  });
});

describe("buildNextUp", () => {
  it("ranks awaiting > new > overdue > task > due > quiet > hot, one row per lead", () => {
    const hot = contact({ ai_score: 92, last_contact_date: ago(1 * DAY) });
    const quiet = contact({ stage: "qualified", last_contact_date: ago(20 * DAY) });
    const due = contact({ next_followup_date: dateOnly(0) });
    const tasked = contact();
    const overdue = contact({ next_followup_date: dateOnly(-3) });
    const fresh = contact({ stage: "new", created_at: ago(2 * 60 * MIN), last_contact_date: null });
    const waiting = contact({ next_followup_date: dateOnly(-5) }); // also overdue: appears once, as awaiting
    const done = contact({ stage: "won", ai_score: 99 });

    const q = buildNextUp(
      input(
        [hot, quiet, due, tasked, overdue, fresh, waiting, done],
        [{ lead_id: waiting.id, author: "lead", sent_at: ago(22 * MIN) }],
        [{ id: "t1", contact_id: tasked.id, title: "Send CMA", due_date: dateOnly(0), status: "pending" }]
      ),
      NOW,
      20
    );
    expect(q.map((i) => i.bucket)).toEqual(["awaiting", "new", "overdue", "task", "due", "quiet", "hot"]);
    expect(q.map((i) => i.id)).toEqual([waiting.id, fresh.id, overdue.id, tasked.id, due.id, quiet.id, hot.id]);
    expect(q[0].reason.values).toEqual({ minutes: 22 });
    expect(q[2].reason.values).toEqual({ days: 3 });
    expect(q[3].reason.values).toEqual({ title: "Send CMA" });
    expect(q.find((i) => i.id === done.id)).toBeUndefined();
  });

  it("ignores completed tasks and tasks due in the future", () => {
    const a = contact();
    const q = buildNextUp(
      input(
        [a],
        [],
        [
          { id: "t1", contact_id: a.id, title: "x", due_date: dateOnly(0), status: "completed" },
          { id: "t2", contact_id: a.id, title: "y", due_date: dateOnly(2), status: "pending" },
        ]
      ),
      NOW
    );
    expect(q).toEqual([]);
  });

  it("does not call a lead 'new' once anyone has replied to them", () => {
    const a = contact({ stage: "new", created_at: ago(60 * MIN), last_contact_date: null, ai_score: 10 });
    const q = buildNextUp(input([a], [{ lead_id: a.id, author: "ai", sent_at: ago(55 * MIN) }]), NOW);
    expect(q).toEqual([]);
  });

  it("carries consent state so the UI can block email to unconsented contacts", () => {
    const a = contact({ ai_score: 90, casl_consent: false, consent_given: false });
    const b = contact({ ai_score: 85, unsubscribed: true });
    const q = buildNextUp(input([a, b]), NOW);
    expect(q.map((i) => i.consent)).toEqual(["none", "unsubscribed"]);
  });

  it("respects the limit", () => {
    const many = Array.from({ length: 20 }, () => contact({ ai_score: 95 }));
    expect(buildNextUp(input(many), NOW, 8)).toHaveLength(8);
  });
});

describe("helpers", () => {
  const cs = { casl_consent: false, consent_given: false, consent_date: null, unsubscribed: false, email: "a@b.ca" };
  it("consentOf: nothing on file", () => {
    expect(consentOf(cs)).toBe("none");
  });
  it("consentOf: the add-lead path stamps only consent_date, and that is consent", () => {
    expect(consentOf({ ...cs, consent_date: "2026-10-01T12:00:00Z" })).toBe("consented");
  });
  it("consentOf: withdrawal keeps consent_date as history but unsubscribed wins", () => {
    expect(consentOf({ ...cs, consent_date: "2026-10-01T12:00:00Z", unsubscribed: true })).toBe("unsubscribed");
  });
  it("consentOf: a suppressed ADDRESS wins even when the contact row still says consented", () => {
    expect(consentOf({ ...cs, casl_consent: true, email: " A@B.ca " }, new Set(["a@b.ca"]))).toBe("unsubscribed");
  });
  it("awaitsReply: open lead, lead spoke last, within 30 days", () => {
    const now = new Date(2026, 9, 9, 10);
    expect(awaitsReply({ author: "lead", sent_at: new Date(2026, 9, 9, 9).toISOString() }, "contacted", now)).toBe(true);
    expect(awaitsReply({ author: "lead", sent_at: new Date(2026, 9, 9, 9).toISOString() }, "won", now)).toBe(false);
    expect(awaitsReply({ author: "ai", sent_at: new Date(2026, 9, 9, 9).toISOString() }, "contacted", now)).toBe(false);
    expect(awaitsReply({ author: "lead", sent_at: new Date(2026, 7, 1).toISOString() }, "contacted", now)).toBe(false);
    expect(awaitsReply(undefined, "new", now)).toBe(false);
  });
  it("pctChange", () => {
    expect(pctChange(14, 11)).toBeCloseTo(0.2727, 3);
    expect(pctChange(3, 0)).toBeNull();
    expect(pctChange(null, 4)).toBeNull();
  });
});
