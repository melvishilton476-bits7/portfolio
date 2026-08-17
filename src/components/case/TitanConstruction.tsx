import type { CSSProperties } from "react";
// Shared with TitanMark so the diagram and the finished mark can't drift apart
// — the whole point of this beat is that the second follows from the first.
import { MARK_PATHS } from "./TitanMark";

/**
 * The mark's construction diagram, animated as a derivation: the geometry is
 * drawn first, the points where that geometry meets the form register as it
 * passes, and only then does the mark itself resolve.
 *
 * Three facts about the source artwork drive the whole sequence, and all three
 * were measured rather than assumed:
 *
 *   1. The 16 construction lines are 8 MIRROR PAIRS about x = 473.95 — the
 *      artwork's own axis. Listing them in source order and pairing i with
 *      i+8 makes each pair draw simultaneously from opposite sides, so the
 *      construction unfolds symmetrically instead of in an arbitrary order.
 *
 *   2. The 38 node squares sit ON the lines — mean distance 0.17px, max 2.07.
 *      They are real intersections, so `nodeDelay` can solve for the exact
 *      moment a line's drawing head reaches each node rather than faking a
 *      stagger. Every crossing lands between t=0.38 and t=0.65 of its line.
 *
 *   3. The rects' `rotate(-180)` transforms in the export are identity
 *      (180° about each square's own centre, max deviation 0.012px), so they
 *      are dropped here — which frees `transform` to scale each node about
 *      its own centre for the pop.
 *
 * Every line and path carries `pathLength="1"`, which normalises dash maths to
 * a 0–1 range: no measured lengths, and a line's `t` parameter maps directly
 * onto a fraction of its draw time. Long lines simply travel faster, so the
 * whole set completes together.
 */

/**
 * [x1, y1, x2, y2] in source order — index i pairs with i+8 (see note 1).
 *
 * EXTENDED past the export's endpoints. The square crop shows only the
 * viewBox window x[240.65, 684.64] × y[0, 443.99], and eight of the source
 * lines terminated inside it — visibly stopping in mid-air below the mark
 * instead of running off the frame. Each line was pushed along its own
 * direction until it clears a box inset ~15px outside that window, and only
 * ever lengthened, never trimmed, so the lines that already ran off-frame
 * keep the exact reach they were drawn with.
 *
 * The extension box is centred on the artwork's mirror axis (473.95) rather
 * than the viewBox centre (462.65) — those differ by 11.3px, and using the
 * viewBox would have skewed each pair by that much. Measured after the fact:
 * every extended pair sits at 0.00 mirror deviation. The residual asymmetry
 * in the long horizontals (up to 22.6) is the artist's own and is untouched.
 */
const LINES: readonly (readonly [number, number, number, number])[] = [
  [449.9, -15, 488.54, 459],
  [410.62, -15, 510.07, 459],
  [46.06, 117.94, 806.58, 210.23],
  [18.02, 96.24, 810.96, 244.83],
  [312.18, -15, 530.87, 459],
  [16.26, 72.38, 812.95, 287.79],
  [819.06, 256.63, 0.02, 108.26],
  [259.63, -15, 595, 459],
  [498, -15, 459.36, 459],
  [537.28, -15, 437.83, 459],
  [892.13, 118.64, 151.03, 209.53],
  [916.86, 98.69, 149.97, 242.39],
  [635.72, -15, 417.03, 459],
  [916.29, 76.53, 150.31, 283.64],
  [151.45, 252.54, 925.28, 112.36],
  [688.27, -15, 352.92, 459],
];

/** Node centres, from the export's rects (transforms resolved — see note 3). */
const NODES: readonly (readonly [number, number])[] = [
  [393.925, 174.505], [387.175, 165.265], [385.375, 162.725], [387.545, 159.375],
  [392.915, 159.995], [402.535, 180.845], [420.405, 181.595], [407.345, 177.965],
  [398.605, 171.705], [397.115, 169.225], [398.605, 167.495], [433.915, 174.755],
  [453.715, 197.955], [472.295, 260.075], [470.185, 257.765], [463.955, 238.615],
  [475.455, 260.075], [448.715, 166.745], [465.755, 180.245], [420.405, 184.415],
  [554.095, 174.505], [560.845, 165.265], [562.645, 162.725], [560.475, 159.375],
  [555.105, 159.995], [545.485, 180.845], [527.615, 181.595], [540.675, 177.965],
  [549.415, 171.705], [550.905, 169.225], [549.415, 167.495], [514.105, 174.755],
  [494.305, 197.955], [477.835, 257.765], [484.055, 238.615], [499.305, 166.745],
  [482.265, 180.245], [527.615, 184.415],
];

const PAIRS = LINES.length / 2; // 8
const PAIR_STAGGER = 90; // ms between successive mirror pairs
const LINE_DRAW = 800; // ms for one line to draw end to end
const LINES_DONE = (PAIRS - 1) * PAIR_STAGGER + LINE_DRAW; // 1430ms
const MARK_DRAW_AT = LINES_DONE + 40;
const MARK_FILL_AT = MARK_DRAW_AT + 480;

/**
 * When does the drawing head of the nearest line arrive at this node?
 *
 * Projects the node onto every line, keeps the closest, and converts that
 * line's parameter t into a moment on the timeline. This is why the nodes
 * light in the wake of the lines rather than on a decorative stagger — the
 * timing IS the geometry.
 */
function nodeDelay([px, py]: readonly [number, number]): number {
  let bestDist = Infinity;
  let bestLine = 0;
  let bestT = 0;

  for (let i = 0; i < LINES.length; i++) {
    const [x1, y1, x2, y2] = LINES[i];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
    const dist = Math.hypot(x1 + t * dx - px, y1 + t * dy - py);
    if (dist < bestDist) {
      bestDist = dist;
      bestLine = i;
      bestT = t;
    }
  }

  // Mirror pairs share a start moment, so the delay keys off the pair, not the line.
  return (bestLine % PAIRS) * PAIR_STAGGER + bestT * LINE_DRAW;
}

export default function TitanConstruction() {
  return (
    <svg
      viewBox="0 0 925.3 443.99"
      // slice, not meet: the box is square and the art is 2.08:1, so this
      // fills the frame and lets the construction lines run off all four
      // edges rather than floating in letterbox bands.
      preserveAspectRatio="xMidYMid slice"
      className="block h-full w-full bg-black"
      aria-hidden
    >
      {LINES.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          className="tc-line"
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          pathLength="1"
          stroke="#fff"
          strokeWidth={0.22}
          style={{ ["--d" as string]: `${(i % PAIRS) * PAIR_STAGGER}ms` } as CSSProperties}
        />
      ))}

      {MARK_PATHS.map((d, i) => (
        <path
          key={i}
          className="tc-mark"
          d={d}
          pathLength="1"
          fill="#3a3a3a"
          stroke="#fff"
          strokeWidth={0.21}
          strokeMiterlimit={10}
          style={
            {
              ["--d" as string]: `${MARK_DRAW_AT}ms`,
              ["--fd" as string]: `${MARK_FILL_AT}ms`,
            } as CSSProperties
          }
        />
      ))}

      {/* Drawn last so the registration points sit above both the lines they
          came from and the form they define. */}
      {NODES.map(([cx, cy], i) => (
        <rect
          key={i}
          className="tc-node"
          x={cx - 0.745}
          y={cy - 0.745}
          width={1.49}
          height={1.49}
          fill="#fff"
          style={{ ["--d" as string]: `${nodeDelay([cx, cy]).toFixed(0)}ms` } as CSSProperties}
        />
      ))}
    </svg>
  );
}
