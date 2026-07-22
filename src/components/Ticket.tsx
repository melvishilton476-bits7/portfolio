import Placeholder from "./Placeholder";
import GrowOnView from "./GrowOnView";
import PuzzlePiece from "./PuzzlePiece";

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
  pieces = true,
  active,
}: TicketProps) {
  const ink = darkText ? "text-ink" : "text-white";

  return (
    <GrowOnView className="relative w-full max-w-[204px]" active={active}>
      {pieces && (
        <>
          <PuzzlePiece side="left" />
          <PuzzlePiece side="right" />
        </>
      )}

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

        {/* Stub — height matches --tear-y (4rem). */}
        <div className="flex h-16 items-center px-4">
          <a
            href={href}
            className="type-caption block w-full bg-ink py-2 text-center text-white transition-opacity hover:opacity-85"
          >
            View Project
          </a>
        </div>

        <div className="ticket-tear" aria-hidden />
      </article>
    </GrowOnView>
  );
}
