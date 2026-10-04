import Image from "next/image";
import CaseHero from "@/components/case/CaseHero";
import CaseOverview from "@/components/case/CaseOverview";
import CaseKicker from "@/components/case/CaseKicker";
import CaseYouTube from "@/components/case/CaseYouTube";
import DashRule from "@/components/DashRule";
import GrowOnView from "@/components/GrowOnView";
import ScrubText from "@/components/case/ScrubText";
import { Figure } from "@/components/case/Figure";
import ArtifactScroll from "@/components/case/ArtifactScroll";
import BystanderFlow from "@/components/case/BystanderFlow";
import BoiledArt, { BoilDefs } from "@/components/case/BoiledArt";
import Highlight from "@/components/case/Highlight";
import FrameCorners from "@/components/case/FrameCorners";
import GraphPaper from "@/components/case/GraphPaper";
import ScenarioCycle from "@/components/case/ScenarioCycle";
import WordCardKit from "@/components/case/WordCardKit";

/**
 * DRAW THE LINE — a two-day anti-bullying workshop with Going to School.
 *
 * Laid out from the Figma redraw (MY_PORTFOLIO, node 873:1937), in the same
 * vocabulary as the Zenxo page: crop-marked kickers, a heading answered by a
 * narrow side note, sections that alternate between hanging off the left
 * margin and answering from the right, and comparisons set in ruled tables.
 *
 * The page argues one thing. The students already sensed bullying; what they
 * lacked was its weight and a response. Every section after the research is
 * one of the two:
 *
 *   - Research names the two gaps, on a band of graph paper with the
 *     workshop's own drawings of each.
 *   - What we made pins one frame and scrolls the four artifacts past it.
 *   - Three moments defend the three decisions: playing every role, the
 *     matching game, and the word-card game.
 *   - Outcomes and Reflection say what moved, and what two days can't prove.
 *
 * Colour is spent on two headings only, the two the page exists to prove:
 * what we made (violet) and what changed (blue). Both scrub in as the reader
 * reaches them.
 *
 * Team work: "we" for the team's calls, "I" only where the work was mine.
 */

/** Running copy for the side notes: light and justified, the Zenxo setting.
 *  `justify={false}` ranges it left for a note too short to justify well. */
function Body({
  children,
  className = "",
  justify = true,
}: {
  children: React.ReactNode;
  className?: string;
  justify?: boolean;
}) {
  return (
    <p
      className={`${justify ? "prose-justified" : ""} text-pretty ${className}`}
      style={{ fontSize: "0.9375rem", lineHeight: 1.6, fontWeight: 300, color: "#3d3d3d" }}
    >
      {children}
    </p>
  );
}

/** Running prose for the moments, outcomes and reflection. 15px with a 1.6
 *  line: a paragraph of six lines or more needs the body size, not the 13px
 *  this used to be. Colour is the caller's: ink, or the secondary #656565. */
function Small({
  children,
  className = "",
  justify = false,
}: {
  children: React.ReactNode;
  className?: string;
  justify?: boolean;
}) {
  return (
    <p
      className={`${justify ? "prose-justified" : ""} text-pretty ${className}`}
      style={{ fontSize: "0.9375rem", lineHeight: 1.6 }}
    >
      {children}
    </p>
  );
}

/** The page's type ladder, one job per step:
 *    H36 regular  a section's claim (every section opens on one)
 *    H27 regular  the pull quote
 *    H24 regular  a moment's answer, under its kicker
 *    H19          short display lines: band headings, captions-as-titles
 *    LEAD 17      a subheader under a claim, or a closing paragraph
 *    Body/Small 15  running prose
 *    .type-caption-prose 13  multi-line captions; .type-caption 12 for
 *                 one-line labels only */
const H36: React.CSSProperties = {
  fontSize: "clamp(1.625rem, 1.1rem + 1.6vw, 2.25rem)",
  lineHeight: 1.4,
  letterSpacing: "-0.02em",
  fontWeight: 400,
};
const H27: React.CSSProperties = {
  fontSize: "clamp(1.375rem, 1.15rem + 0.7vw, 1.6875rem)",
  lineHeight: 1.45,
  letterSpacing: "-0.005em",
  fontWeight: 400,
};
const H24: React.CSSProperties = {
  fontSize: "clamp(1.25rem, 1.1rem + 0.5vw, 1.5rem)",
  lineHeight: 1.3,
  letterSpacing: "-0.005em",
  fontWeight: 400,
};
const LEAD: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "1.0625rem",
  lineHeight: 1.65,
  fontWeight: 400,
  color: "#222",
};

