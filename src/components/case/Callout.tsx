import type { ReactNode } from "react";

/**
 * A qualification the reader has to cross rather than scroll past.
 *
 * Used for the things a case study is tempted to bury: numbers that were set
 * to fill a layout, imagery that isn't what it looks like, claims the work
 * doesn't actually support. Those belong next to the artwork that makes them,
 * not in a caption underneath it — a reader judging a trail sign needs to know
 * its distances are invented *before* they read them as park data.
 *
 * Solid ruled box rather than the dashed blueprint rules used everywhere else:
 * every other frame on the page is decoration, and this one is a claim about
 * the evidence, so it deliberately does not match them.
 */
export default function Callout({
  label = "Caveat",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <aside className="mx-auto w-full max-w-[620px]">
      <div className="border border-black/25 px-6 py-5">
        <p className="type-caption text-ink uppercase tracking-[0.14em]">{label}</p>
        <div className="type-lead text-pretty mt-3" style={{ fontWeight: 300 }}>
          {children}
        </div>
      </div>
    </aside>
  );
}
