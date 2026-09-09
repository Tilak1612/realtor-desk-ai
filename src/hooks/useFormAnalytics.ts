import { useRef, useCallback } from "react";
import { trackEvent } from "@/utils/analytics";

/**
 * Emits the two form events the funnel was missing: form_start and
 * form_submit.
 *
 * Existing per-form events (demo_request, sign_up, trial_start,
 * lead_magnet_signup) are deliberately left alone. They are specific and
 * already wired into reporting; renaming them would break continuity for no
 * gain. These two are the GENERIC pair, so completion rate can be compared
 * across forms that otherwise share no vocabulary -- which is the thing that
 * could not be asked before.
 *
 * Both fire once per mount. form_start in particular would otherwise fire on
 * every keystroke, and an event per character makes the metric meaningless
 * rather than merely noisy.
 */
export function useFormAnalytics(formId: string) {
  const fired = useRef({ start: false, submit: false });

  /** Call on the first real interaction — focus or change, not render. */
  const onStart = useCallback(() => {
    if (fired.current.start) return;
    fired.current.start = true;
    trackEvent("form_start", { form_id: formId });
  }, [formId]);

  /** Call only after the submission actually succeeded, never on attempt. */
  const onSubmitted = useCallback(() => {
    if (fired.current.submit) return;
    fired.current.submit = true;
    trackEvent("form_submit", { form_id: formId });
  }, [formId]);

  return { onStart, onSubmitted };
}
