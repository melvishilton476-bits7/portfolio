"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";

/**
 * The portrait, presented as a print with a face-detection overlay drawn on it.
 *
 * The conceit: a cream photo card, the quote written in the card's own bottom
 * border, a course badge tucked into the top corner, and the blue apparatus of
 * a face detector boxed over the face, labelled, and wired out to two crops
 * that hang off either side. It says "designer who can engineer" without a
 * caption having to. The right-hand crop is labelled `unidentified` — the
 * detector finding a face it cannot name is the joke, and it only lands if that
 * crop is big enough to read as a second subject, which is why it is larger
 * than the left one rather than matching it.
 *
 * EVERY piece is positioned in PERCENT against one aspect-ratio stage rather
 * than in the source's pixels. The stage spans the full bounding box of the
 * composition — the left crop that sits outside the card, the right one, the
 * blue tick below the card — so the whole assembly scales as a single object
 * down to phone width instead of coming apart at the first breakpoint.
 *
 * The apparatus draws itself in on scroll (`.about-detect*` in globals.css,
 * gated by `.is-grown` from the <GrowOnView> in <AboutIntro>): the subject box
 * pops first, then the leader lines wipe outward, then the crops land. Under
 * prefers-reduced-motion it is simply present.
 */

/** Source bounds of the whole composition (card top → blue tick bottom). */
const STAGE_W = 524;
const STAGE_H = 376;

/** Origin shift: the composition's top-left in the source frame. */
const OX = 346;
const OY = 348.91;

/** Figma's detector blue. Not a site token — it belongs to this graphic only,
 *  the way the traffic light's reds do. */
const BLUE = "#003cff";

/** x/y/w/h in STAGE px → a percentage style object against the stage. */
const boxS = (x: number, y: number, w: number, h: number) => ({
  left: `${(x / STAGE_W) * 100}%`,
  top: `${(y / STAGE_H) * 100}%`,
  width: `${(w / STAGE_W) * 100}%`,
  height: `${(h / STAGE_H) * 100}%`,
});

/** The same, from the source's own coordinates. */
const box = (x: number, y: number, w: number, h: number) =>
  boxS(x - OX, y - OY, w, h);

/** A source px size expressed against the stage. Uncapped on purpose: the
 *  graphic is deliberately printed larger than the source frame now, and a
 *  `min(…px, …cqw)` cap would freeze the type and leave it shrinking against
 *  everything around it as the stage grew. Every part scales by one factor or
 *  none of them do. */
const cq = (px: number) => `${((px / STAGE_W) * 100).toFixed(3)}cqw`;

/* ---- Plates ----------------------------------------------------------------
   The detector's labels. The source drew each one at a FIXED width, measured to
   fit its own type — which is fine until the type grows, at which point the
   plate clips the very word it exists to say. So a labelled plate is pinned by
   its left/top and its height and left to be as wide as its label plus a
   consistent pad: it is a label, and a label's width is its words'. Only the
   bare plate below the card keeps an explicit width, because it has no words to
   take one from. */
const PLATE_TEXT = 10.8;
const PLATE_PAD = 3.4;

const plateS = (x: number, y: number, h: number) => ({
  left: `${(x / STAGE_W) * 100}%`,
  top: `${(y / STAGE_H) * 100}%`,
  height: `${(h / STAGE_H) * 100}%`,
  paddingInline: cq(PLATE_PAD),
});
const plate = (x: number, y: number, h: number) => plateS(x - OX, y - OY, h);

/* ---- The course badge ------------------------------------------------------
   The mark and the two lines beside it are one cluster, so they come off one
   origin rather than two sets of coordinates that have to be kept in step by
   hand. The source's own numbers put the mark at 24 units and the type at 8,
   both of which were too small to read at the size this prints at; growing
   either one alone breaks the cluster, because the type sits in the gap the
   mark leaves and the mark is centred against the type's own height. */
const BADGE_X = 508;
const BADGE_Y = 373;
const BADGE_LOGO = 32;
const BADGE_GAP = 7;
const BADGE_TEXT = 10.5;
/** Two lines at the block's own 1.417 leading, so the mark can be centred
 *  against the type rather than against a number typed in beside it. */
