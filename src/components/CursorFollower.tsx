"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * A label that rides the pointer while it's over `containerRef`, trailing
 * slightly behind so it feels weighted rather than glued on.
 *
 * Purely decorative — `aria-hidden` and `pointer-events-none`. The thing it
 * advertises has to be a real control underneath, or keyboard and screen
 * reader users get no affordance at all.
 *
 * Only runs where a real pointer exists, and only while `enabled`. That
 * second gate matters: in the carousel, non-current panels are scaled and
 * translated far off-screen, so mapping client coordinates into them would
 * need inverse-transform maths. Restricting to the panel that's actually
 * front-and-centre keeps the parent at identity and the arithmetic trivial.
 */
export default function CursorFollower({
  containerRef,
  enabled = true,
  label,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
  enabled?: boolean;
  label: string;
}) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 320, damping: 30, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 320, damping: 30, mass: 0.5 });

  // Reduced motion keeps the label pinned to the pointer — the lag *is* the
  // motion here, so there's nothing to soften, only to remove.
  const px = reduce ? x : sx;
  const py = reduce ? y : sy;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled) {
      setVisible(false);
      return;
    }
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const local = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top] as const;
    };

    // The label sits to the *left* of the pointer, so anchor it a few px left
    // of the true cursor x; the bubble's right edge (translate-x-full) then
    // lands just shy of the cursor.
    const GAP = 12;

    const move = (e: PointerEvent) => {
      const [lx, ly] = local(e);
      x.set(lx - GAP);
      y.set(ly);
    };

    const enter = (e: PointerEvent) => {
      const [lx, ly] = local(e);
      // Jump rather than set, so the label appears where the pointer entered
      // instead of springing across the card from wherever it was last left.
      x.jump(lx - GAP);
      y.jump(ly);
      sx.jump(lx - GAP);
      sy.jump(ly);
      setVisible(true);
    };

    const leave = () => setVisible(false);

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, [containerRef, enabled, x, y, sx, sy]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 z-30"
      style={{ x: px, y: py }}
    >
      <motion.div
        animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        // A DARK pill, not white glass. The label rides the pointer inside a
        // transformed / z-indexed wrapper, and each of those creates a stacking
        // context that isolates `mix-blend-mode` from the page — so a blend-based
        // "adapt to the backdrop" trick can't see the page and fails. A dark pill
        // keeps the white text legible everywhere the label overhangs: on the
        // dark card (btn-dark reads a touch lighter than the ink slab) and out on
        // the white page (an obvious dark pill).
        className="type-caption flex -translate-x-full -translate-y-1/2 items-center gap-1.5 rounded-card border border-white/20 bg-btn-dark/80 px-3 py-1.5 whitespace-nowrap text-white shadow-[0_4px_16px_rgba(0,0,0,0.28)] backdrop-blur-md backdrop-saturate-150"
      >
        {label}
        <span aria-hidden>&rarr;</span>
      </motion.div>
    </motion.div>
  );
}
