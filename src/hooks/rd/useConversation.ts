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
        .from("conversation_messages" as never)
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
        .from("conversation_messages" as never)
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
        .from("conversation_messages" as never)
        .insert(insert as never);
      if (error) throw new Error(error.message);
    },
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({ queryKey: ["rd.conversation", variables.leadId] });
      qc.invalidateQueries({ queryKey: ["rd.inbox-latest"] });
    },
  });
}
