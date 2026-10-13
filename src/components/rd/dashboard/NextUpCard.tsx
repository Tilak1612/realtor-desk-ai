import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { RDCard } from "../Card";
import { SkeletonRows } from "../Skeleton";
import { IconMail, IconPhone, IconSparkles } from "../icons";
import type { QueueBucket, QueueItem } from "@/lib/rd/dashboard";
import { appLocale, formatDuration } from "@/lib/rd/format";

// "Next up" — the ranked who-to-contact-next queue (lib/rd/dashboard
// buildNextUp). Each row says why it is there in one line, shows the CASL
// consent state, and offers only the actions that state allows: email is
// disabled without consent and for unsubscribed contacts; a phone call is
// always allowed. A lead waiting on a reply gets "Reply", which opens their
// thread in Conversations.

const VISIBLE = 6;
const BUCKETS: QueueBucket[] = ["awaiting", "new", "overdue", "task", "due", "quiet", "hot"];

const BUCKET_TONE: Record<QueueBucket, string> = {
  awaiting: "bg-rd-danger-bg text-rd-danger",
  new: "bg-rd-navy-100 text-rd-navy-700",
  overdue: "bg-rd-danger-bg text-rd-danger",
  task: "bg-rd-warning-bg text-[#8A6516]",
  due: "bg-rd-warning-bg text-[#8A6516]",
  quiet: "bg-rd-ink-100 text-rd-ink-600",
  hot: "bg-rd-terra-100 text-rd-terra-800",
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

interface NextUpCardProps {
  items: QueueItem[];
  loading: boolean;
}

export function NextUpCard({ items, loading }: NextUpCardProps) {
  const { t, i18n } = useTranslation();
  const locale = appLocale(i18n.language);
  const [bucket, setBucket] = useState<QueueBucket | "all">("all");
  const [expanded, setExpanded] = useState(false);

  const counts = useMemo(() => {
    const c = Object.fromEntries(BUCKETS.map((b) => [b, 0])) as Record<QueueBucket, number>;
    for (const i of items) c[i.bucket] += 1;
    return c;
  }, [items]);

  const filtered = bucket === "all" ? items : items.filter((i) => i.bucket === bucket);
  const shown = expanded ? filtered : filtered.slice(0, VISIBLE);

  const reasonText = (item: QueueItem): string => {
    const v = item.reason.values;
    switch (item.reason.key) {
      case "awaiting":
      case "new":
        return t(`rd.dash.queue.reason.${item.reason.key}`, {
          time: formatDuration(Number(v.minutes), locale),
        });
      case "overdue":
        return t("rd.dash.queue.reason.overdue", { count: Number(v.days) });
      default:
        return t(`rd.dash.queue.reason.${item.reason.key}`, v);
    }
  };

  return (
    <RDCard padding={0} className="overflow-hidden border border-rd-line bg-rd-card" aria-labelledby="dash-next-up">
      <div className="px-5 py-4 border-b border-rd-line flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="w-7 h-7 rounded-rd-sm bg-rd-terra-600 text-white flex items-center justify-center" aria-hidden="true">
          <IconSparkles />
        </span>
        <h2 id="dash-next-up" className="text-base font-semibold">
          {t("rd.dash.queue.title")}
        </h2>
        <span className="text-xs text-rd-ink-500">{t("rd.dash.queue.sub")}</span>
      </div>

      {loading ? (
        <SkeletonRows rows={4} />
      ) : items.length === 0 ? (
        <p className="px-5 py-8 text-center text-[13px] text-rd-ink-500">{t("rd.dash.queue.empty")}</p>
      ) : (
        <>
          <div className="px-5 pt-3 pb-1 flex flex-wrap gap-1.5" role="group" aria-label={t("rd.dash.queue.filter")}>
            {(["all", ...BUCKETS] as const)
              .filter((b) => b === "all" || counts[b] > 0)
              .map((b) => (
                <button
                  key={b}
                  type="button"
                  aria-pressed={bucket === b}
                  onClick={() => {
                    setBucket(b);
                    setExpanded(false);
                  }}
                  className={cn(
                    "px-2.5 py-1 text-xs font-semibold rounded-rd-pill border transition-colors",
                    bucket === b
                      ? "bg-rd-navy-800 border-rd-navy-800 text-white"
                      : "border-rd-line text-rd-ink-600 hover:border-rd-ink-400"
                  )}
                >
                  {b === "all" ? t("rd.dash.queue.all") : t(`rd.dash.queue.bucket.${b}`)}
                  <span className="ml-1 opacity-70 tabular-nums">{b === "all" ? items.length : counts[b]}</span>
                </button>
              ))}
          </div>

          {filtered.length === 0 ? (
            <p className="px-5 py-8 text-center text-[13px] text-rd-ink-500">{t("rd.dash.queue.emptyFilter")}</p>
          ) : (
            <ol className="list-none m-0 p-0">
              {shown.map((item, idx) => {
                const emailAllowed = item.consent === "consented" && !!item.email;
                return (
                  <li
                    key={item.id}
                    className="px-5 py-3.5 border-t border-rd-line first:border-t-0 grid grid-cols-[36px_minmax(0,1fr)] sm:grid-cols-[36px_minmax(0,1fr)_auto] gap-x-3 gap-y-2 items-start"
                  >
                    <span
                      aria-hidden="true"
                      className="w-9 h-9 rounded-full bg-rd-navy-100 text-rd-navy-700 text-xs font-bold flex items-center justify-center"
                    >
                      {initials(item.name) || "·"}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="sr-only">{idx + 1}.</span>
                        <Link
                          to={`/app/leads/${item.id}`}
                          className="text-[14px] font-semibold text-rd-ink-900 hover:underline truncate"
                          aria-label={t("rd.dash.queue.openAria", { name: item.name })}
                        >
                          {item.name}
                        </Link>
                        <span
                          className={cn(
                            "text-[10px] font-bold tracking-[0.06em] rounded-[4px] px-1.5 py-[1px]",
                            item.language === "FR" ? "bg-rd-terra-100 text-rd-terra-800" : "bg-rd-ink-100 text-rd-ink-600"
                          )}
                          title={t(`rd.dash.queue.language.${item.language}`)}
                        >
                          {item.language}
                        </span>
                        {item.score > 0 && (
                          <span className="text-[11px] font-bold tabular-nums rounded-rd-pill px-2 py-[1px] bg-rd-terra-100 text-rd-terra-900">
                            <span className="sr-only">{t("rd.dash.queue.score", { score: item.score })}</span>
                            <span aria-hidden="true">{item.score}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-rd-ink-600 mt-0.5">{reasonText(item)}</p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        <span
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-[0.05em] rounded-[4px] px-1.5 py-[2px]",
                            BUCKET_TONE[item.bucket]
                          )}
                        >
                          {t(`rd.dash.queue.bucket.${item.bucket}`)}
                        </span>
                        {!(item.bucket === "new" && item.stage === "new") && (
                          <span className="text-[10px] font-bold uppercase tracking-[0.05em] rounded-[4px] px-1.5 py-[2px] bg-rd-ink-100 text-rd-ink-700">
                            {t(`rd.dash.stage.${item.stage}`)}
                          </span>
                        )}
                        <span
                          className={cn(
                            "text-[11px] font-semibold",
                            item.consent === "consented" ? "text-rd-success" : "text-rd-danger"
                          )}
                        >
                          {item.consent === "consented" ? "✓ " : "⚠ "}
                          {t(`rd.dash.queue.consent.${item.consent}`)}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1 sm:col-start-3 flex flex-wrap gap-1.5 sm:justify-end">
                      {item.bucket === "awaiting" && (
                        <Link
                          to={`/app/inbox?lead=${encodeURIComponent(item.id)}`}
                          aria-label={t("rd.dash.queue.replyAria", { name: item.name })}
                          className="inline-flex items-center gap-1 rounded-rd-sm bg-rd-navy-800 text-white px-3 py-1.5 text-xs font-semibold hover:bg-rd-navy-700"
                        >
                          {t("rd.dash.queue.reply")}
                        </Link>
                      )}
                      {item.phone && (
                        <a
                          href={`tel:${item.phone.replace(/[^\d+]/g, "")}`}
                          aria-label={t("rd.dash.queue.callAria", { name: item.name })}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-rd-sm px-3 py-1.5 text-xs font-semibold border",
                            item.bucket === "awaiting"
                              ? "border-rd-line bg-white text-rd-ink-900 hover:border-rd-ink-400"
                              : "border-rd-navy-800 bg-rd-navy-800 text-white hover:bg-rd-navy-700"
                          )}
                        >
                          <IconPhone /> {t("rd.dash.queue.call")}
                        </a>
                      )}
                      {emailAllowed ? (
                        <a
                          href={`mailto:${item.email}`}
                          aria-label={t("rd.dash.queue.emailAria", { name: item.name })}
                          className="inline-flex items-center gap-1 rounded-rd-sm px-3 py-1.5 text-xs font-semibold border border-rd-line bg-white text-rd-ink-900 hover:border-rd-ink-400"
                        >
                          <IconMail /> {t("rd.dash.queue.email")}
                        </a>
                      ) : (
                        item.email && (
                          <span
                            role="img"
                            aria-label={t("rd.dash.queue.emailBlocked")}
                            title={t("rd.dash.queue.emailBlocked")}
                            className="inline-flex items-center gap-1 rounded-rd-sm px-3 py-1.5 text-xs font-semibold border border-rd-line text-rd-ink-400 cursor-not-allowed"
                          >
                            <IconMail /> {t("rd.dash.queue.email")}
                          </span>
                        )
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
          {filtered.length > VISIBLE && (
            <div className="px-5 py-3 border-t border-rd-line bg-rd-ink-50">
              <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                aria-expanded={expanded}
                className="text-xs font-semibold text-rd-navy-800 hover:underline"
              >
                {expanded ? t("rd.dash.queue.showLess") : t("rd.dash.queue.showAll", { count: filtered.length })}
              </button>
            </div>
          )}
        </>
      )}
    </RDCard>
  );
}
