import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { RDAvatar, IconArrow, IconCheck, IconSparkles } from "@/components/rd";
import { scoreBand } from "@/components/rd/Score";
import { CtaLink } from "@/components/rd/marketing/CtaLink";
import { trackEvent } from "@/utils/analytics";
import {
  answersToInput,
  scoreLead,
  type Engagement,
  type ListingsViewed,
  type ScorerAnswers,
  type Timeline,
} from "@/lib/rd/leadScoreRules";

// The hero's product visual, and the one thing on the page a visitor can
// operate. It replaced a static six-row leads table: the table showed scores,
// this shows where a score comes from. Change an answer and the lead is
// rescored with the same rule set calculate-lead-score runs in the app
// (src/lib/rd/leadScoreRules.ts), and the suggested next step changes with it.
//
// The lead is illustrative and francophone on purpose, for the same reason
// the old table mixed names: the bilingual claim, shown rather than asserted.
// Her name is a proper noun and is not keyed.

const TIMELINES: Timeline[] = ["0-30_days", "1-3_months", "3-6_months", "6+_months", "not_specified"];
const ENGAGEMENT: Engagement[] = ["none", "opens", "replies"];
const LISTINGS: ListingsViewed[] = [0, 1, 3, 5];

const BAND_BG: Record<string, string> = {
  hot: "var(--rd-score-hot)",
  warm: "var(--rd-score-warm)",
  cool: "var(--rd-score-cool)",
  cold: "var(--rd-score-cold)",
};

/** Count from the previous score to the new one; jump when motion is reduced. */
function useCountUp(target: number) {
  const [shown, setShown] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof requestAnimationFrame === "undefined") {
      setShown(target);
      from.current = target;
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min((now - start) / 450, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(a + (target - a) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
      else from.current = target;
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      from.current = target;
    };
  }, [target]);
  return shown;
}

