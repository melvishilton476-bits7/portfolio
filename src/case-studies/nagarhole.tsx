import CaseHero from "@/components/case/CaseHero";
import Beat, { P } from "@/components/case/Beat";
import CaseOverview from "@/components/case/CaseOverview";
import Moment from "@/components/case/Moment";
import PaletteWeighting from "@/components/case/PaletteWeighting";
import DirectionalCycle from "@/components/case/DirectionalCycle";
import SpeciesCycle from "@/components/case/SpeciesCycle";
import KabiniLogo from "@/components/case/KabiniLogo";
import SpeciesIcons from "@/components/case/SpeciesIcons";
import WarningCycle from "@/components/case/WarningCycle";
import { Figure } from "@/components/case/Figure";
import Image from "next/image";

/** Portrait slots capped well under the 880 measure — a 3:4 frame across the
 *  full width renders 1173px tall, which pushes its own caption off-screen. */
const PORTRAIT = 560;

/** Ratio the two evidence boards share once cropped — both native photos are
 *  within 0.3% of 3:2, so cropping to it loses essentially nothing. Two cells
 *  at that ratio, side by side with no gutter, fix the frame at 3:1. */
const EVIDENCE_CELL = 3 / 2;

/**
 * The two existing boards, side by side in one frame rather than two —
 * matches how the reference board works on the Titan page: a single strip,
 * no gutter, so it reads as "the signage that's there" rather than a pair of
 * unrelated photos.
 */
