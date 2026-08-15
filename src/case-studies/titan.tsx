import CaseHero from "@/components/case/CaseHero";
import Beat, { P } from "@/components/case/Beat";
import BandLine from "@/components/case/BandLine";
import SquareList from "@/components/case/SquareList";
import MarkLadder from "@/components/case/MarkLadder";
import CaseOverview from "@/components/case/CaseOverview";
import { Figure, FigureGrid, ComparePair } from "@/components/case/Figure";

/**
 * TITAN — the first case study.
 *
 * Composed from the shared beat primitives in components/case rather than
 * generated from a data schema, because the argument-carrying moments here (the
 * comparison pair, the sizing ladder, the two thesis bands) are specific to this
 * project and a schema would flatten them into a uniform template.
 *
 * Image placement follows one rule throughout: copy earns the image, never the
 * reverse. The hero is the single exception. Two beats — the reflection and the
 * overview — carry no images at all, because when the point is reading, the
 * pictures come out.
 */
export default function TitanCaseStudy() {
  return (
    <>
      <CaseHero
        eyebrow="Brand identity · Self-directed · 2025"
        title="TITAN"
        dek="Rebuilding a legacy name as performance eyewear."
        frameLabel="Goggles catching the ember"
      />

      <div className="page-container flex flex-col gap-24 pt-24 sm:gap-32 sm:pt-32">
        {/* ---- The context ------------------------------------------------
            One process artifact, before any designed work — it shows that
            thinking happened before making, which no finished asset can. */}
        <Beat kicker="The context" title="The brief was open.">
          <P>A brand, start to finish, three months, on my own.</P>
          <P>
            I picked eyewear because I&rsquo;d spent an embarrassing amount of time before a
            Travis Scott show looking for a pair of glasses to wear and not finding them.
            What I noticed while looking was that almost everything on the market is
            designed to be seen. Very little of it is designed to do anything.
          </P>
          <P>I chose the name Titan because it had weight and somewhere to go.</P>
          <P>Sport is where my head goes by default, so I took it toward performance.</P>
        </Beat>

        <Figure label="Sketchbook &amp; reference board" ratio={3 / 2} />

        {/* ---- The problem — no images. Keep the reader reading. --------- */}
        <Beat kicker="The problem" title="Performance eyewear mostly shouts.">
          <SquareList items={["Aggressive angles", "Loud colour", "Logos sized for a stadium"]} />
          <P>
            It reads as sport because it looks like sport, not because anything about it
            performs.
          </P>
          <P>
            I wanted a brand that stayed calm and still held up in conditions that
            don&rsquo;t care how it looks.
          </P>
          <P>
            <span className="text-ink">Precision. Performance. Protection.</span>
          </P>
        </Beat>

        {/* ---- The starting point ----------------------------------------
            The rejected directions. Nothing else in the case proves the
            difficulty as cheaply as the actual failed attempts. */}
        <Beat kicker="The starting point" title="I was stuck on the logo for weeks.">
          <P>
            It needed to mean something and stay minimal. Those two things kept pulling
            against each other. Anything meaningful got busy, and anything minimal was just
            a shape.
          </P>
          <P>
            The real problem was that I had no reference. I was trying to design
            performance without having looked at what performance actually is.
          </P>
        </Beat>

        <FigureGrid
          columns={3}
          ratio={1}
          items={[
            "Direction 01",
            "Direction 02",
            "Direction 03",
            "Direction 04",
            "Direction 05",
            "Direction 06",
          ]}
        />

        {/* ---- The turn --------------------------------------------------- */}
        <Beat kicker="The turn" title="I watched an eagle hunt on YouTube.">
          <P>
            Not research, just a video. But the dive was clean, the correction mid-air was
            instant, and nothing about it was wasted. That was peak performance, and no one
            had designed it.
          </P>
          <P>
            That pulled me into a longer read about how much of what we design has already
            been solved by something in nature first. Nature doesn&rsquo;t separate form
            from function, because it was never given the option.
          </P>
          <P>That became the thesis.</P>
        </Beat>

        <Figure label="Eagle spread — sharp / speed / designed with intention" ratio={16 / 9} />
      </div>

      {/* The thesis breaks out of the text column into a full-width band. */}
      <div className="my-24 sm:my-32">
        <BandLine>Nature is the perfect design.</BandLine>
      </div>

      <div className="page-container flex flex-col gap-24 sm:gap-32">
        <Beat title="Everything after this followed from it.">
          <P>
            The obvious eagle is a silhouette in flight. That would have made the mark about
            soaring, which isn&rsquo;t what an eyewear brand should be claiming.
          </P>
          <P>So I worked from the front of the head.</P>
          <SquareList
            items={[
              "The brow ridge and outer eyes make two upward curves",
              "The beak drops through the centre",
              "Together they resolve into a T",
            ]}
          />
          <P>
            The animal has the sharpest vision alive, and the mark comes from the part of it
            that does the seeing.
          </P>
        </Beat>

        {/* ---- The mark — the one caption that earns itself. -------------- */}
        <ComparePair
          left="Reference"
          right="Construction"
          ratio={1}
          caption={
            <>
              The correspondence, part for part: the brow ridge and outer eyes become the two
              upward curves, the terminals land where the eyes sit, and the beak drops through
              the centre as the stem. Read together they resolve into a T — the mark is the
              part of the animal that does the seeing, not the part that soars.
            </>
          }
        />

        {/* ---- The typeface ---------------------------------------------- */}
        <Beat kicker="The typeface" title="This is the part that took longest and produced nothing for a long time.">
          <P>
            Nothing off the shelf worked under the mark. Sharp corners read cold and brittle
            against its curves. Rounded corners went soft and lost the engineering. I kept
            trying new faces expecting the next one to solve it.
          </P>
          <P>None of them did, so I stopped looking and cut one instead.</P>
          <P>
            I took Morgant and redrew it, matching the corner radius to the mark. Once the
            radius was shared, the wordmark stopped fighting the logo.
          </P>
        </Beat>

        <Figure label="Morgant original vs. the custom cut — corner detail" ratio={16 / 9} />

        {/* ---- The system — a breadth beat. Volume is the argument. ------- */}
        <Beat kicker="The system" title="The colours came from material in the first place.">
          <P>
            They were photographed on stone and charred wood rather than laid out as flat
            swatches.
          </P>
          <SquareList items={["Obsidian Depth", "Arctic Light", "Steel Veil"]} />
          <P>
            Two gradients carry the two temperatures the brand works across. Blue to white
            for clarity. Black to orange for heat.
          </P>
          <P>
            From there I built the system out across letterheads, cards, packaging and the
            site, because anything left theoretical would also have been left untested. The
            manual got printed rather than exported, which meant a few trips to the one shop
            I found with the paper and finish I wanted, two hours away.
          </P>
        </Beat>

        <FigureGrid
          columns={2}
          ratio={4 / 3}
          items={[
            "Colour on charred wood",
            "The two gradients",
            "Typography spread",
            "Printed manual",
          ]}
        />

        {/* ---- The hinge constraint — the mark surviving. ----------------- */}
        <Beat kicker="A constraint that shaped the design" title="On eyewear, the identity has to survive the hinge.">
          <P>
            The mark gets stamped on a temple arm a few millimetres wide, and that&rsquo;s
            where most eyewear logos quietly stop working.
          </P>
          <P>
            So I built the sizing ladder backwards, from 185px down to 55px, and let the
            smallest size decide how much detail the mark was allowed to carry. Anything
            that disappeared at the bottom didn&rsquo;t belong at the top.
          </P>
        </Beat>

        <figure>
          <MarkLadder />
          <figcaption className="type-caption text-ink-muted mx-auto mt-4 max-w-[560px] text-center">
            The mark at its smallest, where most eyewear identities stop working.
          </figcaption>
        </figure>

        {/* ---- The campaign ---------------------------------------------- */}
        <Beat kicker="The campaign" title="Four faces. Mud, snow, heat, endurance.">
          <P>
            Each frame is shot on a person rather than a product, with the mark closing the
            bottom of the image after the scene has already done the work.
          </P>
        </Beat>
      </div>

      <div className="my-24 sm:my-32">
        <BandLine mono>NOTHING GETS THROUGH.</BandLine>
      </div>

      <div className="page-container flex flex-col gap-24 pb-32 sm:gap-32">
        <Beat title="A claim about dust and glare.">
          <P>
            It&rsquo;s also what an apex predator&rsquo;s design already guarantees.
          </P>
        </Beat>

        {/* Payoff grid — alternating cool and warm so no two hot frames sit
            adjacent, per the campaign's own sequencing. */}
        <FigureGrid
          columns={2}
          ratio={3 / 4}
          items={["Snow", "Heat", "Endurance", "Mud"]}
        />

        {/* ---- Reflection — no images. ----------------------------------- */}
        <Beat kicker="What stayed with me" title="A thesis is worth more than a reference.">
          <P>
            I spent weeks collecting shapes I liked and got nowhere. One idea about how
            nature solves problems unlocked the mark, the palette, the tagline and the
            campaign in about a week.
          </P>
          <P>
            If I revisited it, I&rsquo;d put that idea at the front of the manual instead of
            leaving it implicit on the logo page. Someone reading the book cold would see an
            eagle-derived mark and assume I picked an eagle because eagles look sharp.
          </P>
          <P>
            What I&rsquo;m glad about is that the system held. Every part of it can be traced
            back to one thought, which is what made the last two months of building it out
            straightforward.
          </P>
        </Beat>

        <CaseOverview
          rows={[
            { label: "Year", value: "2025" },
            { label: "Type", value: "Self-directed" },
            {
              label: "Role",
              value:
                "Brand strategy, identity, custom typeface, colour system, collateral, campaign, brand manual",
            },
            { label: "Duration", value: "3 months" },
          ]}
          scope={[
            "Brand identity",
            "Logo design",
            "Custom type",
            "Colour system",
            "Brand manual",
            "Collateral system",
            "Campaign",
            "Packaging",
            "Website",
          ]}
        />
      </div>
    </>
  );
}
