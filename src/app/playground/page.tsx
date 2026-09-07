import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TitleBand from "@/components/TitleBand";
import Game from "@/components/game/Game";
import MoleFigure from "@/components/game/MoleFigure";

/* The two tells. Sampled from the design, and the same periwinkle the rest of
   the site accents with — the friendly one wears the brand colour. */
const PET = "#8581ff";
const PEST = "#f00010";

/**
 * /playground — a real route rather than an anchor on the home page.
 *
 * THE GAME IS NOT ALLOWED TO COST THE REST OF THE SITE ANYTHING, which is the
 * reason for the shape of this file. App Router splits a chunk per route, so
 * everything under components/game only ships to a visitor who comes here — but
 * that only holds while the boundary runs one way. Nothing outside this route
 * may import from components/game, not even a constant for a headline number:
 * one shared import and the bundler merges the two chunks. And any link to this
 * page from elsewhere carries `prefetch={false}`, because App Router prefetches
 * a static route in full the moment its link enters the viewport, which would
 * pull the whole game down for people who only scrolled past it.
 *
 * The page itself is a server component. Only the arena is client-side; the
 * heading, the instructions and the legend below are static HTML, so the
 * section is readable and complete before any script arrives.
 */
export const metadata: Metadata = {
  title: "Playground — Melvis Hilton",
  description:
    "Pixel Pests & Pixel Pets: whack as many pixel pests as you can in sixty seconds, and spare the pets.",
};

/** One half of the legend: the character, then what to do about it.
 *
 *  Set in the sans at caps, not the mono the scoreboard uses — the design puts
 *  these in the page's own voice, and the mono is reserved for the instrument
 *  readings (score, clock) where the fixed advance is doing a job. */
function Tell({
  kind,
  name,
  verb,
  rest,
}: {
  kind: "pet" | "pest";
  name: string;
  verb: string;
  rest: string;
}) {
  return (
    <div className="flex items-start justify-center gap-5">
      <MoleFigure
        kind={kind}
        className="shrink-0"
        style={{ ["--mole-w" as string]: "clamp(48px, min(4.6vw, 8.5vh), 66px)" }}
      />
      <div className="type-note pt-1">
        <p style={{ color: kind === "pet" ? PET : PEST }}>{name}</p>
        <p className="text-ink-muted mt-2">
          <span className="font-medium text-ink">{verb}</span> {rest}
        </p>
      </div>
    </div>
  );
}

export default function PlaygroundPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 overflow-x-clip">
        {/* ONE SCREEN, NOT A STACK OF PADDINGS. The header, the instruction
            line and the legend take the height they need off the top; the
            arena is the only thing that grows, so the ground band lands on the
            bottom edge of the viewport at any height instead of the section
            adding up to whatever its margins happen to total.

            Desktop only: below md the nav is fixed to the BOTTOM of the screen,
            where a full-height section would run the ground straight underneath
            it. There the section just flows at its natural height. */}
        <section
          aria-labelledby="playground-title"
          className="relative flex flex-col pt-12 md:min-h-svh md:pt-20"
        >
          <TitleBand>
            <h1
              id="playground-title"
              className="type-heading text-ink-hero text-center"
            >
              FIGHT BAD DESIGN WITH ME
            </h1>
          </TitleBand>

          <div className="page-container">
            {/* Set in caps as drawn. The two coloured phrases are the tell,
                and they are also the only two things on the line that are not
                grey, so the eye lands on them before it reads the sentence. */}
            <p className="type-note text-ink-alt mx-auto mt-8 max-w-[31rem] text-center leading-relaxed">
              WHACK AS MANY{" "}
              <span className="font-medium" style={{ color: PEST }}>
                PIXEL PESTS
              </span>{" "}
              IN 1 MINUTE.{" "}
              {/* Breaks where the design breaks, but only once there is a line
                  wide enough to hold the first half. */}
              <br className="hidden sm:inline" />
              DON&rsquo;T HARM THE{" "}
              <span className="font-medium" style={{ color: PET }}>
                PIXEL PETS
              </span>
              . ALL THE BEST, COMRADE.
            </p>

            {/* The two characters side by side, split by the same dashed
                hairline the rest of the site divides things with. Colour is the
                reliable tell — the names are one letter apart on purpose. */}
            <div className="mx-auto mt-9 grid max-w-[54rem] gap-8 sm:grid-cols-2 sm:gap-0">
              <Tell kind="pet" name="PIXEL PETS" verb={"DON\u2019T"} rest="WHACK THEM" />
              <div className="sm:border-l sm:border-dashed sm:border-[rgba(23,23,23,0.16)]">
                <Tell kind="pest" name="PIXEL PESTS" verb="ALWAYS" rest="WHACK THEM !" />
              </div>
            </div>
          </div>

          <Game />
        </section>

        <section aria-labelledby="thoughts-title" className="relative pt-24 pb-24 md:pt-36 md:pb-36">
          <TitleBand cell={250}>
            <h2 id="thoughts-title" className="type-heading text-ink-alt text-center">
              3 : 24 AM THOUGHTS
            </h2>
          </TitleBand>
        </section>
      </main>
      <Footer />
    </>
  );
}
