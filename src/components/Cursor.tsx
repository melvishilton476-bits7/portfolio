"use client";

import { useEffect, useRef } from "react";

/**
 * The site's pointer: a periwinkle dot that replaces the native cursor and
 * swells into a labelled pill over anything that has something to say.
 *
 * A target opts in by carrying `data-cursor` with the words it wants shown —
 *
 *   <a href="/work/titan-rebrand" data-cursor="VIEW CASE STUDY">
 *
 * — rather than the cursor keeping a list of selectors it knows about. The
 * label then lives next to the thing it describes, a new one costs an
 * attribute, and nothing here has to be edited to add one.
 *
 * THE NATIVE CURSOR IS HIDDEN FROM HERE, NOT FROM CSS, and that is the whole
 * reason this is a component rather than three lines in globals.css. A blanket
 * `* { cursor: none }` in the stylesheet applies the moment the stylesheet
 * lands — before hydration, on a touch screen, and on any visit where the JS
 * fails or is blocked. In each of those the page has taken the pointer away and
 * put nothing back. So the class that hides it is added by this effect, after
 * the checks below have passed, and removed again on cleanup: if the
 * replacement is not running, the real one is never taken.
 *
 * It runs only where a real pointer exists — `(hover: hover) and
 * (pointer: fine)`, so touch and pen are left alone, which is also why the
 * media query is here and not a width breakpoint (a small laptop has a mouse; a
 * large tablet does not).
 *
 * Text entry keeps the system cursor. Over an input, a textarea or anything
 * contenteditable the dot hides and the I-beam comes back — a caret needs to be
 * placed between two characters, and a 14px disc cannot show you where it will
 * land.
 */

/** Dot diameter, and the pill's height when it opens. */
const DOT = 14;
const PILL_H = 28;

/** Periwinkle for the dot — the site's accent, the colour ENGINEER locks onto.
 *  Ink for the pill, because the label has to stay readable over photographs
 *  and case-study art, and white on periwinkle is under 3:1. */
const DOT_BG = "#8581ff";
const PILL_BG = "#171717";

const TYPING =
  'input, textarea, [contenteditable=""], [contenteditable="true"]';

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const capsuleRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const dot = dotRef.current;
    const capsule = capsuleRef.current;
    const label = labelRef.current;
    if (!dot || !capsule || !label) return;

    // Mouse-like pointers only. Touch already has a perfectly good affordance
    // — the finger — and hiding a cursor that was never visible while adding a
    // dot that cannot be moved is worse than nothing.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;

    root.classList.add("has-cursor");

    let raf = 0;
    let x = 0;
    let y = 0;
    let shown = false;

    /* Position is written on a frame, not on the event. A fast mouse fires
       pointermove far more often than the screen refreshes, and every one of
       those writes would otherwise force its own style recalculation for a
       position only the next paint can show. */
    const draw = () => {
      raf = 0;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(draw);
      if (!shown) {
        shown = true;
        dot.dataset.on = "1";
      }
    };

    /* What the pointer is over decides the shape. `closest` rather than a
       match on the event target itself: the target is whatever leaf the mouse
       happens to be on — a span inside a heading inside the card — and the
       intent belongs to the card. */
    const survey = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t || typeof t.closest !== "function") return;

      if (t.closest(TYPING)) {
        dot.dataset.mode = "text";
        return;
      }
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      const words = labelled?.dataset.cursor?.trim();
      if (words) {
        label.textContent = words;
        dot.dataset.mode = "pill";
      } else {
        dot.dataset.mode = "dot";
      }
    };

    /* Leaving the window entirely — `relatedTarget` is null when the pointer
       crosses the document boundary rather than moving between two elements
       inside it. Without this the dot stays frozen at the edge of the page
       while the real pointer is somewhere else on the screen. */
    const out = (e: PointerEvent) => {
      if (!e.relatedTarget) {
        shown = false;
        delete dot.dataset.on;
      }
    };

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", survey, { passive: true });
    document.addEventListener("pointerout", out, { passive: true });

    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", survey);
      document.removeEventListener("pointerout", out);
      if (raf) cancelAnimationFrame(raf);
      root.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="site-cursor"
      data-mode="dot"
      style={{
        ["--dot" as string]: `${DOT}px`,
        ["--pill-h" as string]: `${PILL_H}px`,
      }}
    >
      {/* The capsule grows RIGHTWARD from the pointer rather than around it:
          the dot's centre sits on the hotspot, and the label unrolls to its
          right, so the words never straddle the point being aimed at. */}
      <div
        ref={capsuleRef}
        className="site-cursor__capsule"
        style={{
          ["--dot-bg" as string]: DOT_BG,
          ["--pill-bg" as string]: PILL_BG,
        }}
      >
        <span ref={labelRef} className="site-cursor__label" />
        <span className="site-cursor__arrow" aria-hidden>
          &rarr;
        </span>
      </div>
    </div>
  );
}
