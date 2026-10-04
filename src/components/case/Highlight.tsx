"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A highlighter stroke, dragged across the words the first time they scroll in.
 *
 * The Zenxo page spends its yellow only on conclusions — the thesis line, the
 * finding the interviews turned up, the direction that shipped, the card that
 * won — so the marker means "this is where it landed" wherever it appears. Drawn rather than simply present
 * because a highlight is an act: someone went back over the line and marked it.
 *
 * `box-decoration-break: clone` so a highlight that wraps gets its own padded
 * stroke on every line instead of one ragged box across the break.
 */
export default function Highlight({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || on) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setOn(true);
        io.disconnect();
      },
      { threshold: 1, rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [on]);

  return (
    <span ref={ref} className={`zx-hl ${on ? "is-on" : ""} ${className}`}>
      {children}
    </span>
  );
}