const BADGE_TEXT_H = 2 * BADGE_TEXT * 1.417;

/* ---- The detector's geometry ----------------------------------------------
   The three frames and the two wires between them are all derived from one set
   of source numbers, so there is a single place where this graphic's shape
   lives. Everything below works in STAGE coordinates (source px with the
   origin shifted), which is also the SVG viewBox, so no conversion happens
   twice. */

type V2 = [number, number];
type Side = "left" | "right";
type Edge = "left" | "right";
type Box = { x: number; y: number; w: number; h: number; sw: number };

/** A box in source px, shifted onto the stage and carrying the weight it is
 *  stroked at — the crops are drawn far lighter than the subject frame, and the
 *  weld at each end has to know which. */
const srcBox = (
  x: number,
  y: number,
  w: number,
  h: number,
  sw: number,
): Box => ({
  x: x - OX,
  y: y - OY,
  w,
  h,
  sw,
});

/* The subject frame. The source drew it hugging the face at the same weight as
   the wires running out of it, which makes the thing the whole graphic is ABOUT
   read as one more line in the diagram. It is grown about its own centre — not
   from its corner, or the box would walk off the face as it got bigger — and
   stroked heavier than everything else, so the hierarchy is subject frame, then
   wires, then the crops' hairlines. The plate hanging under it and the two wire
   anchors are all derived from these numbers rather than written out again, so
   growing the box takes them with it. */
const FACE_BASE = srcBox(564.63, 453.36, 119.493, 111.527, 3.9);
const FACE_GROW = 1.18;
const FACE: Box = {
  ...FACE_BASE,
  x: FACE_BASE.x - (FACE_BASE.w * (FACE_GROW - 1)) / 2,
  y: FACE_BASE.y - (FACE_BASE.h * (FACE_GROW - 1)) / 2,
  w: FACE_BASE.w * FACE_GROW,
  h: FACE_BASE.h * FACE_GROW,
};
const CROP: Record<Side, Box> = {
  left: srcBox(346, 475.49, 62.845, 58.655, 1.397),
  right: srcBox(782.37, 381.66, 87.628, 81.432, 1.397),
};
const WIRE_SW = 2.655;

/** Where a wire meets a frame: which vertical edge, and how far down it. The
 *  fractions are read off the source's own line endpoints — but the EDGE is
 *  snapped to, rather than taken from the source, which draws its ends a pixel
 *  or two shy of the frame on one side and five inside it on the other. At the
 *  source's own size that reads as ink; printed larger it reads as a wire that
 *  stops near the box instead of entering it. */
const LEADERS = [
  {
    side: "left" as Side,
    faceEdge: "left" as Edge,
    faceV: (530.36 - 453.36) / FACE_BASE.h,
    cropEdge: "right" as Edge,
    cropV: (503.81 - 475.49) / CROP.left.h,
  },
  {
    side: "right" as Side,
    faceEdge: "right" as Edge,
    faceV: (482.62 - 453.36) / FACE_BASE.h,
    cropEdge: "left" as Edge,
    cropV: (426.79 - 381.66) / CROP.right.h,
  },
];

const edgeX = (b: Box, e: Edge) => (e === "left" ? b.x : b.x + b.w);

/* ---- Re-acquisition --------------------------------------------------------
   The source gives two frames of this graphic. Measured against the card and
   normalised for their different canvas zooms, the card, the photograph, the
   quote, the badge, the subject box and its "Melvis Hilton" plate are IDENTICAL
   in both — the subject box sits at (0.292, 0.293) in one and (0.295, 0.297) in
   the other, and keeps its size to within half a percent.

   Only the two secondary crops move, and they cross: the left one rises as the
   right one falls, both holding their size. That is a detector re-acquiring —
   the subject stays locked while the secondary detections hunt around, which is
   the joke the `unidentified` plate is already telling. So the animation moves
   exactly those two things, and the wires follow because their endpoints are
   read off the frames rather than animated.

   NOTE: these deltas are measured off the supplied frames, not read out of
   Figma — the frames arrived as images. They are good to about a pixel. If the
   node ids turn up, swap in the exact numbers; nothing else has to change. */
const MOVE: Record<Side, V2> = {
  left: [26.01, -58.09],
  right: [1.84, 99.21],
};

