import type { CSSProperties } from "react";

/**
 * The site's crop mark: an 8px light-grey L-bracket with a 3px black
 * registration dot nested in its crook. It frames the "SIGHTS to SEE" and
 * "Let's have a chat." subtitles, the case-study beat kickers, and — from here
 * on — every figure on a case-study page.
 *
 * Extracted because the same element was being hand-written in three places.
 * The only thing that varied was how far the marks sit outside their box, so
 * that is the prop: type needs generous room (26 × 18), an image reads better
 * with the arms landing right on its edge (8 × 8).
 *
 * The dot is always #171717 — the one black every registration mark on this
 * site shares — and is placed by the same edge anchors as its bracket, then
 * nudged 4px diagonally inward so it sits in the crook rather than on it.
 *
 * Renders into a positioned ancestor; the caller owns that.
 */
type Corner = "tl" | "tr" | "bl" | "br";

const CONF: Record<Corner, { border: string; edges: (x: string, y: string) => CSSProperties; nudge: string }> = {
  tl: { border: "border-l border-t", edges: (x, y) => ({ left: x, top: y }), nudge: "translate-x-[4px] translate-y-[4px]" },
  tr: { border: "border-r border-t", edges: (x, y) => ({ right: x, top: y }), nudge: "-translate-x-[4px] translate-y-[4px]" },
  bl: { border: "border-b border-l", edges: (x, y) => ({ left: x, bottom: y }), nudge: "translate-x-[4px] -translate-y-[4px]" },
  br: { border: "border-b border-r", edges: (x, y) => ({ right: x, bottom: y }), nudge: "-translate-x-[4px] -translate-y-[4px]" },
};

const ALL: Corner[] = ["tl", "tr", "bl", "br"];

export default function CropMarks({
  offsetX = 8,
  offsetY = 8,
  corners = ALL,
}: {
  offsetX?: number;
  offsetY?: number;
  /** Defaults to all four. The case hero passes just the top pair — its lower
   *  corners sit inside the fade, where a mark would only half-appear. */
  corners?: readonly Corner[];
}) {
  const x = `-${offsetX}px`;
  const y = `-${offsetY}px`;

  return (
    <>
      {corners.map((c) => (
        <span
          key={`bracket-${c}`}
          aria-hidden
          className={`pointer-events-none absolute h-2 w-2 border-[#cfcfcf] ${CONF[c].border}`}
          style={CONF[c].edges(x, y)}
        />
      ))}
      {corners.map((c) => (
        <span
          key={`dot-${c}`}
          aria-hidden
          className={`pointer-events-none absolute size-[3px] rounded-full bg-[#171717] ${CONF[c].nudge}`}
          style={CONF[c].edges(x, y)}
        />
      ))}
    </>
  );
}
