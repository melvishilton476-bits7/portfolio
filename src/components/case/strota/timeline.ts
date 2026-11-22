/**
 * The clip format the Strota handoff ships (clips/<view>.timeline.json),
 * typed, plus the questions the phone asks of it every frame: how far has the
 * content scrolled, which taps are on screen, and is the phone at rest.
 *
 * All of it is a pure function of the loop time `t`, so a phone that pauses
 * off screen and resumes later lands on exactly the frame it left.
 *
 * Units are CSS px in the 390 × 845 viewport throughout; the PNGs are @2x and
 * are drawn at half their pixel size. Content maps to the viewport as
 * viewportY = contentY − scrollY + 50 (handoff § Phone views).
 */

type HoldStep = { t: number; type: "hold"; scrollY: number };
type TapStep = { t: number; type: "tap"; x: number; y: number; label?: string; press?: number };
type ScrollStep = { t: number; type: "scroll"; from: number; to: number; dur: number; ease?: string };
/** A sideways drag of a separate strip layer (Home's Open Tasks cards). */
type SwipeStep = { t: number; type: "swipe"; layer: string; from: number; to: number; dur: number; ease?: string };
export type Step = HoldStep | TapStep | ScrollStep | SwipeStep;

/** First Signal's voice capture: a waveform under the mic and a pulse around
 *  it, both on the content (they scroll with it), shown between `start` and
 *  `end` with a `fade` either side. */
export type Recording = {
  start: number;
  end: number;
  fade: number;
  bars: {
    count: number; barW: number; gap: number; radius: number; minH: number; maxH: number;
    color: string; x: number; rowW: number; contentY: number; speedMin: number; speedMax: number;
  };
  pulse: { x: number; contentY: number; r0: number; r1: number; period: number; opacity: number; color: string };
};

export type Annotation = { n: string; title: string; anchor: { x: number; y: number } };

/** The raw JSON, as the handoff writes it. Only what the player reads is
 *  typed; the prose notes ride along untouched. */
export type TimelineJson = {
  view: string;
  screen: string;
  viewport: { w: number; h: number; statusBar: number; background: string };
  layers: {
    content: { src: string; height: number };
    topBar: { src: string; visible: boolean; y: number };
    navbar: { src: string; x: number; y: number };
    queryBar?: { src: string; note?: string };
    /** Home's Open Tasks row, laid over the same row of content.png and slid
     *  sideways by the swipe steps. At swipeX 0 it matches content.png. */
    openTasksCarousel?: { src: string; contentY: number; x: number; w: number; h: number };
  };
  /** The time shown in the status bar. */
  statusTime: string;
  statusBarBlur: { y: number; h: number } | null;
  restScrollY: number;
  duration: number;
  steps: Step[];
  recording?: Recording;
  annotations: Annotation[];
};

/** Pixel size of an @2x layer, so it can be drawn at exactly half. */
export type Size = { w: number; h: number };

/** A view ready to draw: the JSON plus the layers' sizes and site paths. */
export type View = TimelineJson & {
  sizes: { content: Size; topBar: Size; navbar: Size; queryBar?: Size };
  /** Where the query bar's box sits (x, y in viewport px), when there is one. */
  queryBox?: { x: number; y: number };
};

/** The viewport every Strota screen is drawn at. */
export const VIEWPORT = { w: 390, h: 845, statusBar: 50 } as const;

/** How long a tap ring takes to grow and fade (handoff: "over 0.5s"). */
export const TAP_DUR = 0.5;

/** The handoff's asset paths are relative to its own folder; on the site they
 *  live under /case/strota. */
export const asset = (src: string) => `/case/strota/${src}`;

const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

const sorted = (steps: Step[]) => [...steps].sort((a, b) => a.t - b.t);

/** Content scroll at time t: the last hold's value, carried through every
 *  scroll that has started, interpolated inside the one that is running. */
export function scrollAt(steps: Step[], t: number, rest: number): number {
  let y = rest;
  for (const s of steps) {
    if (s.t > t) break;
    if (s.type === "hold") y = s.scrollY;
    if (s.type === "scroll") {
      const p = Math.min(1, (t - s.t) / s.dur);
      y = s.from + (s.to - s.from) * easeInOutCubic(p);
    }
  }
  return y;
}

