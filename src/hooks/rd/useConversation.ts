import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";
import type {
  ConversationAuthor,
  ConversationChannel,
  ConversationMessage,
  Language,
} from "@/types/rd";
import {
  mapConversationRow,
  toInsertRow,
  type ConversationMessageRow,
} from "@/lib/rd/mapConversation";

// React Query hooks over public.conversation_messages.
//
// Read:
//   - useConversation(leadId) — ordered oldest→newest for the thread view
//   - useInboxThreads()       — latest message per lead, for /app/inbox
//
// Write:
//   - useSendMessage()        — inserts an agent-authored message and
//                               invalidates both queries so open panes
//                               refresh immediately.

const COLS =
  "id, lead_id, channel, author, author_name, body, language, sent_at, system_note";

export function useConversation(leadId: string | undefined) {
  const { user, loading: sessionLoading } = useSession();
  const userId = user?.id;

  const query = useQuery<ConversationMessage[], Error>({
    queryKey: ["rd.conversation", leadId, userId],
    queryFn: async () => {
      if (!userId || !leadId) return [];
      const { data, error } = await supabase
        .from("conversation_messages")
        .select(COLS)
        .eq("user_id", userId)
        .eq("lead_id", leadId)
        .order("sent_at", { ascending: true })
        .limit(500);
      if (error) throw new Error(error.message);
      return ((data ?? []) as unknown as ConversationMessageRow[]).map(mapConversationRow);
    },
    enabled: !!userId && !!leadId,
    staleTime: 10_000,
  });

  return {
    messages: query.data ?? [],
    loading: sessionLoading || query.isLoading,
    error: query.error ?? null,
  };
}

/** Latest message per lead for the inbox list. Two queries beats one
 *  window function because Supabase's PostgREST can't express it cleanly;
 *  the N here is tiny (we cap at the most recent 100 leads). */
export function useInboxThreads() {
  const { user, loading: sessionLoading } = useSession();
  const userId = user?.id;

  const query = useQuery<Record<string, ConversationMessage>, Error>({
    queryKey: ["rd.inbox-latest", userId],
    queryFn: async () => {
      if (!userId) return {};
      const { data, error } = await supabase
        .from("conversation_messages")
        .select(COLS)
        .eq("user_id", userId)
        .order("sent_at", { ascending: false })
        .limit(500);
      if (error) throw new Error(error.message);

      // Keep only the newest per lead_id (input is already DESC by sent_at).
      const byLead: Record<string, ConversationMessage> = {};
      for (const row of (data ?? []) as unknown as ConversationMessageRow[]) {
        if (!byLead[row.lead_id]) byLead[row.lead_id] = mapConversationRow(row);
      }
      return byLead;
    },
    enabled: !!userId,
    staleTime: 10_000,
  });

  return {
    latestByLead: query.data ?? {},
    loading: sessionLoading || query.isLoading,
    error: query.error ?? null,
  };
}

export interface SendMessageInput {
  leadId: string;
  body: string;
  channel?: ConversationChannel;
  author?: ConversationAuthor;
  authorName?: string;
  language?: Language;
}

export function useSendMessage() {
  const { user } = useSession();
  const userId = user?.id;
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: SendMessageInput) => {
      if (!userId) throw new Error("Not signed in.");
      const insert = toInsertRow(
        {
          channel: input.channel ?? "chat",
          author: input.author ?? "agent",
          authorName: input.authorName ?? "You",
          body: input.body,
          language: input.language ?? "EN",
        },
        { userId, leadId: input.leadId }
      );
      const { error } = await supabase
        .from("conversation_messages")
        .insert(insert);
      if (error) throw new Error(error.message);

      // Sending a message was recorded in exactly one place: the message row
      // itself. Nothing updated contacts.last_contact_date and nothing wrote
      // contact_activities -- so the Leads table read "Last activity: —" for
      // every lead including ones messaged seconds earlier, and the lead
      // record's Timeline was empty next to a live conversation on the same
      // screen. contact_activities held ZERO rows across the whole production
      // database for that reason.
      //
      // Both writes are deliberately non-fatal: the message is already sent
      // and the user must not see a failure for it. A failed bookkeeping write
      // degrades the timeline, it does not lose the message.
      const nowIso = new Date().toISOString();

      const { error: stampError } = await supabase
        .from("contacts")
        .update({ last_contact_date: nowIso })
        .eq("id", input.leadId)
        .eq("user_id", userId);
      if (stampError) {
        console.warn("[useSendMessage] last_contact_date not stamped:", stampError.message);
      }

      // Only outbound messages are agent activity. An inbound lead reply is
      // not something the agent did, and logging it as `email_sent` would
      // misattribute it the same way the dashboard feed used to.
      const author = input.author ?? "agent";
      if (author === "agent" || author === "ai") {
        const activityType = (input.channel ?? "chat") === "sms" ? "sms_sent" : "email_sent";
        const { error: activityError } = await supabase.from("contact_activities").insert({
          user_id: userId,
          contact_id: input.leadId,
          activity_type: activityType,
          title: author === "ai" ? "Desk AI replied" : "Message sent",
          description: input.body.slice(0, 280),
          metadata: { channel: input.channel ?? "chat", author },
        });
        if (activityError) {
          console.warn("[useSendMessage] activity not logged:", activityError.message);
        }
      }
    },
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({ queryKey: ["rd.conversation", variables.leadId] });
      qc.invalidateQueries({ queryKey: ["rd.inbox-latest"] });
      // The Leads table and lead record both read from the leads cache, which
      // now carries a changed last_contact_date.
      qc.invalidateQueries({ queryKey: ["rd.leads", userId] });
      qc.invalidateQueries({ queryKey: ["rd.activity", variables.leadId] });
    },
  });
}
