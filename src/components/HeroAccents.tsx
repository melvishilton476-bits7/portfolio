/**
 * HeroAccents — the "blueprint" decoration behind the hero, ported from the
 * Figma hero frame (node 364:4992). It has three layers:
 *
 *  1. A faint grid — four full-height vertical hairlines (a narrow pair on each
 *     side, framing the headline column) and two full-bleed horizontal rules
 *     bracketing the headline band.
 *  2. A scatter of periwinkle (#8581ff) squares/bars with two amber (#ffae00)
 *     ticks, mirrored across the two upper corners, plus a small "leader"
 *     group (square + external-link glyph + drop line + dot) right of the
 *     headline, and a tall bar far right.
 *  3. Four grey (#b6b6b6) L-shaped corner brackets framing the "Take a tour"
 *     CTA like crop marks.
 *
 * Every piece is placed by absolute px on a 1280×824 reference canvas (the exact
 * Figma hero size) so positions match the design 1:1. The canvas is centred in
 * the hero by CSS (.hero-accents-frame in globals.css); --accent-shift nudges it
 * vertically so the bracketing rules straddle the live headline. The CTA
 * brackets are re-placed (not at the raw Figma y) to frame the live button,
 * which sits a little lower than in Figma once the stack row is stacked above
 * it. The whole thing is decorative (aria-hidden, pointer-events:none,
 * z-index:-1) and hidden below lg where the side gutters collapse — see
 * globals.css → HERO ACCENTS.
 */
import type { CSSProperties } from "react";
import HatchCell from "./HatchCell";

const PURPLE = "#8581ff";
const AMBER = "#ffae00";
const BRACKET = "#b6b6b6";
const DIVIDER = "rgba(23, 23, 23, 0.08)";
const DASH = "rgba(23, 23, 23, 0.16)";

// Dashed hairline gradients: 10px dash, 8px gap. `to bottom` for verticals,
// `to right` for horizontals.
const DASH_V = `repeating-linear-gradient(to bottom, ${DASH} 0px, ${DASH} 10px, transparent 10px, transparent 18px)`;
const DASH_H = `repeating-linear-gradient(to right, ${DASH} 0px, ${DASH} 10px, transparent 10px, transparent 18px)`;

// Gradient images used as fixed-scale "window" fills: a shape shows the image
// through it, but because GRADIENT_SIZE is in absolute px (not tied to the
// element's box), resizing the shape reveals more/less of the image instead of
// stretching it. Position centres the vivid band in the window.
const GRADIENT_ORANGE = "url(/textures/orange-gradient.jpeg)";
const GRADIENT_BLUE = "url(/textures/blue-gradient.jpeg)";
const GRADIENT_SIZE = "46px auto";

/** Full-height dashed vertical grid line. Lives OUTSIDE the fixed 1280×824
 *  canvas (directly in .hero-accents) so it spans the whole hero section and
 *  bleeds past the top/bottom viewport edges regardless of screen height; the
 *  x position is mapped back onto the canvas via calc(50% − 640px + x). It draws
 *  in on load with .accent-vline — `from` sets the edge it grows out of ("top"
 *  for the left pair, "bottom" for the right pair). */
function VRule({ x, from }: { x: number; from: "top" | "bottom" }) {
  return (
    <span
      className="accent-vline absolute"
      style={{
        left: `calc(50% - 640px + ${x}px)`,
        top: 0,
        bottom: 0,
        width: 1,
        transformOrigin: from,
        backgroundImage: DASH_V,
        // Keep the dashes flowing the way the line drew: top pair downward,
        // bottom pair upward.
        ["--march" as string]: from === "top" ? "18px" : "-18px",
      } as CSSProperties}
    />
  );
}

/** One full-bleed horizontal rule at canvas-y `y`. It spans the whole viewport
 *  width (left:calc(640px − 50vw) puts its left end at the viewport's left edge
 *  out of the centred canvas, no transform needed) and on load draws in as a
 *  single sweep from the left edge across to the right (.accent-hline, origin
 *  left), then its dashes keep marching rightward. Both rules run in sync. */
