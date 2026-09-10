/**
 * The redesigned results page, as a mockup with no ground of its own.
 *
 * The export is transparent outside the monitor, which is what makes the fade
 * possible: there is no plate to give away where the artwork stops. A mask
 * takes the left and right edges to nothing, so the scene resolves out of the
 * page rather than being cut off by a frame — the figure reads as a window
 * onto something wider than itself instead of a pasted rectangle.
 *
 * The mask is horizontal only. Fading the top would eat the browser chrome the
 * mockup is deliberately showing, and fading the bottom would dissolve the
 * desk the monitor is standing on, which is the one part holding the scene to
 * a surface.
 *
 * `-webkit-mask-image` alongside the standard property: Safari still needs the
 * prefix for mask-image on a raster element, and without it the fade silently
 * does not apply — the image simply renders hard-edged, which is easy to miss
 * when it looks plausible either way.
 */

/** The export's own ratio, after cropping in on the monitor. The frame takes
 *  it so the scene is never cropped twice. */
export const RESULTS_AFTER_RATIO = 5340 / 3920;

/** Opaque through the middle, gone by the edges. 8% is measured against the
 *  artwork rather than chosen for looks: in this crop the monitor spans 9.2%
 *  to 90.7% of the width, so the fade finishes just before the bezel and
 *  starts again just after it. It only ever dissolves the desk, never an edge
 *  you would notice going soft.
 *
 *  This is also what caps how far the crop can zoom. Tighter, and the monitor
 *  reaches the frame edges with no shoulder left for the fade to happen in. */
const FADE = "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)";

export default function ZenxoResultsShot({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="absolute inset-0 bg-background">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-contain"
        style={{ maskImage: FADE, WebkitMaskImage: FADE }}
      />
    </div>
  );
}
