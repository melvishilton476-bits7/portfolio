"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";


/**
 * What a group actually held in the word-card game, under the five-step rail
 * (Figma 873:1937, nodes 930:2753–2811): the sealed packet on the left, the
 * word cards on the right.
 *
 * PACKET: the two printed sheets, outside over inside, overlapped the way the
 * redraw lays them out, so the reader sees both faces of one packet.
 *
 * CARDS: the round as it plays. The cards sit in a jumbled pile, then deal
 * out one by one into the sentence quoted below, "Kisi aur ka rang dekh kar
 * aisa behave karna bilkul sahi nahi hai", each keeping a slight tilt so the
 * row reads as cards set down by hand. The pile gathers again and the round repeats, but
 * only while the panel is on screen, and under reduced motion the sentence
 * simply stands built.
 */

const CARD_W = 1231;
const CARD_H = 871;

/** In sentence order. */
const CARDS = [
  { word: "Kisi", src: "card-kisi" },
  { word: "aur ka", src: "card-aur-ka" },
  { word: "rang", src: "card-rang" },
  { word: "dekh kar", src: "card-dekh-kar" },
  { word: "aisa", src: "card-aisa" },
  { word: "behave", src: "card-behave" },
  { word: "karna", src: "card-karna" },
  { word: "bilkul", src: "card-bilkul" },
  { word: "sahi", src: "card-sahi" },
  { word: "nahi hai", src: "card-nahi-hai" },
] as const;

/** The pile is shuffled, so the sentence is not lying in order inside it.
 *  Fixed rather than random, so server and client draw the same pile. */
const PILE_ORDER = [6, 2, 9, 0, 4, 8, 1, 7, 3, 5];
const PILE_TILT = [-7, 4, -2, 9, -11, 3, 6, -5, 12, -3];
/** Once in order, still not machine-straight. */
const ROW_TILT = [-2, 1.5, -1, 2.5, -1.5, 1, -2.5, 1.5, -1, 2];

/** The panel is laid out on a 668 × 371 grid, the redraw's own slot. */
const PANEL_W = 668;
const PANEL_H = 371;
const W = 92;
const H = (W * CARD_H) / CARD_W;
const GAP = 10;
const COLS = 5;
const ROWS = 2;
const LEFT = (PANEL_W - (COLS * W + (COLS - 1) * GAP)) / 2;
const TOP = (PANEL_H - (ROWS * H + (ROWS - 1) * GAP)) / 2;

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

function slot(i: number) {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  return { x: LEFT + col * (W + GAP), y: TOP + row * (H + GAP) };
}

const DEAL_MS = 140;
const HOLD_MS = 4200;
const PILE_MS = 1400;

export default function WordCardKit() {
  return (
    // One sheet of dotted paper under both panels, so the dots run unbroken
    // from left to right, with nothing splitting it.
    <div className="dot-paper grid grid-cols-1 gap-y-6 py-8 sm:grid-cols-[614fr_668fr] sm:py-10">
      <figure>
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "614 / 371" }}>
          {/* Placed exactly as in the redraw (nodes 930:2753, 930:2754): the
              scene sheet, and the rules sheet over it, down and to the right.
              The positions are the Figma boxes less the transparent margin
              trimmed off each export. */}
          {(
            [
              { src: "packet-a", x: 144.4, y: 27.9, alt: "The packet's inside: Round 1, a student mocked for how he looks in front of his friends" },
              { src: "packet-b", x: 265.4, y: 120.9, alt: "The packet's outside: how to play, in three steps, and the Draw the Line hashtag" },
            ] as const
          ).map((p) => (
            <div
              key={p.src}
              className="absolute"
              style={{
                left: pct(p.x, 614),
                top: pct(p.y, 371),
                width: pct(166, 614),
                aspectRatio: "1608 / 2161",
              }}
            >
              <Image
                src={`/case/draw-the-line/packet/${p.src}.png`}
                alt={p.alt}
                fill
                sizes="(min-width: 640px) 16vw, 30vw"
                className="object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.12)]"
              />
            </div>
          ))}
        </div>
        <figcaption className="type-caption-prose mt-2 text-center text-[#656565]">
          <span className="bg-[#faf9f7] px-2 py-0.5">The sealed packet, one per group per round</span>
        </figcaption>
      </figure>

      <figure className="relative">
        <CardDeal />
        <figcaption className="type-caption-prose mt-2 text-center text-[#656565]">
          <span className="bg-[#faf9f7] px-2 py-0.5">Its word cards, jumbled, then put in order</span>
        </figcaption>
      </figure>
    </div>
  );
}

function CardDeal() {
  const ref = useRef<HTMLDivElement>(null);
  const [dealt, setDealt] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDealt(true);
      return;
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    let running = false;
    const dealTime = CARDS.length * DEAL_MS + 700;

    const cycle = (next: boolean) => {
      setDealt(next);
      timer = setTimeout(() => cycle(!next), next ? dealTime + HOLD_MS : PILE_MS);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !running) {
          running = true;
          // A beat on the pile first, so the reader sees it jumbled.
          timer = setTimeout(() => cycle(true), 600);
        } else if (!e.isIntersecting && running) {
          running = false;
          clearTimeout(timer);
          setDealt(false);
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const pileX = (PANEL_W - W) / 2;
  const pileY = (PANEL_H - H) / 2;

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: `${PANEL_W} / ${PANEL_H}` }}
      role="img"
      aria-label="Word cards dealt from a jumbled pile into the sentence: Kisi aur ka rang dekh kar aisa behave karna bilkul sahi nahi hai."
    >
      {CARDS.map((c, i) => {
        const at = slot(i);
        const pileIndex = PILE_ORDER.indexOf(i);
        // Going out, cards leave in sentence order; coming back, the last
        // dealt returns first, like a hand gathering a row.
        const delay = dealt ? i * DEAL_MS : (CARDS.length - 1 - i) * 50;
        return (
          <div
            key={c.src}
            aria-hidden
            className="absolute transition-[left,top,transform] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
            style={{
              width: pct(W, PANEL_W),
              left: pct(dealt ? at.x : pileX + (pileIndex - 4.5) * 1.5, PANEL_W),
              top: pct(dealt ? at.y : pileY - pileIndex * 1.2, PANEL_H),
              transform: `rotate(${dealt ? ROW_TILT[i] : PILE_TILT[pileIndex]}deg)`,
              zIndex: dealt ? i : pileIndex,
              transitionDelay: `${delay}ms`,
            }}
          >
            <Image
              src={`/case/draw-the-line/packet/${c.src}.png`}
              alt=""
              width={CARD_W}
              height={CARD_H}
              sizes="(min-width: 640px) 160px, 25vw"
              className="h-auto w-full rounded-[4px] shadow-[0_4px_10px_rgba(0,0,0,0.12)]"
            />
          </div>
        );
      })}
    </div>
  );
}

