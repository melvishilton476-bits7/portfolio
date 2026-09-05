"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import DashRule from "@/components/DashRule";
import HatchCell from "@/components/HatchCell";
import GrowOnView from "@/components/GrowOnView";

/**
 * "FUN BEING ACHIEVED" — the photo wall, as a floating cluster.
 *
 * Twelve prints in periwinkle mounts scattered across a field and JOINED BY
 * LINES, so the block reads as one connected thing being traced rather than as
 * a grid of tiles. Labels and hand-numbered tags sit in the gaps between them.
 *
 * It is genuinely one cluster, not a scatter that happens to have lines drawn
 * over it: every print is reachable from every other, with fun-05 and fun-09
 * as four-link hubs. That is what the drift is built on — the prints breathe on
 * their own phases and each line RE-DERIVES its two endpoints every frame from
 * the prints it joins, so a link stretches, shortens and swings as the two
 * photographs either end of it wander. Nothing about the lines is animated
 * directly; the elasticity falls out of the geometry.
 *
 * Because the connections are the design, the desktop layout is a single
 * positioned stage: every print, tag, label, amber square and line is placed in
 * PERCENT against the source's own bounding box, so the whole constellation
 * scales as one object. Reflowing it into a grid would break every join.
 *
 * Below `lg` all of that is abandoned for a plain flowing grid of the same
 * prints. A scatter that depends on 725px of width has nothing to say at 375px,
 * the lines would cross the photographs instead of linking them, and drifting
 * boxes on a touch device that is already scrolling is just noise.
 */

const PURPLE = "#7f90ff";
const AMBER = "#ffae00";

/** Source bounding box of the whole constellation. */
const STAGE_W = 725;
const STAGE_H = 830;
const OX = 290;
const OY = 1398;

const pct = (v: number, axis: "x" | "y") =>
  `${(((v - (axis === "x" ? OX : OY)) / (axis === "x" ? STAGE_W : STAGE_H)) * 100).toFixed(4)}%`;
const size = (v: number, axis: "x" | "y") =>
  `${((v / (axis === "x" ? STAGE_W : STAGE_H)) * 100).toFixed(4)}%`;

/** x/y/w/h in source px → a percentage style object against the stage. */
const box = (x: number, y: number, w: number, h: number) => ({
  left: pct(x, "x"),
  top: pct(y, "y"),
  width: size(w, "x"),
  height: size(h, "y"),
});

/** A source px type size against the stage, capped at what was drawn. */
const cq = (px: number) => `min(${px}px, ${((px / STAGE_W) * 100).toFixed(3)}cqw)`;

/* ---- Lineboil --------------------------------------------------------------
   The mounts and the joins are both struck by hand, so both wobble — but they
   get there by different means, and deliberately so.

   The MOUNTS use the site's existing boil: feTurbulence → feDisplacementMap
   with the seed stepping on a discrete SMIL clock, exactly as the draped hands,
   the traffic light and the asterisks do. Their shape never changes, so the
   filter only re-rasterises when the seed steps (~8/sec); the drift is an
   ancestor CSS transform, which moves the already-filtered result rather than
   invalidating it. Cheap, and it inherits the site's hand automatically.

   The JOINS cannot use that filter. Their geometry is rebuilt every frame as
   the two prints either end of them wander, so a displacement map over the
   735x841 stage would have to re-rasterise ~618k pixels of fractalNoise at
   60fps. They are boiled GEOMETRICALLY instead: each join carries two interior
   joints that are re-struck on the same discrete clock, which costs nothing
   because those paths are already being rebuilt. For a stroke, redrawing the
   line IS the more faithful technique anyway — it is what the animator does. */

/** Beats per second, and how many distinct strikes before the cycle repeats.
 *  Held between beats, never interpolated: the hold is what reads as "redrawn",
 *  where a smooth tween would just read as a wobble effect. 8/sec is a drawing
 *  on 3s at 24fps, and 12 strikes matches the filter's seed list below. */
const BOIL_FPS = 8;
const BOIL_STRIKES = 12;
/** Wander of a joint, in source px. At 1.4 against a 5px stroke it reads as an
 *  unsteady hand; much past 2 it reads as a broken line. */
const BOIL_AMP = 1.4;

/** Deterministic in [-1, 1]. Seeded from the join, the joint and the strike, so
 *  the sequence is identical on every load and on the server — Math.random here
 *  would re-strike the whole drawing on hydration. */