function ExistingSignsSplit() {
  const boards = [
    {
      src: "/case/nagarhole/existing-gaur.webp",
      alt: "A hand-painted Nagarahole Tiger Reserve board with a gaur illustration, fresh paint, Kannada and English department credit at the foot",
    },
    {
      src: "/case/nagarhole/existing-map.webp",
      alt: "A green Nagarahole National Park signboard showing a hand-drawn grid map of the reserve's roads and an index of distances, mounted beside a forest rest-house roof",
    },
  ] as const;

  return (
    <div className="grid h-full grid-cols-2">
      {boards.map(({ src, alt }) => (
        <div key={src} className="relative h-full">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 880px) 50vw, 440px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

/**
 * NAGARHOLE — signage for the Kabini range.
 *
 * Structurally unlike Titan. Titan narrates a sequence; this page states the
 * system, then defends three decisions against the options they beat. So it
 * alternates <Beat> (describing) with <Moment> (defending) — the moments carry
 * a rule and a numeral down the left so a reader can tell which mode they are
 * in before parsing the heading.
 *
 * The page is deliberately unflattering where it counts: the second language
 * went on the species boards but not the warning signs. That is the
 * reflection, and it is the strongest thing here.
 *
 * NOTE: the distances and durations on the directional boards are invented —
 * set to fill the layout, never sourced. The page used to say so beside that
 * figure and no longer does. If a disclosure goes back, it belongs in the
 * prose rather than on the artwork.
 *
 * Most image slots are still <Placeholder> pending exports — the codebase's
 * standing convention. Each carries the label and the aspect ratio its artwork
 * will have, so dropping a file in is a one-line `visual` prop with no layout
 * movement.
 */
export default function NagarholeCaseStudy() {
  return (
    <>
      <CaseHero
        eyebrow="Self-initiated coursework · Concept"
        title="NAGARHOLE"
        dek="Every sign was built to disappear into the forest. The warning family breaks that rule on purpose, because camouflaged danger is a design failure."
        frameLabel="Black leopard at the waterline with the Nagarhole wordmark"
        // Native art is a 0.9 portrait against a 16:9 hero, so `cover` keeps
        // only ~51% of its height. The crop is steered rather than centred:
        // 33% puts the window over the wordmark and the cat and drops the
        // empty water at the foot, which is the half that carries nothing.
        image={{
          src: "/case/nagarhole/hero-leopard.webp",
          ratio: 16 / 9,
          objectPosition: "center 33%",
        }}
      />

      <div className="page-container flex flex-col gap-24 pt-24 sm:gap-32 sm:pt-32">
        <Beat
          kicker="Overview"
          title="Nagarhole's signage works as individual objects but not as a system"
        >
          <P>
            Nagarhole holds elephants, tigers, leopards and a large bird population across
            forest, grassland and the riverbanks feeding the Kabini. The signage there is
            visually inconsistent, hard to pick out against dense vegetation, and disconnected
            from the surroundings it sits in. It carries information but nothing about the
            experience of being there, so visitors are left to work out navigation, zone
            boundaries and safety instruction on their own.
          </P>
          <P>
            The problem statement comes from secondary research and two interviews with people
            who had visited the park.
          </P>
        </Beat>

        {/* Ratio is 2x EVIDENCE_CELL — see ExistingSignsSplit. */}
        <Figure
          label="Signage as it exists in Nagarhole today"
          ratio={2 * EVIDENCE_CELL}
          visual={<ExistingSignsSplit />}
          caption="Two of the boards marking the park today — a hand-painted gaur board and a route map with no wayfinding logic of its own. Neither carries a safety instruction or connects to the other."
        />

        <Beat
          kicker="The system"
          title="One identity split into three families, so the colour says what kind of message this is before you read it"
        >
          <P>
            Yellow runs across all three families, and the base colour underneath it changes
            with the function: black and grey for information, crimson and orange for
            warnings, forest green for direction.
          </P>
        </Beat>

        <Figure
          label="The three palettes, with hex values and function labels"
          ratio={16 / 9}
          visual={<PaletteWeighting />}
          caption="Each family opens at equal thirds and settles into the weighting it carries: yellow and the accent at a quarter each, the base at a half. Yellow is the constant and moves identically across all three."
        />

        {/* The two sign families side by side rather than stacked. They are
            siblings in the system — same grid, same yellow, different job — and
            a reader comparing them shouldn't have to hold one in memory while
            scrolling to the other. Stacks below `lg`, where two portrait frames
            would each be too narrow to read the boards inside them. */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-10">
          <Figure
            label="Directional signs — coracle dock, river trail, safari entry"
            ratio={3 / 4}
            maxWidth={PORTRAIT}
            visual={<DirectionalCycle />}
            heading="Directional signs pair an arrow with a distance and a time, so a visitor knows what a trail costs before starting it"
          />

          <Figure
            label="Species boards — Indian Gaur, Sambar Deer, Asiatic Elephant"
            ratio={3 / 4}
            maxWidth={PORTRAIT}
            visual={<SpeciesCycle />}
            heading="Species boards carry the animal's name in Kannada as well as English, printed on the board itself"
          />
        </div>

        <Figure
          label="Logo construction — the K resolving into a leopard"
          ratio={16 / 9}
          visual={<KabiniLogo />}
          heading="The logotype is a leopard built out of the letter K of Kabini"
        />

        <Figure
          label="Warning signs — stay quiet, do not enter, no flash"
          ratio={3 / 4}
          maxWidth={PORTRAIT}
          visual={<WarningCycle />}
          heading="Warning signs drop the forest palette entirely and are the most visible object on the route"
        />

        {/* No heading: this paragraph turns the section above into the question
            below, and a heading here would announce a section it doesn't start. */}
        <Beat>
          <P>
            Three separate palettes look obvious side by side, but the brief asked for visual
            consistency across the park, and splitting the palette three ways is not an
            obvious way to deliver that.
          </P>
        </Beat>

        <Moment
          index={1}
          kicker="Beyond the brief"
          title="Kannada was not in the brief, and adding it let the species boards name the animal in the language of the district they stand in"
        >
          <P>
            The course brief did not ask for a second language. I added Kannada names to the
            species boards anyway, on the grounds that a system claiming to reflect the
            cultural identity of Kabini cannot do it in English only.
          </P>
          <P>
            It changed who the board is addressed to. Kabini sits in a Kannada-speaking
            district, and a board that names a gaur only in English is written for the
            visitor least likely to have grown up alongside one. The Kannada is set on the
            board itself, directly beneath the English and at the same weight, so it reads as
            part of the sign rather than a translation added to the end of it.
          </P>
        </Moment>

        {/* Was a two-option <ExplorationSet> against an English-only version.
            With the rejected option gone there is nothing being chosen between,
            so this is a <Figure> rather than a one-sided comparison — the
            "Chosen" chip and the "Verdict." lead-in both only mean something
            next to an alternative. Ratio is the board's own export so nothing
            is cropped. */}
        <Figure
          label="Kannada beneath the English name"
          ratio={714 / 933}
          maxWidth={PORTRAIT}
          visual={
            <Image
              src="/case/nagarhole/board-species-gaur.webp"
              alt="The Indian gaur species board, the animal's name set in Kannada directly beneath the English at the same weight"
              fill
              sizes="(max-width: 560px) 90vw, 560px"
              className="object-cover"
            />
          }
          caption="Self-verified, and applied to only one of the three families. It cost verification I was not qualified to do, and it left the safety-critical signs monolingual."
        />

        <Moment
          index={2}
          kicker="The mark"
          title="The identity carries the black leopard, so the mark stands for the park before a single board is read"
        >
          <P>
            Nagarhole&rsquo;s main draw is the black leopard, so the mark had to carry it. The
            K of Kabini already resembles a leopard in profile, and letting the letter resolve
            into the body means the logo works as a single form instead of a wordmark with a
            mascot sitting next to it.
          </P>
          <P>
            That division of labour is what lets the rest of the system stay plain. The mark
            carries the park&rsquo;s reputation, so the boards underneath it are free to do
            their own job — a gaur board can be about the gaur, and a warning board about the
            warning, without either of them arguing for Nagarhole as a place to visit.
          </P>
        </Moment>

        <Figure
          label="Species icons — elephant, sambar, hornbill"
          ratio={16 / 9}
          visual={<SpeciesIcons />}
          heading="Each species board opens with the animal drawn in the same brush-edged yellow, so a visitor can tell which board this is from further away than the name is readable"
          caption="The small marks travel with the animal rather than sitting in a legend — a heart for breeding, fruit for diet, motion lines for call and movement — so the same vocabulary can head a board, key a section inside it, and shrink to a map pin without being redrawn."
        />

        <Beat
          kicker="In the forest"
          title="In the forest the colour does its work before any of the text does"
        />

        {/* Each mockup keeps its OWN export ratio rather than being forced to a
            shared 16:9. The three masters land within 4% of each other but not
            on the same number, and cropping an installed-in-context shot to
            tidy that up would trim the forest the board is being judged
            against — which is the only reason these figures exist. */}
        <Figure
          label="Species board installed on the path, two visitors reading it"
          ratio={2480 / 1653}
          visual={
            <Image
              src="/case/nagarhole/mockup-species.webp"
              alt="The Asiatic elephant board standing beside a forest road in a drained grey landscape, two visitors stopped in front of it, the board's yellow the only colour in the frame"
              fill
              sizes="(max-width: 880px) 92vw, 880px"
              className="object-cover"
            />
          }
          heading="The species board is designed to be read standing still"
        />

        <Figure
          label="Warning sign standing in mist"
          ratio={2478 / 1609}
          visual={
            <Image
              src="/case/nagarhole/mockup-warning.webp"
              alt="The crimson Stay Quiet board on a post beside a misty track, a spotted deer standing further down the same track behind it"
              fill
              sizes="(max-width: 880px) 92vw, 880px"
              className="object-cover"
            />
          }
          heading="The warning sign is visible before the hazard it names"
        />

        <Figure
          label="Directional sign against the canopy"
          ratio={2480 / 1668}
          visual={
            <Image
              src="/case/nagarhole/mockup-directional.webp"
              alt="The green Kabini River Trail board mounted in a frame among ferns, its arrow, 45 mins and 10 km set against the drained forest behind it"
              fill
              sizes="(max-width: 880px) 92vw, 880px"
              className="object-cover"
            />
          }
          heading="The trail sign gives a name, an arrow and two numbers"
        />
      </div>

      <div className="page-container flex flex-col gap-24 pb-32 pt-24 sm:gap-32 sm:pt-32">
        <Beat kicker="Where it stands" title="Two months of solo work, fully specified and never built">
          <P>
            Nothing is installed. The system was never shown to the forest department, a
            tourism operator or anyone who works in Nagarhole. The species copy on the boards
            is assembled from secondary sources and checked for plausibility rather than
            verified for accuracy.
          </P>
        </Beat>

        <Beat kicker="Reflection" title="I added a second language to the wrong half of my own system">
          <P>
            Kannada was not in the brief. I put it on the species boards because a system
            claiming to carry the identity of Kabini should not speak only English, and I was
            pleased with that decision for two months. I never carried it to the warning
            signs. So in a Kannada-speaking district I made the board about breeding habits
            readable and left the sign that says do not enter an elephant corridor in English,
            and I did not notice until someone asked me which family had been translated.
          </P>
        </Beat>

        <CaseOverview
          rows={[
            { label: "Client", value: "None — self-initiated within a course brief" },
            {
              label: "Role",
              value:
                "Solo. Research, illustration, logotype, type selection, body copy and mockups",
            },
            { label: "Team", value: "None. No collaborators and no forest department involvement" },
            { label: "Timeline", value: "2 months" },
            { label: "Stage", value: "Concept — fully specified, never built or installed" },
          ]}
          scope={[
            "Wayfinding",
            "Signage Systems",
            "Brand Identity",
            "Illustration",
            "Typography",
          ]}
        />
      </div>
    </>
  );
}
