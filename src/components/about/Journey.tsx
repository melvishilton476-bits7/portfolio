import Image from "next/image";
import DashRule from "@/components/DashRule";
import HatchCell from "@/components/HatchCell";
import CropFrame from "@/components/CropFrame";
import GrowOnView from "@/components/GrowOnView";

/**
 * "MY JOURNEY" — the places the work happened.
 *
 * It opens with the same banded heading as the page title and the photo wall,
 * which is what makes the three read as one page rather than as a header
 * followed by two lists. Each stop is then framed in its own crop marks: the
 * frame is doing the work the old dashed spine used to do, marking these as
 * separate exhibits, and it costs no vertical run of dead space between them.
 */

const STOPS = [
  {
    name: "Smart touch",
    logo: "/about/logo-smart-touch.webp",
    logoAlt: "Smart touch logo",
    dates: "2025 July - 2026 August",
    body: "Redesigned Zenxo's core interface from a multi-step form into a canvas-and-editor experience, and built both Zenxo and Willxo's websites end to end.",
    /* The Smart touch mark is drawn on white; the other is already a black
       plate, so a white tile behind it would show as a halo. */
    plate: true,
  },
  {
    name: "The Big Dumb Project",
    logo: "/about/logo-big-dumb.webp",
    logoAlt: "The Big Dumb Project logo",
    dates: "2025 July - 2026 August",
    body: "Made motion and static content within brand guidelines for clients including PUBG and Angel One, including building visuals during a live PUBG event.",
    plate: false,
  },
];

export default function Journey() {
  return (
    <section aria-labelledby="journey-title" className="relative">
      <div className="page-container relative">
        <div className="relative flex items-center justify-center py-4">
          <DashRule edge="top" />
          <DashRule edge="bottom" />
          <HatchCell
            className="absolute inset-y-0 hidden w-[48px] lg:block"
            style={{ right: "calc(50% + 138px)" }}
            delay={0}
          />
          <h2
            id="journey-title"
            className="type-heading text-ink-hero text-center font-light"
            style={{
              fontSize: "clamp(1.5rem, 0.6rem + 2.9vw, 2.375rem)",
              letterSpacing: "-0.08em",
            }}
          >
            MY JOURNEY
          </h2>
          <HatchCell
            className="absolute inset-y-0 hidden w-[48px] lg:block"
            style={{ left: "calc(50% + 138px)" }}
            delay={120}
          />
        </div>
      </div>

      <div className="page-container mt-20 lg:mt-24">
        <GrowOnView>
          <ol className="grid gap-y-20 lg:grid-cols-2 lg:gap-x-20">
            {STOPS.map((stop) => (
              <li key={stop.name}>
                {/* The frame hugs the whole entry, not the title — these are
                    exhibits on a board, and marks around the heading alone
                    would leave the body copy outside the thing it belongs to.
                    Wider offsets than the default because a stop is a block,
                    not a caption. */}
                <CropFrame as="div" x={40} y={25}>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                    <span
                      className={`relative block size-[37px] shrink-0 overflow-hidden rounded-[3px] ${
                        stop.plate
                          ? "bg-white shadow-[0px_1px_3.6px_0px_rgba(0,0,0,0.08)]"
                          : ""
                      }`}
                    >
                      <Image
                        src={stop.logo}
                        alt={stop.logoAlt}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </span>
                    {/* The site's h3 tier, not a size typed in here. It was
                        22px/500 inline, which made this the only h3 on the site
                        both larger and heavier than the tier ProjectCard and
                        Ticket use — and globals.css says out loud why the tier
                        is weight 400: a card title must never read heavier than
                        a section sub-heading. */}
                    <h3 className="type-subheading-sm text-ink-alt">
                      {stop.name}
                    </h3>
                    {/* Hairline box, not a filled chip: the dates are a fact
                        filed beside the name, and anything with a fill would
                        outrank the logo sitting next to it. The rule is the
                        site's hairline — black at a quarter, the same one the
                        case-study callouts and the mark ladder are drawn with.
                        It was solid #000 at half a pixel, which made it the one
                        border on the site darker and thinner than every other
                        one, and the caption tier replaces a 9px that no token
                        backed and that sat below even the nav's 11px. */}
                    <span className="type-caption text-ink-alt flex h-[26px] items-center justify-center border border-black/25 px-3 whitespace-nowrap">
                      {stop.dates}
                    </span>
                  </div>
                  {/* The prose tier, not the caption one. .type-caption is
                      meta — it is what the dates chip beside the title is set
                      in — and three lines of running copy set in it read as a
                      footnote to a heading rather than as the entry itself.
                      .type-note is the 15px the bio above is set in, and this
                      is the same kind of writing.

                      The measure is held at about the same 54 characters it had
                      before rather than at the same pixel width: a cap that
                      does not move when the type grows silently narrows the
                      column, and 338px at 15px is a five-line stack of short
                      lines. */}
                  <p className="type-note text-ink-alt mt-6 max-w-[405px] leading-relaxed">
                    {stop.body}
                  </p>
                </CropFrame>
              </li>
            ))}
          </ol>
        </GrowOnView>
      </div>
    </section>
  );
}
