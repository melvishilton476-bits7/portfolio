/* eslint-disable @next/next/no-img-element -- two sub-1KB exported icons; see ZenxoBoard.tsx */

/**
 * A leg with an empty + Exit slot, and what happens when you fill one.
 *
 * Transcribed from the same kind of layered capture as the rest of this case
 * study, cropped to the part the caption is about. The strategy card and the
 * Add Leg ghost sit just outside the frame on purpose - the card's bottom edge
 * lands at y 82.75 and the spine stub starts at 82.76, so the wire appears to
 * come in from off-screen rather than from nothing.
 *
 * COORDINATES
 *
 * Everything in the capture is positioned from the canvas' centre, so that
 * centre is the one number this file resolves: C = (494.85, 128.13) on a
 * 960x540 artboard, chosen to sit the three visible nodes in the middle. Each
 * node is then placed by its own left/top rather than a centring translate,
 * because Tailwind v4 compiles -translate-x-1/2 to the standalone `translate`
 * property and a keyframe that re-states it would apply it twice.
 *
 * The wires keep the capture's own SVG frame (1262.08 x 706.656, parked at
 * C minus half of each), so every path is the exported data verbatim. That is
 * what makes them land: the drop to Leg 2 ends at y 143.25 and Leg 2's top is
 * 143.235; the exit branch runs 268.36 -> 301.36 against a leg bottom of
 * 268.345 and a card top of 301.34.
 *
 * The exit branch is drawn inline rather than used as the exported image
 * because it is the one thing that animates - it has to draw on, and the two
 * junction dots have to arrive with it. The grey wires never change, so they
 * are the same paths sitting static.
 *
 * The canvas ground is flat #f8f8f6. That is measured, not assumed: it is
 * 83.7% of the pane in the capture with zero variance, so there is no dot grid
 * here to reproduce.
 */

const FONTS = {
  "--zl-sans": '"Helvetica Neue", Helvetica, Arial, -apple-system, system-ui, sans-serif',
} as const;

export const ART = { width: 960, height: 540 } as const;

/** The canvas centre every captured offset is measured from. */
const C = { x: 494.85, y: 128.13 };

/** The wire SVG's own frame, parked so its centre lands on C. */
const WIRE = { w: 1262.08, h: 706.656 };
const WIRE_AT = { left: C.x - WIRE.w / 2, top: C.y - WIRE.h / 2 };

const LEG = { w: 261.77, h: 125.11 };
const legAt = (dx: number) => ({
  left: C.x + dx - LEG.w / 2,
  top: C.y + 77.66 - LEG.h / 2,
});

const S = "font-[family-name:var(--zl-sans)]";

