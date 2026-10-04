"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The four things you meet using the builder, as a row of panels that open
 * one at a time.
 *
 * The open panel is sized to its own media: its width is the row's height
 * times the media's ratio, so the feature being shown is never cropped. The
 * other three share what is left as narrow strips, each a cropped glimpse of
 * its own feature with its title, asking to be opened. Pointing at a strip
 * opens it, and the panels trade width with one animated move (flex-basis
 * and flex-grow). The row's height never changes, so nothing below it jumps.
 *
 * The row runs the full width of the screen with the panels butting edge to
 * edge, one band rather than four cards. Its height is set so that even the
 * widest media (2:1) leaves the three strips 120px each:
 * (screen width − 3 strips) / 2.
 *
 * It walks itself while on screen: a hairline along the open panel's foot
 * fills, and when it is full the next panel opens. The hairline IS the timer.
 * It is a CSS animation whose `animationend` advances the row, so pausing is
 * just `animation-play-state`. Pointing at the row pauses it, pointing at a
 * strip opens that one, and a click or key press hands over control for good.
 * Under reduced motion it never walks.
 *
 * Words sit on a band of clear frosted glass along the panel's foot, in ink
 * over light frames and in step with the crossfade over the theme one.
 *
 * Below lg there is no hover, so the row becomes a swipe row of whole cards,
 * each at its media's own shape, with every video playing while it is in view.
 */

export type Feature = {
  title: string;
  body: React.ReactNode;
  /** The media, drawn into a box of `ratio`. Must be `absolute inset-0`. */
  visual: React.ReactNode;
  ratio: number;
  /** How long the panel holds before the walk moves on, in ms. */
  hold: number;
  /** The panel's ground: a CSS background the recording floats on. */
  ground: string;
};

/** The recording's edge: a wide white stroke at low opacity, so the ground
 *  shows through it and it reads as a glass rim rather than a border. */
/** Glass, not paint: blur only. No tint (a white tint turns frost grey over a
 *  dark frame) and no saturation boost (it over-cooked the orange ground). */
const GLASS: React.CSSProperties = {
  backdropFilter: "blur(22px)",
  WebkitBackdropFilter: "blur(22px)",
};

const RIM = "0 0 0 6px rgba(255,255,255,0.45), 0 18px 40px -18px rgba(23,23,23,0.25)";

const STRIP = 120;
const GAP = 8;
const WIDEST = 2;
/** The row's height, in terms of its own width (the wrapper is a container). */
const ROW_H = `((100cqw - ${3 * STRIP + 3 * GAP}px) / ${WIDEST})`;

