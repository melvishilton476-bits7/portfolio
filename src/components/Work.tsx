"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import FeaturedProject from "./FeaturedProject";
import Ticket from "./Ticket";
import ProjectPanel, { type Project } from "./ProjectPanel";
import SlideHands from "./SlideHands";
import Asterisk from "./Asterisk";
import HatchCell from "./HatchCell";
import { stepDuration } from "@/lib/step-motion";

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
  // Unique, document-scoped id for this instance's boil filter.
  const boilId = `ast-boil-${useId().replace(/:/g, "")}`;

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
      <Asterisk color={color} outline boilId={boilId} className="h-auto w-full" />
    </motion.div>
  );
}

const PROJECTS: Project[] = [
  {
    title: "TITAN - REBRAND",
    meta: "SOLO,2025",
    color: "#171717",
    quote:
      "A conceptual rebrand of Titan, India’s iconic eyewear brand, reimagined for the athletic market.",
    tags: ["Branding", "UI/UX"],
    href: "/work/titan-rebrand",
    // The case study's own opener: hero-bg cropped to 16:9 with the lockup
    // composited at the artboard fraction, so the card shows exactly what the
    // project opens with rather than a second, different picture.
    thumb: "/case/titan/thumb.webp",
    // The ticket's letterbox strip is a far tighter band than the card, and at
    // centre it cut the bull in half. 35% lifts the window onto the mark and
    // the ember lens; the card, whose art is nearly its own shape, barely
    // moves.
    thumbPosition: "center 35%",
    thumbAlt:
      "A figure in goggles catching an ember reflection, the TITAN lockup across it.",
  },
  {
    // "NAGARHOLE - WAYFINDING" wrapped to two lines in the 172px the ticket
    // body leaves for a title, which pushed the whole card out of step with
    // Titan's. Measured against the real font: this holds one line, the
    // hyphenated form does not.
    title: "NAGARHOLE SIGNS",
    meta: "SOLO,2026",
    color: "#171717",
    quote:
      "A signage system built to disappear into Nagarhole National Park — except where disappearing would be dangerous.",
    tags: ["Signage", "Systems"],
    href: "/work/nagarhole-wayfinding",
    thumb: "/case/nagarhole/hero-leopard.webp",
    // Portrait art in a landscape slot. The hero's own 33% centres the
    // wordmark, which on the ticket's narrow band left no room for anything
    // else — the strip read as type on grass. 43% drops below the lettering
    // onto the leopard at the waterline, and the card keeps both.
    thumbPosition: "center 43%",
    thumbAlt:
      "A black leopard at the waterline, with the Nagarhole wordmark.",
  },
  {
    title: "ZENXO - BUILDER",
    meta: "TEAM,2026",
    color: "#171717",
    quote:
      "A canvas could show what a form never could. Keeping the form next to it is the reason traders actually learned it.",
    tags: ["Product", "Interaction"],
    href: "/work/zenxo-strategy-builder",
    // The case study's own opener, flattened: CaseHero stacks hero-ground and
    // hero-scene (the scene is edge-to-edge and top-registered, and its
    // surplus height bleeds off the bottom of the 17:10 frame), so the thumb
    // is those two composited in that order and cropped to the card's 16:9.
    // Same rule as Titan's — the card shows what the project opens with
    // rather than a second, different picture.
    thumb: "/case/zenxo/thumb.webp",
    // Art nearly the card's own shape already, and the subject sits high in
    // it, so the default centre would drift down onto the desk.
    thumbPosition: "center 38%",
    thumbAlt:
      "Two traders at a monitor showing the Zenxo results page.",
  },
];

// Blueprint band that brackets the title — the same treatment as the hero
// headline (two dashed rules, a hatched intersection cell at each end, black
// corner dots). It lives inside the centred h2, so the full-bleed rules resolve
// off the title's centre (= viewport centre) and the cells land on the hero's
// vertical grid lines (±406 / ±366px from centre). Desktop only. The hatched
// cells are drawn by the shared <HatchCell> (which owns its own hatch fill).
const SIGHTS_DASH = `repeating-linear-gradient(to right, rgba(23,23,23,0.16) 0px, rgba(23,23,23,0.16) 10px, transparent 10px, transparent 18px)`;

