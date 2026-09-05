import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { RDButton } from "./Button";
import { RDInput } from "./Input";
import { RDSelect } from "./Select";
import { useCreateLead } from "@/hooks/rd/useCreateLead";
import type { PipelineStage } from "@/types/rd";

// Add-lead modal. Deliberately minimal: name, email, phone, stage, source,
// language, city, budget — the fields the leads table actually renders.
//
// CASL: the consent checkbox is unchecked by default and consent_date is
// only stamped when the agent affirms it. The product markets CASL
// compliance; a consent record that defaults to "yes" would be worthless
// as evidence and wrong in law.

interface AddLeadDialogProps {
  open: boolean;
  onClose: () => void;
}

const STAGES: { value: PipelineStage; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "showing", label: "Showing" },
  { value: "offer", label: "Offer" },
];

const SOURCES = [
  { value: "website_form", label: "Website form" },
  { value: "crea_ddf", label: "CREA DDF" },
  { value: "referral", label: "Referral" },
  { value: "google_ads", label: "Google Ads" },
  { value: "facebook", label: "Facebook" },
  { value: "other", label: "Other" },
];

export function AddLeadDialog({ open, onClose }: AddLeadDialogProps) {
  const { t } = useTranslation();
  const createLead = useCreateLead();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState<PipelineStage>("new");
  const [source, setSource] = useState("website_form");
  const [language, setLanguage] = useState<"en" | "fr">("en");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [consent, setConsent] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);

  // Captured during render, deliberately. React applies the first-name field's
  // autoFocus during commit, and useEffect runs after that -- so reading
  // document.activeElement from the effect returns the input itself, and
  // refocusing it on unmount targets a node that has just been removed, which
  // drops focus to <body>. A test caught exactly that. Reading here, before
  // the DOM is touched, gets the element that actually opened the dialog.
  if (open && !wasOpen.current) {
    openerRef.current = document.activeElement as HTMLElement | null;
  }
  wasOpen.current = open;

  /**
   * Modal keyboard contract.
   *
   * This dialog declared role="dialog" and aria-modal="true" but implemented
   * none of what those promise: Escape did nothing, Tab walked straight out
   * into the page behind it, and closing dropped focus to the top of the
   * document. Claiming aria-modal while focus can leave is worse than not
   * claiming it — assistive tech tells the user the rest of the page is inert
   * while the keyboard says otherwise.
   *
   * Also locks body scroll, so the page behind does not scroll under the
   * dialog on a trackpad or a phone.
   */
  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const FOCUSABLE =
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      // Wrap at both ends so focus cannot escape the dialog.
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      // Return focus to whatever opened the dialog, not the top of the page.
      openerRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const reset = () => {
    setFirstName(""); setLastName(""); setEmail(""); setPhone("");
    setStage("new"); setSource("website_form"); setLanguage("en");
    setCity(""); setBudget(""); setConsent(false); setFieldError(null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setFieldError(t("rd.addLead.errFirstName", "First name is required."));
      return;
    }
    // Light format check only — the definitive validation is the DB.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFieldError(t("rd.addLead.errEmail", "Enter a valid email address."));
      return;
    }
    setFieldError(null);

    const budgetNum = budget ? Number(budget.replace(/[^0-9.]/g, "")) : undefined;
    createLead.mutate(
      {
        firstName, lastName, email, phone, stage, source,
        preferredLanguage: language,
        city: city || undefined,
        budgetCad: budgetNum && Number.isFinite(budgetNum) ? budgetNum : undefined,
        consentCaptured: consent,
      },
      {
        onSuccess: () => {
          toast.success(t("rd.addLead.created", "Lead added."));
          reset();
          onClose();
        },
        onError: (err) => {
          toast.error(
            t("rd.addLead.failed", "Couldn't add the lead: {{message}}", {
              message: err instanceof Error ? err.message : String(err),
            }),
          );
        },
      },
    );
  };

  const field = "flex flex-col gap-1";
  const label = "text-xs font-semibold text-rd-ink-600";

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rd-add-lead-title"
    >
      <div
        className="absolute inset-0 bg-rd-ink-950/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <form
        onSubmit={submit}
        className="relative w-full max-w-lg bg-white rounded-xl shadow-xl border border-rd-line p-6 max-h-[90vh] overflow-y-auto"
      >
        <h2 id="rd-add-lead-title" className="text-lg font-bold text-rd-ink-900 mb-4">
          {t("rd.addLead.title", "Add a lead")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className={field}>
            <label className={label} htmlFor="al-first">{t("rd.addLead.firstName", "First name")} *</label>
            <RDInput
              id="al-first"
              value={firstName}
              // Clear on edit. The error was only ever set in submit() and
              // never reset, so "First name is required." stayed on screen
              // after the user had typed a name — telling them a field they
              // had just filled was still wrong.
              onChange={(e) => {
                setFirstName(e.target.value);
                if (fieldError) setFieldError(null);
              }}
              aria-invalid={!!fieldError}
              aria-describedby={fieldError ? "al-first-error" : undefined}
              autoFocus
            />
          </div>
          <div className={field}>
            <label className={label} htmlFor="al-last">{t("rd.addLead.lastName", "Last name")}</label>
            <RDInput id="al-last" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className={field}>
            <label className={label} htmlFor="al-email">{t("rd.addLead.email", "Email")} *</label>
            <RDInput id="al-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className={field}>
            <label className={label} htmlFor="al-phone">{t("rd.addLead.phone", "Phone")}</label>
            <RDInput id="al-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className={field}>
            <label className={label} htmlFor="al-stage">{t("rd.addLead.stage", "Stage")}</label>
            <RDSelect
              id="al-stage"
              value={stage}
              onChange={(e) => setStage(e.target.value as PipelineStage)}
              options={STAGES.map((s) => ({ value: s.value, label: t(`rd.stages.${s.value}`, s.label) }))}
            />
          </div>
          <div className={field}>
            <label className={label} htmlFor="al-source">{t("rd.addLead.source", "Source")}</label>
            <RDSelect
              id="al-source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              options={SOURCES.map((s) => ({ value: s.value, label: t(`rd.sources.${s.value}`, s.label) }))}
            />
          </div>
          <div className={field}>
            <label className={label} htmlFor="al-lang">{t("rd.addLead.language", "Preferred language")}</label>
            <RDSelect
              id="al-lang"
              value={language}
              onChange={(e) => setLanguage(e.target.value as "en" | "fr")}
              options={[
                { value: "en", label: t("rd.addLead.langEn", "English") },
                { value: "fr", label: t("rd.addLead.langFr", "French") },
              ]}
            />
          </div>
          <div className={field}>
            <label className={label} htmlFor="al-city">{t("rd.addLead.city", "City")}</label>
            <RDInput id="al-city" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className={`${field} sm:col-span-2`}>
            <label className={label} htmlFor="al-budget">{t("rd.addLead.budget", "Budget (CAD)")}</label>
            <RDInput id="al-budget" inputMode="numeric" placeholder="750000" value={budget} onChange={(e) => setBudget(e.target.value)} />
          </div>
        </div>

        <label className="flex items-start gap-2.5 mt-4 text-sm text-rd-ink-700 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-rd-terra-700"
          />
          <span>
            {t(
              "rd.addLead.casl",
              "This contact gave express or implied consent to be contacted (CASL). The date is recorded.",
            )}
          </span>
        </label>

        {fieldError && (
          <p id="al-first-error" role="alert" className="mt-3 text-sm font-medium text-rd-danger">
            {fieldError}
          </p>
        )}

        <div className="flex justify-end gap-2.5 mt-6">
          <RDButton type="button" variant="ghost" onClick={onClose}>
            {t("rd.actions.cancel", "Cancel")}
          </RDButton>
          <RDButton type="submit" variant="primary" disabled={createLead.isPending}>
            {createLead.isPending
              ? t("rd.addLead.saving", "Saving…")
              : t("rd.actions.addLead", "Add lead")}
          </RDButton>
        </div>
      </form>
    </div>
  );
}