function strike(a: number, b: number, c: number) {
  const n = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;
  return (n - Math.floor(n)) * 2 - 1;
}

/** Two interior joints, so a join can bow rather than only tilt. The ENDPOINTS
 *  are passed through untouched: they are welded to the prints, and that weld
 *  is the one property the whole cluster depends on. */
const JOINTS = 2;
function joinPath(x1: number, y1: number, x2: number, y2: number, li: number, at: number) {
  let d = `M${x1.toFixed(2)} ${y1.toFixed(2)}`;
  for (let k = 1; k <= JOINTS; k++) {
    const f = k / (JOINTS + 1);
    const jx = at < 0 ? 0 : BOIL_AMP * strike(li, k, at);
    const jy = at < 0 ? 0 : BOIL_AMP * strike(li, k + 50, at);
    d += ` L${(x1 + (x2 - x1) * f + jx).toFixed(2)} ${(y1 + (y2 - y1) * f + jy).toFixed(2)}`;
  }
  return `${d} L${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

type Shot = {
  id: string;
  src: string;
  alt: string;
  /** x, y, w, h in source px. */
  at: [number, number, number, number];
  /** Mount weight in source px — one print is mounted a shade thinner. */
  mount?: number;
  mountColor?: string;
  objectPosition?: string;
};

const SHOTS: Shot[] = [
  { id: "fun-02", src: "/about/fun-02.webp", alt: "A group at a karaoke bar, the screen lit behind them", at: [518, 1433, 126.485, 126.485] },
  { id: "fun-04", src: "/about/fun-04.webp", alt: "Melvis at a food court holding a drink", at: [791, 1432, 121.843, 132.287] },
  { id: "fun-01", src: "/about/fun-01.webp", alt: "Melvis with family in a cinema, popcorn in hand", at: [361, 1496, 126.485, 126.485] },
  { id: "fun-05", src: "/about/fun-05.webp", alt: "A full table of food mid-meal", at: [645, 1583, 126.485, 126.485] },
  { id: "fun-03", src: "/about/fun-03.webp", alt: "Three friends leaning in for a selfie", at: [298, 1644, 126.485, 126.485] },
  { id: "fun-06", src: "/about/fun-06.webp", alt: "A road at dusk with two figures walking along it", at: [498.62, 1717.21, 126.485, 126.485] },
  { id: "fun-07", src: "/about/fun-07.webp", alt: "A group of children sitting together outdoors", at: [765.52, 1721.86, 126.485, 126.485], mount: 4, mountColor: "#7b9aff" },
  { id: "fun-08", src: "/about/fun-08.webp", alt: "Melvis working at a laptop in low light", at: [463.77, 1859, 126.485, 126.485] },
  { id: "fun-09", src: "/about/fun-09.webp", alt: "A boat moored on a backwater", at: [627.32, 1888.37, 126.485, 126.485] },
  { id: "fun-11", src: "/about/fun-11.webp", alt: "A stack of books seen spine-on", at: [849.39, 1971, 126.485, 126.485] },
  { id: "fun-10", src: "/about/fun-10.webp", alt: "Four friends on a beach with the sea behind them", at: [333.65, 1995, 126.485, 126.485], objectPosition: "bottom" },
  { id: "fun-12", src: "/about/fun-12.webp", alt: "A group photo on a trip, everyone squinting into the sun", at: [521, 2094, 186.826, 126.485] },
];

/** The joins, as the source draws them: twelve straight 5px strokes, given here
 *  as the raw endpoint pairs Figma exports (its rotated wrappers are just how
 *  it stores an angled line). These stay the source of truth — the node/anchor
 *  form the drift needs is DERIVED from them below rather than transcribed, so
 *  there is no second set of numbers to keep in step with this one. */
const LINKS: [number, number, number, number][] = [
  [486, 1546, 522, 1535.5],
  [354.79, 1646.79, 391.22, 1619.7],
  [643, 1552.93, 662, 1587.79],
  [763, 1585.46, 797.7, 1562],
  [612.84, 1718.46, 654.59, 1688],
  [750, 1708, 768, 1738],
  [506.86, 1861.71, 533.84, 1841],
  [587, 1945, 631, 1966],
  [750, 2010, 852, 2052],
  [600.68, 2097, 669.885, 2015],
  [454.69, 1998.01, 496.95, 1983.18],
  [735.76, 1891.59, 788.24, 1846],
];

/** Which print a point belongs to, and where on it. Distance is measured to the
 *  RECTANGLE, not its centre, so a point sitting on an edge scores zero. */
function nearestShot(px: number, py: number) {
  let best = { i: 0, d: Infinity };
  for (let i = 0; i < SHOTS.length; i++) {
    const [x, y, w, h] = SHOTS[i].at;
    const dx = Math.max(x - px, 0, px - (x + w));
    const dy = Math.max(y - py, 0, py - (y + h));
    const d = Math.hypot(dx, dy);
    if (d < best.d) best = { i, d };
  }
  const [x, y, w, h] = SHOTS[best.i].at;
  return { i: best.i, u: (px - x) / w, v: (py - y) / h };
}

/** Each join resolved to two prints plus a NORMALISED anchor on each. Every one
 *  of the 24 source endpoints lands exactly on a print's edge (checked: all at
 *  distance 0.00), so these anchors reproduce the drawing precisely — and,
 *  being fractions of the print rather than absolute points, they travel with
 *  it for free once it starts moving. */
const JOINS = LINKS.map(([x1, y1, x2, y2]) => {
  const a = nearestShot(x1, y1);
  const b = nearestShot(x2, y2);
  return { a: a.i, au: a.u, av: a.v, b: b.i, bu: b.u, bv: b.v };
});

/** Loose amber squares dropped over the field. They land on the gaps between
 *  prints, never centred on one, so they drift on their own slow phase rather
 *  than being pinned to anything. */
const CONFETTI: [number, number][] = [
  [346, 1583],
  [836.3, 1659.19],
  [619.3, 1738.1],
  [391.86, 1801.92],
  [451, 1874.09],
  [780.5, 1935.95],
];

/** Hand-written tags. The source numbers these by eye and repeats "( 4 )";
 *  kept as drawn, since they are marginalia on a contact sheet rather than an
 *  index anyone reads in order.
 *
 *  `owns` pins a tag to a print by hand where proximity gets it wrong. Nearest
 *  print is right for eleven of these, but not all: RUNNING sits 12px off the
 *  corner of the selfie and 62px from the dusk road it actually labels, so
 *  proximity alone would have it drift with the wrong photograph. FOOD wins by
 *  under 3px and ( 5 ) by 4px — both too close to leave to a tie-break that a
 *  future coordinate nudge could flip. */
const TAGS: { text: string; x: number; y: number; px: number; owns?: string }[] = [
  { text: "( 1 )", x: 373, y: 1472, px: 12 },
  { text: "( 2 )", x: 518, y: 1407, px: 12 },
  { text: "( 3 )", x: 496.3, y: 1580.29, px: 13.925 },
  { text: "( 4 )", x: 662, y: 1549, px: 13.925 },
  { text: "( 4 )", x: 467.29, y: 1717.21, px: 13.925 },
  { text: "( 5 )", x: 625, y: 1864, px: 13.925, owns: "fun-09" },
  { text: "( 6 )", x: 498.62, y: 1985.27, px: 13.925 },
  { text: "( 7 )", x: 300, y: 1995, px: 13.925 },
  { text: "( 8 )", x: 986, y: 2106, px: 13.925 },
  { text: "( 9 )", x: 718.27, y: 2200.76, px: 13.925 },
  { text: "ABSOLUTE CINEMA", x: 364, y: 1423, px: 13.925 },
  { text: "FOOD", x: 793, y: 1583, px: 13.925, owns: "fun-04" },
  { text: "RUNNING", x: 437, y: 1760, px: 13.925, owns: "fun-06" },
  { text: "FIRST LOVE", x: 899, y: 1828, px: 13.925, owns: "fun-07" },
];

const TAG_OWNER = TAGS.map((t) =>
  t.owns ? SHOTS.findIndex((s) => s.id === t.owns) : nearestShot(t.x, t.y).i,
);

/** Per-print drift. Two incommensurate periods per print, so x and y never
 *  come back into step and each one traces a slow open figure rather than
 *  rocking along a line. Amplitudes are 6–9 source px against a 126px print:
 *  enough to read as alive, small enough that the composition stays the
 *  composition. Derived from the index rather than randomised, so the server
 *  and the client agree and the motion is the same on every load. */
const DRIFT = SHOTS.map((_, i) => ({
  ax: 6 + (i % 3) * 1.5,
  ay: 5.5 + ((i * 7) % 4) * 1.2,
  wx: (2 * Math.PI) / (9 + (i % 5) * 1.3),
  wy: (2 * Math.PI) / (11 + ((i * 3) % 5) * 0.9),
  phx: i * 2.399,
  phy: i * 1.618 + 0.7,
}));

function Mount({
  shot,
  className = "",
  bare = false,
}: {
  shot: Shot;
  className?: string;
  /** Desktop keeps the border box but paints it transparent, and <MountOutline>
   *  strokes it in SVG so it can boil. Holding the border rather than dropping
   *  it keeps the image's cover-crop byte-identical between the two paths — the
   *  photograph must not shift when the frame changes technique. */
  bare?: boolean;
}) {
  return (
    <span
      className={`relative block overflow-hidden ${className}`}
      style={{ border: `${shot.mount ?? 5}px solid ${bare ? "transparent" : shot.mountColor ?? PURPLE}` }}
    >
      <Image
        src={shot.src}
        alt={shot.alt}
        fill
        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
        className="object-cover"
        style={shot.objectPosition ? { objectPosition: shot.objectPosition } : undefined}
      />
    </span>
  );
}

/** The mount, stroked in SVG so the boil filter can take it. Sits exactly on
 *  the transparent CSS border it replaces: the border is inside the box
 *  (border-box), so its centreline is half a stroke in.
 *
 *  `overflow-visible` on both the svg and a padded filter region, or the
 *  displacement would be clipped back to the box it is trying to wander out of
 *  and the wobble would flatten against all four edges. */
function MountOutline({ shot, boilId }: { shot: Shot; boilId: string }) {
  const [, , w, h] = shot.at;
  const sw = shot.mount ?? 5;
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
    >
      <rect
        className="fun-boil"
        x={sw / 2}
        y={sw / 2}
        width={w - sw}
        height={h - sw}
        stroke={shot.mountColor ?? PURPLE}
        strokeWidth={sw}
        filter={`url(#${boilId})`}
      />
    </svg>
  );
}

