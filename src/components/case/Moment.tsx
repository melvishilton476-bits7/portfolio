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
