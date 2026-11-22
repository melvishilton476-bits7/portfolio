"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  VIEWPORT,
  asset,
  atRest,
  dragAt,
  recordingAt,
  scrollAt,
  sorted,
  swipeAt,
  tapsAt,
  type Recording,
  type View,
} from "./timeline";

/**
 * One Strota phone: the flat phone frame drawn in CSS, a 390 × 845 screen
 * viewport inside it, and — when it is given a view — that screen playing
 * from its timeline.
 *
 * Frame (handoff § Flat phone): white body, 1px #D9D9D9 stroke, radius 27.8 at
 * 180 wide, a soft two-layer shadow, the screen inset 4px with a ~24px radius,
 * and a 44 × 13 island 5px into the screen. Everything scales with the
 * phone's width, so one component serves a 180px row phone and a 200px film
 * phone zoomed 2.6×.
 *
 * The viewport is laid out at its own CSS pixels (390 wide, the unit every
 * timeline coordinate is in) and scaled as one piece, so a tap at (195, 274)
 * in the JSON lands on (195, 274) in the DOM and the @2x layers are simply
 * drawn at half their pixel size.
 *
 * Layer stack, bottom to top:
 *   screen background → scrolling content (viewportY = contentY − scrollY + 50,
 *   with Home's carousel strip riding on it) → top bar + opaque status bar on
 *   views resting at the top, a 92px progressive blur on views resting
 *   scrolled, an opaque status bar otherwise (Safety) → query bar → navbar →
 *   status-bar time, icons and island → tap and drag rings. First Signal
 *   also draws its recording waveform and mic pulse on the content.
 *
 * Playback modes:
 *   once   — plays one pass the first time it is half in view, then rests on
 *            its resting frame; a click replays it (How it works rows).
 *   loop   — repeats while on screen and `active`, pauses off it (UI clip).
 *   static — the resting frame only (Outcomes).
 * Under prefers-reduced-motion every mode is the resting frame.
 */

/** The frame at its reference width (handoff: 180 wide). */
const REF = { w: 180, h: 380.8, r: 27.8, inset: 4, screenR: 24 } as const;
const SCREEN_W = REF.w - REF.inset * 2; // 172 — the viewport scales 390 → 172
const K = SCREEN_W / VIEWPORT.w;

/** The phone's own aspect ratio, for layouts that size a box around it. */
export const PHONE_RATIO = REF.w / REF.h;

/** A point in viewport px, as a fraction of the whole phone (frame included). */
export function viewportToPhone(p: { x: number; y: number }) {
  return { x: (REF.inset + p.x * K) / REF.w, y: (REF.inset + p.y * K) / REF.h };
}

