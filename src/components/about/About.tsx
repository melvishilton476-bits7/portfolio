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
      <div className="mt-28 pb-24 sm:mt-36 sm:pb-32">
        <FunGrid />
      </div>
    </>
  );
}
