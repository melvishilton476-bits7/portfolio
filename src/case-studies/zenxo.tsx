import CaseHero from "@/components/case/CaseHero";
import Beat, { P } from "@/components/case/Beat";
import BandLine from "@/components/case/BandLine";
import Moment, { MomentContinued } from "@/components/case/Moment";
import Callout from "@/components/case/Callout";
import CaseOverview from "@/components/case/CaseOverview";
import ExplorationSet from "@/components/case/ExplorationSet";
import ZenxoDirection, {
  DirectionBoilDefs,
  DIRECTION_RATIO,
} from "@/components/case/ZenxoDirection";
import { Figure, FigurePair } from "@/components/case/Figure";
import ScrollStrip from "@/components/case/ScrollStrip";
import ZenxoBoard, { BOARD } from "@/components/case/ZenxoBoard";
import ZenxoLegSlot from "@/components/case/ZenxoLegSlot";
import ZenxoResultsPan, { RESULTS_RATIO } from "@/components/case/ZenxoResultsPan";
import ZenxoCardShot, { CARD_RATIO } from "@/components/case/ZenxoCardShot";
import ZenxoResultsShot, {
  RESULTS_AFTER_RATIO,
} from "@/components/case/ZenxoResultsShot";
import CaseVideo, { cropRatio } from "@/components/case/CaseVideo";
import ZenxoTheme, { THEME_RATIO } from "@/components/case/ZenxoTheme";
import ZenxoPreRunCard, { PRE_RUN_RATIO } from "@/components/case/ZenxoPreRunCard";
import ZenxoRunningCard, { RUNNING_RATIO } from "@/components/case/ZenxoRunningCard";

/**
 * ZENXO — a strategy builder for Indian retail options traders.
 *
 * Composed from the shared case primitives, same as Titan and Nagarhole.
 *
 * EVERY FRAME ON THIS PAGE IS STILL A PLACEHOLDER. The source brief marks all
 * sixteen slots as artwork that doesn't exist yet, so each Figure and each
 * exploration option reserves its slot at the ratio the final asset will have
 * and keeps the dashed box. That is the convention <Figure> was built for —
 * swapping real art in later moves nothing around it — and it is why the page
 * can be read and judged now rather than after a capture session.
 *
 * The slot numbers from the brief are noted on each frame so the two stay
 * matched when the captures land.
 *
 * Unlike the other two case studies, this one was team work at a company. The
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
 */
const ZENBOT_CROP = { x: 28, y: 90, w: 1544, h: 700, sw: 1600, sh: 900 } as const;

/** The login recording, minus the black bar the transcode leaves along its
 *  bottom edge. Constant at y 697 on every frame checked, so this is a fixed
 *  crop rather than anything that needs to track the content. */
const LOGIN_CROP = { x: 0, y: 0, w: 1280, h: 697, sw: 1280, sh: 780 } as const;

/** The results-page scroll, cropped to the page's own column.
 *
 *  Measured, not framed by eye: scanning every column for ink across the clip,
 *  the page content runs x 347-1009 across the whole clip and never moves. To
 *  its left are a 21px icon rail and 325px of empty margin; to its right, 250px
 *  more, then the Zenbot launcher in the bottom corner and the browser
 *  scrollbar at 1275. So this takes 329-1027: the content plus about 18px of
 *  air on each side.
 *
 *  The right edge is 1009 rather than the 954 a first pass gave, because the
 *  insight cards at the foot of the page run wider than everything above them
 *  and a scan that stops short of the last section misses it. Worth stating
 *  because the difference is invisible until the crop clips a card in half.
 *
 *  That is roughly a 2x zoom on what the frame used to hold, and it is the
 *  difference
 *  between a page you can see and a page you can read — at 1269 wide the trade
 *  log and the insight cards rendered below 8px.
 *
 *  What it costs is the empty right-hand side. That absence used to be this
 *  figure's own evidence for the paragraph above; cropping to the content
 *  means the caption can no longer point at it, so the caption now describes
 *  the ranking the page does instead, and the demotion is left to the prose.
 *  It also takes the account email out of frame, which the wider crop had
 *  sitting legible in the header. */
