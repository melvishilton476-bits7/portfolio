"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { BoilDefs } from "@/components/case/BoiledArt";

/**
 * LAB — the About print as the Figma redraw has it (961:5577): a solid blue
 * card holding the beach photo in black and white, an ISDI badge in its
 * corner, a quote under it, and the bottom of the photo eaten away by blue
 * pixels. Above the head, a channel of small grey shapes rises like thought.
 *
 * THE X-RAY LENS. At rest it is just a photograph. Point at it and the blue
 * box appears under the pointer as a lens: inside it the photo turns to dark
 * blue film and the skeleton shows through, lined up on the body exactly where
 * the redraw placed it. Outside the lens there is no skeleton at all. Leave
 * the photo and the lens closes.
 *
 * The lens is one rectangle driven from one rAF loop: the same rect sets the
 * clip on the X-ray layer and the position of the blue outline, so the window
 * and its frame cannot drift apart. It eases toward the pointer (a slight lag,
 * like dragging a glass across a print) and its size eases between 0 and full,
 * which is the open and close. Positions are written straight to the DOM; a
 * React render per mouse move would be wasted work.
 *
 * MOTION. The pixels blink out and back on their own clocks, so the eaten
 * edge never sits still; the grey shapes drift and turn a little each, like
 * dust in a draught. Both stop under reduced motion (see globals.css).
 *
 * Mouse and pen only. Touch has no hover, so on a phone the photo stays a
 * photo. Under reduced motion the lens still works but snaps instead of
 * easing.
 *
 * Everything is placed on the redraw's own 376 × 505 stage (the card plus the
 * bar under it) and expressed as a percentage of it, so the composition scales
 * as one piece. Type is in container units for the same reason.
 */

/** The card's corner on the Figma canvas: every redraw coordinate less this. */
const O = { x: 775.89, y: 357 };
const W = 376.11;
const H = 505.45;
const CARD_H = 474.851;
const BLUE = "#003cff";

/** The photo's box on the stage. */
const P = { x: 18.84, y: 15.26, w: 336.614, h: 376.11 };
/** The lens, the redraw's blue square. */
const LENS = { w: 95, h: 89 };
/** The skeleton, where the redraw lays it over the body. */
const SKELETON = { x: 59.11, y: 180, w: 221.715, h: 211 };

/** How much of the remaining distance the lens covers each frame. */
const FOLLOW = 0.22;
const GROW = 0.24;

const x = (v: number) => `${(v / W) * 100}%`;
const y = (v: number) => `${(v / H) * 100}%`;
/** A canvas px measure, scaled with the stage's width. */
const cq = (v: number) => `${(v / W) * 100}cqw`;
const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

/** The pixels eating the photo, as canvas [left, top] (w, h when not square),
 *  straight off the redraw. */
const PX = 12.102;
const PIXELS: readonly [number, number, number?, number?][] = [
  [794.29, 490.12],
  [794.29, 582.91],
  [794.29, 607.11],
  [818.5, 545.26],
  [818.5, 607.11],
  [1012.13, 577.53],
  [1065.91, 623.25],
  [1096.84, 565.43],
  [794.29, 663.59],
  [806.4, 663.59],
  [794.29, 675.69],
  [1090.12, 664.93],
  [1102.22, 664.93],
  [1090.12, 677.03],
  [1114.32, 677.03],
  [1126.42, 677.03],
  [1090.12, 689.14],
  [1102.22, 689.14],
  [1090.12, 701.24],
  [1053.81, 689.14],
  [1065.91, 689.14],
  [1078.02, 689.14],
  [1053.81, 701.24],
  [1065.91, 701.24],
  [1078.02, 701.24],
  [856.15, 712, PX, 13.447],
  [943.55, 713.34],
  [955.65, 713.34],
  [1017.51, 713.34],
  [1029.61, 713.34],
  [1041.71, 713.34],
  [1053.81, 713.34],
  [1065.91, 713.34],
  [1078.02, 713.34],
  [794.29, 725.44],
  [818.5, 725.44, 13.447],
  [844.05, 725.44],
  [881.7, 725.44],
  [893.8, 725.44],
  [905.9, 725.44],
  [918, 725.44],
  [930.11, 725.44, 13.447],
  [981.2, 725.44],
  [1017.51, 725.44],
  [1029.61, 725.44],
  [1041.71, 725.44],
  [1053.81, 725.44],
  [1065.91, 725.44],
  [1078.02, 725.44],
  [794.29, 737.54],
  [806.4, 737.54],
  [831.94, 737.54],
  [856.15, 737.54],
  [868.25, 737.54, 13.447],
  [881.7, 737.54],
  [893.8, 737.54],
  [905.9, 737.54],
  [918, 737.54],
  [967.76, 737.54],
  [979.86, 737.54],
  [991.96, 737.54],
  [1004.06, 737.54],
];

