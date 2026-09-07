import type { CSSProperties, ReactNode } from "react";
import DashRule from "./DashRule";
import HatchCell from "./HatchCell";

const PURPLE = "#8581ff";
const AMBER = "#ffae00";

/**
 * The site's section opener: a heading centred between two full-bleed dashed
 * rules, bracketed by periwinkle hatch cells, with the small amber chip sitting
 * on the top rule out in the left margin.
 *
 * The vocabulary is not new — it is what opens Contact ("Come have a seat!")
 * and the About page, lifted here as a component because the Playground page
 * needs it twice. AboutIntro still carries its own copy, which also draws two
 * stepped periwinkle clusters this one does not; folding that in is a tidy-up
 * for another day, not something to do on the way past.
 *
 * `cell` is the distance from the centre line out to the inner edge of each
 * hatch cell. It is a constant per band rather than something measured off the
 * heading, because the heading is fluid: anything derived from its width would
 * have the brackets creeping in and out as the viewport changes. Set it once,
 * about 100px clear of the title at desktop.
 */
export default function TitleBand({
  children,
  cell = 313,
  className = "",
}: {
  children: ReactNode;
  /** Half-distance from centre to the inner edge of the hatch cells, in px. */
  cell?: number;
  className?: string;
}) {
  const chip = (style: CSSProperties, cls: string) => (
    <span aria-hidden className={`absolute ${cls}`} style={style} />
  );
  return (
    <div className={`page-container relative ${className}`}>
      {/* The one warm accent on the page, used the way the hero uses it: once,
          small, and off to the side where it marks the rule rather than
          competing with the title. */}
      <span aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        {chip(
          { left: 30, top: -28, width: 37, height: 28, border: `1px solid ${PURPLE}` },
          "accent-flicker-b",
        )}
        {chip({ left: 36, top: -21, width: 26, height: 14, background: AMBER }, "accent-flicker-a")}
      </span>

      <div className="relative flex items-center justify-center py-4">
        <DashRule edge="top" />
        <DashRule edge="bottom" />
        {/* Hard against the title rather than out at the page edge: the heading
            is centred, so cells parked in the gutters read as two unrelated
            marks at the far sides of the screen. Hidden below lg, where the
            heading wraps and there is no room beside it. */}
        <HatchCell
          className="absolute inset-y-0 hidden w-[48px] lg:block"
          style={{ right: `calc(50% + ${cell}px)` }}
          delay={0}
        />
        {children}
        <HatchCell
          className="absolute inset-y-0 hidden w-[48px] lg:block"
          style={{ left: `calc(50% + ${cell}px)` }}
          delay={120}
        />
      </div>
    </div>
  );
}
