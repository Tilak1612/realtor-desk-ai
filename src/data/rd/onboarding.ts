import type { OnboardingState } from "@/types/rd";

// Default in-memory onboarding state used while /onboarding is unwired.
// When backend lands, swap the provider for a Supabase-backed hook that
// reads/writes to the user_onboarding table (already provisioned).

export const DEFAULT_ONBOARDING_STATE: OnboardingState = {
  currentStep: "welcome",
  completed: {},
};

// Sample completed state used in Storybook-style previews inside Phase 4.
export const SAMPLE_COMPLETE_ONBOARDING: OnboardingState = {
  currentStep: "go_live",
  completed: {
    welcome: "2026-04-21T08:00:00Z",
    profile: "2026-04-21T08:04:00Z",
    connect_ddf: "2026-04-21T08:12:00Z",
    ai_voice: "2026-04-21T08:18:00Z",
  },
  profile: {
    fullName: "Sarah Khoury",
    brokerage: "Royal LePage Signature",
    province: "ON",
    licenseNumber: "RECO-449128",
    preferredLanguage: "EN",
  },
  ddfConnection: {
    boardName: "TREB",
    connectedAt: "2026-04-21T08:12:00Z",
    listingCount: 214,
  },
  aiPersona: "professional",
};