/** Taps whose ring is on screen at t. A `press` holds the ring at its start
 *  size for that many seconds before it is released and fades. */
export function tapsAt(steps: Step[], t: number) {
  return steps.flatMap((s) => {
    if (s.type !== "tap") return [];
    const hold = s.press ?? 0;
    const end = s.t + hold + TAP_DUR;
    if (t < s.t || t >= end) return [];
    const p = t < s.t + hold ? 0 : (t - s.t - hold) / TAP_DUR;
    return [{ x: s.x, y: s.y, p }];
  });
}

/** The carousel strip's sideways offset at time t (0 when there is none). */
export function swipeAt(steps: Step[], t: number): number {
  let x = 0;
  for (const s of steps) {
    if (s.t > t) break;
    if (s.type === "swipe") {
      const p = Math.min(1, (t - s.t) / s.dur);
      x = s.from + (s.to - s.from) * easeInOutCubic(p);
    }
  }
  return x;
}

/** The drag ring a swipe shows: on the cards, moving left with them. */
export function dragAt(steps: Step[], t: number) {
  for (const s of steps) {
    if (s.type === "swipe" && t >= s.t && t < s.t + s.dur) {
      const p = (t - s.t) / s.dur;
      return { p, dx: (s.to - s.from) * easeInOutCubic(p) };
    }
  }
  return null;
}

/** At rest = on the annotated frame: back at restScrollY, with no scroll
 *  running. A tap at rest still counts — the element it presses is where the
 *  connector points. */
export function atRest(steps: Step[], t: number, rest: number): boolean {
  const moving = steps.some((s) => (s.type === "scroll" || s.type === "swipe") && t >= s.t && t < s.t + s.dur);
  return !moving && Math.abs(scrollAt(steps, t, rest) - rest) < 0.5;
}

/**
 * The UI-clip version of a view (handoff: "start at scrollY 0 with the top
 * bar visible and no callouts").
 *
 * The motion is the same; it is re-based so the resting scroll is 0 instead of
 * restScrollY. A tap made at rest moves down the screen by the same amount,
 * since its element now sits that much lower, and is dropped if that puts it
 * under the navbar.
 */
export function fromTop(view: View): View {
  const r = view.restScrollY;
  const shift = (y: number) => (Math.abs(y - r) < 0.5 ? 0 : y);
  const steps = sorted(view.steps).flatMap<Step>((s) => {
    if (s.type === "hold") return [{ ...s, scrollY: shift(s.scrollY) }];
    if (s.type === "scroll") return [{ ...s, from: shift(s.from), to: shift(s.to) }];
    if (s.type === "swipe") return [s];
    const atRestThen = Math.abs(scrollAt(view.steps, s.t, r) - r) < 0.5;
    const y = atRestThen ? s.y + r : s.y;
    return y < view.layers.navbar.y ? [{ ...s, y }] : [];
  });
  return {
    ...view,
    restScrollY: 0,
    steps,
    annotations: [],
    statusBarBlur: null,
    layers: { ...view.layers, topBar: { ...view.layers.topBar, visible: true } },
  };
}

/**
 * A view cut off before its first scroll: the moments that happen on the
 * resting frame only (First Signal's record, waveform and stop, for the How
 * it works row, where the screen is not meant to scroll).
 */
export function untilFirstScroll(view: View): View {
  const steps = sorted(view.steps);
  const cut = steps.find((s) => s.type === "scroll" || s.type === "swipe")?.t ?? view.duration;
  return { ...view, steps: steps.filter((s) => s.t < cut), duration: cut };
}

/** How strongly a recording shows at t: 0 → 1 over `fade` from `start`, back
 *  to 0 over `fade` ending at `end`. */
export function recordingAt(rec: Recording, t: number): number {
  if (t <= rec.start || t >= rec.end) return 0;
  return Math.min(1, (t - rec.start) / rec.fade, (rec.end - t) / rec.fade);
}

export { sorted };
