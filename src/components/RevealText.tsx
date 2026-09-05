"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

/**
 * Text that reveals LETTER BY LETTER when it scrolls into view: each glyph
 * fades in while rising from a touch below (bottom-to-top), swept left→right in
 * reading order. Tuned to land just after the SIDE STREETS band rules finish
 * drawing (baseDelay), so the sentence "types" itself in once the lines settle.
 *
 * Words are inline-block (never break mid-word) and separated by real spaces
 * (normal wrapping, no overflow); letters are inline-block so they can rise
 * independently. The full sentence lives on aria-label with the letter spans
 * aria-hidden, so assistive tech and no-JS both read plain text — the reveal
 * only *arms* (hides the letters) once JS has mounted. Under reduced-motion it
 * never arms, so the text is simply shown.
 *
 * ONCE THE SWEEP IS OVER THE SPANS ARE RETIRED. Each armed letter carries its
 * own running animation, and a page with several of these quotes was holding
 * hundreds of them alive forever — every one an element the compositor had to
 * keep as its own layer, long after it had finished moving. So a timer sized to
 * the last letter's finish drops the classes, and the paragraph goes back to
 * being plain text.
 *
 * @param baseDelay ms before the first letter starts (waits out the rule draw)
 * @param step      ms added per letter for the left→right stagger
 */

/** Must match the reveal-letter duration in globals.css. */
const LETTER_MS = 550;
export default function RevealText({
  text,
  className = "",
  baseDelay = 1200,
  step = 14,
}: {
  text: string;
  className?: string;
  baseDelay?: number;
  step?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);
    const el = ref.current;
    if (!el) return;
    let retire = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
        // Sized to the last letter landing, then the spans stand down.
        const letters = text.replace(/ /g, "").length;
        retire = window.setTimeout(
          () => setDone(true),
          baseDelay + letters * step + LETTER_MS,
        );
      },
      { threshold: 0.6, rootMargin: "0px 0px -25% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(retire);
    };
  }, [text, baseDelay, step]);

  const words = text.split(" ");
  let idx = 0;

  return (
    <p
      ref={ref}
      aria-label={text}
      className={`reveal-text${armed && !done ? " reveal-armed" : ""}${shown && !done ? " is-shown" : ""} ${className}`}
    >
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span aria-hidden className="reveal-word">
            {[...word].map((ch, ci) => (
              <span
                key={ci}
                style={{ ["animationDelay" as string]: `${baseDelay + idx++ * step}ms` } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}
