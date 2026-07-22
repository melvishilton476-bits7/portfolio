"use client";

import { useRef } from "react";
import Placeholder from "./Placeholder";
import PaperClip from "./PaperClip";
import CursorFollower from "./CursorFollower";

/** Constant across every project — the pointer speaks for the section, not
    for any one piece of work. */
const CURSOR_LABEL = "Go ahead click, Don’t be shy";

/**
 * The featured-project card: a yellow panel holding the project's media and
 * its description, with tag tabs slipped in behind the top edge and a
 * paperclip gripping the quote.
 *
 * Only two things break the panel's bounds — the tabs above and the clip to
 * the right — so the card sits in the layout as a plain block despite the
 * stacking. Everything decorative is aria-hidden; the panel itself is the
 * link, so there's a real control under the cursor label.
 *
 * The media slot stays a Placeholder deliberately: the timecode, guides and
 * ruler in the design are baked into the exported asset, so nothing is
 * rendered over it here.
 *
 * `flat` is the small-screen and reduced-motion form: tags become ordinary
 * chips above the card and the layered flourishes drop away, since none of
 * them survive without hover or the carousel to sit in.
 */
export default function FeaturedProject({
  title,
  quote,
  tags,
  href = "#",
  current = false,
  flat = false,
}: {
  title: string;
  quote: string;
  tags: readonly string[];
  href?: string;
  /** True while this card owns the centre of the filmstrip — gates the
      cursor follower, which only makes sense on the interactive slide. */
  current?: boolean;
  flat?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={cardRef} className="relative mx-auto w-full max-w-[560px]">
      {flat ? (
        <ul className="mb-4 flex flex-wrap gap-3">
          {tags.map((tag) => (
            <li
              key={tag}
              className="type-caption rounded-card bg-tag px-4 py-1.5 text-chip-text"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : (
        <>
          {/* The panel covers the tabs' lower half, leaving the label showing
              in the strip above. */}
          <ul className="absolute -top-7 left-[7%] z-0 flex gap-3">
            {tags.map((tag) => (
              <li
                key={tag}
                className="type-caption flex h-14 w-24 justify-center rounded-card bg-tag pt-2 text-chip-text"
              >
                {tag}
              </li>
            ))}
          </ul>

          {/* Decorative only — a third tab peeking from the side for depth. */}
          <div
            aria-hidden
            className="absolute top-[38%] -right-6 z-0 h-16 w-10 rounded-card bg-tag"
          />
        </>
      )}

      <a
        href={href}
        className="relative z-10 block rounded-card bg-panel p-4 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.35)]"
      >
        <span className="sr-only">View {title}</span>

        <Placeholder
          label="Featured project"
          ratio={493 / 256}
          variant="dark"
          className="rounded-card border-0"
        />

        <QuoteCard quote={quote} flat={flat} />
      </a>

      {!flat && (
        <CursorFollower containerRef={cardRef} enabled={current} label={CURSOR_LABEL} />
      )}
    </div>
  );
}

function QuoteCard({ quote, flat }: { quote: string; flat: boolean }) {
  return (
    <div className="relative mt-3 rounded-card bg-white px-6 py-4">
      <blockquote
        className="type-label text-center leading-snug text-ink"
        // Smaller than the type-label default: .type-label is unlayered CSS
        // and beats Tailwind's layered text utilities, so the size has to be
        // set inline to win the cascade.
        style={{ fontSize: "0.9375rem" }}
        // The card is the link; the quote is a description, not a target.
        aria-hidden
      >
        &ldquo;{quote}&rdquo;
      </blockquote>
      {/* Straddles the quote card's right edge and runs past the panel. */}
      {!flat && <PaperClip className="absolute top-4 -right-12" />}
    </div>
  );
}
