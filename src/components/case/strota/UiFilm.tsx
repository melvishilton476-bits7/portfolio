"use client";

import { useEffect, useRef, useState } from "react";
import Phone, { viewportToPhone } from "./Phone";
import { DraftsMoment, VerificationMoment, type Bus } from "./FilmMoments";
import type { View } from "./timeline";
import film from "./clips/ui-film.timeline.json";

/**
 * The Solution section's UI clip, opened by a short camera run-through
 * (handoff § UI clip intro film; clips/ui-film.timeline.json).
 *
 * One stage, laid out as the final four-phone grid. The "camera" is a single
 * transform on the stage: translate so (cx, cy) sits at the stage centre,
 * then scale s — x/y eased with easeInOutCubic, s interpolated in log space.
 * It fades in on phone 01, zooms to each phone in turn, pulls back to the
 * grid, then the four text blocks fade up, staggered. At each zoom-in a small
 * UI moment plays over that phone (FilmMoments.tsx): 01 records a voice note,
 * 02's checks and credibility fill, 03's draft writes itself. Phone 04 keeps
 * its screen as designed and only gets the press-and-hold tap. It plays once, when the section comes into view; then
 * the phones start their loops. Reduced motion: the final grid, at rest.
 *
 * The phones' content layers are requested large (`sizes`) so text stays
 * sharp at the 2.6× zoom.
 */

type Key = { t: number; cx: number; cy: number; s: number };
const KEYS = film.camera.keyframes as Key[];
const { w: STAGE_W, h: STAGE_H } = film.stage;
const PHONE = film.layout.phone;
const COLS = film.layout.columns;
const TEXT_TOP = film.layout.textTop;
const DURATION = film.duration;
const FADE_IN = film.fadeIn;
const TEXT = film.text;

/** Phone 01's record tap runs its waveform until the stop tap. */
const WAVE = film.moments.recording;

/** Each phone's moment overlay, by film order. Phone 01 uses the waveform;
 *  phone 04 (Safety) shows its screen as designed. */
const MOMENTS = [null, VerificationMoment, DraftsMoment, null];

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function cameraAt(t: number) {
  if (t <= KEYS[0].t) return KEYS[0];
  for (let i = 0; i < KEYS.length - 1; i++) {
    const a = KEYS[i];
    const b = KEYS[i + 1];
    if (t <= b.t) {
      const p = ease((t - a.t) / (b.t - a.t));
      return {
        t,
        cx: a.cx + (b.cx - a.cx) * p,
        cy: a.cy + (b.cy - a.cy) * p,
        s: Math.exp(Math.log(a.s) + (Math.log(b.s) - Math.log(a.s)) * p),
      };
    }
  }
  return KEYS[KEYS.length - 1];
}

const transformOf = (c: { cx: number; cy: number; s: number }) =>
  `translate(${STAGE_W / 2}px, ${STAGE_H / 2}px) scale(${c.s}) translate(${-c.cx}px, ${-c.cy}px)`;

const FINAL = KEYS[KEYS.length - 1];

/** The band of the stage that is ever worth showing. The film ends zoomed out
 *  to the grid (s 0.92), which leaves ~30px of stage above the phones and
 *  ~60px below the text; showing the whole 620 made two empty grey bands.
 *  The window is cut to the grid at rest, with a little air, and every
 *  camera target sits at the stage centre (y 310), well inside it. */
const VIEW_TOP = 20;
const VIEW_BOTTOM = 576;

export type FilmPhone = { view: View; n: string; title: string; body: string; alt?: string };

