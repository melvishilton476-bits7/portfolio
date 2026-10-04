"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import CaseVideo from "./CaseVideo";

/**
 * The four artifacts as a strip of large cards that runs off the page's right
 * edge (Figma 873:1937, "What we made").
 *
 * Each card is a picture over its words, ruled with dashed hairlines on all
 * four sides and between picture and words, with a dot on each corner, with a 14px gutter between neighbours. At 1280 a
 * card is 508px wide, so two and a bit fit, and the third is cut by the
 * screen's edge to say there is more.
 *
 * On desktop the first card starts on the heading's left edge: the strip is
 * indented exactly as the page container's text is (the page gutter, or
 * half the leftover width once the screen is wider than the column). The strip pins while the reader scrolls down, and that vertical
 * scroll slides it left until the last card's right edge meets the screen's.
 * A sideways scroll that a mouse wheel can't drive would leave half the cards
 * unseen. Below lg it is a plain swipeable row that snaps to each card.
 *
 * The pictures rise in from the bottom, one after another, the first time
 * the strip is reached.
 */

type Artifact = {
  title: string;
  body: string;
  media:
    | { kind: "image"; src: string; alt: string }
    | { kind: "video"; src: string; label: string };
};

const ARTIFACTS: readonly Artifact[] = [
  {
    title: "01 — Students freeze the skit themselves",
    body: "Two of us act out a scene; the class claps to freeze it the instant they spot bullying. They caught it fast, which confirmed that sensing bullying was not where they were stuck. The rest of the workshop could spend its time on the two parts that were: the weight of it, and the response.",
    media: {
      kind: "image",
      src: "/case/draw-the-line/skit.webp",
      alt: "Two facilitators acting the Spot the Bullying skit at the front of the classroom, the class watching from their desks",
    },
  },
  {
    title: "02 — The theory, right after the skit",
    body: "Five minutes: what bullying is, its types, why people do it, what to do. We didn’t front-load it. It came straight after the skit, once they’d caught it live, so it named something they’d just felt rather than introducing it cold. The only passive part of the two days.",
    media: {
      kind: "video",
      src: "/case/draw-the-line/video/explainer.mp4",
      label: "The five-minute animated explainer: what bullying is, its types, why people do it and what to do",
    },
  },
  {
    title: "03 — The bystander game",
    body: "The Day 2 centrepiece: rearrange a set of word cards into a spoken response, ring a bell, act it out. Deliberately scaffolded, not open-ended.",
    // 1:18–1:37 of the documentation film, cut to a muted loop.
    media: {
      kind: "video",
      src: "/case/draw-the-line/video/bystander-game-cut.mp4",
      label: "Students leaning over a desk, arranging word cards into a sentence during the bystander game",
    },
  },
  {
    title: "04 — Situations drawn as comic panels",
    body: "Twelve panels, twelve written responses, split across the class and paired at the front.",
    // 1:38–1:45 of the documentation film, cut to a muted loop.
    media: {
      kind: "video",
      src: "/case/draw-the-line/video/scenario-cards-cut.mp4",
      label: "A student holding a scenario card drawn as a comic panel, two students speaking about a third",
    },
  },
];

/** 508 × 347 in the redraw. */
const RATIO = 508 / 347;
/** Card width on desktop is 39.7vw: 508 of 1280. */
const GAP = 14;

const DASH = "rgba(23,23,23,0.16)";
const DASH_V = `repeating-linear-gradient(to bottom, ${DASH} 0 10px, transparent 10px 18px)`;
const DASH_H = `repeating-linear-gradient(to right, ${DASH} 0 10px, transparent 10px 18px)`;

function Media({ a }: { a: Artifact }) {
  return a.media.kind === "video" ? (
    <CaseVideo src={a.media.src} label={a.media.label} />
  ) : (
    <Image src={a.media.src} alt={a.media.alt} fill sizes="(min-width: 1024px) 40vw, 82vw" className="object-cover" />
  );
}

