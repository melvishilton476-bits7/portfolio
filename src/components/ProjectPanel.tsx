"use client";

import { motion } from "framer-motion";
import FeaturedProject from "./FeaturedProject";
import Ticket from "./Ticket";
import { traverse } from "@/lib/step-motion";

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

  return (
    <motion.div
      className="absolute top-[calc(50%-2px)] left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-7"
      style={{ width: SLIDE_W }}
      animate={{ x: (index - step) * SLOT }}
      transition={traverse}
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
