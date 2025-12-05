import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import SpotlightCard from "./SpotlightCard";

interface AuraSectionProps {
  children: ReactNode;
  className?: string;
  sectionNumber?: string;
  badge?: string;
  badgeIcon?: ReactNode;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  dark?: boolean;
}

const AuraSection = ({
  children,
  className,
  sectionNumber,
  badge,
  badgeIcon,
  title,
  titleHighlight,
  subtitle,
  dark = false,
}: AuraSectionProps) => {
  return (
    <SpotlightCard className="mx-4 sm:mx-6 max-w-7xl xl:mx-auto mt-4">
      <div
        className={cn(
          "relative overflow-hidden flex flex-col rounded-[40px] py-16 sm:py-20 lg:py-24 px-6 sm:px-12 lg:px-16",
          dark ? "bg-[#0A0A0A]" : "bg-card",
          className
        )}
      >
        {/* Section Number */}
        {sectionNumber && (
          <div className="absolute top-8 right-8 z-20 pointer-events-none opacity-30">
            <span className="font-mono text-sm font-semibold text-white tracking-widest">
              {sectionNumber}
            </span>
          </div>
        )}

        {/* Header */}
        {(badge || title || subtitle) && (
          <div className="relative z-10 text-center max-w-4xl mx-auto mb-16">
            {badge && (
              <div className="aura-badge mb-8">
                {badgeIcon}
                {badge}
              </div>
            )}
            {title && (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl tracking-tighter text-white mb-6 leading-[1.1]">
                {title}
                {titleHighlight && (
                  <span className="text-muted-foreground"> {titleHighlight}</span>
                )}
              </h2>
            )}
            {subtitle && (
              <p className="text-muted-foreground text-lg sm:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </SpotlightCard>
  );
};

export default AuraSection;
