import type { Transition } from "framer-motion";

/**
 * Timing for the pinned "Sights to See" filmstrip. Kept here rather than in
 * the components so the pacing can be read in one place and the scroll lock in
 * Work.tsx can share the exact figure the slide animates on.
 */

export const EASE = [0.65, 0, 0.35, 1] as const;

/** Wall-clock length of one filmstrip step. The scroll lock in Work.tsx stays
    shut this long so a fast scroll can't fire the next step mid-slide; it has
    to stay a touch longer than the longest thing a step animates (`arrive`
    below), so the whole gentle glide is covered before the next can fire. */
export const STEP_DURATION = 1.45;

/** The horizontal slide the whole strip plays when `step` advances by one.
    Used for `scale`/`filter`, and for `x` on the first paint when there's no
    travel direction to anticipate against. Kept close to `arrive` so a
    neighbour's blur/scale resolves in step with its glide, not ahead of it. */
export const traverse: Transition = { duration: 1.0, ease: EASE };

/**
 * The easing for the keyframed `x` a step plays once it has a travel direction:
 * a short wind-back (anticipation), the sweep across, then an overshoot that
 * settles into place (follow-through). Three segments, one easing each. The
 * total stays under STEP_DURATION so the scroll lock still covers the whole
 * gesture and a fast scroll can't fire the next step mid-bounce.
 */
export const arrive: Transition = {
  duration: 1.3,
  times: [0, 0.12, 0.54, 1],
  ease: [
    [0.37, 0, 0.63, 1], // wind-back: easeInOutSine — a soft, unhurried recoil, no snap
    [0.37, 0, 0.63, 1], // sweep: easeInOutSine — gentle accelerate/carry across to the overshoot, leaving the deceleration to the settle
    [0.16, 1, 0.3, 1], //  settle: easeOutExpo — the long-tailed glide home. Given ~46% of the (now longer) timeline so the deceleration is drawn out and gentle, never abrupt.
  ],
};

/** Wind-back distance (px) the strip recoils opposite its travel before the
    sweep, and the overshoot (px) it carries past the landing before settling.
    Kept modest so the gentle, long-eased glide reads as a soft sway, not a
    springy snap. */
export const ANTICIPATION_PX = 12;
export const OVERSHOOT_PX = 24;