/** Endpoint of one join, in source coordinates, given the current offsets. */
const endpoint = (i: number, u: number, v: number, dx: number, dy: number) => {
  const [x, y, w, h] = SHOTS[i].at;
  return [x + u * w + dx - OX, y + v * h + dy - OY];
};

export default function FunGrid() {
  const boilId = `fun-boil-${useId().replace(/:/g, "")}`;
  const stageRef = useRef<HTMLDivElement>(null);
  const shotRefs = useRef<(HTMLElement | null)[]>([]);
  const tagRefs = useRef<(HTMLElement | null)[]>([]);
  const confRefs = useRef<(HTMLElement | null)[]>([]);
  const linkRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let t = 0;
    let last = 0;
    /* Starts true: the loop runs from mount and the observer below only ever
       PAUSES it. Gating the start on an IntersectionObserver instead would mean
       that anywhere the observer is unavailable or throttled the cluster simply
       never moves — a silent, total failure of the effect, traded for a saving
       that only matters while nobody is looking at it. */
    let running = true;
    /* Source px → rendered px. The stage is a percentage of the container, so
       a drift expressed in the source's units has to be scaled before it can be
       written as a CSS transform. The LINES need no such conversion: the SVG
       viewBox is already in source units, so their endpoints go in raw. */
    let k = 1;
    const measure = () => {
      k = stage.clientWidth / STAGE_W || 1;
    };
    measure();

    const frame = (now: number) => {
      /* Clamped so a backgrounded tab does not resume with one enormous step. */
      if (last) t += Math.min(0.05, (now - last) / 1000);
      last = now;

      /* Ease the amplitude in over the first two seconds. The prints are mid-
         cycle at t=0, so starting at full amplitude would snap them off their
         drawn positions the moment the loop begins — and it lets the lines
         finish drawing themselves before anything starts moving. */
      const r = Math.min(1, t / 2);
      const ease = r * r * (3 - 2 * r);

      const off: [number, number][] = DRIFT.map((d) => [
        ease * d.ax * Math.sin(t * d.wx + d.phx),
        ease * d.ay * Math.sin(t * d.wy + d.phy),
      ]);

      for (let i = 0; i < off.length; i++) {
        const el = shotRefs.current[i];
        if (el) el.style.transform = `translate3d(${off[i][0] * k}px, ${off[i][1] * k}px, 0)`;
      }
      /* Tags take their owner's offset verbatim, so a number can never drift
         away from the photograph it annotates. */
      for (let i = 0; i < TAG_OWNER.length; i++) {
        const el = tagRefs.current[i];
        const o = off[TAG_OWNER[i]];
        if (el && o) el.style.transform = `translate3d(${o[0] * k}px, ${o[1] * k}px, 0)`;
      }
      for (let i = 0; i < CONFETTI.length; i++) {
        const el = confRefs.current[i];
        if (!el) continue;
        const dx = ease * 3.2 * Math.sin(t * 0.36 + i * 1.9);
        const dy = ease * 2.8 * Math.sin(t * 0.29 + i * 2.6);
        el.style.transform = `translate3d(${dx * k}px, ${dy * k}px, 0)`;
      }
      /* The discrete boil clock. Floored, so every join re-strikes on the same
         beat and holds between — they are one drawing, not twelve. */
      const at = Math.floor(t * BOIL_FPS) % BOIL_STRIKES;

      /* The whole point: a join is never animated, it is re-derived. Both ends
         are read off the prints they attach to, so the stroke stretches and
         swings entirely as a consequence of where those two have drifted; the
         boil is struck into the middle of it on the way past. */
      for (let i = 0; i < JOINS.length; i++) {
        const el = linkRefs.current[i];
        if (!el) continue;
        const j = JOINS[i];
        const [x1, y1] = endpoint(j.a, j.au, j.av, off[j.a][0], off[j.a][1]);
        const [x2, y2] = endpoint(j.b, j.bu, j.bv, off[j.b][0], off[j.b][1]);
        el.setAttribute("d", joinPath(x1, y1, x2, y2, i, at));
      }
      raf = requestAnimationFrame(frame);
    };

    const ro = new ResizeObserver(measure);
    ro.observe(stage);

    raf = requestAnimationFrame(frame);

    /* Idle while the cluster is off screen — no reason to hold a 60fps loop
       open for something nobody is looking at. Purely an optimisation on top of
       a loop that is already running: `last` is cleared on the way out so the
       clock does not jump on the way back in. */
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
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section aria-labelledby="fun-title" className="relative">
      <div className="page-container relative">
        <div className="relative flex items-center justify-center py-4">
          <DashRule edge="top" />
          <DashRule edge="bottom" />
          <HatchCell
            className="absolute inset-y-0 hidden w-[48px] lg:block"
            style={{ right: "calc(50% + 310px)" }}
            delay={0}
          />
          <h2
            id="fun-title"
            className="type-heading text-ink-hero text-center font-light"
            style={{ fontSize: "clamp(1.5rem, 0.6rem + 2.9vw, 2.375rem)", letterSpacing: "-0.08em" }}
          >
            FUN BEING ACHIEVED
          </h2>
          <HatchCell
            className="absolute inset-y-0 hidden w-[48px] lg:block"
            style={{ left: "calc(50% + 310px)" }}
            delay={120}
          />
        </div>
      </div>

      <div className="page-container mt-16">
        <GrowOnView>
          {/* ---- Desktop: the floating cluster ---------------------------- */}
          <div
            ref={stageRef}
            className="type-caption text-ink-alt relative mx-auto hidden lg:block"
            /* 725 of the source's 1137-wide content, as a percentage rather
               than a px cap: the prints are 126px in a 725px field, and a
               fixed max-width wider than that silently enlarges every one of
               them. Centred, which is where the source leaves it. */
            style={{ width: "63.76%", aspectRatio: `${STAGE_W} / ${STAGE_H}`, containerType: "inline-size" }}
          >
            {/* Lines under everything: they run corner to corner and should
                pass BEHIND the mounts they join, not across them. Rendered at
                zero offset, which is exactly the source geometry — so the
                drawing is already correct before any script runs. */}
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
              fill="none"
              preserveAspectRatio="none"
            >
              {/* The mounts' boil, defined once and referenced by all twelve so
                  they strike on the same beat — the way both draped hands share
                  one set of filter params. Same technique as Hand / TrafficLight
                  / the asterisks: fractalNoise displaced, seed stepping on a
                  discrete SMIL clock. The displacement `scale` is small because
                  this viewBox is in source px, where a 126px print is 126 units;
                  the hands' scale of 6 would tear a 5px stroke apart. */}
              <defs>
                <filter id={boilId} x="-25%" y="-25%" width="150%" height="150%">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.045"
                    numOctaves={2}
                    seed={4}
                    result="noise"
                  >
                    <animate
                      attributeName="seed"
                      dur={`${BOIL_STRIKES / BOIL_FPS}s`}
                      calcMode="discrete"
                      values="4;9;2;7;11;1;6;12;3;8;5;10"
                      repeatCount="indefinite"
                    />
                  </feTurbulence>
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="noise"
                    scale={2.4}
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                </filter>
              </defs>
              {/* Round joins and caps: the boil puts a kink at each interior
                  joint, and a default miter turns every one of those into a
                  spike once the angle gets tight. */}
              <g stroke={PURPLE} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
                {JOINS.map((j, i) => {
                  const [x1, y1] = endpoint(j.a, j.au, j.av, 0, 0);
                  const [x2, y2] = endpoint(j.b, j.bu, j.bv, 0, 0);
                  return (
                    <path
                      key={i}
                      ref={(el) => {
                        linkRefs.current[i] = el;
                      }}
                      className="about-wire"
                      pathLength={1}
                      style={{ ["--d" as string]: `${180 + i * 90}ms` }}
                      /* Struck straight on the server: the boil is an
                         enhancement, so no-JS and reduced-motion both get the
                         clean geometry rather than one frozen wobble. */
                      d={joinPath(x1, y1, x2, y2, i, -1)}
                    />
                  );
                })}
              </g>
            </svg>

            {/* Two elements, not one. The site's `accent-flicker-a` is an
                infinite CSS animation ON TRANSFORM, and a running animation
                beats an inline transform outright — writing the drift onto the
                same element would have it silently discarded and these squares
                would sit still while everything else moved. The outer span
                carries the drift, the inner one keeps the flicker, and the two
                compose. */}
            {CONFETTI.map(([x, y], i) => (
              <span
                key={i}
                aria-hidden
                ref={(el) => {
                  confRefs.current[i] = el;
                }}
                className="absolute will-change-transform"
                style={box(x, y, 24.369, 22.048)}
              >
                <span
                  className="accent-flicker-a block h-full w-full"
                  style={{ background: AMBER, ["--enter" as string]: `${0.4 + i * 0.15}s` }}
                />
              </span>
            ))}

            {SHOTS.map((shot, i) => (
              <span
                key={shot.id}
                ref={(el) => {
                  shotRefs.current[i] = el;
                }}
                className="absolute will-change-transform"
                style={box(...shot.at)}
              >
                <Mount shot={shot} className="h-full w-full" bare />
                <MountOutline shot={shot} boilId={boilId} />
              </span>
            ))}

            {TAGS.map((t, i) => (
              <span
                key={`${t.text}-${i}`}
                ref={(el) => {
                  tagRefs.current[i] = el;
                }}
                className="absolute whitespace-nowrap will-change-transform"
                style={{ left: pct(t.x, "x"), top: pct(t.y, "y"), fontSize: cq(t.px) }}
              >
                {t.text}
              </span>
            ))}

            {/* The two written notes. They sit in open space rather than on a
                print, so they stay put — a sentence sliding around under a
                drifting photograph reads as a bug, not as life. The
                right-aligned one is pinned by its RIGHT edge, which is how the
                source sets it; anchoring it left would let the ragged edge
                drift as the stage scales. */}
            <span
              className="absolute leading-snug"
              style={{ left: pct(508, "x"), top: pct(1640, "y"), fontSize: cq(13.925) }}
            >
              I always welcome
              <br />
              food and sports!!
            </span>
            <span
              className="absolute text-right leading-snug"
              style={{ right: size(STAGE_W - (973.22 - OX), "x"), top: pct(2106, "y"), fontSize: cq(13.925) }}
            >
              Don&rsquo;t get lost here,
              <br />
              I often do.
            </span>
          </div>

          {/* ---- Below lg: the same prints, simply flowed ------------------ */}
          <div className="lg:hidden">
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {SHOTS.map((shot) => (
                <li key={shot.id}>
                  <Mount shot={shot} className="aspect-square" />
                </li>
              ))}
            </ul>
            <p className="type-caption text-ink-alt mt-6 leading-snug">
              I always welcome food and sports!! Don&rsquo;t get lost here, I often do.
            </p>
          </div>
        </GrowOnView>
      </div>
    </section>
  );
}
