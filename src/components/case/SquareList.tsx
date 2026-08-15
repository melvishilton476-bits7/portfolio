"use client";

import type { CSSProperties } from "react";

const PURPLE = "#8581ff";

/**
 * A short list whose markers are the site's periwinkle registration squares
 * rather than bullets — the same 8px mark that punctuates the hero and the
 * Contact form, reused as a list glyph. Each square carries the shared
 * entrance + flicker so the list wakes up like the rest of the decoration,
 * staggered down the list.
 *
 * Used for the three ways performance eyewear shouts, and for the colour names.
 */
export default function SquareList({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, i) => (
        <li key={item} className="flex items-start gap-4">
          <span
            aria-hidden
            className={`mt-[0.5em] size-[8px] shrink-0 ${i % 2 === 0 ? "accent-flicker-a" : "accent-flicker-b"}`}
            style={
              {
                background: PURPLE,
                ["--enter" as string]: `${0.2 + i * 0.15}s`,
              } as CSSProperties
            }
          />
          <span
            className="type-lead text-ink"
            style={{ letterSpacing: "-0.02em", fontWeight: 300 }}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
