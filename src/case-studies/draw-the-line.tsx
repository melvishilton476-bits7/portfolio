import CaseHero from "@/components/case/CaseHero";
import Beat, { P } from "@/components/case/Beat";
import CaseOverview from "@/components/case/CaseOverview";
import Moment from "@/components/case/Moment";
import ExplorationSet from "@/components/case/ExplorationSet";
import { Figure } from "@/components/case/Figure";
import Image from "next/image";
import CaseVideo from "@/components/case/CaseVideo";
import CaseYouTube from "@/components/case/CaseYouTube";
import BystanderFlow from "@/components/case/BystanderFlow";
import BoiledArt from "@/components/case/BoiledArt";
import ArtifactCycle from "@/components/case/ArtifactCycle";
import IllustrationCycle from "@/components/case/IllustrationCycle";
import ScenarioCycle from "@/components/case/ScenarioCycle";

/**
 * DRAW THE LINE — a two-day anti-bullying workshop with Going to School.
 *
 * Research-led rather than artefact-led, so the page runs context → research →
 * what we made → three defended decisions → outcomes → reflection. Every image
 * slot is still a <Placeholder> pending exports; the slot numbers from the
 * brief sit beside each frame so the captures drop in without re-reading it.
 *
 * Team work: "we" for the team's calls, "I" only where the brief credits the
 * decision to me (the research, the bystander exercise, the sealed box).
 */

/** A spoken line set large, with its source underneath. No shared component
 *  exists for this yet and it appears only here. */
function PullQuote({
  children,
  attribution,
  lang,
}: {
  children: string;
  attribution: string;
  /** Set for a line not in English, so a screen reader voices it correctly. */
  lang?: string;
}) {
  return (
    <figure className="mx-auto w-full max-w-[720px] text-center">
      <blockquote
        lang={lang}
        className="type-heading text-ink-alt text-balance"
        style={{ letterSpacing: "-0.02em" }}
      >
        &ldquo;{children}&rdquo;
      </blockquote>
      <figcaption className="type-caption text-ink-muted mx-auto mt-5 max-w-[520px] text-pretty">
        {attribution}
      </figcaption>
    </figure>
  );
}

/** The drawings that stand beside the three outcome numbers, with their export
 *  boxes. Sizes are the artboards, used only for the intrinsic ratio. */
const HANDS = [
  { src: "/case/draw-the-line/hands/hand-1.svg", w: 178, h: 641 },
  { src: "/case/draw-the-line/hands/hand-2.svg", w: 188, h: 563 },
  { src: "/case/draw-the-line/hands/hand-3.svg", w: 206, h: 631 },
] as const;
const ADMITTED = [{ src: "/case/draw-the-line/hands/admitted.svg", w: 117, h: 131 }] as const;
const UNDERSTOOD = [{ src: "/case/draw-the-line/hands/understood.svg", w: 53, h: 56 }] as const;

/** One outcome figure over the photograph that is its evidence. The number
 *  is the title read BEFORE the frame, so the reader knows what to look for in
 *  a room full of raised (or unraised) hands. */
function Outcome({
  value,
  label,
  frame,
  visual,
}: {
  value: string;
  label: string;
  frame: string;
  /** Drawn artwork, shown UNFRAMED in place of the photograph. Omit and the
   *  outcome keeps its placeholder inside the usual frame. */
  visual?: React.ReactNode;
}) {
  const title = (
    <span className="flex flex-wrap items-baseline justify-center gap-x-5 gap-y-1">
      <span className="type-display text-ink-hero">{value}</span>
      <span className="type-caption text-ink-muted uppercase tracking-[0.14em]">{label}</span>
    </span>
  );

  // A drawing on the page's own paper needs no frame — the frame is what tells
  // a photograph it is a document, and these hands are not documenting
  // anything. Boxing them just drew a card around white space.
  //
  // It also sits BESIDE the number rather than under it. Stacked, the drawing
  // read as evidence filed beneath a claim, which is what a framed photograph
  // is for; level with the number it reads as the same sentence — the figure
  // on the left, what the figure is on the right.
  if (visual) {
    return (
      <figure className="mx-auto grid w-full grid-cols-1 items-center gap-8 sm:grid-cols-2 sm:gap-12" style={{ maxWidth: 880 }}>
        <div className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
          <span className="type-display text-ink-hero">{value}</span>
          <span className="type-caption text-ink-muted max-w-[300px] uppercase tracking-[0.14em]">
            {label}
          </span>
        </div>
        <div className="flex w-full justify-center">{visual}</div>
      </figure>
    );
  }

  return <Figure label={frame} ratio={21 / 9} title={title} />;
}

