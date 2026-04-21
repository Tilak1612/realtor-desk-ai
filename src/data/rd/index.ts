// Barrel for redesign mock data fixtures.
// Import from `@/data/rd` while Phase 2/3/4 screens are being built.
// Replace these modules with real hooks once backend wiring lands.

export { MOCK_LEADS, findLead } from "./leads";
export { MOCK_CONVERSATIONS, findConversation } from "./conversations";
export { PIPELINE_STAGES, pipelineSnapshot, leadsByStage } from "./pipeline";
export { MOCK_ACTIVITY } from "./activity";
export { MOCK_AUTOMATIONS } from "./automation";
export { MOCK_DASHBOARD_METRICS, MOCK_SOURCE_ROI } from "./reports";
export { DEFAULT_ONBOARDING_STATE, SAMPLE_COMPLETE_ONBOARDING } from "./onboarding";
