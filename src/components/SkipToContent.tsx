// Skip-to-content link — WCAG 2.4.1 (Bypass Blocks, Level A).
//
// Keyboard-only users hitting Tab on any page first encounter this
// hidden link; focusing it reveals it visually so the user can skip
// over the navigation chrome. Jumps to #main-content, which is
// rendered as a sibling of the Routes output in App.tsx.
//
// The sr-only + focus:not-sr-only pattern keeps the link invisible
// to sighted users while remaining discoverable to screen readers
// and keyboard users. No JS needed.

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-rd-navy-800 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-rd-terra-400 focus:ring-offset-2 focus:text-sm focus:font-semibold"
    >
      Skip to content
    </a>
  );
}
