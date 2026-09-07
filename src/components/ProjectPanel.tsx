"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import FeaturedProject from "./FeaturedProject";
import Ticket from "./Ticket";
import {
  traverse,
  arrive,
  stepDelay,
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
  /** Cover art, under /public. Shown on both the featured card and the
      ticket; omit and both fall back to their dashed placeholders. */
  thumb?: string;
  thumbAlt?: string;
  /** object-position for the crop, when the art's own shape differs from the
      card's. Mirrors what the case hero uses so both frame the same thing. */
  thumbPosition?: string;
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
  count,
  step,
}: {
  project: Project;
  index: number;
  /** How many panels are in the strip — the stagger counts back from the far
   *  end when the strip reverses, so it needs to know where that end is. */
  count: number;
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

  /* How long after the leading edge this card takes up the pull. Depends on
     the direction: going forward the strip runs left and index 0 is out in
     front; going back it runs right and the last card leads instead. */
  const lead = stepDelay(index, count, travelSign);

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
      /* The card's place in the pull. Only while travelling: on the first
         paint there is nothing to stagger against, and a delay there would
         leave the strip sitting at zero before jumping into position.

         The delay goes on scale and filter too, so a card sharpens as IT
         starts moving rather than every card sharpening on the same beat while
         two of them are still standing still. */
      transition={
        moving
          ? {
              x: { ...arrive, delay: lead },
              scale: { ...traverse, delay: lead },
              filter: { ...traverse, delay: lead },
            }
          : { x: traverse, scale: traverse, filter: traverse }
      }
      // Only the centred slide is interactive; the peeking neighbours are
      // decorative until they arrive.
      inert={!current}
    >
      <FeaturedProject
        title={project.title}
        quote={project.quote}
        href={project.href}
        thumb={project.thumb}
        thumbAlt={project.thumbAlt}
        thumbPosition={project.thumbPosition}
        current={current}
      />
      <Ticket {...project} active={current} />
    </motion.div>
  );
}
