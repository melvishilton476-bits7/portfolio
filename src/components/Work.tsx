"use client";

import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import Placeholder from "./Placeholder";
import Ticket from "./Ticket";
import ProjectPanel, { STEP_TRANSITION, type Project } from "./ProjectPanel";

const PROJECTS: Project[] = [
  {
    title: "TITAN - REBRAND",
    meta: "SOLO,2025",
    color: "#14A44D",
    quote:
      "A conceptual rebrand of Titan, India’s iconic eyewear brand, reimagined for the athletic market.",
    pieces: true,
  },
  {
    title: "TITAN - REBRAND",
    meta: "SOLO,2025",
    color: "#A9C4F5",
    darkText: true,
    quote:
      "A conceptual rebrand of Titan, India’s iconic eyewear brand, reimagined for the athletic market.",
  },
  {
    title: "TITAN - REBRAND",
    meta: "SOLO,2025",
    color: "#F81B0E",
    quote:
      "A conceptual rebrand of Titan, India’s iconic eyewear brand, reimagined for the athletic market.",
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
      <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="mx-auto flex w-full max-w-[494px] flex-col gap-12">
          {PROJECTS.map((_, i) => (
            <Placeholder
              key={i}
              label="Featured project"
              ratio={493 / 256}
              variant={i % 2 === 0 ? "dark" : "neutral"}
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-12">
          {PROJECTS.map((project, i) => (
            <div key={i} className="flex w-full flex-col items-center gap-4">
              <Ticket {...project} />
              <blockquote className="type-label max-w-[326px] text-center font-normal leading-snug text-ink">
                &ldquo;{project.quote}&rdquo;
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/** Scroll distance given to each project, in viewport heights. Scroll no
    longer drives the animation directly (see below), so this only needs to
    be enough to feel like a deliberate "hold" before the next trigger. */
const VH_PER_PROJECT = 130;

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
    easing (STEP_TRANSITION), independent of scroll speed. While a step is
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
    window.setTimeout(settle, STEP_TRANSITION.duration * 1000);
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
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-12 overflow-hidden">
        <Heading />
        <div className="relative h-[28rem]">
          {PROJECTS.map((project, i) => (
            <ProjectPanel key={i} project={project} index={i} step={step} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Work() {
  const reduce = useReducedMotion();

  return (
    <section id="work" className="page-container py-24 sm:py-32">
      <div className={reduce ? "" : "lg:hidden"}>
        <StaticWork />
      </div>
      {!reduce && <Carousel />}
    </section>
  );
}
