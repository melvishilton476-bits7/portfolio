import Placeholder from "../Placeholder";
import GrowOnView from "../GrowOnView";
import CropMarks from "./CropMarks";

/**
 * The case study's three image modes, kept separate on purpose — the framework
 * this page follows treats them as different arguments:
 *
 *   Figure      — one image, makes one point, follows a specific claim.
 *   FigurePair  — two Figures sharing a row, each keeping its own caption and
 *                 its own ratio. NOT a comparison: use it when two figures
 *                 each make their own point and neither needs the full
 *                 measure to make it. Sharing a row is the argument that
 *                 neither is the page's main event.
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
  round = true,
  shadow = true,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Set false for artwork whose own edge is the subject. A radius reads as
   *  the frame's own softening on a photograph; on a screen capture cropped
   *  flush to the UI it just clips the corners off real content. */
  round?: boolean;
  /** Set false when the artwork has no hard edge for a shadow to sit under —
   *  a plate that fades out sideways, or a frame whose subject already casts
   *  its own. A shadow needs an edge; drawn around something that dissolves,
   *  it puts a rectangle back that the artwork spent its effort removing. */
  shadow?: boolean;
}) {
  return (
    <div
      className={`${round ? R : ""} ${shadow ? "case-frame" : ""} overflow-hidden ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

/** Caption — used sparingly. Sits under the figure in the muted caption tone.
 *
 *  Centred, like the heading above it. `mx-auto` on a 560px box centres the
 *  BOX, not the text inside it, so under a wide figure the copy read as
 *  hanging off to the left with no edge to justify it — the frame's own left
 *  edge is 200px further out. */
function Caption({ children }: { children: React.ReactNode }) {
  return (
    <p className="type-caption text-ink-muted mx-auto mt-4 max-w-[560px] text-center leading-relaxed">
      {children}
    </p>
  );
}

export type FigureProps = {
  label: string;
  ratio?: number;
  caption?: React.ReactNode;
  /** A statement rather than a note. Set on a figure that carries a claim the
   *  page is making — it renders as a heading under the frame instead of the
   *  small muted caption, because "the warning sign is visible before the
   *  hazard it names" is the argument, not an aside about the picture. */
  heading?: React.ReactNode;
  /** Real artwork. Omit and the slot keeps its Placeholder. */
  visual?: React.ReactNode;
  /** Cap in px, for artwork the default 880 would render absurdly tall. A
   *  portrait panel at 0.77 is 1148px tall across the full measure; a border
   *  detail at 0.39 is over 2000. Width is the only lever, since the ratio is
   *  the artwork's own and cropping it is what this figure exists to avoid. */
  maxWidth?: number;
  /** Drop the frame's corner radius. For a capture cropped flush to the UI
   *  inside it, where the corners are content rather than edge. */
  square?: boolean;
  /** Drop the frame's shadow. See <Framed>'s `shadow`. */
  flat?: boolean;
  /** A line ABOVE the frame, naming what the reader is about to look at.
   *
   *  Distinct from `heading`, which sits under the frame and reads as the
   *  conclusion drawn FROM the picture. A title read before the picture is a
   *  different job: it tells you what changed, so the eye knows what it is
   *  looking for rather than working it out and then being told. Use it where
   *  the figure is the payoff of an argument the prose has just made. */
  title?: React.ReactNode;
};

export function Figure({
  label,
  ratio = 16 / 9,
  caption,
  heading,
  visual,
  maxWidth = 880,
  square = false,
  flat = false,
  title,
}: FigureProps) {
  return (
    <figure className="mx-auto w-full" style={{ maxWidth }}>
      {/* Not a <figcaption>: an element can only carry one, and this figure's
          belongs to the copy underneath. */}
      {title ? (
        <h3
          className="type-lead text-pretty mx-auto mb-6 max-w-[620px] text-center"
          style={{ color: "var(--color-ink)", fontWeight: 400 }}
        >
          {title}
        </h3>
      ) : null}
      <GrowOnView className="case-figure relative block">
        <Framed round={!square} shadow={!flat}>
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
      {heading || caption ? (
        <figcaption>
          {heading ? (
            <h3
              className="type-caption mx-auto mt-4 max-w-[560px] text-center leading-relaxed"
              style={{ color: "var(--color-ink)" }}
            >
              {heading}
            </h3>
          ) : null}
          {caption ? <Caption>{caption}</Caption> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

/**
 * Two figures side by side, each still a whole <Figure>.
 *
 * The reason this is not <ComparePair> is that the pair is not a comparison —
 * there is no "before" and "after" here, just two visuals that would each
 * dominate the page at full width and do not earn it. So there are no
 * one-word side labels, and each half keeps its own heading or caption
 * answering for itself.
 *
 * The two halves share a WIDTH, not a box: each passes its own `ratio`
 * through, so a 16:9 capture and a 2:1 one sit at the same scale rather than
 * being letterboxed into a common frame. Their bottoms will not line up, and
 * that is the correct outcome — forcing them level would mean cropping one
 * artefact to flatter the other.
 */
export function FigurePair({
  left,
  right,
  maxWidth = 980,
}: {
  left: FigureProps;
  right: FigureProps;
  /** Cap for the ROW. Each half then takes half of it, less the gutter. */
  maxWidth?: number;
}) {
  return (
    <div
      className="mx-auto grid w-full grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10"
      style={{ maxWidth }}
    >
      {/* maxWidth undone per half: <Figure>'s own 880 default would cap a
          column that is already narrower than that, and any half-specific cap
          belongs to the row, not to the artwork. */}
      <Figure {...left} maxWidth={9999} />
      <Figure {...right} maxWidth={9999} />
    </div>
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
