import GrowOnView from "../GrowOnView";
import CropMarks from "./CropMarks";
import { Framed } from "./Figure";

/**
 * The typeface beat's four-up: Morgant as it ships against the cut I made from
 * it, each state shown twice — once at the corner where the change lives, once
 * across the whole wordmark where you can actually feel it.
 *
 * Laid out as two rows rather than a uniform grid, because the pairing IS the
 * argument. Read across a row and you go detail → application for one state of
 * the type; read down a column and you get before → after. A 2×2 of equal
 * cells would have left the reader to work out which of the four belongs with
 * which.
 *
 * The wordmarks take two thirds of the width. They're the payoff, and at
 * 6.3:1 they're the only two that need it — the letter close-ups are square
 * and would just grow empty plate.
 *
 * Deliberately NOT boiled, unlike the logo directions: the whole point of this
 * beat is a corner radius measured to match the mark, and an edge that won't
 * hold still would be arguing against the copy right next to it.
 */

const LETTER_RATIO = 150.47 / 138.39;

/** The WIDER of the two wordmarks (the custom cut, whose tracking opened up).
 *  Both wordmarks share a viewBox height, so containing each one inside a box
 *  of this ratio lands them at matched cap heights — the custom fills it
 *  exactly, the original fits by height and comes up narrower. Size both to
 *  the same WIDTH instead and the original would render 8% taller, showing the
 *  reader a scale change that isn't part of the design. */
const WORDMARK_BOX = 290.93 / 42.74;

/** The plate baked into the letter SVGs. Repeated on the cell behind them so
 *  the artwork's own rounded corners disappear into it — otherwise its ~7px
 *  radius would show as four light notches inside our 3px one. */
const PLATE = "#151515";

type CellProps = { span: string; children: React.ReactNode };

function Cell({ span, children, ratio }: CellProps & { ratio?: number }) {
  return (
    <GrowOnView className={`case-figure relative block ${span}`}>
      <Framed
        className="relative h-full"
        style={ratio ? { aspectRatio: String(ratio) } : undefined}
      >
        {children}
      </Framed>
      <CropMarks />
    </GrowOnView>
  );
}

function Letter({ src, alt, span }: { src: string; alt: string; span: string }) {
  return (
    <Cell span={span} ratio={LETTER_RATIO}>
      <div className="absolute inset-0" style={{ background: PLATE }}>
        {/* Cell ratio IS the artwork's ratio, so `cover` crops nothing — it
            just guarantees the plate reaches all four edges. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      </div>
    </Cell>
  );
}

function Wordmark({ src, alt, span }: { src: string; alt: string; span: string }) {
  return (
    <Cell span={span}>
      {/* In flow, not `absolute inset-0`: stacked on mobile there is no letter
          cell beside it to set the row height, and absolute content would
          leave the cell measuring zero. In flow it sizes to the wordmark plus
          its padding, while `h-full` still lets it stretch to the letter's
          height once the two sit in a row. */}
      <div className="bg-surface flex h-full w-full items-center px-[7%] py-[6%] sm:py-0">
        <div className="relative w-full" style={{ aspectRatio: String(WORDMARK_BOX) }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-contain" />
        </div>
      </div>
    </Cell>
  );
}

export default function TypeBento() {
  return (
    <figure className="mx-auto w-full max-w-[880px]">
      {/* Stacks below `sm`: a 4-of-12 column at 375px leaves the letter about
          115px wide, too small to see the join the whole figure is about. */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-12 sm:gap-8">
        <Letter
          src="/case/titan/type/letter-original.svg"
          alt="Morgant's capital T at large size, with dashed circles marking the square outer corner and the arm-to-stem junction"
          span="sm:col-span-4"
        />
        <Wordmark
          src="/case/titan/type/wordmark-original.svg"
          alt="TITAN set in unmodified Morgant"
          span="sm:col-span-8"
        />
        <Letter
          src="/case/titan/type/letter-custom.svg"
          alt="The redrawn capital T, the same circles now marking a rounded outer corner and a chamfered junction"
          span="sm:col-span-4"
        />
        <Wordmark
          src="/case/titan/type/wordmark-custom.svg"
          alt="TITAN set in the custom cut"
          span="sm:col-span-8"
        />
      </div>
      <figcaption>
        <p className="type-caption text-ink-muted mx-auto mt-4 max-w-[560px] leading-relaxed">
          Morgant, top. The cut, bottom. The circles mark the two joins that moved.
        </p>
      </figcaption>
    </figure>
  );
}
