"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Text that pops in as ONE piece when it scrolls into view: a short rise with
 * a small overshoot, so it lands with a bounce rather than easing in.
 *
 * It used to type itself in letter by letter after a 1.2s wait for the band
 * rules to draw, which put the last glyph over three seconds after the card
 * arrived — long enough that the reader had moved on before the sentence
 * finished. Now it goes as the rules start, and is done in half a second.
 *
 * The reveal only *arms* (hides the text) once JS has mounted, so no-JS and
 * SEO keep plain text. Under reduced motion it never arms, so the text is
 * simply shown.
 *
 * @param delay ms before the bounce starts
 */
export default function RevealText({
  text,
  className = "",
  delay = 200,
  threshold = 0.6,
  rootMargin = "0px 0px -25% 0px",
}: {
  text: string;
  className?: string;
  delay?: number;
  /** IntersectionObserver trigger — see HatchCell. */
  threshold?: number;
  rootMargin?: string;
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
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return (
    <p
      ref={ref}
      className={`reveal-text${armed ? " reveal-armed" : ""}${shown ? " is-shown" : ""} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {text}
    </p>
  );
}