/** A fixed scatter in [0, 1), so server and client agree on every clock. */
const jitter = (i: number, salt: number) => {
  const s = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return s - Math.floor(s);
};

export default function BeachStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const hitRef = useRef<HTMLDivElement>(null);
  const xrayRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const hit = hitRef.current;
    const xray = xrayRef.current;
    const box = boxRef.current;
    if (!stage || !hit || !xray || !box) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    /* The lens stays shut while the card is still sliding in (.lab-land), so
       nobody chases a moving target. No animation running (reduced motion)
       means it has already landed. */
    let landed = getComputedStyle(stage).animationName === "none";
    /* The cue to hover: once the card has landed, the lens opens over the
       head by itself for a moment and closes, and the hint on the card holds
       until the reader takes over. Mouse and pen only, like the lens. */
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let touched = false;
    let peekTimer: ReturnType<typeof setTimeout> | undefined;
    const peek = () => {
      if (!canHover) return;
      peekTimer = setTimeout(() => {
        if (touched) return;
        cx = tx = clamp(PEEK.x, P.x + LENS.w / 2, P.x + P.w - LENS.w / 2);
        cy = ty = clamp(PEEK.y, P.y + LENS.h / 2, P.y + P.h - LENS.h / 2);
        target = 1;
        kick();
        peekTimer = setTimeout(() => {
          if (touched) return;
          target = 0;
          kick();
        }, 1500);
      }, 450);
    };
    const land = (e: AnimationEvent) => {
      if (e.target !== stage) return;
      landed = true;
      peek();
    };
    stage.addEventListener("animationend", land);

    // Centre of the lens, in stage units, and how open it is (0 to 1).
    let cx = 0;
    let cy = 0;
    let tx = 0;
    let ty = 0;
    let grow = 0;
    let target = 0;
    let raf = 0;

    const paint = () => {
      const w = LENS.w * grow;
      const h = LENS.h * grow;
      const left = cx - w / 2;
      const top = cy - h / 2;
      // inset() takes distances from each edge, as a share of the stage.
      xray.style.clipPath = `inset(${(top / H) * 100}% ${((W - left - w) / W) * 100}% ${((H - top - h) / H) * 100}% ${(left / W) * 100}%)`;
      box.style.left = x(left);
      box.style.top = y(top);
      box.style.width = x(w);
      box.style.height = y(h);
      box.style.opacity = String(Math.min(1, grow * 1.6));
    };

    const tick = () => {
      if (reduce) {
        cx = tx;
        cy = ty;
        grow = target;
      } else {
        cx += (tx - cx) * FOLLOW;
        cy += (ty - cy) * FOLLOW;
        grow += (target - grow) * GROW;
      }
      paint();
      const settled =
        Math.abs(tx - cx) < 0.05 &&
        Math.abs(ty - cy) < 0.05 &&
        Math.abs(target - grow) < 0.005;
      if (settled) {
        grow = target;
        paint();
        raf = 0;
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    /** The pointer, in stage units, with the lens kept wholly on the photo. */
    const aim = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const sx = ((e.clientX - r.left) / r.width) * W;
      const sy = ((e.clientY - r.top) / r.height) * H;
      tx = clamp(sx, P.x + LENS.w / 2, P.x + P.w - LENS.w / 2);
      ty = clamp(sy, P.y + LENS.h / 2, P.y + P.h - LENS.h / 2);
    };

    const enter = (e: PointerEvent) => {
      if (e.pointerType === "touch" || !landed) return;
      if (!touched) {
        touched = true;
        clearTimeout(peekTimer);
        hintRef.current?.style.setProperty("opacity", "0");
      }
      aim(e);
      // Open where the pointer came in, not from wherever it last closed.
      if (grow < 0.01) {
        cx = tx;
        cy = ty;
      }
      target = 1;
      kick();
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch" || !landed) return;
      aim(e);
      target = 1;
      kick();
    };
    const leave = () => {
      target = 0;
      kick();
    };

    hit.addEventListener("pointerenter", enter);
    hit.addEventListener("pointermove", move, { passive: true });
    hit.addEventListener("pointerleave", leave);
    paint();
    if (landed) peek();
    return () => {
      clearTimeout(peekTimer);
      hit.removeEventListener("pointerenter", enter);
      hit.removeEventListener("pointermove", move);
      hit.removeEventListener("pointerleave", leave);
      stage.removeEventListener("animationend", land);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const photoBox = { left: x(P.x), top: y(P.y), width: x(P.w), height: y(P.h) };

  return (
    <div
      ref={stageRef}
      className="lab-land relative w-full [container-type:inline-size]"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      {/* A fine line boil for the lens outline. */}
      <BoilDefs id="beach" count={3} frequency={0.06} scale={1.2} />
      {/* The skeleton boils harder: it is solid shapes, not hairlines, so it
          can take a bigger push without breaking up, and inside a small lens a
          faint tremor would go unseen. */}
      <BoilDefs id="bone" count={2} frequency={0.045} scale={3.2} />
      {/* The jet's edges: a fine, fast tremor, its own seeds and rate. */}
      <BoilDefs id="jet" count={1} frequency={0.05} scale={2.6} />

      {/* The card. */}
      <span
        aria-hidden
        className="lab-land-shadow absolute left-0 top-0 w-full shadow-[0_6.675px_16.355px_rgba(0,0,0,0.09)]"
        style={{ height: y(CARD_H), background: BLUE }}
      />

      {/* The photo, filled to the box exactly as Figma renders it. It is also
          the lens's hit area, and tells the site cursor to stand down here:
          the lens IS the pointer. */}
      <div
        ref={hitRef}
        data-cursor-none
        className="absolute overflow-hidden"
        style={photoBox}
      >
        <Image
          src="/about/lab/beach-bw.png"
          alt="Melvis on a beach, grinning, holding a kite string. Pointing at the photo shows an X-ray of his skeleton."
          fill
          sizes="(max-width: 1024px) 80vw, 560px"
          className="object-fill"
        />
      </div>

      {/* The X-ray: the same photo as dark blue film with the skeleton on it,
          shown only through the lens's clip. Covers the whole stage so the
          skeleton keeps the redraw's coordinates. */}
      <div
        ref={xrayRef}
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ clipPath: "inset(50% 50% 50% 50%)" }}
      >
        <div className="absolute overflow-hidden" style={photoBox}>
          <Image
            src="/about/lab/beach-bw.png"
            alt=""
            fill
            sizes="(max-width: 1024px) 80vw, 560px"
            className="object-fill"
            style={{
              filter:
                "brightness(0.34) contrast(1.25) sepia(1) hue-rotate(185deg) saturate(1.8)",
            }}
          />
        </div>
        {/* The thought jet: warm light rising out of the skull. Under the
            skeleton, so the bone hides where it starts. */}
        <Fragments />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/about/lab/skeleton.svg"
          alt=""
          className="absolute"
          style={{
            left: x(SKELETON.x),
            top: y(SKELETON.y),
            width: x(SKELETON.w),
            height: y(SKELETON.h),
            filter:
              "url(#boil-bone-1) drop-shadow(0 0 3px rgb(170 200 255 / 0.55))",
          }}
        />
      </div>

      {/* The pixels eating the photo. Over the X-ray too: they are holes in
          the print, not part of the picture. Each blinks on its own clock. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {PIXELS.map(([l, t, w = PX, h = PX], i) => (
          <span
            key={`${l}-${t}`}
            className="lab-pixel absolute"
            style={
              {
                left: x(l - O.x),
                top: y(t - O.y),
                width: x(w),
                height: y(h),
                background: BLUE,
                "--dur": `${(3.2 + jitter(i, 1) * 4).toFixed(2)}s`,
                "--delay": `${(-jitter(i, 2) * 7).toFixed(2)}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      {/* The lens's outline, sized and placed by the loop above. */}
      <span
        ref={boxRef}
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          opacity: 0,
          border: `${cq(2.655)} solid ${BLUE}`,
          filter: "url(#boil-beach-2)",
        }}
      >
        {/* White dots on the four corners, centred on the stroke itself
            rather than the inside edge: children of a bordered box are placed
            from inside the border, so each is pulled back half its width. */}
        {(
          [
            "left-0 top-0",
            "right-0 top-0",
            "left-0 bottom-0",
            "right-0 bottom-0",
          ] as const
        ).map((at) => (
          <span
            key={at}
            className={`absolute ${at} block size-[5px] rounded-full bg-white`}
            style={{
              margin: `calc(${cq(2.655)} / -2)`,
              translate: `${at.includes("left") ? "-50%" : "50%"} ${at.includes("top") ? "-50%" : "50%"}`,
            }}
          />
        ))}
      </span>

      {/* The ISDI badge and its status line. Above the lens, as it is above
          the photo: it is a label on the print, not part of the picture. */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: x(34.54),
          top: y(32.39),
          width: x(32.272),
          aspectRatio: "1",
        }}
      >
        <Image
          src="/about/lab/isdi.png"
          alt="ISDI"
          fill
          sizes="40px"
          className="object-cover"
        />
      </div>
      <p
        className="pointer-events-none absolute text-white"
        style={{
          left: x(76.22),
          top: y(35.08),
          fontSize: cq(8),
          lineHeight: 1.417,
          letterSpacing: "-0.05em",
        }}
      >
        <span className="block font-medium">B.Des, ISDI</span>
        <span className="block">
          Status: <span className="font-medium">In progress..</span>
        </span>
      </p>

      {/* The hover cue, bottom right of the card. Gone after the first hover,
          and never shown where there is no hover to give. */}
      <p
        ref={hintRef}
        aria-hidden
        className="pointer-events-none absolute hidden font-mono text-white/70 transition-opacity duration-500 [@media(hover:hover)_and_(pointer:fine)]:block"
        style={{ right: x(W - 355), top: y(452), fontSize: cq(7), letterSpacing: "-0.04em" }}
      >
        <span className="lab-hint-blink">●</span> hover to see my true self
      </p>

      {/* The quote, under the photo on the card. */}
      <p
        className="absolute -translate-x-1/2 text-center font-mono text-white"
        style={{
          left: x(189.18),
          top: y(412.82),
          width: x(296),
          fontSize: cq(10),
          lineHeight: 1.3,
          letterSpacing: "-0.08em",
        }}
      >
        “ You are only ever entitled to the work,
        <br />
        never to the fruits of your work ”
      </p>

      {/* The bar under it all. */}
      <span
        aria-hidden
        className="lab-land-bar pointer-events-none absolute"
        style={{
          left: x(152.87),
          top: y(494.84),
          width: x(45.968),
          height: y(10.608),
          background: BLUE,
        }}
      />
    </div>
  );
}

