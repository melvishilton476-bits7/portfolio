"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { LottieRefCurrentProps } from "lottie-react";
import fireData from "@/animations/fire.json";

/* Loaded on demand, not in the first-load bundle. lottie-web and its React
   wrapper are a quarter of a megabyte of JavaScript to play one decorative
   campfire that sits near the bottom of the page — every visitor was paying
   for it before the hero had painted. `ssr: false` because lottie-web touches
   the DOM on construction. */
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
  const [reduceMotion, setReduceMotion] = useState(false);

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

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={fireData}
      loop
      autoplay={!reduceMotion}
      aria-hidden
      className={className}
      style={style}
    />
  );
}
