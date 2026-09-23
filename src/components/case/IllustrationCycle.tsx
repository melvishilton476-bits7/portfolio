"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * The workshop's illustration set, shown four at a time.
 *
 * Fifteen drawings laid out as a fifteen-up contact sheet would render each one
 * too small to read, and the point of the set is that every scene is drawn in
 * the same hand. So four panes hold the frame and cycle through the set
 * instead: the reader sees a handful at full size, and stays long enough on
 * each to take it in.
 *
 * The panes advance on a stagger rather than together — four pictures changing
 * at once reads as a slideshow jumping, where one at a time reads as a set
 * being leafed through. Each pane walks the list by a stride of four, so no two
 * panes ever hold the same drawing and every drawing gets its turn.
 */

const COUNT = 15;
const PANES = 4;
/** How long one pane holds a drawing. */
const HOLD_MS = 3600;
/** The gap between one pane turning and the next. HOLD_MS / PANES, so the
 *  turns space themselves evenly however long the hold is. */
const STAGGER_MS = HOLD_MS / PANES;

const src = (n: number) =>
  `/case/draw-the-line/illustration/art-${String((n % COUNT) + 1).padStart(2, "0")}.webp`;

function Pane({ index, reduced }: { index: number; reduced: boolean }) {
  // Each pane starts on its own drawing and steps forward by PANES, so the
  // four of them sweep the set without ever colliding.
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduced) return;
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      setStep((s) => s + 1);
      interval = setInterval(() => setStep((s) => s + 1), HOLD_MS);
    }, index * STAGGER_MS);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [index, reduced]);

  const n = (index + step * PANES) % COUNT;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
      {/* Both the outgoing and incoming drawing are in the DOM during the
          fade; keying on `n` gives each its own element to cross into. */}
      <Image
        key={n}
        src={src(n)}
        alt=""
        fill
        sizes="(max-width: 640px) 50vw, 380px"
        className="dtl-art object-contain"
      />
    </div>
  );
}

export default function IllustrationCycle() {
  // Read once on mount rather than via CSS, because the whole behaviour here
  // is the timer, not a transition that a media query could switch off.
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(q.matches);
    const on = () => setReduced(q.matches);
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, []);

  return (
    // aria-hidden: the drawings are a specimen of one visual system, and
    // fifteen alt texts read out as they rotate would be noise. The caption
    // under the figure says what the set is.
    <div aria-hidden className="grid grid-cols-2 gap-4 sm:gap-6">
      {Array.from({ length: PANES }, (_, i) => (
        <Pane key={i} index={i} reduced={reduced} />
      ))}
    </div>
  );
}
