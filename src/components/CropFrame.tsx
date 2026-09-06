/**
 * Crop-mark + nested-dot corners hugging whatever it wraps — the site's
 * "this is a piece of artwork on a board" frame, first used on the
 * "SIGHTS to SEE" caption (Work.tsx) and the Contact subtitle.
 *
 * Four light-grey L-brackets sit `x`/`y` outside the content box with a small
 * dark registration dot nested into each crook. The dots are #171717, the same
 * black every other decorative dot on the site uses — never a lighter grey, or
 * they stop reading as registration marks and start reading as dirt.
 *
 * Offsets are props because the callers frame different things: a tight
 * caption wants the marks close, an About section heading wants them wide
 * enough to read as a title plate.
 *
 * THE HORIZONTAL OFFSET IS A CEILING, NOT A CONSTANT. `x` is spent through
 * min(x, 4vw), because the marks sit OUTSIDE the content box and the content
 * box on a phone already runs to the page gutter — a flat 40px put both
 * columns of marks off the side of a 375px screen, where they were clipped
 * away entirely. The frame was drawing four brackets nobody could see. On a
 * desktop 4vw is far past any offset a caller asks for, so nothing there
 * changes.
 */
export default function CropFrame({
  children,
  x = 26,
  y = 18,
  className = "",
  as: Tag = "span",
}: {
  children: React.ReactNode;
  /** Horizontal distance from the content box to the brackets, in px. */
  x?: number;
  /** Vertical distance from the content box to the brackets, in px. */
  y?: number;
  className?: string;
  /** The wrapper element. A `span` suits the captions this was written for,
   *  but a caller framing a whole block (headings, paragraphs) must pass "div"
   *  — a <p> inside a <span> is invalid nesting and the browser reparents it,
   *  which pulls the content out of the frame it was meant to sit in. */
  as?: "span" | "div";
}) {
  const B = "pointer-events-none absolute h-2 w-2 border-[#cfcfcf]";
  const D = "pointer-events-none absolute size-[3px] rounded-full bg-[#171717]";
  /** Bracket edge, and the dot nested 4px into its crook. */
  const ox = `calc(-1 * min(${x}px, 4vw))`;
  const dx = `calc(4px - min(${x}px, 4vw))`;
  return (
    <Tag className={`relative ${Tag === "span" ? "inline-block" : "block"} ${className}`}>
      {/* Brackets, then the dots nested 4px into each crook. */}
      <span aria-hidden className={`${B} border-l border-t`} style={{ left: ox, top: -y }} />
      <span aria-hidden className={`${B} border-r border-t`} style={{ right: ox, top: -y }} />
      <span aria-hidden className={`${B} border-b border-l`} style={{ left: ox, bottom: -y }} />
      <span aria-hidden className={`${B} border-b border-r`} style={{ right: ox, bottom: -y }} />
      <span aria-hidden className={D} style={{ left: dx, top: -y + 4 }} />
      <span aria-hidden className={D} style={{ right: dx, top: -y + 4 }} />
      <span aria-hidden className={D} style={{ left: dx, bottom: -y + 4 }} />
      <span aria-hidden className={D} style={{ right: dx, bottom: -y + 4 }} />
      {children}
    </Tag>
  );
}
