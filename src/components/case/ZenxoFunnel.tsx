import GrowOnView from "../GrowOnView";

/**
 * The order traders read a backtest in, as a path: verdict → curve → reasons →
 * raw rows → how to fix it.
 *
 * It is the finding the interviews turned up, drawn as a route rather than a
 * list because the redesigned results page IS a route — each stop answers the
 * question the previous one raised. Four different shapes, not four of one,
 * because they are four different kinds of thing: a single number, a line over
 * time, a handful of explanations, a table, and a remedy.
 *
 * One drawing, not four boxes and three bars: a single SVG, so the connector
 * runs centre to centre behind the stops and meets every shape whatever its
 * size, and one gradient in user space runs across the whole structure — each
 * shape shows the stretch of it that falls under it, so the colour flows
 * through the path instead of restarting per stop. The edges boil, the same
 * hand-drawn jitter as the three directions above.
 *
 * The connector draws in left to right and each stop pops in as it reaches
 * it, so the path is walked once in the order it describes.
 */

const INK = "#171717";
const W = 800;
const TALLEST = 114;
const STOPS_N = 5;
const GAP = (W - STOPS_N * TALLEST) / (STOPS_N - 1);
const cx = (i: number) => i * (TALLEST + GAP) + TALLEST / 2;
const CY = TALLEST / 2;
const BAR = 2;
const SEEDS = [4, 9, 2, 7, 11, 1, 6, 12, 3, 8, 5, 10];
const BOIL = "zx-funnel-boil";
const FLOW = "zx-funnel-flow";

/** Each glyph is drawn in its own small box, centred on its stop. */
const STOPS = [
  {
    label: "The verdict",
    shape: "square",
    size: 114,
    glyph: (
      <text
        x={0}
        y={1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={INK}
        className="font-display"
        style={{ fontSize: 24, letterSpacing: "-0.04em" }}
      >
        +₹
      </text>
    ),
  },
  {
    label: "The curve",
    shape: "circle",
    size: 105,
    glyph: (
      <path
        transform="translate(-24 -14.4) scale(1.2)"
        d="M1 20 L8 15 L13 17 L20 9 L26 12 L33 4 L39 6"
        fill="none"
        stroke={INK}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "The reasons",
    shape: "square",
    size: 83,
    glyph: (
      <g transform="translate(-17.4 -13) scale(1.45)">
        {[3, 9, 15].map((y, i) => (
          <line
            key={y}
            x1="2"
            x2={[22, 16, 19][i]}
            y1={y}
            y2={y}
            stroke={INK}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        ))}
      </g>
    ),
  },
  {
    label: "The raw rows",
    shape: "circle",
    size: 105,
    glyph: (
      <g transform="translate(-21 -15) scale(1.5)" fill="none" stroke={INK} strokeWidth="1.3">
        <rect x="1" y="1" width="26" height="18" />
        <line x1="1" x2="27" y1="7" y2="7" />
        <line x1="1" x2="27" y1="13" y2="13" />
        <line x1="10" x2="10" y1="1" y2="19" />
      </g>
    ),
  },
  {
    label: "How to fix",
    shape: "square",
    size: 96,
    // A wrench: the last stop is the remedy, not another reading of the run.
    glyph: (
      <path
        transform="translate(-19.5 -23) scale(1.8)"
        d="M14.7 6.3a4 4 0 0 0-5.4 5.1L3.5 17.2a1.8 1.8 0 0 0 2.5 2.5l5.8-5.8a4 4 0 0 0 5.1-5.4l-2.4 2.4-2.1-.4-.4-2.1z"
        fill="none"
        stroke={INK}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    ),
  },
] as const;

/** Outline weight: the stops are drawn as outlines, no fill. */
const STROKE = 2;

type Stop = (typeof STOPS)[number];

function Shape({ stop, i, grow, opacity }: { stop: Stop; i: number; grow: number; opacity: number }) {
  const size = stop.size + 2 * grow;
  return stop.shape === "circle" ? (
    <circle
      cx={cx(i)}
      cy={CY}
      r={(size - STROKE) / 2}
      fill="var(--color-background, #fff)"
      stroke={`url(#${FLOW})`}
      strokeWidth={STROKE}
      opacity={opacity}
    />
  ) : (
    <rect
      x={cx(i) - (size - STROKE) / 2}
      y={CY - (size - STROKE) / 2}
      width={size - STROKE}
      height={size - STROKE}
      fill="var(--color-background, #fff)"
      stroke={`url(#${FLOW})`}
      strokeWidth={STROKE}
      opacity={opacity}
    />
  );
}

export default function ZenxoFunnel() {
  return (
    <GrowOnView className="zx-funnel mx-auto w-full max-w-[800px]">
      <div className="relative">
        <svg viewBox={`-12 -12 ${W + 24} ${TALLEST + 24}`} className="block w-full overflow-visible" aria-hidden>
          <defs>
            <linearGradient id={FLOW} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={W} y2={0}>
              <stop offset="0" stopColor="#3f86ee" />
              <stop offset="0.55" stopColor="#6aa6f3" />
              <stop offset="1" stopColor="#a6cbf8" />
            </linearGradient>
            <filter id={BOIL} x="-10%" y="-20%" width="120%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={2} seed={4} result="noise">
                <animate
                  attributeName="seed"
                  dur="1.8s"
                  calcMode="discrete"
                  values={SEEDS.join(";")}
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.2} xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>

          <g filter={`url(#${BOIL})`}>
            {/* The connector, centre to centre: the stops sit on top of it,
                so it only shows between them and always meets their edges. */}
            <rect
              className="zx-funnel__link"
              x={cx(0)}
              y={CY - BAR / 2}
              width={cx(STOPS.length - 1) - cx(0)}
              height={BAR}
              fill={`url(#${FLOW})`}
            />
            {STOPS.map((stop, i) => (
              <g
                key={stop.label}
                className="zx-funnel__stop"
                style={{ ["--d" as string]: `${i * 260 + 120}ms` } as React.CSSProperties}
              >
                <Shape stop={stop} i={i} grow={0} opacity={1} />
              </g>
            ))}
          </g>

          {/* Glyphs outside the boil, so the marks inside stay crisp. */}
          {STOPS.map((stop, i) => (
            <g
              key={stop.label}
              className="zx-funnel__stop"
              style={{ ["--d" as string]: `${i * 260 + 120}ms` } as React.CSSProperties}
            >
              {/* Positioned on an inner group: the reveal's CSS transform on
                  the outer one would replace a transform attribute here. */}
              <g transform={`translate(${cx(i)} ${CY})`}>{stop.glyph}</g>
            </g>
          ))}
        </svg>

        <ol
          className="relative mt-3 h-8 sm:h-4"
          aria-label="The order traders read results in: the verdict, then the curve, then the reasons, then the raw rows, then how to fix it"
        >
          {STOPS.map((stop, i) => (
            <li
              key={stop.label}
              // On a phone the five labels would run into each other, so each
              // wraps within its own stop's share of the width instead.
              className="type-caption text-ink-muted absolute top-0 -translate-x-1/2 list-none text-center uppercase leading-tight tracking-[0.06em] sm:whitespace-nowrap sm:tracking-[0.1em]"
              style={{
                left: `${((cx(i) + 12) / (W + 24)) * 100}%`,
                width: `${((TALLEST + GAP) / (W + 24)) * 100}%`,
              }}
            >
              {stop.label}
            </li>
          ))}
        </ol>
      </div>
    </GrowOnView>
  );
}
