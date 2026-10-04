"use client";

import { useLayoutEffect, useRef } from "react";

/** The grid's cell, in px. Must match `--grid` on `.graph-paper`. */
const CELL = 90;
/** The least paper above and below the content, in px. */
const MIN_PAD = 56;

/**
 * A full-bleed band of graph paper whose height is always a whole number of
 * cells.
 *
 * Left to its content, the band ended wherever the copy did, partway through a
 * cell, so the last row of plus marks sat hard against the bottom edge while
 * the top had a clean half cell. Here the height is rounded UP to whole cells
 * and the content is centred in it. The grid's rows sit on the band's edges
 * (see `.graph-paper`), so it opens and closes on a row of plus marks.
 *
 * Without JS the band keeps its padding and simply isn't snapped.
 */
export default function GraphPaper({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  const band = useRef<HTMLElement>(null);
  const body = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = band.current;
    const inner = body.current;
    if (!el || !inner) return;
    const snap = () => {
      const need = inner.offsetHeight + MIN_PAD * 2;
      el.style.height = `${Math.ceil(need / CELL) * CELL}px`;
    };
    snap();
    const ro = new ResizeObserver(snap);
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  return (
    <section
      ref={band}
      aria-label={label}
      className={`graph-paper relative flex w-screen flex-col justify-center ${className}`}
      style={{ marginLeft: "calc(50% - 50vw)", paddingBlock: MIN_PAD }}
    >
      <div ref={body}>{children}</div>
    </section>
  );
}
