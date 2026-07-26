/**
 * Fumes — the little squares of smoke drifting up off the Contact campfire.
 *
 * Each fume is two nested spans so two independent loops can compose without
 * fighting over one `transform`:
 *
 *   .fume        rises, shrinks and fades (the life of one puff)
 *   .fume-square sways left↔right (the wave in the path)
 *
 * The sway runs on its own duration, so it doesn't divide evenly into the rise
 * and no two trips up trace the same curve. Because the sway sits *inside* the
 * shrinking element, the wave narrows as the puff dies out — the wobble calms
 * down as the square gets small, the way real smoke thins out.
 *
 * Geometry is in `em` against the font-size `.fumes` picks up in globals.css,
 * so every fume scales with the viewport alongside the campfire it comes off.
 * Motion lives in globals.css → FUMES.
 */

type Fume = {
  /** Where the puff leaves the fire, as a % of the wrapper's width. */
  x: number;
  /** Distance from the wrapper's bottom edge that it starts at, in em. */
  y: number;
  /** Square edge at full size, in em. */
  size: number;
  /** How far it climbs before it's gone, in em. */
  rise: number;
  /** One full climb, in seconds. */
  dur: number;
  /** Half-width of the sideways wave, in em. */
  sway: number;
  /** One half-wave (left→right), in seconds. Deliberately not a factor of `dur`. */
  swayDur: number;
  /** Negative, so the puff starts mid-flight instead of popping in at load. */
  delay: number;
};

// A small cluster leaving the flame tip. They vary on every axis so the plume
// never reads as a synced batch:
//   · x/y/size    — spread across the top of the fire, a mix of near + far puffs
//   · dur/swayDur — no two share a rise, and each swayDur stays coprime-ish to
//                   its rise so the wave crests at a different height each trip
//   · sway sign   — half start their wave leftward, half rightward
//   · delay (−ve) — every puff is already mid-climb at load, not launching in
//                   unison; the spread across ~0–5s is the stagger itself
const FUMES: Fume[] = [
  { x: 50, y: 4.6, size: 0.42, rise: 7.4, dur: 5.2, sway: 0.95, swayDur: 1.7, delay: 0 },
  { x: 44, y: 4.9, size: 0.34, rise: 8.0, dur: 6.1, sway: -1.1, swayDur: 2.1, delay: -2.4 },
  { x: 56, y: 4.4, size: 0.5, rise: 6.8, dur: 5.7, sway: 0.8, swayDur: 1.4, delay: -3.9 },
  { x: 47, y: 5.1, size: 0.3, rise: 8.6, dur: 6.6, sway: -1.25, swayDur: 2.4, delay: -1.3 },
  { x: 53, y: 4.7, size: 0.46, rise: 7.1, dur: 5.0, sway: 0.9, swayDur: 1.9, delay: -4.6 },
  { x: 41, y: 4.5, size: 0.38, rise: 7.8, dur: 6.3, sway: -1.0, swayDur: 1.6, delay: -0.7 },
];

export default function Fumes({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div aria-hidden className={`fumes ${className}`} style={style}>
      {FUMES.map((f, i) => (
        <span
          key={i}
          className="fume"
          style={
            {
              left: `${f.x}%`,
              "--fume-y": `${f.y}em`,
              "--fume-size": `${f.size}em`,
              "--fume-rise": `${f.rise}em`,
              "--fume-sway": `${f.sway}em`,
              animationDuration: `${f.dur}s`,
              animationDelay: `${f.delay}s`,
            } as React.CSSProperties
          }
        >
          <span
            className="fume-square"
            style={{
              animationDuration: `${f.swayDur}s`,
              animationDelay: `${f.delay}s`,
            }}
          />
        </span>
      ))}
    </div>
  );
}
