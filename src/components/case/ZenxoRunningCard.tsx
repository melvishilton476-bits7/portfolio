/* eslint-disable @next/next/no-img-element -- five sub-4KB exported icons; see ZenxoBoard.tsx */

import { CardPlate, plateRatio } from "./ZenxoCardShot";

/**
 * A backtest running, naming the stage it is on.
 *
 * Transcribed from Figma node 1966:718. The design is one frame of something
 * that moves, and the frame it chose is the argument: four stages struck
 * through, one in progress, one still to come, with the bar and the percentage
 * both reading off that count rather than off a timer. 4 of 6 is 66.7%, the
 * bar is 373 of 563 (66.3%), and the label says 67% — so the number in this
 * product means "stages done", not "time elapsed", and the animation here is
 * built on the count for the same reason.
 *
 * That is also why a generic spinner would have been wrong and why this figure
 * is not a screenshot: a run that is slow and a run that is stuck look
 * identical on a spinner and different here, which is the whole claim.
 *
 * COORDINATES
 *
 * The Figma frame is larger than the card — the card sits at (57, 13) inside
 * it — so every captured offset has that origin subtracted once, in `at`.
 * Numbers below are otherwise the source's own.
 *
 * The step markers are 30px slots carrying a 38px asset (Figma's own
 * `inset: -13.33%`), because the ring's glow overruns the circle by 4px on
 * every side. Rendering the asset at 30 would have clipped the glow off.
 *
 * FONTS
 *
 * Inter is the design's and the project's (`--font-ui`). Public Sans and
 * Hanken Grotesk are neither, and both are neutral grotesques doing 12px and
 * 25px of UI text here, so they map to Inter rather than costing two more
 * webfont requests.
 */

/** Stretched from the design's 867 to the pre-run card's 1036, so the pair
 *  sits as two cards of one size. The extra height went into the content —
 *  larger type and a looser stage list — rather than into empty space. */
const S = { w: 663, h: 1036 } as const;
const RADIUS = 16;

export const RUNNING_RATIO = plateRatio(S);


/** The card's origin inside the captured frame. */
const O = { x: 57, y: 13 };
const at = (x: number, y: number) => ({ left: x - O.x, top: y - O.y });

const UI = "font-[family-name:var(--font-ui)]";

const ACCENT =
  "linear-gradient(37.37deg, rgba(230,94,20,0.94) 34.425%, rgb(255,111,32) 28.407%, rgb(237,188,160) 153.41%)";

/**
 * The six stages, in the order the engine reports them.
 *
 * Captured verbatim except for one letter: the design file reads "Stimulating
 * Legs" where every other stage and the page's own caption say simulating.
 * Rendered as the typo it is, the figure would put a misspelling in a
 * portfolio piece as evidence of care; rendered as "Simulating" it matches
 * the rest of the list and the copy around it. Worth fixing at source.
 */
const STAGES = [
  { label: "Connecting Engine" },
  { label: "Loading Data" },
  { label: "Analysing Conditions" },
  { label: "Simulating Legs" },
  { label: "Computing P&L metrics" },
  { label: "Finalising Results" },
] as const;

/** Row tops in frame coordinates, on one 70px pitch (the design ran 55 then
 *  50; the taller card has room to let the list breathe evenly). */
const PITCH = 70;
const ROW_Y = STAGES.map((_, i) => 470 + i * PITCH);
/** Labels are left-aligned on one edge rather than centred on themselves, so
 *  the larger type cannot drift the edge row to row. */
const LABEL_X = 150;
const LABEL_TOP = 2;
const FS = 22;

/** Where the done wipe and the latest-row window cut, per stage, as insets of
 *  the card — derived from ROW_Y so the animation cannot fall out of step
 *  with the rows it reveals. The 4px is the marker's glow overrun. */
const pct = (y: number) => `${((y / S.h) * 100).toFixed(3)}%`;
const CLIP_VARS = Object.fromEntries(
  ROW_Y.flatMap((y, i) => [
    [`--zx-t${i}`, pct(y - O.y - 4)],
    [`--zx-b${i}`, pct(S.h - (y - O.y + 34))],
  ]),
);

/** Seconds per stage, and so the beat the whole card is timed to. */
const STEP = 2;
const HOLD = 2;
const DUR = STAGES.length * STEP + HOLD;

