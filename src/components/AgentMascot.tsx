import avatar96 from "@/assets/mascot/agent-avatar-96.webp";
import avatar256 from "@/assets/mascot/agent-avatar-256.webp";
import full360 from "@/assets/mascot/agent-full-360.webp";
import full720 from "@/assets/mascot/agent-full-720.webp";

/**
 * The RealtorDesk assistant mascot: a robot with a roof for a hat, a terracotta
 * bow tie and a house key, in the brand's navy and terracotta.
 *
 * One character wherever the assistant appears -- the public "Ask Agent"
 * launcher, the in-app AI Assistant page and its sidebar entry -- so it reads
 * as the same thing in each place. Rendered with GPT Image 2.5 on Higgsfield
 * onto a transparent background; the untouched render is
 * src/assets/mascot/agent-source.png and every other file there is cut from it.
 *
 * Decorative everywhere: each call site already names the assistant in text or
 * in the control's aria-label, so alt is empty and the image is hidden from
 * assistive tech rather than announced twice.
 */

interface AvatarProps {
  /** Tailwind size classes, e.g. "h-8 w-8". */
  className?: string;
  /** "lg" serves the 256px cut for anything displayed above ~40px. */
  size?: "sm" | "lg";
}

/** Head cut, for avatars, launchers and nav icons. */
export function AgentAvatar({ className = "", size = "sm" }: AvatarProps) {
  const px = size === "lg" ? 256 : 96;
  return (
    <img
      src={size === "lg" ? avatar256 : avatar96}
      width={px}
      height={px}
      alt=""
      aria-hidden="true"
      decoding="async"
      draggable={false}
      className={`shrink-0 select-none object-contain ${className}`}
    />
  );
}

/**
 * The mascot in an icon slot. The sidebar renders every entry as
 * <item.icon className="w-4 h-4" />; this gives the assistant its face there,
 * a touch larger than the line icons so it still reads at nav size.
 */
export function AgentNavIcon({ className = "" }: { className?: string }) {
  return <AgentAvatar className={`${className} scale-[1.4]`} />;
}

/** Full figure, for empty states. */
export function AgentFigure({ className = "" }: { className?: string }) {
  return (
    <img
      src={full360}
      srcSet={`${full360} 1x, ${full720} 2x`}
      width={244}
      height={360}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      draggable={false}
      className={`select-none object-contain ${className}`}
    />
  );
}
