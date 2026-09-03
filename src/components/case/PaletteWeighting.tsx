"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The three sign palettes, each opening at equal thirds and settling into the
 * weighting it actually carries.
 *
 * The two states are the same layout with one number changed. Writing `x` for
 * the vertical split of the top row and `y` for the horizontal split between
 * top and bottom, every card is:
 *
 *   yellow = x·y     accent = (1−x)·y     base = 1−y
 *
 * The finished palette is x=0.5, y=0.5 → 25 / 25 / 50. Equal thirds needs
 * 1−y = 1/3, so y = 2/3 — and then yellow is x·2/3 = 1/3, which forces x = 0.5,
 * the value it already has. So the vertical divider never moves and nothing
 * cross-fades: the whole animation is the horizontal divider sliding down by a
 * sixth of the card's height, and `--top` is the only thing that changes.
 *
 * It runs once on arrival and holds the true weighting, deliberately: the
 * opening frame is a state this palette never actually has, and looping it
 * would leave a false reading on screen half the time.
 *
 * All three families move together rather than in sequence, so the eye reads
 * the yellow behaving identically across the set — which is the claim the copy
 * beside this figure makes.
 */

type Swatch = { hex: string; onDark?: boolean };
type Family = { function: string; yellow: Swatch; accent: Swatch; base: Swatch };

/** Shared across all three families — the constant the copy names. */
const YELLOW: Swatch = { hex: "FFD200" };

const FAMILIES: readonly Family[] = [
  {
    function: "Informational",
    yellow: YELLOW,
    accent: { hex: "A8A8A8" },
    base: { hex: "191919", onDark: true },
  },
  {
    function: "Warning",
    yellow: YELLOW,
    accent: { hex: "D37222" },
    base: { hex: "9B021E", onDark: true },
  },
  {
    function: "Direction",
    yellow: YELLOW,
    // White, against the artwork, which sets this label dark: #191919 on
    // #096453 measures 2.96:1, under the 4.5:1 floor. White reads 7.1:1. The
    // other two accents pass dark (D37222 6.2:1, A8A8A8 8.8:1) and keep it.
    accent: { hex: "096453", onDark: true },
    base: { hex: "082721", onDark: true },
  },
];

/** Clears the figure's own 520ms rise before the dividers move, so the two
 *  motions read as one arrival rather than competing. */
const START_DELAY = 560;

function Cell({
  hex,
  onDark,
  className = "",
  children,
}: Swatch & { className?: string; children?: React.ReactNode }) {
  return (
    <div className={`relative ${className}`} style={{ backgroundColor: `#${hex}` }}>
      <span
        className="absolute left-[8%] top-[6%] font-mono text-[clamp(0.5rem,1vw,0.6875rem)] font-medium tracking-[0.06em]"
        style={{ color: onDark ? "#ffffff" : "#191919" }}
      >
        #{hex}
      </span>
      {children}
    </div>
  );
}

export default function PaletteWeighting() {
  const ref = useRef<HTMLDivElement>(null);
  const [weighted, setWeighted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || weighted) return;

    let timer: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timer = setTimeout(() => setWeighted(true), START_DELAY);
      },
      { threshold: 0.35 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [weighted]);

  return (
    <div
      ref={ref}
      className={`absolute inset-0 flex gap-[2%] ${weighted ? "is-weighted" : ""}`}
    >
      {FAMILIES.map((family) => (
        <figure key={family.function} className="flex min-w-0 flex-1 flex-col">
          {/* The card. `--top` is the horizontal divider; globals.css moves it
              from equal thirds to the true weighting. */}
          <div className="palette-card flex min-h-0 flex-1 flex-col">
            <div className="palette-top flex">
              <Cell {...family.yellow} className="w-1/2" />
              <Cell {...family.accent} className="w-1/2" />
            </div>
            <Cell {...family.base} className="min-h-0 flex-1">
              {/* The function name is printed on the palette rather than
                  captioned above it — the same move the boards make, where the
                  label is part of the object and not a note about it. In the
                  shared yellow, which is the one colour every family holds in
                  common, so the labels read as one set: 12.1:1 on the charcoal,
                  6.0:1 on the red, 10.9:1 on the green. Diagonally opposite the
                  cell's own hex, so neither has to make room for the other. */}
              <span
                className="type-caption absolute bottom-[6%] left-[8%] uppercase tracking-[0.14em]"
                style={{ color: `#${YELLOW.hex}` }}
              >
                {family.function}
              </span>
            </Cell>
          </div>
        </figure>
      ))}
    </div>
  );
}