function HRule({ y }: { y: number }) {
  return (
    <span
      className="accent-hline absolute"
      style={{
        left: "calc(640px - 50vw)",
        top: y,
        width: "calc(100vw + 24px)",
        height: 1,
        transformOrigin: "left",
        backgroundImage: DASH_H,
        ["--march" as string]: "18px",
      } as CSSProperties}
    />
  );
}

/** A filled bar that resizes in one dimension on a sparse loop (see
 *  accent-bar-* in globals.css). The element is sized BAR_EXT px wider than its
 *  resting look and clipped back to rest; `dir` picks which end extends ("r" =
 *  right, extra room added on the right; "l" = left). x/y/w/h are the RESTING
 *  box in canvas px. */
const BAR_EXT = 8;
function Bar({ x, y, w, h, dir, enter, loopDur }: { x: number; y: number; w: number; h: number; dir: "r" | "l"; enter: string; loopDur: string }) {
  const box =
    dir === "r"
      ? { left: x, width: w + BAR_EXT, clipPath: `inset(0 ${BAR_EXT}px 0 0)` }
      : { left: x - BAR_EXT, width: w + BAR_EXT, clipPath: `inset(0 0 0 ${BAR_EXT}px)` };
  return (
    <span
      className={`absolute accent-bar-${dir}`}
      style={{ top: y, height: h, background: PURPLE, ["--enter" as string]: enter, ["--loop-dur" as string]: loopDur, ...box } as CSSProperties}
    />
  );
}

/** Grey L-shaped crop mark. Base draws the bottom + right edges (a
 *  bottom-right corner); rotate to make the other three corners:
 *  0 = BR, 90 = BL, 180 = TL, 270 = TR. `x`/`y` is the mark's top-left. */
function Bracket({ x, y, rotate }: { x: number; y: number; rotate: number }) {
  return (
    <span
      className="absolute"
      style={{
        left: x,
        top: y,
        width: 20,
        height: 20,
        borderBottom: `1px solid ${BRACKET}`,
        borderRight: `1px solid ${BRACKET}`,
        transform: `rotate(${rotate}deg)`,
      }}
    />
  );
}

