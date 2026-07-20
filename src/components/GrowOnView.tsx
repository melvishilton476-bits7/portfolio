"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Adds `is-grown` the first time this wrapper scrolls into view, then stops
 * observing. Fire-once by design: the puzzle pieces grow as you arrive at a
 * ticket and stay grown, so scrolling back up doesn't replay them.
 *
 * `active` bypasses the observer entirely: pass a boolean when growth is
 * driven by something other than this element's own on-screen position (e.g.
 * scroll progress in a pinned carousel, where several instances share the
 * same viewport rect and IntersectionObserver can't tell them apart).
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

  // `active` is already latched by the caller (flips false→true, never
  // back), so the controlled case needs no state of its own here.
  const isGrown = active !== undefined ? active : grown;

  return (
    <div ref={ref} className={`${className} ${isGrown ? "is-grown" : ""}`}>
      {children}
    </div>
  );
}
