// Account deletion: the order of operations, and nothing else.
//
// This file has NO imports on purpose. index.ts wires it to the real Supabase
// and Stripe clients; the vitest suite in
// src/lib/account/__tests__/deleteAccountFunction.test.ts wires it to fakes. The
// part of this feature that can do irreversible damage is the sequencing ("was
// billing stopped before the account went away?", "what do we report when step
// three of five fails?"), so that is the part kept runnable without Deno, a
// database or a Stripe key.
//
// THE ORDER, AND WHY IT IS THIS ORDER
//
//   1. demo_check            The shared reviewer account must survive review.
//   2. cancel_subscriptions  Billing is stopped FIRST. If Stripe refuses, we
//                            stop with the account intact. The reverse order
//                            could leave a card being charged for an account
//                            its owner can no longer sign in to and cancel.
//   3. delete_storage        Files have to go through the Storage API (a SQL
//                            delete orphans the underlying object), and Supabase
//                            documents that a user who still owns Storage
//                            objects cannot be deleted.
//   4. delete_rows           Only the tables whose rows would otherwise be
//                            orphaned. See EXPLICIT_USER_TABLES below.
//   5. delete_auth_user      Last, because it is the step that cannot be
//                            retried: once it succeeds the caller has no
//                            session to retry with. Everything else the account
//                            owns is removed here by ON DELETE CASCADE.
//
// Every step is safe to run twice, so a caller that gets a failure can simply
// call again and the run picks up where the last one stopped.

/** The exact body the caller must send: { "confirm": "DELETE" }. */
export const CONFIRM_PHRASE = "DELETE";

/**
 * Buckets holding files that belong to one account. In both, the first path
 * segment is the owner's user id (the storage RLS policies depend on it):
 *   avatars            {user_id}/{timestamp}.{ext}
 *   contact-documents  {user_id}/{contact_id}/{timestamp}.{ext}
 * The third production bucket, career-resumes (applications/...), holds job
 * applications from the public careers page and is not tied to an account.
 */
export const USER_STORAGE_BUCKETS = ["avatars", "contact-documents"] as const;

/**
 * Tables with a user_id column and NO foreign key on it, so deleting the auth
 * user would not touch them. Deleted explicitly, by user_id.
 *
 * The first three have no route to the user at all. The last four are reached
 * by a cascade through contacts(contact_id) already; they are listed anyway so
 * that "no row carrying this user id survives" does not rest on every row's
 * contact_id and user_id agreeing.
 */
export const EXPLICIT_USER_TABLES = [
  "property_listings",
  "oauth_state_store",
  "webhook_events",
  "contact_activities",
  "contact_documents",
  "contact_notes",
  "property_interests",
] as const;

/**
 * Tables keyed on a contact with no foreign key to contacts. Their rows would
 * outlive the contacts they describe, so they are deleted by contact id before
 * the contacts go.
 */
export const EXPLICIT_CONTACT_TABLES = ["email_log", "scheduled_emails"] as const;

/**
 * Kept on purpose. email_suppressions is the do-not-email list: one row per
 * address that unsubscribed, checked before every send. Its user_id and
 * contact_id foreign keys are ON DELETE SET NULL, so when the account goes the
 * row loses every link to it and keeps only the address, the source and the
 * date. Deleting it would let an address that opted out be emailed again.
 */
export const RETAINED_TABLES = ["email_suppressions"] as const;

/** A Stripe subscription in one of these states can no longer bill anyone. */
const TERMINAL_SUBSCRIPTION_STATUSES = new Set(["canceled", "incomplete_expired"]);

const STORAGE_LIST_PAGE = 100;
const STORAGE_REMOVE_BATCH = 100;
const CONTACT_PAGE = 1000;
// 100 uuids is about 3.7 kB of query string, well inside PostgREST's limit.
const CONTACT_DELETE_BATCH = 100;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type DeletionStep =
  | "demo_check"
  | "cancel_subscriptions"
  | "delete_storage"
  | "delete_rows"
  | "delete_auth_user";

