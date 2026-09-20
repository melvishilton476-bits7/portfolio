import AboutIntro from "./AboutIntro";
import Journey from "./Journey";
import FunGrid from "./FunGrid";

/**
 * The About page.
 *
 * Three banded sections stacked full width, not a two-column body: each one
 * opens with the same dashed rules and hatch cells, so scrolling the page is a
 * sequence of the same gesture rather than a header followed by a spread. The
 * previous side-by-side arrangement of the journey and the photo wall is gone
 * with it — the wall is now a connected constellation that needs the full
 * measure to hold its joins together.
 */
export default function About() {
  return (
    <>
      <AboutIntro />
      <div className="mt-28 sm:mt-36">
        <Journey />
      </div>
      {/* No bottom padding here: the fun grid ends in a dot field that runs to
          the foot of the page, so the breathing room before the footer has to
          sit INSIDE the section or the dots stop short and leave a bare band
          under the last row. FunGrid owns it. */}
      <div className="mt-28 sm:mt-36">
        <FunGrid />
      </div>
    </>
  );
}
