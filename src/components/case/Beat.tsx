import type { ReactNode } from "react";
import CaseKicker from "./CaseKicker";

/**
 * One narrative beat of a case study: kicker → subhead → prose.
 *
 * The ladder is the site's own type scale, one rung apart at each step:
 * caption (12.4px) for the kicker, subheading (26px) for the subhead, lead
 * (17px / weight 300 / muted) for the body — the same treatment the hero
 * tagline uses, so long-form prose here reads as the same voice.
 *
 * Text sits in a ~620px measure (about 65 characters at the lead size) centred
 * in the page container. Figures are rendered OUTSIDE this measure by the case
 * study itself, so they can breathe wider than the column — that alternation is
 * the page's rhythm.
 */
export default function Beat({
  kicker,
  title,
  children,
}: {
  /** Omitted on a beat that continues the previous one across a thesis band —
   *  a second label there would read as a new section rather than a resumption. */
  kicker?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-[620px]">
      {kicker ? <CaseKicker>{kicker}</CaseKicker> : null}
      <h2 className={`type-subheading text-ink-alt ${kicker ? "mt-7" : ""}`}>{title}</h2>
      {children ? <div className="mt-5 flex flex-col gap-5">{children}</div> : null}
    </section>
  );
}

/**
 * Body paragraph — the lead token, matching the hero tagline exactly.
 *
 * `text-pretty`, not `text-balance`: balancing equalises line lengths, which is
 * right for a two-line headline and wrong for running prose — it pulls the last
 * lines short and leaves the paragraph visibly ragged. Pretty only guards
 * against orphans, which is the actual problem in a column this narrow.
 */
export function P({ children }: { children: ReactNode }) {
  return (
    <p
      className="type-lead text-pretty"
      style={{ letterSpacing: "-0.02em", fontWeight: 300 }}
    >
      {children}
    </p>
  );
}
