"use client";

import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import FeaturedProject from "./FeaturedProject";
import Ticket from "./Ticket";
import ProjectPanel, { type Project } from "./ProjectPanel";
import SlideHands from "./SlideHands";
import { STEP_DURATION } from "@/lib/step-motion";

const PROJECTS: Project[] = [
  {
    title: "TITAN - REBRAND",
    meta: "SOLO,2025",
    color: "#14A44D",
    quote:
      "A conceptual rebrand of Titan, India’s iconic eyewear brand, reimagined for the athletic market.",
    tags: ["Branding", "UI/UX"],
    pieces: true,
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
              tags={project.tags}
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
