import type { Transition } from "framer-motion";

/**
 * Timing for the pinned "Sights to See" filmstrip. Kept here rather than in
 * the components so the pacing can be read in one place and the scroll lock in
 * Work.tsx can share the exact figure the slide animates on.
 */

export const EASE = [0.65, 0, 0.35, 1] as const;


/** The horizontal slide the whole strip plays when `step` advances by one.
    Used for `scale`/`filter`, and for `x` on the first paint when there's no
    travel direction to anticipate against. Kept close to `arrive` so a
    neighbour's blur/scale resolves in step with its glide, not ahead of it. */
export const traverse: Transition = { duration: 1.0, ease: EASE };

/**
 * The easing for the keyframed `x` a step plays once it has a travel direction:
 * a short wind-back (anticipation), the sweep across, then an overshoot that
 * settles into place (follow-through). Three segments, one easing each. The
 * total stays under stepDuration() so the scroll lock still covers the whole
 * gesture and a fast scroll can't fire the next step mid-bounce.
 */
/** How long one card's own glide takes, wind-back through settle. */
export const ARRIVE_DURATION = 1.3;

export const arrive: Transition = {
  duration: ARRIVE_DURATION,
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

/**
 * The strip is a slack chain, not a rigid plank: the leading card takes up the
 * pull first and each card behind it follows a beat later.
 *
 * Advancing moves every card LEFT, so the leftmost is the leading edge — and
 * since panel `index` is always left of `index + 1`, the array order IS the
 * left-to-right order at every step. Staggering on the index therefore gives a
 * true front-to-back pull wherever the strip has got to.
 *
 * An earlier version keyed off the slot offset from centre and clamped to the
 * three cards on stage. It was wrong at the ends: at the last step the strip
 * occupies offsets -2, -1, 0, and the clamp collapsed the first two onto the
 * same beat, so the pull vanished exactly where the strip stops. Measured on
 * the running page — two cards starting 0ms apart instead of 80.
 */
export const STAGGER = 0.08;

/** @param index the panel's position in the strip, left to right. */
export const stepDelay = (index: number) => STAGGER * index;

/**
 * Wall-clock length of one filmstrip step: the whole gesture, from the leading
 * card's wind-back to the trailing card settling. The scroll lock in Work.tsx
 * stays shut this long so a fast scroll can't fire the next step mid-slide.
 *
 * Derived from the project count rather than typed in, because the stagger
 * makes the gesture longer with every card added — a hard-coded figure would
 * quietly stop covering it the day a fourth project lands, and a fast scroll
 * would fire the next step while the last card was still travelling.
 */
export const stepDuration = (count: number) =>
  ARRIVE_DURATION + STAGGER * Math.max(count - 1, 0) + 0.15;
