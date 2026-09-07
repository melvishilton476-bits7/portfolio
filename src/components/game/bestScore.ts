"use client";

import { BEST_KEY } from "./constants";

/**
 * The high score, as an external store rather than a piece of React state.
 *
 * localStorage does not exist on the server, so the first render cannot read
 * it — hand the client a number the HTML never contained and hydration has a
 * mismatch on its hands. The usual dodge is to read it in an effect and call
 * setState, which works but schedules a second render for every mount and is
 * exactly what `useSyncExternalStore` exists to replace: React renders the
 * server snapshot (zero), hydrates against it, then reconciles to the real
 * value on its own.
 *
 * The value is cached in module scope because `getSnapshot` is called during
 * render and must return a stable result — touching localStorage on every call
 * would also mean a synchronous disk read inside the render path.
 */
let cached: number | null = null;
const listeners = new Set<() => void>();

export function subscribeBest(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function getBest() {
  if (cached === null) {
    try {
      cached = Number(window.localStorage.getItem(BEST_KEY)) || 0;
    } catch {
      /* Private mode, or storage denied. The game plays; the score just does
         not survive the refresh. */
      cached = 0;
    }
  }
  return cached;
}

/** What the server rendered, and therefore what hydration compares against. */
export function getServerBest() {
  return 0;
}

/** Records `score` if it beats the stored best. Returns whether it did. */
export function recordBest(score: number) {
  if (score <= getBest()) return false;
  cached = score;
  try {
    window.localStorage.setItem(BEST_KEY, String(score));
  } catch {
    /* see above — the round still counted, it just will not be remembered */
  }
  listeners.forEach((fn) => fn());
  return true;
}
