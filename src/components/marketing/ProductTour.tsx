import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { DeviceFrame } from "./DeviceFrame";
import { CtaLink } from "@/components/rd/marketing/CtaLink";
// Direct path, not the "@/components/rd" barrel: the barrel re-exports
// AppShell -> useWorkspaceIdentity -> the Supabase client, which throws at
// import time without env vars and takes this component down with it.
import { IconArrow } from "@/components/rd/icons";
import { trackEvent } from "@/utils/analytics";
import tour1280Webm from "@/assets/video/product-tour-1280.webm";
import tour1280Mp4 from "@/assets/video/product-tour-1280.mp4";
import tour852Webm from "@/assets/video/product-tour-852.webm";
import tour852Mp4 from "@/assets/video/product-tour-852.mp4";
import poster1280 from "@/assets/video/product-tour-poster-1280.webp";
import poster852 from "@/assets/video/product-tour-poster-852.webp";

/**
 * A 14.6-second screen recording of the real dashboard, in a laptop frame.
 *
 * WHERE IT CAME FROM. A Screen Studio capture of the live app signed in as the
 * documented demo tenant (demo.brokerage@realtordesk.ai -> "Daniel Okafor,
 * Northline Brokerage", PRODUCTION_RUNBOOK.md). Every lead in it is seed data
 * on @example.com. It was reviewed frame by frame before being committed, and
 * cut from 53s to 10.0-24.6s: the original opened on the sign-in screen with
 * the demo account's email typed in, and later wandered into the legacy
 * dashboard shell, a blank loading frame and several empty states.
 *
 * This is a CONTENT video, not decoration: it shows what the product does. So
 * unlike an ambient loop it is NOT aria-hidden. It has an accessible name, a
 * caption saying it is a demo workspace, and a visible pause control
 * (WCAG 2.2.2 -- anything that moves for more than five seconds needs one).
 *
 * WHEN IT PLAYS
 *   - Desktop (>=1024px), motion allowed: plays muted while at least half of
 *     it is on screen, pauses when scrolled away. preload="none", so nothing
 *     is fetched until it first scrolls into view.
 *   - Below 1024px, or prefers-reduced-motion: never starts by itself. The
 *     visitor taps to play. A phone spends zero bytes on it until then.
 *   - Once someone pauses it, scrolling back does not restart it. Autoplay
 *     overriding an explicit pause would make the control a lie.
 *
 * Play is driven from JS rather than the `autoplay` attribute, because the
 * attribute cannot see prefers-reduced-motion or the breakpoint.
 */

const VIDEO_ID = "product-tour-video";

function matches(query: string): boolean {
  return typeof window !== "undefined" && !!window.matchMedia?.(query).matches;
}

export function ProductTour() {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const userPaused = useRef(false);
  const tracked = useRef(false);
  const [playing, setPlaying] = useState(false);
  // Poster cannot be negotiated like <picture>, so pick the size up front.
  const [poster] = useState(() => (matches("(max-width: 767px)") ? poster852 : poster1280));

  const play = (trigger: "auto" | "user") => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true; // React does not reliably reflect `muted` to the DOM
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
    if (!tracked.current) {
      tracked.current = true;
      trackEvent("video_play", { video: "product_tour", trigger });
    }
  };

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      play("user");
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const canAutoplay =
      matches("(min-width: 1024px)") && !matches("(prefers-reduced-motion: reduce)");
    // No observer means we cannot tell whether it is on screen, so we never
    // start it. Tap-to-play still works.
    if (!canAutoplay || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!userPaused.current && v.paused) play("auto");
        } else if (!v.paused) {
          v.pause();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(v);
    return () => io.disconnect();
    // play() only reads refs, so subscribing once on mount is correct.
  }, []);

  return (
    <section
      aria-labelledby="product-tour-heading"
      // overflow-hidden: DeviceFrame's laptop base is 112% wide, which at
      // 320px would otherwise push the page a few pixels sideways.
      className="overflow-hidden px-4 sm:px-8 md:px-14 py-16 md:py-24 bg-rd-paper"
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="max-w-[720px] mx-auto text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-rd-terra-800">
            {t("landing.productTour.eyebrow")}
          </p>
          <h2
            id="product-tour-heading"
            className="mt-3 text-[30px] sm:text-[36px] md:text-[44px] leading-[1.08] font-semibold tracking-[-0.03em] text-rd-ink-900 [text-wrap:balance]"
          >
            {t("landing.productTour.heading")}
          </h2>
          <p className="mt-4 text-base md:text-lg text-rd-ink-600 [text-wrap:pretty]">
            {t("landing.productTour.body")}
          </p>
        </div>

        <figure className="mt-10 md:mt-14 max-w-[980px] mx-auto">
          <div className="relative">
            <DeviceFrame variant="laptop">
              <video
                ref={videoRef}
                id={VIDEO_ID}
                className="block w-full h-auto cursor-pointer"
                width={1280}
                height={640}
                poster={poster}
                aria-label={t("landing.productTour.videoLabel")}
                muted
                playsInline
                loop
                preload="none"
                onClick={toggle}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              >
                {/* Smaller encode for phones first; browsers take the first
                    source whose media query and type both match. */}
                <source src={tour852Webm} type="video/webm" media="(max-width: 767px)" />
                <source src={tour852Mp4} type="video/mp4" media="(max-width: 767px)" />
                <source src={tour1280Webm} type="video/webm" />
                <source src={tour1280Mp4} type="video/mp4" />
              </video>
            </DeviceFrame>

            {/* Opaque on purpose. A translucent fill over a moving video has
                a different contrast on every frame, so no one -- person or
                checker -- can say whether the label is legible. */}
            <button
              type="button"
              onClick={toggle}
              aria-controls={VIDEO_ID}
              // Icon-only 44x44 below sm: on a phone the labelled pill covered ~40%
              // of the video and sat on the content it was meant to show. The
              // text stays in the a11y tree (sr-only), so the name never changes.
              className="absolute right-3 bottom-6 sm:right-5 sm:bottom-8 inline-flex items-center justify-center gap-2 h-11 w-11 sm:w-auto sm:px-4 rounded-full bg-rd-ink-900 text-white text-sm font-semibold shadow-rd-md hover:bg-rd-ink-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rd-terra-700"
            >
              <span aria-hidden="true" className="text-[13px] leading-none">
                {playing ? "❚❚" : "▶"}
              </span>
              <span className="sr-only sm:not-sr-only">
                {playing ? t("landing.productTour.pause") : t("landing.productTour.play")}
              </span>
            </button>
          </div>

          <figcaption className="mt-5 text-center text-[13px] text-rd-ink-600">
            {t("landing.productTour.caption")}
          </figcaption>
        </figure>

        <div className="mt-8 flex justify-center">
          <CtaLink
            to="/signup"
            location="product_tour"
            variant="primary"
            size="lg"
            trailingIcon={<IconArrow />}
          >
            {t("landing.productTour.cta")}
          </CtaLink>
        </div>
      </div>
    </section>
  );
}

export default ProductTour;
