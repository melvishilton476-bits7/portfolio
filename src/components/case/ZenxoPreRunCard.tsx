/* eslint-disable @next/next/no-img-element -- four sub-3KB exported icons; see ZenxoBoard.tsx */

import { CardPlate, plateRatio } from "./ZenxoCardShot";
import ZenxoOrbit, { ORBIT } from "./ZenxoOrbit";

/**
 * The pre-run card: a strategy that isn't ready to run yet.
 *
 * Transcribed from Figma node 1622:5578 rather than screenshotted, because the
 * thing this figure is FOR is the orbit going round — see <ZenxoOrbit>. A flat
 * export would have made the caption's claim in words only.
 *
 * COORDINATES
 *
 * The artboard is the card: 663 x 1036, white, 27px corners. Figma expressed
 * every child as an offset from the card's centre, so this file resolves that
 * centre once (C) and every position below is the captured `calc(50% ± n)`
 * with the arithmetic already done. Nothing here is eyeballed; where a number
 * looks odd it is odd in the source.
 *
 * Two nodes did not survive the trip, both deliberately:
 *
 *   - `Rectangle 642`, a 663x476 panel behind the legs table, exported as an
 *     SVG containing one empty group. It draws nothing, so it renders nothing.
 *   - the Configure button's `drop-shadow(0 4px 0.1px black)`. drop-shadow
 *     follows alpha, and that div has no background of its own — so in Figma
 *     it is casting off the label and the icon, not off the button. Rendered
 *     literally it puts a hard black smear under the word "Configure" that is
 *     nowhere in the design's own preview.
 *
 * FONTS
 *
 * The design draws on Inter, Helvetica Neue and Red Hat Display. Inter is a
 * project font (`--font-ui`); the other two are not, and pulling two more
 * webfaces down for one decorative card would cost more than the difference
 * shows. Both are neutral grotesques at these sizes, so they map to Inter and
 * to the system stack respectively.
 */

const S = { w: 663, h: 1036 } as const;
const RADIUS = 27;

export const PRE_RUN_RATIO = plateRatio(S);

/** The card's centre — the origin Figma measured every child from. */
const C = { x: S.w / 2, y: S.h / 2 };
const at = (dx: number, dy: number) => ({ left: C.x + dx, top: C.y + dy });

const UI = "font-[family-name:var(--font-ui)]";
/** Stand-in for the design's Helvetica Neue, which the project does not load. */
const HN = '"Helvetica Neue", Helvetica, Arial, ui-sans-serif, system-ui, sans-serif';

/** The gradient the accent is drawn in wherever it appears — the tile, the
 *  headline's two emphasised phrases, the orbit's dots. One constant because
 *  in the product it is one token. */
const ACCENT =
  "linear-gradient(37.37deg, rgba(230,94,20,0.94) 34.425%, rgb(255,111,32) 28.407%, rgb(237,188,160) 153.41%)";
const ACCENT_TEXT =
  "linear-gradient(9.25deg, rgba(230,94,20,0.94) 34.425%, rgb(255,111,32) 28.407%, rgb(237,188,160) 153.41%)";

/** One leg's row in the table. `y` is the row's own top, captured. */
function LegRow({ n, y, strike }: { n: string; y: number; strike: string }) {
  return (
    <>
      <p
        className={`absolute ${UI} uppercase`}
        style={{
          ...at(-271.5, y),
          fontWeight: 500,
          fontSize: 17.614,
          lineHeight: "26.421px",
          letterSpacing: "1.7614px",
          color: "#7c7c74",
        }}
      >
        {n}
      </p>
      {/* SELL, in the loss red rather than the accent: orange is rationed to
          "act here" and "you are here", and a side is neither. */}
      <div
        className="absolute rounded-[31px] border border-solid border-[#ef4444] bg-[rgba(239,68,68,0.09)]"
        style={{ ...at(-86.5, y + 4), width: 48, height: 23 }}
      />
      <p
        className={`absolute -translate-x-1/2 -translate-y-1/2 text-center ${UI}`}
        style={{
          ...at(-62.5, y + 15),
          fontWeight: 600,
          fontSize: 12,
          lineHeight: "16px",
          color: "#ef4444",
        }}
      >
        SELL
      </p>
      {[
        { dx: 38.5, text: "1x", weight: 400, color: "#1b1a17" },
        { dx: 95.8, text: strike, weight: 400, color: "#1b1a17" },
        { dx: 236.5, text: "CE", weight: 500, color: "#7c7c74" },
      ].map((cell) => (
        <p
          key={cell.dx}
          className={`absolute whitespace-nowrap ${UI}`}
          style={{
            ...at(cell.dx, y),
            fontWeight: cell.weight,
            fontSize: 20.195,
            lineHeight: "30.293px",
            letterSpacing: "-0.1762px",
            color: cell.color,
          }}
        >
          {cell.text}
        </p>
      ))}
    </>
  );
}