export default function HeroAccents() {
  return (
    <div aria-hidden className="hero-accents">
      {/* ---- Grid: four full-height verticals (a pair each side) ------------
          Kept OUTSIDE the fixed canvas so they span the whole section and bleed
          off the top/bottom edges. The inner line of each pair sits just 2px off
          the headline (left of the "A", right of the ENGINEER box); the outer
          line is 47px beyond. On load the left pair draws down from the top, the
          right pair up from the bottom. */}
      <VRule x={234} from="top" />
      <VRule x={281} from="top" />
      <VRule x={1006} from="bottom" />
      <VRule x={1053} from="bottom" />

      <div className="hero-accents-frame">
        {/* ---- Two full-bleed dashed rules on the blue selector-box band ---
            The gap between them equals the DESIGNER highlight / ENGINEER box
            height: the TOP rule sits on the box top (the greeting clears it just
            above), the BOTTOM rule on the box bottom. Each converges from both
            side edges on load. Their `y` tracks the headline via the frame
            shift. */}
        <HRule y={365} />
        <HRule y={425} />

        {/* Intersection cells at each end of the band — left cell spans the left
            grid pair (234→281), right cell the right pair (1006→1053); both fill
            the rule band (365→425), with black dots on their four corners. They
            draw in with the shared dots-pop / L→R swipe (see HatchCell). */}
        <HatchCell className="absolute" style={{ left: 234, top: 365, width: 47, height: 60 }} delay={0} />
        <HatchCell className="absolute" style={{ left: 1006, top: 365, width: 47, height: 60 }} delay={120} />

        {/* ---- Periwinkle + amber scatter, upper-left ----------------------- */}
        {/* resting right edge (its fixed edge) sits on the outer-left vline
            (234); it resizes leftward, away from the line into the margin */}
        <Bar x={153} y={276} w={81} h={13} dir="l" enter="0.6s" loopDur="7s" />
        {/* The square hangs off the bar's bottom-right corner (234, 289): its
            top-LEFT corner touches that point and it steps down-right, so the
            two meet at a single diagonal point (mirroring the right-side pair)
            rather than sharing an edge. Its left rests on the outer-left vline
            (234). */}
        <span className="absolute accent-flicker-a" style={{ left: 234, top: 289, width: 16, height: 14, background: PURPLE, ["--enter" as string]: "0.8s" } as CSSProperties} />
        {/* bottom edge (+ its amber tick) snapped to top rule (365) */}
        <span className="absolute accent-enter" style={{ left: 132, top: 337, width: 37, height: 28, border: `1px solid ${PURPLE}`, ["--enter" as string]: "0.7s" } as CSSProperties} />
        <span className="absolute accent-flicker-b" style={{ left: 138, top: 344, width: 26, height: 14, background: AMBER, ["--enter" as string]: "1s" } as CSSProperties} />
        {/* rest state tucked into the grid corner: its top-right point sits on
            the intersection of the outer-left vline (234) and the bottom rule
            (425), so its top edge runs along the rule and right edge along the
            vline. Its bottom-left point (204, 455) meets the blue square's
            top-right, keeping the two corner-to-corner. */}
        <span className="absolute accent-flicker-b" style={{ left: 204, top: 425, width: 30, height: 30, border: `1px solid ${PURPLE}`, ["--enter" as string]: "1.1s" } as CSSProperties} />
        {/* Gradient "window" (blue): masks a fixed-scale slice of the blue
            gradient, so resizing the square reveals more/less of the image
            rather than scaling it — mirrors the orange window on the right. Its
            top-right point (204, 455) meets the stroked box's bottom-left. */}
        <span className="absolute accent-land-x" style={{ left: 174, top: 455, width: 30, height: 30, backgroundImage: GRADIENT_BLUE, backgroundSize: GRADIENT_SIZE, backgroundPosition: "center", backgroundRepeat: "no-repeat", ["--enter" as string]: "0.9s" } as CSSProperties} />

        {/* ---- Periwinkle + amber scatter, upper-right --------------------- */}
        {/* the square is the anchor: its right edge on the outer-right vline
            (1053) and bottom edge on the top rule (365), so its bottom-right
            point lands on the intersection dot (1053, 365). The bar rides on its
            top-right corner (1053, 345) and extends into the margin. */}
        <span className="absolute accent-flicker-a" style={{ left: 1030, top: 345, width: 23, height: 20, border: `1px solid ${PURPLE}`, ["--enter" as string]: "1.2s" } as CSSProperties} />
        {/* resting left edge (its fixed edge) sits on the outer-right vline
            (1053); it resizes rightward, away from the line into the margin */}
        <Bar x={1053} y={334} w={49} h={11} dir="r" enter="1.3s" loopDur="8s" />
        {/* bottom edge snapped to top rule (365) — this square is the gradient
            "window": it masks a fixed-scale slice of the orange gradient, so
            resizing it reveals more/less of the image rather than scaling it. */}
        <span className="absolute accent-enter" style={{ left: 1136, top: 333, width: 37, height: 32, backgroundImage: GRADIENT_ORANGE, backgroundSize: GRADIENT_SIZE, backgroundPosition: "center", backgroundRepeat: "no-repeat", ["--enter" as string]: "1.4s" } as CSSProperties} />
        <span className="absolute accent-enter" style={{ left: 1173, top: 307, width: 37, height: 28, border: `1px solid ${PURPLE}`, ["--enter" as string]: "1.5s" } as CSSProperties} />
        <span className="absolute accent-flicker-b" style={{ left: 1182, top: 311, width: 20, height: 20, background: AMBER, ["--enter" as string]: "1.6s" } as CSSProperties} />
        {/* bar resizes rightward (isolated, far right) */}
        <Bar x={1201} y={505} w={47} h={9} dir="r" enter="1.7s" loopDur="9s" />

        {/* The external-link leader that drops onto the ENGINEER box now lives
            inside Hero.tsx (hero-engineer-leader) so it tracks the live word. */}
        {/* Brackets moved into Hero.tsx so they can respond to CTA hover. */}
      </div>
    </div>
  );
}
