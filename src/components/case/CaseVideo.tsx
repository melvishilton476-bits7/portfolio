/**
 * A screen recording in a figure slot.
 *
 * The first real video on this page — everything else that moves here is a CSS
 * replica of the product (<ZenxoBoard>, <ZenxoLegSlot>, <ZenxoResultsPan>),
 * which is why this needs its own component rather than an inline <video>: the
 * attributes below are the whole difference between a video that behaves like
 * a figure and one that behaves like a media player.
 *
 *   muted + autoPlay + playsInline — the only combination browsers will start
 *     without a gesture; iOS additionally needs playsInline or it takes the
 *     video fullscreen.
 *   loop — a figure has no beginning to come back to.
 *   no controls — nothing here is worth pausing, and a chrome bar would fight
 *     the crop marks.
 *   preload="metadata" — usually far below the fold, so nothing but the
 *     dimensions should be spent until it is near the viewport.
 *   disablePictureInPicture — a long-press should not lift a decorative loop
 *     out of the page.
 *
 * CROPPING
 *
 * A recording that came from somewhere else arrives with that somewhere's
 * furniture around it, and a caption in someone else's typeface sitting inside
 * the frame reads as a screenshot of another page rather than as a figure.
 * `crop` cuts it off in the source's own pixel coordinates, which is the only
 * unit the numbers can be checked in.
 *
 * The window/height percentages are the crop inverted: the element is blown up
 * so that `w x h` of it covers the frame, then offset so the crop's origin
 * lands on the frame's. Because both axes are scaled from the same source
 * rectangle, the video keeps its own aspect and nothing stretches — which is
 * also why there is no `object-fit` here. The caller is responsible for giving
 * the figure `w / h` as its ratio.
 */

export type VideoCrop = {
  /** The crop rectangle, in the source's pixels. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** The source's own dimensions. */
  sw: number;
  sh: number;
};

/** The ratio a figure must use for a given crop, so the crop fills it exactly. */
export const cropRatio = (c: VideoCrop) => c.w / c.h;

export default function CaseVideo({
  src,
  label,
  crop,
}: {
  src: string;
  /** What the recording shows, for anyone who cannot watch it. */
  label: string;
  crop?: VideoCrop;
}) {
  const style: React.CSSProperties = crop
    ? {
        position: "absolute",
        // Preflight sets `max-width: 100%` on replaced elements, which silently
        // clamps a blown-up crop back to the frame's width and stretches it —
        // the height percentage still applies, so the video renders at the
        // wrong aspect with no error anywhere.
        maxWidth: "none",
        width: `${(crop.sw / crop.w) * 100}%`,
        height: `${(crop.sh / crop.h) * 100}%`,
        left: `${(-crop.x / crop.w) * 100}%`,
        top: `${(-crop.y / crop.h) * 100}%`,
      }
    : { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" };

  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        style={style}
        src={src}
        aria-label={label}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
      />
    </div>
  );
}