function LegNode({
  name,
  dx,
  selected = false,
  className = "",
}: {
  name: string;
  dx: number;
  selected?: boolean;
  className?: string;
}) {
  const { left, top } = legAt(dx);
  return (
    <div
      className={`absolute overflow-clip rounded-[10px] border bg-white ${className} ${
        selected
          ? "border-[#ec5e1a] shadow-[0px_0px_0px_2px_#fbeed8,0px_9px_24px_-12px_rgba(20,20,25,0.32)]"
          : "border-[#deddd8] shadow-[0px_1px_2px_0px_rgba(20,20,25,0.06)]"
      }`}
      style={{ left, top, width: LEG.w, height: LEG.h }}
    >
      {/* the empty slot: dashed, because it is an invitation and a flag at once */}
      <div className="zl-slot absolute bottom-[13.54px] left-[13.54px] right-[13.54px] h-[46.18px] rounded-[10px] border border-dashed border-[#deddd8]">
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${S} text-center text-[14.4px] font-bold text-[#4a4a44]`}
        >
          <p className="leading-[normal]">+ Exit</p>
        </div>
      </div>
      <div className="absolute left-[13.54px] top-[12.57px] h-[36.56px] w-[38.56px] rounded-[10px] bg-[#ece9fa]">
        <img
          alt=""
          className="absolute left-[8.65px] top-[8.65px] block size-[19.25px] max-w-none"
          src="/case/zenxo/leg/icon-leg.svg"
        />
      </div>
      <div
        className={`absolute left-[60.67px] top-[30.31px] -translate-y-1/2 ${S} text-[19.2px] font-bold tracking-[-0.2887px] text-[#1b1a17]`}
      >
        <p className="leading-[normal]">{name}</p>
      </div>
      <div
        className={`absolute left-[232.2px] top-[30.41px] -translate-y-1/2 ${S} text-[11.5px] text-[#7c7c74]`}
      >
        <p className="leading-[11.549px]">✕</p>
      </div>
    </div>
  );
}

function ExitCard() {
  return (
    <div
      className="zl-card absolute overflow-clip rounded-[10px] border border-[#deddd8] bg-white shadow-[0px_1px_2px_0px_rgba(20,20,25,0.06)]"
      style={{ left: C.x + 134.99 - 204.02 / 2, top: C.y + 251.16 - 155.9 / 2, width: 204.02, height: 155.9 }}
    >
      <div className="absolute left-[12.57px] top-[33.72px] h-[34.64px] w-[36.64px] rounded-[10px] bg-[#fbe9e9]">
        <img
          alt=""
          className="absolute left-[7.68px] top-[7.68px] block size-[19.25px] max-w-none"
          src="/case/zenxo/leg/icon-exit.svg"
        />
      </div>
      <div
        className={`absolute left-[56.83px] top-[51.03px] -translate-y-1/2 ${S} text-[16.4px] font-bold tracking-[-0.2454px] text-[#1b1a17]`}
      >
        <p className="leading-[normal]">Stop loss</p>
      </div>
      <div
        className={`absolute left-[162.94px] top-[51.03px] -translate-y-1/2 ${S} text-[14px] font-bold tracking-[-0.1482px] text-[#7c7c74]`}
      >
        <p className="leading-[normal]">30 ₹</p>
      </div>
      <div
        className={`absolute left-[11.61px] top-[17.9px] -translate-y-1/2 ${S} text-[10.6px] font-bold uppercase tracking-[0.741px] text-[#c6c5bf]`}
      >
        <p className="leading-[15.879px]">Exit condition</p>
      </div>
      <div
        className={`absolute left-[152.88px] top-[17.9px] -translate-y-1/2 ${S} text-[11.5px] text-[#7c7c74]`}
      >
        <p className="leading-[11.549px]">⎇</p>
      </div>
      <div
        className={`absolute left-[176.37px] top-[17.9px] -translate-y-1/2 ${S} text-[11.5px] text-[#7c7c74]`}
      >
        <p className="leading-[11.549px]">✕</p>
      </div>
      <div className="absolute left-[0.07px] right-[0.07px] top-[80.85px] h-[66.5px] border-t-[1.111px] border-solid border-[#ecebe7]">
        {[
          { label: "Re-Entry", top: -0.04, rule: false },
          { label: "Trail SL", top: 32.67, rule: true },
        ].map((row) => (
          <div
            key={row.label}
            className={`absolute left-0 right-0 h-[32.71px] ${row.rule ? "border-t-[1.111px] border-solid border-[#ecebe7]" : ""}`}
            style={{ top: row.top }}
          >
            <div
              className={`absolute left-[12.5px] top-1/2 -translate-y-1/2 ${S} text-[11.1px] font-bold text-[#ec5e1a]`}
            >
              <p className="leading-[normal]">+</p>
            </div>
            <div
              className={`absolute left-[27.78px] top-1/2 -translate-y-1/2 ${S} text-[13px] font-bold text-[#4a4a44]`}
            >
              <p className="leading-[normal]">{row.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ZenxoLegSlot({ duration = 12 }: { duration?: number }) {
  return (
    <div
      className="zl absolute inset-0 overflow-hidden"
      style={{ containerType: "inline-size", ["--zl-dur" as string]: `${duration}s`, ...FONTS } as React.CSSProperties}
    >
      <div
        className="bg-[#f8f8f6]"
        style={{
          width: ART.width,
          height: ART.height,
          transformOrigin: "0 0",
          transform: `scale(calc(100cqw / ${ART.width}px))`,
        }}
      >
        <svg
          className="absolute"
          style={{ left: WIRE_AT.left, top: WIRE_AT.top }}
          width={WIRE.w}
          height={WIRE.h}
          viewBox={`0 0 ${WIRE.w} ${WIRE.h}`}
          fill="none"
          aria-hidden
        >
          {/* the structure that is always there: stub, spine, one drop per leg */}
          {[
            "M615.917 307.959V335.456",
            "M466.062 335.455H765.772",
            "M466.062 335.455V368.451",
            "M765.772 335.455V368.451",
          ].map((d) => (
            <path key={d} d={d} stroke="#DEDDD8" strokeWidth={2.06222} strokeLinecap="round" />
          ))}
          <circle cx={615.917} cy={335.455} r={4.675} fill="white" stroke="#C6C5BF" strokeWidth={3.57452} />

          {/* the exit branch — the only thing that arrives */}
          <path
            className="zl-wire"
            d="M765.772 493.559V526.555"
            stroke="#EFCAC4"
            strokeWidth={2.06222}
            strokeLinecap="round"
            pathLength={1}
          />
          <circle
            className="zl-dot zl-dot--a"
            cx={765.772}
            cy={493.559}
            r={4.675}
            fill="white"
            stroke="#D98E82"
            strokeWidth={3.57452}
          />
          <circle
            className="zl-dot zl-dot--b"
            cx={765.772}
            cy={526.555}
            r={4.675}
            fill="white"
            stroke="#D98E82"
            strokeWidth={3.57452}
          />
        </svg>

        {/* Leg 1 never gains anything. Its slot stays dashed and empty, which is
            the whole point the caption is making. */}
        <LegNode name="Leg 1" dx={-164.71} className="zl-leg1" />
        <LegNode name="Leg 2" dx={135.01} selected />
        <ExitCard />

        <div className="zl-cursor absolute left-0 top-0 h-[22px] w-[17px]" aria-hidden>
          <span className="zl-click absolute left-[-15px] top-[-15px] h-[30px] w-[30px] rounded-full bg-[#ec5e1a]" />
          <svg viewBox="0 0 17 22" className="absolute inset-0 h-full w-full overflow-visible">
            <path
              d="M1.2 1.1 L1.2 17.4 L5.5 13.4 L8.3 20.6 L11.4 19.3 L8.6 12.3 L14.1 12.1 Z"
              fill="#1b1a17"
              stroke="#ffffff"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
