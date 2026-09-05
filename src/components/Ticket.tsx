import Image from "next/image";
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
  /** Path under /public for the letterboxed still. Omit to keep the dashed
      placeholder — a ticket can be laid out before its art exists. */
  thumb?: string;
  thumbAlt?: string;
  /** object-position for the crop; defaults to centre. */
  thumbPosition?: string;
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
  thumb,
  thumbAlt,
  thumbPosition,
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
          <h3 className="type-subheading-sm leading-none">{title}</h3>
          <p className="type-caption mt-1 opacity-80">{meta}</p>
        </div>

        {/* Letterboxed still — full-bleed across the ticket. The 232:34 slot is
            far wider than any source asset, so the art is cropped to a band
            rather than letterboxed with bars. */}
        {thumb ? (
          <div
            className="relative mt-3 mb-4 w-full overflow-hidden"
            style={{ aspectRatio: "232 / 34" }}
          >
            <Image
              src={thumb}
              alt={thumbAlt ?? title}
              fill
              sizes="204px"
              className="object-cover"
              style={{ objectPosition: thumbPosition }}
            />
          </div>
        ) : (
          <Placeholder
            label={title}
            ratio={232 / 34}
            variant="dark"
            className="mt-3 mb-4 border-0"
          />
        )}

        {/* Stub — height matches --tear-y (4rem). The CTA is just the label in
            the card's ink colour, framed by four crop-mark brackets (same ink)
            — no filled box.

            Hover repeats the hero CTA's crop-mark move (Hero.tsx): each corner
            is its own group so the bracket and the registration dot nested in
            its crook slide inward together, and the label picks up a soft glow.
            Bracket + dot both use `current` rather than the site's #171717 so
            the mark stays legible on the darkly tinted tickets — the ink here
            IS the card's foreground colour. */}
        <div className="flex h-16 items-center px-4">
          {/* The words the site cursor swells into over this link. Declared on
              the target rather than in <Cursor>, so the label lives next to the
              thing it describes. */}
          <a
            href={href}
            data-cursor="View case study"
            className="type-caption group relative block w-full py-2 text-center transition-opacity hover:opacity-85"
          >
            {/* TL */}
            <span aria-hidden className="pointer-events-none absolute left-0 top-0 transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:translate-y-[3px]">
              <span className="block h-2 w-2 border-l border-t border-current" />
              <span className="absolute left-0 top-0 size-[2.5px] translate-x-[3px] translate-y-[3px] rounded-full bg-current" />
            </span>
            {/* TR */}
            <span aria-hidden className="pointer-events-none absolute right-0 top-0 transition-transform duration-300 ease-out group-hover:-translate-x-[3px] group-hover:translate-y-[3px]">
              <span className="block h-2 w-2 border-r border-t border-current" />
              <span className="absolute right-0 top-0 size-[2.5px] -translate-x-[3px] translate-y-[3px] rounded-full bg-current" />
            </span>
            {/* BL */}
            <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]">
              <span className="block h-2 w-2 border-b border-l border-current" />
              <span className="absolute bottom-0 left-0 size-[2.5px] translate-x-[3px] -translate-y-[3px] rounded-full bg-current" />
            </span>
            {/* BR */}
            <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 transition-transform duration-300 ease-out group-hover:-translate-x-[3px] group-hover:-translate-y-[3px]">
              <span className="block h-2 w-2 border-b border-r border-current" />
              <span className="absolute bottom-0 right-0 size-[2.5px] -translate-x-[3px] -translate-y-[3px] rounded-full bg-current" />
            </span>
            <span className="ticket-cta-label">View Project</span>
          </a>
        </div>

        <div className="ticket-tear" aria-hidden />
      </article>
    </GrowOnView>
  );
}
