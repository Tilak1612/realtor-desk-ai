import type { AutomationSequence } from "@/types/rd";

// Automation sequences that back /app/automation. Three sequences cover
// the common motions: new-lead welcome, went-cold revive, showing
// follow-up. Step counts + template ids stay stable so the editor view
// can be wired to mutate real rows later.

export const MOCK_AUTOMATIONS: AutomationSequence[] = [
  {
    id: "seq_welcome_bilingual",
    name: "Bilingual new-lead welcome",
    trigger: "lead.created",
    active: true,
    lastRunAt: "2026-04-21T04:17:00Z",
    stats30d: { sent: 204, opened: 162, replied: 71 },
    steps: [
      { id: "s1", kind: "ai_followup", label: "AI replies within 60 seconds" },
      { id: "s2", kind: "wait", label: "Wait 24 hours", hours: 24 },
      { id: "s3", kind: "email", label: "Send bilingual welcome email", templateId: "welcome_bilingual" },
      { id: "s4", kind: "wait", label: "Wait 3 days", hours: 72 },
      { id: "s5", kind: "sms", label: "Check-in SMS (language-matched)", templateId: "checkin_sms" },
    ],
  },
  {
    id: "seq_cold_revive",
    name: "Went-cold revive",
    trigger: "lead.wentCold",
    active: true,
    lastRunAt: "2026-04-20T15:41:00Z",
    stats30d: { sent: 61, opened: 29, replied: 9 },
    steps: [
      { id: "c1", kind: "email", label: "Send market update email", templateId: "market_update" },
      { id: "c2", kind: "wait", label: "Wait 5 days", hours: 120 },
      { id: "c3", kind: "task", label: "Create call task for assigned agent" },
    ],
  },
  {
    id: "seq_showing_followup",
    name: "Post-showing follow-up",
    trigger: "showing.scheduled",
    active: false,
    stats30d: { sent: 0, opened: 0, replied: 0 },
    steps: [
      { id: "p1", kind: "wait", label: "Wait until showing ends", hours: 0 },
      { id: "p2", kind: "email", label: "Send showing feedback form", templateId: "showing_feedback" },
      { id: "p3", kind: "wait", label: "Wait 48 hours", hours: 48 },
      { id: "p4", kind: "ai_followup", label: "AI asks for next-step preference" },
    ],
  },
];
