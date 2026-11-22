"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import CaseKicker from "../CaseKicker";
import Phone from "./Phone";
import { asset, type View } from "./timeline";

/**
 * One "How it works" row, composed from its layout file (layouts/how-*.json,
 * exported from the Figma page) — phones, floating cards, notes, connectors
 * and nodes at their Figma positions on a 1100-wide stage — with the row's
 * text column set in the site's own type.
 *
 * Desktop draws the stage at 1:1 and scales it down as one piece when the
 * column is narrower than 1100, so nothing drifts apart. Below lg the row
 * stacks: text, phones, then each card with its note.
 *
 * Visibility:
 *   - nothing annotates the stage until the row scrolls into view; then the
 *     cards pop out with a spring, one after another top to bottom, and stay
 *     out. Each card's note, connector and nodes fade in with it;
 *   - a note tied to a PHONE also waits for that phone's resting frame, and
 *     fades while it moves (the connectors point at the resting frame). A
 *     phone listed in `staticPhones` never moves, so its notes simply appear;
 *   - reduced motion: everything visible, nothing moving.
 */

type Box = [number, number, number, number];
type Item =
  | { k: "tag"; t: string; box: Box }
  | { k: "text"; t: string; box: Box; size: number }
  | { k: "phone"; name: string; box: Box; view: string; time?: string; note?: string }
  | { k: "card"; asset: string; box: Box; imgRadius: number; shadow: boolean; src: string; wrap?: { fill: boolean; shadow: boolean; radius: number } }
  | { k: "note"; n?: string; title?: string; desc?: string; box: Box }
  | { k: "line"; box: Box; path: string }
  | { k: "node"; c: [number, number] };

export type RowLayout = { size: [number, number]; items: Item[] };

/** What a note, line or node is tied to. */
export type Bind = "always" | `phone:${string}` | `card:${string}`;

export type RowSpec = {
  layout: RowLayout;
  views: Record<string, View>;
  /** The row's text column. */
  time: string;
  title: string;
  body: string;
  call: [string, string];
  /** Where the column sits on the stage. */
  side: "left" | "right";
  /** Per note, in layout order. */
  notes: Bind[];
  /** Per connector line, in layout order. Nodes follow their nearest line. */
  lines: Bind[];
  /** Phones shown on their resting frame only, no video. */
  staticPhones?: string[];
  /** Notes the layout leaves as loose text, written out here. */
  extraNotes?: { n: string; title: string; desc: string; box: Box }[];
  /** Phones shown cropped inside a window (row 10:15). */
  cropped?: Record<string, { phoneW: number; dx: number; dy: number }>;
};

const STAGE_W = 1100;

/** Card spring, per the handoff's compact notification stack; each card
 *  follows the one above it by STAGGER seconds. */
const SPRING = { type: "spring", stiffness: 420, damping: 28 } as const;
const STAGGER = 0.18;

function Note({ n, title, desc }: { n?: string; title?: string; desc?: string }) {
  return (
    <div className="font-display">
      <p className="m-0 flex items-baseline gap-2.5">
        <span className="type-caption text-ink-muted">{n}</span>
        <span className="text-[0.9375rem] font-medium leading-[1.3] text-ink">{title}</span>
      </p>
      <p className="type-caption-prose m-0 mt-[3px] text-ink-muted">{desc}</p>
    </div>
  );
}

function TextColumn({ spec }: { spec: RowSpec }) {
  return (
    <div className="flex flex-col">
      {/* As the Figma Tag: the frame's left edge on the column edge, the label
          set in from it (CaseKicker's own 26px), not hung out past it. */}
      <div className="pt-[18px]">
        <CaseKicker>{spec.time}</CaseKicker>
      </div>
      <h3 className="m-0 mt-[26px] type-subheading-sm leading-[1.3] text-ink-alt">{spec.title}</h3>
      <p className="m-0 mt-3.5 type-caption-prose text-ink">{spec.body}</p>
      <div className="mt-[30px] flex flex-col gap-1.5 border-t border-dashed border-[#d9d9d9] pt-4">
        <p className="m-0 type-caption uppercase leading-[1.2] tracking-[0.04em] text-[#e8792b]">The call</p>
        <p className="m-0 type-caption-prose text-ink-muted">
          {spec.call[0]} <span className="text-ink">{spec.call[1]}</span>
        </p>
      </div>
    </div>
  );
}

/** A floating card: the cream panel straight on the page, or (p_protocol) in
 *  its white wrap. */
