import type { CSSProperties } from "react";
import type { MoleKind } from "./constants";

/**
 * One pixel character: a coloured cap with a grey body standing in front of it,
 * two white eyes punched out of the body. Traced off the Figma source
 * (node 658:491) — the cap is a plain rectangle 82 × 61 and reads as a hat only
 * because the 56 × 103 body covers its middle, which is why there is no
 * separate brim or crown element here.
 *
 * EVERY DIMENSION IS A RATIO OF ONE `--mole-w`, so the whole figure scales by
 * setting a single length. That is what lets the arena grow a mole from 72% to
 * full size, and lets the legend draw the same character at whatever size the
 * column has room for, without a second set of numbers anywhere.
 *
 * No hooks, no client boundary: this renders on the server for the legend and
 * gets bundled into the game chunk for the arena.
 */
export default function MoleFigure({
  kind,
  className = "",
  style,
}: {
  kind: MoleKind;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span aria-hidden className={`mole-figure ${className}`} data-kind={kind} style={style}>
      <span className="mole-figure__hat" />
      <span className="mole-figure__body">
        <span className="mole-figure__eye" />
        <span className="mole-figure__eye" />
      </span>
    </span>
  );
}
