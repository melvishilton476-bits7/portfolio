/**
 * The pre-run orbit: three rings, a gear, and three dots going round them.
 *
 * The rings, the gear and the ring glows are the Figma export verbatim
 * (`orbit.svg`, a 319x319 artboard). The three dots are NOT — they were lifted
 * out of that file and the export's copies deleted, for the same reason the
 * strategy card's curve was: a dot can only orbit if nothing is already
 * painting it in place. Their circles, gradients and blur are the export's own
 * markup, moved rather than redrawn, so the only thing this file invents is
 * the rotation.
 *
 * COORDINATES
 *
 * Every ring is concentric on (159.995, 159.673), so that is the one point the
 * dots turn about. Each dot sits just inside its own ring — 74.8, 112.2 and
 * 148.2 out against ring radii of 76.5, 113.8 and 148.7 — and keeps its
 * captured start angle, so at rest the graphic is pixel-identical to the
 * export it came from.
 *
 * `transform-box: view-box` is load-bearing: without it an SVG child resolves
 * transform-origin against its own tight bounding box, which for a 5px dot 148
 * units off centre would spin it on the spot instead of round the ring.
 *
 * MOTION
 *
 * Three different periods, because three dots sharing one would read as a
 * single rigid wheel rather than three things happening at once. Inner fastest,
 * which is the way a real system looks when the small work finishes first.
 *
 * `stall` is the argument the caption makes: the dots stop when the strategy
 * does. It is one animation with a hold in it rather than a second component,
 * so what the reader compares is the same graphic in two states.
 */

export const ORBIT = 319;

/** The centre every ring is drawn on, and so the point the dots turn about. */
const C = { x: 159.995, y: 159.673 };

/** The three dots, lifted out of the export: captured position, the gradient
 *  anchored to it, and the seconds one lap takes. */
const DOTS = [
  { cx: 231.395, cy: 182.089, g: { x1: 231.677, y1: 198.491, x2: 249.116, y2: 176.02 }, dur: 9 },
  { cx: 180.545, cy: 49.3455, g: { x1: 180.827, y1: 65.7478, x2: 198.266, y2: 43.2761 }, dur: 14 },
  { cx: 12.047, cy: 151.909, g: { x1: 12.3296, y1: 168.312, x2: 29.7685, y2: 145.84 }, dur: 22 },
] as const;

