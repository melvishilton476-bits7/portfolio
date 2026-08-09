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
 * @param baseDelay ms before the first letter starts (waits out the rule draw)
 * @param step      ms added per letter for the left→right stagger
 */
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

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { threshold: 0.6, rootMargin: "0px 0px -25% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const words = text.split(" ");
  let idx = 0;

  return (
    <p
      ref={ref}
      aria-label={text}
      className={`reveal-text${armed ? " reveal-armed" : ""}${shown ? " is-shown" : ""} ${className}`}
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
