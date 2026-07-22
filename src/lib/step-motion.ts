import type { Transition } from "framer-motion";

/**
 * Timing for the pinned "Sights to See" filmstrip. Kept here rather than in
 * the components so the pacing can be read in one place and the scroll lock in
 * Work.tsx can share the exact figure the slide animates on.
 */

export const EASE = [0.65, 0, 0.35, 1] as const;

/** Wall-clock length of one filmstrip step. The scroll lock in Work.tsx stays
    shut this long so a fast scroll can't fire the next step mid-slide; it has
    to be a touch longer than `traverse` below. */
export const STEP_DURATION = 0.9;

/** The horizontal slide the whole strip plays when `step` advances by one. */
export const traverse: Transition = { duration: 0.75, ease: EASE };
