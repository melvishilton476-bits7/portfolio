import Image from "next/image";

/**
 * One or more of the workshop's own drawings, unframed, with a live line boil.
 *
 * These stand beside the outcome numbers where a photograph would otherwise go.
 * That is deliberate: the evidence for "more than thirty hands went up" is a
 * room we did not photograph, and a stock-feeling stand-in would be pretending.
 * A drawing illustrates the claim without claiming to document it.
 *
 * LINE BOIL: each drawing is pushed through a turbulence field whose seed steps
 * on a timer, so its outline is re-traced a few times a second. That is what
 * hand-inked animation gets for free — no two traces of a line land in the same
 * place — and it is why a still drawing beside a moving page reads as a
 * placeholder while a boiling one reads as alive.
 *
 * Every drawing gets its own filter at its own rate. Boiling in lockstep reads
 * as the picture shaking rather than the drawings breathing.
 *
 * SMIL inside the filter rather than JS: the animation is a property of the
 * drawing, it costs no main thread, and nothing here needs to be a client
 * component for it.
 */

export type Drawing = {
  src: string;
  /** The export's own pixel box, for the intrinsic ratio. */
  w: number;
  h: number;
};

/** Cycle lengths for the boil, deliberately not multiples of one another. */
const RATES = ["0.42s", "0.33s", "0.48s", "0.38s", "0.45s"];

/**
 * The filter definitions on their own, for layouts that place their own art.
 *
 * Zero-sized and out of the flow: this SVG is a definitions block, not a
 * picture. Apply one with `filter: url(#boil-<id>-<i>)` — it works on a raster
 * <img> exactly as it does on an SVG, because the filter runs on the rendered
 * pixels rather than on the paths.
 */
export function BoilDefs({
  id,
  count,
  scale = 2.4,
  ink,
}: {
  id: string;
  count: number;
  /** Alpha gamma, for line art whose hairlines wash out when downscaled. A
   *  2px stroke drawn on a 900px artboard is a third of a pixel at 124px, so
   *  it survives only as a pale anti-aliased smear — the ink is already
   *  near-black, it is the COVERAGE that is missing. An exponent below 1
   *  pushes those partial pixels back toward opaque, which reads as the line
   *  being drawn at the size it is shown at. Leave unset for art that is
   *  already solid. */
  ink?: number;
  /** How far the line is pushed, in px. Scale it with the art: 2.4 reads as a
   *  hand-drawn wobble at 200px tall and as a smudge at 60. */
  scale?: number;
}) {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <defs>
        {Array.from({ length: count }, (_, i) => (
          <filter key={i} id={`boil-${id}-${i}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018"
              numOctaves="2"
              result="noise"
              seed={i * 7 + 1}
            >
              {/* Discrete, not linear: the line should JUMP to a new trace the
                  way a newly drawn frame does. Eased between seeds it looks
                  like melting instead. */}
              <animate
                attributeName="seed"
                values={`${i * 7 + 1};${i * 7 + 2};${i * 7 + 3}`}
                dur={RATES[i % RATES.length]}
                calcMode="discrete"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={scale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
            {ink != null ? (
              <feComponentTransfer>
                <feFuncA type="gamma" exponent={ink} />
              </feComponentTransfer>
            ) : null}
          </filter>
        ))}
      </defs>
    </svg>
  );
}

export default function BoiledArt({
  id,
  art,
  height = 220,
}: {
  /** Unique within the page — the SVG filter ids are built from it. */
  id: string;
  art: readonly Drawing[];
  /** Height of the TALLEST drawing, in px at desktop. The others are sized
   *  against it so their differences survive. */
  height?: number;
}) {
  const tallest = Math.max(...art.map((a) => a.h));

  return (
    <div
      className="flex items-end justify-center gap-[6%]"
      style={{ height, ["--boil-h" as string]: `${height}px` }}
    >
      <BoilDefs id={id} count={art.length} />

      {art.map((a, i) => (
        <Image
          key={a.src}
          src={a.src}
          alt=""
          aria-hidden
          width={a.w}
          height={a.h}
          // Served as-is: next/image will not run an SVG through the optimizer
          // without dangerouslyAllowSVG, and there is nothing to optimize in a
          // file that is already paths.
          unoptimized
          // Sized against the tallest rather than normalised — arms reach
          // different distances, and levelling them off loses the drawing.
          style={{
            height: `${(a.h / tallest) * 100}%`,
            width: "auto",
            filter: `url(#boil-${id}-${i})`,
          }}
        />
      ))}
    </div>
  );
}
