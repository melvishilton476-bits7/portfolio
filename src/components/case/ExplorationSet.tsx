import type { ReactNode } from "react";
import Placeholder from "../Placeholder";
import GrowOnView from "../GrowOnView";
import CaseKicker from "./CaseKicker";
import CropMarks from "./CropMarks";
import { Framed, R } from "./Figure";

export type Exploration = {
  /** Short name for the direction, e.g. "English only, as briefed". */
  label: string;
  /** What the option was. Omit when there is nothing honest to say yet. */
  body?: ReactNode;
  /** Why it won or lost. Runs on from `body` as part of the same caption. */
  verdict?: ReactNode;
  /** Real artwork. Omit and the option keeps its Placeholder. */
  visual?: ReactNode;
  /** Give this option the full width of the set instead of one column. */
  wide?: boolean;
  /** This option's own frame ratio, when the set's shared one would crop or
   *  letterbox it. Two artefacts of genuinely different proportions are
   *  comparable at a shared WIDTH, not a shared box. */
  ratio?: number;
  /** Drop the frame's shadow — for artwork that casts its own. */
  flat?: boolean;
};

/**
 * The options behind one decision, laid out side by side.
 *
 * A rejected direction is only evidence if the reader can see what was
 * rejected AND why, so `verdict` is a first-class field rather than something
 * folded into the body copy — it keeps every option answering the same
 * question, and it makes a set with no verdict obviously incomplete instead of
 * quietly vague.
 *
 * No option carries a win/lose badge of its own: the verdict copy already says
 * which way each one went, and a chip was restating it in a louder voice.
 *
 * `wide` is the one exception, and it is a LAYOUT decision rather than a label.
 * An option that spans the set reads as the conclusion the two above it lead
 * to, and it earns the room honestly — the shipped direction is usually the
 * one with the most going on in the frame, so the column that fits a rejected
 * sketch starves it. Its caption is still held to one column's measure, so the
 * figure grows and the reading line does not.
 */
export default function ExplorationSet({
  kicker,
  ratio = 3 / 4,
  options,
}: {
  kicker?: string;
  ratio?: number;
  options: readonly Exploration[];
}) {
  return (
    <section className="mx-auto w-full max-w-[980px]">
      {kicker ? (
        <div className="mb-8">
          <CaseKicker>{kicker}</CaseKicker>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10">
        {options.map(({ label, body, verdict, visual, wide, ratio: own, flat }) => (
          <div key={label} className={`flex flex-col${wide ? " sm:col-span-2" : ""}`}>
            <GrowOnView className="case-figure relative block">
              <Framed shadow={!flat}>
                {visual ? (
                  <div style={{ aspectRatio: String(own ?? ratio) }} className="relative w-full">
                    {visual}
                  </div>
                ) : (
                  <Placeholder label={label} ratio={own ?? ratio} className={R} />
                )}
              </Framed>
              <CropMarks />
            </GrowOnView>

            {/* Hierarchy here is small-label-over-larger-body, the same rhythm
                CaseKicker sets over a heading everywhere else on the page. The
                option name is a specimen label rather than a section heading,
                so it takes the caption size and uppercase tracking <ComparePair>
                already uses to label two compared things — a 21px heading here
                competed with the page's real headings. */}
            <div className={`mt-5${wide ? " sm:max-w-[calc(50%-1.25rem)]" : ""}`}>
              <h3
                className="type-caption uppercase tracking-[0.14em]"
                style={{ color: "var(--color-ink)" }}
              >
                {label}
              </h3>

              {/* One caption, not a caption and a ruling. The verdict used to
                  be its own paragraph behind a bold "Verdict." lead-in, which
                  made every option carry a little masthead of its own and set
                  up a third heading level under the label. Run into the same
                  sentence flow it just reads as the rest of the thought — and
                  the copy already says which way each option went, so nothing
                  is lost by not announcing it. */}
              {body || verdict ? (
                <p
                  className="type-lead text-pretty mt-3"
                  /* fontSize inline, not a text-* class: .type-lead is declared
                     after Tailwind's utilities in globals.css, so it wins the
                     cascade at equal specificity and a class here would
                     silently do nothing — the same trap the file records for
                     its colour. 14px flat rather than the lead tier's 15-17px
                     clamp: these are specimen captions under a figure, not
                     running prose, and they should sit below the body copy
                     they follow. */
                  style={{ fontWeight: 300, fontSize: "0.875rem", lineHeight: 1.55 }}
                >
                  {body}
                  {body && verdict ? " " : null}
                  {verdict}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
