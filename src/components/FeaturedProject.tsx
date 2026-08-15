"use client";

import { useRef } from "react";
import Placeholder from "./Placeholder";
import CursorFollower from "./CursorFollower";

/** Constant across every project — the pointer speaks for the section, not
    for any one piece of work. */
const CURSOR_LABEL = "Go ahead click, Don’t be shy";

/**
 * The featured-project card: a dark grey panel holding the project's media at
 * the top and its quote — in white — directly beneath, on the card itself.
 * No separate quote box; the card is one dark slab. Colour in this section
 * comes from the floating asterisks around the card and the ticket below,
 * not from the card chrome.
 *
 * The media slot stays a Placeholder deliberately: the timecode, guides and
 * ruler in the design are baked into the exported asset, so nothing is
 * rendered over it here.
 *
 * The `<a>` is the real control under the cursor-follower label; everything
 * else is presentational. `flat` (small screens / reduced motion) just drops
 * the follower, which needs hover and the carousel to make sense.
 */
export default function FeaturedProject({
  title,
  quote,
  href = "#",
  current = false,
  flat = false,
}: {
  title: string;
  quote: string;
  href?: string;
  /** True while this card owns the centre of the filmstrip — gates the
      cursor follower, which only makes sense on the interactive slide. */
  current?: boolean;
  flat?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={cardRef} className="relative mx-auto w-full max-w-[560px]">
      <a
        href={href}
        className="relative z-10 block overflow-hidden rounded-card bg-ink p-5 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.4)]"
      >
        <span className="sr-only">View {title}</span>

        {/* Paper-grain texture on the ink fill — see globals.css → CARD GRAIN. */}
        <div aria-hidden className="card-grain" />

        <Placeholder
          label="Featured project"
          ratio={493 / 256}
          variant="dark"
          className="rounded-card border-0"
        />

        <blockquote
          // Was .type-label — a LABEL token (weight 500) carrying descriptive
          // prose, which made this the heaviest text on the card: heavier than
          // the h3 title it describes. Now weight 400, matching the card's meta
          // and leaving the title to lead on size alone. Dropping the class also
          // retires the inline font-size that only existed to out-specify it
          // (.type-label is unlayered and beat Tailwind's text utilities).
          className="font-display mt-5 text-center text-[0.9375rem] font-normal leading-snug tracking-[-0.05em] text-white"
          // The card is the link; the quote is a description, not a target.
          aria-hidden
        >
          &ldquo;{quote}&rdquo;
        </blockquote>
      </a>

      {!flat && (
        <CursorFollower containerRef={cardRef} enabled={current} label={CURSOR_LABEL} />
      )}
    </div>
  );
}
