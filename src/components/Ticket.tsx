import Placeholder from "./Placeholder";
import GrowOnView from "./GrowOnView";
// import PuzzlePiece from "./PuzzlePiece"; // puzzle pieces commented out for now

type TicketProps = {
  title: string;
  meta: string;
  /** Ticket body colour — the card is fully tinted, not just the art. */
  color: string;
  /** Set when the tint is light enough that ink text reads better than white. */
  darkText?: boolean;
  href?: string;
  /** Show the lime puzzle pieces growing out from behind the card. On by
      default — every ticket carries the same lime pieces. */
  pieces?: boolean;
  /** Forwarded to GrowOnView — see its docstring. */
  active?: boolean;
};

/**
 * Ticket — a project card shaped like a real event ticket: shallow dips
 * centred on the top and bottom edges, a circular notch punched into each
 * side, and a dashed perforation running notch-to-notch that tears the
 * "View Project" stub off the bottom.
 *
 * Shape lives in globals.css (.ticket-shape / .ticket-tear). The stub's
 * height and --tear-y must stay equal or the perforation drifts off the seam.
 * Art is a placeholder pending real exports.
 */
export default function Ticket({
  title,
  meta,
  color,
  darkText = false,
  href = "#",
  // pieces prop kept in the type but unused while puzzle pieces are commented out
  active,
}: TicketProps) {
  const ink = darkText ? "text-ink" : "text-white";

  return (
    <GrowOnView className="relative w-full max-w-[204px]" active={active}>
      {/* Puzzle pieces commented out for now. */}
      {/* {pieces && (
        <>
          <PuzzlePiece side="left" />
          <PuzzlePiece side="right" />
        </>
      )} */}

      <article
        className={`ticket-shape relative z-10 w-full ${ink}`}
        style={{ background: color }}
      >
        {/* Body — clears the top dip so the title doesn't sit under the cut. */}
        <div className="px-4 pt-5">
          <h3 className="type-label leading-none">{title}</h3>
          <p className="type-caption mt-1 opacity-80">{meta}</p>
        </div>

        {/* Letterboxed still — full-bleed across the ticket. */}
        <Placeholder
          label={title}
          ratio={232 / 34}
          variant="dark"
          className="mt-3 mb-4 border-0"
        />

        {/* Stub — height matches --tear-y (4rem). The CTA is just the label in
            the card's ink colour, framed by four crop-mark brackets (same ink)
            — no filled box. */}
        <div className="flex h-16 items-center px-4">
          <a
            href={href}
            className="type-caption relative block w-full py-2 text-center transition-opacity hover:opacity-85"
          >
            <span aria-hidden className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l border-t border-current" />
            <span aria-hidden className="pointer-events-none absolute right-0 top-0 h-2 w-2 border-r border-t border-current" />
            <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-2 w-2 border-b border-l border-current" />
            <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-2 w-2 border-b border-r border-current" />
            View Project
          </a>
        </div>

        <div className="ticket-tear" aria-hidden />
      </article>
    </GrowOnView>
  );
}