export type DeletionErrorCode =
  | "invalid_user"
  | "demo_account"
  | "profile_check_failed"
  | "stripe_cancel_failed"
  | "storage_delete_failed"
  | "row_delete_failed"
  | "auth_delete_failed";

/** The JSON the function returns. `status` is the HTTP status, not part of the body. */
export interface DeletionOutcome {
  status: number;
  body: {
    success: boolean;
    /** True only when the auth user is gone. */
    deleted: boolean;
    code?: DeletionErrorCode;
    error?: string;
    failed_step?: DeletionStep;
    /** Steps that finished in THIS call, in order. */
    completed_steps: DeletionStep[];
    subscriptions_cancelled: number;
    storage_objects_removed: number;
  };
}

/**
 * Everything the sequence needs from the outside world. Each method throws on
 * failure; none returns an error value, so a failure cannot be read as "nothing
 * to do".
 */
export interface DeletionPorts {
  /** profiles.is_demo. Must throw if it cannot tell: an unknown answer is not "no". */
  isDemoAccount(userId: string): Promise<boolean>;
  /** Every Stripe customer carrying this email (the same lookup checkout uses). */
  listStripeCustomerIds(email: string): Promise<string[]>;
  /** Every subscription on a customer, in any status. */
  listSubscriptions(customerId: string): Promise<{ id: string; status: string }[]>;
  /** Cancel now, not at period end. */
  cancelSubscription(subscriptionId: string): Promise<void>;
  /** One page of one folder level. Folders come back with isFolder true. */
  listStorage(
    bucket: string,
    prefix: string,
    offset: number,
    limit: number,
  ): Promise<{ name: string; isFolder: boolean }[]>;
  removeStorage(bucket: string, paths: string[]): Promise<void>;
  /** The user's contact ids, in a stable order. */
  listContactIds(userId: string, offset: number, limit: number): Promise<string[]>;
  /** DELETE FROM table WHERE column IN (values). */
  deleteWhere(table: string, column: string, values: string[]): Promise<void>;
  /** Hard-delete the auth user. An already-missing user is not an error. */
  deleteAuthUser(userId: string): Promise<void>;
  /** Never pass anything personal here: ids, counts and step names only. */
  log(step: string, details?: Record<string, unknown>): void;
}

const message = (e: unknown): string => (e instanceof Error ? e.message : String(e));

/** Every object under `prefix`, however deep, as full paths. */
async function collectStoragePaths(
  ports: DeletionPorts,
  bucket: string,
  prefix: string,
): Promise<string[]> {
  const paths: string[] = [];
  const folders = [prefix];
  while (folders.length > 0) {
    const folder = folders.pop() as string;
    for (let offset = 0; ; offset += STORAGE_LIST_PAGE) {
      const page = await ports.listStorage(bucket, folder, offset, STORAGE_LIST_PAGE);
      for (const entry of page) {
        const full = folder + "/" + entry.name;
        if (entry.isFolder) folders.push(full);
        else paths.push(full);
      }
      if (page.length < STORAGE_LIST_PAGE) break;
    }
  }
  return paths;
}

