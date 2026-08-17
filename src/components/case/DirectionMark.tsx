/**
 * The six rejected logo directions, as the artwork itself rather than the
 * Placeholder that stood in for it.
 *
 * Each mark carries the site's roughen-edges "boil" — the same feTurbulence →
 * feDisplacementMap pair that makes the hands, the fireplace, the cat and the
 * asterisks wobble frame-by-frame. Here it does a second job beyond matching
 * the house style: these are the directions that DIDN'T survive, and a mark
 * that won't sit still reads as unresolved in a way a crisp export never
 * would.
 *
 * The filter is applied through CSS `filter: url(#id)` on an <img>, not as an
 * SVG attribute, because the artwork stays a separate file. The defs live in
 * one zero-size <svg> rendered once per grid (BoilDefs) — filter ids are
 * document-scoped, so six copies of the same id would collide.
 *
 * Plain <img> rather than next/image: Next won't optimise SVG without
 * `dangerouslyAllowSVG`, so the component would only add a wrapper around the
 * same request.
 */

/** Twelve seeds, stepped discretely at ~7fps — the cadence the rest of the
 *  site's hand-drawn artifacts boil at. Each mark gets the list rotated by its
 *  own index so the six don't wobble in lockstep, which would read as one
 *  animation rather than six drawings. */
const SEEDS = [4, 9, 2, 7, 11, 1, 6, 12, 3, 8, 5, 10];

const boilId = (i: number) => `direction-boil-${i}`;

/** Renders once per grid. Zero-size and out of flow: it exists only to own the
 *  filter definitions the marks point at. */
export function BoilDefs({ count }: { count: number }) {
  return (
    <svg aria-hidden width={0} height={0} className="absolute" style={{ position: "absolute" }}>
      <defs>
        {Array.from({ length: count }, (_, i) => {
          const values = [...SEEDS.slice(i * 2), ...SEEDS.slice(0, i * 2)].join(";");
          return (
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
                baseFrequency="0.04"
                numOctaves={2}
                seed={SEEDS[i % SEEDS.length]}
                result="noise"
              >
                <animate
                  attributeName="seed"
                  dur="1.8s"
                  calcMode="discrete"
                  values={values}
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={3}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          );
        })}
      </defs>
    </svg>
  );
}

export default function DirectionMark({ index, label }: { index: number; label: string }) {
  return (
    // Contain, not cover: the six marks range from 3.4:1 to 0.8:1, and cropping
    // a logo direction to fill a box would be arguing with the artwork.
    // `bg-surface` is the same plate the Placeholder sat on, so the swap
    // changes the contents of the cell and nothing else about it.
    // `bg-surface` is the same plate the Placeholder sat on, so the swap
    // changes the contents of the cell and nothing else about it.
    <div className="absolute inset-0 bg-surface">
      {/* The inset is bought with a margin on an inset-0 box rather than
          padding on the parent: percentage padding AND percentage margin both
          resolve against width (so the gutter stays even on all four sides),
          but only this form leaves the image a definite height to size
          against. With h-full on a grid item the height goes indefinite and a
          portrait mark renders at its own aspect, overshooting the cell. */}
      <div className="absolute inset-0 m-[20%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/case/titan/directions/direction-0${index + 1}.svg`}
          alt={label}
          className="direction-boil h-full w-full object-contain"
          style={{ filter: `url(#${boilId(index)})` }}
        />
      </div>
    </div>
  );
}
