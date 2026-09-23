"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import GrowOnView from "../GrowOnView";
import CropMarks from "./CropMarks";
import { Framed } from "./Figure";

/**
 * The three Day 1–2 artifacts in one frame, cycling.
 *
 * They were three stacked <Figure>s: skit, scenario cards, bystander game. Each
 * makes the same kind of point — here is an activity, here is what it did — so
 * three full-measure frames in a column made the reader scroll through one
 * argument three times. One frame that turns says "three of these" in the space
 * of one, and the page keeps moving.
 *
 * MASK REVEAL rather than a cross-fade: the incoming photograph is wiped in
 * from the left under a clip-path while the outgoing one stays put beneath it.
 * A fade dissolves two rooms into a third, muddled one for half a second; a
 * wipe keeps both images whole and reads as a card being drawn over another.
 *
 * The caption turns on the same tick, because the heading is a claim ABOUT the
 * picture — "students stop the skit themselves" under a photograph of word
 * cards is simply wrong, not just mismatched. It cross-fades rather than
 * wiping, since text under a moving edge is unreadable.
 */

type Artifact = {
  src: string;
  alt: string;
  /** The claim the photograph is evidence for. */
  heading: string;
  caption: string;
};

const ARTIFACTS: readonly Artifact[] = [
  {
    src: "/case/draw-the-line/skit.webp",
    alt: "Two facilitators acting the Spot the Bullying skit at the front of the classroom, the class watching from their desks",
    heading: "Students stop the skit themselves, which proves they already know",
    caption:
      "Two of us act a scene; the class claps to freeze it the instant they spot bullying. They caught it instantly: recognition was never the gap.",
  },
  {
    src: "/case/draw-the-line/scenario-cards.webp",
    alt: "A student holding a scenario card drawn as a comic panel, two students speaking about a third",
    heading: "Situations drawn as comic panels, matched to responses across the room",
    caption:
      "Twelve panels, twelve written responses, split across the class and paired at the front.",
  },
  {
    src: "/case/draw-the-line/bystander-game.webp",
    alt: "Students leaning over a desk, arranging word cards into a sentence during the bystander game",
    heading: "The bystander game makes students say the sentence out loud before they own it",
    caption:
      "The Day 2 centrepiece: unscramble word cards into a response, ring a bell, act it out. Full design below.",
  },
];

/** Long enough to read the caption under it, which is the slowest thing in the
 *  frame. The wipe itself is a fraction of this. */
const PERIOD_MS = 5200;

export default function ArtifactCycle() {
  const [i, setI] = useState(0);
  // What was showing before, kept mounted underneath so the incoming wipe has
  // something to reveal ONTO rather than uncovering the page's paper.
  const prev = useRef(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(q.matches);
    const on = () => setReduced(q.matches);
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setI((n) => {
        prev.current = n;
        return (n + 1) % ARTIFACTS.length;
      });
    }, PERIOD_MS);
    return () => clearInterval(id);
  }, []);

  const current = ARTIFACTS[i];
  const under = ARTIFACTS[prev.current];

  return (
    <figure className="mx-auto w-full" style={{ maxWidth: 880 }}>
      <GrowOnView className="case-figure relative block">
        <Framed>
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
            {/* The outgoing frame. Not keyed: it should NOT re-enter, it is
                just the floor the wipe lands on. */}
            <Image
              src={under.src}
              alt=""
              aria-hidden
              fill
              sizes="(max-width: 880px) 100vw, 880px"
              className="object-cover"
            />
            {/* The incoming one. Keyed on the index so React mounts a fresh
                element each turn and the animation actually restarts — the
                same element with a new src would keep its finished state. */}
            <Image
              key={i}
              src={current.src}
              alt={current.alt}
              fill
              priority={i === 0}
              sizes="(max-width: 880px) 100vw, 880px"
              className={`object-cover${reduced ? "" : " dtl-wipe"}`}
            />
          </div>
        </Framed>
        <CropMarks />
      </GrowOnView>

      {/* Fixed-height bed for the three captions: they are different lengths,
          and letting the block resize on each turn made the whole page below
          jump every five seconds. */}
      <figcaption className="relative mt-4 min-h-[92px] sm:min-h-[76px]">
        <div key={i} className={reduced ? "" : "dtl-cap"}>
          <h3
            className="type-caption mx-auto max-w-[560px] text-center leading-relaxed"
            style={{ color: "var(--color-ink)" }}
          >
            {current.heading}
          </h3>
          <p className="type-caption text-ink-muted mx-auto mt-4 max-w-[560px] text-center leading-relaxed">
            {current.caption}
          </p>
        </div>
      </figcaption>

      {/* Which of the three, and how far through. Three rules rather than dots
          — the page already spends its dots on registration marks, and a
          second kind of dot two inches away would read as one of those. */}
      <div aria-hidden className="mt-5 flex justify-center gap-2">
        {ARTIFACTS.map((a, n) => (
          <span
            key={a.src}
            className="h-px w-8 transition-colors duration-500"
            style={{ background: n === i ? "var(--color-ink)" : "var(--color-ink-muted)" }}
          />
        ))}
      </div>
    </figure>
  );
}
