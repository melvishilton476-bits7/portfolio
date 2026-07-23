"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import FeaturedProject from "./FeaturedProject";
import Ticket from "./Ticket";
import {
  traverse,
  arrive,
  ANTICIPATION_PX,
  OVERSHOOT_PX,
} from "@/lib/step-motion";

export type Project = {
  title: string;
  meta: string;
  color: string;
  darkText?: boolean;
  quote: string;
  /** Exactly two — they render as the tabs behind the card's top edge. */
  tags: readonly [string, string];
  href?: string;
  pieces?: boolean;
};

/** Slide width (the featured card) and the centre-to-centre distance between
    adjacent slides. The gutter between them is wide on purpose: it keeps the
    neighbours to a peek at the frame edges, and it's the empty band the
    floating asterisks will later live in. */
const SLIDE_W = 470;
const GAP = 260;
const SLOT = SLIDE_W + GAP;

/**
 * One project as a slide in the horizontal filmstrip: its featured card
 * stacked directly over its ticket, the pair moving together as a unit.
 *
 * Every slide sits centred in the frame and is pushed sideways by its distance
 * from `step` — `(index - step)` slots — so the current project holds the
 * centre, the previous one peeks off the left edge and the next off the right.
 * When `step` changes, all slides translate by one slot on the same easing,
 * conveying the strip right-to-left. No depth or fade: slides only move.
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
  const current = index === step;

  // The step this slide last rendered at, so we know which way the strip is
  // travelling and can wind back the *opposite* way before the sweep. Updated
  // after commit, so during the render where `step` changes it still holds the
  // previous value. The scroll lock keeps a step from firing mid-slide, so the
  // strip is always settled at `prevX` by the time the next step arrives.
  const prevStepRef = useRef(step);
  useEffect(() => {
    prevStepRef.current = step;
  }, [step]);
  const prevStep = prevStepRef.current;

  const target = (index - step) * SLOT;
  const prevX = (index - prevStep) * SLOT;
  const travelSign = Math.sign(target - prevX); // -1 left, +1 right, 0 still
  const moving = travelSign !== 0;

  // With a travel direction, play the full gesture as a keyframed `x`: hold at
  // the current spot, recoil `ANTICIPATION_PX` against the travel, sweep all
  // the way across and `OVERSHOOT_PX` past the landing, then settle back to
  // `target`. On the first paint (no direction) it's just the plain target.
  const x = moving
    ? [
        prevX,
        prevX - travelSign * ANTICIPATION_PX,
        target + travelSign * OVERSHOOT_PX,
        target,
      ]
    : target;

  return (
    <motion.div
      className="absolute top-[calc(50%-2px)] left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-7"
      style={{ width: SLIDE_W }}
      // Off-stage neighbours sit smaller and softly blurred so they read as
      // pushed back; the centred slide is full size and sharp. `scale` writes
      // `transform`, which composes with the `-translate-x-1/2` centring
      // utility (a `translate`), so the two don't fight. `scale`/`filter` keep
      // the plain `traverse` easing while `x` plays the wind-back → sweep →
      // overshoot → settle timeline, so a neighbour still sharpens and grows
      // into place as it slides to centre, and softens as it leaves.
      animate={{
        x,
        scale: current ? 1 : 0.88,
        filter: current ? "blur(0px)" : "blur(3px)",
      }}
      transition={{ x: moving ? arrive : traverse, scale: traverse, filter: traverse }}
      // Only the centred slide is interactive; the peeking neighbours are
      // decorative until they arrive.
      inert={!current}
    >
      <FeaturedProject
        title={project.title}
        quote={project.quote}
        href={project.href}
        current={current}
      />
      <Ticket {...project} active={current} />
    </motion.div>
  );
}
