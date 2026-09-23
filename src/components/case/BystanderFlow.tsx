import Image from "next/image";
import { BoilDefs } from "./BoiledArt";

/**
 * How one round of the bystander game runs, as a diagram — built from the
 * workshop's own illustrations (Figma node 25:24) rather than drawn again here.
 *
 * It sits where the game is explained because the rules are a sequence, and a
 * sequence read as prose ("unscramble, ring, act") asks the reader to hold four
 * steps in their head to picture one round. The arrows do that work instead.
 *
 * Layout: a row on desktop, a column on phones, with the arrow rotated a
 * quarter turn so it keeps pointing the way the round travels. The captions
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
};

const STEPS: readonly Step[] = [
  {
    src: "/case/draw-the-line/flow/step-1.svg",
    w: 1629,
    h: 1021,
    alt: "Two students acting out a bullying scene, frozen mid-gesture",
    label: "Facilitators freeze a scene",
  },
  {
    src: "/case/draw-the-line/flow/step-2.svg",
    w: 1260,
    h: 978,
    alt: "The sealed packet for one round, opened out flat",
    label: "A group opens its sealed packet",
  },
  {
    src: "/case/draw-the-line/flow/step-3.svg",
    w: 1293,
    h: 647,
    alt: "Three students holding up word cards, arranging them into a sentence",
    label: "They build the response from word cards",
  },
  {
    src: "/case/draw-the-line/flow/step-4.svg",
    w: 804,
    h: 804,
    alt: "A hand striking a bell",
    label: "They ring the bell when it is ready",
  },
  {
    src: "/case/draw-the-line/flow/step-5.svg",
    w: 1684,
    h: 1552,
    alt: "A student saying the assembled sentence out loud",
    label: "They say it out loud, in the scene",
  },
];

/** The rail the five steps hang from: a hairline through a dot under each
 *  step, in place of the arrows that used to sit between them.
 *
 *  An arrow between every pair asserts causation five times over, and at this
 *  size the glyphs took as much ink as the drawings they were pointing at. A
 *  continuous line says the same thing once — these are stations on one run —
 *  and it gives the row a spine to align on, which five floating captions did
 *  not have.
 *
 *  Drawn as two half-segments per step rather than one line behind the row, so
 *  the rail stops dead at the first and last dot instead of running off into
 *  the margins. It also means the whole thing turns with the layout: the same
 *  halves become a vertical run when the row stacks on a phone.
 */
function Rail({ first, last }: { first: boolean; last: boolean }) {
  const line = "absolute bg-ink-muted/45";
  return (
    <div aria-hidden className="relative h-6 w-6 shrink-0 sm:h-6 sm:w-full">
      {/* Vertical when stacked, horizontal once the row forms. */}
      <span
        className={`${line} left-1/2 top-0 h-1/2 w-px -translate-x-1/2 sm:left-0 sm:top-1/2 sm:h-px sm:w-1/2 sm:translate-x-0 sm:-translate-y-1/2${
          first ? " hidden" : ""
        }`}
      />
      <span
        className={`${line} bottom-0 left-1/2 h-1/2 w-px -translate-x-1/2 sm:bottom-auto sm:left-auto sm:right-0 sm:top-1/2 sm:h-px sm:w-1/2 sm:translate-x-0 sm:-translate-y-1/2${
          last ? " hidden" : ""
        }`}
      />
      {/* #171717, the same black every decorative dot on this site uses — a
          lighter grey here would read as a disabled state. */}
      <span className="absolute left-1/2 top-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#171717]" />
    </div>
  );
}

export default function BystanderFlow() {
  // Wider than the page's figures (880) and than this row used to be (980):
  // five drawings sharing one line get a fifth of the measure each, so the row
  // has to run to the container's full width to give any one of them the size
  // a single figure would take for granted.
  return (
    <figure className="mx-auto w-full max-w-[1120px]">
      <BoilDefs id="flow" count={STEPS.length} scale={2} ink={0.55} />
      {/* Equal columns, not space-between: the rail's dots must land on the
          centre of each step, and a justified flex row spaces the GAPS evenly
          rather than the items, so the end dots drifted outward. */}
      <ol className="flex flex-col items-center sm:grid sm:grid-cols-5 sm:items-start">
        {STEPS.map((step, i) => (
          <li key={step.src} className="flex w-full max-w-[220px] flex-col items-center sm:max-w-none">
            {/* A fixed-height bed the drawings sit on the floor of, so the
                five captions land on one line however tall each drawing is.
                Without it the row's labels stepped up and down. */}
            <div className="flex h-[128px] items-end justify-center sm:h-[176px]">
              {/* Capped on BOTH axes rather than boxed to a height. The five
                  drawings have genuinely different proportions — a standing
                  figure against a card lying flat — and a shared height makes
                  the tall one loom while the wide one shrinks to nothing.
                  Two caps let each hit whichever limit it reaches first, so
                  they carry the same visual weight. */}
              <Image
                src={step.src}
                alt={step.alt}
                width={step.w}
                height={step.h}
                unoptimized
                className="h-auto w-auto object-contain"
                style={{
                  maxHeight: "100%",
                  maxWidth: 208,
                  filter: `url(#boil-flow-${i})`,
                }}
              />
            </div>
            <Rail first={i === 0} last={i === STEPS.length - 1} />
            <p className="type-caption text-ink-muted text-balance mt-3 text-center">
              {step.label}
            </p>
          </li>
        ))}
      </ol>
    </figure>
  );
}
