import Image from "next/image";
import GrowOnView from "../GrowOnView";
import CropMarks from "./CropMarks";
import { Framed } from "./Figure";

/**
 * The campaign, placed rather than presented: the poster on a bus shelter and
 * the banner on a building, which is the only way to show that a frame shot on
 * a person survives being seen at forty feet in the dark.
 *
 * Same solve as the applications bento — the two cells are split in proportion
 * to their native ratios (1.50 and 0.99) so a shared row height crops neither.
 * At the 980px measure that lands on 7 and 5 of twelve tracks, costing the
 * shelter 3.0% and the banner 3.5%.
 *
 * The wide one leads: it carries the street, the traffic and the scale, and
 * putting the square first would have opened the row on the smaller idea.
 */

const ITEMS = [
  {
    label: "Bus shelter",
    src: "/case/titan/campaign/bus-stop.webp",
    alt: "The NOTHING GETS THROUGH poster lit in a bus shelter on a dark street, a sunburnt face filling the frame",
    span: "sm:col-span-7",
    stacked: "aspect-[1600/1067]",
    // The poster is the point, not the street it stands on — pushed in and
    // re-centred on the face so the frame reads the ad, not the sidewalk.
    origin: "63% 60%",
  },
  {
    label: "Building banner",
    src: "/case/titan/campaign/banner.webp",
    alt: "The same campaign as a fabric banner hung from a stone building, a mud-covered rider's eyes above the line",
    span: "sm:col-span-5",
    stacked: "aspect-[1579/1600]",
    origin: "57% 55%",
  },
] as const;

/** How much closer the crop pulls in from the plain object-cover frame. */
const ZOOM = 1.55;

export default function CampaignPair() {
  return (
    <figure className="mx-auto w-full max-w-[980px]">
      <div className="grid grid-cols-1 gap-6 sm:aspect-[980/386] sm:grid-cols-12">
        {ITEMS.map(({ label, src, alt, span, stacked, origin }) => (
          <GrowOnView
            key={label}
            className={`case-figure relative block ${stacked} sm:aspect-auto ${span}`}
          >
            <Framed className="relative h-full">
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 640px) 100vw, 580px"
                className="object-cover"
                style={{ transform: `scale(${ZOOM})`, transformOrigin: origin }}
              />
            </Framed>
            <CropMarks />
          </GrowOnView>
        ))}
      </div>
    </figure>
  );
}
