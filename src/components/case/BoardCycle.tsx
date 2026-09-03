"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Placeholder from "../Placeholder";

/**
 * A set of boards cut through like shots in an edit, each against its own
 * backdrop plate.
 *
 * Hard cuts rather than crossfades, deliberately: a dissolve says "these are
 * variations of one board", and a cut says "separate installations in separate
 * places", which is what a sign family actually is. The backdrop changes on the
 * same frame as the board, so each cut reads as a new location rather than a
 * new sign on the same wall.
 *
 * Unlike <PaletteWeighting>, which fires once and holds because its opening
 * state is a reading of the palette that isn't true, this loops: three boards
 * are three boards and no frame here is a false claim. It runs only while on
 * screen — an edit playing to nobody in a background tab is just battery.
 *
 * The backdrops are supplied forest photography, held sharp. They are not
 * Nagarhole and are not presented as it: they place a sign in foliage so the
 * board can be judged the way it would be met, which is the same job the
 * installed-in-context figures further down the page do.
 *
 * Two figures on this page use it — the directional family and the species
 * family — so the mechanism lives here and each caller supplies only its own
 * artwork, fit and rhythm.
 */

/** One beat per board. Long enough to read the sign's name and its numbers,
 *  short enough that the set feels like one edit rather than separate images. */
export const DEFAULT_HOLD_MS = 1700;

export type CycleBoard = {
  name: string;
  /** Real artwork. Omit and the slot keeps its Placeholder. */
  src?: string;
  alt: string;
  /** The artwork's own width/height. Taken from the export rather than tidied
   *  to a round figure — the same rule that sized the evidence split and the
   *  Titan reference strip. Omit to fall back to the set's `ratio`. */
  ratio?: number;
};

export type CyclePlate = {
  src: string;
  alt: string;
};

type Props = {
  boards: readonly CycleBoard[];
  /** One backdrop per board, in step with it. */
  plates: readonly CyclePlate[];
  /** Spoken description of the whole figure — this is one image to a reader. */
  label: string;
  /**
   * Which axis the board is sized on. "height" when every board in the set
   * shares a ratio; "width" when they don't, because holding the width steady
   * lets differing proportions show as differing heights — the way prints of
   * different sizes hang on a wall — instead of popping wider and narrower.
   */
  fit?: "height" | "width";
  /** Fraction of the frame the board occupies on the `fit` axis. Small enough
   *  to sit clearly inside its surroundings, large enough to stay legible at
   *  this figure's 560px cap. */
  size?: string;
  /** Fallback ratio for boards that don't declare one. */
  ratio?: number;
  holdMs?: number;
  /** Rendered width the boards actually occupy, for `sizes`. */
  boardSizes?: string;
};

export default function BoardCycle({
  boards,
  plates,
  label,
  fit = "height",
  size = "66%",
  ratio,
  holdMs = DEFAULT_HOLD_MS,
  boardSizes = "(max-width: 560px) 70vw, 380px",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Honours the same setting every other animation on this site does. The
    // cut is the whole point here, so with motion reduced there is nothing to
    // slow down — it simply holds on the first board.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setInterval> | undefined;
    let stopped = false;

    // Every layer is mounted and eager, but "requested" is not "paintable" —
    // cutting to a frame the browser has not decoded yet shows white, which is
    // the one thing a hard cut cannot survive. So the first cut waits for the
    // whole set, with a ceiling so a stalled image can't freeze the figure on
    // its opening frame forever.
    const ready = Promise.race([
      Promise.all(
        [...el.querySelectorAll("img")].map((img) => img.decode().catch(() => undefined)),
      ),
      new Promise((res) => setTimeout(res, 3000)),
    ]);

    const start = () => {
      if (stopped || timer) return;
      timer = setInterval(() => setI((n) => (n + 1) % boards.length), holdMs);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void ready.then(start);
        } else {
          clearInterval(timer);
          timer = undefined;
        }
      },
      { threshold: 0.35 },
    );

    io.observe(el);
    return () => {
      stopped = true;
      io.disconnect();
      clearInterval(timer);
    };
  }, [boards.length, holdMs]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden" role="img" aria-label={label}>
      {/* Every layer stays mounted and only its opacity flips, with no
          transition — that is what makes the change a cut. Mounting on demand
          would show a blank frame while the next image decoded, and `lazy`
          does the same thing more quietly: the off-frame layers are never on
          screen, so the browser is in no hurry to fetch them. Hence eager
          here, plus the decode gate in the effect. */}
      {plates.map((plate, n) => (
        <div key={`${plate.src}-${n}`} className="absolute inset-0 overflow-hidden" style={{ opacity: n === i ? 1 : 0 }}>
          <Image
            src={plate.src}
            alt={plate.alt}
            fill
            loading="eager"
            sizes="(max-width: 560px) 100vw, 560px"
            className="object-cover grayscale"
          />
          {/* Not a blur — a corner falloff. A flat graphic dropped onto sharp
              photography reads as pasted on; darkening the edges gives the
              board somewhere to sit and holds plates shot in different light
              to one exposure. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 78% 78% at 50% 44%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.5) 100%)",
            }}
          />
        </div>
      ))}

      {boards.map((board, n) => (
        <div
          key={board.name}
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_18px_44px_rgba(0,0,0,0.5)]"
          style={{
            height: fit === "height" ? size : undefined,
            width: fit === "width" ? size : undefined,
            aspectRatio: String(board.ratio ?? ratio),
            opacity: n === i ? 1 : 0,
          }}
        >
          {board.src ? (
            <Image
              src={board.src}
              alt={board.alt}
              fill
              loading="eager"
              sizes={boardSizes}
              className="object-contain"
            />
          ) : (
            <Placeholder
              label={board.name}
              className="h-full w-full"
              style={{ aspectRatio: "auto", height: "100%" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
