"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

/**
 * Full-bleed dashed hairline pinned to the top or bottom of its relative parent
 * (SIDE STREETS bands + the section opener). It spans the whole viewport width
 * (left runs to the viewport's left edge from the centred container) and, when
 * it scrolls into view, DRAWS IN exactly like the hero's horizontal rules: one
 * left-to-right sweep (scaleX 0→1, origin left), then the dashes keep marching
 * rightward forever — see `.side-rule` in globals.css, which reuses the hero's
 * `accent-grow-x` / `accent-march-x` keyframes.
 *
 * Unlike the hero (which fires on page load) this sits below the fold, so a
 * fire-once IntersectionObserver — the same threshold/margin as HatchCell, so a
 * band's rules and its hatch cells draw together — gates the animation. Desktop
 * only. Under prefers-reduced-motion the line is shown drawn and still.
 */
const DASH_H = `repeating-linear-gradient(to right, rgba(23,23,23,0.16) 0px, rgba(23,23,23,0.16) 10px, transparent 10px, transparent 18px)`;

export default function DashRule({ edge }: { edge: "top" | "bottom" }) {
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
      { threshold: 0.35, rootMargin: "0px 0px -18% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [drawn]);

  return (
    <span
      ref={ref}
      aria-hidden
      className={`side-rule pointer-events-none absolute hidden h-px w-screen lg:block ${drawn ? "is-drawn" : ""}`}
      style={{
        left: "calc(50% - 50vw)",
        [edge]: 0,
        backgroundImage: DASH_H,
        ["--march" as string]: "18px",
      } as CSSProperties}
    />
  );
}
