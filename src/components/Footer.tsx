import Asterisk from "./Asterisk";
import TrafficLight from "./TrafficLight";

/**
 * Footer — a full-bleed white area separated from the section above by a
 * single thin divider line (no rounded corners or drop shadow here).
 *
 * Left column: four inert nav links, then the closing "Come Again Soon" /
 * "Thank You for your Curiosity!" sign-off. A reused lime `<Asterisk>`
 * straddles the top edge, centred.
 *
 * Right column: the supplied `<TrafficLight>` street scene — one asset that
 * bundles the whole corner (mast + overhead arm sweeping off the top-right,
 * the three-lens signal head, the "EDGE OF THE CITY" plate, and a No-Parking
 * disc). It hugs the right edge and its top arm bleeds past it (clipped by the
 * page's `overflow-x: clip`), matching the mock. Decorative (`aria-hidden`)
 * and hidden below `lg`, where it would crowd the text and risk horizontal
 * overflow; the sign-off stands on its own on small screens.
 */

const LINKS = ["Sights to See", "Work", "About", "Blogs"];

export default function Footer() {
  return (
    <footer className="relative">
      {/* A thin divider line stands in for the rounded-slab-and-shadow seam. */}
      <div className="relative border-t border-ink/10 bg-background">
        {/* Right-edge street scene — one supplied asset. Desktop only. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[46%] lg:block"
        >
          <TrafficLight className="absolute -right-[2%] bottom-0 h-full w-auto" />
        </div>

        {/* Left column — the real content. */}
        <div className="page-container relative z-10 flex min-h-[clamp(460px,58vw,620px)] flex-col justify-between pt-28 pb-14 sm:pt-32">
          {/* Nav links */}
          <nav aria-label="Footer">
            <ul className="flex flex-col gap-4">
              {LINKS.map((name) => (
                <li key={name}>
                  <a
                    href="#"
                    className="type-nav group inline-flex items-center gap-2 text-ink transition-colors hover:text-accent-strong"
                  >
                    {name}
                    <span
                      aria-hidden
                      className="text-ink-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-strong"
                    >
                      &#8599;
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sign-off */}
          <div className="max-w-[62%] lg:max-w-[58%]">
            <p className="type-caption text-ink-muted">Come Again Soon</p>
            {/* type-heading, not type-display — the display size is reserved
                for the hero <h1>, so this sign-off sits with the other section
                titles a step below it. */}
            <h2 className="type-heading mt-2 text-ink">
              Thank You for your Curiosity&nbsp;!
            </h2>
          </div>
        </div>
      </div>

      {/* Lime asterisk straddling the slab's top edge. */}
      <Asterisk
        color="var(--color-accent)"
        className="absolute top-0 left-1/2 z-20 h-auto w-[clamp(110px,11vw,150px)] -translate-x-1/2 -translate-y-[42%]"
      />
    </footer>
  );
}