const H19: React.CSSProperties = {
  fontSize: "1.1875rem",
  lineHeight: 1.45,
  letterSpacing: "-0.005em",
  fontWeight: 500,
};

/* LAYOUT. Every text section uses the full page container (1280px, with
   the site gutter), so the left and right edges are the same all the way
   down. Inside it, a claim and its account split one way only: the claim
   takes the rest, the account a 460px column, 96px apart
   (lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-x-24). Two paragraphs of equal
   weight split in halves at the same 96px gap. Only graphics that need the
   room (the artifact strip, the film, the graph-paper band) leave it. */

/** Same ink and rhythm as <DashRule>, stood on end. */
const DASH_V =
  "repeating-linear-gradient(to bottom, rgba(23,23,23,0.16) 0px, rgba(23,23,23,0.16) 10px, transparent 10px, transparent 18px)";

/** A dashed upright inside a ruled table. Desktop only, like the rules. */
function VRule({ left, className = "inset-y-0" }: { left: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute hidden w-px lg:block ${className}`}
      style={{ left, backgroundImage: DASH_V }}
    />
  );
}

/** The two gaps the research found, each drawn by the workshop's own hand.
 *  Sizes are the redraw's, so the three keep their relative scale. */
const GAPS = [
  {
    src: "/case/draw-the-line/research/sensing.svg",
    w: 241,
    h: 89,
    alt: "One figure pointing and jeering at another while a third looks on, startled",
    caption: "“That’s not fair.”",
    mark: "They already had this.",
  },
  {
    src: "/case/draw-the-line/research/weight.svg",
    w: 212,
    h: 144,
    alt: "A figure standing under a rain cloud while a second figure looks on, puzzled",
    caption: "“What does it do to them?”",
    mark: "Missing.",
  },
  {
    src: "/case/draw-the-line/research/response.svg",
    w: 177,
    h: 133,
    alt: "A small figure sitting on top of a large, blank speech bubble",
    caption: "“What do I say?”",
    mark: "Missing.",
  },
] as const;

/** The drawings that stand over the three outcome numbers, with their export
 *  boxes. Sizes are the artboards, used only for the intrinsic ratio. */
const HANDS = [
  { src: "/case/draw-the-line/hands/hand-1.svg", w: 178, h: 641 },
  { src: "/case/draw-the-line/hands/hand-2.svg", w: 188, h: 563 },
  { src: "/case/draw-the-line/hands/hand-3.svg", w: 206, h: 631 },
] as const;
const ADMITTED = [{ src: "/case/draw-the-line/hands/admitted.svg", w: 117, h: 131 }] as const;
const UNDERSTOOD = [{ src: "/case/draw-the-line/hands/understood.svg", w: 53, h: 56 }] as const;

const OUTCOMES = [
  {
    value: "30+",
    label: "Raised a hand to respond when asked, by Day 2",
    art: <BoiledArt id="hands" art={HANDS} height={110} />,
  },
  {
    value: "14 of 33",
    label: "Admitted, in our conversations, they had bullied someone",
    art: <BoiledArt id="admitted" art={ADMITTED} height={96} />,
  },
  {
    value: "31 of 33",
    label: "Said they understood what bullying feels like for the person on the other side",
    art: <BoiledArt id="understood" art={UNDERSTOOD} height={80} />,
  },
] as const;

const LIMITS = [
  "Short, light scenes",
  "Roles went to volunteers",
  "Nobody played themselves",
  "Anything personal went into a sealed box, opened the next day",
] as const;

export default function DrawTheLineCaseStudy() {
  return (
    <>
      <CaseHero
        eyebrow="Going to School · Two-day school workshop · Ran 2025"
        title="DRAW THE LINE"
        dek="The students could already name bullying. What they lacked was a feel for how much it hurts, and a response ready for the moment. The two days were built around those two gaps."
        dekTone="ink"
        dekWidth={600}
        titleMarks
        frameLabel="Students walking down a school corridor, under the Draw the Line identity"
        // Titan's two-layer tilt: the corridor as the plate, the near-black
        // logo floating above it on the depth axis. The logo export is a
        // 1208px square with its own margin, so the artboard is set to land it
        // at 40% of the frame, the same share Titan's wordmark takes.
        image={{ src: "/case/draw-the-line/hero-bg.png", ratio: 1469 / 829, objectPosition: "center" }}
        lockup={{ src: "/case/draw-the-line/hero-lockup.png", width: 1208, height: 1208, artboard: 3020 }}
      />

      {/* ── CONTEXT ─────────────────────────────────────────────────────────
          A spread: the claim on the left, the facts it rests on across from
          it, then the room itself. No kicker; it is the first thing after the
          hero. */}
      <div className="page-container pt-24 sm:pt-32">
        <section className="w-full">
          <div className="grid grid-cols-1 items-start gap-y-6 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-x-24">
            <h2 className="font-display text-ink-alt" style={H27}>
              The bullying reaching these students happens in person, in front of everyone.
            </h2>
            <Body className="lg:mt-1">
              Childline India has cited that roughly two-thirds of schoolchildren report having
              faced bullying. We ran this with Going to School, an NGO that runs programmes in
              government schools: 33 students, Grades 8 to 10, one room, two days.
            </Body>
          </div>

          <div className="mt-16 sm:mt-24">
            <Figure
              label="The classroom as we found it: 33 students, one mixed Grade 8 to 10 cohort"
              ratio={915 / 475}
              maxWidth={1152}
              visual={
                <Image
                  src="/case/draw-the-line/classroom.webp"
                  alt="Students at desks in a government-school classroom, watching something at the front of the room"
                  fill
                  sizes="(max-width: 1280px) 100vw, 1152px"
                  className="object-cover"
                />
              }
            />
          </div>
        </section>
      </div>

      {/* ── RESEARCH ────────────────────────────────────────────────────────
          The finding in two tones: what they had in ink, what they lacked in
          gold. Then the same finding drawn, on a band of graph paper: the
          instinct, then the two things missing. */}
      <div className="page-container pt-28 sm:pt-36">
        <section className="w-full">
          <CaseKicker>Research</CaseKicker>
          <div className="mt-10 grid grid-cols-1 items-start gap-y-6 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-x-24">
            <h2 className="font-display text-ink-alt max-w-[580px]" style={H36}>
              They could already tell something was unfair.{" "}
              <span className="font-medium text-[#bd9400]">
                They couldn&rsquo;t name what it did, or what to do about it.
              </span>
            </h2>
            <Body className="lg:mt-3">
              To learn where students already stood, we held open conversations, not a survey,
              with seven students, three parents and two teachers, and read the research on
              school bullying.
            </Body>
          </div>
        </section>
      </div>

      <GraphPaper label="What the research found" className="mt-12 sm:mt-14">
        <div className="page-container">
          <BoilDefs id="research" count={GAPS.length} scale={2} />
          <h3 className="mb-14 font-display text-ink" style={H19}>
            <span className="font-light">The instinct was there.</span>{" "}
            <span className="font-medium">The weight and the words weren&rsquo;t.</span>
          </h3>
          <div className="mx-auto grid max-w-[1152px] grid-cols-1 items-start gap-y-12 sm:grid-cols-3 sm:gap-x-10 lg:gap-x-20">
            {GAPS.map((g, i) => (
              <figure key={g.src} className="flex flex-col items-center">
                {/* One shared bed, the drawings standing on one floor. The flat scene
                    fills its column's width; the taller two fill the bed's
                    height, so all three carry about the same weight. */}
                <div className="flex h-[190px] w-full items-end justify-center sm:h-[210px]">
                  <Image
                    src={g.src}
                    alt={g.alt}
                    width={g.w}
                    height={g.h}
                    unoptimized
                    className="h-auto w-auto"
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      ...(g.h / g.w < 0.5 ? { width: "min(100%, 290px)" } : { height: "100%" }),
                      filter: `url(#boil-research-${i})`,
                    }}
                  />
                </div>
                <figcaption className="mt-4 flex h-[24px] items-center justify-center font-display text-[0.875rem] font-light text-ink">
                  {g.caption}&nbsp;
                  {i === 0 ? (
                    <span className="font-medium text-[#0009ff]">{g.mark}</span>
                  ) : (
                    <Highlight><span className="font-semibold">{g.mark}</span></Highlight>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mx-auto mt-12 max-w-[720px] text-center text-balance font-display text-[0.9375rem] font-light leading-[1.6] text-ink">
            So we didn&rsquo;t design to teach definitions. We designed to carry that existing
            instinct into an understanding of the harm, and to put a response in their hands.
          </p>
        </div>
      </GraphPaper>

      {/* ── WHAT WE MADE ────────────────────────────────────────────────────
          The page's first colour: the heading scrubs in violet as the reader
          reaches it. Then the four artifacts as a strip of cards that slides
          sideways as the page scrolls. */}
      <div className="page-container pt-28 sm:pt-36">
        <section className="w-full">
          <CaseKicker>What we made</CaseKicker>
          <div className="mt-10 grid grid-cols-1 items-start gap-y-6 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-x-24">
            <ScrubText
              text="Four artifacts, each one putting students inside a bullying moment."
              on="#6a00ff"
              off="#c1c1c1"
              className="font-display max-w-[600px] text-balance"
              style={H36}
            />
            <Body className="lg:mt-3">
              Roles were taken by volunteers. The point wasn&rsquo;t a harsh re-enactment: it
              was to show how changing your response changes how much the other person can
              actually do.
            </Body>
          </div>
        </section>
      </div>

      <div className="pt-14 sm:pt-16">
        <ArtifactScroll />
      </div>
      {/* The section closes on one paragraph and the line under it. */}
      <div className="page-container pt-12 sm:pt-14">
        <div className="mx-auto max-w-[640px]">
          <p className="prose-justified prose-justified--center" style={LEAD}>
            Every activity casts a student into a role, as the bystander, the target, or the one
            who acted, so the feeling is theirs more than it being described. Day 1 carries the
            instinct into understanding; Day 2 turns it into a rehearsed response. A fifth
            instrument, an anonymous sealed box, sat alongside these for research and
            safeguarding.
          </p>
          <p className="type-caption-prose mt-5 text-center text-[#656565]">
            The judgment in them is the real output of this project.
          </p>
        </div>
      </div>

      {/* ── MOMENT 1 · EVERY ROLE ───────────────────────────────────────────
          Opens centred: the claim, with the three decisions under it as its
          subheader. Then the room on the left and the kicker, answer and
          detail on the right, then the evidence that most programmes move
          stepping in and leave empathy flat. */}
      <div className="page-container pt-20 sm:pt-24">
        <section className="w-full">
          <div className="text-center">
            <h2 className="font-display text-ink-alt text-balance" style={{ ...H36, lineHeight: 1.25 }}>
              Most sessions tell students what bullying is.{" "}
              <br className="hidden lg:block" />
              We had them stand in every role instead.
            </h2>
            <p
              className="mx-auto mt-5 max-w-[600px] text-balance font-display"
              style={{ fontSize: "0.9375rem", lineHeight: 1.6, color: "#656565" }}
            >
              Three decisions shaped the activities: every student played every role, a matching
              game got a silent room moving, and students were given words, not a menu.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 items-start gap-y-8 sm:mt-20 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-x-24">
            {/* A frame from the documentation film at 0:53, cropped to the
                slot and clear of the film's burned-in subtitle. */}
            <Figure
              label="Students mid-scene, in role"
              ratio={480 / 380}
              maxWidth={700}
              visual={
                <Image
                  src="/case/draw-the-line/in-role.webp"
                  alt="Students in their classroom mid-activity, one with both arms raised and cheering while the others laugh"
                  fill
                  sizes="(min-width: 1024px) 640px, 92vw"
                  className="object-cover"
                />
              }
            />
            <div>
              <CaseKicker>Moment 1</CaseKicker>
              <h3 className="font-display text-ink-alt mt-8" style={H24}>
                So we cast students into every side of it: the one watching, the one targeted,
                and the one doing it.
              </h3>
              <Small justify className="mt-6 text-[#656565]">
                Most sessions cover the types of bullying, a zero-tolerance rule and a pledge to
                be an upstander. Students already knew the rules. Being inside the situation is
                what made them think.
              </Small>
            </div>
          </div>

          {/* The evidence, as a pair set on one grid: a label, a 150px stage
              with its graphic standing on the stage floor, a rule, and the
              source under it. Hawkins, Pepler & Craig (2001). */}
          <div className="mt-20 grid grid-cols-1 gap-y-14 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-x-24">
            <div>
              <p className="font-display text-ink" style={H19}>
                Bullying that happens with other students watching
              </p>
              <div className="mt-6 flex h-[150px] items-end pb-4">
                {/* In the Research section's gold, the colour of what the
                    students lacked. Space Grotesk stops at 300, so a white
                    stroke pares the strokes thinner still; the page is white
                    here, so the stroke never shows as a stroke. */}
                <p
                  className="font-display text-[#bd9400]"
                  style={{
                    fontSize: "clamp(4.5rem, 3rem + 4vw, 6.5rem)",
                    lineHeight: 0.8,
                    letterSpacing: "-0.04em",
                    fontWeight: 300,
                    WebkitTextStroke: "2px #fff",
                    paintOrder: "normal",
                  }}
                >
                  88%
                </p>
              </div>
              {/* No rule under the number: it is a figure, not a plot, and
                  needs no baseline. The 1px spacer keeps its caption level
                  with the chart's. */}
              <div className="h-px" />
              <p className="type-caption-prose text-[#656565] mt-3">
                Across 306 bullying episodes filmed on school playgrounds.
              </p>
            </div>
            <div>
              <p className="font-display text-ink" style={H19}>What those watching did</p>
              {/* Two bars, deliberately not one chart: 19% is a share of all
                  episodes, 57% a share of interventions only. Separate tracks
                  and the grey bases under each keep a reader from comparing
                  them as if they shared one. */}
              <div className="mt-6 flex h-[150px] flex-col justify-end gap-6 pb-4">
                {(
                  [
                    { title: "Stepped in", value: 19, base: "of episodes", fill: "#171717" },
                    { title: "When they did, it worked", value: 57, base: "of interventions", fill: "#0009ff" },
                  ] as const
                ).map((b) => (
                  <div key={b.title}>
                    <div className="flex items-baseline justify-between gap-4 font-display text-[0.9375rem] leading-[1.4]">
                      <span className="text-ink">{b.title}</span>
                      <span className="font-medium tabular-nums" style={{ color: b.fill }}>
                        {b.value}%
                      </span>
                    </div>
                    <div
                      className="relative mt-2 h-[8px] w-full overflow-hidden rounded-full bg-[#e6e6e6]"
                      role="img"
                      aria-label={`${b.value}% ${b.base}`}
                    >
                      <div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{ width: `${b.value}%`, background: b.fill }}
                      />
                    </div>
                    <p className="type-caption mt-1.5 text-[#737373]">{b.base}</p>
                  </div>
                ))}
              </div>
              <div className="h-px bg-[#cdcdcd]" />
              <p className="type-caption-prose text-[#656565] mt-3">
                Hawkins, Pepler &amp; Craig (2001), Social Development. Toronto, Grades 1 to 6.
              </p>
            </div>
          </div>

          <div className="mt-20">
            <p className="type-caption uppercase tracking-[0.04em] text-[#737373]">
              The limits we held to
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
              {LIMITS.map((l) => (
                <li
                  key={l}
                  className="font-display text-ink max-w-[232px] text-[1rem] font-medium leading-[1.35]"
                >
                  {l}
                </li>
              ))}
            </ul>
            <Small className="mt-8 text-[#656565]">
              The cost: only volunteers took roles, so part of the room watched each scene from
              the audience.
            </Small>
          </div>
        </section>
      </div>

      {/* ── MOMENT 2 · THE MATCHING GAME ────────────────────────────────────
          The claim and its account, then the two cards. */}
      <div className="page-container pt-32 sm:pt-40">
        <section className="w-full">
          {/* No picture of its own: the two cards below carry it. Claim on the
              left, the account on the right, the way Moment 3 sits. */}
          <div className="grid grid-cols-1 items-start gap-y-6 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-x-24">
            <div>
              <CaseKicker>Moment 2</CaseKicker>
              <h2 className="font-display text-ink-alt mt-8 max-w-[440px]" style={H24}>
                We put a card in each student&rsquo;s hand, so the room had to come forward
                instead of raise it.
              </h2>
            </div>
            <div className="lg:mt-[58px]">
              <Small justify className="text-[#3d3d3d]">
                Asked on Day 1 how they would respond, no one raised a hand. So the next game
                handed the answers out: comic-panel situations to half the class, written
                responses to the other half, paired up by walking to the front. A frightening
                open question becomes a low-risk matching task, and the room is on its feet
                before anyone has to be brave.
              </Small>
              <Small justify className="text-[#3d3d3d] mt-3">
                The cost: a matched answer is a handed answer. It shows a student can recognise a
                good response, not produce one cold. The next game was built to close that gap.
              </Small>
            </div>
          </div>
        </section>
      </div>

      {/* Moment 2's cards: the situation and the response matched to it. */}
      <div className="page-container pt-24 sm:pt-28">
        <section aria-label="The two halves of the matching game">
          <p className="type-caption text-center uppercase tracking-[0.04em] text-[#737373]">
            The two halves of the matching game
          </p>
          <div className="mt-4">
            <div className="relative w-full">
              <DashRule edge="top" />
              <DashRule edge="bottom" />
              <VRule left="0" />
              <VRule left="100%" />
              <div className="relative grid grid-cols-1 gap-y-10 py-6 sm:grid-cols-2 sm:gap-x-[52px] sm:gap-y-0 lg:py-0">
                {(
                  [
                    {
                      side: "scene",
                      label: "A — The situation",
                      verdict: "A comic panel of a bullying moment, handed to half the class.",
                    },
                    {
                      side: "response",
                      label: "B — The response",
                      verdict:
                        "A written reply, handed to the other half. Each student walks up to find the card that answers theirs.",
                    },
                  ] as const
                ).map((o, i) => (
                  <article key={o.side} className="relative flex flex-col">
                    {/* The image row, ruled off from the label row below. */}
                    <div className="relative p-[10px]">
                      <VRule left="0" />
                      <VRule left="100%" />
                      {/* The brackets mark the cell itself, sitting on the
                          dashed rules; the picture is inset 10px inside them. */}
                      <FrameCorners />
                      <div className="relative">
                        <GrowOnView className="case-figure relative block">
                          <div className="relative w-full overflow-hidden rounded-[3px] bg-[#d9d9d9]" style={{ aspectRatio: "351 / 217" }}>
                            <ScenarioCycle side={o.side} />
                          </div>
                        </GrowOnView>
                      </div>
                      {/* The rule between the picture row and the verdicts,
                          drawn once and run off both sides of the screen. */}
                      {i === 0 ? (
                        <DashRule edge="bottom" style={{ left: "-100vw", right: "-100vw" }} />
                      ) : null}
                    </div>
                    <div className="relative px-2 pt-5 text-center lg:pb-6">
                      {/* The verdicts share one rule, down the middle of the
                          gap, running the label row's full height. */}
                      {i === 1 ? <VRule left="-26px" /> : null}
                      <h3 className="font-display text-ink text-[1.125rem] font-medium uppercase leading-[1.45] tracking-[0.01em]">
                        {o.label}
                      </h3>
                      <p className="type-caption-prose mx-auto mt-2 max-w-[320px] text-balance text-[#656565]">
                        {o.verdict}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

        </section>
      </div>

      {/* ── MOMENT 3 · THE WORD-CARD GAME ───────────────────────────────────
          Back on the left. One round of the game as a numbered rail, then the
          version we rejected beside the one we chose, in a ruled table. */}
      <div className="page-container pt-32 sm:pt-40">
        <section className="w-full">
          <div className="grid grid-cols-1 items-start gap-y-6 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-x-24">
            <div>
              <CaseKicker>Moment 3</CaseKicker>
              <h2 className="font-display text-ink-alt mt-8 max-w-[440px]" style={H24}>
                The word-card game moves students from picking a response to saying one in their
                own mouth.
              </h2>
            </div>
            <div className="flex flex-col gap-3 lg:mt-[58px]">
              <Small justify className="text-[#3d3d3d]">
                Facilitators freeze a scene; each group rearranges a set of word cards into a
                twelve-to-fifteen word response, rings a bell, and acts it out. There is no menu
                to point at.
              </Small>
              <Small justify className="text-[#3d3d3d]">
                The words are given, but the sentence has to be assembled and then spoken, which
                is a deliberate middle step between choosing an answer and inventing one from
                nothing.
              </Small>
            </div>
          </div>
        </section>
      </div>

      <div className="page-container pt-16 sm:pt-20">
        <BystanderFlow />
      </div>

      {/* What a group held: the packet, and the cards dealt into the
          sentence quoted just below. Full bleed, closing the rail's row. */}
      <div className="pt-12">
        <WordCardKit />
      </div>

      <div className="page-container pt-28 sm:pt-36">
        <section aria-label="A sentence built from the word cards">
          {/* Three tiers: what it is (label), the sentence itself (display),
              what it means (translation). The label leads so the Hindi is
              read as the students' words, not the page's. */}
          <figure className="mx-auto max-w-[760px] text-center">
            <p className="type-caption uppercase tracking-[0.08em] text-[#737373]">
              Built by one group, from the word cards
            </p>
            <blockquote lang="hi-Latn" className="mt-5 font-display text-balance text-ink" style={H27}>
              &ldquo;Kisi aur ka rang dekh kar aisa behave karna bilkul sahi nahi hai.&rdquo;
            </blockquote>
            <figcaption
              className="mx-auto mt-4 max-w-[560px] text-balance font-display font-light text-[#656565]"
              style={{ fontSize: "0.9375rem", lineHeight: 1.6 }}
            >
              Treating someone differently because of their skin colour is not okay at all.
            </figcaption>
          </figure>
        </section>
      </div>

      {/* ── THE FILM ────────────────────────────────────────────────────────
          Full bleed: the two days end to end. */}
      <section aria-label="The two days, as they actually ran" className="pt-28 sm:pt-36">
        <h2 className="font-display mx-auto px-5 text-center text-[#222]" style={H19}>
          The two days, as they actually ran
        </h2>
        <div className="mt-6">
          <CaseYouTube
            id="iF7S1nw-4GY"
            title="Draw the Line — two-day anti-bullying workshop documentation"
            poster="/case/draw-the-line/card.webp"
            posterAlt="The Draw the Line identity over a school corridor"
          />
        </div>
      </section>

      {/* ── OUTCOMES ────────────────────────────────────────────────────────
          The page's second colour, scrubbed in like the first. Three figures,
          each under its own drawing, then the two stories behind them. */}
      <div className="page-container pt-28 sm:pt-36">
        <section className="w-full">
          <CaseKicker>Outcomes</CaseKicker>
          <div className="mt-10 grid grid-cols-1 items-start gap-y-6 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-x-24">
            <ScrubText
              text="The direction was unmistakable in the room, even if two days can’t prove it lasts."
              on="#441aff"
              off="#c1c1c1"
              className="font-display max-w-[580px]"
              style={H36}
            />
            <Body className="lg:mt-3">
              Measured by facilitator-led conversation and a show of hands over the two days,
              plus individual and small-group conversations afterwards.
            </Body>
          </div>

          <ul className="mt-20 grid grid-cols-1 gap-y-14 sm:grid-cols-3 sm:gap-x-8">
            {OUTCOMES.map((o) => (
              <li key={o.value} className="flex flex-col">
                <div className="flex h-[110px] items-end">{o.art}</div>
                <p className="type-display text-ink-hero mt-8">{o.value}</p>
                <p className="type-caption-prose mt-4 max-w-[270px] text-[#656565]">
                  {o.label}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-20 grid grid-cols-1 gap-y-6 lg:grid-cols-2 lg:gap-x-24">
            <Small justify className="text-[#3d3d3d]">
              On Day 1, <b className="font-medium text-ink">no hands went up</b>. By Day 2, after building and voicing responses in the
              game, <b className="font-medium text-ink">more than thirty of the thirty-three did</b>. By the end, around thirty-one said
              some version of &ldquo;now I know what this feels like, and what it does to the
              other person&rdquo;. Not the definition of bullying, but <b className="font-medium text-ink">its weight</b>.
            </Small>
            <Small justify className="text-[#3d3d3d]">
              The one that stayed with me came later, in smaller conversations after class.{" "}
              <b className="font-medium text-ink">Fourteen students</b>, talking through situations they&rsquo;d been in, told me they{" "}
              <b className="font-medium text-ink">had bullied someone</b>, and hadn&rsquo;t understood until now that it was wrong, or
              how it landed. No names, nothing traceable. It came from a real conversation, not a raised hand,
              which is why it counts.
            </Small>
          </div>
        </section>

        <figure className="mx-auto mt-24 max-w-[800px] text-center">
          <p className="mx-auto max-w-[760px] text-balance font-display text-[0.9375rem] leading-[1.6] text-[#656565]">
            And one student made the point better than any figure could. After the workshop we
            gave the class an open classroom to come and say anything they liked, with no
            judgement.
          </p>
          <blockquote className="font-display text-ink mt-8 text-balance" style={H27}>
            &ldquo;I didn&rsquo;t even know there were types of bullying. I wondered to myself,
            have I ever bullied someone unknowingly?&rdquo;
          </blockquote>
        </figure>
      </div>

      {/* ── WHAT WE LEFT BEHIND ─────────────────────────────────────────────
          Words on the left, the kit on the right. */}
      <div className="page-container pt-32 sm:pt-40">
        <section className="grid w-full grid-cols-1 items-start gap-y-10 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-x-24">
          <div>
            <CaseKicker>What we left behind</CaseKicker>
            <h2 className="font-display text-ink-alt mt-8" style={H24}>
              The workshop outlives the two days as a kit the NGO can run again.
            </h2>
            <Small className="text-[#3d3d3d] mt-6">
              The whole workshop, its activities and every asset now sit with Going to School as
              a blueprint they can take into other schools: a ready starting point for helping
              students understand what bullying is, why it&rsquo;s wrong, and how to respond. It
              did what it was built to do: get a design running in a room, then hand it on.
            </Small>
          </div>
          <Figure
            label="The blueprint and asset kit left with the NGO"
            ratio={652 / 367}
            maxWidth={504}
            visual={
              <Image
                src="/case/draw-the-line/packet-dieline.webp"
                alt="The dieline for one round's sealed packet of the bystander game, laid out flat with its fold lines"
                fill
                sizes="(max-width: 504px) 100vw, 504px"
                className="object-cover"
              />
            }
          />
        </section>
      </div>

      {/* ── REFLECTION ──────────────────────────────────────────────────────
          The claim across the page, then what is missing and what I would do
          next, side by side. */}
      <div className="page-container pt-32 sm:pt-40">
        <section className="w-full">
          <CaseKicker>Reflection</CaseKicker>
          <h2 className="font-display text-ink-alt mt-10 max-w-[1000px] text-balance" style={H36}>
            The design landed in the room and travels to new ones;{" "}
            <br className="hidden lg:block" />
            keeping it alive in one classroom is the harder problem.
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-y-6 lg:grid-cols-2 lg:gap-x-24">
            <Small className="text-[#3d3d3d]">
              The handover exists, but it points outward, to the next school, not inward to these
              thirty-three. Nothing was left embedded in this classroom to keep the shift alive:
              no teacher brief for their teachers, no student group among the cohort, and a
              two-day peak won&rsquo;t survive an unchanged room on its own.
            </Small>
            <Small className="text-[#3d3d3d]">
              Next time I would leave something small and self-sustaining with the cohort too,
              and follow up a month later so there is at least one measurement taken cold, built
              in from the first day instead of the last. What I&rsquo;m most confident travelled
              is the set of decisions behind the numbers: carrying an existing instinct into
              understanding rather than teaching definitions, scaffolding the response instead
              of handing out a menu, and protecting what students trusted us with.
            </Small>
          </div>
        </section>
      </div>

      <div className="page-container pt-24 pb-32 sm:pt-32">
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
      </div>
    </>
  );
}