export default function ZenxoPreRunCard() {
  return (
    <CardPlate art={S} radius={RADIUS}>
      <div
        className="absolute inset-0 overflow-hidden bg-white"
        style={{ borderRadius: `calc(100cqw * ${RADIUS / S.w})`, containerType: "inline-size" }}
      >
        <div
          style={{
            width: S.w,
            height: S.h,
            transformOrigin: "0 0",
            transform: `scale(calc(100cqw / ${S.w}px))`,
          }}
        >
          {/* header — the strategy, greyed because none of it is actionable yet */}
          <div className="absolute rounded-[9px]" style={{ ...at(-291.5, -475), width: 63, height: 62, backgroundImage: ACCENT }} />
          <img alt="" src="/case/zenxo/run/a-puzzle.svg" className="absolute block" style={{ ...at(-273.49, -461.02), width: 35, height: 35 }} />
          <p className={`absolute whitespace-nowrap ${UI}`} style={{ ...at(-210.5, -475), fontSize: 28, letterSpacing: "-0.28px", color: "#b4b4b4" }}>
            Double Diagonal
          </p>
          <p className={`absolute whitespace-nowrap ${UI}`} style={{ ...at(-210.5, -438), fontSize: 21, letterSpacing: "-0.21px", color: "#b4b4b4" }}>
            1 Version
          </p>

          {/* history, then delete — the two things you can still do to a
              strategy that has never run */}
          <div className="absolute rounded-[5px] bg-[#e3eaff]" style={{ ...at(214.5, -480), width: 36, height: 33 }} />
          <img alt="" src="/case/zenxo/run/icon-history.svg" className="absolute block" style={{ ...at(223.5, -472), width: 18.416, height: 18.416 }} />
          <div className="absolute flex items-center justify-center rounded-[4px] bg-[rgba(237,36,49,0.15)]" style={{ ...at(263.5, -480), width: 38, height: 33 }}>
            <img alt="" src="/case/zenxo/run/a-trash.svg" className="block" style={{ width: 18, height: 18 }} />
          </div>

          <p
            className={`absolute -translate-x-1/2 text-center capitalize ${UI}`}
            style={{ ...at(0.5, -336), width: 332, fontSize: 30.104, letterSpacing: "-0.9031px", color: "#706363" }}
          >
            A few more{" "}
            <span className="bg-clip-text text-transparent" style={{ fontWeight: 500, backgroundImage: ACCENT_TEXT }}>
              steps
            </span>
            , then you&rsquo;re ready{" "}
            <span className="bg-clip-text text-transparent" style={{ fontWeight: 500, backgroundImage: ACCENT_TEXT }}>
              to run
            </span>
          </p>

          <div className="absolute" style={{ ...at(-163.5, -210), width: ORBIT, height: ORBIT }}>
            <ZenxoOrbit className="h-full w-full" stall />
          </div>

          {/* the fade that lands the rings on the table instead of through it.
              Captured as a 180-degree-rotated top-down gradient, which is the
              same picture as an upward one — written the second way because a
              rotation of 179.84deg on a fade is a transform nobody can read. */}
          <div
            className="absolute"
            style={{
              left: -0.45,
              top: C.y - 46,
              width: 661.553,
              height: 223.945,
              backgroundImage: "linear-gradient(to top, #fff 75.581%, rgba(255,255,255,0))",
            }}
          />

          {/* the tiny grey marker Figma calls Union, rotated 60 degrees */}
          <img
            alt=""
            src="/case/zenxo/run/a-union.svg"
            className="absolute block"
            style={{ ...at(228.14, 37.65), width: 14.5, height: 14.5, rotate: "60deg" }}
          />

          {/* legs — two of eight filled in, which is the whole reason this card
              says "a few more steps" */}
          <p className={`absolute -translate-x-1/2 text-center ${UI}`} style={{ ...at(-224.5, 85), width: 136, fontWeight: 700, fontSize: 20, letterSpacing: "-0.2px", color: "#434343" }}>
            LEGS 1 - 4
          </p>
          <p className={`absolute -translate-x-1/2 text-center ${UI}`} style={{ ...at(-29.5, 85), width: 136, fontSize: 20, letterSpacing: "-0.2px", color: "#7c7c74" }}>
            LEGS 5 - 8
          </p>
          {/* hairlines, drawn rather than fetched: a 582x1 export is a stroke
              this file can state in one line and get exactly right */}
          <div className="absolute" style={{ ...at(-298.5, 124), width: 582, height: 1, background: "#DADADA" }} />
          <div className="absolute" style={{ ...at(-298.5, 123.5), width: 155, height: 2, background: "#757575", borderRadius: 1 }} />

          <LegRow n="Leg 1" y={143} strike="ATM" />
          <LegRow n="Leg 2" y={203.39} strike="ATM +100" />

          {/* the one place orange is allowed to be: the primary action */}
          <div className="absolute rounded-[13px] border border-solid border-[rgba(0,0,0,0.3)] p-px" style={{ ...at(-290.5, 392), width: 581 }}>
            <div className="flex items-center justify-center gap-[14.091px] rounded-[12px]" style={{ height: 79, paddingTop: 21.137, paddingBottom: 21.137 }}>
              <img alt="" src="/case/zenxo/run/a-settings.svg" className="block" style={{ width: 26.421, height: 26.421 }} />
              <p
                className="whitespace-nowrap text-center"
                style={{ fontFamily: HN, fontWeight: 500, fontSize: 24.66, lineHeight: "35.228px", letterSpacing: "-0.1691px", color: "#2b2623" }}
              >
                Configure
              </p>
            </div>
          </div>
        </div>
      </div>
    </CardPlate>
  );
}
