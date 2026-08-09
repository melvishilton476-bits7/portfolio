"use client";

import { useEffect, useState } from "react";

/**
 * "ENGINEER" as a decode / lock-in animation (fires once on load). Every letter
 * scrambles through grey random glyphs (letters, brackets, asterisks, technical
 * marks); each locks to its correct letter — in black — at its OWN random time,
 * so the word resolves in a scattered order rather than a clean sweep. Once all
 * eight have locked, the periwinkle outline box wipes in and the external-link
 * arrow leader drops onto it (see globals.css → ENGINEER DECODE).
 *
 * Kerning is dynamic: the rolling glyphs sit in normal inline flow, so each one
 * takes exactly its own width and the spacing adjusts per character — a wide
 * "M" pushes its neighbours out, a narrow "I" pulls them in, and nothing ever
 * overlaps. That rolling layer is absolutely centred over a hidden copy of the
 * final word, so its width wobble never disturbs the rest of the headline and
 * the box (which hugs that hidden copy) stays rock-steady on the real word.
 *
 * Under prefers-reduced-motion it renders the finished word + box, no motion.
 * Owns the box + leader markup (moved out of Hero.tsx) so it can gate their
 * entrance on the lock completing.
 */
const WORD = "ENGINEER";
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ[]{}<>/\\*+=·—".split("");
const rand = <T,>(arr: T[]) => arr[(Math.random() * arr.length) | 0];

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

    // Each slot locks at its own random moment → scattered resolve order.
    const lockAt = WORD.split("").map(() => 350 + Math.random() * 1150);
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
      // Roll fresh random glyphs into the still-unlocked slots ~25fps.
      if (now - lastRoll >= 40) {
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
      {/* Periwinkle outline box — hidden until the word locks, then wipes in. */}
      <span aria-hidden className="hero-engineer-box" />
      {/* External-link leader (badge + drop line + ring) — drops in after the box. */}
      <span aria-hidden className="hero-engineer-leader">
        <span className="hero-engineer-leader__badge">↗</span>
        <span className="hero-engineer-leader__line" />
        <span className="hero-engineer-leader__ring" />
      </span>
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
