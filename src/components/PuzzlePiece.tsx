import type { CSSProperties } from "react";
import { buildPiece, type PieceSide } from "@/lib/puzzle-piece";

/** Sprite lime — deliberately hotter than --color-accent. */
const LIME = "#BFFF00";

/**
 * One pixel puzzle-piece, sat behind a ticket and poking out past its edge.
 * Purely decorative. Per-cell delay and growth origin come from the BFS in
 * lib/puzzle-piece; the motion itself lives in globals.css so 19 cells cost
 * a keyframe and a custom property each rather than 19 JS-driven animations.
 */
export default function PuzzlePiece({ side }: { side: PieceSide }) {
  const { cells, cols, rows, cell } = buildPiece(side);
  const w = cols * cell;
  const h = rows * cell;

  return (
    <svg
      aria-hidden
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className={`pixel-piece pixel-piece--${side}`}
    >
      {cells.map((c, i) => (
        <rect
          key={i}
          className="pixel-cell"
          x={c.x * cell}
          y={c.y * cell}
          width={cell}
          height={cell}
          fill={LIME}
          style={
            {
              "--d": `${c.delay}ms`,
              "--dr": `${c.rewind}ms`,
              "--o": c.origin,
            } as CSSProperties
          }
        />
      ))}
    </svg>
  );
}
