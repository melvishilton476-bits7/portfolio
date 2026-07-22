"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Uncontrolled (no `active`): adds `is-grown` the first time this wrapper
 * scrolls into view, then stops observing — fire-once, so the puzzle pieces
 * grow on arrival and stay. This is the small-screen / reduced-motion path.
 *
 * Controlled (`active` is a boolean): `is-grown` simply mirrors `active`, so
 * the caller can drive growth from something other than this element's own
 * on-screen position — e.g. the pinned carousel, where several instances
 * share the same viewport rect and IntersectionObserver can't tell them
 * apart. Unlike the uncontrolled path this can flip back: the carousel passes
 * `current`, so a ticket grows at centre and RETRACTS when it leaves the
 * stage (the CSS transition runs both ways), re-growing if you scroll back.
 */
export default function GrowOnView({
  className = "",
  children,
  active,
}: {
  className?: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    if (active !== undefined) return;

    const el = ref.current;
    if (!el || grown) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setGrown(true);
        io.disconnect();
      },
      { threshold: 0.35 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [grown, active]);

  // Controlled: mirror `active` directly (it may flip either way). Uncontrolled:
  // use the once-latched observer state.
  const isGrown = active !== undefined ? active : grown;

  return (
    <div ref={ref} className={`${className} ${isGrown ? "is-grown" : ""}`}>
      {children}
    </div>
  );
}
