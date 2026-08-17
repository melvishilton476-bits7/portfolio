import Image from "next/image";
import GrowOnView from "../GrowOnView";
import CropMarks from "./CropMarks";
import { Framed } from "./Figure";

/**
 * The applications grid for the "In use" beat.
 *
 * The layout is solved from the artwork, not chosen and then filled. For a row
 * of images sharing a height, the cell widths that crop nothing are simply
 * proportional to the native ratios — so each row here is that split, rounded
 * to the nearest track:
 *
 *   row 1 · 370fr   Frames 7 · Packaging 7 · Cards 10
 *   row 2 · 363fr   ID card 10 · Letterhead 14
 *
 * The grid runs on 24 columns rather than 12 for the rounding alone. On 12,
 * the frames cell rounds from an ideal 265px down to a 227px track and loses
 * 14% of the photograph; on 24 it lands on 269px and loses 1.3%. Worst cell in
 * the whole grid is now the packaging at 4.6%.
 *
 * Pinning the ratio on the GRID rather than on each cell is what makes every
 * height definite — each row is a known fraction of a known total — so cells
 * fill their areas instead of fighting a ratio of their own.
 *
 * Below `sm` it collapses to one column and each cell falls back to its own
 * native shape; the spans would put the letterhead at ~110px wide otherwise.
 */

type Item = {
  label: string;
  src: string;
  alt: string;
  /** Track span, applied from `sm` up; auto-placement fills them in order. */
  span: string;
  /** Native shape, used below `sm` where the spans are off. */
  stacked: string;
};

const ITEMS: readonly Item[] = [
  {
    label: "Frames",
    src: "/case/titan/inuse/frames.webp",
    alt: "The frames worn close up, lenses caked in dust, the mark picked out in white on the brow",
    span: "sm:col-span-[7]",
    stacked: "aspect-[1147/1600]",
  },
  {
    label: "Packaging",
    src: "/case/titan/inuse/packaging.webp",
    alt: "The black-to-amber goggle box standing on grey rock, a line drawing of the goggles on its face",
    span: "sm:col-span-[7]",
    stacked: "aspect-[1219/1600]",
  },
  {
    label: "Cards",
    src: "/case/titan/inuse/cards.webp",
    alt: "Three business cards fanned on linen — one amber, one blue, one showing the contact side",
    span: "sm:col-span-[10]",
    stacked: "aspect-[1445/1391]",
  },
  {
    label: "ID card",
    src: "/case/titan/inuse/idcard.webp",
    alt: "A staff ID card hanging from an orange lanyard, the mark in an amber block at its foot",
    span: "sm:col-span-[10]",
    stacked: "aspect-[1532/1388]",
  },
  {
    label: "Letterhead",
    src: "/case/titan/inuse/letterhead.webp",
    alt: "The letterhead photographed at an angle, the mark in an amber block at its head",
    span: "sm:col-span-[14]",
    stacked: "aspect-[1600/1052]",
  },
];

export default function InUseBento() {
  return (
    <figure className="mx-auto w-full max-w-[980px]">
      <div className="grid grid-cols-1 gap-6 sm:aspect-[980/757] sm:grid-cols-[repeat(24,minmax(0,1fr))] sm:grid-rows-[370fr_363fr]">
        {ITEMS.map(({ label, src, alt, span, stacked }) => (
          <GrowOnView
            key={label}
            className={`case-figure relative block ${stacked} sm:aspect-auto ${span}`}
          >
            <Framed className="relative h-full">
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 640px) 100vw, 560px"
                className="object-cover"
              />
            </Framed>
            <CropMarks />
          </GrowOnView>
        ))}
      </div>
    </figure>
  );
}
