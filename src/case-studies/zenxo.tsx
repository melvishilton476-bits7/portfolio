import Image from "next/image";
import CaseHero from "@/components/case/CaseHero";
import Beat, { P } from "@/components/case/Beat";
import Callout from "@/components/case/Callout";
import CaseOverview from "@/components/case/CaseOverview";
import CaseKicker from "@/components/case/CaseKicker";
import DashRule from "@/components/DashRule";
import GrowOnView from "@/components/GrowOnView";
import Highlight from "@/components/case/Highlight";
import ScrubText from "@/components/case/ScrubText";
import ZenxoFeatures from "@/components/case/ZenxoFeatures";
import RevealVideo from "@/components/case/RevealVideo";
import ZenxoFunnel from "@/components/case/ZenxoFunnel";
import ZenxoDirection, {
  DirectionBoilDefs,
  DIRECTION_RATIO,
} from "@/components/case/ZenxoDirection";
import { Figure } from "@/components/case/Figure";
import ScrollStrip from "@/components/case/ScrollStrip";
import ZenxoResultsPan, { RESULTS_RATIO } from "@/components/case/ZenxoResultsPan";
import ZenxoCardShot, { CARD_RATIO } from "@/components/case/ZenxoCardShot";
import CaseVideo, { cropRatio } from "@/components/case/CaseVideo";
import ZenxoPreRunCard, { PRE_RUN_RATIO } from "@/components/case/ZenxoPreRunCard";
import ZenxoRunningCard, { RUNNING_RATIO } from "@/components/case/ZenxoRunningCard";

/**
 * ZENXO — a strategy builder for Indian retail options traders.
 *
 * Laid out from the Figma redraw (MY_PORTFOLIO, node 765:563) rather than from
 * the shared one-column rhythm the other case studies use. The page argues the
 * same thing it did before; what changed is that the layout now does some of
 * the arguing:
 *
 *   - The sections do not share an axis. Context opens as a two-column spread,
 *     Moment 1 and 3 hang off the left margin, Moment 2 answers from the
 *     right. A reader crossing the page is crossing between decisions.
 *   - Two headings are SCRUBBED — they fill in character by character as the
 *     reader scrolls to them — and they are the two sentences the rest of the
 *     page exists to prove: what the product is, and what the results page
 *     became.
 *   - The yellow highlighter is spent only on conclusions: the thesis, the
 *     interview finding, the direction that shipped, the card that won.
 *   - Comparisons live in ruled tables — full-bleed dashed hairlines with a
 *     dashed divider standing between the options — so a set of alternatives
 *     reads as one object laid out for inspection, not as figures in a column.
 *   - Scale contrast carries emphasis instead of weight: a 9px aside sits on
 *     top of the line it leads into, a grey lead-in hands over to the quote
 *     it opens.
 *
 * Copy follows the v3 write-up (zenxo-case-study3.md). Where the redraw set a
 * heading of its own — Moment 1's quote, Moment 2 and 3's headings — the
 * redraw's wording wins, since it was written against this layout. Outcomes,
 * Reflection and the credits are unchanged from the previous build.
 *
 * Unlike the other case studies, this one was team work at a company. The
 * prose keeps that distinction visible — "we" for the team's decisions, "I"
 * only where the work was actually mine — because a portfolio that blurs the
 * two is claiming credit it can't support.
 */

/** The app's own UI inside the Zenbot recording, in the source's own pixels.
 *
 *  Cropped past three things that belong to the capture rather than the
 *  product, all measured off the frames rather than guessed:
 *
 *    - the burned-in caption, a text band at y 837-867 on every frame sampled
 *      across the clip;
 *    - the macOS window chrome, y 27-85, ending at a divider at 86-89;
 *    - the window's rounded corners. The top radius runs y 25 to ~44 and the
 *      bottom ~791 to 806, so cropping to y 90-789 starts and ends on
 *      straight edge. All four corners of this rectangle land on app content
 *      at every timestamp checked, with no white notch.
 *
 *  Trimmed 72px in from each side as well, so the frame is 2:1 rather than
 *  2.2:1 and sits closer in shape to the other three.
 */
const ZENBOT_CROP = { x: 100, y: 90, w: 1400, h: 700, sw: 1600, sh: 900 } as const;

/** The results recording, cut below the app's header bar: the header carries
 *  the signed-in account's email. */
const RESULTS_CROP = { x: 0, y: 64, w: 1920, h: 1002, sw: 1920, sh: 1066 } as const;

/** The recording cards' edge: a wide white stroke at low opacity, so the
 *  ground shows through it and it reads as a glass rim. */
const RIM = "0 0 0 6px rgba(255,255,255,0.45), 0 24px 60px -28px rgba(23,23,23,0.35)";

/** The redraw's 19px text line (Figma 819:719, 794:641), at the page's
 *  regular heading weight. */
