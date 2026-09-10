/**
 * The three builder directions, as the wireframes themselves rather than the
 * Placeholder that stood in for them.
 *
 * These are deliberately grey wireframes, not screenshots: the argument the
 * set is making is about WHERE the surfaces sit — a form filling the frame, a
 * canvas filling the frame, a form beside a canvas — and real UI at this size
 * would hand the reader a wall of unreadable labels to squint at instead of a
 * layout to compare. Stripped to blocks and a dot grid, the three read as one
 * comparison at a glance.
 *
 * Each carries the site's roughen-edges "boil" — the same feTurbulence →
 * feDisplacementMap pair behind the hands, the fireplace, the species icons
 * and Titan's logo directions. It does the same second job it does there:
 * these are proposals, two of which lost, and a drawing that won't sit still
 * reads as unresolved in a way a crisp export never would.
 *
 * The displacement is tuned FINE rather than broad: baseFrequency 0.05 is
 * above both <DirectionMark>'s 0.04 and <SpeciesIcons>' 0.035, so the noise
 * field turns over inside the width of a single wireframe block and every
 * edge ripples along its own length instead of the whole drawing swimming as
 * one. Scale 2.2 then gives that ripple enough amplitude to read at the size
 * these actually render — displacement is measured in CSS pixels, and a
 * 1512-wide artboard shown at ~465px means each pixel of warp costs about 3
 * artboard pixels, so it takes less than it looks like it should.
 *
 * Plain <img> rather than next/image, the same call <DirectionMark> and
 * <SpeciesIcons> make: Next won't optimise SVG without `dangerouslyAllowSVG`,
 * so next/image would only wrap the same request.
 */

/** The artboard every export shares. The set's frame is given this ratio so
 *  nothing is cropped or letterboxed. */
export const DIRECTION_RATIO = 1512 / 982;

/** Stepped discretely at the ~7fps the rest of the site's boils run at. */
const SEEDS = [4, 9, 2, 7, 11, 1, 6, 12, 3, 8, 5, 10];

const boilId = (i: number) => `zenxo-direction-boil-${i}`;

/** Renders once per set. Zero-size and out of flow: it exists only to own the
 *  filter definitions the wireframes point at. Filter ids are document-scoped,
 *  so each direction needs its own rather than three sharing one — sharing
 *  would also wobble all three on the same frame, which reads as one animation
 *  applied three times rather than three drawings. */
export function DirectionBoilDefs({ count }: { count: number }) {
  return (
    <svg aria-hidden width={0} height={0} className="absolute" style={{ position: "absolute" }}>
      <defs>
        {Array.from({ length: count }, (_, i) => (
          <filter
            key={i}
            id={boilId(i)}
            // Generous region: the displacement pushes edges outside the
            // element's own box, and the default -10%/120% clips them flat.
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.05"
              numOctaves={2}
              seed={SEEDS[i % SEEDS.length]}
              result="noise"
            >
              <animate
                attributeName="seed"
                dur="1.8s"
                calcMode="discrete"
                values={[...SEEDS.slice(i * 4), ...SEEDS.slice(0, i * 4)].join(";")}
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={2.2}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        ))}
      </defs>
    </svg>
  );
}

export default function ZenxoDirection({
  index,
  src,
  alt,
}: {
  index: number;
  src: string;
  alt: string;
}) {
  return (
    // The exports already carry their own white ground and a hairline frame
    // edge, so they fill the cell rather than sitting inset on a plate the way
    // the logo directions do — there is nothing here to matte.
    <div className="absolute inset-0 bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="direction-boil h-full w-full object-contain"
        style={{ filter: `url(#${boilId(index)})` }}
      />
    </div>
  );
}
