import type { Lead } from "@/types/rd";
import { cn } from "@/lib/utils";
import { RDAvatar } from "./Avatar";
import { RDScore, scoreBand } from "./Score";
import { RDBadge } from "./Badge";
import { IconSparkles, IconMail, IconPhone } from "./icons";

// A single kanban card on /app/pipeline. Renders lead name + city +
// lead score + budget + AI-handling flag + next-best action. Surface is
// white with a 1px slate border and the small shadow; the left border
// tinting follows the score band so the column communicates temperature
// at a glance.

interface RDPipelineCardProps {
  lead: Lead;
  className?: string;
  onClick?: () => void;
}

const LEFT_BORDER_CLASS: Record<string, string> = {
  hot: "border-l-rd-terra-600",
  warm: "border-l-rd-score-warm",
  cool: "border-l-rd-navy-500",
  cold: "border-l-rd-ink-400",
};

export function RDPipelineCard({ lead, className, onClick }: RDPipelineCardProps) {
  const band = scoreBand(lead.score);
  const budget = lead.budgetCad
    ? new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
        maximumFractionDigits: 0,
      }).format(lead.budgetCad)
    : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left bg-white border border-rd-line rounded-rd-md shadow-rd-sm px-3.5 py-3 flex flex-col gap-2.5",
        "border-l-[3px]",
        LEFT_BORDER_CLASS[band],
        "hover:shadow-rd-md transition-shadow",
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        <RDAvatar name={lead.name} size={28} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-semibold text-rd-ink-900 truncate">{lead.name}</span>
            <span
              className={cn(
                "text-[9px] font-bold tracking-[0.06em] rounded-[3px] px-1 py-[1px]",
                lead.language === "FR"
                  ? "bg-rd-terra-100 text-rd-terra-800"
                  : "bg-rd-navy-100 text-rd-navy-800"
              )}
            >
              {lead.language}
            </span>
          </div>
          <div className="text-[11px] text-rd-ink-500 truncate">{lead.listing}</div>
        </div>
        {lead.aiHandling && (
          <RDBadge tone="terra" size="sm">
            <IconSparkles width={9} height={9} />
            AI
          </RDBadge>
        )}
      </div>

      <div className="flex items-center justify-between">
        <RDScore value={lead.score} barWidth={44} />
        {budget && (
          <span className="text-[12px] font-semibold text-rd-ink-900 tabular-nums">{budget}</span>
        )}
      </div>

      {lead.aiNextBest && (
        <div className="text-[12px] text-rd-ink-600 leading-[1.45] border-t border-rd-line pt-2">
          <span className="font-semibold text-rd-ink-700">Next: </span>
          {lead.aiNextBest}
        </div>
      )}

      <div className="flex items-center gap-1.5 pt-1">
        <span className="text-[10px] text-rd-ink-500 flex items-center gap-1">
          <IconMail className="w-3 h-3" />
          {lead.email.split("@")[0]}
        </span>
        <span className="text-[10px] text-rd-ink-500 flex items-center gap-1">
          <IconPhone className="w-3 h-3" />
          {lead.phone}
        </span>
      </div>
    </button>
  );
}
