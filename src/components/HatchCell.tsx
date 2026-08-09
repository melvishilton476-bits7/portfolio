"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

/**
 * The blueprint "blue box" — a periwinkle diagonal-hatch intersection cell with
 * a black registration dot on each corner. Shared by the SIDE STREETS footer
 * bands and the Contact heading bookends.
 *
 * Draw-in animation (fires once when the cell scrolls into view, via a fire-
 * once IntersectionObserver in the spirit of GrowOnView):
 *   1. the two LEFT dots scale-pop in;
 *   2. two more dots emerge from them and travel right along the top/bottom
 *      edges while the box (white border + periwinkle fill) wipes open L→R
 *      behind them — the dots look like they pull the box into being;
 *   3. the internal 45° hatch lines wipe in top-left → bottom-right.
 * The whole timeline lives in globals.css (§ HATCH CELL DRAW-IN); a per-cell
 * `--draw-delay` lets a band stagger its cells left-to-right. Under
 * prefers-reduced-motion the cell jumps straight to the finished box.
 *
 * Layout is the caller's job: pass `className` (e.g. `absolute hidden lg:block`
 * or `relative h-[58px] w-[46px]`) and, when absolutely positioned, `style`.
 */

const HATCH = `repeating-linear-gradient(45deg, #a1a1a1 0, #a1a1a1 0.75px, transparent 0.75px, transparent 6px)`;
const CELL_FILL = "rgba(133, 129, 255, 0.09)";

export default function HatchCell({
  className = "",
  style,
  delay = 0,
}: {
  className?: string;
  style?: CSSProperties;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || drawn) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setDrawn(true);
        io.disconnect();
      },
      // Hold off until the cell is well inside the viewport, not just peeking
      // over the bottom edge: a negative bottom margin pulls the trigger line
      // up ~18% of the viewport height.
      { threshold: 0.35, rootMargin: "0px 0px -18% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [drawn]);

  const dot = (variant: string, corner: string) => (
    <span
      aria-hidden
      className={`hatch-dot ${variant} absolute size-[5px] rounded-full bg-[#171717] ${corner}`}
    />
  );

  return (
    <span
      ref={ref}
      aria-hidden
      className={`hatch-cell pointer-events-none ${className} ${drawn ? "is-drawn" : ""}`}
      style={{ ...style, ["--draw-delay" as string]: `${delay}ms` } as CSSProperties}
    >
      {/* Box: white border + periwinkle fill — wipes open left→right. */}
      <span
        className="hatch-box absolute inset-0"
        style={{ border: "1px solid #ffffff", backgroundColor: CELL_FILL }}
      />
      {/* Hatch lines: a separate layer over the fill — wipes in diagonally. */}
      <span className="hatch-lines absolute inset-0" style={{ backgroundImage: HATCH }} />
      {/* Left pair pops in place; the "tr"/"br" pair starts on the left and
          travels to the right corners (see globals.css). */}
      {dot("hatch-dot--tl", "-left-[2.5px] -top-[2.5px]")}
      {dot("hatch-dot--bl", "-left-[2.5px] -bottom-[2.5px]")}
      {dot("hatch-dot--tr", "-left-[2.5px] -top-[2.5px]")}
      {dot("hatch-dot--br", "-left-[2.5px] -bottom-[2.5px]")}
    </span>
  );
}