/** Hold, then cross. Slow enough to be watched rather than caught out of the
 *  corner of an eye: the crops travel for most of a second, and the ease is
 *  symmetric so neither end of the swap is the one that snaps. */
const HOLD_MS = 1600;
const CROSS_MS = 900;
const CYCLE_MS = 2 * (HOLD_MS + CROSS_MS);

/** Progress 0→1 across one full cycle position, eased in and out. */
function phase(ms: number) {
  const u = ms % CYCLE_MS;
  let p: number;
  if (u < HOLD_MS) p = 0;
  else if (u < HOLD_MS + CROSS_MS) p = (u - HOLD_MS) / CROSS_MS;
  else if (u < 2 * HOLD_MS + CROSS_MS) p = 1;
  else p = 1 - (u - 2 * HOLD_MS - CROSS_MS) / CROSS_MS;
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}

/* ---- Welds -----------------------------------------------------------------
   Where a wire lands on a frame, the two strokes meet at an angle, and a wire
   cut square across its own direction cannot reach both corners of that angle —
   which is what leaves a white wedge at the joint and the whole thing looking
   unglued.

   Filling the wedge flat would only replace one hard corner with another. What
   a joint between two runs of the same material actually does is fillet: the
   surface pulls a concave meniscus into the corner, deep where the angle is
   acute and shallow where it opens out. So each joint gets two of those, one
   per side of the wire, tangent to the wire's flank and to the frame's edge.

   Because the reach of a fillet goes as 1/tan(angle/2), this is not decoration
   that sits still — as a crop travels and the wire swings, the meniscus on the
   closing side stretches out and the one on the opening side draws back in. The
   joint behaves.

   TANGENCY IS THE WHOLE THING, and it is easy to lose. The corner V — where the
   wire's flank crosses the frame's outer edge — already sits ON that flank, so
   the fillet's far end is V walked along the wire and nothing else. Offsetting
   it by the wire's half-weight as well, which is the obvious-looking mistake,
   lifts the meniscus clear of the wire it is supposed to be pulled out of: it
   then floats a half-weight off the flank, opens a hairline of white between
   itself and the wire, and curls away at the tip. That is not a weld, it is a
   claw stuck beside the joint — and at any size above 1:1 it is the first thing
   the eye finds.

   The bead is drawn out of the material either side of it, so it scales with
   the two weights it joins — their geometric mean, which lands between the two
   and moves with either. The face frame and the wire are both 2.655 wide; the
   crops are hairlines at 1.397 and take a correspondingly smaller bead, because
   the one that reads as a weld on the heavy frame would sit on a hairline like
   a blob. Both legs of a fillet get the same length: spend it unevenly and the
   meniscus stretches into a needle along whichever surface got the larger
   share. */
const WELD_K = 1.15;

const cross = (a: V2, b: V2) => a[0] * b[1] - a[1] * b[0];
const dot = (a: V2, b: V2) => a[0] * b[0] + a[1] * b[1];
const pt = (p: V2) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;

/** Both fillets at one joint, as a single filled path.
 *  `P` is the attachment point on the frame's OUTER edge; `uo` points along the
 *  wire, away from that frame; `hw` is half the wire's weight; `fsw` is the
 *  weight of the frame being landed on. Every joint in this graphic lands on a
 *  vertical edge, which is why the frame's ray is taken as straight up or
 *  straight down rather than solved for. */
