/**
 * Every tunable for Pixel Pests & Pixel Pets in one place, so balancing the
 * game is editing numbers here rather than hunting through the loop.
 *
 * Palette is sampled from the Figma source (node 658:491). The purple is the
 * site's existing accent — the same #8581ff as the hatch cells, the nav's
 * active underline and the pointer — which is the point: the friendly mole
 * wears the brand colour and the hostile one wears something that is not.
 */

export type MoleKind = "pet" | "pest";

/* ---- Palette -------------------------------------------------------------- */
export const PET_COLOR = "#8581ff";
export const PEST_COLOR = "#f00010";
export const MOLE_BODY = "#d9d9d9";
export const GROUND_FILL = "#f4f4ff";
export const GROUND_LINE = "#e6e5ff";

/* ---- Round ---------------------------------------------------------------- */
export const DURATION_MS = 60_000;

/** How often the loop wakes. Not a frame rate — nothing moves on the JS side.
 *  Moles travel on CSS keyframes; this only decides when one is born, when one
 *  dies, and when the clock display ticks over. */
export const TICK_MS = 100;

/* ---- Scoring -------------------------------------------------------------- */
export const PEST_POINTS = 10;
/** A pet costs time, not points. Losing seconds shrinks the window you have to
 *  earn in, so a mistake compounds instead of being paid off by the next hit —
 *  and the score on screen only ever goes up, which keeps it readable. */
export const PET_PENALTY_MS = 2_000;

/* ---- Spawning ------------------------------------------------------------- */
/** Share of spawns that are whackable. */
export const PEST_RATIO = 0.7;

/** Discrete stands along the ground line. Positions look random but come from
 *  a fixed set, which is what makes "never two in the same place" a lookup
 *  rather than a collision test — and keeps two moles from overlapping into a
 *  single ambiguous target. */
export const SLOTS = 9;

/** Gap between spawns, first second of the round → last. */
export const SPAWN_MS_START = 900;
export const SPAWN_MS_END = 380;
/** ± this share of the gap, so the rhythm never becomes a metronome. */
export const SPAWN_JITTER = 0.25;

/** How long a mole is out, first second → last. Includes its rise and retreat. */
export const LIFE_MS_START = 1_200;
export const LIFE_MS_END = 800;

/** Ceiling on how many are out at once, first second → last. */
export const MAX_LIVE_START = 3;
export const MAX_LIVE_END = 5;

/** Height multipliers. The design draws moles at several sizes standing on the
 *  same line, so they vary here too rather than stamping one figure nine times. */
export const SIZES = [0.72, 0.86, 1] as const;

/* ---- Persistence ---------------------------------------------------------- */
export const BEST_KEY = "pixel-pests:best";

/** Linear ramp from `from` to `to` across the round. */
export const ramp = (from: number, to: number, progress: number) =>
  from + (to - from) * Math.min(Math.max(progress, 0), 1);
