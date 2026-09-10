/**
 * The old results page, read by a moving camera instead of shown flat.
 *
 * This capture is 1920x1083 of dense UI. At the width a figure gets on this
 * page it renders about 970px wide, where every number in it — the win rate,
 * the net P&L, Sharpe, the curve — is somewhere between hard and impossible to
 * read. A still would be a picture OF the argument rather than the argument.
 *
 * So the frame pans and zooms through it in the order the caption makes its
 * case: the whole page first, then the win rate that leads it, then the total
 * net P&L sitting small in the corner, then Sharpe given exactly the room max
 * loss gets, then down to the cumulative curve below the fold. Five stops, and
 * each one is a clause.
 *
 * HOW THE STOPS ARE EXPRESSED
 *
 * `transform-origin: 0 0` and a transform of `translate(tx%, ty%) scale(k)`.
 * Percentage translate resolves against the element's own border box, and the
 * image is sized to exactly fill the frame, so both percentages are in frame
 * units. Composing T then S, a point at normalised (u, v) in the artwork lands
 * dead centre when
 *
 *     tx = 50 - 100k*u        ty = 50 - 100k*v
 *
 * which is where every number in the keyframes comes from. Two of them are
 * then CLAMPED to the edge of the legal range, [-(100k - 100), 0]: the corner
 * P&L wants tx -183.3 at k 2.8 and the curve wants ty -116.7 at k 1.9, both of
 * which would pull the image off its own edge and show background. Clamping
 * parks the frame flush against that edge instead, which still contains the
 * subject — both of them are in a corner, which is the whole point being made
 * about them.
 *
 * The frame takes the capture's own 1920:1083 ratio rather than a nominal
 * 16:9, so the establishing shot is the complete page with nothing cropped.
 *
 * Plain <img>: the animation drives `transform` on this element, and putting
 * next/image's own wrapper and sizing between the frame and the transformed
 * node buys nothing here — the asset is a fixed-size WebP already cut to the
 * one size it is used at.
 */

/** The capture's own ratio. The frame takes it so nothing is cropped. */
export const RESULTS_RATIO = 1920 / 1083;

export default function ZenxoResultsPan({
  src,
  alt,
  duration = 24,
}: {
  src: string;
  alt: string;
  /** Seconds for one full pass through all five stops. */
  duration?: number;
}) {
  return (
    <div className="zr absolute inset-0 overflow-hidden bg-[#fffbf0]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="zr-shot absolute inset-0 h-full w-full"
        style={{ ["--zr-dur" as string]: `${duration}s` }}
      />
    </div>
  );
}