const FIGMA_19: React.CSSProperties = {
  fontSize: "1.1875rem",
  lineHeight: 1.45,
  letterSpacing: "-0.5px",
};

/** Same ink and rhythm as <DashRule>, stood on end. */
const DASH_V =
  "repeating-linear-gradient(to bottom, rgba(23,23,23,0.16) 0px, rgba(23,23,23,0.16) 10px, transparent 10px, transparent 18px)";

/** The heading voice of the redraw: Space Grotesk at the subheading size,
 *  regular weight like the site's section heads but set looser, because these
 *  run to two and three lines where a section head runs to one. */
const HEAD: React.CSSProperties = {
  fontWeight: 400,
  lineHeight: 1.3,
  letterSpacing: "-0.02em",
};

/** Running copy for the two-column spreads — light, justified, a size under
 *  the lead so a column 400px wide still sets 60-odd characters a line. */
function Body({
  children,
  className = "",
  justify = true,
}: {
  children: React.ReactNode;
  className?: string;
  /** Off where the column is ragged-right or right-aligned on purpose. */
  justify?: boolean;
}) {
  return (
    <p
      className={`${justify ? "prose-justified" : ""} text-pretty ${className}`}
      style={{ fontSize: "0.9375rem", lineHeight: 1.6, fontWeight: 300, color: "var(--color-ink)" }}
    >
      {children}
    </p>
  );
}

/** A dashed divider standing between two cells of a ruled table. Desktop
 *  only, like the horizontal rules it meets — below lg the cells stack and
 *  there is nothing to stand between. */
function VRule({ left }: { left: string }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 hidden w-px lg:block"
      style={{ left, backgroundImage: DASH_V }}
    />
  );
}

/** The two dividers of the directions table, at exact thirds: the columns
 *  have no gap and pad themselves instead, so all three cells are the same
 *  width. Shared by the dividers and the dots so a dot always lands on its
 *  line. No edge dividers: the outer sides stay open. */
const TABLE_X = ["calc(100% / 3)", "calc(200% / 3)"] as const;

/** A black dot at every place a vertical divider meets the top or bottom rule —
 *  the registration marks the redraw drops on the table's corners and joints.
 *  Desktop only, like the rules they sit on. */
function RuleDots() {
  return (
    <>
      {TABLE_X.map((x) =>
        (["top", "bottom"] as const).map((edge) => (
          <span
            key={`${x}-${edge}`}
            aria-hidden
            className="pointer-events-none absolute z-10 hidden size-[5px] rounded-full bg-[#171717] lg:block"
            style={{ left: x, [edge]: 0, transform: `translate(-50%, ${edge === "top" ? "-50%" : "50%"})` }}
          />
        )),
      )}
    </>
  );
}

/** Rules that sit low in a tall section draw too late with DashRule's default
 *  -18% bottom margin — the trigger line lands high up the viewport, so the
 *  rule is well on screen before it fires. These fire as soon as the rule
 *  crosses into the bottom of the viewport instead. */
const EAGER = { threshold: 0, rootMargin: "0px 0px 12% 0px" } as const;

/** Two full-bleed hairlines 27px apart — the heavier edge a ruled table gets
 *  where it opens and closes. */
function DoubleRule() {
  return (
    <div aria-hidden className="relative hidden h-[27px] lg:block">
      <DashRule edge="top" {...EAGER} />
      <DashRule edge="bottom" {...EAGER} />
    </div>
  );
}

/** A black registration dot centred on a horizontal edge of a relative box —
 *  used where the card table's single divider meets its inner rules. */
function EdgeDot({ left, edge }: { left: string; edge: "top" | "bottom" }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute z-10 hidden size-[5px] rounded-full bg-[#171717] lg:block"
      style={{ left, [edge]: 0, transform: `translate(-50%, ${edge === "top" ? "-50%" : "50%"})` }}
    />
  );
}

/** The question the three directions answered, on a ruled orange card.
 *
 *  The rules are the paragraph's own background, repeating at its line height,
 *  so the words sit on them at any width and the card grows a line rather than
 *  spilling off its last rule. */
const DIRECTIONS = [
  {
    label: "A — Editor only",
    src: "/case/zenxo/directions/editor-only.svg",
    alt: "Wireframe of the editor-only direction: a single full-width form column of stacked, grouped fields with a step header across the top and no canvas anywhere in the frame",
    good: "Cleanest and most familiar, a real step up from the 9-section form.",
    costLabel: "Why it didn’t ship:",
    cost: "Still couldn’t show a rule shared across legs. It listed the capability, never the relationship.",
  },
  {
    label: "B — Canvas-led",
    src: "/case/zenxo/directions/canvas-led.svg",
    alt: "Wireframe of the canvas-led direction: a full-frame dot-grid canvas carrying the strategy as connected nodes, with the form reduced to a secondary panel",
    good: "The most honest model, since a strategy really is a graph.",
    costLabel: "Why it didn’t ship:",
    cost: "Asks a first-time trader to learn a node editor before placing a single order.",
  },
  {
    label: "C — Editor + live canvas",
    src: "/case/zenxo/directions/editor-led.svg",
    alt: "Wireframe of the shipped direction: the form as a narrow left column with the dot-grid canvas filling the rest of the frame beside it, both showing the same strategy",
    good: "Traders start in the form they know; the canvas mirrors it live, so they learn to read it without being taught.",
    costLabel: "Cost:",
    cost: "A narrower form column and a much harder build (two surfaces kept in sync).",
    shipped: true,
  },
] as const;

