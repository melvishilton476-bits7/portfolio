"use client";

import { motion, type Variants } from "framer-motion";
import Placeholder from "./Placeholder";
import Ticket from "./Ticket";

export type Project = {
  title: string;
  meta: string;
  color: string;
  darkText?: boolean;
  quote: string;
  pieces?: boolean;
};

/** The transition's own pace — real time and an authored easing curve,
    decoupled from how fast or slow the scroll gesture that triggered it was. */
export const STEP_TRANSITION = { duration: 0.85, ease: [0.65, 0, 0.35, 1] } as const;

/** Each panel-half rests in one of three states as `step` moves past its
    index: not yet arrived (below the fold), the current front card, or
    already shown and sent off to its side. Reversing `step` re-targets the
    same variants, so scrolling back up naturally undoes the motion — framer
    interpolates from wherever the value currently sits, forward or back. */
const leftVariants: Variants = {
  below: { x: 0, y: "70vh", scale: 1, filter: "blur(0px)" },
  current: { x: 0, y: "0vh", scale: 1, filter: "blur(0px)" },
  past: { x: "-55vw", y: "0vh", scale: 0.85, filter: "blur(3px)" },
};
const rightVariants: Variants = {
  below: { x: 0, y: "70vh", scale: 1, filter: "blur(0px)" },
  current: { x: 0, y: "0vh", scale: 1, filter: "blur(0px)" },
  past: { x: "55vw", y: "0vh", scale: 0.85, filter: "blur(3px)" },
};

/**
 * One project's placeholder + ticket + quote, as a layer in the pinned
 * carousel. `step` is which project currently owns the front — this panel
 * is "below" until `step` reaches its `index`, "current" while it holds it,
 * and "past" (exited left/right, placeholder and ticket splitting apart)
 * once `step` moves on. No opacity fades anywhere: motion is purely
 * positional, on and off the way it arrived.
 */
export default function ProjectPanel({
  project,
  index,
  step,
}: {
  project: Project;
  index: number;
  step: number;
}) {
  const rest = index < step ? "past" : index === step ? "current" : "below";
  // `step` only ever moves one index at a time, so reaching or passing this
  // panel's index means it was genuinely shown — safe to latch permanently.
  const active = step >= index;
  const current = index === step;

  return (
    <div
      className="absolute inset-0 grid grid-cols-2 items-center gap-16"
      inert={!current}
    >
      <motion.div
        variants={leftVariants}
        animate={rest}
        transition={STEP_TRANSITION}
        className="mx-auto flex w-full max-w-[494px] items-center justify-center"
      >
        <Placeholder label="Featured project" ratio={493 / 256} variant="dark" />
      </motion.div>

      <motion.div
        variants={rightVariants}
        animate={rest}
        transition={STEP_TRANSITION}
        className="flex flex-col items-center gap-4"
      >
        <Ticket {...project} active={active} />
        <blockquote className="type-label max-w-[326px] text-center font-normal leading-snug text-ink">
          &ldquo;{project.quote}&rdquo;
        </blockquote>
      </motion.div>
    </div>
  );
}