export default function ZenxoFeatures({
  features,
  inset,
}: {
  features: readonly Feature[];
  /** Side padding for the full-bleed row, as a CSS length. Omit to run the
   *  row edge to edge. The row's height is measured off the padded width
   *  (cqw is the content box), so the proportions hold either way. */
  inset?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const [held, setHeld] = useState(false);
  const [desk, setDesk] = useState(false);

  useEffect(() => {
    if (!inset) return;
    const set = () =>
      root.current?.style.setProperty(
        "--sbw",
        `${window.innerWidth - document.documentElement.clientWidth}px`,
      );
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, [inset]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const decide = () => setDesk(mq.matches);
    mq.addEventListener("change", decide);
    const el = root.current;
    const io = new IntersectionObserver(
      ([e]) => {
        decide();
        if (still) setAuto(false);
        setInView(e.isIntersecting);
      },
      { threshold: 0.35 },
    );
    if (el) io.observe(el);
    return () => {
      io.disconnect();
      mq.removeEventListener("change", decide);
    };
  }, []);

  // Desktop: only the open panel's video runs, and only while the row is on
  // screen. The closed ones hold a still frame as their glimpse.
  useEffect(() => {
    if (!desk) return;
    panels.current.forEach((panel, i) => {
      panel?.querySelectorAll("video").forEach((v) => {
        if (i === active && inView) v.play().catch(() => {});
        else v.pause();
      });
    });
  }, [active, inView, desk]);

  // Phone: every card is whole, so each video simply plays while it is seen.
  useEffect(() => {
    const el = root.current;
    if (desk || !el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.5 },
    );
    el.querySelectorAll("video").forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, [desk]);

  const open = (i: number) => {
    const n = features.length;
    const next = ((i % n) + n) % n;
    if (next === active) return;
    panels.current[next]?.querySelectorAll("video").forEach((v) => {
      v.currentTime = 0;
    });
    setActive(next);
  };

  const take = (i: number) => {
    setAuto(false);
    open(i);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (active + step + features.length) % features.length;
    take(next);
    panels.current[next]?.focus();
  };

  const walking = auto && desk && inView && !held;

  return (
    <div
      ref={root}
      className="w-screen"
      style={{ containerType: "inline-size", marginLeft: "calc(50% - 50vw)", // 100vw counts the scrollbar, so the bleed overshoots the visible page by
        // half of it on each side; --sbw (set below) takes that back out.
        paddingInline: inset && `calc(${inset} + var(--sbw, 0px) / 2)`,
      }}
    >
      <div
        role="group"
        aria-label="Builder features"
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto lg:snap-none lg:overflow-hidden lg:[height:var(--row-h)]"
        style={
          {
            scrollbarWidth: "none",
            ["--row-h" as string]: `calc${ROW_H}`,
          } as React.CSSProperties
        }
        onMouseLeave={() => setHeld(false)}
        onMouseEnter={() => setHeld(true)}
        onKeyDown={onKey}
      >
        {features.map((f, i) => {
          const on = i === active;
          return (
            <button
              key={f.title}
              ref={(el) => {
                panels.current[i] = el;
              }}
              type="button"
              aria-expanded={on}
              tabIndex={desk && !on ? -1 : 0}
              onMouseEnter={() => desk && open(i)}
              onClick={() => take(i)}
              onFocus={() => desk && open(i)}
              className="relative w-[82vw] shrink-0 snap-start overflow-hidden text-left sm:w-[60vw] lg:w-auto lg:shrink lg:[flex:var(--flex)] lg:transition-[flex-grow,flex-basis] lg:duration-700 lg:ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={
                {
                  background: f.ground,
                  ["--flex" as string]: on ? `0 0 calc(${ROW_H} * ${f.ratio})` : "1 1 0px",
                } as React.CSSProperties
              }
            >
              {/* The recording as a card on its ground. On desktop it is sized
                  by the panel's height, so the open panel (sized to this ratio)
                  frames it with ground on every side and a strip shows its
                  middle. Below lg it simply sits in the flow, full width inside
                  the card's padding. */}
              <span
                className="relative mx-4 mt-6 block overflow-hidden rounded-[10px] lg:absolute lg:left-1/2 lg:top-[6%] lg:m-0 lg:h-[64%] lg:-translate-x-1/2"
                style={{ aspectRatio: String(f.ratio), boxShadow: RIM }}
              >
                {f.visual}
              </span>

              {/* Frost over the closed strips: they read as waiting, and the
                  open panel is the only sharp thing in the row. It lifts as a
                  strip opens, so the media comes into focus while it widens. */}
              <span
                aria-hidden
                className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                  on ? "opacity-0" : "opacity-100"
                } max-lg:hidden`}
                style={GLASS}
              />

              <span
                className={`relative block px-4 pb-6 pt-6 lg:absolute lg:inset-x-6 lg:bottom-6 lg:p-0 text-white`}
              >
                <span className="type-caption block tabular-nums opacity-70">0{i + 1}</span>
                <span className="mt-1.5 block text-[1.125rem] font-medium lg:truncate leading-[1.3] tracking-[-0.02em]">
                  {f.title}
                </span>
                <span
                  className={`mt-2 block max-w-[520px] transition-opacity duration-500 ${
                    on ? "lg:opacity-100 lg:delay-300" : "lg:opacity-0 lg:delay-0"
                  }`}
                >
                  <span className={`block text-[0.9375rem] leading-[1.45] tracking-[-0.01em] opacity-90 lg:min-h-[2.9em] ${on ? "" : "lg:h-[2.9em] lg:overflow-hidden"}`}>{f.body}</span>
                </span>
              </span>

              {on && desk ? (
                <span
                  aria-hidden
                  className={`absolute inset-x-0 bottom-0 h-[2px] text-white`}
                >
                  <span className="absolute inset-0 bg-current opacity-15" />
                  <span
                    key={`${i}-${auto}`}
                    className="relative block h-full origin-left bg-current"
                    style={
                      auto
                        ? {
                            animation: `zx-progress ${f.hold}ms linear forwards`,
                            animationPlayState: walking ? "running" : "paused",
                          }
                        : { transform: "scaleX(0)" }
                    }
                    onAnimationEnd={(e) => {
                      if (auto && e.animationName === "zx-progress") open(active + 1);
                    }}
                  />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