export default function ZenxoRunningCard() {
  return (
    <CardPlate art={S} radius={RADIUS}>
      <div
        className="zx-run absolute inset-0 overflow-hidden bg-white"
        style={
          {
            borderRadius: `calc(100cqw * ${RADIUS / S.w})`,
            containerType: "inline-size",
            "--zx-dur": `${DUR}s`,
            ...CLIP_VARS,
          } as React.CSSProperties
        }
      >
        <div
          style={{
            width: S.w,
            height: S.h,
            transformOrigin: "0 0",
            transform: `scale(calc(100cqw / ${S.w}px))`,
          }}
        >
          {/* header */}
          <div className="absolute rounded-[9px]" style={{ ...at(89, 51), width: 63, height: 62, backgroundImage: ACCENT }} />
          <img alt="" src="/case/zenxo/run/b-puzzle.svg" className="absolute block" style={{ ...at(107.01, 64.98), width: 35, height: 35 }} />
          <p className={`absolute whitespace-nowrap ${UI}`} style={{ ...at(172, 52), fontWeight: 500, fontSize: 28, letterSpacing: "-0.28px", color: "#1b1a17" }}>
            Double Diagonal
          </p>
          <p className={`absolute whitespace-nowrap ${UI}`} style={{ ...at(172, 89), fontSize: 21, letterSpacing: "-0.21px", color: "#838383" }}>
            Version 1 | 11 Jul 2026, 3:16 PM
          </p>

          {/* LIVE — green, not orange. The accent would have claimed this is
              somewhere to act, and it is somewhere to wait. */}
          <div className="absolute flex items-center gap-[4px] rounded-[7px] bg-[#c7fecc]" style={{ ...at(582, 52), width: 57, height: 33, paddingLeft: 13, paddingRight: 8 }}>
            <span className="block rounded-full bg-[#00a740] opacity-[0.62]" style={{ width: 6, height: 6 }} />
            <p className={`whitespace-nowrap ${UI}`} style={{ fontWeight: 500, fontSize: 10, lineHeight: "15px", color: "#009a0a" }}>
              LIVE
            </p>
          </div>
          <div className="absolute flex items-center justify-center rounded-[4px] bg-[rgba(237,36,49,0.15)]" style={{ ...at(648, 52), width: 38, height: 33 }}>
            <img alt="" src="/case/zenxo/run/b-trash.svg" className="block" style={{ width: 18, height: 18 }} />
          </div>

          {/* current stage, named. Six labels stacked in one place, each shown
              only during its own beat — the alternative was one node whose
              text changes, which CSS cannot do and which would have needed a
              client component for a decorative card. */}
          <img alt="" src="/case/zenxo/run/b-gear.svg" className="absolute block" style={{ ...at(104, 226), width: 34, height: 34 }} />
          <div className="absolute" style={{ ...at(160, 228), width: 0, height: 0 }}>
            {STAGES.map((s, i) => (
              <p
                key={s.label}
                className={`zx-now absolute whitespace-nowrap ${UI}`}
                style={{ ["--i" as string]: i, top: 0, left: 0, fontSize: 23, letterSpacing: "-0.23px", color: "#969696" }}
              >
                {s.label}...
              </p>
            ))}
          </div>

          {/* the percentage. The digits come from a counter fed by a registered
              custom property, so the number and the bar are driven by the same
              clock instead of being two things that agree by hand.

              It degrades correctly: where @property is unsupported the value
              never interpolates, `--zx-pct` keeps the base set here, and the
              counter renders that as a static 67% — the design's own frame —
              rather than falling to zero or to nothing. */}
          <p
            className={`zx-pct absolute whitespace-nowrap bg-clip-text text-transparent ${UI}`}
            style={
              {
                ...at(568, 214),
                fontWeight: 500,
                fontSize: 40,
                letterSpacing: "-0.4px",
                backgroundImage: ACCENT,
                "--zx-pct": 67,
              } as React.CSSProperties
            }
          />

          {/* the bar */}
          <div className="absolute rounded-[6px] bg-[#f5f5f5]" style={{ ...at(102, 286), width: 563, height: 58 }} />
          <div
            className="zx-bar absolute rounded-[6px]"
            style={{
              ...at(102, 286),
              width: 563,
              height: 58,
              backgroundImage: "linear-gradient(to right, #ff7427 2.547%, #f6945e)",
              boxShadow: "0px 0px 5.3px 0px rgba(255,164,19,0.48)",
            }}
          />

          {/* elapsed and remaining. Static: the design's own numbers, and a
              countdown here would be inventing data the capture never had. */}
          <div className="absolute flex items-center gap-[6px] rounded-[8px]" style={{ ...at(522, 358), paddingLeft: 9, paddingRight: 9, paddingTop: 5, paddingBottom: 5 }}>
            <img alt="" src="/case/zenxo/run/b-clock.svg" className="block" style={{ width: 13, height: 13 }} />
            <p className={`whitespace-nowrap ${UI}`} style={{ fontWeight: 500, fontSize: 14, lineHeight: "18px", color: "#4a4a44" }}>1m 0s</p>
            <p className={`whitespace-nowrap ${UI}`} style={{ fontWeight: 500, fontSize: 14, lineHeight: "18px", color: "#7c7c74" }}>·</p>
            <p className={`whitespace-nowrap ${UI}`} style={{ fontWeight: 500, fontSize: 14, lineHeight: "18px", color: "#7c7c74" }}>43s left</p>
          </div>

          <p className={`absolute whitespace-nowrap ${UI}`} style={{ ...at(102, 408), fontSize: 20, letterSpacing: "0.6px", color: "#969696" }}>
            RUNNING
          </p>

          {/* THE STAGE LIST, in three layers.
              
              One animation per layer rather than one per row, because a row's
              state is not a function of its own timeline: it has to be pending
              BEFORE its beat and stay done AFTER, and a shared keyframe set
              offset by `animation-delay` can only express "off during my beat"
              — which renders as a single hole walking down the list instead of
              a list filling in. A wipe down the whole column says the same
              thing in one animation and cannot drift out of order.
              
                base    every row pending: grey dot, grey label, connector
                done    the completed rows, revealed by a downward wipe
                latest  a one-row window on the most recent completion
              
              All three are the same six rows at the same coordinates, so the
              layers register exactly; only the clip differs. */}

          {/* base */}
          {STAGES.map((s, i) => (
            <div key={s.label}>
              {i > 0 ? (
                <div className="absolute" style={{ ...at(117, ROW_Y[i] - (PITCH - 30)), width: 0.5, height: PITCH - 30, background: "#D7D7D7" }} />
              ) : null}
              <div className="absolute rounded-full bg-[#F4F4F4]" style={{ ...at(102, ROW_Y[i]), width: 30, height: 30 }} />
              <p
                className={`absolute whitespace-nowrap ${UI}`}
                style={{ ...at(LABEL_X, ROW_Y[i] + LABEL_TOP), fontSize: FS, letterSpacing: "-0.22px", color: "#d8d8d8" }}
              >
                {s.label}
              </p>
            </div>
          ))}

          {/* done */}
          <div className="zx-done absolute inset-0">
            {STAGES.map((s, i) => (
              <div key={s.label}>
                {/* the marker is a 30px slot carrying a 38px asset: the ring's
                    glow overruns the circle by 4px on every side, and drawing
                    the asset at 30 would have clipped it off */}
                <img
                  alt=""
                  src="/case/zenxo/run/b-step-cur.svg"
                  className="absolute block"
                  style={{ ...at(98, ROW_Y[i] - 4), width: 38, height: 38 }}
                />
                <p
                  className={`absolute whitespace-nowrap ${UI}`}
                  style={{ ...at(LABEL_X, ROW_Y[i] + LABEL_TOP), fontSize: FS, letterSpacing: "-0.22px", color: "#969696" }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* latest */}
          <div className="zx-latest absolute inset-0">
            {STAGES.map((s, i) => (
              <p
                key={s.label}
                className={`absolute whitespace-nowrap ${UI}`}
                style={{ ...at(LABEL_X, ROW_Y[i] + LABEL_TOP), fontWeight: 500, fontSize: FS, letterSpacing: "-0.22px", color: "#595959" }}
              >
                {s.label}
              </p>
            ))}
          </div>

          {/* Cancel — outlined, grey. The one action on a running card is not
              the one the eye should land on. */}
          <div className="absolute flex items-center justify-center gap-[14.091px] rounded-[12px] border-[0.5px] border-solid border-[#838383] bg-white" style={{ ...at(93, 916), width: 581, height: 88 }}>
            <p className={`whitespace-nowrap text-center ${UI}`} style={{ fontWeight: 500, fontSize: 26, lineHeight: "36px", letterSpacing: "-0.1691px", color: "#686868" }}>
              Cancel
            </p>
            <img alt="" src="/case/zenxo/run/b-arrow.svg" className="block" style={{ width: 22.893, height: 22.893 }} />
          </div>
        </div>
      </div>
    </CardPlate>
  );
}
