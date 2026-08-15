import Placeholder from "../Placeholder";
import GrowOnView from "../GrowOnView";

/**
 * The case study's three image modes, kept separate on purpose — the framework
 * this page follows treats them as different arguments:
 *
 *   Figure      — one image, makes one point, follows a specific claim.
 *   FigureGrid  — many images, proves breadth; volume IS the argument.
 *   ComparePair — two images with one-word labels and a caption that
 *                 enumerates the difference. The only place a caption earns
 *                 itself, so `caption` is required here and optional elsewhere.
 *
 * Every slot is a <Placeholder> for now — the codebase's established stand-in
 * for art pending real exports. Each carries the label and aspect ratio the
 * real asset will have, so dropping the export in later is a one-line swap with
 * no layout movement.
 *
 * All figures rise and fade in on scroll: GrowOnView supplies the `.is-grown`
 * toggle, and `.case-figure` (globals.css) supplies the motion — GrowOnView's
 * own class only drives the puzzle pieces' `.pixel-cell` scale, so a figure
 * needs its own rule. Reduced motion is handled there.
 */

/** Corner registration dots — the blueprint marks that sit on the site's
 *  hatch cells and card corners, here pinning each figure to the grid. */
function Corners() {
  const D = "pointer-events-none absolute size-[5px] rounded-full bg-[#171717]";
  return (
    <>
      <span aria-hidden className={`${D} -left-[2.5px] -top-[2.5px]`} />
      <span aria-hidden className={`${D} -right-[2.5px] -top-[2.5px]`} />
      <span aria-hidden className={`${D} -bottom-[2.5px] -left-[2.5px]`} />
      <span aria-hidden className={`${D} -bottom-[2.5px] -right-[2.5px]`} />
    </>
  );
}

/** Caption — used sparingly. Sits under the figure in the muted caption tone. */
function Caption({ children }: { children: React.ReactNode }) {
  return (
    <p className="type-caption text-ink-muted mx-auto mt-4 max-w-[560px] leading-relaxed">
      {children}
    </p>
  );
}

export function Figure({
  label,
  ratio = 16 / 9,
  caption,
}: {
  label: string;
  ratio?: number;
  caption?: React.ReactNode;
}) {
  return (
    <figure className="mx-auto w-full max-w-[880px]">
      <GrowOnView className="case-figure relative block">
        <Placeholder label={label} ratio={ratio} />
        <Corners />
      </GrowOnView>
      {caption ? <figcaption><Caption>{caption}</Caption></figcaption> : null}
    </figure>
  );
}

export function FigureGrid({
  items,
  ratio = 4 / 3,
  columns = 2,
  caption,
}: {
  items: readonly string[];
  ratio?: number;
  columns?: 2 | 3;
  caption?: React.ReactNode;
}) {
  return (
    <figure className="mx-auto w-full max-w-[980px]">
      <div
        className={`grid gap-4 sm:gap-5 ${
          columns === 3 ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {items.map((label) => (
          <GrowOnView key={label} className="case-figure relative block">
            <Placeholder label={label} ratio={ratio} />
            <Corners />
          </GrowOnView>
        ))}
      </div>
      {caption ? <figcaption><Caption>{caption}</Caption></figcaption> : null}
    </figure>
  );
}

export function ComparePair({
  left,
  right,
  ratio = 4 / 3,
  caption,
}: {
  left: string;
  right: string;
  ratio?: number;
  /** Required: a pair without an enumerating caption is just two pictures. */
  caption: React.ReactNode;
}) {
  return (
    <figure className="mx-auto w-full max-w-[980px]">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {[left, right].map((label) => (
          <div key={label}>
            <p className="type-caption text-ink-muted mb-3 uppercase tracking-[0.14em]">
              {label}
            </p>
            <GrowOnView className="case-figure relative block">
              <Placeholder label={label} ratio={ratio} />
              <Corners />
            </GrowOnView>
          </div>
        ))}
      </div>
      <figcaption>
        <Caption>{caption}</Caption>
      </figcaption>
    </figure>
  );
}