function Segmented<T extends string | number>({
  legend,
  name,
  options,
  value,
  onChange,
  label,
}: {
  legend: string;
  name: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  label: (v: T) => string;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-[11px] font-semibold text-rd-ink-600 mb-1.5">{legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const id = `${name}-${o}`;
          const checked = o === value;
          return (
            <label
              key={String(o)}
              htmlFor={id}
              className={[
                "cursor-pointer select-none rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors",
                "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-rd-navy-600",
                checked
                  ? "bg-rd-navy-800 border-rd-navy-800 text-white"
                  : "bg-white border-rd-line text-rd-ink-700 hover:border-rd-navy-400",
              ].join(" ")}
            >
              <input
                id={id}
                type="radio"
                name={name}
                className="sr-only"
                checked={checked}
                onChange={() => onChange(o)}
              />
              {label(o)}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function HeroScorer() {
  const { t } = useTranslation();
  const uid = useId();
  const [a, setA] = useState<ScorerAnswers>({
    timeline: "1-3_months",
    preApproved: true,
    engagement: "opens",
    listings: 3,
  });
  const result = useMemo(() => scoreLead(answersToInput(a)), [a]);
  const band = scoreBand(result.total);
  const shown = useCountUp(result.total);

  // One event per visit, on the first change: the question is whether people
  // use it, not how many times they click.
  const reported = useRef(false);
  const set = <K extends keyof ScorerAnswers>(key: K, v: ScorerAnswers[K]) => {
    setA((prev) => ({ ...prev, [key]: v }));
    if (!reported.current) {
      reported.current = true;
      trackEvent("hero_scorer_interact", { field: key });
    }
  };

  const k = (s: string) => t(`landing.heroScorer.${s}`);

  return (
    <div className="relative w-full max-w-[540px] mx-auto">
      <div className="rd-depth-surface rounded-rd-xl overflow-hidden p-2.5 md:p-3">
        <div className="flex items-center gap-2 px-1.5 pb-2.5">
          <div className="w-5 h-5 bg-rd-terra-600 rounded-[5px] flex items-center justify-center">
            <IconSparkles />
          </div>
          <span className="text-white font-semibold text-[12px] whitespace-nowrap">{k("appLabel")}</span>
          {/* The breadcrumb is decoration; on a phone the "try it" cue matters more. */}
          <span className="hidden sm:inline text-white/45 text-[12px]">/</span>
          <span className="hidden sm:inline text-white/75 text-[12px]">{k("screen")}</span>
          <span className="hidden sm:inline text-white/45 text-[12px]">/</span>
          <span className="hidden sm:inline text-white/75 text-[12px] truncate">Émilie Tremblay</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-semibold text-rd-terra-300 whitespace-nowrap">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-rd-terra-400 opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rd-terra-500" />
            </span>
            {k("interactive")}
          </span>
        </div>

        <div className="bg-white rounded-rd-md p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <RDAvatar name="Émilie Tremblay" size={36} tone="var(--rd-navy-700)" />
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-semibold text-rd-ink-900 truncate">Émilie Tremblay</div>
              <div className="text-[12px] text-rd-ink-500 truncate">{k("leadMeta")}</div>
            </div>
            <div className="shrink-0 text-right" aria-live="polite" aria-atomic="true">
              <div className="sr-only sm:not-sr-only text-[10px] font-semibold uppercase tracking-[0.06em] text-rd-ink-600">
                {k("scoreLabel")}
              </div>
              <div className="flex items-baseline justify-end gap-2">
                {/* Dark text beside a colour dot: white on the warm amber
                    measures about 2:1, under the AA floor. */}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rd-ink-50 px-2 py-0.5 text-[11px] font-semibold text-rd-ink-900">
                  <span className="h-2 w-2 rounded-full" style={{ background: BAND_BG[band] }} />
                  {k(`band.${band}`)}
                </span>
                {/* The live region reads the settled score, not every frame. */}
                <span className="sr-only">{result.total}</span>
                <span
                  aria-hidden="true"
                  className="text-[30px] sm:text-[34px] leading-none font-semibold tracking-[-0.03em] text-rd-ink-900 tabular-nums"
                >
                  {shown}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 h-1.5 rounded-full bg-rd-ink-100 overflow-hidden" aria-hidden="true">
            <div
              className="h-full rounded-full transition-[width,background-color] duration-500 ease-out motion-reduce:transition-none"
              style={{ width: `${result.total}%`, background: BAND_BG[band] }}
            />
          </div>

          <div className="mt-4 grid gap-3.5">
            <Segmented
              legend={k("qTimeline")}
              name={`${uid}-tl`}
              options={TIMELINES}
              value={a.timeline}
              onChange={(v) => set("timeline", v)}
              label={(v) => k(`tl.${v}`)}
            />
            <Segmented
              legend={k("qEmails")}
              name={`${uid}-em`}
              options={ENGAGEMENT}
              value={a.engagement}
              onChange={(v) => set("engagement", v)}
              label={(v) => k(`em.${v}`)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Segmented
                legend={k("qListings")}
                name={`${uid}-li`}
                options={LISTINGS}
                value={a.listings}
                onChange={(v) => set("listings", v)}
                label={(v) => (v === 5 ? "5+" : String(v))}
              />
              <Segmented
                legend={k("qPreapproved")}
                name={`${uid}-pa`}
                options={["yes", "no"] as const}
                value={a.preApproved ? "yes" : "no"}
                onChange={(v) => set("preApproved", v === "yes")}
                label={(v) => k(v)}
              />
            </div>
          </div>

          <div className="mt-4 rounded-rd-md bg-rd-ink-50 px-3.5 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-rd-ink-600 mb-1.5">
              {k("nextStep")}
            </div>
            <ul className="grid gap-1">
              {result.actions.slice(0, 2).map((key) => (
                <li key={key} className="flex items-start gap-2 text-[13px] text-rd-ink-900">
                  <IconCheck className="text-rd-success mt-[3px] shrink-0" />
                  {k(`actions.${key}`)}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
            <p className="text-[11px] leading-[1.45] text-rd-ink-600 sm:max-w-[250px]">{k("footnote")}</p>
            <CtaLink
              to="/signup"
              location="hero_scorer"
              variant="primary"
              size="sm"
              trailingIcon={<IconArrow />}
            >
              {k("cta")}
            </CtaLink>
          </div>
        </div>
      </div>
    </div>
  );
}
