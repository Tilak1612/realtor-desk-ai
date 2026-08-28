import { useCallback, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { useSession } from "./useSession";
import type { OnboardingState, OnboardingStepId } from "@/types/rd";
import { DEFAULT_ONBOARDING_STATE } from "@/data/rd";

// Persists the 5-step /onboarding wizard to user_onboarding.wizard_state.
// Two concerns separated:
//   - query  : hydrate the saved state (or DEFAULT_ONBOARDING_STATE on
//              first visit) as soon as we know the user id.
//   - mutate : save the whole blob on each step advance; debounced-ish
//              by React Query's own deduping + mutate() call sites.
//
// The DB column is jsonb; the shape is owned by OnboardingState in
// src/types/rd.ts. Validation is purely TypeScript for Phase C — if the
// column shape drifts later, a Zod check can wrap the read path.

interface UseOnboardingWizardResult {
  state: OnboardingState;
  loading: boolean;
  saving: boolean;
  /** Flip a step to "complete" (stamps ISO timestamp) and advance currentStep. */
  advance: (nextStep: OnboardingStepId) => void;
  /** Patch a single step's data block (profile, ddfConnection, aiPersona). */
  patch: (partial: Partial<OnboardingState>) => void;
  /** Force-save the current state. Rarely needed; advance/patch already save. */
  save: () => void;
  /**
   * Finish onboarding: stamp go_live complete AND flip
   * profiles.onboarding_completed. Resolves once the flag is written, so the
   * caller can navigate without racing the guards that read it.
   */
  complete: () => Promise<void>;
  completing: boolean;
}

const TABLE = "user_onboarding";

export function useOnboardingWizard(): UseOnboardingWizardResult {
  const { user, loading: sessionLoading } = useSession();
  const userId = user?.id;
  const qc = useQueryClient();

  // Hydrate
  const query = useQuery<OnboardingState>({
    queryKey: ["rd.onboarding", userId],
    queryFn: async () => {
      if (!userId) return DEFAULT_ONBOARDING_STATE;
      const { data, error } = await supabase
        .from(TABLE)
        .select("wizard_state")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) {
        // Row not found is fine — treat as first visit.
        if (error.code === "PGRST116") return DEFAULT_ONBOARDING_STATE;
        throw new Error(error.message);
      }
      const saved = (data?.wizard_state ?? null) as unknown as OnboardingState | null;
      return saved ?? DEFAULT_ONBOARDING_STATE;
    },
    enabled: !!userId,
    staleTime: 60_000,
  });

  // Local mirror so Onboarding.tsx can drive controlled inputs without
  // a round-trip per keystroke.
  const [localState, setLocalState] = useState<OnboardingState | null>(null);
  useEffect(() => {
    if (query.data && !localState) setLocalState(query.data);
  }, [query.data, localState]);

  const effective: OnboardingState = localState ?? query.data ?? DEFAULT_ONBOARDING_STATE;

  // Persist
  const mutation = useMutation({
    mutationFn: async (next: OnboardingState) => {
      if (!userId) return;
      const { error } = await supabase
        .from(TABLE)
        .upsert(
          { user_id: userId, wizard_state: next as unknown as Json },
          { onConflict: "user_id" }
        );
      if (error) throw new Error(error.message);
    },
    onSuccess: (_data, variables) => {
      qc.setQueryData(["rd.onboarding", userId], variables);
    },
  });

  const persist = useCallback(
    (next: OnboardingState) => {
      setLocalState(next);
      if (userId) mutation.mutate(next);
    },
    [mutation, userId]
  );

  const advance = useCallback(
    (nextStep: OnboardingStepId) => {
      const nowIso = new Date().toISOString();
      const next: OnboardingState = {
        ...effective,
        completed: {
          ...effective.completed,
          [effective.currentStep]: effective.completed[effective.currentStep] ?? nowIso,
        },
        currentStep: nextStep,
      };
      persist(next);
    },
    [effective, persist]
  );

  const patch = useCallback(
    (partial: Partial<OnboardingState>) => {
      persist({ ...effective, ...partial });
    },
    [effective, persist]
  );

  const save = useCallback(() => persist(effective), [effective, persist]);

  // Finishing the wizard has to write TWO places: the wizard blob (so the
  // steps read as done) and profiles.onboarding_completed (the flag every
  // route guard actually reads). Only the first was ever written, so users
  // completed onboarding and were redirected straight back into it — an
  // unbreakable loop. The flag write is awaited rather than fired alongside
  // the navigate, otherwise the guard on the destination can read a stale
  // false and bounce the user back.
  const completeMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("Not signed in.");
      const nowIso = new Date().toISOString();
      const next: OnboardingState = {
        ...effective,
        completed: { ...effective.completed, go_live: effective.completed.go_live ?? nowIso },
        currentStep: "go_live",
      };

      const { error: wizardError } = await supabase
        .from(TABLE)
        .upsert({ user_id: userId, wizard_state: next as unknown as Json }, { onConflict: "user_id" });
      if (wizardError) throw new Error(wizardError.message);

      const { error: flagError } = await supabase
        .from("profiles")
        .update({ onboarding_completed: true })
        .eq("id", userId);
      if (flagError) throw new Error(flagError.message);

      setLocalState(next);
      return next;
    },
    onSuccess: (next) => {
      if (next) qc.setQueryData(["rd.onboarding", userId], next);
    },
  });

  const complete = useCallback(async () => {
    await completeMutation.mutateAsync();
  }, [completeMutation]);

  return {
    state: effective,
    loading: sessionLoading || query.isLoading,
    saving: mutation.isPending,
    advance,
    patch,
    save,
    complete,
    completing: completeMutation.isPending,
  };
}
