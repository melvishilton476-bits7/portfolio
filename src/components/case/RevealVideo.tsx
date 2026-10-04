"use client";

import { useEffect, useRef } from "react";

/**
 * A full-bleed video that the section above it slides off.
 *
 * The video is `position: sticky; bottom: 0` directly after an opaque section
 * that sits above it (z-index), both inside one shared wrapper. While the
 * video's own place is still below the fold, sticky holds it pinned to the
 * bottom of the screen, underneath that section. As the section scrolls up,
 * its lower edge uncovers the video, which stays perfectly still. Once the
 * video has reached its own place it simply scrolls on with the page, and
 * nothing covers it again.
 *
 * Sticky rather than fixed: no clip-path trick, and no iOS jumping, so it works
 * the same on a phone.
 *
 * The caller owns the layout: the wrapper must be the video's parent, and the
 * section above must be `relative z-10` with an opaque background.
 *
 * While it is being uncovered the video settles from a slight zoom to rest
 * (1.06 → 1), so it reads as revealed rather than merely passed. That is the
 * only script, one transform per frame, skipped under reduced motion.
 *
 * Height is 16:9 of the screen width, capped at the screen height, so the whole
 * frame is always in view while it is pinned (a short, wide window crops the
 * sides a little instead).
 */
export default function RevealVideo({ src, label }: { src: string; label: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  // Only play while it is on screen.
  useEffect(() => {
    const w = wrap.current;
    const v = video.current;
    if (!w || !v) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(w);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const w = wrap.current;
    const s = stage.current;
    const cover = w?.previousElementSibling;
    if (!w || !s || !cover) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const paint = () => {
      frame = 0;
      const vh = window.innerHeight;
      // How much of the video the covering section has slid off: 0 while its
      // lower edge is still at the foot of the screen, 1 once it has cleared
      // the video's full height.
      const edge = cover.getBoundingClientRect().bottom;
      const p = Math.min(1, Math.max(0, (vh - edge) / w.offsetHeight));
      s.style.transform = `scale(${(1.06 - 0.06 * p).toFixed(4)})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={wrap}
      className="sticky bottom-0 z-0 w-screen overflow-hidden"
      style={{ marginLeft: "calc(50% - 50vw)", height: "min(56.25vw, 100svh)" }}
    >
      <div ref={stage} className="absolute inset-0 will-change-transform">
        {/* A browser extension in the author's Chrome stamps a class on
            every <video> before React hydrates. Only this element's own
            attributes are exempted from the mismatch check. */}
        <video
          suppressHydrationWarning
          ref={video}
          src={src}
          aria-label={label}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          className="absolute inset-0 h-full w-full max-w-none object-cover"
        />
      </div>
    </div>
  );
}
