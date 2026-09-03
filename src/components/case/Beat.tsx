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
  /** Omitted on a bare paragraph that belongs to the section above it but
   *  isn't a new claim — a heading there would announce a section that the
   *  copy doesn't actually start. */
  title?: string;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-[620px]">
      {kicker ? <CaseKicker>{kicker}</CaseKicker> : null}
      {title ? (
        <h2 className={`type-subheading text-ink-alt ${kicker ? "mt-7" : ""}`}>{title}</h2>
      ) : null}
      {children ? (
        <div className={`flex flex-col gap-5 ${kicker || title ? "mt-5" : ""}`}>{children}</div>
      ) : null}
    </section>
  );
}

/**
 * Body paragraph — the lead token, matching the hero tagline exactly.
 *
 * Justified via `prose-justified` (globals.css), which also carries the
 * hyphenation, the inter-word setting and the tracking the alignment needs to
 * not river. Tracking lives there rather than inline for that reason: it is part
 * of the justification, not a property of this component.
 *
 * `text-pretty`, not `text-balance`: balancing equalises line lengths, which is
 * right for a two-line headline and wrong for running prose. Pretty guards
 * against a one-word last line, which justification makes worse rather than
 * better — a stranded word sits alone against a hard flush edge above it.
 */
export function P({ children }: { children: ReactNode }) {
  return (
    <p
      className="type-lead prose-justified text-pretty"
      style={{ fontWeight: 300 }}
    >
      {children}
    </p>
  );
}
