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
        style={{ ["--mole-w" as string]: "clamp(56px, 6.4vw, 82px)" }}
      />
      <div className="pt-1 text-[0.9375rem] tracking-[0.01em]">
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
        <section aria-labelledby="playground-title" className="relative pt-12 md:pt-28">
          <TitleBand>
            <h1
              id="playground-title"
              className="type-heading text-ink-hero text-center font-light"
            >
              FIGHT BAD DESIGN WITH ME
            </h1>
          </TitleBand>

          <div className="page-container">
            {/* Set in caps as drawn. The two coloured phrases are the tell,
                and they are also the only two things on the line that are not
                grey, so the eye lands on them before it reads the sentence. */}
            <p className="text-ink-alt mx-auto mt-10 max-w-[31rem] text-center text-[0.9375rem] leading-[1.7] tracking-[0.01em]">
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
            <div className="mx-auto mt-12 grid max-w-[54rem] gap-10 sm:grid-cols-2 sm:gap-0">
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
            <h2 id="thoughts-title" className="type-heading text-ink-hero text-center font-light">
              3 : 24 AM THOUGHTS
            </h2>
          </TitleBand>
        </section>
      </main>
      <Footer />
    </>
  );
}
