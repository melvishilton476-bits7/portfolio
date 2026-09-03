import Image from "next/image";

/**
 * The reference board: three shots in ONE frame, not three framed figures —
 * a single strip split into equal thirds, butted edge to edge with no gutter
 * so it reads as one board rather than a row of pictures. It is handed to
 * <Figure> as a `visual`, so the rounding, the clip and the one set of crop
 * marks all come from the frame that already wraps it.
 *
 * The frame's own ratio is solved from the artwork rather than inherited from
 * the placeholder it replaces. Three equal columns share a height, so the cell
 * ratio fixes the frame ratio at 3x it — and the old 3/2 frame would have
 * forced 0.5 cells, cropping 33-57% off every photo. At a 0.78 cell (frame
 * 2.34) the two tight portraits lose 3.8% and 2.5%; the 32.5% falls on the
 * optical shot, which is the one carrying blurred window and trees either side
 * of its subject and so the only one improved by losing them.
 *
 * Each file is pre-cropped to 0.780 at build time, so `object-cover` has
 * nothing left to trim and no subject drifts out of frame at any width.
 */

const SHOTS = [
  {
    src: "/case/titan/reference-board/wrap-shades.webp",
    alt: "A wrap-around silver sunglass worn low on the face, lenses catching the room behind",
  },
  {
    src: "/case/titan/reference-board/shield-visor.webp",
    alt: "A single-lens shield visor close up, climbers mirrored across the whole lens",
  },
  {
    src: "/case/titan/reference-board/optical-frames.webp",
    alt: "Thin metal optical frames worn against a window, daylight through the lenses",
  },
] as const;

export default function ReferenceStrip() {
  return (
    <div className="grid h-full grid-cols-3">
      {SHOTS.map(({ src, alt }) => (
        <div key={src} className="relative h-full">
          <Image
            src={src}
            alt={alt}
            fill
            // A third of the 880px frame, so ~293px — 340 covers the widest case.
            sizes="(max-width: 880px) 33vw, 300px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