function SightsBand() {
  // A fixed 60px band (matching the hero's rule gap), centred on the title so
  // the text sits between the rules with equal space above and below.
  const TOP = "calc(50% - 30px)";
  const L = "calc(50% - 406px)"; // left cell (aligns with the hero's left pair)
  const R = "calc(50% + 366px)"; // right cell (aligns with the hero's right pair)
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden lg:block">
      {/* two full-bleed dashed rules bracketing the caps — their dashes march
          rightward forever (sights-rule), same seamless loop as the hero rules */}
      <span className="sights-rule absolute h-px w-screen" style={{ left: "calc(50% - 50vw)", top: TOP, backgroundImage: SIGHTS_DASH }} />
      <span className="sights-rule absolute h-px w-screen" style={{ left: "calc(50% - 50vw)", top: "calc(50% + 30px)", backgroundImage: SIGHTS_DASH }} />
      {/* periwinkle "blue band", upper-left — it sweeps (right edge eases in to
          the left and back, then the left edge in to the right and back), same
          heavy ease-in-out clip-path loop as the hero bars. */}
      <span className="accent-bar-sweep absolute" style={{ left: "calc(50% - 543px)", top: "calc(50% - 45px)", width: 81, height: 13, background: "linear-gradient(to right, #c8c6ff, #8581ff)", ["--enter" as string]: "0.6s", ["--loop-dur" as string]: "4.5s" } as CSSProperties} />
      {/* amber box with an overlapping periwinkle outline, lower-right — each
          flickers-and-settles on its own sparse loop (like the hero scatter). */}
      <span className="accent-flicker-b absolute" style={{ left: "calc(50% + 500px)", top: "calc(50% + 33px)", width: 37, height: 24, background: "#ffae00", ["--enter" as string]: "0.8s" } as CSSProperties} />
      <span className="accent-flicker-a absolute" style={{ left: "calc(50% + 527px)", top: "calc(50% + 49px)", width: 22, height: 22, border: "1px solid #8581ff", ["--enter" as string]: "1s" } as CSSProperties} />
      {/* hatched "boxes" at each end of the band — the animated HatchCell (dots
          pop, box wipes open L→R, hatch lines wipe in) when scrolled into view,
          staggered left→right. Each brings its own corner dots. */}
      <HatchCell className="absolute" style={{ left: L, top: TOP, height: 60, width: 47 }} delay={0} />
      <HatchCell className="absolute" style={{ left: R, top: TOP, height: 60, width: 47 }} delay={120} />
    </span>
  );
}

function Heading() {
  return (
    <header className="text-center">
      <h2 className="type-heading text-ink-alt relative inline-block">
        <SightsBand />
        <span className="relative">
          SIGHTS to <span className="font-mono">SEE</span>
        </span>
      </h2>
      <div className="mt-8">
        <div className="relative inline-block">
          {/* Crop-mark frame hugging the subtitle: a small thin light-grey
              L-bracket at each corner with a darker registration dot nestled
              in the crook of each bracket (a few px inside the vertex, not out
              at the tip). The dots are the accent — a shade darker than the
              brackets so they read as the marks the frame is pinned by. */}
          <span aria-hidden className="pointer-events-none absolute -left-[26px] -top-[18px] h-2 w-2 border-l border-t border-[#cfcfcf]" />
          <span aria-hidden className="pointer-events-none absolute -right-[26px] -top-[18px] h-2 w-2 border-r border-t border-[#cfcfcf]" />
          <span aria-hidden className="pointer-events-none absolute -bottom-[18px] -left-[26px] h-2 w-2 border-b border-l border-[#cfcfcf]" />
          <span aria-hidden className="pointer-events-none absolute -bottom-[18px] -right-[26px] h-2 w-2 border-b border-r border-[#cfcfcf]" />
          <span aria-hidden className="pointer-events-none absolute -left-[26px] -top-[18px] size-[3px] translate-x-[4px] translate-y-[4px] rounded-full bg-[#171717]" />
          <span aria-hidden className="pointer-events-none absolute -right-[26px] -top-[18px] size-[3px] -translate-x-[4px] translate-y-[4px] rounded-full bg-[#171717]" />
          <span aria-hidden className="pointer-events-none absolute -bottom-[18px] -left-[26px] size-[3px] translate-x-[4px] -translate-y-[4px] rounded-full bg-[#171717]" />
          <span aria-hidden className="pointer-events-none absolute -bottom-[18px] -right-[26px] size-[3px] -translate-x-[4px] -translate-y-[4px] rounded-full bg-[#171717]" />
          <p className="type-note text-ink-muted leading-none">
            <span className="text-ink-alt">Problems</span> walked into.{" "}
            <span className="text-ink-alt">Solutions</span> built out of.
          </p>
        </div>
      </div>
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
              thumb={project.thumb}
              thumbAlt={project.thumbAlt}
              flat
            />
            <Ticket {...project} />
          </div>
        ))}
      </div>
    </>
  );
}

