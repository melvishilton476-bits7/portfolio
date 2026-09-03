/**
 * The Kabini logotype — the letter K resolving into a leopard — carrying the
 * site's roughen-edges "boil", the pencil markup that circles the two places
 * where the letter and the animal are the same strokes, and the two notes
 * that markup is pointing at.
 *
 * Artwork, rings, leaders and arrowheads all live in ONE svg now, in a single
 * viewBox that matches the figure's own 16:9 box exactly. That is what lets
 * the two callouts sit in real margin space around the mark instead of
 * cramped against it: the logo is placed at a fixed, hand-chosen rect inside
 * that viewBox (IMG), everything else is authored in the logo's native
 * 818x296 space and reaches the viewBox through one shared `translate+scale`
 * — so moving or resizing the mark is a two-number edit, not a re-plot of
 * every ring and leader. The two <p> callouts are plain HTML, positioned by
 * the same percentages, because multi-line copy in an SVG <text> fights the
 * site's own type system for no reason.
 *
 * The boil is the same feTurbulence → feDisplacementMap pair as the hands,
 * the fireplace, the cat, the asterisks and the Titan logo directions — one
 * filter on the whole group, so the artwork and its markup shimmer on the
 * same frames. Gentler than <DirectionMark>'s (scale 3, baseFrequency 0.04):
 * those are rejected directions and are meant to look unresolved, and this
 * artwork is a thin outline rather than a filled silhouette — a contour that
 * thin tears rather than wobbles if pushed as hard.
 *
 * The rings loop their draw-in rather than firing once like the Titan
 * construction diagram's `.tc-line` does: this page has no single "arrival"
 * moment to spend it on, so they keep re-tracing themselves the way a
 * presenter circles something twice for emphasis. See `.kabini-ring` in
 * globals.css. The leaders and arrowheads stay put — they are the pointer,
 * not the emphasis, and a wandering arrow would be distracting rather than
 * legible.
 */

const BOIL_ID = "kabini-logo-boil";
const SEEDS = [4, 9, 2, 7, 11, 1, 6, 12, 3, 8, 5, 10];

/** The figure's own coordinate space — matches its 16:9 box exactly, so every
 *  percentage below is also the on-screen percentage. */
const VB_W = 1000;
const VB_H = 562.5;

/** The logo's own export dimensions. Rings and leaders below are authored
 *  against these, then reach the viewBox through IMG's transform. */
const SRC_W = 818;
const SRC_H = 296;

/** The mark's placed rect: 52% of the viewBox width, aspect-locked, centred
 *  slightly right and vertically centred — chosen to leave a wide margin
 *  top-left for the K note and a tall one bottom-right for the head note,
 *  matching where their leaders actually land. */
const IMG_W = 0.52 * VB_W;
const IMG_H = IMG_W / (SRC_W / SRC_H);
const IMG_X = 0.3 * VB_W;
const IMG_Y = (VB_H - IMG_H) / 2;
const SCALE = IMG_W / SRC_W;
const IMG_TRANSFORM = `translate(${IMG_X} ${IMG_Y}) scale(${SCALE})`;

/**
 * One hand-drawn ring — an ellipse over-run past its own start, the way a
 * ring drawn in one pass around something actually closes. Generated rather
 * than hand-authored so the two rings are demonstrably the same gesture at
 * two sizes, and so the overshoot and wobble stay tied to the radius instead
 * of being re-eyeballed per ring. `wobble` rides on a pair of primes so the
 * radius never repeats on a lap — a ring that varied on a period would read
 * as a scallop, not a scribble. Authored in the logo's own 818x296 space.
 */
function ring(cx: number, cy: number, rx: number, ry: number, turns: number, from: number) {
  const STEPS = Math.round(turns * 28);
  const pts: string[] = [];

  for (let i = 0; i <= STEPS; i++) {
    const t = from + (i / STEPS) * turns * Math.PI * 2;
    const drift = (i / STEPS) * 6;
    const wobble = 1 + 0.045 * Math.sin(t * 3.1) + 0.03 * Math.cos(t * 5.7);
    const x = cx + drift + Math.cos(t) * rx * wobble;
    const y = cy - drift * 0.4 + Math.sin(t) * ry * wobble;
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }

  return pts.join(" ");
}

/** The two rings, in the logo's own space. The first takes in the K and the
 *  shoulder it doubles as; the second takes the head, where the animal stops
 *  being a letter. `pathLength={1}` normalises the draw-in below to a 0–1
 *  range regardless of each ring's real length. */
const RINGS = [
  { d: ring(420, 148, 85, 52, 1.32, 2.5), w: 2.6, className: "kabini-ring" },
  { d: ring(694, 84, 48, 29, 1.28, 2.1), w: 2.4, className: "kabini-ring kabini-ring--b" },
];

