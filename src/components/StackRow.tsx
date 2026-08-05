"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/**
 * StackRow — the "My Stack" tool icons.
 * White circular chips (overlapping), styled after the reference. Each chip is
 * "magnetic": it springs toward the cursor while hovered and springs back to
 * centre on leave, with an underdamped (bouncy) spring. Data-driven: add a tool
 * by dropping its icon in /public/stack and adding a row to STACK.
 */
const STACK = [
  { name: "Figma", src: "/stack/figma.png" },
  { name: "Cursor", src: "/stack/cursor.webp" },
  { name: "Claude", src: "/stack/claude.png" },
  { name: "Codex", src: "/stack/codex.png" },
  { name: "Illustrator", src: "/stack/illustrator.png" },
  { name: "Photoshop", src: "/stack/photoshop.png" },
  { name: "After Effects", src: "/stack/after-effects.png" },
  { name: "Premiere Pro", src: "/stack/premiere-pro.png" },
];

// Bouncy spring — low damping ratio gives the overshoot/settle "bounce".
const SPRING = { stiffness: 300, damping: 12, mass: 1 };
// How strongly a chip follows the cursor (1 = sticks to the pointer).
const PULL = 0.9;

function StackIcon({ name, src }: { name: string; src: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  function onMove(e: React.PointerEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - (r.left + r.width / 2)) * PULL);
    rawY.set((e.clientY - (r.top + r.height / 2)) * PULL);
  }
  function reset() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.li
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y }}
      whileHover={{ zIndex: 10 }}
      className="stack-chip relative grid size-8 place-items-center rounded-full bg-white"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        title={name}
        width={18}
        height={18}
        loading="lazy"
        className="pointer-events-none size-[18px] object-contain"
      />
    </motion.li>
  );
}

export default function StackRow() {
  return (
    <ul
      className="flex items-center justify-center -space-x-2"
      aria-label="Tech stack"
    >
      {STACK.map((tool) => (
        <StackIcon key={tool.name} name={tool.name} src={tool.src} />
      ))}
    </ul>
  );
}
