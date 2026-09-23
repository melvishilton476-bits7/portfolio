"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * The scenario cards, cycling — one pane showing the situation, the other the
 * response that was matched to it.
 *
 * The two panes live in different <ExplorationSet> options, so they cannot
 * share React state without threading a context through the set. They stay in
 * step another way: the index is derived from the wall clock, so every instance
 * on the page computes the same card from the same second, however and whenever
 * it mounts. No provider, and nothing to drift.
 *
 * Slow on purpose. Each card carries a sentence of Hindi dialogue to read, and
 * a carousel that turns before the reader finishes reading is just movement.
 *
 * Each card sits on a photograph of an empty government-school classroom, held
 * in black and white under a corner falloff — the same treatment <BoardCycle>
 * gives Nagarhole's signs, and for the same reason: a flat printed card on a
 * white page is an artefact, and a card in the room it was used in is a card.
 * The rooms are empty and are not the workshop's own classroom; they place the
 * card, they do not document it. The two panes take different rooms, so the
 * pair reads as two cards in a school rather than one card photographed twice.
 */

const PERIOD_MS = 6000;

type Card = {
  /** The situation, as shown to half the class. */
  scene: string;
  /** The response card matched to it. */
  response: string;
  /** What the situation drawing shows, for anyone who cannot see it. */
  alt: string;
  /** The response card's own line, in English — the card itself carries it in
   *  Hindi and English, and the alt text should say what it says rather than
   *  describe a picture of writing. */
  reply: string;
};

/** Four of the twelve, which is as many as a reader will sit through. */
const CARDS: readonly Card[] = [
  {
    scene: "/case/draw-the-line/illustration/art-01.webp",
    response: "/case/draw-the-line/response/res-01.webp",
    alt: "One student points at another's arm and mocks her skin colour while she looks down",
    reply: "Talking about someone's skin color like that is wrong. Everyone is good in their own way.",
  },
  {
    scene: "/case/draw-the-line/illustration/art-02.webp",
    response: "/case/draw-the-line/response/res-02.webp",
    alt: "Two boys walk either side of a third, laughing at his haircut and calling him names",
    reply: "His hair, his choice. Just let it be.",
  },
  {
    scene: "/case/draw-the-line/illustration/art-03.webp",
    response: "/case/draw-the-line/response/res-03.webp",
    alt: "A boy finds his bottle broken on his desk while two others laugh from behind",
    reply: "No matter what his bottle is like, if you broke it, you should say sorry.",
  },
  {
    scene: "/case/draw-the-line/illustration/art-04.webp",
    response: "/case/draw-the-line/response/res-04.webp",
    alt: "Two boys mock a third about the food in his lunchbox",
    reply: "It's home food, what's there to make fun of? Don't say stuff like that.",
  },
];

/** One room per pane. Both are empty classrooms, shot elsewhere: they are the
 *  surface the card is met on, not evidence of the workshop. */
const PLATES = {
  scene: { src: "/case/draw-the-line/plate/room-desks.webp" },
  response: { src: "/case/draw-the-line/plate/room-board.webp" },
} as const;

export default function ScenarioCycle({ side }: { side: "scene" | "response" }) {
  // Seeded from the clock rather than 0, so a pane mounting late (lazy, below
  // the fold) lands on the card its partner is already showing.
  const [i, setI] = useState(() => Math.floor(Date.now() / PERIOD_MS) % CARDS.length);

  useEffect(() => {
    const tick = () => setI(Math.floor(Date.now() / PERIOD_MS) % CARDS.length);
    // Line the first tick up with the clock's own boundary, then run on the
    // period — otherwise a pane mounted mid-interval turns off-beat forever.
    const delay = PERIOD_MS - (Date.now() % PERIOD_MS);
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      tick();
      interval = setInterval(tick, PERIOD_MS);
    }, delay);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, []);

  const card = CARDS[i];
  const src = side === "response" ? card.response : card.scene;

  const plate = PLATES[side];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src={plate.src}
        alt=""
        aria-hidden
        fill
        sizes="(max-width: 980px) 100vw, 480px"
        className="object-cover grayscale"
      />
      {/* Not a blur — a corner falloff, so the card has somewhere to sit
          instead of reading as pasted onto a sharp photograph. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 78% 78% at 50% 48%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.45) 100%)",
        }}
      />
      <div className="absolute inset-0 grid place-items-center p-[8%]">
        <div className="relative h-full w-full">
          <Image
            key={src}
            src={src}
            alt={side === "response" ? `Response card: “${card.reply}”` : card.alt}
            fill
            sizes="(max-width: 980px) 100vw, 440px"
            className="dtl-art object-contain drop-shadow-[0_18px_34px_rgba(0,0,0,0.45)]"
          />
        </div>
      </div>
    </div>
  );
}