/* ── The pins behind the card ─────────────────────────────────────────────
   Three small clusters of coloured stops joined by short blue lines, tucked
   behind the card's edges so each half shows: two on the top-left, a bent
   chain of three on the lower left, a pair under the bottom-right corner.
   Outside the stage's slide-in, so the card arrives over them. The lines
   draw in, then the stops pop; boiled like the rest of the card's line work.
   Hidden on phones, where there is no page beside the card. Stage units:
   the card spans 0–376 by 0–475. */

/** Where the lens peeks on its own, over the head. */
const PEEK = { x: 186, y: 214 };

const PIN_R = 11.5;

/** Each stop and its colour, out of the transit-map palette. */
const PINS: [number, number, string][] = [
  [-27, 12, "#e8673f"],
  [-27, 55, "#f2bccb"],
  [-55, 386, "#7aa98e"],
  [-27, 415, "#f6cf3a"],
  [-27, 459, "#88acd8"],
  [321, 501, "#f2bccb"],
  [365, 501, "#e8673f"],
];

/** Each line, through the stops it joins. */
const PIN_LINES: [number, number][][] = [
  [[-27, 12], [-27, 55]],
  [[-55, 386], [-27, 415], [-27, 459]],
  [[321, 501], [365, 501]],
];

export function StageNetwork() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 hidden w-full overflow-visible sm:block"
      style={{ aspectRatio: `${W} / ${H}` }}
      viewBox={`0 0 ${W} ${H}`}
    >
      <BoilDefs id="net" count={1} frequency={0.05} scale={2.4} />
      <g filter="url(#boil-net-0)">
        <g fill="none" stroke={BLUE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          {PIN_LINES.map((l, i) => (
            <polyline
              key={i}
              className="lab-net-line"
              pathLength={1}
              points={l.map((p) => p.join(",")).join(" ")}
              style={{ ["--at" as string]: `${0.35 + 0.1 * i}s` }}
            />
          ))}
        </g>
        {PINS.map(([x, y, fill], i) => (
          <circle
            key={i}
            className="lab-net-stop"
            cx={x}
            cy={y}
            r={PIN_R}
            fill={fill}
            style={{ ["--at" as string]: `${0.1 + 0.05 * i}s`, transformOrigin: `${x}px ${y}px` }}
          />
        ))}
      </g>
    </svg>
  );
}