/** Pagination timing (seconds). The switch reads as ONE continuous easing
    arc split across the two boxes: the outgoing marker starts slow and
    accelerates as it shrinks (ease-in), hits peak speed at the seam where the
    handoff happens, then the incoming marker decelerates as it extends
    (ease-out). SHRINK + RISE stays inside the card glide's ~1.3s so the
    indicator keeps the strip's pace. */
const SHRINK = 0.5;
const RISE = 0.65;

/** How much sideways wheel travel (px) a step costs. A trackpad flick emits a
    long tail of small deltas, so this is an accumulator rather than a per-event
    test: too low and one flick throws the strip three projects along, too high
    and the gesture feels dead. */
const WHEEL_PER_STEP = 90;

/** `lg` and up, motion allowed: the filmstrip carousel.
 *
 * SIDEWAYS, NOT DOWNWARDS. This used to be a pinned section: it reserved
 * several screens of vertical scroll, stuck to the top, and spent that
 * scroll advancing the strip. That put the page's scrollbar in charge of a
 * horizontal motion — the reader had to scroll DOWN to move a card SIDEWAYS,
 * and could not leave the section until they had paged through every project.
 *
 * Now the section is an ordinary block the page scrolls past, and the strip is
 * driven by the gestures that actually mean "sideways":
 *
 *   - a horizontal wheel / two-finger trackpad swipe over the section;
 *   - a click on either of the cards peeking in at the edges;
 *   - the pagination markers, which are real buttons;
 *   - the arrow keys, once anything in the section holds focus.
 *
 * `step` still advances one project at a time on ProjectPanel's own timed
 * easing, and `lockedRef` holds every input off until that gesture has
 * finished — the strip's stagger means a step is ~1.5s of motion, and a second
 * one fired into the middle of it would break the chain mid-pull. */
