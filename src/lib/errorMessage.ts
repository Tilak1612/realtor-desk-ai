/**
 * The message of something caught, for showing in a toast.
 *
 * What reaches a catch block here is an Error (fetch, FunctionsHttpError) or a
 * plain object with a string `message` (Supabase's AuthError and PostgrestError
 * as thrown by `if (error) throw error`). Anything else, including a thrown
 * string, gives undefined so `errorMessage(e) || fallback` shows the fallback,
 * exactly as the `(e: any).message || fallback` it replaces did.
 */
export function errorMessage(error: unknown): string | undefined {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    const { message } = error as { message: unknown };
    return typeof message === "string" ? message : undefined;
  }
  return undefined;
}