/* ── The thought jet ──────────────────────────────────────────────────────
   Seen only through the X-ray: a jet of warm light rising out of the skull,
   after the After Effects "wave warp" build. Three nested cones, orange
   outside, yellow, then a white core, all from one
   point under the crown and widening toward the top of the photo. A wave
   warp shifts every point sideways by a sine of its height, the wave running
   up the jet and growing toward the top. The push depends on height alone,
   so both sides of all three cones sway together and the jet snakes as one
   body, its layers nested exactly; a second, faster harmonic keeps the sway
   from looking mechanical. A fine line boil makes the edges tremble, and
   flat colour, a soft glow and a grain finish it, as in the reference.

   The cones are rebuilt each frame, one rAF loop writing three paths, run
   only while the card is on screen. The root sits under the skeleton, so the
   skull hides where the jet starts. Under reduced motion the jet is drawn
   once and holds still. */

/** Where the jet starts, under the crown, and how high it reaches, in stage
 *  units. The skull is x 165–206, crown at y 188 (off skeleton.svg). */
const ROOT = { x: 185.6, y: 200 };
const JET_TOP = 4;
/** Half the outer cone's width at the top. */
const JET_HALF = 82;
/** The wave: length in stage units, seconds per cycle, sway at the top. */
const WARP = { length: 92, secs: 1.6, amp: 15 };
const SAMPLES = 64;

