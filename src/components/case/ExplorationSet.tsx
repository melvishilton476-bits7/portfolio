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
  /** Why it won or lost. Rendered after a bold "Verdict." lead-in. */
  verdict?: ReactNode;
  /** The direction that shipped. Exactly one per set. */
  chosen?: boolean;
  /** Real artwork. Omit and the option keeps its Placeholder. */
  visual?: ReactNode;
};

/**
 * The options behind one decision, laid out side by side with the chosen one
 * marked.
 *
 * A rejected direction is only evidence if the reader can see what was
 * rejected AND why, so `verdict` is a first-class field rather than something
 * folded into the body copy — it keeps every option answering the same
 * question, and it makes a set with no verdict obviously incomplete instead of
 * quietly vague.
 *
 * The chosen option carries a chip and a solid border; the others stay on the
 * page at equal size. Shrinking the rejects would make the comparison
 * decorative, which is the opposite of the point.
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
        {options.map(({ label, body, verdict, chosen, visual }) => (
          <div key={label} className="flex flex-col">
            <GrowOnView className="case-figure relative block">
              <Framed>
                {visual ? (
                  <div style={{ aspectRatio: String(ratio) }} className="relative w-full">
                    {visual}
                  </div>
                ) : (
                  <Placeholder label={label} ratio={ratio} className={R} />
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
            <div className="mt-5">
              <div className="flex min-h-[26px] flex-wrap items-center gap-x-3 gap-y-2">
                <h3
                  className="type-caption uppercase tracking-[0.14em]"
                  style={{ color: "var(--color-ink)" }}
                >
                  {label}
                </h3>
                {chosen ? (
                  <span className="type-caption text-chip-text bg-tag/40 px-2 py-[3px] uppercase tracking-[0.14em]">
                    Chosen
                  </span>
                ) : null}
              </div>

              {body ? (
                <p className="type-lead text-pretty mt-3" style={{ fontWeight: 300 }}>
                  {body}
                </p>
              ) : null}

              {/* "Verdict." carries weight and ink, not uppercase tracking. The
                  whole paragraph is already ink against the muted body above
                  it, so a tracked-caps lead-in was a third heading level
                  fighting the label. */}
              {verdict ? (
                <p
                  className="type-lead text-pretty mt-2"
                  style={{ fontWeight: 300, color: "var(--color-ink)" }}
                >
                  <span style={{ fontWeight: 500 }}>Verdict.</span> {verdict}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
