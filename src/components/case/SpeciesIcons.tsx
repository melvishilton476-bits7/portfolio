/**
 * The species icons, on the plate they were drawn for.
 *
 * These are the marks that sit at the head of each species board — the animal
 * in the same brush-edged yellow the boards use, drawn as a silhouette with
 * its own small annotations (a heart for breeding, fruit for diet, motion
 * lines for call and movement) floating beside it rather than boxed into a
 * legend.
 *
 * The plate is #191919, the information family's own base from
 * <PaletteWeighting>, not a neutral grey: these were drawn to sit on that
 * colour and the yellow reads differently on anything else. Showing them on
 * white would be showing them somewhere they never appear.
 *
 * Each mark carries the site's roughen-edges "boil" — the same feTurbulence →
 * feDisplacementMap pair behind the hands, the fireplace, the cat, the
 * asterisks and the Titan logo directions. The three run on their own phases
 * (own seed order per icon, the way <DirectionMark> does it) so the row reads
 * as three drawings rather than one animation applied three times.
 *
 * Plain <img> rather than next/image, the same call <DirectionMark> and
 * <KabiniLogo> make: Next won't optimise SVG without `dangerouslyAllowSVG`,
 * so next/image would only wrap the same request.
 */

/** Stepped discretely at the ~7fps the rest of the site's boils run at.
 *  Gentler than <DirectionMark>'s (scale 3): these are filled silhouettes at a
 *  small rendered size, where a hard displacement chews the thin annotation
 *  marks — the heart, the fruit, the motion lines — into noise. */
const SEEDS = [4, 9, 2, 7, 11, 1, 6, 12, 3, 8, 5, 10];

const boilId = (i: number) => `species-icon-boil-${i}`;

/** Each export is a wide 2170x456 sheet with the mark parked at its own
 *  horizontal offset. The files' viewBoxes are cropped to their own artwork,
 *  so the ratios here are the marks' real proportions rather than the sheet's
 *  — which is why the bird is the narrow one and reads as taller. */
const ICONS = [
  {
    src: "/case/nagarhole/icons/elephant.svg",
    name: "Asiatic elephant",
    alt: "Yellow silhouette of an elephant with its trunk raised, a heart and a cluster of fruit at its left and three motion lines at its right",
    ratio: 419.4 / 440.2,
  },
  {
    src: "/case/nagarhole/icons/deer.svg",
    name: "Sambar deer",
    alt: "Yellow silhouette of a sambar stag mid-stride, antlers up, with two short motion lines behind it",
    ratio: 402.7 / 452.9,
  },
  {
    src: "/case/nagarhole/icons/eagle.svg",
    name: "Hornbill",
    alt: "Yellow silhouette of a hornbill perched in profile, its casque-topped bill closed, a single mark above it",
    ratio: 204.7 / 466.8,
  },
] as const;

export default function SpeciesIcons() {
  return (
    <div className="absolute inset-0" style={{ backgroundColor: "#191919" }}>
      {/* Zero-size and out of flow: it exists only to own the filter
          definitions the marks point at. Filter ids are document-scoped, so
          each icon needs its own rather than three sharing one. */}
      <svg aria-hidden width={0} height={0} className="absolute" style={{ position: "absolute" }}>
        <defs>
          {ICONS.map((_, i) => (
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
                baseFrequency="0.035"
                numOctaves={2}
                seed={SEEDS[i % SEEDS.length]}
                result="noise"
              >
                <animate
                  attributeName="seed"
                  dur="1.8s"
                  calcMode="discrete"
                  values={[...SEEDS.slice(i * 3), ...SEEDS.slice(0, i * 3)].join(";")}
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={1.8}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          ))}
        </defs>
      </svg>

      {/* Three equal columns with each mark centred in its own, rather than a
          flex row with a gap: the marks are different widths, so a gap spaces
          them by their EDGES and the middle one lands off-centre. Equal
          columns space them by their CENTRES — evenly pitched at 1/6, 1/2 and
          5/6 of the frame, which also puts the second one exactly on the
          frame's centre line. */}
      <div className="absolute inset-0 grid grid-cols-3 items-center justify-items-center px-[4%]">
        {ICONS.map((icon, i) => (
          // Each mark gets the same HEIGHT rather than the same width, because
          // they are a set of drawings at one scale, not a set of boxes: the
          // bird is genuinely narrower than the elephant and forcing them to a
          // shared width would make it the largest thing here.
          <div key={icon.src} className="flex h-[42%] items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={icon.src}
              alt={icon.alt}
              className="direction-boil h-full w-auto object-contain"
              style={{ filter: `url(#${boilId(i)})` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