function weld(P: V2, uo: V2, hw: number, fsw: number) {
  // The bead this joint can support, from the two weights meeting in it.
  const r = WELD_K * Math.sqrt(2 * hw * fsw);
  let d = "";
  for (const s of [1, -1]) {
    // The wire's flank on this side, and the frame's edge-ray that closes the
    // wedge with it.
    const n: V2 = [-uo[1] * s, uo[0] * s];
    const ray: V2 = [0, n[1] >= 0 ? 1 : -1];
    // Corner: where the flank line crosses the frame's outer edge. Offset from
    // the attachment point by the wire's half-weight, foreshortened by the
    // angle it arrives at.
    const q = (hw * cross(n, uo)) / cross(ray, uo);
    const V: V2 = [P[0] + q * ray[0], P[1] + q * ray[1]];
    const ang = Math.acos(Math.max(-1, Math.min(1, dot(uo, ray))));
    // One leg length, spent equally on the wire and on the frame. The floor
    // keeps a bead on the opening side rather than letting it vanish; the
    // ceiling stops the closing side running away as the angle shuts, which is
    // where 1/tan sends it.
    const leg = Math.min(3 * r, Math.max(r, r / Math.tan(ang / 2)));
    const A: V2 = [V[0] + leg * uo[0], V[1] + leg * uo[1]];
    const B: V2 = [V[0] + leg * ray[0], V[1] + leg * ray[1]];
    // A quadratic whose control point IS the corner is tangent to both edges at
    // the points it leaves them, so the meniscus meets wire and frame smoothly
    // without any circle having to be solved for.
    d += `M${pt(A)}L${pt(V)}L${pt(B)}Q${pt(V)} ${pt(A)}Z`;
  }
  return d;
}

/** Wire endpoints and welds for one leader at a given progress through the
 *  cycle. The wire is run a half-weight PAST its attachment point, so it ends
 *  buried inside the frame's own stroke rather than butting against it — the
 *  frame is painted afterwards and covers the overshoot. */
function leaderAt(l: (typeof LEADERS)[number], p: number) {
  const c = CROP[l.side];
  const [mx, my] = MOVE[l.side];
  const cx = c.x + mx * p;
  const cy = c.y + my * p;

  const Pf: V2 = [edgeX(FACE, l.faceEdge), FACE.y + l.faceV * FACE.h];
  const Pc: V2 = [l.cropEdge === "left" ? cx : cx + c.w, cy + l.cropV * c.h];

  const dx = Pc[0] - Pf[0];
  const dy = Pc[1] - Pf[1];
  const len = Math.hypot(dx, dy) || 1;
  const u: V2 = [dx / len, dy / len];

  // Push in along the wire far enough to bury a half-weight horizontally; the
  // edges are vertical, so it is the horizontal component that has to clear.
  const bury = (sw: number) => sw / 2 / Math.max(0.25, Math.abs(u[0]));
  const ef = bury(FACE.sw);
  const ec = bury(c.sw);

  return {
    x1: Pf[0] - u[0] * ef,
    y1: Pf[1] - u[1] * ef,
    x2: Pc[0] + u[0] * ec,
    y2: Pc[1] + u[1] * ec,
    faceWeld: weld(Pf, u, WIRE_SW / 2, FACE.sw),
    cropWeld: weld(Pc, [-u[0], -u[1]], WIRE_SW / 2, c.sw),
  };
}

/* ---- Hand-drawn ------------------------------------------------------------
   The apparatus is drawn with a ruler — perfectly straight, perfectly square —
   and against a photograph and a hand-written quote it reads as a screenshot
   pasted over a print rather than as something someone drew on it. One
   turbulence field displacing the whole drawing fixes that: every stroke picks
   up a slow, uneven wander, corners stop being exactly square, and long runs
   bow slightly the way a line does when the hand rather than the edge of a
   ruler is guiding it.

   TWO THINGS MAKE IT HOLD STILL. The filter region is pinned in user space, not
   to the drawing's bounding box — the crops move, so a box-relative region
   would slide the noise field under the strokes every frame and the whole thing
   would boil. And the displacement is applied to the group as ONE pass, after
   the wires, welds and frames are composited together, so a joint that was
   sealed stays sealed: both sides of it are carried by the same sample of the
   field. Displace them separately and every weld would tear open again.

   AND THE FIELD HAS TO STAY SHALLOW, for a reason that is invisible until you
   look at the drawing three times life size. A displacement map moves each
   pixel independently, so what matters is not how far it moves them but how
   differently it moves NEIGHBOURS: once the field's gradient reaches 1 the
   mapping folds over itself and strokes tear open — holes appear mid-line, and
   they look like a bug, not like a hand. That gradient is about
   scale x 2*pi x (sum of the octave frequencies), which for two octaves is
   scale x 2*pi x 2f. At 4.2 and 0.021 that comes to 1.1 and the frame breaks in
   three places; at 3.6 and 0.010 it is 0.45, which thins a stroke by at most
   half and never parts it — including the crops' 1.397 hairlines, which are the
   member that actually sets the ceiling.

   So the wander is long and lazy — a wavelength around a hundred units, a fifth
   of the stage — rather than tight and scribbly, and travels about ±1.8 units:
   two or three pixels at the size this prints at. Enough to lose the machine
   edge; not enough to open a hole in a line. */
