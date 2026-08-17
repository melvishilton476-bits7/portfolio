import Placeholder from "../Placeholder";
import GrowOnView from "../GrowOnView";
import CropMarks from "./CropMarks";

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

/** The rounding every figure carries — enough to take the hardness off a
 *  corner, small enough that you would not name it if asked. */
export const R = "rounded-[3px]";

/** Clips the artwork to R without clipping the crop marks, which live outside
 *  the box and so must stay a sibling of this wrapper rather than a child.
 *  Exported so bespoke layouts (TypeBento) frame their cells identically
 *  rather than re-deriving the radius and the clip. */
export function Framed({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`${R} overflow-hidden ${className}`} style={style}>
      {children}
    </div>
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
  visual,
}: {
  label: string;
  ratio?: number;
  caption?: React.ReactNode;
  /** Real artwork. Omit and the slot keeps its Placeholder. */
  visual?: React.ReactNode;
}) {
  return (
    <figure className="mx-auto w-full max-w-[880px]">
      <GrowOnView className="case-figure relative block">
        <Framed>
          {visual ? (
            // Same box the Placeholder reserved, so swapping art in moves
            // nothing around it.
            <div style={{ aspectRatio: String(ratio) }} className="relative w-full">
              {visual}
            </div>
          ) : (
            <Placeholder label={label} ratio={ratio} className={R} />
          )}
        </Framed>
        <CropMarks />
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
  visuals,
  before,
}: {
  items: readonly string[];
  ratio?: number;
  columns?: 2 | 3;
  caption?: React.ReactNode;
  /** Real artwork per cell, indexed against `items`. Any index left undefined
   *  keeps its Placeholder, so a grid can fill in as exports land instead of
   *  waiting for the whole set. */
  visuals?: readonly (React.ReactNode | undefined)[];
  /** Rendered inside the figure, ahead of the grid — for shared SVG defs the
   *  cells reference by id. */
  before?: React.ReactNode;
}) {
  return (
    <figure className="mx-auto w-full max-w-[980px]">
      {before}
      {/* Gap widened from 4/5: the marks reach 8px out of every corner, so
          neighbours in a 16px gutter would have met in the middle. */}
      <div
        className={`grid gap-6 sm:gap-8 ${
          columns === 3 ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {items.map((label, i) => {
          const visual = visuals?.[i];
          return (
            <GrowOnView key={label} className="case-figure relative block">
              <Framed>
                {visual ? (
                  // Same box the Placeholder reserved, so swapping art in
                  // moves nothing around it.
                  <div style={{ aspectRatio: String(ratio) }} className="relative w-full">
                    {visual}
                  </div>
                ) : (
                  <Placeholder label={label} ratio={ratio} className={R} />
                )}
              </Framed>
              <CropMarks />
            </GrowOnView>
          );
        })}
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
  leftVisual,
  rightVisual,
}: {
  left: string;
  right: string;
  ratio?: number;
  /** Required: a pair without an enumerating caption is just two pictures. */
  caption: React.ReactNode;
  /** Real artwork for a side. Omit and the side keeps its Placeholder, so the
   *  two halves can land at different times without the pair breaking. */
  leftVisual?: React.ReactNode;
  rightVisual?: React.ReactNode;
}) {
  const sides = [
    { label: left, visual: leftVisual },
    { label: right, visual: rightVisual },
  ];
  return (
    <figure className="mx-auto w-full max-w-[980px]">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
        {sides.map(({ label, visual }) => (
          <div key={label}>
            <p className="type-caption text-ink-muted mb-3 uppercase tracking-[0.14em]">
              {label}
            </p>
            <GrowOnView className="case-figure relative block">
              <Framed>
                {visual ? (
                  // The supplied artwork fills the same box the Placeholder
                  // reserved, so swapping one in moves nothing around it.
                  <div style={{ aspectRatio: String(ratio) }} className="relative w-full">
                    {visual}
                  </div>
                ) : (
                  <Placeholder label={label} ratio={ratio} className={R} />
                )}
              </Framed>
              <CropMarks />
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
