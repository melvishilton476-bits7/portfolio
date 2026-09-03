"use client";

import { motion, useAnimationControls, type Transition } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type RandomLetterSwapProps = {
  label: string;
  className?: string;
  /** Delay added per letter, in seconds — creates the left-to-right ripple. */
  staggerDuration?: number;
  /** Runs the stagger right-to-left instead. */
  reverse?: boolean;
  /**
   * Only `duration` is read. The roll is always a tween, never a spring: the
   * reel's last frame IS its final position, so a spring's overshoot would
   * travel past it and expose the blank space below the strip. (Measured on
   * the previous spring version — it reached -34.3px against a -33.6px end
   * stop.) A tween lands exactly, so there is nothing to overshoot into.
   */
  transition?: Transition;
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** One stand-in letter per character. Deterministic from the letter's own
 *  code point and position, not `Math.random()` — the decoys render as real
 *  text (behind `aria-hidden`, but still DOM content), so anything
 *  non-deterministic here disagrees between the server render and the
 *  client's hydration pass and blows up hydration. Never equal to the source
 *  letter, so a swap always reads as a swap. */
function useDecoyLetters(label: string) {
  return useMemo(
    () =>
      label.split("").map((char, i) => {
        if (!/[a-z]/i.test(char)) return char;
        const base = char.toUpperCase().charCodeAt(0) - 65;
        const offset = 1 + ((i * 7 + base * 3) % 25);
        const decoy = ALPHABET[(base + offset) % 26];
        return char === char.toUpperCase() ? decoy : decoy.toLowerCase();
      }),
    [label],
  );
}

/** Frames in the reel: [real, decoy, real]. */
const FRAMES = 3;
/** Translate that brings the LAST frame into the window. */
const END_Y = `${-((FRAMES - 1) * 100) / FRAMES}%`;
/** Fraction of the timeline spent returning to rest — see SwapLetter. */
const REWIND = 0.03;

/**
 * One character cell — a 3-frame vertical reel: [real, decoy, real].
 *
 * A hover plays ONE animation, all the way from the first frame to the last.
 * The decoy sits in the middle of that travel, so it is passed through rather
 * than arrived at: there is no state in which the cell is "showing the decoy
 * and waiting". That is the whole trick, and it is why nothing here listens
 * for the cursor leaving — the swing is fire-and-forget, so leaving mid-roll
 * (or never leaving at all) changes nothing.
 *
 * The rewind is the animation's own final keyframe rather than a follow-up
 * call, which is what makes this reliable. Two earlier versions reset the reel
 * *after* awaiting the swing — once via React state, once via imperative
 * set() — and both left letters parked on the last frame under rapid hovering,
 * because the reset kept racing a swing that was still running. Here the
 * animation cannot finish anywhere except at rest: the rewind is inside it.
 *
 * It also self-heals. The keyframes name their own start value ("0%"), so a
 * letter somehow left offset is snapped back into alignment by the very next
 * hover instead of staying wrong.
 */
function SwapLetter({
  real,
  decoy,
  playToken,
  delay,
  duration,
}: {
  real: string;
  decoy: string;
  /** Bumped by the parent on each hover-enter. */
  playToken: number;
  delay: number;
  duration: number;
}) {
  const controls = useAnimationControls();
  const rolling = useRef(false);
  const seenToken = useRef(playToken);

  // Deliberately NO React state in the animation lifecycle. A state-driven
  // version wedged here, reproducibly: when the reset's `setRolling(false)`
  // and a fresh hover's `setRolling(true)` landed in one React batch, the net
  // value was unchanged (true → true), React bailed out of the re-render, the
  // `rolling` effect dep never looked like it changed, and the one-shot reset
  // timer was never re-armed. A ref mutates synchronously and can't be
  // batched, so that whole class of race is gone.
  useEffect(() => {
    if (playToken === seenToken.current) return;
    seenToken.current = playToken;
    if (rolling.current) return; // one swing at a time; ignore re-triggers
    rolling.current = true;

    (async () => {
      // The final keyframe returns to rest, so the swing is self-contained.
      // `REWIND` is the sliver of the timeline spent on that return, eased by
      // a function pinned to 1 — i.e. it holds the end value for the whole
      // sliver rather than interpolating backwards through the decoy. Both
      // "0%" and END_Y show the real letter, so the cut is invisible.
      const total = duration / (1 - REWIND);
      await Promise.race([
        controls.start(
          { y: ["0%", END_Y, "0%"] },
          {
            duration: total,
            delay,
            times: [0, 1 - REWIND, 1],
            ease: ["easeInOut", () => 1],
          },
        ),
        // Liveness only — the animation lands at rest on its own, so this just
        // guarantees the re-trigger latch is released even if the promise
        // never settles.
        new Promise((res) => setTimeout(res, (delay + total) * 1000 + 200)),
      ]);
      rolling.current = false;
    })();
  }, [playToken, delay, duration, controls]);

  return (
    <motion.span
      className="flex flex-col"
      initial={{ y: "0%" }}
      animate={controls}
    >
      <span className="inline-block" style={{ height: "1.4em", lineHeight: "1.4em" }}>
        {real}
      </span>
      <span className="inline-block" style={{ height: "1.4em", lineHeight: "1.4em" }}>
        {decoy}
      </span>
      <span className="inline-block" style={{ height: "1.4em", lineHeight: "1.4em" }}>
        {real}
      </span>
    </motion.span>
  );
}

/**
 * Hover text effect: each letter rolls once through a random stand-in and back
 * to itself, staggered across the word — about → khrty → about as a single
 * continuous move. The random letters are a way-point in the travel, not a
 * state the word settles into, and the cursor leaving plays no part in it.
 *
 * Purely visual: the reel is `aria-hidden` over a screen-reader-only copy of
 * the real string, so the accessible name never scrambles.
 */
export function RandomLetterSwap({
  label,
  className,
  staggerDuration = 0.025,
  reverse = false,
  transition,
}: RandomLetterSwapProps) {
  // Hover-enter is the only input — a counter rather than a boolean, so each
  // enter is a distinct event the letters can act on. No hover-exit handler:
  // see SwapLetter.
  const [playToken, setPlayToken] = useState(0);
  const letters = useMemo(() => label.split(""), [label]);
  const decoys = useDecoyLetters(label);

  const duration =
    typeof transition?.duration === "number" ? transition.duration : 0.5;

  return (
    <motion.span
      className={cn("relative inline-flex", className)}
      onHoverStart={() => setPlayToken((t) => t + 1)}
    >
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="flex">
        {letters.map((letter, i) => (
          // Window onto the reel. 1.4em, not 1em: a font's line box is taller
          // than its em square, and 1em clipped descenders (the "g"/"y" in
          // PLAYGROUND).
          <span
            key={i}
            className="relative inline-block overflow-hidden"
            style={{ height: "1.4em" }}
          >
            <SwapLetter
              real={letter === " " ? " " : letter}
              decoy={decoys[i] === " " ? " " : decoys[i]}
              playToken={playToken}
              delay={(reverse ? letters.length - 1 - i : i) * staggerDuration}
              duration={duration}
            />
          </span>
        ))}
      </span>
    </motion.span>
  );
}
