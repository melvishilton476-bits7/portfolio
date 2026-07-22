"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import FeaturedProject from "./FeaturedProject";
import Ticket from "./Ticket";
import ProjectPanel, { type Project } from "./ProjectPanel";
import SlideHands from "./SlideHands";
import Asterisk from "./Asterisk";
import { STEP_DURATION } from "@/lib/step-motion";

/**
 * A floating asterisk pinned to the stage (it doesn't ride the filmstrip —
 * cards slide past it). Two independent motions:
 *
 *  - a faint, endless vertical float so the mark breathes rather than sitting
 *    dead between transitions;
 *  - a rotation that is NOT a constant spin. It's a one-shot turn that fires
 *    only when a new project moves to centre. The target angle swings between
 *    `baseRotate` and `baseRotate + swing` on each step, so consecutive turns
 *    go opposite ways (CW, CCW, CW…) with no accumulation. The first project
 *    is the rest state — step 0 sits at `baseRotate`, no turn on entry — so
 *    only actual swaps rotate.
 *
 * Position/size/blur come in via `className`; the depth layers blur and dim
 * the same shape.
 *
 * Placement is anchored to the CARD, not the stage: the card is a fixed-width
 * box centred in the stage, so a percentage of the (viewport-sized) stage would
 * drift relative to the card at other resolutions — on some it lands the mark
 * fully behind the card. Instead every instance positions its CENTRE at the
 * stage centre (which is the card centre) plus a fixed pixel offset —
 * `left-[calc(50%±Npx)] top-[calc(50%±Mpx)]` — and this base centres the mark on
 * that point with a `translate` (which composes with framer's float/rotate
 * `transform`). So the marks hold their spot against the card at any size.
 */
