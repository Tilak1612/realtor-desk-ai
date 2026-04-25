// Community link helper. Centralises the env-var read so every surface
// (dashboard banner, top-nav menu item, marketing footer column, launch
// blog post CTA) sources from one place. Surfaces gate their own
// visibility on `isCommunityEnabled()` — when the env var is empty, no
// community link renders anywhere, so we can't ship a broken
// "Join community" button into prod ahead of the Discord server going
// live.

const RAW_URL: string | undefined = import.meta.env.VITE_COMMUNITY_URL;

export const COMMUNITY_URL: string = (RAW_URL ?? "").trim();

export function isCommunityEnabled(): boolean {
  return COMMUNITY_URL.length > 0;
}