export default function DrawTheLineCaseStudy() {
  return (
    <>
      {/* slot-01 */}
      <CaseHero
        eyebrow="Going to School · Two-day school workshop · Ran 2025"
        title="DRAW THE LINE"
        dek="These students already recognised bullying. What they lacked was a way to respond to it, so we designed for response, not awareness."
        frameLabel="Students walking down a school corridor, under the Draw the Line identity"
        // Titan's two-layer tilt: the corridor as the plate, the near-black
        // logo floating above it on the depth axis. The logo export is a
        // 1208px square with its own margin, so the artboard is set to land it
        // at 40% of the frame, the same share Titan's wordmark takes.
        image={{ src: "/case/draw-the-line/hero-bg.png", ratio: 1469 / 829, objectPosition: "center" }}
        lockup={{ src: "/case/draw-the-line/hero-lockup.png", width: 1208, height: 1208, artboard: 3020 }}
      />

      <div className="page-container flex flex-col gap-24 pb-32 pt-14 sm:gap-32 sm:pt-20">
        <CaseOverview
          rows={[
            { label: "Role", value: "Research lead" },
            { label: "Team", value: "Five students" },
            { label: "Client", value: "Going to School" },
            { label: "Timeline", value: "4 months" },
            { label: "Stage", value: "Shipped" },
            { label: "Surface", value: "Workshop" },
          ]}
          scope={[
            "Primary Research",
            "Research Synthesis",
            "Study Design",
            "Participatory Methods",
            "Facilitation",
          ]}
        />

        <Beat
          kicker="Context"
          title="In this classroom, bullying is in person and in front of everyone"
        >
          <P>
            Bullying is widespread in Indian schools; Childline puts it at 66% of
            schoolchildren. We ran a two-day workshop with Going to School, an NGO in government
            schools, for one class of 33 in Grades 8 to 10. For them the bullying is verbal and
            physical, and it plays out in front of everyone.
          </P>
        </Beat>

        {/* slot-02 */}
        <Figure
          label="The classroom as we found it: 33 students, one mixed grade 8 to 10 cohort"
          ratio={16 / 9}
          visual={
            <Image
              src="/case/draw-the-line/classroom.webp"
              alt="Students at desks in a government-school classroom, watching something at the front of the room"
              fill
              sizes="(max-width: 880px) 100vw, 880px"
              className="object-cover"
            />
          }
        />

        <Beat
          kicker="Research"
          title="Students didn’t lack the facts, they lacked the feeling"
        >
          <P>
            Seven students, three parents and two teachers, plus secondary reading. Candid
            conversations, not a survey, including students who had been bullied and students
            who admitted to bullying others. Across target, bully and bystander, the gap was
            rarely knowledge: each knew bullying was wrong. What was missing was empathy, an
            understanding of how the moment felt to the other person in it. That set the method:
            make students feel the moment from inside it, not hear about it.
          </P>
        </Beat>

        <Beat
          kicker="What we made"
          title="Five artifacts, each built to put students inside a bullying moment"
        >
          <P>
            Every activity casts them into a role, as the bystander, the target, or the one who
            acted, so the feeling is theirs rather than described. Day 1 builds awareness, Day 2
            turns it into action.
          </P>
        </Beat>

        {/* slot-03 · video */}
        <Figure
          label="Animated explainer: types of bullying, why people bully, and what to do"
          ratio={16 / 9}
          visual={
            <CaseVideo
              src="/case/draw-the-line/video/explainer.mp4"
              label="The five-minute animated explainer: what bullying is, its types, why people do it and what to do"
            />
          }
          heading="The theory arrives as an animation, not a lecture"
          caption="Five minutes: what bullying is, its types, why people do it, what to do. The only passive part."
        />

        {/* slot-04, slot-05, slot-06 — one frame, cycling. Three stacked
            figures made the same point three times at full measure. */}
        <ArtifactCycle />

        {/* slot-14. Not a <Figure>: the frame here holds four panes rather
            than one image, and each pane carries its own border. */}
        <figure className="mx-auto w-full" style={{ maxWidth: 760 }}>
          <IllustrationCycle />
          <figcaption className="type-caption text-ink-muted mx-auto mt-4 max-w-[560px] text-center leading-relaxed">
            The full illustration set built for the workshop, drawn between three of us.
          </figcaption>
        </figure>

        <Beat>
          <P>
            Three decisions sit under the activities: how the matching game got a silent room
            to the front, why the bystander game made students build their answer rather than
            pick it, and a box left sealed for a full day.
          </P>
        </Beat>

        <Moment
          index={1}
          kicker="Participation"
          title="We put the answer in a student's hand, so the room had to come forward instead of raise it"
        >
          <P>
            Asked openly on Day 1 how to respond, not one hand went up. So the game handed the
            answer out: comic-panel situations to half the class, written responses to the other
            half, matched by coming to the front. The scary open question becomes a low-risk one,
            and bodies reach the front early.
          </P>
          <P>
            The cost: a matched answer is a handed answer. It proves a student can spot a good
            response, not build one, which is what the next game demanded.
          </P>
        </Moment>

        {/* slot-07, slot-08 */}
        <ExplorationSet
          kicker="Two versions of the same five minutes"
          ratio={4 / 3}
          options={[
            {
              label: "Pick the right response from a list",
              // The workshop's own scenario cards, cycling slowly: this option
              // was a situation followed by a list to pick from, and the
              // situations are the half of it that was ever drawn.
              visual: <ScenarioCycle side="scene" />,
              body: "A scene, then responses to choose between.",
              verdict: "Verdict: lost. The right answer is obvious on sight; the student generates nothing.",
            },
            {
              label: "Rebuild the sentence from word cards",
              // The response card matched to whichever situation is showing
              // beside it — the two panes turn together, so the pair reads as
              // one card and its answer rather than two unrelated exhibits.
              visual: <ScenarioCycle side="response" />,
              body: "One sealed packet per round, a sentence to assemble.",
              verdict: "Verdict: chosen. Costs build time and a hand-tuned difficulty curve.",
            },
          ]}
        />

        <Moment
          index={2}
          kicker="The bystander game"
          title="The jumbled-word game makes students build a response instead of picking one"
        >
          <P>
            Facilitators freeze a scene; each group unscrambles word cards into a
            twelve-to-fifteen-word response, rings a bell and acts it out. No option to pick,
            only a sentence to build and say, the thing a frozen bystander cannot do.
          </P>
          <P>
            My first version let them choose from a list and tested nothing: the answer was
            obvious on sight. Building it from scratch is the skill that survives outside the
            classroom. It was the slowest thing we made, tuned by hand to sit between corny and
            discouraging.
          </P>
        </Moment>

        {/* One round of the game, as a sequence — the copy above describes the
            rules, and a reader should be able to see the shape of a round
            without assembling it from a sentence. */}
        <BystanderFlow />

        <PullQuote
          lang="hi-Latn"
          attribution="A packet sentence. In English: treating someone differently because of their skin colour is not okay at all.">
          Kisi ka rang dekh kar aisa behave karna bilkul sahi nahi hai.
        </PullQuote>

        <Beat kicker="Final deliverable" title="The two days, as they actually ran" />

        {/* slot-10 · video. The poster is the identity over the corridor, the
            same still the project's card wears: a title card for the film,
            rather than a frame lifted from the middle of it. */}
        <div className="mx-auto w-full" style={{ maxWidth: 980 }}>
          <CaseYouTube
            id="iF7S1nw-4GY"
            title="Draw the Line — two-day anti-bullying workshop documentation"
            poster="/case/draw-the-line/card.webp"
            posterAlt="The Draw the Line identity over a school corridor"
          />
        </div>

        <Beat
          kicker="Outcomes"
          title="Day 1 built enough safety that 14 of 33 chose to admit they had bullied someone"
        >
          <P>
            Measured by facilitator-led conversation and show of hands, not a validated
            instrument. Zero hands on Day 1 for how to respond, more than 30 by Day 2. Around 31
            of 33 said they now understood the harm. And 14 said they had bullied someone and no
            longer wanted to be that person, the number I trust most for what it cost to say
            aloud.
          </P>
        </Beat>

        {/* slot-11, slot-12, slot-13 */}
        <div className="flex flex-col gap-16 sm:gap-20">
          <Outcome
            value="0 → 30+"
            label="Hands up when asked how to respond, Day 1 to Day 2 (of 33)"
            frame="Day 1 no hands, Day 2 more than 30 hands"
            visual={<BoiledArt id="hands" art={HANDS} height={200} />}
          />
          <Outcome
            value="14 of 33"
            label="Admitted they had bullied someone"
            frame="14 students admitted to having bullied someone before"
            visual={<BoiledArt id="admitted" art={ADMITTED} height={160} />}
          />
          <Outcome
            value="31 of 33"
            label="Said they understood the harm"
            frame="31 of 33 now understood what bullying does to a person"
            visual={<BoiledArt id="understood" art={UNDERSTOOD} height={140} />}
          />
        </div>

        <PullQuote attribution="Student, Day 2">
          I didn&rsquo;t even know there were types of bullying.
        </PullQuote>

        <Beat
          kicker="Reflection"
          title="The workshop proved it could land in the room; my next one has to make it last"
        >
          <P>
            Nothing we built was made to outlast the two days: no handover, no teacher brief, no
            student group. A two-day peak does not survive an unchanged classroom. Next time I
            would leave something small and self-sustaining with the school, follow up a month
            later, and build measurement in from the first day, not the last.
          </P>
        </Beat>
      </div>
    </>
  );
}