const SKETCH_FREQ = 0.01;
const SKETCH_SCALE = 3.6;

/* ---- Boil ------------------------------------------------------------------
   A single fixed noise field gives a drawing that was drawn by hand ONCE. What
   makes hand-drawn animation read as hand-drawn is that it was drawn again for
   every frame, and no two passes of a human hand land on the same line — so the
   whole outline crawls. That is line boil, and without it the wobble here is
   just a wonky rectangle sitting perfectly still.

   Boil is not a 60fps effect. Traditional animation shoots roughly on threes —
   a new drawing eight or so times a second — and holding each one is the whole
   point: it is the STEP between drawings that reads as a hand, where a smooth
   morph would just read as a wave. So the field is not swept, it is SWAPPED, on
   a beat well below the frame rate.

   Three seeds, not a fresh one each beat. A short repeating cycle is what a
   three-drawing loop actually is, and it reads as deliberate; endless fresh
   noise reads as static. They are re-seeded off the same clock the crops move
   on, so the boil stops with everything else when the graphic scrolls out of
   view, and never starts at all under prefers-reduced-motion — a whole drawing
   crawling in place is exactly the kind of motion that rule exists for. */
const SKETCH_SEEDS = [11, 47, 83];
const BOIL_MS = 120;

/** The frames, the wires and the welds, all in one drawing. A frame is stroked
 *  on a rect inset by half its weight so the stroke lands exactly where the old
 *  CSS border did — inside the box, not straddling it. */
function Apparatus({
  wireRefs,
  weldRefs,
  cropRefs,
  boilRef,
}: {
  wireRefs: React.RefObject<(SVGLineElement | null)[]>;
  weldRefs: React.RefObject<(SVGPathElement | null)[]>;
  cropRefs: React.RefObject<Record<Side, SVGGElement | null>>;
  boilRef: React.RefObject<SVGFETurbulenceElement | null>;
}) {
  /* Scoped rather than a literal string: a filter id is document-global, and a
     second instance of this graphic on one page would otherwise point both at
     whichever <defs> rendered last. */
  const sketch = `about-sketch-${useId().replace(/:/g, "")}`;
  const start = LEADERS.map((l) => leaderAt(l, 0));
  const rect = (b: Box, delay: number) => (
    <rect
      className="about-detect-shape"
      x={b.x + b.sw / 2}
      y={b.y + b.sw / 2}
      width={b.w - b.sw}
      height={b.h - b.sw}
      strokeWidth={b.sw}
      style={{ ["--d" as string]: `${delay}ms` }}
    />
  );
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
      viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
      fill="none"
      preserveAspectRatio="none"
    >
      <defs>
        <filter
          id={sketch}
          filterUnits="userSpaceOnUse"
          primitiveUnits="userSpaceOnUse"
          x={-16}
          y={-16}
          width={STAGE_W + 32}
          height={STAGE_H + 32}
        >
          <feTurbulence
            ref={boilRef}
            type="fractalNoise"
            baseFrequency={SKETCH_FREQ}
            numOctaves={2}
            seed={SKETCH_SEEDS[0]}
            result="wander"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="wander"
            scale={SKETCH_SCALE}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      {/* Round joins under the wobble: a mitre that has been pushed off square
          by the displacement comes to a spike, and a hand-drawn corner does not
          have one. */}
      <g
        filter={`url(#${sketch})`}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <g stroke={BLUE} strokeWidth={WIRE_SW}>
          {start.map((s, i) => (
            <line
              key={LEADERS[i].side}
              ref={(el) => {
                wireRefs.current[i] = el;
              }}
              className="about-wire"
              pathLength={1}
              style={{ ["--d" as string]: `${620 + i * 80}ms` }}
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
            />
          ))}
        </g>

        <g fill={BLUE}>
          {start.flatMap((s, i) =>
            [s.faceWeld, s.cropWeld].map((d, j) => (
              <path
                key={`${LEADERS[i].side}-${j}`}
                ref={(el) => {
                  weldRefs.current[i * 2 + j] = el;
                }}
                className="about-weld"
                style={{ ["--d" as string]: `${900 + i * 80}ms` }}
                d={d}
              />
            )),
          )}
        </g>

        <g stroke={BLUE}>
          {rect(FACE, 260)}
          <g
            ref={(el) => {
              cropRefs.current.left = el;
            }}
          >
            {rect(CROP.left, 880)}
          </g>
          <g
            ref={(el) => {
              cropRefs.current.right = el;
            }}
          >
            {rect(CROP.right, 1000)}
          </g>
        </g>
      </g>
    </svg>
  );
}

