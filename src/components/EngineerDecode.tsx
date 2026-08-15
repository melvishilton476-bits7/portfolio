"use client";

import { useEffect, useState } from "react";

/**
 * "ENGINEER" as a decode / lock-in animation (fires once on load). Every letter
 * scrambles through grey random glyphs (letters, brackets, asterisks, technical
 * marks) and then locks to its correct letter in black. Letters lock in PAIRS —
 * four events rather than eight — so the word resolves in a handful of readable
 * steps instead of a continuous trickle. Once all eight have locked, the
 * periwinkle outline box wipes in and the external-link arrow leader drops onto
 * it (see globals.css → ENGINEER DECODE).
 *
 * Kerning is dynamic: the rolling glyphs sit in normal inline flow, so each one
 * takes exactly its own width and the spacing adjusts per character — a wide
 * "M" pushes its neighbours out, a narrow "I" pulls them in, and nothing ever
 * overlaps. That rolling layer sits over a hidden copy of the final word, which
 * holds a stable footprint so the width wobble never disturbs the rest of the
 * headline and the box (which hugs that hidden copy) stays rock-steady.
 *
 * The layer is anchored LEFT, not centred, so all that width wobble propagates
 * rightward and the first letter never gets shoved sideways — see the note on
 * .engineer-roll in globals.css for the measurements behind that. Slot 0 is
 * also forced into the first locking pair, so the "E" is fixed in both position
 * and width for most of the animation. The trade for left-anchoring is that the
 * overshoot all lands on one side, into a 29px gap; GLYPHS below is width-capped
 * so it cannot cross that gap.
 *
 * Under prefers-reduced-motion it renders the finished word + box, no motion.
 * Owns the box + leader markup (moved out of Hero.tsx) so it can gate their
 * entrance on the lock completing.
 */
const WORD = "ENGINEER";

/**
 * Fixed, width-capped glyph pool. Every glyph here measures ≤29.2px at the
 * headline's display size — deliberately, because the roll is left-anchored and
 * so all of its width overshoot lands on the RIGHT, where there is only 29px of
 * clearance before the periwinkle hatch cell. Eight slots × 29.2px = 233px
 * against the word's own 211px footprint, so the worst case the pool can
 * possibly produce still stops ~7px short of the cell — no spill, ever, in any
 * combination, rather than merely usually. (The margin is deliberately more
 * than a pixel or two: font rasterisation differs between machines.)
 *
 * That's what excludes M, W, O, Q, N, U, D, B, G, H, C, X, A, R and the em-dash
 * (29.7–45px) from the original A–Z set. Kerning stays very much dynamic: the
 * pool still spans 5.8px ("·") to 29.2px ("V"), a 5× spread.
 */
const GLYPHS = "EFJKLPSTVYZ[]{}<>/\\|*+=-·?:;".split("");
const rand = <T,>(arr: T[]) => arr[(Math.random() * arr.length) | 0];

/** How long a random glyph stays on screen before being replaced. */
const ROLL_MS = 80;
/** Letters resolved per lock event. Eight letters → four events. */
const PAIR_SIZE = 2;
const FIRST_LOCK_MS = 300;
const LOCK_STEP_MS = 260;
/** ±jitter on each pair's moment so the four events don't feel metronomic.
 *  Well under half of LOCK_STEP_MS, so pairs can never reorder. */
const LOCK_JITTER_MS = 40;

export default function EngineerDecode() {
  // SSR / first paint shows the real word (grey, unlocked) so no-JS and screen
  // readers get "ENGINEER"; the mount effect starts the scramble a frame later.
  const [chars, setChars] = useState<string[]>(() => WORD.split(""));
  const [locked, setLocked] = useState<boolean[]>(() => WORD.split("").map(() => false));
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setChars(WORD.split(""));
      setLocked(WORD.split("").map(() => true));
      setDone(true);
      return;
    }

    // Resolve order: slot 0 first (so the "E" settles early and then holds
    // still), the other seven shuffled behind it. Chunked into pairs, each pair
    // sharing one lock moment — so the word resolves in four scattered steps
    // rather than eight, and never as a left-to-right sweep.
    const rest = WORD.split("").map((_, i) => i).slice(1);
    for (let i = rest.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    const order = [0, ...rest];
    const lockAt = new Array<number>(WORD.length);
    for (let p = 0; p * PAIR_SIZE < order.length; p++) {
      const at =
        FIRST_LOCK_MS +
        p * LOCK_STEP_MS +
        (Math.random() * 2 - 1) * LOCK_JITTER_MS;
      for (let k = 0; k < PAIR_SIZE; k++) {
        const slot = order[p * PAIR_SIZE + k];
        if (slot !== undefined) lockAt[slot] = at;
      }
    }
    const lockedArr = WORD.split("").map(() => false);
    const charArr = WORD.split("").map(() => rand(GLYPHS));
    const start = performance.now();
    let lastRoll = 0;
    let raf = 0;

    const tick = (now: number) => {
      const t = now - start;
      let changed = false;

      // Lock any slot whose time has come.
      for (let i = 0; i < WORD.length; i++) {
        if (!lockedArr[i] && t >= lockAt[i]) {
          lockedArr[i] = true;
          charArr[i] = WORD[i];
          changed = true;
        }
      }
      // Roll fresh random glyphs into the still-unlocked slots.
      if (now - lastRoll >= ROLL_MS) {
        for (let i = 0; i < WORD.length; i++) {
          if (!lockedArr[i]) charArr[i] = rand(GLYPHS);
        }
        lastRoll = now;
        changed = true;
      }
      if (changed) {
        setChars([...charArr]);
        setLocked([...lockedArr]);
      }
      if (lockedArr.every(Boolean)) {
        setDone(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <span className={`engineer-decode relative inline-block${done ? " is-locked" : ""}`} aria-label={WORD}>
      {/* Periwinkle outline box + external-link leader — parked for now; the
          word itself carries the periwinkle instead (letters lock to #8581ff
          rather than ink). The `done` → `.is-locked` wiring below is left
          intact, and their CSS is still in globals.css → ENGINEER DECODE, so
          bringing them back is a pure uncomment.
      <span aria-hidden className="hero-engineer-box" />
      <span aria-hidden className="hero-engineer-leader">
        <span className="hero-engineer-leader__badge">↗</span>
        <span className="hero-engineer-leader__line" />
        <span className="hero-engineer-leader__ring" />
      </span>
      */}
      {/* Hidden copy of the final word: holds the stable footprint (so the rest
          of the headline never shifts) and gives the box the real word to hug. */}
      <span aria-hidden className="engineer-reserve">{WORD}</span>
      {/* The rolling letters, centred over that footprint. In normal flow, so
          each glyph takes its own width — kerning adjusts per character and
          nothing overlaps. Grey while scrambling, ink once locked. */}
      <span aria-hidden className="engineer-roll">
        {chars.map((c, i) => (
          <span key={i} className={locked[i] ? "is-locked" : undefined}>{c}</span>
        ))}
      </span>
    </span>
  );
}
