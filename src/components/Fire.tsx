"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { LottieRefCurrentProps } from "lottie-react";
import fireData from "@/animations/fire.json";

/* Loaded on demand, and only once the fire is about to be seen. The player and
   its animation data are ~60KB of JavaScript for one decorative campfire near
   the foot of the page; every visitor used to download it during the first
   load, including the ones who never scrolled that far. `ssr: false` because
   lottie-web touches the DOM on construction. */
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

/**
 * The looping campfire beside the Contact "come have a seat" chair — a Lottie
 * animation hand-authored in After Effects (exported via Bodymovin, its one
 * raster layer embedded into the JSON so the file is self-contained).
 *
 * Client-only, and loaded lazily: lottie-react renders in the browser, so this
 * file is `"use client"` and the player itself arrives in its own chunk. It plays on a continuous loop, but honours `prefers-reduced-motion`
 * — when the user asks for reduced motion we stop on the first frame so the
 * fire shows as a still ember instead of flickering.
 *
 * Presentational, decorative (`aria-hidden`): the caller owns sizing and
 * placement through `className` / `style`, matching the Chair / Asterisk
 * contract.
 */
export default function Fire({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [near, setNear] = useState(false);

  // Fetch the player a screen ahead of the fire coming into view, so it is
  // ready by the time it matters without ever competing with the first paint.
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setNear(true);
        io.disconnect();
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduceMotion(mq.matches);
      if (mq.matches) lottieRef.current?.goToAndStop(0, true);
      else lottieRef.current?.play();
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // The host div holds the fire's slot either way, so nothing shifts when the
  // player arrives.
  return (
    <div ref={hostRef} aria-hidden className={className} style={style}>
      {near && (
        <Lottie
          lottieRef={lottieRef}
          animationData={fireData}
          loop
          autoplay={!reduceMotion}
        />
      )}
    </div>
  );
}