export default function ZenxoOrbit({
  className = "",
  stall = false,
}: {
  className?: string;
  /** Run, then stop dead, then run again — "if nothing is happening, nothing
   *  moves", shown rather than asserted. */
  stall?: boolean;
}) {
  return (
    <div className={`relative ${className}`}>
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 0 ${ORBIT} ${ORBIT}`}
        fill="none"
      >
        <defs>
          {/* The export's own blur, one shared copy: all three dots carried an
              identical feGaussianBlur, differing only in the filter region
              Figma computed around each. A single filter on a region that
              covers the whole artboard is the same picture with two fewer
              definitions — and it has to be artboard-wide anyway, since these
              now move. */}
          <filter
            id="zo-glow"
            x="0"
            y="0"
            width={ORBIT}
            height={ORBIT}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="2.98878" />
          </filter>
          {DOTS.map((d, i) => (
            <linearGradient
              key={i}
              id={`zo-dot-${i}`}
              x1={d.g.x1}
              y1={d.g.y1}
              x2={d.g.x2}
              y2={d.g.y2}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#E65E14" stopOpacity="0.94" />
              <stop offset="0.334507" stopColor="#FF6F20" />
              <stop offset="1" stopColor="#EDBCA0" />
            </linearGradient>
          ))}
        </defs>

        {/* the export's rings and gear, verbatim */}
        <g id="Group 174">
        <g id="Ellipse 27" filter="url(#filter0_d_0_25)">
        <circle cx="159.995" cy="159.673" r="76.4621" stroke="#E9E9E9" strokeWidth="0.665998" shapeRendering="crispEdges"/>
        </g>
        <circle id="Ellipse 28" cx="159.995" cy="159.673" r="76.4621" stroke="url(#paint0_linear_0_25)" strokeWidth="0.665998"/>
        <circle id="Ellipse 29" cx="159.5" cy="159.5" r="113.22" transform="rotate(38.3273 159.5 159.5)" stroke="url(#paint1_linear_0_25)" strokeWidth="0.665998"/>
        <g id="Group 172">
        <g id="Group 171" filter="url(#filter1_d_0_25)">
        <path id="Subtract" d="M165.882 130.204C165.89 132.338 165.87 134.476 165.884 136.611C165.894 138.061 166.334 139.285 167.404 140.302C168.388 141.222 169.698 141.713 171.044 141.667C171.86 141.637 172.655 141.396 173.352 140.97C174.156 140.476 175.336 139.201 176.049 138.486C176.978 137.553 178.017 136.551 178.916 135.596C180.515 137.234 182.169 138.828 183.776 140.459C184.138 140.827 184.515 141.212 184.893 141.562C183.597 142.904 182.23 144.195 180.924 145.529C180.394 146.07 179.89 146.527 179.496 147.188C179.062 147.916 178.829 148.747 178.823 149.595C178.814 150.936 179.338 152.226 180.281 153.18C180.909 153.812 181.7 154.259 182.565 154.47C183.375 154.67 185.08 154.613 186.004 154.612L190.29 154.615L190.287 163.043L186.089 163.037C185.076 163.036 183.47 162.975 182.544 163.196C181.753 163.386 181.024 163.773 180.426 164.324C179.445 165.25 178.87 166.528 178.828 167.877C178.799 168.769 179.021 169.651 179.466 170.424C179.965 171.273 180.959 172.14 181.663 172.86C182.722 173.943 183.851 175 184.888 176.102C184.505 176.439 184.102 176.863 183.74 177.229C182.145 178.844 180.507 180.428 178.925 182.057C178.721 181.814 178.294 181.412 178.059 181.177L176.494 179.613C175.824 178.945 174.498 177.535 173.822 177.008C172.81 176.204 171.514 175.848 170.234 176.023C168.199 176.286 166.528 177.707 166.033 179.706C165.828 180.532 165.882 181.901 165.882 182.801L165.882 186.438C165.883 186.657 165.929 187.31 165.832 187.439L165.683 187.458L157.46 187.448C157.421 185.962 157.488 184.396 157.461 182.904C157.441 181.833 157.546 180.595 157.269 179.564C157.053 178.783 156.641 178.07 156.072 177.493C155.132 176.536 153.851 175.991 152.509 175.978C151.655 175.972 150.815 176.196 150.077 176.626C149.213 177.133 148.189 178.268 147.447 179.011L144.396 182.058C144.073 181.65 143.181 180.837 142.786 180.422C141.401 178.968 139.784 177.526 138.443 176.049C138.613 175.917 138.842 175.687 139.001 175.53L141.396 173.136C142.164 172.371 143.388 171.26 143.899 170.365C144.309 169.645 144.523 168.83 144.517 168.001C144.507 166.663 143.968 165.382 143.019 164.439C141.323 162.772 139.402 163.037 137.229 163.037L133.047 163.048C132.982 161.596 133.056 159.799 133.038 158.319C133.026 157.39 132.988 155.467 133.067 154.61L137.291 154.612C138.319 154.613 139.976 154.682 140.909 154.434C141.712 154.215 142.444 153.789 143.033 153.2C143.981 152.249 144.515 150.962 144.519 149.619C144.518 148.773 144.289 147.942 143.854 147.215C143.345 146.357 142.115 145.231 141.363 144.48L138.44 141.569C139.733 140.307 141.02 138.985 142.304 137.711C142.767 137.253 144.03 136.041 144.376 135.591C145.552 136.701 146.701 137.907 147.85 139.049C149.251 140.441 150.232 141.644 152.403 141.666C153.752 141.682 155.052 141.162 156.018 140.221C156.621 139.625 157.055 138.88 157.273 138.061C157.53 137.099 157.461 135.445 157.461 134.406L157.466 130.2L165.882 130.204ZM161.569 149.728C156.496 149.728 152.384 153.841 152.384 158.913C152.385 163.986 156.496 168.098 161.569 168.098C166.642 168.098 170.753 163.986 170.754 158.913C170.754 153.841 166.642 149.728 161.569 149.728Z" fill="url(#paint2_linear_0_25)"/>
        </g>
        <g id="Ellipse 37" filter="url(#filter2_f_0_25)">
        <circle cx="159.994" cy="159.673" r="76.4621" stroke="url(#paint3_linear_0_25)" strokeWidth="0.665998"/>
        </g>
        <g id="Ellipse 32" filter="url(#filter3_d_0_25)">
        <circle cx="159.995" cy="159.673" r="113.822" stroke="#E9E9E9" strokeWidth="0.665998" shapeRendering="crispEdges"/>
        </g>
        <circle id="Ellipse 35" cx="159.993" cy="159.673" r="148.691" stroke="#DDDDDD" strokeWidth="0.665998"/>
        <circle id="Ellipse 30" cx="159.83" cy="159.833" r="148.851" stroke="url(#paint7_linear_0_25)" strokeWidth="0.665998"/>
        </g>
        </g>
        <defs>
        <filter id="filter0_d_0_25" x="75.3408" y="74.3535" width="169.308" height="169.308" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="-0.665998"/>
        <feGaussianBlur stdDeviation="3.92939"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_25"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_25" result="shape"/>
        </filter>
        <filter id="filter1_d_0_25" x="121.312" y="129.287" width="74.0418" height="74.0282" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-3.32087" dy="7.47195"/>
        <feGaussianBlur stdDeviation="4.1926"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.92549 0 0 0 0 0.368627 0 0 0 0 0.101961 0 0 0 0.35 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_25"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_25" result="shape"/>
        </filter>
        <filter id="filter2_f_0_25" x="80.7081" y="80.3875" width="158.571" height="158.571" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feGaussianBlur stdDeviation="1.24533" result="effect1_foregroundBlur_0_25"/>
        </filter>
        <filter id="filter3_d_0_25" x="38.9806" y="38.6584" width="242.029" height="242.029" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="3.42989"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_25"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_25" result="shape"/>
        </filter>
        <linearGradient id="paint0_linear_0_25" x1="162.525" y1="86.3778" x2="144.554" y2="127.125" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" stopOpacity="0"/>
        <stop offset="0.269231" stopColor="#FF5100"/>
        <stop offset="0.668269" stopColor="#FF5100"/>
        <stop offset="1" stopColor="white" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="paint1_linear_0_25" x1="163.242" y1="51.1217" x2="136.669" y2="111.373" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" stopOpacity="0"/>
        <stop offset="0.269231" stopColor="#FF5100"/>
        <stop offset="0.668269" stopColor="#FF5100"/>
        <stop offset="1" stopColor="white" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="paint2_linear_0_25" x1="163.154" y1="245.846" x2="255.665" y2="126.609" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E65E14" stopOpacity="0.94"/>
        <stop offset="0.334507" stopColor="#FF6F20"/>
        <stop offset="1" stopColor="#EDBCA0"/>
        </linearGradient>
        <linearGradient id="paint3_linear_0_25" x1="162.524" y1="86.3777" x2="144.553" y2="127.125" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" stopOpacity="0"/>
        <stop offset="0.269231" stopColor="#FF5100"/>
        <stop offset="0.668269" stopColor="#FF5100"/>
        <stop offset="1" stopColor="white" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="paint7_linear_0_25" x1="164.746" y1="17.4475" x2="129.835" y2="96.6045" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" stopOpacity="0"/>
        <stop offset="0.269231" stopColor="#FF5100"/>
        <stop offset="0.668269" stopColor="#FF5100"/>
        <stop offset="1" stopColor="white" stopOpacity="0"/>
        </linearGradient>
        </defs>

        {DOTS.map((d, i) => (
          <g
            key={i}
            className={`zo-dot${stall ? " zo-dot--stall" : ""}`}
            style={{
              transformOrigin: `${C.x}px ${C.y}px`,
              animationDuration: `${stall ? d.dur * 1.6 : d.dur}s`,
            }}
          >
            <g filter="url(#zo-glow)">
              <circle cx={d.cx} cy={d.cy} r="5.39641" fill={`url(#zo-dot-${i})`} />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
