/**
 * The lime pixel puzzle-piece that sits behind each ticket, and the schedule
 * that grows it.
 *
 * The sprite is 19 discrete squares, so instead of moving as a lump it can be
 * grown cell by cell. Growth spreads through ADJACENCY (breadth-first), not
 * through a sort — a cell only sprouts once a neighbour exists, which is what
 * reads as branching rather than scattered twinkling. The traversal is rooted
 * at the end tucked behind the ticket, so each piece appears to grow outward
 * from under the card.
 *
 * Everything here is derived, not hand-tuned: change BASE and the delays,
 * origins and branch structure all follow.
 */

export type PieceSide = "left" | "right";

export type PieceCell = {
  /** Grid position, in cell units. */
  x: number;
  y: number;
  /** When this cell sprouts, in ms. */
  delay: number;
  /** transform-origin — the edge facing this cell's parent, so it visibly
      extrudes OUT of the cell before it rather than popping in place. */
  origin: string;
};

export type Piece = {
  cells: PieceCell[];
  /** Extent in cell units. */
  cols: number;
  rows: number;
  /** Cell size in px. The source draws the right piece 4.9% larger. */
  cell: number;
};

/* Sprite cells in grid units, traced from the source SVG. The half steps are
   in the original — the sprite is deliberately off-grid in places. */
const BASE: readonly (readonly [number, number])[] = [
  [0, 1], [1, 1], [1, 2], [1, 3.5], [2, 4.5],
  [5, 3], [3, 1], [4, 0], [1, 3], [1, 4.5],
  [4, 3], [2, 1], [3, 0], [2, 5.5], [5, 4],
  [3, 2], [2, 2], [2, 3], [3, 3],
];

/** Bottom row of the sprite — the pivot for the 90° rotation. */
const MAX_ROW = 5.5;

/** Total spread of the growth, ms. */
const SPREAD = 900;
/**
 * Stagger exponent. Counter-intuitively this ACCELERATES the delay: for cells
 * to appear fast-then-slow, the gaps between them have to widen. Higher =
 * more front-loaded. At 2.2 the first three generations land inside 57ms
 * while the last step alone takes 259ms.
 */
const CURVE = 2.2;

/** The far piece trails the near one, so the pair feels alive, not mirrored. */
const SIDE_DELAY: Record<PieceSide, number> = { left: 0, right: 150 };

/** Source cell size; the right piece is drawn fractionally larger. */
const SIDE_CELL: Record<PieceSide, number> = { left: 11, right: 11.5385 };

const EPS = 1e-6;

/** Cells touch if their squares share a positive-length edge or overlap.
    Corner-only contact does not count — growth would look like it jumped. */
function touches(a: readonly [number, number], b: readonly [number, number]) {
  const ox = Math.min(a[0] + 1, b[0] + 1) - Math.max(a[0], b[0]);
  const oy = Math.min(a[1] + 1, b[1] + 1) - Math.max(a[1], b[1]);
  return ox >= -EPS && oy >= -EPS && (ox > EPS || oy > EPS);
}

/** The edge of a cell facing its parent. */
function originToward(dx: number, dy: number) {
  if (Math.abs(dx) >= Math.abs(dy)) return dx > 0 ? "100% 50%" : "0% 50%";
  return dy > 0 ? "50% 100%" : "50% 0%";
}

export function buildPiece(side: PieceSide): Piece {
  /* The right piece is the left rotated 90° CW in the source — not mirrored.
     Rotating the coordinates keeps the two identical by construction. */
  const coords: (readonly [number, number])[] =
    side === "left"
      ? BASE.map((c) => c)
      : BASE.map(([c, r]) => [MAX_ROW - r, c] as const);

  /* Root at the end that sits behind the ticket, so growth emerges from under
     the card on both sides. Rotating the traversal instead would have the
     right piece growing up from its base — same shape, wrong behaviour. */
  const rootX = side === "left"
    ? Math.max(...coords.map((c) => c[0]))
    : Math.min(...coords.map((c) => c[0]));
  const root = coords.findIndex((c) => c[0] === rootX);

  const gen = new Array<number>(coords.length).fill(-1);
  const parent = new Array<number>(coords.length).fill(-1);
  gen[root] = 0;

  /* Breadth-first: the queue grows as cells are reached, so each generation
     is fully resolved before the next begins. */
  const queue = [root];
  for (let i = 0; i < queue.length; i++) {
    const n = queue[i];
    coords.forEach((c, m) => {
      if (gen[m] < 0 && touches(coords[n], c)) {
        gen[m] = gen[n] + 1;
        parent[m] = n;
        queue.push(m);
      }
    });
  }

  const maxGen = Math.max(...gen);

  return {
    cells: coords.map(([x, y], i) => {
      const p = parent[i];
      return {
        x,
        y,
        delay:
          Math.round(SPREAD * Math.pow(gen[i] / maxGen, CURVE)) +
          SIDE_DELAY[side],
        origin:
          p < 0
            ? "50% 50%"
            : originToward(coords[p][0] - x, coords[p][1] - y),
      };
    }),
    cols: Math.max(...coords.map((c) => c[0])) + 1,
    rows: Math.max(...coords.map((c) => c[1])) + 1,
    cell: SIDE_CELL[side],
  };
}
