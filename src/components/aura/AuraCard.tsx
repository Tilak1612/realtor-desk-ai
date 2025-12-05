import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuraCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

const AuraCard = ({ children, className, hover = true }: AuraCardProps) => {
  return (
    <div
      className={cn(
        "p-8 rounded-[32px] bg-secondary border border-white/5",
        "transition-all duration-500 flex flex-col",
        "shadow-2xl relative overflow-hidden",
        hover && "hover:border-white/10 hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
};

export default AuraCard;