function Card({ a, shown, delay }: { a: Artifact; shown: boolean; delay: number }) {
  const [num, title] = a.title.split(" — ");
  return (
    <li className="relative flex w-[82vw] shrink-0 snap-start scroll-ml-5 flex-col sm:w-[60vw] lg:w-[39.7vw]">
      {/* The card's rules: dashed down both sides and along the foot. */}
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-px" style={{ backgroundImage: DASH_V }} />
      <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-px" style={{ backgroundImage: DASH_V }} />
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px" style={{ backgroundImage: DASH_H }} />
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px" style={{ backgroundImage: DASH_H }} />
      {/* A dot on each corner, centred on the rules' crossing. */}
      {["left-0 top-0", "right-0 top-0", "left-0 bottom-0", "right-0 bottom-0"].map((c) => (
        <span
          key={c}
          aria-hidden
          className={`pointer-events-none absolute z-20 size-[7px] rounded-full bg-[#171717] ${c} ${
            c.includes("left") ? "-translate-x-1/2" : "translate-x-1/2"
          } ${c.includes("top") ? "-translate-y-1/2" : "translate-y-1/2"}`}
        />
      ))}

      <div className="relative w-full overflow-hidden bg-[#d9d9d9]" style={{ aspectRatio: String(RATIO) }}>
        <div
          className="absolute inset-0 transition-[clip-path] duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
          style={{ clipPath: shown ? "inset(0 0 0 0)" : "inset(100% 0 0 0)", transitionDelay: `${delay}ms` }}
        >
          <Media a={a} />
        </div>
        <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px" style={{ backgroundImage: DASH_H }} />
      </div>
      <div className="flex flex-1 flex-col px-6 pb-9 pt-6 sm:px-8 sm:pt-7">
        <div className="flex items-center gap-2">
          <span aria-hidden className="size-[7px] border border-ink" />
          <span className="type-caption font-medium tabular-nums text-[#737373]">{num}</span>
        </div>
        <h3 className="font-display text-ink mt-4 text-balance text-[1.25rem] font-medium leading-[1.3]">{title}</h3>
        <p className="font-display mt-2 max-w-[440px] text-pretty text-[0.9375rem] font-light leading-[1.6] text-[#5a5a5a]">
          {a.body}
        </p>
      </div>
    </li>
  );
}

export default function ArtifactScroll() {
  const runway = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  // How far the strip must travel for its last card to meet the right edge.
  const [travel, setTravel] = useState(0);
  // The empty screen above and below the pinned strip, which is centred in a
  // full-height frame. The runway is pulled up and the content after it
  // pulled in by this much, so the strip doesn't arrive with a screen-half
  // of blank paper between it and the heading.
  const [lead, setLead] = useState(0);
  const [x, setX] = useState(0);
  const [shown, setShown] = useState(false);

  // Measure the overhang whenever the strip or the screen changes size.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      setTravel(Math.max(0, el.scrollWidth - document.documentElement.clientWidth));
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      setLead(desktop ? Math.max(0, (window.innerHeight - el.offsetHeight) / 2) : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Desktop: vertical scroll through the runway slides the strip left.
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const el = runway.current;
      if (!el || !window.matchMedia("(min-width: 1024px)").matches) {
        setX(0);
        return;
      }
      const span = el.offsetHeight - window.innerHeight;
      const p = span > 0 ? Math.min(Math.max(-el.getBoundingClientRect().top / span, 0), 1) : 0;
      setX(-p * travel);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [travel]);

  // The pictures rise in one after another the first time the strip is
  // reached. Keyed to the strip, not to each card: a card that only ever
  // slid in sideways, or was half hidden by the screen's edge, never crossed
  // a per-card threshold and stayed blank.
  useEffect(() => {
    const el = runway.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={runway}
      className="pointer-events-none relative w-full lg:h-[calc(100vh+var(--travel))]"
      style={{ ["--travel" as string]: `${travel}px`, marginTop: -lead, marginBottom: -lead }}
    >
      {/* The frame's blank top and bottom overlap the content around it, so
          it lets pointer events through; only the strip takes them. */}
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:overflow-hidden">
        <ol
          ref={track}
          aria-label="The four artifacts"
          className="pointer-events-auto flex snap-x snap-mandatory overflow-x-auto px-5 py-[4px] [scrollbar-width:none] lg:snap-none lg:overflow-visible lg:pl-[calc((100%-min(100%,1280px))/2+clamp(1.25rem,5vw,4rem))] lg:pr-0 [&::-webkit-scrollbar]:hidden"
          style={{ gap: GAP, transform: `translate3d(${x}px,0,0)` }}
        >
          {ARTIFACTS.map((a, i) => (
            <Card key={a.title} a={a} shown={shown} delay={i * 140} />
          ))}
        </ol>
      </div>
    </div>
  );
}