function FloatAsterisk({
  color,
  className,
  baseRotate = 0,
  swing = 40,
  drift = 8,
  duration = 7,
  delay = 0,
  step,
}: {
  color: string;
  className: string;
  baseRotate?: number;
  swing?: number;
  drift?: number;
  duration?: number;
  delay?: number;
  step: number;
}) {
  const settled = Math.max(step, 0);
  const rotate = baseRotate + (settled % 2 === 1 ? swing : 0);

  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 ${className}`}
      animate={{ y: [0, -drift, 0], rotate }}
      // Per-property timing: the float loops forever on a soft ease, while the
      // rotation plays once per swap on a heavy ease-in-out (slow start, quick
      // middle, slow settle) tuned to land with the project slide.
      transition={{
        y: { duration, repeat: Infinity, ease: "easeInOut", delay },
        rotate: { duration: 0.8, ease: [0.83, 0, 0.17, 1] },
      }}
    >
      <Asterisk color={color} className="h-auto w-full" />
    </motion.div>
  );
}

const PROJECTS: Project[] = [
  {
    title: "TITAN - REBRAND",
    meta: "SOLO,2025",
    color: "#14A44D",
    quote:
      "A conceptual rebrand of Titan, India’s iconic eyewear brand, reimagined for the athletic market.",
    tags: ["Branding", "UI/UX"],
  },
  {
    title: "TITAN - REBRAND",
    meta: "SOLO,2025",
    color: "#A9C4F5",
    darkText: true,
    quote:
      "A conceptual rebrand of Titan, India’s iconic eyewear brand, reimagined for the athletic market.",
    tags: ["Branding", "UI/UX"],
  },
  {
    title: "TITAN - REBRAND",
    meta: "SOLO,2025",
    color: "#F81B0E",
    quote:
      "A conceptual rebrand of Titan, India’s iconic eyewear brand, reimagined for the athletic market.",
    tags: ["Branding", "UI/UX"],
  },
];

function Heading() {
  return (
    <header className="text-center">
      <h2 className="type-heading text-ink-alt">
        SIGHTS to <span className="font-mono">SEE</span>
      </h2>
      <p className="type-lead mt-3">
        Problems walked into. Solutions built out of.
      </p>
    </header>
  );
}

/** Below `lg`, and under `prefers-reduced-motion`: the plain stacked list —
    no pin, no scroll-jacking, everything visible at once. */
function StaticWork() {
  return (
    <>
      <Heading />
      <div className="mt-16 flex flex-col gap-20">
        {PROJECTS.map((project, i) => (
          <div key={i} className="flex flex-col items-center gap-8">
            <FeaturedProject
              title={project.title}
              quote={project.quote}
              href={project.href}
              flat
            />
            <Ticket {...project} />
          </div>
        ))}
      </div>
    </>
  );
}

/** Scroll distance given to each project, in viewport heights. Scroll no
    longer drives the animation directly (see below), so this only needs to
    be enough to feel like a deliberate "hold" before the next trigger. */
const VH_PER_PROJECT = 160;

/** Turns continuous scroll progress into a discrete step index: -1 while the
    pin hasn't been reached yet, then 0..total-1 as thresholds are crossed. */
function thresholdStep(p: number, total: number) {
  if (p < 0) return -1;
  if (p >= 1) return total - 1;
  return Math.floor(p * total);
}

/** `lg` and up, motion allowed: the pinned carousel. Scroll position is a
    trigger here, not a scrub source — crossing a threshold advances `step`
    by exactly one, and ProjectPanel plays that transition on its own timed
    easing (STEP_DURATION), independent of scroll speed. While a step is
    mid-transition, further threshold crossings are ignored; once it
    finishes, `settle` re-checks where the scroll actually is and advances
    again if the user scrolled further while locked, one step at a time,
    until it catches up. */
function Carousel() {
  const pinRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  const [step, setStep] = useState(-1);
  const stepRef = useRef(-1);
  const lockedRef = useRef(false);

  function settle() {
    const target = thresholdStep(scrollYProgress.get(), PROJECTS.length);
    if (target === stepRef.current) {
      lockedRef.current = false;
      return;
    }
    lockedRef.current = true;
    const next = target > stepRef.current ? stepRef.current + 1 : stepRef.current - 1;
    stepRef.current = next;
    setStep(next);
    window.setTimeout(settle, STEP_DURATION * 1000);
  }

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (lockedRef.current) return;
    if (thresholdStep(p, PROJECTS.length) !== stepRef.current) settle();
  });

  return (
    <div
      ref={pinRef}
      className="relative hidden lg:block"
      style={{ height: `${PROJECTS.length * VH_PER_PROJECT}vh` }}
    >
      {/* Full viewport width, overflow clipped: the strip conveys across the
          whole screen and its neighbours have to run off the true edges, not
          vanish at the page-container gutter. */}
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* Heading holds the top, inside the normal gutter. */}
        <div className="page-container pt-16">
          <Heading />
        </div>

        {/* The filmstrip stage fills the rest, full-bleed. Every slide is
            centred here and pushed sideways by its distance from `step`. */}
        <div className="relative flex-1">
          {/* Depth layer: the same asterisk, blurred and dimmed, sitting
              behind the strip so it reads as far back. */}
          <FloatAsterisk
            color="var(--color-splat-red)"
            className="top-[calc(50%-278px)] left-[calc(50%+140px)] w-[44px] opacity-80 blur-[3px]"
            baseRotate={-8}
            swing={100}
            drift={11}
            duration={6.5}
            step={step}
          />

          {/* Sharp red, but rendered before the slides so the centred card
              paints over its inner edge — it reads as tucked slightly behind
              the card, overhanging only into the right gutter. */}
          <FloatAsterisk
            color="var(--color-splat-red)"
            className="top-[calc(50%-178px)] left-[calc(50%+246px)] w-[64px]"
            baseRotate={6}
            swing={-108}
            drift={15}
            duration={5.5}
            step={step}
          />

          {PROJECTS.map((project, i) => (
            <ProjectPanel key={i} project={project} index={i} step={step} />
          ))}

          {/* Glass edges: a frosted white gradient that dissolves the peeking
              neighbours into the frame, masked so the frost itself fades out
              toward the centre rather than sitting as a hard band. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[14vw] bg-gradient-to-r from-background via-background/70 to-transparent backdrop-blur-sm [mask-image:linear-gradient(to_right,#000,transparent)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-[14vw] bg-gradient-to-l from-background via-background/70 to-transparent backdrop-blur-sm [mask-image:linear-gradient(to_left,#000,transparent)]"
          />

          {/* Foreground asterisk: sharp, above the glass edges, tucked into
              the card's bottom-left corner. Stationary — cards slide past it. */}
          <FloatAsterisk
            color="var(--color-splat-purple)"
            className="top-[calc(50%+41px)] left-[calc(50%-222px)] z-30 w-[92px] opacity-80 blur-[3px]"
            baseRotate={-16}
            swing={96}
            drift={13}
            duration={6}
            delay={1}
            step={step}
          />
        </div>
      </div>
    </div>
  );
}

export default function Work() {
  const reduce = useReducedMotion();

  // The section is a full-bleed white slab that slides up over the sticky
  // hero: rounded top, a shadow cast onto the hero above it, and z-10 to sit
  // in front. No page-container on the section itself — the pinned carousel
  // needs full viewport width to clip against, so each branch applies its own
  // gutters. No overflow-clip here either: the hands overhang the top edge.
  return (
    <section
      id="work"
      className="relative z-10 rounded-t-slab bg-background py-24 shadow-[0_-22px_55px_-14px_rgba(0,0,0,0.28)] sm:py-32"
    >
      <SlideHands />
      <div className={`page-container ${reduce ? "" : "lg:hidden"}`}>
        <StaticWork />
      </div>
      {!reduce && <Carousel />}
    </section>
  );
}
