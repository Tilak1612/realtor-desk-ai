import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RDCard } from "../Card";
import { SkeletonLines } from "../Skeleton";
import { IconArrow } from "../icons";
import type { DashSummary } from "@/lib/rd/dashboard";
import type { LeadSource } from "@/types/rd";
import { appLocale, formatCad, formatCount, formatPct } from "@/lib/rd/format";

// The three supporting cards under the queue. All read the same DashSummary,
// so the stage counts here always add up to the "Open pipeline" tile above.

function CardHeader({ id, title, sub }: { id: string; title: string; sub?: string }) {
  return (
    <div className="px-5 py-4 border-b border-rd-line">
      <h2 id={id} className="text-[15px] font-semibold">
        {title}
      </h2>
      {sub && <p className="text-xs text-rd-ink-500 mt-0.5">{sub}</p>}
    </div>
  );
}

const STAGE_TONE: Record<string, string> = {
  new: "bg-rd-navy-300",
  contacted: "bg-rd-navy-400",
  qualified: "bg-rd-navy-500",
  showing: "bg-rd-navy-700",
  offer: "bg-rd-terra-600",
};

export function PipelineStagesCard({ summary, loading }: { summary: DashSummary | null; loading: boolean }) {
  const { t, i18n } = useTranslation();
  const locale = appLocale(i18n.language);
  const max = summary ? Math.max(1, ...summary.stages.map((s) => s.count)) : 1;
  return (
    <RDCard padding={0} className="overflow-hidden" aria-labelledby="dash-pipeline">
      <CardHeader id="dash-pipeline" title={t("rd.dash.pipeline.title")} sub={t("rd.dash.pipeline.sub")} />
      {loading || !summary ? (
        <SkeletonLines rows={5} />
      ) : summary.openLeads === 0 ? (
        <p className="px-5 py-8 text-center text-[13px] text-rd-ink-500">{t("rd.dash.pipeline.empty")}</p>
      ) : (
        <div className="p-5">
          <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
            {summary.stages.map((s) => {
              const label = t(`rd.dash.stage.${s.stage}`);
              const value = s.value > 0 ? formatCad(s.value, locale, true) : "—";
              return (
                <li key={s.stage}>
                  <Link
                    to={`/app/leads?stage=${s.stage}`}
                    className="grid grid-cols-[88px_minmax(0,1fr)_72px] items-center gap-3 rounded-rd-sm hover:bg-rd-ink-50 -mx-2 px-2 py-1"
                    aria-label={t("rd.dash.pipeline.stageAria", { stage: label, count: s.count, value })}
                  >
                    <span className="text-[13px] font-medium truncate">{label}</span>
                    <span className="h-6 rounded-[5px] bg-rd-ink-50 overflow-hidden" aria-hidden="true">
                      <span
                        className={`h-full flex items-center pl-2 text-[11px] font-bold text-white rounded-[5px] ${STAGE_TONE[s.stage]}`}
                        style={{ width: `${Math.max(s.count > 0 ? 12 : 0, (s.count / max) * 100)}%` }}
                      >
                        {s.count > 0 ? formatCount(s.count, locale) : ""}
                      </span>
                    </span>
                    <span className="text-right text-[13px] font-semibold tabular-nums">{value}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            to="/app/pipeline"
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-rd-navy-800 hover:underline"
          >
            {t("rd.dash.pipeline.open")} <IconArrow />
          </Link>
        </div>
      )}
    </RDCard>
  );
}

// i18n keys cannot contain "." (it is the path separator), and "Realtor.ca"
// does — so labels are looked up through stable ids, never the display value.
const SOURCE_KEY: Record<LeadSource, string> = {
  DDF: "DDF",
  "Realtor.ca": "RealtorCa",
  Form: "Form",
  "Open house": "OpenHouse",
  Ads: "Ads",
  Referral: "Referral",
  Other: "Other",
};

export function SourcesCard({ summary, loading }: { summary: DashSummary | null; loading: boolean }) {
  const { t, i18n } = useTranslation();
  const locale = appLocale(i18n.language);
  const total = summary ? Math.max(1, summary.totalContacts) : 1;
  return (
    <RDCard padding={0} className="overflow-hidden" aria-labelledby="dash-sources">
      <CardHeader id="dash-sources" title={t("rd.dash.sources.title")} sub={t("rd.dash.sources.sub")} />
      {loading || !summary ? (
        <SkeletonLines rows={5} />
      ) : summary.sources.length === 0 ? (
        <p className="px-5 py-8 text-center text-[13px] text-rd-ink-500">{t("rd.dash.sources.empty")}</p>
      ) : (
        <ul className="list-none m-0 p-5 flex flex-col gap-3">
          {summary.sources.slice(0, 6).map((s) => {
            const share = s.leads / total;
            return (
              <li key={s.source} className="text-[13px]">
                <div className="flex justify-between gap-3 mb-1.5">
                  <span>{t(`rd.dash.sources.label.${SOURCE_KEY[s.source]}`)}</span>
                  <span className="text-rd-ink-500 tabular-nums whitespace-nowrap">
                    <span className="text-rd-ink-900 font-semibold">{formatCount(s.leads, locale)}</span>
                    {" · "}
                    {formatPct(share, locale)}
                    {s.won > 0 && (
                      <span className="ml-2 text-rd-success font-semibold">{t("rd.dash.sources.won", { count: s.won })}</span>
                    )}
                  </span>
                </div>
                <div className="h-1.5 bg-rd-ink-100 rounded-[3px] overflow-hidden flex" aria-hidden="true">
                  <div className="h-full bg-rd-success" style={{ width: `${(s.won / total) * 100}%` }} />
                  <div className="h-full bg-rd-navy-700" style={{ width: `${((s.leads - s.won) / total) * 100}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </RDCard>
  );
}

export function ConsentCard({ summary, loading }: { summary: DashSummary | null; loading: boolean }) {
  const { t, i18n } = useTranslation();
  const locale = appLocale(i18n.language);
  const c = summary?.consent;
  const none = c ? Math.max(0, c.open - c.consented - c.unsubscribed) : 0;
  const rows = c
    ? [
        { key: "consented", value: c.consented, tone: "bg-rd-success", text: "text-rd-success" },
        { key: "none", value: none, tone: "bg-rd-warning", text: "text-[#8A6516]" },
        { key: "unsubscribed", value: c.unsubscribed, tone: "bg-rd-danger", text: "text-rd-danger" },
      ]
    : [];
  return (
    <RDCard padding={0} className="overflow-hidden" aria-labelledby="dash-consent">
      <CardHeader id="dash-consent" title={t("rd.dash.consent.title")} sub={t("rd.dash.consent.sub")} />
      {loading || !c ? (
        <SkeletonLines rows={3} />
      ) : (
        <div className="p-5">
          {c.open > 0 && (
            <div className="flex h-2.5 rounded-[5px] overflow-hidden bg-rd-ink-100 mb-4" aria-hidden="true">
              {rows.map((r) =>
                r.value > 0 ? <div key={r.key} className={r.tone} style={{ width: `${(r.value / c.open) * 100}%` }} /> : null
              )}
            </div>
          )}
          <dl className="m-0 flex flex-col gap-2 text-[13px]">
            {rows.map((r) => (
              <div key={r.key} className="flex justify-between gap-3">
                <dt className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${r.tone}`} aria-hidden="true" />
                  {t(`rd.dash.consent.${r.key}`)}
                </dt>
                <dd className={`m-0 font-semibold tabular-nums ${r.value > 0 ? r.text : "text-rd-ink-500"}`}>
                  {formatCount(r.value, locale)}
                  {c.open > 0 && <span className="text-rd-ink-500 font-normal"> · {formatPct(r.value / c.open, locale)}</span>}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-rd-ink-500 leading-[1.5]">{t("rd.dash.consent.note")}</p>
        </div>
      )}
    </RDCard>
  );
}
