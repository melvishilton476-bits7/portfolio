import Image from "next/image";
import { BoilDefs } from "./BoiledArt";

/**
 * How one round of the bystander game runs, as a diagram — built from the
 * workshop's own illustrations (Figma node 25:24) rather than drawn again here.
 *
 * It sits where the game is explained because the rules are a sequence, and a
 * sequence read as prose ("unscramble, ring, act") asks the reader to hold four
 * steps in their head to picture one round. The rail does that work instead.
 *
 * Laid out from the redraw (Figma 873:1937, Moment 3): the five steps hang off
 * one full-bleed dashed rail in the page's periwinkle, each on a numbered disc
 * in its own colour, with the drawing standing on the disc and the instruction
 * under it. No closing rule: the packet and card panels below start where it was.
 *
 * Layout: a row on desktop; on phones a column, with the rail turned to run
 * down through the discs. The captions
 * carry the actual instruction — the pictures alone say what each step looks
 * like, not what the students are doing — so the diagram still reads with
 * images off.
 */

type Step = {
  src: string;
  /** The export's own artboard, for the intrinsic ratio. */
  w: number;
  h: number;
  /** What the illustration shows, for anyone who cannot see it. */
  alt: string;
  label: string;
  /** The disc's fill, from the redraw. */
  disc: string;
  /** Optical correction on top of the shared area, for a drawing whose one
   *  figure fills its whole frame and so reads bigger than the rest. */
  scale?: number;
};

const STEPS: readonly Step[] = [
  {
    src: "/case/draw-the-line/flow/step-1.svg",
    w: 104,
    h: 60,
    alt: "Two students acting out a bullying scene, frozen mid-gesture",
    label: "Facilitators freeze a scene",
    disc: "#8593FF",
  },
  {
    src: "/case/draw-the-line/flow/step-2.svg",
    w: 593,
    h: 831,
    alt: "The sealed packet for one round, opened out flat",
    label: "A group opens its sealed packet",
    disc: "#FCDA5B",
  },
  {
    src: "/case/draw-the-line/flow/step-3.svg",
    w: 94,
    h: 62,
    alt: "Four raised hands, each holding up a word card",
    label: "They build the response from word cards",
    disc: "#087E4A",
  },
  {
    src: "/case/draw-the-line/flow/step-4.svg",
    w: 59,
    h: 93,
    alt: "A hand striking a bell",
    label: "They ring the bell when it is ready",
    disc: "#FF7E0A",
  },
  {
    src: "/case/draw-the-line/flow/step-5.svg",
    w: 64,
    h: 72,
    alt: "A student saying the assembled sentence out loud",
    label: "They say it out loud, in the scene",
    disc: "#8593FF",
    // One figure standing full height, beside step 1's two smaller ones.
    scale: 0.8,
  },
];

/** The rail: one full-bleed dashed line through the centre of every disc,
 *  in the periwinkle of the hero's marks. */
const RAIL = "repeating-linear-gradient(to right, #575fff 0px, #575fff 5px, transparent 5px, transparent 10px)";
const RAIL_V = "repeating-linear-gradient(to bottom, #575fff 0px, #575fff 5px, transparent 5px, transparent 10px)";

/** Every drawing covers the same area rather than the same height, which is
 *  what makes them read as one size: matched heights make the wide scenes
 *  look small and the tall bell loom. The side of that area's square, in px. */
const AREA = 108;

/** The disc's size, which also sets where the rail runs. */
const DISC = 52;

export default function BystanderFlow() {
  return (
    <figure className="relative w-full">
      <BoilDefs id="flow" count={STEPS.length} scale={2} ink={0.55} />
      {/* Equal columns, not space-between: each disc must land on the centre
          of its column, and a justified row spaces the gaps rather than the
          items. */}
      <ol className="relative mx-auto flex max-w-[1152px] flex-col gap-10 sm:grid sm:grid-cols-5 sm:gap-0">
        {/* Phones: the rail runs down through the discs instead. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-px sm:hidden"
          style={{ left: DISC / 2, backgroundImage: RAIL_V }}
        />
        {STEPS.map((step, i) => (
          <li key={step.src} className="relative flex items-center gap-5 sm:flex-col sm:gap-0">
            {/* A fixed-height bed the drawings stand on, so every disc and
                caption lands on one line however tall its drawing is. */}
            <div className="order-3 flex h-[88px] w-[120px] shrink-0 items-end justify-center sm:order-1 sm:h-[176px] sm:w-full sm:pb-9">
              {/* Sized to the shared area (see AREA), so a wide drawing comes
                  out shorter and a tall one narrower. Phones take 60% of it
                  to fit their shorter bed. */}
              <Image
                src={step.src}
                alt={step.alt}
                width={step.w}
                height={step.h}
                unoptimized
                className="h-auto w-[calc(var(--w)*0.6)] max-w-full sm:w-[var(--w)]"
                style={{
                  ["--w" as string]: `${Math.round(AREA * (step.scale ?? 1) * Math.sqrt(step.w / step.h))}px`,
                  filter: `url(#boil-flow-${i})`,
                }}
              />
            </div>
            <div className="relative order-1 flex shrink-0 justify-center sm:order-2 sm:w-full">
              {/* Desktop rail: drawn per column and run off both ends of the
                  row, so it reaches the screen edges without a second
                  element. The page clips the overshoot. */}
              {i === 0 ? (
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-1/2 top-1/2 hidden h-px w-[100vw] sm:block"
                  style={{ backgroundImage: RAIL }}
                />
              ) : null}
              <span
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 hidden h-px sm:block"
                style={{ width: i === STEPS.length - 1 ? "100vw" : "100%", backgroundImage: RAIL }}
              />
              <span
                className="relative flex shrink-0 items-center justify-center rounded-full font-display text-[1.25rem] font-medium tabular-nums"
                style={{
                  width: DISC,
                  height: DISC,
                  background: step.disc,
                  // The green is the one fill dark enough to swallow ink.
                  color: step.disc === "#087E4A" ? "#fff" : "#171717",
                }}
              >
                0{i + 1}
              </span>
            </div>
            <p className="type-caption-prose order-2 max-w-[190px] text-pretty text-ink sm:order-3 sm:mt-8 sm:text-center sm:text-balance">
              {step.label}
            </p>
          </li>
        ))}
      </ol>
    </figure>
  );
}
