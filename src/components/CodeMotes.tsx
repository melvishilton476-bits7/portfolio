/**
 * CodeMotes — scrambling code glyphs rising off the Contact campfire, drifting
 * up beside the smoke (Fumes.tsx). The "designer who can engineer" line, taken
 * literally: bits of code lifting off the flames.
 *
 * Each mote rides the *same* motion as a smoke puff — it reuses the `fume-rise`
 * and `fume-sway` keyframes and the same `--fume-*` vars — so it climbs, sways
 * in a wave, shrinks and fades exactly like the smoke. The only difference is
 * what's riding that motion: instead of a solid square it's a glyph window.
 *
 * The flip is pure CSS, no JS. Structure per mote:
 *
 *   .codemote        rise + fade + shrink   (fume-rise)
 *   .codemote-sway   the sideways wave      (fume-sway)
 *   .codemote-window a 1-cell-tall viewport, overflow clipped
 *   .codemote-strip  a tall column of every glyph, scrolled by `code-flip`
 *
 * `code-flip` is a `steps(G)` translateY over exactly G cells, so the strip
 * jumps one whole glyph per step — you never see it scroll, only the character
 * swap. Each mote rotates the glyph order and runs its own flip rate + offset,
 * so the plume never reads as a synced ticker. globals.css → CODEMOTES; the
 * whole thing hides under prefers-reduced-motion (a frozen glyph says nothing).
 */

/** The pool every strip is built from — digits mixed with code signs, order
 *  deliberately scrambled so a strip never reads as counting. */
const GLYPHS = ["7", "+", "4", "}", "9", "=", "1", "%", "3", "<", "8", ";", "2", "/"];
const G = GLYPHS.length;

/** base rotated left by n, so each mote shows a different scramble. */
function rotate<T>(arr: T[], n: number): T[] {
  const k = ((n % arr.length) + arr.length) % arr.length;
  return arr.slice(k).concat(arr.slice(0, k));
}

type CodeMote = {
  /** Emit point across the flame tip, % of the wrapper's width. */
  x: number;
  /** Start height above the wrapper's bottom, in em. */
  y: number;
  /** Glyph size, in em off the wrapper's font-size. */
  size: number;
  /** Climb distance before it's gone, in em. */
  rise: number;
  /** One full climb, in seconds. */
  dur: number;
  /** Half-width of the sideways wave, in em (sign flips which way it starts). */
  sway: number;
  /** One half-wave, in seconds — kept out of step with `dur`. */
  swayDur: number;
  /** Negative: puff starts mid-climb, not at load. */
  delay: number;
  /** One pass through all G glyphs, in seconds (the flip rate). */
  flipDur: number;
  /** Negative: strip starts mid-scramble, desyncing the flips. */
  flipDelay: number;
  /** How far the glyph order is rotated, so no two motes scramble alike. */
  rot: number;
};

const CODEMOTES: CodeMote[] = [
  { x: 52, y: 5.0, size: 0.72, rise: 8.2, dur: 6.4, sway: 1.0, swayDur: 2.0, delay: -1.1, flipDur: 1.7, flipDelay: 0, rot: 0 },
  { x: 46, y: 4.6, size: 0.6, rise: 7.6, dur: 5.6, sway: -1.15, swayDur: 1.6, delay: -3.3, flipDur: 2.1, flipDelay: -0.5, rot: 5 },
  { x: 57, y: 4.8, size: 0.66, rise: 8.9, dur: 6.9, sway: 0.85, swayDur: 2.3, delay: -0.4, flipDur: 1.5, flipDelay: -0.9, rot: 9 },
  { x: 49, y: 5.3, size: 0.56, rise: 8.0, dur: 6.0, sway: -1.05, swayDur: 1.85, delay: -4.4, flipDur: 1.9, flipDelay: -1.3, rot: 3 },
  { x: 54, y: 4.5, size: 0.7, rise: 7.3, dur: 5.3, sway: 0.95, swayDur: 2.15, delay: -2.6, flipDur: 1.65, flipDelay: -0.2, rot: 11 },
];

export default function CodeMotes({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div aria-hidden className={`codemotes ${className}`} style={style}>
      {CODEMOTES.map((m, i) => (
        <span
          key={i}
          className="codemote"
          style={
            {
              left: `${m.x}%`,
              "--fume-y": `${m.y}em`,
              "--fume-rise": `${m.rise}em`,
              animationDuration: `${m.dur}s`,
              animationDelay: `${m.delay}s`,
            } as React.CSSProperties
          }
        >
          <span
            className="codemote-sway"
            style={
              {
                "--fume-sway": `${m.sway}em`,
                animationDuration: `${m.swayDur}s`,
                animationDelay: `${m.delay}s`,
              } as React.CSSProperties
            }
          >
            <span className="codemote-window" style={{ fontSize: `${m.size}em` }}>
              <span
                className="codemote-strip"
                style={
                  {
                    "--code-count": G,
                    animationDuration: `${m.flipDur}s`,
                    animationTimingFunction: `steps(${G})`,
                    animationDelay: `${m.flipDelay}s`,
                  } as React.CSSProperties
                }
              >
                {rotate(GLYPHS, m.rot).map((g, j) => (
                  <span key={j} className="codemote-cell">
                    {g}
                  </span>
                ))}
              </span>
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}
