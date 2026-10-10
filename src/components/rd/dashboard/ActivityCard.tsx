import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { RDCard } from "../Card";
import { RDBadge } from "../Badge";
import { SkeletonRows } from "../Skeleton";
import { IconDot } from "../icons";
import type { ActivityItem } from "@/types/rd";
import { appLocale, formatClock } from "@/lib/rd/format";

// Recent activity, ported from the v1 dashboard's "Desk AI activity" card with
// the same data (useActivityFeed) and the same honesty rule — "Live" only when
// live rows render — but every string translated and each sentence built per
// language, since "replied to" word order does not survive translation.

type Filter = "all" | "replies" | "showings";

export function ActivityCard({
  activity,
  loading,
  names,
}: {
  activity: ActivityItem[];
  loading: boolean;
  names: Record<string, string>;
}) {
  const { t, i18n } = useTranslation();
  const locale = appLocale(i18n.language);
  const [filter, setFilter] = useState<Filter>("all");
  const rows = activity.filter((a) =>
    filter === "replies" ? a.kind === "ai_reply" : filter === "showings" ? a.kind === "ai_booked_showing" : true
  );

  const when = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    return d.toDateString() === now.toDateString()
      ? formatClock(d, locale)
      : d.toLocaleDateString(locale, { month: "short", day: "numeric" });
  };

  return (
    <RDCard padding={0} className="overflow-hidden" aria-labelledby="dash-activity">
      <div className="px-5 py-4 border-b border-rd-line flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 id="dash-activity" className="text-[15px] font-semibold">
            {t("rd.dash.activity.title")}
          </h2>
          {activity.length > 0 && (
            <RDBadge tone="success" size="sm">
              <IconDot />
              {t("rd.dash.activity.live")}
            </RDBadge>
          )}
        </div>
        {activity.length > 0 && (
          <div className="flex gap-1" role="group" aria-label={t("rd.dash.activity.filter")}>
            {(["all", "replies", "showings"] as const).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-semibold rounded-rd-pill border",
                  filter === f ? "bg-rd-navy-800 border-rd-navy-800 text-white" : "border-rd-line text-rd-ink-600"
                )}
              >
                {t(`rd.dash.activity.filter${f[0].toUpperCase()}${f.slice(1)}`)}
              </button>
            ))}
          </div>
        )}
      </div>
      {loading ? (
        <SkeletonRows rows={3} />
      ) : activity.length === 0 ? (
        <p className="px-5 py-8 text-center text-[13px] text-rd-ink-500">{t("rd.dash.activity.empty")}</p>
      ) : rows.length === 0 ? (
        <p className="px-5 py-8 text-center text-[13px] text-rd-ink-500">{t("rd.dash.activity.noMatch")}</p>
      ) : (
        <ol className="list-none m-0 py-2 px-0">
          {rows.slice(0, 6).map((a) => {
            const lead = (a.leadId && names[a.leadId]) || t("rd.dash.activity.aLead");
            const sentence = t(`rd.dash.activity.kind.${a.kind}`, { actor: a.actor, lead, summary: a.summary });
            return (
              <li key={a.id} className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 px-5 py-2.5">
                <time dateTime={a.at} className="text-[11px] text-rd-ink-500 font-semibold tabular-nums pt-0.5">
                  {when(a.at)}
                </time>
                <div className="min-w-0">
                  <p className="text-[13px]">
                    {a.leadId ? (
                      <Link to={`/app/leads/${a.leadId}`} className="hover:underline">
                        {sentence}
                      </Link>
                    ) : (
                      sentence
                    )}
                    {a.language === "FR" && (
                      <span className="ml-2 text-[10px] font-bold tracking-[0.08em] bg-rd-terra-100 text-rd-terra-800 rounded-[4px] px-1.5 py-[1px]">
                        FR
                      </span>
                    )}
                  </p>
                  {a.detail && <p className="text-xs text-rd-ink-500 mt-0.5 line-clamp-2">{a.detail}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </RDCard>
  );
}