/** Outside in: each cone's colour and its share of the outer width. */
const CONES = [
  { fill: "#ff6a10", share: 1 },
  { fill: "#ffc21a", share: 0.7 },
  { fill: "#fffaf0", share: 0.44 },
] as const;

/** The wave warp: how far a point at height `py` is pushed sideways. Height
 *  only, as in After Effects, so every edge at one height moves together. */
function warp(py: number, secs: number) {
  const s = (ROOT.y - py) / (ROOT.y - JET_TOP); // 0 at the root, 1 at the top
  const amp = WARP.amp * (0.08 + 0.92 * s);
  const k = (2 * Math.PI) / WARP.length;
  const w = (2 * Math.PI) / WARP.secs;
  // + w·t moves the crests toward smaller y: up the jet.
  return (
    amp * Math.sin(k * py + w * secs) +
    amp * 0.35 * Math.sin(2.3 * k * py + 1.7 * w * secs + 1.3)
  );
}

/** One cone's outline at time `secs`, as a closed path. */
function conePath(share: number, secs: number) {
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const s = i / SAMPLES;
    const py = ROOT.y - s * (ROOT.y - JET_TOP);
    const half = (1.6 + JET_HALF * Math.pow(s, 0.9)) * share;
    const lx = ROOT.x - half;
    const rx = ROOT.x + half;
    left.push(`${(lx + warp(py, secs)).toFixed(2)} ${py.toFixed(2)}`);
    right.push(`${(rx + warp(py, secs)).toFixed(2)} ${py.toFixed(2)}`);
  }
  return `M${left.join("L")}L${right.reverse().join("L")}Z`;
}

function Fragments() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const paths = Array.from(
      svg.querySelectorAll<SVGPathElement>("[data-cone]"),
    );
    const draw = (secs: number) => {
      paths.forEach((p) =>
        p.setAttribute("d", conePath(Number(p.dataset.cone), secs)),
      );
    };

    draw(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let start = 0;
    const loop = (now: number) => {
      if (!start) start = now;
      draw((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !raf) raf = requestAnimationFrame(loop);
      if (!e.isIntersecting && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(svg);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      viewBox={`0 0 ${W} ${H}`}
    >
      <defs>
        {/* A soft glow under the flat colour, then fine pale grain on top,
            kept to the jet. */}
        <filter
          id="jet-finish"
          filterUnits="userSpaceOnUse"
          x="-20"
          y="-30"
          width={W + 40}
          height={H + 40}
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="glow" />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.1"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.6 0 0 0 -0.98"
            result="specks"
          />
          <feComposite
            in="specks"
            in2="SourceGraphic"
            operator="in"
            result="grain"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="grain" />
          </feMerge>
        </filter>
      </defs>
      {/* Boil the edges first, then glow and grain the boiled shape. */}
      <g filter="url(#jet-finish)">
        <g filter="url(#boil-jet-0)">
          {CONES.map((c) => (
            <path
              key={c.fill}
              data-cone={c.share}
              fill={c.fill}
              d={conePath(c.share, 0)}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}