export async function deleteAccount(
  user: { id: string; email: string | null },
  ports: DeletionPorts,
): Promise<DeletionOutcome> {
  const completed: DeletionStep[] = [];
  let subscriptionsCancelled = 0;
  let storageObjectsRemoved = 0;

  const fail = (
    step: DeletionStep,
    code: DeletionErrorCode,
    status: number,
    error: string,
  ): DeletionOutcome => ({
    status,
    body: {
      success: false,
      deleted: false,
      code,
      error,
      failed_step: step,
      completed_steps: [...completed],
      subscriptions_cancelled: subscriptionsCancelled,
      storage_objects_removed: storageObjectsRemoved,
    },
  });

  // The user id becomes a storage prefix and a filter value. An empty or odd
  // one would turn "this user's folder" into "the whole bucket", so refuse
  // anything that is not a uuid before touching anything.
  if (!UUID.test(user.id)) {
    return fail("demo_check", "invalid_user", 400, "The session did not carry a valid user id.");
  }

  // 1. Demo / reviewer account.
  try {
    if (await ports.isDemoAccount(user.id)) {
      ports.log("Refused: demo account", { userId: user.id });
      return fail(
        "demo_check",
        "demo_account",
        403,
        "This is a shared demo account and cannot be deleted.",
      );
    }
  } catch (e) {
    ports.log("ERROR demo check", { userId: user.id, message: message(e) });
    return fail(
      "demo_check",
      "profile_check_failed",
      500,
      "Could not verify the account before deleting it. Nothing was deleted.",
    );
  }
  completed.push("demo_check");

  // 2. Stop billing. Any failure here ends the run with the account intact.
  if (user.email) {
    try {
      const customerIds = await ports.listStripeCustomerIds(user.email);
      for (const customerId of customerIds) {
        const subscriptions = await ports.listSubscriptions(customerId);
        for (const subscription of subscriptions) {
          if (TERMINAL_SUBSCRIPTION_STATUSES.has(subscription.status)) continue;
          await ports.cancelSubscription(subscription.id);
          subscriptionsCancelled += 1;
        }
      }
      ports.log("Subscriptions cancelled", {
        userId: user.id,
        customers: customerIds.length,
        cancelled: subscriptionsCancelled,
      });
    } catch (e) {
      ports.log("ERROR cancelling subscriptions", { userId: user.id, message: message(e) });
      return fail(
        "cancel_subscriptions",
        "stripe_cancel_failed",
        502,
        "The subscription could not be cancelled, so the account was not deleted.",
      );
    }
  }
  completed.push("cancel_subscriptions");

  // 3. Files.
  try {
    for (const bucket of USER_STORAGE_BUCKETS) {
      const paths = await collectStoragePaths(ports, bucket, user.id);
      for (let i = 0; i < paths.length; i += STORAGE_REMOVE_BATCH) {
        const batch = paths.slice(i, i + STORAGE_REMOVE_BATCH);
        await ports.removeStorage(bucket, batch);
        storageObjectsRemoved += batch.length;
      }
    }
    ports.log("Storage objects removed", { userId: user.id, removed: storageObjectsRemoved });
  } catch (e) {
    ports.log("ERROR removing storage objects", { userId: user.id, message: message(e) });
    return fail(
      "delete_storage",
      "storage_delete_failed",
      500,
      "Some files could not be deleted. The account is still open; try again.",
    );
  }
  completed.push("delete_storage");

  // 4. Rows that no cascade reaches.
  try {
    for (let offset = 0; ; offset += CONTACT_PAGE) {
      const contactIds = await ports.listContactIds(user.id, offset, CONTACT_PAGE);
      for (let i = 0; i < contactIds.length; i += CONTACT_DELETE_BATCH) {
        const batch = contactIds.slice(i, i + CONTACT_DELETE_BATCH);
        for (const table of EXPLICIT_CONTACT_TABLES) {
          await ports.deleteWhere(table, "contact_id", batch);
        }
      }
      if (contactIds.length < CONTACT_PAGE) break;
    }
    for (const table of EXPLICIT_USER_TABLES) {
      await ports.deleteWhere(table, "user_id", [user.id]);
    }
    ports.log("Uncascaded rows removed", { userId: user.id });
  } catch (e) {
    ports.log("ERROR removing rows", { userId: user.id, message: message(e) });
    return fail(
      "delete_rows",
      "row_delete_failed",
      500,
      "Some records could not be deleted. The account is still open; try again.",
    );
  }
  completed.push("delete_rows");

  // 5. The auth user, and with it everything that cascades.
  try {
    await ports.deleteAuthUser(user.id);
    ports.log("Auth user deleted", { userId: user.id });
  } catch (e) {
    ports.log("ERROR deleting auth user", { userId: user.id, message: message(e) });
    return fail(
      "delete_auth_user",
      "auth_delete_failed",
      500,
      "Your files were deleted and billing was stopped, but the account itself could not be removed. Try again.",
    );
  }
  completed.push("delete_auth_user");

  return {
    status: 200,
    body: {
      success: true,
      deleted: true,
      completed_steps: completed,
      subscriptions_cancelled: subscriptionsCancelled,
      storage_objects_removed: storageObjectsRemoved,
    },
  };
}
