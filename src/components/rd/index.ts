// Barrel export for the Phase 1 redesign component library.
// Import from `@/components/rd` to pick up any primitive or layout.

export * from "./icons";
export { RDMark, RDWordmark } from "./Logo";
export { RDButton } from "./Button";
export type { RDButtonProps } from "./Button";
export { RDCard } from "./Card";
export type { RDCardProps } from "./Card";
export { RDBadge } from "./Badge";
export type { RDBadgeProps } from "./Badge";
export { RDAvatar } from "./Avatar";
export { RDScore, scoreBand } from "./Score";
export { RDInput } from "./Input";
export type { RDInputProps } from "./Input";
export { RDSelect } from "./Select";
export type { RDSelectOption, RDSelectProps } from "./Select";
export { RDTabs } from "./Tabs";
export type { RDTabItem } from "./Tabs";
export {
  RDTable,
  RDTableHead,
  RDTableRow,
  RDTableHeaderCell,
  RDTableCell,
  LEADS_GRID_TEMPLATE,
  gridRow,
} from "./Table";
export { RDStatCard } from "./StatCard";
export { RDSectionHeader } from "./SectionHeader";
export { RDConversationBubble } from "./ConversationBubble";
export { RDPipelineCard } from "./PipelineCard";
export { RDFilterBar } from "./FilterBar";
export type { RDFilterDefinition } from "./FilterBar";

// Layout
export { MarketingHeader } from "./layout/MarketingHeader";
export { Sidebar } from "./layout/Sidebar";
export type { SidebarItem } from "./layout/Sidebar";
export { TopNav } from "./layout/TopNav";
export { AppShell } from "./layout/AppShell";
