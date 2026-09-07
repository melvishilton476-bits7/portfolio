"use client";

import { useEffect, useRef } from "react";

/**
 * The round's heartbeat: calls `onTick` every `ms` while `running`.
 *
 * A plain `setInterval` in an effect would be re-created on every render,
 * because `onTick` closes over the game's state and is therefore a new function
 * each time — and a re-created interval resets its phase, so the clock would
 * drift a little every time the score changed. The callback goes in a ref and
 * the interval depends only on `running`: one timer per round, started when the
 * round starts and cleared when it ends.
 *
 * THERE IS NO requestAnimationFrame HERE, deliberately. Nothing in this game
 * moves per frame — a mole rises and retreats on a CSS keyframe the compositor
 * owns — so the loop only has to notice three things: a mole's time is up, it
 * is time to spawn another, and the displayed second has changed. At 10Hz that
 * costs about a sixth of the wake-ups a frame loop would, and none of them
 * touch layout.
 */
export default function useGameClock(running: boolean, ms: number, onTick: () => void) {
  const cb = useRef(onTick);
  useEffect(() => {
    cb.current = onTick;
  }, [onTick]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => cb.current(), ms);
    return () => window.clearInterval(id);
  }, [running, ms]);
}
