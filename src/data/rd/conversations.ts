import type { ConversationMessage } from "@/types/rd";

// Realistic bilingual conversation fixtures for /app/leads/:id and
// /app/inbox. Keep each lead's thread in chronological order.
//
// Sourced from the design's "lead detail" artboard so the EN ↔ FR
// switching is visible in screenshots.

export const MOCK_CONVERSATIONS: Record<string, ConversationMessage[]> = {
  lead_emilie: [
    {
      id: "msg_emilie_1",
      leadId: "lead_emilie",
      channel: "chat",
      author: "lead",
      authorName: "Émilie Tremblay",
      body: "Bonjour, est-ce que le condo sur Saint-Denis est toujours disponible? Je peux visiter samedi.",
      language: "FR",
      sentAt: "2026-04-20T23:47:00Z",
    },
    {
      id: "msg_emilie_2",
      leadId: "lead_emilie",
      channel: "chat",
      author: "ai",
      authorName: "Desk AI",
      body: "Bonjour Émilie — oui, il est toujours disponible. Je peux vous réserver samedi à 10h00 ou 14h00, selon votre disponibilité.",
      language: "FR",
      sentAt: "2026-04-20T23:47:18Z",
    },
    {
      id: "msg_emilie_3",
      leadId: "lead_emilie",
      channel: "chat",
      author: "lead",
      authorName: "Émilie Tremblay",
      body: "19h serait parfait. Oui, une place de stationnement est importante.",
      language: "FR",
      sentAt: "2026-04-20T23:48:05Z",
    },
    {
      id: "msg_emilie_4",
      leadId: "lead_emilie",
      channel: "chat",
      author: "system",
      authorName: "System",
      body: "CASL consent captured — implied consent, business inquiry",
      systemNote: "CASL consent captured — implied consent, business inquiry",
      language: "FR",
      sentAt: "2026-04-20T23:48:12Z",
    },
    {
      id: "msg_emilie_5",
      leadId: "lead_emilie",
      channel: "chat",
      author: "ai",
      authorName: "Desk AI",
      body: "Parfait, je confirme samedi 19h00 avec une place de stationnement incluse. Je vous envoie les détails par courriel.",
      language: "FR",
      sentAt: "2026-04-20T23:48:30Z",
    },
  ],

  lead_hassan: [
    {
      id: "msg_hassan_1",
      leadId: "lead_hassan",
      channel: "chat",
      author: "lead",
      authorName: "Hassan Ahmed",
      body: "What are the school catchments for Lorne Park PS? We have two kids starting this fall.",
      language: "EN",
      sentAt: "2026-04-21T08:14:00Z",
    },
    {
      id: "msg_hassan_2",
      leadId: "lead_hassan",
      channel: "chat",
      author: "ai",
      authorName: "Desk AI",
      body: "Lorne Park PS serves the streets north of QEW between Mississauga Rd and Indian Rd. The Mississauga 3BR listing is inside that catchment. I can send you the exact boundary map if helpful.",
      language: "EN",
      sentAt: "2026-04-21T08:14:24Z",
    },
  ],

  lead_chen: [
    {
      id: "msg_chen_1",
      leadId: "lead_chen",
      channel: "chat",
      author: "lead",
      authorName: "Chen Wei",
      body: "Budget confirmed up to $1.1M CAD. When can we talk?",
      language: "EN",
      sentAt: "2026-04-21T07:02:00Z",
    },
    {
      id: "msg_chen_2",
      leadId: "lead_chen",
      channel: "chat",
      author: "ai",
      authorName: "Desk AI",
      body: "Great, noted $1.1M ceiling. Sarah is free tomorrow between 10–11 MT or 2–3 MT — which works? I can send a calendar invite.",
      language: "EN",
      sentAt: "2026-04-21T07:03:12Z",
    },
  ],
};

export function findConversation(leadId: string): ConversationMessage[] {
  return MOCK_CONVERSATIONS[leadId] ?? [];
}
