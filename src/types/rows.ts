import type { Json, Tables } from "@/integrations/supabase/types";

// Row shapes the legacy deal and task screens pass between components: the
// generated table rows plus the `contacts (first_name, last_name)` join those
// screens select, so a renamed or removed column fails the type check instead
// of reading undefined.
//
// There is deliberately no task metadata type. public.tasks has no metadata
// column (the repo's baseline schema and generated types, and a read-only
// check of the production project's column metadata on 2026-11-01), yet
// TaskItem and EditTaskModal read and write task.metadata. Likewise deals has
// no client_type, property_address, mls_number or property_type column, which
// DealDetailSidebar and EditDealModal read and EditDealModal writes. Typing
// either as if the columns existed would hide the mismatch; both are left
// untyped for an owner decision on where those fields should be stored.

/** The contact join selected alongside deals and tasks. */
export type ContactName = { first_name: string | null; last_name: string | null };

/** A task as the legacy task screens select it. */
export type TaskWithContact = Tables<"tasks"> & { contacts: ContactName | null };

/**
 * deals.metadata is free-form JSON; WinLossModal merges its keys into what is
 * already there, so every key is optional and anything else is kept.
 */
export type DealMetadata = { [key: string]: Json | undefined };

/** A deal as the legacy deal screens select it. */
export type DealRow = Omit<Tables<"deals">, "metadata"> & {
  metadata: DealMetadata | null;
  contacts?: ContactName | null;
};