export default function ZenxoCaseStudy() {
  return (
    <>
      <CaseHero
        eyebrow="Product design · Zenxo · Shipped 2026"
        title="ZENXO"
        dek="A canvas could show what a form never could. Keeping the form next to it is the reason traders actually learned it."
        dekTone="ink"
        titleMarks
        frameLabel="Two traders at a desk reading a Zenxo results dashboard — the summary, the P&L chart and the open position, all on one screen"
        // slot-01, in two layers rather than one flattened still, so the scene
        // rides above its ground on the tilt's depth axis and swings against
        // it as the frame turns. That parallax is the only reason to ship two
        // files here.
        //
        // The ground is a single flat colour — #E9E8EA across the whole
        // export. That is worth knowing, because it means there is no
        // registration to hold between the layers and no seam is possible: any
        // edge the parallax uncovers shows the same grey that was already
        // there. Only the bottom needs real care, and it gets it below.
        //
        // 17:10. The art is 2132x1348 (1.5816), so framing at 1.7 shows the
        // top 1254 rows and keeps 94 as bleed under the clip. Only the bottom
        // edge needs it: the scene runs to the very last row there, so without
        // bleed a lift would part the desk from the frame and show grey under
        // it. The other three edges are safe on their own — the top 174 rows
        // are transparent, and the sides open onto the same flat grey that is
        // already behind them.
        //
        // The margin is tightest on SMALL screens, not large ones, which is
        // the opposite of the usual worry. The parallax travel is an absolute
        // 120px * tan(4deg) = 8.39px at every size, while the bleed is 94
        // rows scaled by frame/2132 — so it shrinks as the frame does: 48px
        // at the 1100px cap, 15px at a 335px phone. Still clear of 8.39, but
        // that is the number to check if this ratio is ever narrowed.
        //
        // `fade` off: flat artwork on a light ground has no edge to dissolve,
        // and the ramp would just bleach the lower two thirds.
        image={{ src: "/case/zenxo/hero-ground.webp", ratio: 17 / 10 }}
        // Full-frame layer: the whole scene opaque, everything around it
        // transparent, on the same canvas as the ground — so `artboard` is its
        // own width. `edgeToEdge` registers it by width and top, which is what
        // parks the surplus height at the bottom where the bleed is needed.
        lockup={{
          src: "/case/zenxo/hero-scene.webp",
          width: 2132,
          height: 1348,
          artboard: 2132,
          edgeToEdge: true,
        }}
        fade={false}
      />

      {/* ── CONTEXT ─────────────────────────────────────────────────────────
          A spread rather than a column: the claim on the left, the plain
          facts it rests on across from it, then the old form between them
          and the rest of the story in two columns underneath. The heading
          and the definition of the product are read as a pair, so they sit
          as a pair. No kicker — it is the first thing after the hero, and a
          label saying "context" would only say where we are. */}
      <div className="page-container pt-24 sm:pt-32">
        <section className="mx-auto w-full max-w-[915px]">
          <div className="grid grid-cols-1 items-start gap-y-6 lg:grid-cols-2 lg:gap-x-28">
            <h2 className="type-subheading text-ink-alt max-w-[340px]" style={HEAD}>
              We fixed the form, and you still couldn&rsquo;t see your own strategy.
            </h2>
            <Body className="lg:mt-1">
              Indian retail traders build multi-leg options strategies (several buy and sell
              positions that work as one) and backtest them against years of market data before
              risking real money.
            </Body>
          </div>

          {/* The previous builder, pulled through the frame end to end. Only a
              slice of the 1:2.23 capture is ever on screen at once — which is
              the figure's argument. */}
          <div className="mt-14 sm:mt-20">
            <Figure
              label="The old nine-section form, scrolled end to end"
              ratio={915 / 475}
              maxWidth={915}
              visual={
                <ScrollStrip
                  src="/case/zenxo/old-form-strip.webp"
                  alt="The previous Zenxo builder: nine configuration sections — settings, templates, entry conditions, legs, adjustments, payoff, brokerage — stacked in a single scrolling column."
                  width={1733}
                  height={3866}
                />
              }
            />
          </div>

          <div className="mt-12 grid grid-cols-1 gap-y-8 lg:mt-14 lg:grid-cols-2 lg:gap-x-28">
            <ul className="flex list-disc flex-col gap-5 pl-4 marker:text-ink">
              <li>
                <Body>
                  A strategy is 4 or 5 &ldquo;legs.&rdquo; Each leg has its own entry, stop-loss,
                  target and re-entry rules, and some rules apply across several legs at once.
                </Body>
              </li>
              <li>
                <Body>
                  The first build put all of it into 9 form sections on one scroll: 25 controls
                  before you&rsquo;d described a single leg.
                </Body>
              </li>
              <li>
                <Body>
                  We joined a few weeks before launch, with the business unhappy about what was
                  about to ship.
                </Body>
              </li>
            </ul>
            <div className="flex flex-col gap-4">
              <Body>
                We started where you&rsquo;d expect, tightening sections and fixing hierarchy. It
                helped, but it couldn&rsquo;t touch the real problem.
              </Body>
              <Body>
                A form can only list settings. It can&rsquo;t hold a rule that belongs to three
                legs at once; that relationship turns into a checkbox that disappears the moment
                its panel closes.
              </Body>
              <Body>
                The people on our team who trade futures and options (F&amp;O) said it plainly:
                there&rsquo;s no structure here, and you can&rsquo;t see your own strategy.
              </Body>
            </div>
          </div>
        </section>
      </div>

      {/* ── SOLUTION ────────────────────────────────────────────────────────
          The heading scrubs in in the product's own orange: it is the one
          sentence on the page that says what Zenxo IS, so it is the one that
          waits for the reader to arrive. The quote that used to be the dek
          sits across from it as its gloss. */}
      {/* The Solution and the builder video share one wrapper so the video
          can sit sticky beneath it: the section is opaque and on top, and
          as it scrolls up it slides off the video, which holds still until
          it is fully uncovered and then scrolls on with the page. */}
      <div className="relative">
      {/* The cover is full width, not the text column: anything narrower
          leaves the pinned video showing down both sides. */}
      <div className="relative z-10 bg-background">
      <div className="page-container pb-16 pt-28 sm:pb-24 sm:pt-36">
        <section className="mx-auto w-full max-w-[915px]">
          <CaseKicker>Solution</CaseKicker>
          <div className="mt-10 grid grid-cols-1 items-start gap-y-6 lg:grid-cols-[minmax(0,1fr)_232px] lg:gap-x-24">
            <div className="order-1">
              <ScrubText
                text="Zenxo: a strategy builder that shows you the strategy you're building."
                on="#d07600"
                off="#c1c1c1"
                className="font-display text-balance"
                // The page's one statement of what Zenxo is, so it alone steps
                // up from the subheading size.
                style={{
                  fontSize: "clamp(1.625rem, 1.1rem + 1.6vw, 2.25rem)",
                  lineHeight: 1.35,
                  letterSpacing: "-0.05em",
                }}
              />
            </div>
            <Body justify={false} className="order-3 lg:order-2 lg:mt-3">
              A canvas could show what a form never could, and keeping the form beside it is why
              traders actually learned to read it.
            </Body>
            {/* Spans both columns, so its right edge meets the gloss's. */}
            <Body className="order-2 lg:order-3 lg:col-span-2 lg:mt-1">
              We laid the strategy out the way it runs: entries on top, legs across the middle,
              exits below. A shared rule became one node wired to every leg it governs. That
              had a useful side effect: a leg with nothing beneath it is now, visibly, a leg
              with no exit.
            </Body>
          </div>
        </section>
      </div>
      </div>

        <RevealVideo
          src="/case/zenxo/video/product-showcase.mp4?v=3"
          label="A screen recording of the Zenxo strategy builder: the form on the left is filled out — strategy settings, then session and filters — and the strategy card and diagram on the right assemble themselves to match, step by step"
        />
      </div>

      {/* The builder: the video above, then the four things you meet using it. */}
      <section aria-label="The builder">
        {/* The four things you meet using the builder: one stage, shown whole
            and one at a time, with the list beside it doing the explaining. */}
        <div className="page-container pt-6 sm:pt-8">
          <ZenxoFeatures
            features={[
              {
                title: "The affordance is the warning",
                body: <>An empty &ldquo;+ Exit&rdquo; slot is both the prompt and the alarm.</>,
                ratio: 2082 / 1442,
                hold: 10100,
                ground: "url(/case/zenxo/ground-blue.jpg) center / cover no-repeat #dbe9f8",
                visual: (
                  <Image
                    src="/case/zenxo/feature-affordance.png"
                    alt="The Zenxo builder canvas: two legs hang under the strategy card. Leg 1 has a stop loss wired beneath it; Leg 2 still shows an empty + Exit slot"
                    fill
                    sizes="(min-width: 1024px) 60vw, 82vw"
                    className="object-cover"
                  />
                ),
              },
              {
                title: "Dark by default",
                body: "The way traders actually work.",
                ratio: 1920 / 1048,
                hold: 15300,
                ground: "url(/case/zenxo/ground-orange.jpg) center / cover no-repeat #f7a531",
                visual: (
                  <CaseVideo
                    src="/case/zenxo/video/dark-mode.mp4?v=4"
                    preload="auto"
                    label="A recording of the Zenxo strategy builder switching into its dark theme: the leg editor and the canvas beside it invert, with the orange accent carrying through unchanged"
                  />
                ),
              },
              {
                title: "Zenbot",
                body: "Turns a plain sentence into wired blocks, on the canvas you were already looking at.",
                ratio: cropRatio(ZENBOT_CROP),
                hold: 11800,
                ground: "url(/case/zenxo/ground-blue.jpg) center / cover no-repeat #dbe9f8",
                visual: (
                  <CaseVideo
                    crop={ZENBOT_CROP}
                    src="/case/zenxo/video/zenbot.mp4?v=3"
                    preload="auto"
                    label="A recording of the Zenxo builder: a sentence is sent to Zenbot, and the canvas beside the form wires itself up — a strategy settings block, session and filters, a range breakout entry, then Leg 1 and Leg 2 each gaining a stop loss, a target profit, and re-entry and trail rules"
                  />
                ),
              },
              {
                title: "Session restore",
                body: "Sign in, and the strategy you left is the one you come back to.",
                ratio: 2165 / 1206,
                hold: 23700,
                ground: "url(/case/zenxo/ground-orange.jpg) center / cover no-repeat #f7a531",
                visual: (
                  <Image
                    src="/case/zenxo/feature-login.png"
                    alt="The Zenxo sign-in page: the Welcome Back panel with email and password fields beside a rendering of the builder, over a warm blurred ground"
                    fill
                    sizes="(min-width: 1024px) 60vw, 82vw"
                    className="object-cover"
                  />
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* ── MOMENT 1 · EDITOR, CANVAS, OR BOTH ──────────────────────────────
          The moment opens on its verdict, as a quote: a grey lead-in hands
          over to the sentence that matters. The question all three directions
          answered sits across from it on a note card — the brief, pinned up
          beside the outcome. */}
      <div className="page-container pt-32 sm:pt-40">
        <section>
          <CaseKicker>Moment 1</CaseKicker>
          <p className="type-caption text-ink-muted mt-10">
            &ldquo;All of this started as three separate arguments about what a strategy builder
            should even be.
          </p>
          {/* The heading on the left; on the right, a key to the table below,
              starting on the heading's first line. */}
          <div className="mt-3 grid grid-cols-1 items-start gap-y-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-x-16">
            <h2 className="type-subheading text-ink-alt max-w-[640px] text-balance" style={HEAD}>
              The one we shipped wasn&rsquo;t the most powerful of the three. It was the only
              one traders would learn.&rdquo;
            </h2>
            <div className="lg:justify-self-end lg:pt-1">
              <p className="type-caption text-ink uppercase tracking-[0.08em]">
                Exploration set — three directions, built
              </p>
              <p className="type-caption text-ink-muted mt-2">
                (Direction / what it did well / why it didn&rsquo;t ship)
              </p>
            </div>
          </div>

          <DirectionBoilDefs count={3} />
          {/* The three directions as one full-bleed ruled table. A top rule the
              thesis sits on and a bottom rule under the last line of copy carry
              the width of the viewport, with a second rule closing the thesis strip;
              dashed dividers run from that rule down in the two gutters, and a
              black dot marks every joint. The thesis is
              the brief each direction was judged against, so it heads the table
              like a column note. */}
          {/* Double rules, as in the redraw: a second rule 28px outside the
              table's own top and bottom, with the dividers running only
              between the inner pair. */}
          <div className="relative mt-14 py-[28px] lg:ml-[calc(50%-50vw)] lg:w-screen">
            <DashRule edge="top" {...EAGER} />
            <DashRule edge="bottom" {...EAGER} />
          <div className="relative">
            <DashRule edge="top" {...EAGER} />
            <DashRule edge="bottom" {...EAGER} />
            {TABLE_X.map((x) => (
              <VRule key={x} left={x} />
            ))}
            <RuleDots />
            <div className="grid grid-cols-1 gap-y-12 pb-10 pt-5 sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-3 lg:gap-x-0">
              {DIRECTIONS.map((d, i) => (
              <article key={d.label} className="flex flex-col lg:px-12 xl:px-16">
                <GrowOnView className="case-figure relative block">
                  <div
                    className="relative w-full overflow-hidden rounded-[11px] bg-white ring-1 ring-[#e6e6e6]"
                    style={{ aspectRatio: String(DIRECTION_RATIO) }}
                  >
                    <ZenxoDirection index={i} src={d.src} alt={d.alt} />
                  </div>
                </GrowOnView>
                <h3 className="type-label mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 uppercase text-ink">
                  {d.label}
                  {"shipped" in d ? (
                    <Highlight className="type-caption normal-case text-black">Shipped</Highlight>
                  ) : null}
                </h3>
                <p className="type-caption text-ink-muted mt-2 max-w-[340px] leading-[1.55]">
                  <span className="text-ink">Did well:</span> {d.good}
                </p>
                <p className="type-caption text-ink-muted mt-3 max-w-[340px] leading-[1.55]">
                  <span className="text-ink">{d.costLabel}</span> {d.cost}
                </p>
              </article>
              ))}
            </div>
          </div>
          </div>
        </section>
      </div>

      {/* ── MOMENT 2 · RANKING THE RESULTS ──────────────────────────────────
          Answered from the right. The old page sits opposite the heading as
          the thing being answered; then the page narrows to the centre for
          the finding, the path it produced, and the new page it became. */}
      <div className="page-container pt-32 sm:pt-40">
        <section>
          <div className="grid grid-cols-1 items-stretch gap-y-10 lg:grid-cols-[504px_minmax(0,1fr)] lg:gap-x-[86px]">
            <div className="order-2 lg:order-1 lg:-mt-[18px]">
              {/* The old page, read by a moving camera — at this size a still
                  of dense UI is unreadable, and the numbers ARE the argument.
                  See <ZenxoResultsPan>. */}
              <Figure
                label="Before, win rate leads"
                ratio={RESULTS_RATIO}
                maxWidth={504}
                chrome
                caption="Before: everything one size, leading with a number the trader wasn't asking for."
                visual={
                  <ZenxoResultsPan
                    src="/case/zenxo/results-before.webp"
                    alt="The old Zenxo results page: a large win rate percentage leading the summary, total net P&L set small in the top-right corner, max profit, max loss, average profit, average loss and Sharpe all at one weight, a configuration column down the right, and the cumulative P&L chart starting below the fold"
                  />
                }
              />
            </div>
            {/* Kicker and heading at the top of the image, the paragraph at its
                foot, so the text column spans the picture beside it. */}
            <div className="order-1 flex flex-col items-start lg:order-2 lg:pb-12">
              <CaseKicker>Moment 2</CaseKicker>
              <h2 className="type-subheading text-ink-alt mt-10 max-w-[560px] text-balance" style={HEAD}>
                Results need to guide what your next step is, so we built the page as a path.
              </h2>
              <Body justify={false} className="mt-8 max-w-[440px] lg:mt-auto">
                The results page had 21 panels at the same weight. Net profit sat in a tile the
                same size as the worst losing streak. But a trader opens a backtest to answer one
                question: should I run this?
              </Body>
            </div>
          </div>

          {/* The finding, with the method whispered above it: the aside at a
              third of the size of the line it leads into, so the eye lands on
              the result and only then reads how it was got. */}
          <div className="mt-20 text-center sm:mt-24">
            {/* Figma 819:719: one 19px block, 330px wide, method then finding. */}
            <p className="text-ink mx-auto max-w-[370px]" style={FIGMA_19}>
              I sat with traders one at a time.
              <br />
              Priorities differed,{" "}
              <Highlight>but the shape&nbsp;held.</Highlight>
            </p>
          </div>

          <div className="mt-8">
            <ZenxoFunnel />
          </div>

          <ScrubText
            text="And then we rewrote the same numbers, re-ranked into the order traders read them in"
            on="#171717"
            off="#959595"
            className="font-display mx-auto mt-8 max-w-[470px] text-center text-balance sm:mt-12"
            style={FIGMA_19}
          />

          {/* The redesigned results page, running: a full-bleed band of the
              blue ground with the recording floating on it as a glass-rimmed
              card, the same treatment as the feature row. */}
          <div
            className="relative mt-10 w-screen overflow-hidden px-4 py-12 sm:px-8 sm:py-16 lg:py-20"
            style={{
              marginLeft: "calc(50% - 50vw)",
              background: "url(/case/zenxo/ground-blue.jpg) center / cover no-repeat #dbe9f8",
            }}
          >
            <GrowOnView className="case-figure relative mx-auto block w-full max-w-[1120px]">
              <div
                className="relative w-full overflow-hidden rounded-[12px]"
                style={{ aspectRatio: String(cropRatio(RESULTS_CROP)), boxShadow: RIM }}
              >
                <CaseVideo
                  crop={RESULTS_CROP}
                  src="/case/zenxo/video/results-after.mp4?v=1"
                  preload="auto"
                  label="A recording of the redesigned Zenxo results page: total net P&L set large at the top right, the summary metrics and cumulative P&L chart beneath it, then the day's P&L chart with its position snapshot, the drawdown panel, and Zen's insights further down"
                />
              </div>
            </GrowOnView>
          </div>
          <p className="type-caption text-ink-muted mx-auto mt-5 max-w-[780px] text-balance text-center leading-relaxed">
            After: the verdict at display size, the curve full height on the first screen, the
            settings moved below. Ranking meant demoting — the settings that produced the run lost
            their permanent column. A deliberate trade.
          </p>
        </section>
      </div>

      {/* ── MOMENT 3 · THE SAME ARGUMENT, AT CARD SIZE ──────────────────────
          Before and after in a ruled table: double rules at head and foot, a
          divider down the middle, each card standing on its own label. The
          cards keep their own heights — the new one is genuinely taller, and
          that cost is in the copy. */}
      <div className="page-container pt-32 sm:pt-40">
        <section>
          <div className="grid grid-cols-1 items-start gap-y-6 lg:grid-cols-2 lg:gap-x-16">
            <div>
            <CaseKicker>Moment 3</CaseKicker>
            <h2 className="type-subheading text-ink-alt mt-10 max-w-[380px]" style={HEAD}>
              The dashboard card had the same problem, just smaller
            </h2>
            </div>
            <Body justify={false} className="max-w-[370px] lg:ml-auto lg:mt-16 lg:text-right">
              Everything sat at one weight. The redesign trades density for rank: the verdict
              leads, the curve shows the shape, the legs become a table.
            </Body>
          </div>

          <div className="mt-10">
            <DoubleRule />
            <div className="relative grid grid-cols-1 gap-y-14 py-10 sm:grid-cols-2 lg:py-12">
              <VRule left="50%" />
              <EdgeDot left="50%" edge="top" />
              <EdgeDot left="50%" edge="bottom" />
              {(
                [
                  {
                    which: "before",
                    src: "/case/zenxo/card/before.svg",
                    alt: "The old dashboard card: strategy name and run window at the top, a legs block listing each leg with its stop loss and target, then a results block where net P&L, winning trades, trades and max drawdown all sit at the same small size, above View results and Configure",
                  },
                  {
                    which: "after",
                    src: "/case/zenxo/card/after.svg",
                    alt: "The redesigned dashboard card: net P/L set at display size under the strategy name, wins, trades and max drawdown as supporting figures beneath it, a cumulative curve across the middle with a breakeven line, the legs as a readable table, and View results and Configure at the foot",
                  },
                ] as const
              ).map((c) => (
                <div key={c.which} className="flex flex-col items-center justify-end">
                  <GrowOnView className="case-figure relative block w-[min(360px,80vw)]">
                    <div
                      className="relative w-full"
                      style={{ aspectRatio: String(CARD_RATIO[c.which]) }}
                    >
                      <ZenxoCardShot
                        which={c.which}
                        curve={c.which === "after"}
                        src={c.src}
                        alt={c.alt}
                      />
                    </div>
                  </GrowOnView>
                  <p className="type-label mt-8 uppercase text-ink">
                    {c.which === "after" ? <Highlight>After</Highlight> : "Before"}
                  </p>
                </div>
              ))}
            </div>
            <DoubleRule />
          </div>
        </section>
      </div>

      {/* ── MOMENT 4 · CRAFT ────────────────────────────────────────────────
          Last, after every decision has been argued: it is the only section
          about how the thing is made rather than why. Heading left, the three
          principles answering it from the right — the same header as the
          dashboard-card spread. Then the two cards as a centred pair, because
          the pair IS the comparison — nothing running, nothing moving;
          something running, every stage reporting. */}
      <div className="page-container pt-32 sm:pt-40">
        <section>
          <div className="grid grid-cols-1 items-start gap-y-8 lg:grid-cols-2 lg:gap-x-16">
            <div>
              <CaseKicker>Moment 4</CaseKicker>
              <h2 className="type-subheading text-ink-alt mt-10 max-w-[440px]" style={HEAD}>
                Confusing states were driven towards clarity with motion
              </h2>
              <Body justify={false} className="mt-6 max-w-[440px]">
                One accent colour, rationed. Orange only ever means &ldquo;act here&rdquo; or
                &ldquo;you are here,&rdquo; so you can read a screen without reading a word of it.
              </Body>
            </div>
            {/* The two motion rules, level with the paragraph's foot so the
                pair of columns closes on one line. */}
            <ul className="flex max-w-[420px] flex-col gap-3 lg:ml-auto lg:self-end">
              {[
                [
                  "Motion reports instead of reassuring.",
                  "A backtest names the stage it’s on, so a slow run and a stuck run look different.",
                ],
                [
                  "If nothing is happening, nothing moves.",
                  "The orbiting dots stop when the strategy stalls. That’s the whole idea in one gesture.",
                ],
              ].map(([lead, rest]) => (
                <li key={lead} className="flex gap-2">
                  <Body justify={false}>
                    &ndash;&nbsp;<span className="font-medium">{lead}</span> {rest}
                  </Body>
                </li>
              ))}
            </ul>
          </div>

          {/* Transcribed from Figma rather than screenshotted, because what
              each card is FOR is the thing that moves in it — see
              <ZenxoPreRunCard> and <ZenxoRunningCard>. Not <Figure>: its frame
              clips, and each card's soft shadow reaches past the plate it sits
              on, so it was cut off in a hard rectangle. Here nothing clips and
              there are no crop marks — the card is the object, not a picture
              of one. */}
          <div className="mx-auto mt-16 grid max-w-[1000px] grid-cols-1 items-start gap-y-16 sm:mt-20 sm:grid-cols-2 sm:gap-x-12 lg:gap-x-20">
            {(
              [
                {
                  label: "Pre-run card, orange on the primary action only",
                  ratio: PRE_RUN_RATIO,
                  visual: <ZenxoPreRunCard />,
                  caption:
                    "Nothing is running, so nothing moves. Orange sits on the primary action and nowhere else.",
                },
                {
                  label: "Backtest running, with each stage named as it completes",
                  ratio: RUNNING_RATIO,
                  visual: <ZenxoRunningCard />,
                  caption:
                    "Connecting, loading, analysing, simulating, computing, finalising. Each one reports rather than reassures.",
                },
              ] as const
            ).map((c) => (
              <figure key={c.label} aria-label={c.label} className="mx-auto w-full max-w-[460px]">
                <GrowOnView className="case-figure relative block">
                  <div className="relative w-full" style={{ aspectRatio: String(c.ratio) }}>
                    {c.visual}
                  </div>
                </GrowOnView>
                <figcaption className="type-caption text-ink-muted mx-auto mt-2 max-w-[380px] text-balance text-center leading-relaxed">
                  {c.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </div>

      {/* ── OUTCOMES, REFLECTION, CREDITS ── unchanged from the previous
          build. */}
      <div className="page-container flex flex-col gap-24 pt-28 sm:gap-32 sm:pt-36">
        <Beat
          kicker="Outcomes"
          title="Zenxo is live, and a shared rule is finally a thing you can see."
          titleStyle={HEAD}
        >
          <P>
            The rebuilt builder and the new results page both shipped. The 9-section scroll is
            gone, and a rule shared across several legs, which the first version couldn&rsquo;t
            express at all, is now 1 node with its members wired to it.
          </P>
        </Beat>

        {/* The measurement claim is qualified next to itself rather than in a
            caption below, so nobody reads the number before the caveat. */}
        <Callout label="On the numbers">
          We ran a timed task comparison against the old build. It projects a substantial drop
          in time on screen and roughly 100ms off each action. To be clear, these are
          projections from a task run, not measured behaviour in production.
        </Callout>

        {/* Two named lessons under one heading rather than one long confession:
            the first is what went wrong, the second is what I would keep. Split
            like that the second stops reading as an apology for the first. */}
        <Beat kicker="Reflection" title="What I learned" titleStyle={HEAD}>
          <h3 className="type-subheading-sm text-ink-alt">
            I didn&rsquo;t know how F&amp;O worked&hellip; and the team paid for me learning it.
          </h3>
          <P>
            Every decision here is really a claim about what a trader needs to know before
            risking their money, and those weren&rsquo;t claims I could make in my first few
            weeks. So I kept stopping to work out where a business requirement and a
            trader&rsquo;s actual need were pulling apart, and which one should win. Each pause
            was reasonable on its own. Together, they pushed my tasks late, and late tasks moved
            the timeline for everyone downstream of me.
          </P>
          <h3 className="type-subheading-sm text-ink-alt mt-2">
            Learn the domain, just not in the middle of execution.
          </h3>
          <P>
            Understanding what I was designing for is the thing that made the work good.
            I&rsquo;d do it again. I&rsquo;d just rather not pay for it with someone
            else&rsquo;s schedule.
          </P>
        </Beat>
      </div>

      <div className="page-container pt-24 pb-32 sm:pt-32">
        <CaseOverview
          rows={[
            { label: "Client", value: "Zenxo" },
            {
              label: "Role",
              value:
                "Product designer. I designed the login flow, the live strategy card, the dashboard card redesign, the colour system, and all the motion. I co-designed the builder's node and editor behaviour, the results-page hierarchy, and Zenbot",
            },
            {
              label: "Team",
              value:
                "2 PMs, 3 designers, 10 engineers, some of them traders and some both. The backtesting engine is the backend team's work",
            },
            { label: "Timeline", value: "May–Aug 2026" },
            { label: "Surface", value: "Web" },
            { label: "Stage", value: "Shipped" },
          ]}
          scope={[
            "Interaction Design",
            "Design Systems",
            "Motion",
            "Information Hierarchy",
            "Prototyping",
          ]}
        />
      </div>
    </>
  );
}