function Carousel() {
  const rootRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const lockedRef = useRef(false);
  /** Sideways wheel travel banked since the last step. */
  const wheelRef = useRef(0);

  const goTo = useCallback((next: number) => {
    const target = Math.max(0, Math.min(PROJECTS.length - 1, next));
    if (lockedRef.current || target === stepRef.current) return;
    lockedRef.current = true;
    stepRef.current = target;
    setStep(target);
    window.setTimeout(() => {
      lockedRef.current = false;
      wheelRef.current = 0;
    }, stepDuration(PROJECTS.length) * 1000);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // Vertical intent stays the page's. Only a gesture that is more sideways
      // than downwards belongs to the strip.
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      // Swallowed even while locked, and even at the ends of the strip: on a
      // trackpad this same gesture is the browser's back-swipe, and letting it
      // through would navigate away from the site mid-flick.
      e.preventDefault();
      if (lockedRef.current) return;

      wheelRef.current += e.deltaX;
      if (wheelRef.current > WHEEL_PER_STEP) goTo(stepRef.current + 1);
      else if (wheelRef.current < -WHEEL_PER_STEP) goTo(stepRef.current - 1);
    };

    // Not React's onWheel: React attaches wheel listeners passively at the
    // root, and a passive listener cannot preventDefault.
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [goTo]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(stepRef.current + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(stepRef.current - 1);
    }
  };

  return (
    <div ref={rootRef} className="relative hidden lg:block" onKeyDown={onKeyDown}>
      {/* Full viewport width, overflow clipped: the strip conveys across the
          whole screen and its neighbours have to run off the true edges, not
          vanish at the page-container gutter. */}
      <div className="flex h-screen flex-col overflow-hidden">
        {/* Heading holds the top, inside the normal gutter. */}
        <div className="page-container pt-16">
          <Heading />

          {/* Pagination: one marker per project, discrete — no fill. Inactive
              cards read as small light-grey squares; the centred card's marker
              morphs in place into a tall dark bar. As the strip steps, the old
              active shrinks back to a square while the new one grows, so only
              one bar is ever raised: the current card's.

              Each marker animates its own height / width / colour (the grey is
              ink at low alpha, so becoming active is just that same ink going
              opaque as it grows). Row is items-center, so the tall bar extends
              evenly above and below the squares.

              These are BUTTONS now, not decoration. When the section was
              scroll-driven the markers could be aria-hidden because the
              scrollbar was the navigation; with the pin gone they are the
              keyboard's way in, and the only visible control that names how
              many projects there are. The hit area is the button (11 x 22),
              not the 5px mark inside it — the pitch is unchanged because the
              button is exactly the old square plus the old gap. */}
          <div
            className="mt-8 flex h-[22px] items-center justify-center"
            role="group"
            aria-label="Choose a project"
          >
            {PROJECTS.map((project, i) => {
              const active = step === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={project.title}
                  aria-current={active ? "true" : undefined}
                  className="flex h-full w-[11px] cursor-pointer items-center justify-center"
                >
                  <motion.span
                    // Fixed 5px thickness for every marker, active or not —
                    // only the height (and colour) tells them apart.
                    className="block h-[5px] w-[5px] shrink-0"
                    initial={false}
                    animate={{
                      height: active ? 11 : 5,
                      backgroundColor: active
                        ? "rgb(23, 23, 23)"
                        : "rgba(23, 23, 23, 0.22)",
                    }}
                    // One continuous arc across both boxes: the outgoing marker
                    // shrinks on an ease-IN (easeInCubic — slow start building to
                    // top speed at the seam), then the incoming one, after
                    // waiting out SHRINK, rises on the mirrored ease-OUT
                    // (easeOutCubic — leaves the seam at top speed and slows as
                    // it extends). Mirror curves + equal 10px travel make the two
                    // halves meet at matching velocity, so it reads as a single
                    // fastest-in-the-middle motion, not two separate ones.
                    transition={
                      active
                        ? {
                            height: { delay: SHRINK, duration: RISE, ease: [0.33, 1, 0.68, 1] },
                            backgroundColor: { delay: SHRINK, duration: RISE, ease: [0.33, 1, 0.68, 1] },
                          }
                        : {
                            height: { duration: SHRINK, ease: [0.32, 0, 0.67, 0] },
                            backgroundColor: { duration: SHRINK, ease: [0.32, 0, 0.67, 0] },
                          }
                    }
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* The filmstrip stage fills the rest, full-bleed. Every slide is
            centred here and pushed sideways by its distance from `step`. */}
        <div className="relative flex-1">
          {/* Depth layer: the same asterisk, blurred and dimmed, sitting
              behind the strip so it reads as far back. Parked at the card's
              top-left corner, same height as before, just mirrored to the
              other side — hanging mostly below the edge (rendered before the
              slide, so the card paints over the sliver that dips behind it)
              with just a peek poking out past the corner. */}
          <FloatAsterisk
            color="var(--color-splat-red)"
            className="top-[calc(50%-245px)] left-[calc(50%-240px)] w-[44px] opacity-80 blur-[3px]"
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
            <ProjectPanel
              key={i}
              project={project}
              index={i}
              count={PROJECTS.length}
              step={step}
              onSelect={goTo}
            />
          ))}

          {/* Glass edges: a white gradient that dissolves the peeking
              neighbours into the frame, masked so it fades out toward the
              centre rather than sitting as a hard band.

              NO backdrop-filter here. These are two full-height strips sitting
              over the one part of the page that is always in motion, and a
              backdrop blur has to re-read and re-blur everything behind it on
              every single frame of the slide. Over a near-white ground the
              gradient alone is all but indistinguishable from the frosted
              version, and it costs nothing. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[14vw] bg-gradient-to-r from-background via-background/70 to-transparent [mask-image:linear-gradient(to_right,#000,transparent)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-[14vw] bg-gradient-to-l from-background via-background/70 to-transparent [mask-image:linear-gradient(to_left,#000,transparent)]"
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
      // aria-label (not aria-labelledby): this section renders its heading twice
      // — once for the static small-screen layout, once for the pinned carousel
      // — so pointing at a heading id would mean a duplicate id in the document.
      aria-label="Sights to See"
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
