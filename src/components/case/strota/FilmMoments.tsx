"use client";

import { useEffect, useRef } from "react";
import film from "./clips/ui-film.timeline.json";

/**
 * The small UI moments the Solution film plays at each zoom-in
 * (ui-film.timeline.json § moments): the Verification stepper and
 * credibility bar, and the Drafts completeness bar and body text. Phone 04
 * (Safety) plays its screen as designed, with only the film's hold tap.
 *
 * Each one is drawn as code shapes laid exactly over the screen image, in the
 * phone's 390 × 845 viewport px (views at scrollY 0). A moment starts by
 * covering its part of the screen with an "earlier" state, then animates
 * until it matches the image again, so when the film ends and the overlays
 * come off (the phone loops don't repeat them) nothing jumps. Counting
 * numbers are set in a stand-in font only while they count; at their final
 * value the patch lifts and the screen's own number shows.
 *
 * The film owns the clock: each overlay registers a paint(t) on the `bus`,
 * and the film calls every one on each frame with the film time.
 */

export type Bus = Set<(t: number) => void>;

const M = film.moments;

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const outCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const inOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const progress = (t: number, start: number, dur: number) => clamp01((t - start) / dur);

/** The stepper dot pop: 0.6 → 1.15 → 1 over POP seconds. */
const POP = 0.25;
function popScale(p: number) {
  if (p <= 0) return 0.6;
  if (p < 0.6) return 0.6 + (1.15 - 0.6) * outCubic(p / 0.6);
  return 1.15 - 0.15 * inOutCubic((p - 0.6) / 0.4);
}

/** Registers `paint` on the film's clock for as long as the overlay lives. */
function usePaint(bus: Bus, paint: (t: number) => void) {
  const ref = useRef(paint);
  useEffect(() => {
    ref.current = paint;
  });
  useEffect(() => {
    const fn = (t: number) => ref.current(t);
    bus.add(fn);
    return () => {
      bus.delete(fn);
    };
  }, [bus]);
}

/** Stand-in face for numbers while they count. */
const NUM_FONT = 'ui-sans-serif, -apple-system, "Helvetica Neue", Arial, sans-serif';

const abs = (style: React.CSSProperties): React.CSSProperties => ({ position: "absolute", ...style });

/* ── Phone 02 · Verification ──────────────────────────────────────────── */

const V = M.verification;
const V_BG = "#fcf9f2";
const DOT_FILLS = ["#eddcbf", "#ebc37e", "#e8a229"];
const DOT_R = 6;
/** The hollow steps' white disc and grey ring, as drawn (outer radius 7.25). */
const HOLLOW_R = 7.25;
const LINE = "#c1c1c1";

export function VerificationMoment({ bus }: { bus: Bus }) {
  const hollow = useRef<(HTMLSpanElement | null)[]>([]);
  const fills = useRef<(HTMLSpanElement | null)[]>([]);
  const segs = useRef<(HTMLSpanElement | null)[]>([]);
  const digitPatch = useRef<HTMLSpanElement>(null);
  const digit = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const barPatch = useRef<HTMLSpanElement>(null);
  const numPatch = useRef<HTMLSpanElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  const { checks, credibility: cred } = V;
  const dots = checks.dots;

  usePaint(bus, (t) => {
    // Step i: (for i > 0) the line draws in the first half, the dot fills in
    // the second; step 0 is the first dot alone.
    let filled = 0;
    dots.forEach((_, i) => {
      const s = checks.t + i * checks.each;
      const fillAt = i === 0 ? s : s + checks.each / 2;
      if (i > 0) {
        const seg = segs.current[i - 1];
        if (seg) seg.style.transform = `scaleX(${outCubic(progress(t, s, checks.each / 2))})`;
      }
      const p = progress(t, fillAt, POP);
      const on = t >= fillAt;
      if (on) filled = i + 1;
      const f = fills.current[i];
      if (f) {
        f.style.opacity = on ? "1" : "0";
        f.style.transform = `scale(${popScale(p)})`;
      }
      const h = hollow.current[i];
      if (h) h.style.opacity = on ? "0" : "1";
    });

    const shown = Math.max(checks.from, Math.min(checks.to, filled));
    if (digit.current) digit.current.textContent = String(shown);
    const done = filled >= checks.to;
    if (digitPatch.current) digitPatch.current.style.opacity = done ? "0" : "1";

    const c = outCubic(progress(t, cred.t, cred.dur));
    if (bar.current) bar.current.style.width = `${(cred.x1 - cred.x0) * c}px`;
    if (num.current) num.current.textContent = `${Math.round(cred.value * c)}/100`;
    const credDone = c >= 1;
    if (numPatch.current) numPatch.current.style.opacity = credDone ? "0" : "1";
    if (barPatch.current) barPatch.current.style.opacity = credDone ? "0" : "1";
  });

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* The two segments that join steps 1–3: covered, then drawn. */}
      {dots.slice(1).map((x, i) => {
        const a = dots[i] + DOT_R;
        const b = x - DOT_R;
        return (
          <span key={`seg${i}`}>
            <span style={abs({ left: a, top: checks.y - 1.5, width: b - a, height: 3, background: V_BG })} />
            <span
              ref={(el) => {
                segs.current[i] = el;
              }}
              style={abs({ left: a, top: checks.y, width: b - a, height: 1, background: LINE, transformOrigin: "left center", transform: "scaleX(0)" })}
            />
          </span>
        );
      })}
      {dots.map((x, i) => (
        <span key={`dot${i}`}>
          <span
            ref={(el) => {
              hollow.current[i] = el;
            }}
            style={abs({
              left: x - HOLLOW_R,
              top: checks.y + 0.25 - HOLLOW_R,
              width: HOLLOW_R * 2,
              height: HOLLOW_R * 2,
              borderRadius: "50%",
              background: "#fff",
              border: "2px solid #bdbdbd",
              boxShadow: `0 0 0 1px ${V_BG}`,
            })}
          />
          <span
            ref={(el) => {
              fills.current[i] = el;
            }}
            style={abs({
              left: x - DOT_R,
              top: checks.y + 0.25 - DOT_R,
              width: DOT_R * 2,
              height: DOT_R * 2,
              borderRadius: "50%",
              background: DOT_FILLS[i],
              opacity: 0,
            })}
          />
        </span>
      ))}

      {/* "N OF 5 CHECKS COMPLETE": only the digit changes. */}
      <span ref={digitPatch} style={abs({ left: 23, top: 249.5, width: 8, height: 11, background: V_BG })}>
        <span
          ref={digit}
          style={abs({ left: 0, top: 0, width: 8, height: 11, font: `500 10px/11px ${NUM_FONT}`, color: "#000", textAlign: "center" })}
        >
          {checks.from}
        </span>
      </span>

      {/* Credibility Score: the bar refills, the number counts up. */}
      <span ref={barPatch} style={abs({ left: cred.x0, top: 439, width: 344 - cred.x0, height: 6, borderRadius: 3, background: "#efeeea" })}>
        <span ref={bar} style={abs({ left: 0, top: 0, width: 0, height: 6, borderRadius: 3, background: "#69bae1" })} />
      </span>
      <span ref={numPatch} style={abs({ left: 296, top: 414, width: 48, height: 19, background: "#fff" })}>
        <span
          ref={num}
          style={abs({ right: 3.5, top: 0, height: 19, font: `600 14.5px/19px ${NUM_FONT}`, color: "#e9b150", whiteSpace: "nowrap" })}
        >
          0/100
        </span>
      </span>
    </div>
  );
}