/** Each ring's leader, authored directly in the VIEWBOX space (not the
 *  logo's) since they run from the callout text, past the mark's edge, to a
 *  point just short of its ring — three zones the logo's own transform
 *  doesn't cover. Ends short of the ring so the arrowhead reads as pointing
 *  at the circle rather than into it. */
const LEADERS = [
  {
    d: "M402 204 C 435 222, 470 245, 502 265",
    head: "M502 265 L499 257 M502 265 L494 263",
  },
  {
    d: "M830 410 C 800 360, 780 310, 763 269",
    head: "M763 269 L762 277 M763 269 L769 274",
  },
];

/** 24px graph-paper ruling, matching the blueprint grid the hero and Titan's
 *  construction diagrams already draw in — the mark reads as if it's still
 *  on the drafting sheet rather than dropped on a flat swatch. Two repeating
 *  gradients rather than an SVG pattern so it scales with the box for free. */
const GRID_BG =
  "repeating-linear-gradient(to right, rgba(23,23,23,0.08) 0 1px, transparent 1px 24px), " +
  "repeating-linear-gradient(to bottom, rgba(23,23,23,0.08) 0 1px, transparent 1px 24px)";

export default function KabiniLogo() {
  return (
    // The camera. Fixed frame, clipped — everything below is one continuous
    // sheet twice this wide that slides leftward underneath it.
    <div
      className="absolute inset-0 overflow-hidden bg-surface"
      role="img"
      aria-label="The Kabini logotype — a leopard formed out of the letter K, the animal's spine and tail reading as the letter's diagonal strokes. The view pans right across the drafting sheet, from the pencil construction drawing with its two circled details to the finished mark in green and yellow."
    >
      {/* The sheet. Two frames wide, with ONE continuous grid across both, so
          the pan reads as a camera travelling over a single drawing board
          rather than two slides cutting. The pan is on `.is-grown`, which the
          <Figure>'s own GrowOnView puts on an ancestor — so it starts when the
          figure arrives rather than while it is still below the fold. */}
      <div
        className="kabini-pan absolute inset-y-0 left-0 flex w-[200%]"
        style={{ backgroundImage: GRID_BG }}
      >
        <div className="relative h-full w-1/2 shrink-0">
      <svg aria-hidden viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-full w-full">
        <defs>
          {/* Generous region: the displacement pushes edges outside the
              element's own box, and the default -10%/120% clips them flat. */}
          <filter id={BOIL_ID} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.03"
              numOctaves={2}
              seed={SEEDS[0]}
              result="noise"
            >
              <animate
                attributeName="seed"
                dur="1.8s"
                calcMode="discrete"
                values={SEEDS.join(";")}
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={2.5}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        {/* One filtered group for the mark and everything pointing at it, so
            all of it shimmers together rather than on separate clocks. */}
        <g className="direction-boil" style={{ filter: `url(#${BOIL_ID})` }}>
          <image
            href="/case/nagarhole/logo-kabini.svg"
            x={0}
            y={0}
            width={SRC_W}
            height={SRC_H}
            transform={IMG_TRANSFORM}
          />

          <g transform={IMG_TRANSFORM} fill="none" stroke="var(--color-ink)" strokeLinecap="round" strokeLinejoin="round">
            {RINGS.map((r, i) => (
              <path
                key={`ring-${i}`}
                d={r.d}
                strokeWidth={r.w}
                strokeOpacity={0.85}
                pathLength={1}
                className={r.className}
              />
            ))}
          </g>

          <g fill="none" stroke="var(--color-ink)" strokeLinecap="round" strokeLinejoin="round">
            {LEADERS.map((l, i) => (
              <g key={`lead-${i}`} strokeWidth={1.4} strokeOpacity={0.7}>
                <path d={l.d} />
                <path d={l.head} />
              </g>
            ))}
          </g>
        </g>
      </svg>

      {/* The two notes the leaders point from. Positioned by the same
          percentages the leaders' own start points use, so a leader always
          visibly originates at its note's edge regardless of the figure's
          rendered size. */}
      <p
        className="type-caption text-pretty absolute leading-relaxed"
        style={{ left: "2%", top: "8%", width: "24%", fontWeight: 300 }}
      >
        The logo is centered around the letter &ldquo;K,&rdquo; representing Kabini.
      </p>
      <p
        className="type-caption text-pretty absolute text-center leading-relaxed"
        style={{ left: "67%", top: "75%", width: "30%", fontWeight: 300 }}
      >
        Seamlessly integrated into the form of a leopard to reflect the park&rsquo;s
        wildlife identity.
      </p>
        </div>

        {/* The payoff frame. No boil here, deliberately: on this site a wobble
            means unresolved — it is what marks the rejected Titan directions
            and the construction drawing to the left. The shipped mark holds
            still. */}
        <div className="relative flex h-full w-1/2 shrink-0 items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/case/nagarhole/logo-kabini-final.svg"
            alt=""
            className="w-[64%] object-contain"
          />
        </div>
      </div>
    </div>
  );
}