/** Frosted glass behind the navbar and query bar. */
const FROST: React.CSSProperties = {
  background: "rgba(252, 249, 243, 0.6)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

/** The navbar pill in viewport px and the query card inside its PNG, measured
 *  off the exports' alpha. The current navbars are opaque, so the frost only
 *  shows if a translucent export comes back. */
const NAV_PILL = { x: 21, y: 16, w: 346.5, h: 53, r: 26.5 } as const;
const QUERY_CARD = { x: 10, y: 50, w: 357, h: 85, r: 25 } as const;
const QUERY_BOX = { w: 358, h: 136 } as const;

/** Island: 44 × 13 placed 5px into the screen at the 180 reference, in
 *  viewport px. */
const ISLAND = { w: 44 / K, h: 13 / K, y: 5 / K } as const;

const PENDING_FILL = "#fcf9f2";
const RING_POOL = 2;

/** Each waveform bar's speed (rad/s), phase and envelope: fixed per bar so
 *  every play looks the same; taller in the middle, lower at the ends. */
function barParams(b: Recording["bars"]) {
  return Array.from({ length: b.count }, (_, i) => {
    const r = Math.abs(Math.sin((i + 1) * 12.9898) * 43758.5453) % 1;
    return {
      speed: b.speedMin + (b.speedMax - b.speedMin) * r,
      phase: i * 1.7 + r * 3,
      env: 0.3 + 0.7 * Math.sin((Math.PI * (i + 0.5)) / b.count),
    };
  });
}

/** One frame of the recording: bar heights and the pulse ring at `clock`,
 *  the whole thing at `alpha`. */
function drawRecording(
  rec: Recording,
  params: ReturnType<typeof barParams>,
  wrap: HTMLDivElement | null,
  bars: (HTMLSpanElement | null)[],
  pulse: HTMLSpanElement | null,
  clock: number,
  alpha: number,
) {
  if (wrap) wrap.style.opacity = String(alpha);
  if (pulse) pulse.style.opacity = String(alpha);
  if (alpha <= 0) return;
  const { minH, maxH } = rec.bars;
  bars.forEach((bar, i) => {
    const q = params[i];
    if (!bar || !q) return;
    bar.style.height = `${minH + (maxH - minH) * Math.abs(Math.sin(clock * q.speed + q.phase)) * q.env}px`;
  });
  if (pulse) {
    const { x, contentY, r0, r1, period, opacity } = rec.pulse;
    const p = (((clock - rec.start) % period) + period) % period / period;
    const r = r0 + (r1 - r0) * (1 - Math.pow(1 - p, 2));
    pulse.style.left = `${x - r}px`;
    pulse.style.top = `${contentY - r}px`;
    pulse.style.width = pulse.style.height = `${r * 2}px`;
    pulse.style.borderColor = `rgba(230,160,40,${opacity * (1 - p)})`;
    pulse.style.background = `rgba(230,160,40,${opacity * 0.35 * (1 - p)})`;
  }
}

/** Signal, wifi and battery, drawn at the status bar's own scale. */
function StatusIcons() {
  return (
    <svg width="68" height="13" viewBox="0 0 68 13" fill="#111" aria-hidden>
      <rect x="0" y="8" width="3" height="4" rx="1" />
      <rect x="4.5" y="6" width="3" height="6" rx="1" />
      <rect x="9" y="3.5" width="3" height="8.5" rx="1" />
      <rect x="13.5" y="1" width="3" height="11" rx="1" />
      <path d="M29 3.2a9.6 9.6 0 0 1 6.6 2.6l1.3-1.3A11.4 11.4 0 0 0 29 1.3a11.4 11.4 0 0 0-7.9 3.2l1.3 1.3A9.6 9.6 0 0 1 29 3.2Zm0 3.6a6 6 0 0 1 4.1 1.6l1.3-1.3A7.8 7.8 0 0 0 29 4.9a7.8 7.8 0 0 0-5.4 2.2l1.3 1.3A6 6 0 0 1 29 6.8Zm0 3.6a2.4 2.4 0 0 1 1.6.6L29 12.6l-1.6-1.6a2.4 2.4 0 0 1 1.6-.6Z" />
      <rect x="42.5" y="1" width="21" height="11" rx="3.3" fill="none" stroke="#111" strokeOpacity="0.4" />
      <rect x="44.5" y="3" width="17" height="7" rx="1.8" />
      <path d="M65 4.5v4a2 2 0 0 0 0-4Z" fillOpacity="0.45" />
    </svg>
  );
}

export default function Phone({
  view,
  pending,
  mode = "once",
  active = true,
  onRestChange,
  onScroll,
  onDone,
  sizes = "(min-width: 1024px) 240px, 50vw",
  className = "",
  alt,
  recording = false,
  overlay,
}: {
  /** The screen's view. Omit for a placeholder. */
  view?: View;
  /** The screen a placeholder is waiting for, shown on it. */
  pending?: string;
  mode?: "once" | "loop" | "static";
  /** Loop mode only: hold the loop until this turns true (the UI film). */
  active?: boolean;
  /** Called when the phone goes into or out of its resting frame. */
  onRestChange?: (rest: boolean) => void;
  /** Called whenever the content's scroll position changes. */
  onScroll?: (scrollY: number) => void;
  /** Called when a "once" pass finishes, and at once under reduced motion. */
  onDone?: () => void;
  /** next/image sizes for the content layer. Raise it for a phone the page
   *  zooms into, so the zoomed text stays sharp. */
  sizes?: string;
  className?: string;
  /** What the screen shows, for anyone who cannot see it. */
  alt?: string;
  /** Show the view's recording waveform now, whatever its timeline says (the
   *  UI film's record tap). It fades in and out over the recording's fade. */
  recording?: boolean;
  /** Drawn over the screen in viewport px, above the content and under the
   *  bars (the UI film's moments). It does not scroll. */
  overlay?: React.ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const rings = useRef<(HTMLSpanElement | null)[]>([]);
  const replay = useRef<() => void>(() => {});
  const [width, setWidth] = useState(0);

  // The recording layer, when the view has one.
  const rec = view?.recording;
  const params = useMemo(() => (rec ? barParams(rec.bars) : []), [rec]);
  const waveWrap = useRef<HTMLDivElement>(null);
  const waveBars = useRef<(HTMLSpanElement | null)[]>([]);
  const pulse = useRef<HTMLSpanElement>(null);
  /** True while the `recording` prop, not the timeline, owns the layer. */
  const forced = useRef(false);
  const waveAlpha = useRef(0);
  const drawWave = useCallback(
    (clock: number, alpha: number) => {
      waveAlpha.current = alpha;
      if (rec) drawRecording(rec, params, waveWrap.current, waveBars.current, pulse.current, clock, alpha);
    },
    [rec, params],
  );

  useEffect(() => {
    if (!rec || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!recording && waveAlpha.current <= 0) return;
    forced.current = true;
    let raf = 0;
    let last = 0;
    let clock = rec.start;
    let a = waveAlpha.current;
    const tick = (ms: number) => {
      const dt = last ? (ms - last) / 1000 : 0;
      last = ms;
      clock += dt;
      a = recording ? Math.min(1, a + dt / rec.fade) : Math.max(0, a - dt / rec.fade);
      drawWave(clock, a);
      if (recording || a > 0) raf = requestAnimationFrame(tick);
      else forced.current = false;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rec, recording, drawWave]);

  // The viewport's scale follows the phone's rendered width. Measured once on
  // mount as well: ResizeObserver only reports on a rendering step, which a
  // background tab may not run.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    setWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!view || !el) return;
    const steps = sorted(view.steps);
    const restY = view.restScrollY;
    const carousel = view.layers.openTasksCarousel;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let t = 0;
    let last = 0;
    let raf = 0;
    let visible = false;
    let rest: boolean | null = null;
    let lastY: number | null = null;

    const paint = () => {
      const y = scrollAt(steps, t, restY);
      if (content.current) content.current.style.transform = `translateY(${-y}px)`;
      if (y !== lastY) {
        lastY = y;
        onScroll?.(y);
      }
      if (strip.current) strip.current.style.transform = `translateX(${-swipeAt(steps, t)}px)`;

      const taps = tapsAt(steps, t);
      const drag = carousel ? dragAt(steps, t) : null;
      rings.current.forEach((ring, i) => {
        if (!ring) return;
        if (i === 0 && drag && carousel) {
          // A finger on the cards, sliding left with them.
          const r = 16;
          const cy = carousel.contentY + carousel.h / 2 - y + VIEWPORT.statusBar;
          ring.style.opacity = "1";
          ring.style.left = `${260 - drag.dx - r}px`;
          ring.style.top = `${cy - r}px`;
          ring.style.width = ring.style.height = `${r * 2}px`;
          ring.style.borderColor = "rgba(44,44,44,0.22)";
          ring.style.background = "rgba(44,44,44,0.1)";
          return;
        }
        const tap = taps[drag ? i - 1 : i];
        if (!tap) {
          ring.style.opacity = "0";
          return;
        }
        // 12px → 34px radius, 22% → 0 opacity, eased out so it reads as a press.
        const e = 1 - Math.pow(1 - tap.p, 2);
        const r = 12 + 22 * e;
        ring.style.opacity = "1";
        ring.style.left = `${tap.x - r}px`;
        ring.style.top = `${tap.y - r}px`;
        ring.style.width = ring.style.height = `${r * 2}px`;
        ring.style.borderColor = `rgba(44,44,44,${0.22 * (1 - tap.p)})`;
        ring.style.background = `rgba(44,44,44,${0.1 * (1 - tap.p)})`;
      });

      if (view.recording && !forced.current) drawWave(t, recordingAt(view.recording, t));

      const now = atRest(steps, t, restY);
      if (now !== rest) {
        rest = now;
        onRestChange?.(now);
      }
    };

    const tick = (ms: number) => {
      if (last) t += (ms - last) / 1000;
      last = ms;
      if (mode === "once" && t >= view.duration) {
        // One pass done: settle on the resting frame and stop.
        t = 0;
        paint();
        last = 0;
        onDone?.();
        return;
      }
      if (mode === "loop") t %= view.duration;
      paint();
      raf = requestAnimationFrame(tick);
    };

    const play = () => {
      cancelAnimationFrame(raf);
      t = 0;
      last = 0;
      raf = requestAnimationFrame(tick);
    };

    paint();
    replay.current = () => {};
    if (reduce || mode === "static") {
      onDone?.();
      return;
    }

    if (mode === "once") {
      replay.current = play;
      // Plays the first time it is half in view, and only that time; a reader
      // scrolling back past it finds it resting.
      let played = false;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (played || !entry.isIntersecting) return;
          played = true;
          io.disconnect();
          play();
        },
        { threshold: 0.5 },
      );
      io.observe(el);
      return () => {
        io.disconnect();
        cancelAnimationFrame(raf);
      };
    }

    if (!active) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === visible) return;
        visible = entry.isIntersecting;
        cancelAnimationFrame(raf);
        last = 0;
        if (visible) raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [view, mode, active, onRestChange, onScroll, onDone, drawWave]);

  const clickable = Boolean(view) && mode === "once";
  const scale = (width / REF.w) * K;
  const L = view?.layers;
  const Z = view?.sizes;
  const pct = (v: number, of: number) => `${(v / of) * 100}%`;
  const bg = view?.viewport.background ?? PENDING_FILL;

  return (
    <div
      ref={root}
      className={`relative w-full select-none ${clickable ? "cursor-pointer" : ""} ${className}`}
      style={{
        aspectRatio: `${REF.w} / ${REF.h}`,
        background: "#fff",
        outline: "1px solid #d9d9d9",
        outlineOffset: -1,
        borderRadius: `${pct(REF.r, REF.w)} / ${pct(REF.r, REF.h)}`,
        boxShadow: "0 1px 3px rgba(23,23,23,0.06), 0 14px 32px -12px rgba(23,23,23,0.2)",
      }}
      role={clickable ? "button" : "img"}
      tabIndex={clickable ? 0 : undefined}
      aria-label={
        clickable
          ? `${alt ?? view?.view}. Replay the animation.`
          : (alt ?? (pending ? `${pending} screen, pending` : view?.view))
      }
      data-cursor={clickable ? "Replay" : undefined}
      onClick={clickable ? () => replay.current() : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                replay.current();
              }
            }
          : undefined
      }
    >
      <div
        className="absolute overflow-hidden"
        style={{
          left: pct(REF.inset, REF.w),
          top: pct(REF.inset, REF.h),
          width: pct(SCREEN_W, REF.w),
          height: pct(REF.h - REF.inset * 2, REF.h),
          borderRadius: `${pct(REF.screenR, SCREEN_W)} / ${pct(REF.screenR, REF.h - REF.inset * 2)}`,
          background: bg,
        }}
      >
        {width > 0 ? (
          <div
            aria-hidden
            className="absolute left-0 top-0 origin-top-left overflow-hidden"
            style={{ width: VIEWPORT.w, height: VIEWPORT.h, background: bg, transform: `scale(${scale})` }}
          >
            {view && L && Z ? (
              <>
                <div
                  ref={content}
                  className="absolute left-0 will-change-transform"
                  style={{ top: VIEWPORT.statusBar, transform: `translateY(${-view.restScrollY}px)` }}
                >
                  <Image
                    src={asset(L.content.src)}
                    alt=""
                    width={Z.content.w}
                    height={Z.content.h}
                    sizes={sizes}
                    className="block max-w-none"
                    style={{ width: Z.content.w, height: Z.content.h }}
                    draggable={false}
                  />
                  {rec ? (
                    <>
                      <span ref={pulse} className="absolute rounded-full border-[1.5px] border-solid opacity-0" />
                      <div
                        ref={waveWrap}
                        className="absolute flex items-center justify-center opacity-0"
                        style={{ left: rec.bars.x, top: rec.bars.contentY - rec.bars.maxH / 2, width: rec.bars.rowW, height: rec.bars.maxH, gap: rec.bars.gap }}
                      >
                        {params.map((_, i) => (
                          <span
                            key={i}
                            ref={(el) => {
                              waveBars.current[i] = el;
                            }}
                            className="block shrink-0"
                            style={{ width: rec.bars.barW, height: rec.bars.minH, borderRadius: rec.bars.radius, background: rec.bars.color }}
                          />
                        ))}
                      </div>
                    </>
                  ) : null}
                  {L.openTasksCarousel ? (
                    <div
                      ref={strip}
                      className="absolute will-change-transform"
                      style={{
                        top: L.openTasksCarousel.contentY,
                        left: L.openTasksCarousel.x,
                        width: L.openTasksCarousel.w,
                        height: L.openTasksCarousel.h,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={asset(L.openTasksCarousel.src)} alt="" className="block h-full w-full max-w-none" draggable={false} />
                    </div>
                  ) : null}
                </div>

                {overlay}

                {L.topBar.visible ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset(L.topBar.src)}
                      alt=""
                      className="absolute left-0 block max-w-none"
                      style={{ top: L.topBar.y, width: Z.topBar.w, height: Z.topBar.h }}
                      draggable={false}
                    />
                    <div className="absolute inset-x-0 top-0" style={{ height: VIEWPORT.statusBar, background: bg }} />
                  </>
                ) : view.statusBarBlur ? (
                  <div
                    className="absolute inset-x-0"
                    style={{
                      top: view.statusBarBlur.y,
                      height: view.statusBarBlur.h,
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      maskImage: "linear-gradient(to bottom, #000 35%, transparent)",
                      WebkitMaskImage: "linear-gradient(to bottom, #000 35%, transparent)",
                    }}
                  />
                ) : (
                  <div className="absolute inset-x-0 top-0" style={{ height: VIEWPORT.statusBar, background: bg }} />
                )}

                {L.queryBar && Z.queryBar && view.queryBox ? (
                  <div
                    className="absolute"
                    style={{
                      left: view.queryBox.x - (Z.queryBar.w - QUERY_BOX.w) / 2,
                      top: view.queryBox.y - (Z.queryBar.h - QUERY_BOX.h) / 2,
                      width: Z.queryBar.w,
                      height: Z.queryBar.h,
                    }}
                  >
                    <span
                      className="absolute"
                      style={{ ...FROST, left: QUERY_CARD.x, top: QUERY_CARD.y, width: QUERY_CARD.w, height: QUERY_CARD.h, borderRadius: QUERY_CARD.r }}
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset(L.queryBar.src)} alt="" className="relative block h-full w-full max-w-none" draggable={false} />
                  </div>
                ) : null}

                <div className="absolute" style={{ left: L.navbar.x, top: L.navbar.y, width: Z.navbar.w, height: Z.navbar.h }}>
                  <span
                    className="absolute"
                    style={{ ...FROST, left: NAV_PILL.x - L.navbar.x, top: NAV_PILL.y, width: NAV_PILL.w, height: NAV_PILL.h, borderRadius: NAV_PILL.r }}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(L.navbar.src)} alt="" className="relative block h-full w-full max-w-none" draggable={false} />
                </div>

                <span
                  className="absolute font-semibold tabular-nums text-[#111]"
                  style={{ left: 36, top: 15, fontSize: 16, lineHeight: "22px", fontFamily: "Inter, system-ui, sans-serif", letterSpacing: "-0.01em" }}
                >
                  {view.statusTime}
                </span>
              </>
            ) : null}

            {/* Status icons and the island sit on every phone, pending ones too. */}
            <span className="absolute" style={{ right: 28, top: 20 }}>
              <StatusIcons />
            </span>
            <span
              className="absolute rounded-full bg-black"
              style={{ left: (VIEWPORT.w - ISLAND.w) / 2, top: ISLAND.y, width: ISLAND.w, height: ISLAND.h }}
            />

            {Array.from({ length: RING_POOL }, (_, i) => (
              <span
                key={i}
                ref={(el) => {
                  rings.current[i] = el;
                }}
                className="pointer-events-none absolute rounded-full border-[1.5px] border-solid opacity-0"
              />
            ))}
          </div>
        ) : null}

        {!view ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-4 text-center">
            <span className="type-caption uppercase tracking-[0.12em] text-ink-muted" style={{ fontSize: "0.625rem" }}>
              Screen pending
            </span>
            {pending ? <span className="font-display text-[0.8125rem] leading-tight text-ink">{pending}</span> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
