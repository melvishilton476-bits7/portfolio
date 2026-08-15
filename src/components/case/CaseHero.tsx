import type { CSSProperties } from "react";
import Placeholder from "../Placeholder";
import GrowOnView from "../GrowOnView";

const PURPLE = "#8581ff";

/**
 * Case-study opener: eyebrow → title → one-line dek → the strongest frame the
 * project owns, full bleed.
 *
 * The hero is the one place the framework allows an image BEFORE the copy that
 * explains it, on the grounds that it's the best frame you have and it earns
 * its place on looks alone. Everything after this point is copy-first.
 *
 * Type ladder matches the home page exactly: the project name takes
 * `type-display` (the token reserved for the site's h1), the dek takes the lead
 * size, and the eyebrow takes the caption size — so a case study reads as the
 * same site rather than a microsite. Periwinkle registration marks flank the
 * title the way they flank the hero headline.
 */
export default function CaseHero({
  eyebrow,
  title,
  dek,
  frameLabel,
}: {
  eyebrow: string;
  title: string;
  dek: string;
  frameLabel: string;
}) {
  return (
    <header className="pt-32 sm:pt-40">
      <div className="page-container">
        <div className="relative mx-auto max-w-[820px] text-center">
          {/* Registration squares flanking the title — the hero's own marks. */}
          <span
            aria-hidden
            className="accent-flicker-a absolute -left-[10px] top-[54px] hidden size-[10px] lg:block"
            style={{ background: PURPLE, ["--enter" as string]: "0.5s" } as CSSProperties}
          />
          <span
            aria-hidden
            className="accent-flicker-b absolute -right-[10px] top-[54px] hidden size-[10px] lg:block"
            style={{ border: `1px solid ${PURPLE}`, ["--enter" as string]: "0.7s" } as CSSProperties}
          />

          <p className="type-caption text-ink-muted uppercase tracking-[0.14em]">{eyebrow}</p>
          <h1 className="type-display text-ink-hero mt-5">{title}</h1>
          <p
            className="type-lead mx-auto mt-6 max-w-[520px] text-balance"
            style={{ letterSpacing: "-0.02em", fontWeight: 300 }}
          >
            {dek}
          </p>
        </div>
      </div>

      <div className="page-container mt-14 sm:mt-20">
        <GrowOnView className="case-figure relative mx-auto block w-full max-w-[1100px]">
          <Placeholder label={frameLabel} ratio={16 / 9} variant="dark" />
        </GrowOnView>
      </div>
    </header>
  );
}