function CardArt({ item, sizes }: { item: Extract<Item, { k: "card" }>; sizes: string }) {
  const [w, h] = [item.box[2], item.box[3]];
  const wrapped = item.wrap?.fill;
  const pad = wrapped ? 11.5 : 0;
  return (
    <div
      className="relative h-full w-full"
      style={{
        background: wrapped ? "#fff" : undefined,
        borderRadius: wrapped ? item.wrap!.radius : item.imgRadius,
        boxShadow:
          item.shadow || item.wrap?.shadow
            ? "0 1px 2px rgba(23,23,23,0.05), 0 12px 28px -10px rgba(23,23,23,0.22)"
            : undefined,
        padding: pad,
      }}
    >
      <Image
        src={asset(item.src)}
        alt=""
        width={Math.round(w * 2)}
        height={Math.round(h * 2)}
        sizes={sizes}
        className="block h-full w-full object-contain"
        style={{ borderRadius: item.imgRadius }}
      />
    </div>
  );
}

export default function HowRow({ spec }: { spec: RowSpec }) {
  const reduce = useReducedMotion();
  const { layout } = spec;
  const [stageW, stageH] = layout.size;

  // ── scale the stage to the column ──────────────────────────────────────
  const wrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const fit = (w: number) => setScale(Math.min(1, w / STAGE_W));
    fit(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([e]) => fit(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── the row in view: once seen, it stays revealed ──────────────────────
  const stage = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setSeen(true);
        io.disconnect();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const on = Boolean(reduce) || seen;

  // ── phone state: rest (for phone-tied notes) ───────────────────────────
  const [rest, setRest] = useState<Record<string, boolean>>({});

  const restHandlers = useMemo(() => {
    const out: Record<string, (r: boolean) => void> = {};
    for (const v of Object.keys(spec.views)) out[v] = (r) => setRest((s) => (s[v] === r ? s : { ...s, [v]: r }));
    return out;
  }, [spec.views]);
  const isStatic = (v: string) => spec.staticPhones?.includes(v) ?? false;

  const shown = (b: Bind) => {
    if (!on) return false;
    if (b.startsWith("phone:")) {
      const v = b.slice(6);
      return reduce || isStatic(v) || rest[v] !== false;
    }
    return true;
  };

  // ── bind every note, line and node ─────────────────────────────────────
  const items = layout.items.filter((it) => !(it.k === "note" && !it.title));
  const notes = [...items.filter((it): it is Extract<Item, { k: "note" }> => it.k === "note"), ...(spec.extraNotes ?? []).map((n) => ({ k: "note" as const, ...n }))]
    .sort((a, b) => a.box[1] - b.box[1]);
  const lines = items.filter((it): it is Extract<Item, { k: "line" }> => it.k === "line");
  const nodes = items.filter((it): it is Extract<Item, { k: "node" }> => it.k === "node");
  const cards = items.filter((it): it is Extract<Item, { k: "card" }> => it.k === "card");
  const phones = items.filter((it): it is Extract<Item, { k: "phone" }> => it.k === "phone");
  const captions = items.filter(
    (it): it is Extract<Item, { k: "text" }> =>
      it.k === "text" && it.size === 12 && it.t !== "THE CALL" && phones.some((p) => Math.abs(p.box[0] - it.box[0]) < 1),
  );
  const nodeBind = (c: [number, number]): Bind => {
    let best = 0;
    let bestD = Infinity;
    lines.forEach((l, i) => {
      const [x, y, w, h] = l.box;
      const dx = Math.max(x - c[0], 0, c[0] - (x + w));
      const dy = Math.max(y - c[1], 0, c[1] - (y + h));
      const d = Math.hypot(dx, dy);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return spec.lines[best] ?? "always";
  };

  /** Cards in a column stack: a lower card tucks under the one above it. */
  const above = (c: Extract<Item, { k: "card" }>) =>
    cards
      .filter((o) => o !== c && Math.abs(o.box[0] - c.box[0]) < 12 && o.box[1] < c.box[1])
      .sort((a, b) => b.box[1] - a.box[1])[0];

  /** Cards pop top to bottom; anything tied to a card waits for it. */
  const cardOrder = [...cards].sort((a, b) => a.box[1] - b.box[1]).map((c) => c.asset);
  const delayOf = (b: Bind) => {
    if (reduce || !b.startsWith("card:")) return 0;
    const i = cardOrder.indexOf(b.slice(5));
    return i < 0 ? 0 : i * STAGGER + 0.12;
  };
  const fade = (b: Bind) => {
    const visible = shown(b);
    return {
      opacity: visible ? 1 : 0,
      transition: `opacity ${visible ? 400 : 300}ms ease-out ${visible ? delayOf(b) : 0}s`,
    };
  };

  const colX = spec.side === "left" ? 0 : 800;
  const sizesFor = (w: number) => `${Math.round(w)}px`;

  const phoneEl = (p: Extract<Item, { k: "phone" }>) => (
    <Phone
      view={spec.views[p.view]}
      mode={isStatic(p.view) ? "static" : "once"}
      alt={p.name.replace("Phone · ", "")}
      onRestChange={restHandlers[p.view]}
    />
  );

  return (
    <div ref={wrap} className="w-full">
      {/* ── desktop: the composed stage ────────────────────────────────── */}
      <div ref={stage} className="relative hidden lg:block" style={{ height: stageH * scale }}>
        <div className="absolute left-0 top-0 origin-top-left" style={{ width: stageW, height: stageH, transform: `scale(${scale})` }}>
          <div className="absolute top-0" style={{ left: colX, width: 300 }}>
            <TextColumn spec={spec} />
          </div>

          {phones.map((p) => {
            const crop = spec.cropped?.[p.view];
            const [x, y, w, h] = p.box;
            if (crop) {
              return (
                <div
                  key={p.name}
                  className="absolute overflow-hidden"
                  style={{
                    left: x,
                    top: y,
                    width: w,
                    height: h,
                    maskImage: "linear-gradient(to bottom, #000 55%, transparent)",
                    WebkitMaskImage: "linear-gradient(to bottom, #000 55%, transparent)",
                  }}
                >
                  <div className="absolute" style={{ left: crop.dx, top: crop.dy, width: crop.phoneW }}>
                    {phoneEl(p)}
                  </div>
                </div>
              );
            }
            return (
              <div key={p.name} className="absolute" style={{ left: x, top: y, width: w }}>
                {phoneEl(p)}
              </div>
            );
          })}

          {captions.map((c) => (
            <p
              key={c.t}
              className="absolute m-0 text-center type-caption uppercase leading-[1.2] tracking-[0.04em] text-ink-muted"
              style={{ left: c.box[0], top: c.box[1], width: c.box[2] }}
            >
              {c.t}
            </p>
          ))}

          {cards.map((c, i) => {
            const up = above(c);
            const tuck = up ? -(c.box[1] - up.box[1]) * 0.6 : 8;
            const hidden = { opacity: 0, y: tuck, scale: up ? 0.94 : 0.96 };
            return (
              <motion.div
                key={c.asset}
                className="absolute"
                style={{ left: c.box[0], top: c.box[1], width: c.box[2], height: c.box[3], zIndex: 20 - i }}
                initial={reduce ? false : hidden}
                animate={on ? { opacity: 1, y: 0, scale: 1, transition: { ...SPRING, delay: reduce ? 0 : cardOrder.indexOf(c.asset) * STAGGER } } : hidden}
              >
                <CardArt item={c} sizes={sizesFor(c.box[2])} />
              </motion.div>
            );
          })}

          {notes.map((n, i) => (
            <div
              key={`${n.n}-${i}`}
              className="absolute"
              style={{ left: n.box[0], top: n.box[1], width: n.box[2], ...fade(spec.notes[i] ?? "always") }}
            >
              <Note n={n.n} title={n.title} desc={n.desc} />
            </div>
          ))}

          <svg aria-hidden className="pointer-events-none absolute inset-0 overflow-visible" width={stageW} height={stageH}>
            {lines.map((l, i) => (
              <path
                key={i}
                d={l.path}
                transform={`translate(${l.box[0]} ${l.box[1]})`}
                fill="none"
                stroke="#8a8a8a"
                strokeWidth={1}
                style={fade(spec.lines[i] ?? "always")}
              />
            ))}
            {nodes.map((n, i) => (
              <circle
                key={i}
                cx={n.c[0]}
                cy={n.c[1]}
                r={3}
                fill="#fff"
                stroke="#2c2c2c"
                strokeWidth={1}
                style={fade(nodeBind(n.c))}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* ── below lg: stacked ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-10 lg:hidden">
        <TextColumn spec={spec} />
        <div className="flex flex-wrap justify-center gap-5">
          {phones.map((p) => (
            <figure key={p.name} className="m-0 w-[min(42vw,180px)]">
              {phoneEl(p)}
              {captions
                .filter((c) => Math.abs(c.box[0] - p.box[0]) < 1)
                .map((c) => (
                  <figcaption key={c.t} className="mt-3 text-center type-caption uppercase tracking-[0.04em] text-ink-muted">
                    {c.t}
                  </figcaption>
                ))}
            </figure>
          ))}
        </div>
        <ol className="m-0 flex list-none flex-col gap-6 p-0">
          {notes.map((n, i) => {
            const b = spec.notes[i];
            const card = b?.startsWith("card:") ? cards.find((c) => c.asset === b.slice(5)) : undefined;
            return (
              <li key={`${n.n}-${i}`} className="flex flex-col gap-3">
                {card ? (
                  <div className="w-full max-w-[280px]" style={{ aspectRatio: `${card.box[2]} / ${card.box[3]}` }}>
                    <CardArt item={card} sizes="280px" />
                  </div>
                ) : null}
                <Note n={n.n} title={n.title} desc={n.desc} />
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