export default function UiFilm({ phones }: { phones: FilmPhone[] }) {
  const box = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const rings = useRef<(HTMLSpanElement | null)[]>([]);
  const texts = useRef<(HTMLDivElement | null)[]>([]);
  const [fit, setFit] = useState(1);
  const [looping, setLooping] = useState(false);
  const [wave, setWave] = useState(false);
  const [bus] = useState<Bus>(() => new Set());

  // The stage is drawn at 1100 × 620 and scaled to the column.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const set = (w: number) => setFit(Math.min(1, w / STAGE_W));
    set(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([e]) => set(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = box.current;
    const st = stage.current;
    if (!el || !st) return;

    let waveOn = false;
    const paint = (t: number) => {
      bus.forEach((fn) => fn(t));
      const w = t >= WAVE.from && t < WAVE.to;
      if (w !== waveOn) {
        waveOn = w;
        setWave(w);
      }
      st.style.transform = transformOf(cameraAt(t));
      st.style.opacity = String(Math.min(1, t / FADE_IN));
      film.taps.forEach((tap, i) => {
        const ring = rings.current[i];
        if (!ring) return;
        const hold = tap.press ?? 0;
        const p = t < tap.t ? -1 : t < tap.t + hold ? 0 : (t - tap.t - hold) / 0.5;
        if (p < 0 || p >= 1) {
          ring.style.opacity = "0";
          return;
        }
        // Ring in viewport px, mapped into the stage through the phone.
        const f = viewportToPhone({ x: tap.x, y: tap.y });
        const k = PHONE.w / 180;
        const r = (12 + 22 * (1 - Math.pow(1 - p, 2))) * (172 / 390) * k;
        ring.style.opacity = "1";
        ring.style.left = `${COLS[tap.phone - 1] + f.x * PHONE.w - r}px`;
        ring.style.top = `${PHONE.y + f.y * PHONE.h - r}px`;
        ring.style.width = ring.style.height = `${r * 2}px`;
        ring.style.borderColor = `rgba(44,44,44,${0.22 * (1 - p)})`;
        ring.style.background = `rgba(44,44,44,${0.1 * (1 - p)})`;
      });
      texts.current.forEach((tx, i) => {
        if (!tx) return;
        const p = Math.max(0, Math.min(1, (t - TEXT.start - i * TEXT.stagger) / TEXT.each.dur));
        const e = 1 - Math.pow(1 - p, 3);
        tx.style.opacity = String(e);
        tx.style.transform = `translateY(${8 * (1 - e)}px)`;
      });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      paint(DURATION);
      return;
    }

    paint(0);
    st.style.opacity = "0";
    let raf = 0;
    let start = 0;
    const tick = (ms: number) => {
      if (!start) start = ms;
      const t = (ms - start) / 1000;
      paint(Math.min(t, DURATION));
      if (t < DURATION) raf = requestAnimationFrame(tick);
      else setLooping(true);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [bus]);

  return (
    <div ref={box} className="w-full">
      {/* Desktop and tablet: the stage, with its camera. */}
      {/* No clip here: while the camera is zoomed in, the phones run on past
          this box to the band's own edges, and the band clips them there. */}
      <div className="relative hidden md:block" style={{ height: (VIEW_BOTTOM - VIEW_TOP) * fit }}>
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${fit}) translateY(${-VIEW_TOP}px)` }}
        >
          <div
            ref={stage}
            className="absolute inset-0 origin-top-left will-change-transform"
            style={{ transform: transformOf(FINAL) }}
          >
            {phones.map((p, i) => {
              const Moment = MOMENTS[i];
              return (
                <div key={p.n}>
                  <div className="absolute" style={{ left: COLS[i], top: PHONE.y, width: PHONE.w }}>
                    <Phone
                      view={p.view}
                      mode="loop"
                      active={looping}
                      alt={p.alt}
                      sizes="560px"
                      recording={i === 0 && wave}
                      // The moments belong to the film; the loops after it don't
                      // repeat them, and by then they match the screen exactly.
                      overlay={Moment && !looping ? <Moment bus={bus} /> : null}
                    />
                  </div>
                  <div
                    ref={(el) => {
                      texts.current[i] = el;
                    }}
                    className="absolute"
                    style={{ left: COLS[i], top: TEXT_TOP, width: 240 }}
                  >
                    <span className="block type-caption text-ink-muted">{p.n}</span>
                    <span className="mt-1.5 block font-display text-[1.125rem] font-medium leading-[1.25] text-ink">{p.title}</span>
                    <span className="mt-2 block type-caption-prose text-ink-muted">{p.body}</span>
                  </div>
                </div>
              );
            })}
            {film.taps.map((_, i) => (
              <span
                key={i}
                ref={(el) => {
                  rings.current[i] = el;
                }}
                className="pointer-events-none absolute rounded-full border-[1.5px] border-solid opacity-0"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Phones: the grid, looping, no camera. */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:hidden">
        {phones.map((p) => (
          <figure key={p.n} className="m-0">
            <div className="mx-auto w-full max-w-[200px]">
              <Phone view={p.view} mode="loop" alt={p.alt} />
            </div>
            <figcaption className="mt-5">
              <span className="block type-caption text-ink-muted">{p.n}</span>
              <span className="mt-1 block font-display text-[1rem] font-medium leading-[1.25] text-ink">{p.title}</span>
              <span className="mt-1.5 block type-caption-prose text-ink-muted">{p.body}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
