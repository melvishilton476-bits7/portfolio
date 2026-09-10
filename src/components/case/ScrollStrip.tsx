import Image from "next/image";

/**
 * A tall screenshot scrolled end to end inside a short frame — the case
 * study's way of showing length without asking the reader to take it on faith.
 *
 * Everything is derived from the artwork's own ratio rather than tuned by eye,
 * so dropping in a longer strip re-solves the motion instead of breaking it:
 *
 *   visible  = how much of the sheet the frame can hold at once
 *   travel   = the rest of it, as a % of the SHEET's height  (what scrolls)
 *   thumb    = the same fraction, as a % of the TRACK        (how tall the grip is)
 *
 * The grip is not decoration. A frame that shows a quarter of its content
 * gives you a quarter-height grip, and that reads as "this goes on" faster
 * than any caption does — which is the whole point of the figure.
 *
 * The three numbers reach CSS as custom properties because @keyframes cannot
 * see props; they resolve at computed-value time, so a `var()` inside a
 * keyframe is fine as long as the property itself is not what's animating.
 *
 * A slow camera rides on top — see `strip-camera` in globals.css. It is a
 * separate layer on purpose, so the scroll's arithmetic is never touched by
 * the zoom.
 *
 * Motion is CSS-only and the component stays a server component. It is gated
 * on `.is-grown`, which the enclosing <GrowOnView> latches when the figure
 * arrives, so the scroll starts on arrival rather than being already halfway
 * down by the time you look at it.
 */
export default function ScrollStrip({
  src,
  alt,
  width,
  height,
  frameRatio = 16 / 9,
  duration = 24,
}: {
  src: string;
  alt: string;
  /** The artwork's true pixel size — both are needed, since its ratio is what
   *  solves the motion. */
  width: number;
  height: number;
  /** The frame's ratio. Must match the `ratio` given to <Figure>, or the sheet
   *  scrolls past its own end and shows blank at the bottom. */
  frameRatio?: number;
  /** One full down-and-back, in seconds. Slow on purpose: the figure is making
   *  a point about tedium, and a brisk scroll argues the opposite. */
  duration?: number;
}) {
  const visible = 1 / frameRatio / (height / width);
  const travel = (1 - visible) * 100;
  const thumb = visible * 100;
  const thumbTravel = ((1 - visible) / visible) * 100;

  return (
    <div
      className="strip absolute inset-0 overflow-hidden"
      style={
        {
          "--strip-travel": `${travel.toFixed(3)}%`,
          "--strip-thumb-travel": `${thumbTravel.toFixed(3)}%`,
          "--strip-dur": `${duration}s`,
        } as React.CSSProperties
      }
    >
      {/* Two layers, deliberately. The lens carries the camera and the sheet
          carries the scroll, so the vertical travel stays exactly what the
          ratio solved for — a single element doing both would fold the zoom
          into the translate and the sheet would stop landing flush. */}
      <div className="strip__lens absolute inset-0">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 880px) 100vw, 880px"
          className="strip__sheet absolute inset-x-0 top-0 h-auto w-full"
        />
      </div>
      {/* Sits above the sheet and outside the reading order — it reports the
          same fact the image already shows. */}
      <div aria-hidden className="strip__track">
        <span className="strip__thumb" style={{ height: `${thumb.toFixed(3)}%` }} />
      </div>
    </div>
  );
}