/** The filled name plate under a detection. Text, so it stays HTML. */
function Plate({
  style,
  label,
  delay,
}: {
  style: React.CSSProperties;
  label?: string;
  delay: number;
}) {
  return (
    <div
      className="about-detect-plate absolute flex items-center justify-center overflow-hidden"
      style={{
        ...style,
        backgroundColor: BLUE,
        ["--d" as string]: `${delay}ms`,
      }}
    >
      {label ? (
        <span
          className="font-light whitespace-nowrap text-white"
          /* Not a type token, deliberately: this is a machine label drawn ON
             the print, and a fixed px size would hold still while the drawing
             it is painted on grew. It is sized in the drawing's own units, and
             raised from the source's 7.966 because at that setting the plate
             carrying the graphic's whole joke came out under 10px. */
          style={{ fontSize: cq(PLATE_TEXT), letterSpacing: "-0.08em" }}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}

export default function Polaroid() {
  const stageRef = useRef<HTMLDivElement>(null);
  const wireRefs = useRef<(SVGLineElement | null)[]>([]);
  const weldRefs = useRef<(SVGPathElement | null)[]>([]);
  /** The one turbulence primitive behind the whole drawing; re-seeded on the
   *  boil's own beat. */
  const boilRef = useRef<SVGFETurbulenceElement | null>(null);
  const cropShapes = useRef<Record<Side, SVGGElement | null>>({
    left: null,
    right: null,
  });
  /** The HTML that travels with each crop — its photograph, and the plate on
   *  the right-hand one. Those sit on opposite sides of the SVG in the stack,
   *  so they cannot share one wrapper and each needs its own handle. */
  const imgLeft = useRef<HTMLDivElement | null>(null);
  const imgRight = useRef<HTMLDivElement | null>(null);
  const plateRight = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let t = 0;
    let last = 0;
    /* Last seed written, so the attribute is only touched on a beat. Writing it
       every frame would re-run the turbulence sixty times a second for three
       distinct results — all of the cost of a 60fps boil and none of the look. */
    let boil = -1;
    /* Runs from mount; the observer below only ever pauses it. Gating the start
       on an observer would mean the graphic never moves anywhere one is
       unavailable — a silent total failure for a saving that only matters while
       nobody is looking. */
    let running = true;

    const frame = (now: number) => {
      /* Clamped so a backgrounded tab does not resume with one enormous step. */
      if (last) t += Math.min(0.05, (now - last) / 1000) * 1000;
      last = now;
      const p = phase(t);

      const beat = Math.floor(t / BOIL_MS) % SKETCH_SEEDS.length;
      if (beat !== boil) {
        boil = beat;
        boilRef.current?.setAttribute("seed", String(SKETCH_SEEDS[beat]));
      }

      /* One write per crop in the SVG's own units, and one for the HTML that
         rides along with it. The HTML travels in PERCENT — the riders span the
         whole stage, so a percentage of their own box is a percentage of the
         stage, which is the same thing the viewBox units are. No measured
         scale, so there is nothing that can go stale on a resize and slide the
         photographs out of the frames drawn around them. */
      const pc = (side: Side) =>
        `translate3d(${(MOVE[side][0] * p * 100) / STAGE_W}%, ${
          (MOVE[side][1] * p * 100) / STAGE_H
        }%, 0)`;
      for (const side of ["left", "right"] as const) {
        const [dx, dy] = MOVE[side];
        cropShapes.current[side]?.setAttribute(
          "transform",
          `translate(${dx * p} ${dy * p})`,
        );
      }
      if (imgLeft.current) imgLeft.current.style.transform = pc("left");
      if (imgRight.current) imgRight.current.style.transform = pc("right");
      if (plateRight.current) plateRight.current.style.transform = pc("right");

      /* The wires are not animated — both ends are read off the frames they
         attach to, so they stretch and swing purely because one end moved, and
         the welds are re-solved from the angle they arrive at. */
      for (let i = 0; i < LEADERS.length; i++) {
        const s = leaderAt(LEADERS[i], p);
        const ln = wireRefs.current[i];
        if (ln) {
          ln.setAttribute("x1", s.x1.toFixed(2));
          ln.setAttribute("y1", s.y1.toFixed(2));
          ln.setAttribute("x2", s.x2.toFixed(2));
          ln.setAttribute("y2", s.y2.toFixed(2));
        }
        weldRefs.current[i * 2]?.setAttribute("d", s.faceWeld);
        weldRefs.current[i * 2 + 1]?.setAttribute("d", s.cropWeld);
      }
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === running) return;
        running = entry.isIntersecting;
        if (running) {
          last = 0;
          raf = requestAnimationFrame(frame);
        } else {
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    io.observe(stage);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="relative mx-auto w-full"
      style={{
        aspectRatio: `${STAGE_W} / ${STAGE_H}`,
        containerType: "inline-size",
      }}
    >
      {/* ---- The card ------------------------------------------------------
          The periwinkle the homepage locks "ENGINEER" onto. It was cream, which
          separated the print from the page but tied it to nothing; on the site's
          own accent the print belongs to the same family as the squares and
          hatch cells around it, and the detector's blue reads as a second, colder
          blue drawn ON a coloured card rather than ink on paper. */}
      <div
        className="absolute bg-[#8581ff] shadow-[0px_6.675px_16.355px_0px_rgba(0,0,0,0.09)]"
        style={box(482.31, 348.91, 279.703, 353.133)}
      />

      {/* The photo, inset inside the card's border the way a print is mounted:
          an even margin at the sides and top, a deeper one at the foot.
          object-top, not centre — the source anchors the crop to the top of the
          frame, which is what keeps the horizon high and the face in the upper
          third rather than dead-centre. */}
      <div
        className="absolute overflow-hidden"
        style={box(496.33, 360.26, 250.331, 279.703)}
      >
        <Image
          src="/about/portrait.webp"
          alt="Melvis on a beach in a black t-shirt, smiling at the camera, the sea behind him"
          fill
          sizes="(max-width: 1024px) 60vw, 360px"
          className="object-cover object-top"
          priority
        />
        {/* Grain, soft-light — the print's own texture rather than a filter on
            the person. Same plate the source layers here. */}
        <Image
          src="/about/grain.webp"
          alt=""
          aria-hidden
          fill
          sizes="(max-width: 1024px) 60vw, 360px"
          className="pointer-events-none object-cover mix-blend-soft-light"
        />
      </div>

      {/* Course badge, sat on the print itself rather than in the caption band.
          It is the one piece of hard fact in a composition that is otherwise
          all photograph and apparatus, and putting it on the image is what
          makes the print read as an ID card as much as a snapshot. */}
      <div
        className="absolute"
        style={box(BADGE_X, BADGE_Y, BADGE_LOGO, BADGE_LOGO)}
      >
        <Image
          src="/about/isdi.webp"
          alt="ISDI"
          fill
          sizes="36px"
          className="object-contain"
        />
      </div>
      {/* The one piece of ordinary READING inside the drawing, as opposed to a
          machine label on a plate — and the source set it at 8 units of 524,
          which lands at nine and a half pixels on a desktop print and six on a
          phone. That is smaller than anything on the site is allowed to be, and
          it is the line that says what the qualification actually is.

          It stays in container units rather than taking a type token, because
          it is drawn ON the print: freeze it at 12px and it would hold still
          while everything around it grew, which is the one thing this graphic's
          geometry is built to prevent. So the fix is proportion, not
          tokenisation — 10.5 units instead of 8, which is a shade under the
          quote written in the card's border below and reads as the same hand.
          The box widens with it, or "Status: In progress.." wraps.

          The ink is the site's #171717 rather than the source's #3d3d3d, which
          was a grey belonging to no palette here. */}
      <div
        className="text-ink absolute leading-[1.417]"
        style={{
          ...box(
            BADGE_X + BADGE_LOGO + BADGE_GAP,
            BADGE_Y + BADGE_LOGO / 2 - BADGE_TEXT_H / 2,
            122,
            BADGE_TEXT_H,
          ),
          fontSize: cq(BADGE_TEXT),
          letterSpacing: "-0.05em",
        }}
      >
        <p className="font-medium">B.Des, ISDI</p>
        <p>
          Status: <span className="font-medium">In progress</span>
          {/* The two full stops the source typed are doing the job of a
              spinner, so let them do it properly: three dots cycling, the
              typing-indicator idiom every status line borrows. They are real
              periods rather than drawn circles because everything else on this
              print is type and a drawn dot would read as part of the detector
              rather than as part of the sentence. Each one holds its space at
              zero opacity, so the line never reflows as they come and go —
              which is the whole reason a status ellipsis is written as three
              fading dots and not as one that is appended and removed.

              aria-hidden: "Status: In progress" is the whole of what this says,
              and a screen reader spelling out a decorative ellipsis every pass
              is noise. Held still under prefers-reduced-motion — an animation
              that never stops is exactly what that setting is for. */}
          <span aria-hidden className="about-status-dots font-medium">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>
      </div>

      {/* The line written on the print's own border. The card's bottom margin
          is deliberately deeper than its other three — that asymmetry only
          means something if something is written in it, and in the source this
          is what fills it. */}
      <blockquote
        className="absolute flex items-start justify-center text-center font-light text-black"
        style={{
          ...box(492, 653, 260, 44),
          fontSize: cq(11.348),
          letterSpacing: "-0.08em",
          lineHeight: 1.4,
        }}
      >
        {/* Broken at the comma rather than left to wrap: the natural break
            lands after "never", splitting the second clause across both lines
            and reading as a mistake. */}
        <span>
          &ldquo; You are only ever entitled to the work,
          <br />
          never to the fruits of your work &rdquo;
        </span>
      </blockquote>

      {/* ---- The crops' photographs ----------------------------------------
          UNDER the apparatus, so each frame's stroke reads as a frame around
          its picture and the wire's overshoot is buried in it. */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div
          ref={(el) => {
            imgLeft.current = el;
          }}
          className="absolute inset-0 will-change-transform"
        >
          <div
            className="absolute overflow-hidden"
            style={box(346, 475.49, 62.845, 58.655)}
          >
            <Image
              src="/about/face-a.webp"
              alt=""
              aria-hidden
              fill
              sizes="110px"
              className="object-cover"
            />
          </div>
        </div>
        <div
          ref={(el) => {
            imgRight.current = el;
          }}
          className="absolute inset-0 will-change-transform"
        >
          <div
            className="absolute overflow-hidden"
            style={box(782.37, 381.66, 87.628, 81.432)}
          >
            <Image
              src="/about/face-b.webp"
              alt=""
              aria-hidden
              fill
              sizes="140px"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <Apparatus
        wireRefs={wireRefs}
        weldRefs={weldRefs}
        cropRefs={cropShapes}
        boilRef={boilRef}
      />

      {/* ---- Plates ---------------------------------------------------------
          Over the apparatus: a plate is a label stuck on top of the drawing,
          and in the source it covers the frame it hangs from. */}
      <div className="pointer-events-none absolute inset-0 z-30">
        {/* Hung off the frame's own bottom-left corner rather than parked at the
            source's coordinates, so it travels with the box when the box grows. */}
        <Plate
          style={plateS(FACE.x, FACE.y + FACE.h, 18)}
          label="Melvis Hilton"
          delay={420}
        />
        <div
          ref={(el) => {
            plateRight.current = el;
          }}
          className="absolute inset-0 will-change-transform"
        >
          <Plate
            style={plate(782.37, 463.1, 15.6)}
            label="unidentified"
            delay={1160}
          />
        </div>
        {/* A bare plate below the card, no frame above it — the detector still
            running after it has left the photograph. */}
        <Plate style={box(614, 717, 46.4, 10.7)} delay={1300} />
      </div>
    </div>
  );
}
