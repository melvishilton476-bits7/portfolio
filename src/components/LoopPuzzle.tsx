"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import PuzzlePiece from "./PuzzlePiece";
import type { PieceSide } from "@/lib/puzzle-piece";

/**
 * A standalone lime puzzle piece that loops forever: it grows cell-by-cell,
 * holds, retracts cell-by-cell, holds, repeat. It reuses the ticket pieces'
 * exact grow/retract machinery — toggling `is-grown` drives the same
 * `.pixel-cell` transition (forward stagger on the way in, rewind on the way
 * out); only the DRIVER differs, a timer here instead of scroll/carousel.
 *
 * The caller positions it via `className`/`style` (the wrapper is the offset
 * parent for the free-standing sprite). Under reduced motion it simply sits
 * fully grown and still — the loop never starts and the CSS zeroes the cell
 * motion. Decorative (aria-hidden).
 */
export default function LoopPuzzle({
  side = "right",
  className = "",
  style,
  // Time spent in each state before flipping — long enough for the ~1s
  // grow/retract to finish and then hold, so the pulse reads calm, not busy.
  growMs = 2200,
  shrinkMs = 2200,
}: {
  side?: PieceSide;
  className?: string;
  style?: CSSProperties;
  growMs?: number;
  shrinkMs?: number;
}) {
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGrown(true);
      return;
    }
    let t: ReturnType<typeof setTimeout>;
    const flip = (next: boolean) => {
      setGrown(next);
      t = setTimeout(() => flip(!next), next ? growMs : shrinkMs);
    };
    // A short beat before the first grow so it animates in rather than
    // appearing already-grown on mount.
    t = setTimeout(() => flip(true), 400);
    return () => clearTimeout(t);
  }, [growMs, shrinkMs]);

  return (
    <div aria-hidden className={`${className} ${grown ? "is-grown" : ""}`} style={style}>
      <PuzzlePiece side={side} float={false} />
    </div>
  );
}
