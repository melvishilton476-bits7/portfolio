import type { ReactNode } from "react";
import CaseKicker from "./CaseKicker";

/**
 * One design decision, argued in prose.
 *
 * Shaped like a <Beat> — kicker, subhead, body — and then marked with a rule
 * and a numeral down the left so the decisions read as a thread rather than as
 * three more sections. That distinction is the only reason this exists
 * separately: the page alternates between describing the system and defending
 * a choice, and the reader should be able to tell which one they are in
 * without parsing the heading first.
 *
 * The numeral sits outside the measure on wide screens, so the prose edge
 * stays flush with every other beat instead of being indented by its own
 * label.
 */
export default function Moment({
  index,
  kicker,
  title,
  children,
}: {
  /** 1-based; printed as the moment's own numeral in the margin. */
  index: number;
  kicker?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-[620px]">
      <div className="relative border-l border-dashed border-black/20 pl-6">
        <span
          aria-hidden
          className="type-caption text-ink-muted absolute -left-[52px] top-[2px] hidden tracking-[0.14em] lg:block"
        >
          {String(index).padStart(2, "0")}
        </span>
        {kicker ? <CaseKicker>{kicker}</CaseKicker> : null}
        <h2 className={`type-subheading text-ink-alt ${kicker ? "mt-7" : ""}`}>{title}</h2>
        <div className="mt-5 flex flex-col gap-5">{children}</div>
      </div>
    </section>
  );
}

/**
 * The rest of a moment, after a figure has interrupted it.
 *
 * A moment whose argument needs evidence partway through can't hold its prose
 * in one block — the reader has to see the thing before the next paragraph
 * means anything. This is the continuation: the same measure and the same
 * dashed rule, carrying no numeral, kicker or heading, because those name the
 * moment once and repeating them would read as a new one starting.
 *
 * The rule is what does the work. It picks back up at the same x on the far
 * side of the image, so the thread is visibly the same thread and the figure
 * reads as something the argument stepped around rather than the end of it.
 */
export function MomentContinued({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-[620px]">
      <div className="relative flex flex-col gap-5 border-l border-dashed border-black/20 pl-6">
        {children}
      </div>
    </section>
  );
}
