import CaseHero from "@/components/case/CaseHero";
import Beat, { P } from "@/components/case/Beat";
import BandLine from "@/components/case/BandLine";
import SquareList from "@/components/case/SquareList";
import CaseOverview from "@/components/case/CaseOverview";
import { Figure, FigureGrid, ComparePair } from "@/components/case/Figure";
import TitanConstruction from "@/components/case/TitanConstruction";
import DirectionMark, { BoilDefs } from "@/components/case/DirectionMark";
import TypeBento from "@/components/case/TypeBento";
import GradientSwatch from "@/components/case/GradientSwatch";
import InUseBento from "@/components/case/InUseBento";
import CampaignPair from "@/components/case/CampaignPair";
import Image from "next/image";

/** The six directions that didn't survive. Labels stay generic on purpose —
 *  naming them would invite the reader to judge each one, when the argument
 *  the grid makes is about the volume of dead ends, not their individual
 *  merits. */
const DIRECTIONS = [
  "Direction 01",
  "Direction 02",
  "Direction 03",
  "Direction 04",
  "Direction 05",
  "Direction 06",
] as const;

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
          <P>I got here because of a Travis Scott show, weirdly enough.</P>
          <P>
            I spent way too long beforehand trying to find a pair of glasses I actually
            wanted to wear, and never landed on anything. Most of what I tried on was
            clearly built to be looked at. Whether it did anything once you actually had
            it on felt like an afterthought.
          </P>
          <P>
            The brief was open, so I gave that problem to Titan. It&rsquo;s a name that
            already carries weight, and performance is a segment it has simply never
            touched. The project is what that move would look like if the brand actually
            made it: three months, start to finish, on my own.
          </P>
          <P>Sport is where my head goes by default, so that&rsquo;s the version of Titan I built.</P>
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

        {/* 4:3 rather than the square this held as a Placeholder: the marks
            run from 3.4:1 to 0.8:1, and in a square box the widest of them
            would have sat at a third of the cell height. */}
        <FigureGrid
          columns={3}
          ratio={4 / 3}
          items={DIRECTIONS}
          before={<BoilDefs count={DIRECTIONS.length} />}
          visuals={DIRECTIONS.map((label, i) => (
            <DirectionMark key={label} index={i} label={label} />
          ))}
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

        {/* Native ratio, not 16:9 — cropping this frame would cost the wingtips,
            which are the whole point of it. */}
        <Figure
          label="Eagle spread — sharp / speed / designed with intention"
          ratio={1920 / 918}
          visual={
            <Image
              src="/case/titan/eagle-spread.webp"
              alt="An eagle seen head-on, wings raised into a sharp triangular arch as it drops toward the water at speed"
              fill
              sizes="(max-width: 880px) 100vw, 880px"
              className="object-cover"
            />
          }
        />
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
          leftVisual={
            <Image
              src="/case/titan/reference-eagle.webp"
              alt="Golden eagle photographed head-on, with the mark's x and y axes, its sight lines and the words 'designed with intention' drawn over it"
              fill
              sizes="(max-width: 640px) 100vw, 480px"
              className="object-cover"
            />
          }
          rightVisual={<TitanConstruction />}
          // The reference's own 932×1145. Both halves then bleed to their edges
          // with nothing cropped: a square box would have taken 19% off the
          // reference's bottom, including its "Y – AXIS" label — losing half of
          // a labelled pair in the one figure whose argument IS the annotation.
          ratio={932 / 1145}
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

        <TypeBento />

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

        {/* 4:3 is the charred-wood export's own ratio, so the cell that carries
            the palette crops nothing. The manual (1.27:1) loses 5% off its
            top and bottom, all of it table. */}
        <FigureGrid
          columns={2}
          ratio={4 / 3}
          items={[
            "Colour on charred wood",
            "Gradient — clarity",
            "Gradient — heat",
            "Printed manual",
          ]}
          visuals={[
            <Image
              key="wood"
              src="/case/titan/system/charred-wood.webp"
              alt="The three brand colours — Obsidian Depth, Arctic Light and Steel Veil — as chips laid over a photograph of charred wood"
              fill
              sizes="(max-width: 640px) 100vw, 480px"
              className="object-cover"
            />,
            // Plain <img>: Next won't optimise SVG without `dangerouslyAllowSVG`.
            // Native 1.37:1 against a 1.333 cell, so `cover` shaves 3% off the
            // sides — and since the ramp runs top to bottom (the rect's
            // rotate(90) puts the gradient axis on the vertical), none of it
            // comes off the ramp.
            <GradientSwatch key="clarity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/case/titan/system/gradient-clarity.svg"
                alt="The clarity gradient, ramping from near-black through blue to near-white, with the TITAN mark centred on it"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </GradientSwatch>,
            // `object-fill`, uniquely on this one. It's a 0.56:1 portrait and
            // its ramp is also vertical, so `cover` into a landscape cell would
            // keep only the middle 42% — showing a slice of the gradient
            // instead of the gradient. Stretching preserves the full ramp; the
            // only casualty is the radial bloom widening, which on a swatch
            // reads as intended rather than as distortion.
            <GradientSwatch key="heat">
              <Image
                src="/case/titan/system/gradient-heat.webp"
                alt="The heat gradient, ramping from pale cream through orange to black, with the TITAN mark centred on it"
                fill
                sizes="(max-width: 640px) 100vw, 480px"
                className="object-fill"
              />
            </GradientSwatch>,
            <Image
              key="manual"
              src="/case/titan/system/printed-manual.webp"
              alt="The printed TITAN brand manual held in one hand over a dark wood table"
              fill
              sizes="(max-width: 640px) 100vw, 480px"
              className="object-cover"
            />,
          ]}
        />

        {/* ---- In use ----------------------------------------------------
            Same shape as the campaign beat below it: label, a title that is
            just the list, then one line of commentary on it. */}
        <Beat
          kicker="In use"
          title="Frames, packaging, business cards, an ID, a letterhead."
        >
          <P>This is the part I wanted to see finished rather than described.</P>
        </Beat>

        <InUseBento />

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

        {/* The payoff, placed rather than presented — see CampaignPair. */}
        <CampaignPair />

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
