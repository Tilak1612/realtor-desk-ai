import { useTranslation } from "react-i18next";
import { RDButton } from "./Button";
import { IconPlus, IconSparkles } from "./icons";

// Honest empty / error states for list surfaces.
//
// These replace a pattern where every list hook fell back to MOCK_* fixtures
// whenever the query returned nothing OR errored. The error case was the
// dangerous one: a schema drift or RLS fault rendered plausible fake leads,
// so a real lead could be accepted and then be invisible while the screen
// looked healthy and full. That is the exact failure competitors are sued
// over in reviews ("100+ leads missing for a month").
//
// Rules: zero is a legitimate answer and gets a next action; an error says so
// and never substitutes data.

export function DataError({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  const { t } = useTranslation();
  return (
    <div
      role="alert"
      className="rounded-rd-lg border border-rd-danger/30 bg-rd-danger-bg/40 px-5 py-6 text-center"
    >
      <p className="text-sm font-semibold text-rd-danger">
        {t("rd.state.errorTitle", "We couldn't load your data")}
      </p>
      <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-rd-ink-700">
        {t(
          "rd.state.errorBody",
          "Nothing has been lost — we just can't display it right now. Reload in a moment, and contact support if it keeps happening.",
        )}
      </p>
      {message && (
        <p className="mt-2 font-rd-mono text-[11px] text-rd-ink-500">{message}</p>
      )}
      {onRetry && (
        <RDButton variant="outline" size="sm" onClick={onRetry} className="mt-4">
          {t("rd.actions.retry", "Try again")}
        </RDButton>
      )}
    </div>
  );
}

export function EmptyLeads({ onAdd }: { onAdd?: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-rd-lg border border-dashed border-rd-line-strong bg-white px-5 py-10 text-center">
      <IconSparkles className="mx-auto h-5 w-5 text-rd-terra-700" />
      <p className="mt-3 text-sm font-semibold text-rd-ink-900">
        {t("rd.state.noLeadsTitle", "No leads yet")}
      </p>
      <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-rd-ink-600">
        {t(
          "rd.state.noLeadsBody",
          "Add your first lead, or connect a source so new enquiries land here automatically.",
        )}
      </p>
      {onAdd && (
        <RDButton variant="primary" size="sm" icon={<IconPlus />} onClick={onAdd} className="mt-4">
          {t("rd.actions.addLead", "Add lead")}
        </RDButton>
      )}
    </div>
  );
}

export function EmptyGeneric({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-rd-lg border border-dashed border-rd-line-strong bg-white px-5 py-10 text-center">
      <p className="text-sm font-semibold text-rd-ink-900">{title}</p>
      <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-rd-ink-600">{body}</p>
    </div>
  );
}