const RESULTS_PAGE_CROP = { x: 329, y: 0, w: 698, h: 656, sw: 1280, sh: 656 } as const;

export default function ZenxoCaseStudy() {
  return (
    <>
      <CaseHero
        eyebrow="Product design · Zenxo · Shipped 2026"
        title="ZENXO"
        dek="A canvas could show what a form never could. Keeping the form next to it is the reason traders actually learned it."
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
        // The crop also loses the heaviest of the chair backs, which the
        // composition is better for.
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

      <div className="page-container flex flex-col gap-24 pt-24 sm:gap-32 sm:pt-32">
        <Beat
          kicker="Context"
          title="We fixed the form, and you still couldn't see your own strategy"
        >
          <P>
            Zenxo lets Indian retail traders build a multi-leg options strategy and test it
            against years of historical data before risking real money. A strategy is 4 or 5
            legs, each with its own entry, stop loss, target, and re-entry rules, plus rules
            that sit across several legs at once.
          </P>
          <P>
            The first version put all of that into 9 form sections on one scroll. We came in as
            a design team a few weeks out from launch, with the business unhappy about what was
            going to ship, and we started where you&rsquo;d expect, by tightening sections and
            sorting out the hierarchy.
          </P>
          <P>
            Those fixes worked. However, a form can only list settings, and it can&rsquo;t hold
            a rule that belongs to 3 legs at once, since that relationship becomes a checkbox
            inside a panel and vanishes the second the panel closes. Several people on our team
            trade F&amp;O themselves, and it was their read that moved us: there&rsquo;s no
            structure here, and you can&rsquo;t see your own strategy.
          </P>
        </Beat>

        {/* The previous builder, pulled through the frame end to end. The
            screenshot is 1:2.23 against a 16:9 window, so only a quarter of it
            is ever on screen — which is the figure's argument, and why the
            grip on the right is a quarter tall. */}
        <Figure
          label="The old nine-section form, scrolled end to end"
          ratio={16 / 9}
          caption="Twenty-five controls before you describe a single leg."
          visual={
            <ScrollStrip
              src="/case/zenxo/old-form-strip.webp"
              alt="The previous Zenxo builder: nine configuration sections — settings, templates, entry conditions, legs, adjustments, payoff, brokerage — stacked in a single scrolling column."
              width={1733}
              height={3866}
            />
          }
        />

        <Beat
          kicker="Solution"
          title="Zenxo: a strategy builder that shows you the strategy you're building."
        >
          <P>
            We laid it out the way it actually runs, with entries above, legs across, and exits
            below. A shared rule became a single node wired to each leg it governs, which had a
            nice side effect: a leg with nothing underneath it is now visibly a leg with no
            exit.
          </P>
        </Beat>

        {/* The builder rebuilt and walked through — rail, form, canvas, and a
            camera between them. Rebuilt rather than screenshotted: the real
            editor is close to square and would letterbox into nothing at 16:9,
            and a recording could not hold a legible zoom. Geometry and colour
            are measured — design-source/zenxo-builder-spec.md. */}
        <Figure
          label="Stepped rail: filling the form while the canvas builds itself alongside"
          ratio={BOARD.width / BOARD.height}
          heading="You fill the form and watch the diagram assemble itself"
          visual={<ZenxoBoard />}
        />

        {/* slot-16 + slot-06 · two figures that each make their own point and
            neither of which is the page's main event, so they share a row
            instead of taking a full measure each. Not a comparison — see
            <FigurePair>. The node close-up keeps its own 16:9 and the theme
            frame its own 2560:1319; they sit at a shared width, not in a
            shared box.

            slot-16 is a close-up on the canvas rather than the whole builder:
            slot-03 already carries that, and the claim here is about one node.
            slot-06 is one frame dissolving between the two themes rather than
            two panels side by side — see <ZenxoTheme>. */}
        <FigurePair
          left={{
            label: "A leg with an empty + Exit slot",
            /* Both halves take the theme shot's ratio rather than their own,
               so the two frames are the same size — side by side, two boxes
               of different heights read as one of them having gone wrong.
               
               It costs nothing here, which is why this is the shared ratio and
               not the node close-up's: the leg artboard is 960x540 with its
               ink stopping at y 481, and 1.940 leaves 495 visible, so the 45px
               that go are blank canvas. Taking the leg's 16:9 instead would
               have cropped 8% off both sides of a real screenshot. */
            ratio: THEME_RATIO,
            caption:
              "A leg with nothing under it keeps an empty + Exit slot, so the affordance and the warning are the same thing.",
            visual: <ZenxoLegSlot />,
          }}
          right={{
            label: "Dark mode across the builder and results",
            ratio: THEME_RATIO,
            heading: "Dark is the default traders actually work in",
            visual: (
              <ZenxoTheme
                light="/case/zenxo/theme-light.webp"
                dark="/case/zenxo/theme-dark.webp"
                lightAlt="The strategy builder in the light theme: the leg editor open on Leg 2 down the left, and the canvas beside it carrying the strategy settings block, three legs, a target profit and a stop loss shared with one leg"
                darkAlt="The same screen at the same moment in the dark theme — identical layout, inverted surfaces, with the orange accent and the leg colours carrying through unchanged"
              />
            ),
          }}
        />

        {/* slot-04 · video, cropped to the app's own UI — see ZENBOT_CROP.
            `square` because the crop is flush to that UI: a radius here would
            take a bite out of the form column and the canvas rather than
            softening an edge. */}
        <Figure
          label="Zenbot: a typed sentence becomes wired blocks on the canvas"
          ratio={cropRatio(ZENBOT_CROP)}
          square
          heading="Zenbot turns a sentence into wired blocks, on the canvas you were already looking at"
          visual={
            <CaseVideo
              crop={ZENBOT_CROP}
              src="/case/zenxo/video/zenbot.mp4"
              label="A recording of the Zenxo builder: a sentence is sent to Zenbot, and the canvas beside the form wires itself up — a strategy settings block, session and filters, a range breakout entry, then Leg 1 and Leg 2 each gaining a stop loss, a target profit, and re-entry and trail rules, with an overall SL block on the right and an Add Leg ghost still empty"
            />
          }
        />


        {/* slot-15 · video. The transcode lands at 1280x780 with a constant
            83px black bar along the bottom — measured identical on every frame
            sampled across all 25s — so the crop takes y 0 to 696 and the frame
            follows at 1280:697. `square` for the same reason the Zenbot figure
            is: the crop is flush to the page inside it. */}
        <Figure
          label="The login flow"
          ratio={cropRatio(LOGIN_CROP)}
          square
          caption="Sign in, and the strategy you left is the one you come back to."
          visual={
            <CaseVideo
              crop={LOGIN_CROP}
              src="/case/zenxo/video/login-flow.mp4"
              label="A recording of the Zenxo sign-in page: the Welcome Back panel with email and password fields beside a rendering of the builder, then Login with Google and Sign in with Email Link below them, and the product loading in behind once sign-in completes"
            />
          }
        />

        <Beat>
          <P>
            All of this started as 3 separate arguments about what a strategy builder should
            even be. The one we shipped wasn&rsquo;t the most powerful of the 3&hellip;
          </P>
        </Beat>
      </div>

      {/* What the three directions were each an answer to, broken out of the
          text column into a full-width band — the same treatment Titan gives
          its thesis. A claim rather than a question now, so it takes no mark
          and stays in sentence case. */}
      <div className="my-24 sm:my-32">
        <BandLine fit>
          Visual strategies without a node-editor learning curve
        </BandLine>
      </div>

      <div className="page-container flex flex-col gap-24 sm:gap-32">
        <Moment
          index={1}
          kicker="Editor, canvas, or both"
          title="The most capable version was the one nobody would learn"
        >
          <P>
            The 3 of us each took a direction: editor only, editor-led with a canvas, and
            canvas-led with an editor. The canvas-led one was the most honest expression of the
            problem, since a strategy really is a graph, so why not let people work on the
            graph? However, it also asks a retail trader who has never opened a node editor to
            learn one before placing their first order.
          </P>
          <P>
            I pushed for a blend of the two early on, and once all 3 were built we went
            through them together and it held up. The form stays default because traders
            optimise for speed, and changing one number on a canvas is slow. So the canvas sits
            beside it as a live mirror instead of a mode you switch into. New users work in the
            surface they already know, and by the time they can read the diagram, nobody has had
            to teach it to them.
          </P>
          <P>
            The cost landed on the build. Every form feature had to earn a canvas equivalent
            that didn&rsquo;t add visual weight, which meant contextual buttons on the block
            they apply to, colour carrying state, and icons doing the work labels would
            otherwise do. We now have 2 surfaces reading the same data, and they have to stay in
            step.
          </P>
        </Moment>

        {/* The wireframes, not screenshots — see <ZenxoDirection> for why. The
            frame takes the export's own 1512x982 ratio rather than a nominal
            16:9, so all three land edge to edge with nothing cropped. */}
        <DirectionBoilDefs count={3} />
        <ExplorationSet
          kicker="Three directions, built"
          ratio={DIRECTION_RATIO}
          options={[
            {
              label: "Editor only",
              visual: (
                <ZenxoDirection
                  index={0}
                  src="/case/zenxo/directions/editor-only.svg"
                  alt="Wireframe of the editor-only direction: a single full-width form column of stacked, grouped fields with a step header across the top and no canvas anywhere in the frame"
                />
              ),
              body: "The 9 sections restructured into a stepped, grouped flow. Genuinely much better than what it replaced.",
              verdict:
                "It still couldn't show a rule shared across legs. We fixed the length, not the capability.",
            },
            {
              label: "Canvas-led, editor secondary",
              visual: (
                <ZenxoDirection
                  index={1}
                  src="/case/zenxo/directions/canvas-led.svg"
                  alt="Wireframe of the canvas-led direction: a full-frame dot-grid canvas carrying the strategy as connected nodes, with the form reduced to a secondary panel"
                />
              ),
              body: "The graph as the primary surface, with the form available underneath.",
              verdict:
                "The most expressive of the 3, and the least learnable. It puts a node editor in front of the thing meant to simplify the product.",
            },
            {
              label: "Editor-led, canvas as live mirror",
              // The one we shipped, and the only one of the 3 with two surfaces
              // in the frame at once — at half width its form column and its
              // canvas both collapse to unreadable. Full width it also lands
              // last and alone, which is the shape of the argument.
              wide: true,
              visual: (
                <ZenxoDirection
                  index={2}
                  src="/case/zenxo/directions/editor-led.svg"
                  alt="Wireframe of the shipped direction: the form as a narrow left column with the dot-grid canvas filling the rest of the frame beside it, both showing the same strategy"
                />
              ),
              body: "Form default, canvas beside it, both reading the same data.",
              verdict:
                "Traders start in the surface they already know, and pick up the canvas by watching it. It costs us a narrow form column and a much harder build.",
            },
          ]}
        />

        {/* The before/after used to sit as a two-up set AFTER all three
            paragraphs, which put both pictures on the far side of the whole
            argument. Interleaved, each figure lands on the sentence it is
            evidence for: the flat page under the complaint about it, the
            ranked page under the funnel that replaced it, and the last
            paragraph — what ranking cost — reads against the new one still on
            screen. <MomentContinued> carries the same rule and measure across
            the breaks so it stays one moment. */}
        <Moment
          index={2}
          kicker="Ranking the results"
          title="Every trader wanted a different number first, so we had to pick one for everybody"
        >
          <P>
            The results page had 21 panels sitting at one weight. Net profit was in a tile the
            same size as the worst losing streak, and a warning that the strategy would lose
            money over time got the same treatment as everything above it. A trader opens a
            backtest to answer 1 question: should I run this?
          </P>
        </Moment>

        {/* slot 10 · the old page, read by a moving camera — at this width a
            still of 1920x1083 of dense UI is unreadable, and the numbers ARE
            the argument. See <ZenxoResultsPan>. */}
        <Figure
          label="Before, win rate leads"
          ratio={RESULTS_RATIO}
          maxWidth={980}
          caption="Before. A percentage at the top, total net P&L small in the corner, Sharpe given the same room as max loss, and the cumulative curve below the fold. It leads with a question the trader wasn't asking first."
          visual={
            <ZenxoResultsPan
              src="/case/zenxo/results-before.webp"
              alt="The old Zenxo results page: a large win rate percentage leading the summary, total net P&L set small in the top-right corner, max profit, max loss, average profit, average loss and Sharpe all at one weight, a configuration column down the right, and the cumulative P&L chart starting below the fold"
            />
          }
        />

        <MomentContinued>
          <P>
            That wasn&rsquo;t a question we could answer from the inside. I sat down with
            traders individually to find out which values mattered and in what order, and their
            answers genuinely differed. However, the variation had a shape to it: everyone
            wanted the verdict first, then the curve, then the reasons, then the raw rows. We rebuilt
            the page as that funnel, and went back and forth with the PM on where the smaller
            variables should land.
          </P>
        </MomentContinued>

        {/* slot 11 · image. The mockup carries no ground of its own, so this
            one is square and fades out sideways instead of sitting in a frame
            — see <ZenxoResultsShot>. Wider than the pan above it because the
            scene includes the machine it is running on. */}
        <Figure
          label="After, the verdict leads"
          title="The same numbers, re-ranked into the order traders read them in"
          ratio={RESULTS_AFTER_RATIO}
          maxWidth={1100}
          square
          // The scene fades out sideways, so it has no edge to sit on.
          flat
          caption="After. Net P&L at display size, metrics grouped so each one carries its own supporting detail, and the curve at full height on the first screen. The settings that produced the run gave up their standing column."
          visual={
            <ZenxoResultsShot
              src="/case/zenxo/results-after.webp"
              alt="The redesigned Zenxo results page on a monitor: total net P&L set large at the top right, win rate with its breakdown grouped into one panel, the supporting metrics gathered beneath it, and the cumulative P&L chart at full height beside them, with a second row for the P&L chart across the trading range and the contract legs"
            />
          }
        />

        <MomentContinued>
          <P>
            Ranking things also meant demoting things. Configuration lost its permanent
            right-hand column, so a trader checking what produced these numbers has less of it
            on screen than before.
          </P>
        </MomentContinued>

        {/* slot 11b · video, cropped to the page — see RESULTS_PAGE_CROP.
            The demotion needs its own frame: the paragraph above admits a
            cost, and a cost claimed with no picture of it is the one kind of
            admission a case study gets no credit for.

            What the recording actually shows is the ABSENCE — the page scrolls
            end to end with nothing running down its right-hand side — so the
            caption is written to that rather than to a panel opening. The
            clip is cut at 25.5s of its 36.9: the last frame that changes lands
            at 24.5s and everything after it is a still, which in a loop reads
            as a stalled video rather than a held beat.

            `square` for the same reason the other two recordings are: the crop
            is flush to the product inside it, so a radius would clip content
            rather than soften an edge. */}
        <Figure
          label="The results page, read end to end"
          ratio={cropRatio(RESULTS_PAGE_CROP)}
          maxWidth={700}
          square
          caption="The whole page, top to bottom, in the order it now argues: the verdict, the chart, the trade log, then what the run is telling you."
          visual={
            <CaseVideo
              crop={RESULTS_PAGE_CROP}
              src="/case/zenxo/video/results-page.mp4"
              label="A recording of the redesigned Zenxo results page scrolling from top to bottom: the strategy name and total net P&L at the head, then the P&L chart across the trading range, the per-trade table, a monthly breakdown, drawdown and streak figures, and the AI insight cards at the foot — with no configuration column anywhere down the right-hand side"
            />
          }
        />

        <Beat
          kicker="The same argument, at card size"
          title="The dashboard card had the same problem, just smaller"
        >
          <P>
            Strategy name, legs, stop losses, targets, net P&amp;L, trades, win count, all at
            one weight in a small card. The number you opened the card for had no more claim on
            your eye than the ones next to it. The redesign gives up some density to establish
            rank, with the verdict at display size, the curve underneath, and the legs in a
            readable table.
          </P>
        </Beat>

        {/* slots 12 / 13 · image, portrait. Each frame takes its own export's
            ratio rather than a shared 3:4: the two cards sit in the same
            dashboard column at the same width, and the new one is genuinely
            taller. Squaring them to one box would flatten the exact cost the
            caption owns up to. */}
        <ExplorationSet
          kicker="Strategy card"
          options={[
            {
              label: "Before",
              ratio: CARD_RATIO.before,
              // The card casts its own shadow; a second one under the plate
              // would draw a rectangle around white-on-white.
              flat: true,
              visual: (
                <ZenxoCardShot
                  which="before"
                  src="/case/zenxo/card/before.svg"
                  alt="The old dashboard card: strategy name and run window at the top, a legs block listing each leg with its stop loss and target, then a results block where net P&L, winning trades, trades and max drawdown all sit at the same small size, above View results and Configure"
                />
              ),
              body: "Compact and complete, but flat, with every value at the same size as every other.",
              verdict: "There's nothing here to scan for.",
            },
            {
              label: "After",
              ratio: CARD_RATIO.after,
              flat: true,
              visual: (
                <ZenxoCardShot
                  which="after"
                  curve
                  src="/case/zenxo/card/after.svg"
                  alt="The redesigned dashboard card: net P/L set at display size under the strategy name, wins, trades and max drawdown as supporting figures beneath it, a cumulative curve across the middle with a breakeven line, the legs as a readable table, and View results and Configure at the foot"
                />
              ),
              body: "Net P/L leads, wins and trades support it, the curve shows shape over time, and the legs paginate.",
              verdict:
                "It costs vertical space, and version comparison moves behind the history control.",
            },
          ]}
        />

        {/* Craft sits LAST, after every decision has been argued. It is the
            only section about how the thing is made rather than why — put
            earlier it interrupted the run from "here is the product" to "here
            is what we chose and what it cost", which is the spine of the
            page. */}
        <Beat kicker="Craft" title="Motion as a function.">
          <P>
            There&rsquo;s 1 accent colour, and we rationed it. Orange only ever means
            &ldquo;act here&rdquo; or &ldquo;you are here,&rdquo; so a trader can scan a screen
            and know where the product wants them without reading a word of it.
          </P>
          <P>
            Motion follows the same rule. A backtest doesn&rsquo;t spin a generic loader at
            you, it names the stage it&rsquo;s on, so a run that&rsquo;s slow and a run
            that&rsquo;s stuck look different from each other. And the dots stop orbiting
            when the strategy stalls, which is the whole idea in one gesture: if nothing is
            happening, nothing moves.
          </P>
        </Beat>

        {/* slot-18 + slot-17 · the two cards, transcribed from Figma rather
            than screenshotted, because what each one is FOR is the thing that
            moves in it — see <ZenxoPreRunCard> and <ZenxoRunningCard>.

            Side by side rather than stacked with a paragraph between them,
            which is also why the two paragraphs above merged: the pair IS the
            comparison the section is making. One card is a strategy with
            nothing running, the other is the same product with something
            running, and the difference between "nothing moves" and "every
            stage reports" only reads if both are on screen at once.

            The orbit stalls on the left card. That is the state the card is
            in — "a few more steps, then you're ready to run" is a strategy
            that has not started — so the claim gets made by the artwork
            rather than only by the sentence above it.

            The two frames sit at different heights on purpose: these are
            genuinely different cards, and a shared box would have cropped one
            to flatter the other. */}
        <FigurePair
          left={{
            label: "Pre-run card, orange on the primary action only",
            ratio: PRE_RUN_RATIO,
            flat: true,
            caption:
              "Nothing is running, so nothing moves. Orange sits on the primary action and nowhere else.",
            visual: <ZenxoPreRunCard />,
          }}
          right={{
            label: "Backtest running, with each stage named as it completes",
            ratio: RUNNING_RATIO,
            flat: true,
            caption:
              "Connecting, loading, analysing, simulating, computing, finalising. Each one reports rather than reassures.",
            visual: <ZenxoRunningCard />,
          }}
        />

        <Beat>
          <P>
            The form and the canvas share components, because they&rsquo;re reading the same
            data and it would be strange if they disagreed about it.
          </P>
        </Beat>

        <Beat
          kicker="Outcomes"
          title="Zenxo is live, and a shared rule is finally a thing you can see."
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
        <Beat kicker="Reflection" title="What I learned">
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
