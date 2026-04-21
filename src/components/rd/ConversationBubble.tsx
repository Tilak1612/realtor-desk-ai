import { cn } from "@/lib/utils";
import type { ConversationAuthor, Language } from "@/types/rd";
import { RDAvatar } from "./Avatar";
import { RDBadge } from "./Badge";
import { IconSparkles } from "./icons";

// Chat bubble used on /app/inbox and /app/leads/:id. Three visual states:
//   lead  — left-aligned, white surface, slate border
//   agent — right-aligned, navy surface, white text
//   ai    — right-aligned, terracotta tint, small AI badge above
// System notes render inline, centered, in small muted text — no bubble.

interface RDConversationBubbleProps {
  author: ConversationAuthor;
  authorName: string;
  body: string;
  time: string;
  language?: Language;
  /** If true, renders a muted "via SMS" / "via email" caption. */
  channelLabel?: string;
  /** Tags rendered inline for system entries ("Consent captured"). */
  systemNote?: string;
  className?: string;
}

export function RDConversationBubble({
  author,
  authorName,
  body,
  time,
  language,
  channelLabel,
  systemNote,
  className,
}: RDConversationBubbleProps) {
  if (author === "system") {
    return (
      <div className={cn("flex justify-center py-3", className)}>
        <div className="flex items-center gap-2 rounded-rd-pill bg-rd-ink-50 border border-rd-line px-3 py-1 text-[11px] text-rd-ink-500">
          <span className="font-semibold text-rd-ink-700">{authorName}</span>
          <span>·</span>
          <span>{systemNote ?? body}</span>
          <span className="text-rd-ink-400">· {time}</span>
        </div>
      </div>
    );
  }

  const isSelf = author === "agent" || author === "ai";
  return (
    <div
      className={cn("flex gap-3", isSelf ? "justify-end" : "justify-start", className)}
    >
      {!isSelf && <RDAvatar name={authorName} size={32} />}
      <div className={cn("max-w-[66%]", isSelf ? "items-end" : "items-start", "flex flex-col gap-1")}>
        <div className="flex items-center gap-2 text-[11px] text-rd-ink-500">
          {author === "ai" && (
            <RDBadge tone="terra" size="sm">
              <IconSparkles width={10} height={10} />
              Desk AI
            </RDBadge>
          )}
          <span className="font-semibold text-rd-ink-700">{authorName}</span>
          {language && (
            <span
              className={cn(
                "text-[9px] font-bold tracking-[0.08em] rounded-[3px] px-1.5 py-[1px]",
                language === "FR"
                  ? "bg-rd-terra-100 text-rd-terra-800"
                  : "bg-rd-navy-100 text-rd-navy-800"
              )}
            >
              {language}
            </span>
          )}
          <span>{time}</span>
          {channelLabel && <span>· {channelLabel}</span>}
        </div>
        <div
          className={cn(
            "px-4 py-2.5 text-[14px] leading-[1.55] rounded-rd-lg",
            author === "lead" && "bg-white border border-rd-line text-rd-ink-900",
            author === "agent" && "bg-rd-navy-800 text-white",
            author === "ai" && "bg-rd-terra-100 border border-rd-terra-200 text-rd-terra-900"
          )}
        >
          {body}
        </div>
      </div>
      {isSelf && <RDAvatar name={authorName} size={32} />}
    </div>
  );
}
