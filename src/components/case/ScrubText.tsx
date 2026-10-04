"use client";

import { useEffect, useRef } from "react";

/**
 * A heading that fills in as you read down to it.
 *
 * Each character starts in the `off` colour and turns `on` in reading order as
 * the heading travels up the viewport — scrubbed, not triggered, so scrolling
 * back up empties it again. It is the one device on the Zenxo page that ties a
 * sentence to the reader's own pace: the claim is only fully "said" once they
 * have actually arrived at it.
 *
 * Character-level rather than a gradient clipped to the text: a gradient runs
 * left to right across the whole BLOCK, so a two-line heading would fill both
 * lines at once. Reading order is the point.
 *
 * Words are wrapped whole (nowrap) so the per-character spans never let a line
 * break mid-word. The full string rides on `aria-label`, since a screen reader
 * walking forty single-letter spans would spell the heading out.
 *
 * Renders fully `on` until it mounts, and stays that way under reduced motion —
 * so without JS the heading is simply the heading.
 */
export default function ScrubText({
  text,
  as: Tag = "h2",
  on,
  off,
  className = "",
  style,
  start = 0.88,
  end = 0.42,
}: {
  text: string;
  as?: "h2" | "h3" | "p";
  on: string;
  off: string;
  className?: string;
  style?: React.CSSProperties;
  /** Viewport fraction (from the top) at which the first character turns. */
  start?: number;
  /** Viewport fraction at which the last one has. */
  end?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const chars = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-c]"));
    const n = chars.length;
    let shown = -1;
    let frame = 0;

    const paint = () => {
      frame = 0;
      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, (vh * start - top) / (vh * (start - end))));
      const count = Math.round(p * n);
      if (count === shown) return;
      // Only the span between the old and new count changes colour, so a
      // scroll tick costs a handful of style writes rather than all of them.
      const [a, b] = shown < 0 ? [0, n] : [Math.min(shown, count), Math.max(shown, count)];
      for (let i = a; i < b; i++) chars[i].style.color = i < count ? on : off;
      shown = count;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [on, off, start, end]);

  const words = text.split(" ");

  return (
    <Tag ref={ref} aria-label={text} className={className} style={style}>
      {words.map((word, w) => (
        <span key={w} aria-hidden>
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((ch, c) => (
              <span
                key={c}
                data-c
                className="transition-colors duration-150"
                style={{ color: on }}
              >
                {ch}
              </span>
            ))}
          </span>
          {w < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