/* ── Phone 03 · Drafts & Filing ───────────────────────────────────────── */

const D = M.drafts;

export function DraftsMoment({ bus }: { bus: Bus }) {
  const barPatch = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const pctPatch = useRef<HTMLSpanElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const lines = useRef<(HTMLSpanElement | null)[]>([]);
  const wordsPatch = useRef<HTMLSpanElement>(null);
  const words = useRef<HTMLSpanElement>(null);
  const { completeness: cp, body } = D;
  const bodyEnd = body.t + (body.lines - 1) * body.stagger + body.each;

  usePaint(bus, (t) => {
    const c = outCubic(progress(t, cp.t, cp.dur));
    if (bar.current) bar.current.style.width = `${(cp.x1 - cp.x0) * c}px`;
    if (pct.current) pct.current.textContent = `${Math.round(cp.value * c)}%`;
    const cDone = c >= 1;
    if (barPatch.current) barPatch.current.style.opacity = cDone ? "0" : "1";
    if (pctPatch.current) pctPatch.current.style.opacity = cDone ? "0" : "1";

    lines.current.forEach((ln, i) => {
      if (!ln) return;
      const p = outCubic(progress(t, body.t + i * body.stagger, body.each));
      ln.style.opacity = String(p);
      ln.style.filter = p >= 1 ? "none" : `blur(${body.blur * (1 - p)}px)`;
    });
    const w = outCubic(progress(t, body.t, bodyEnd - body.t));
    if (words.current) words.current.textContent = `${Math.round(body.words * w).toLocaleString("en-US")} words`;
    if (wordsPatch.current) wordsPatch.current.style.opacity = w >= 1 ? "0" : "1";
  });

  const lineW = body.x1 - body.x0;
  const stripH = body.lines * body.lineH;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <span ref={barPatch} style={abs({ left: cp.x0, top: 379, width: 345 - cp.x0, height: 8, borderRadius: 4, background: "#ebe8e1" })}>
        <span ref={bar} style={abs({ left: 0, top: 0, width: 0, height: 8, borderRadius: 4, background: "#e8a020" })} />
      </span>
      <span ref={pctPatch} style={abs({ left: 300, top: 341, width: 45, height: 23, background: "#f8f8f8" })}>
        <span ref={pct} style={abs({ right: 4.5, top: 0, height: 23, font: `700 19px/23px ${NUM_FONT}`, color: "#e8a020", whiteSpace: "nowrap" })}>
          0%
        </span>
      </span>

      {/* Body Content: blanked, then each line of the screen's own text comes
          back out of a blur. */}
      <span style={abs({ left: body.x0 - 2, top: body.y - 2, width: lineW + 4, height: stripH + 4, background: "#fff" })} />
      {Array.from({ length: body.lines }, (_, i) => (
        <span
          key={i}
          ref={(el) => {
            lines.current[i] = el;
          }}
          style={abs({
            left: body.x0,
            top: body.y + i * body.lineH,
            width: lineW,
            height: body.lineH,
            backgroundImage: "url(/case/strota/film/drafts-body.png)",
            backgroundSize: `${lineW}px ${stripH}px`,
            backgroundPosition: `0 ${-i * body.lineH}px`,
            opacity: 0,
          })}
        />
      ))}
      <span ref={wordsPatch} style={abs({ left: 268, top: 639, width: 76, height: 18, background: "#fff" })}>
        <span ref={words} style={abs({ right: 4.5, top: 0, height: 18, font: `400 11.5px/18px ${NUM_FONT}`, color: "#92b6c6", whiteSpace: "nowrap" })}>
          0 words
        </span>
      </span>
    </div>
  );
}
