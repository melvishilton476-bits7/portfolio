import CaseHero from "@/components/case/CaseHero";
import Beat, { P } from "@/components/case/Beat";
import BandLine from "@/components/case/BandLine";
import Moment from "@/components/case/Moment";
import Callout from "@/components/case/Callout";
import CaseOverview from "@/components/case/CaseOverview";
import ExplorationSet from "@/components/case/ExplorationSet";
import { Figure } from "@/components/case/Figure";

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

export default function ZenxoCaseStudy() {
  return (
    <>
      <CaseHero
        eyebrow="Product design · Zenxo · Shipped 2026"
        title="ZENXO"
        dek="A canvas could show what a form never could. Keeping the form next to it is the reason traders actually learned it."
        frameLabel="Split-screen builder: the form on the left, the canvas mirroring it on the right"
        // slot-01 — no art yet, so the hero keeps its Placeholder at the ratio
        // the capture will have. `fade` off: there is no dark full-bleed
        // photograph here to dissolve into the page, and the ramp would just
        // bleach a screenshot's lower half.
        image={{ ratio: 16 / 9 }}
        fade={false}
      />

      <div className="page-container flex flex-col gap-24 pt-24 sm:gap-32 sm:pt-32">
        <Beat
          kicker="Context"
          title="We fixed the form, and you still couldn't see your own strategy"
        >
          <P>
            Zenxo lets Indian retail traders build a multi-leg options strategy and test it
            against years of historical data before risking real money. A strategy is four or
            five legs, each with its own entry, stop loss, target and re-entry rules, plus
            rules that sit across several legs at once.
          </P>
          <P>
            The first version put all of that into nine form sections on one scroll. We came in
            as a design team a few weeks out from launch, with the business unhappy about what
            was going to ship, and we started where you&rsquo;d expect: tightening sections and
            sorting out the hierarchy.
          </P>
          <P>
            Those fixes worked. But a form can only list settings. It can&rsquo;t hold a rule
            that belongs to three legs at once — that relationship becomes a checkbox inside a
            panel and vanishes the second the panel closes. Several people on our team trade
            F&amp;O themselves, and it was their read that moved us: there&rsquo;s no structure
            here, and you can&rsquo;t see your own strategy.
          </P>
        </Beat>

        {/* slot-02 · video */}
        <Figure
          label="The old nine-section form, scrolled end to end"
          ratio={16 / 9}
          caption="Twenty-five controls before you describe a single leg."
        />

        <Beat
          kicker="Solution"
          title="A strategy builder that shows you the strategy you're building"
        >
          <P>
            We laid it out the way it actually runs: entries above, legs across, exits below. A
            shared rule became a single node wired to each leg it governs — which had a useful
            side effect. A leg with nothing underneath it is now visibly a leg with no exit.
          </P>
        </Beat>

        {/* slot-03 · video */}
        <Figure
          label="Stepped rail: filling the form while the canvas builds itself alongside"
          ratio={16 / 9}
          heading="You fill the form and watch the diagram assemble itself"
        />

        {/* slot-16 · video */}
        <Figure
          label="A leg with an empty + Exit slot"
          ratio={16 / 9}
          caption="A leg with nothing under it keeps an empty + Exit slot, so the affordance and the warning are the same thing."
        />

        {/* slot-04 · video */}
        <Figure
          label="Zenbot: a typed sentence becomes wired blocks on the canvas"
          ratio={16 / 9}
          heading="Zenbot turns a sentence into wired blocks, on the canvas you were already looking at"
        />

        {/* slot-05 · video, square. Capped so a 1:1 frame doesn't run the full
            880 measure and tower over the 16:9 frames around it. */}
        <Figure
          label="Live strategy card cycling through running, paused and squared off"
          ratio={1}
          maxWidth={560}
          heading="The strategy card reports its own state — running, paused, or squared off"
        />

        {/* slot-06 · image */}
        <Figure
          label="Dark mode across the builder and results"
          ratio={16 / 9}
          heading="Dark is the default traders actually work in"
        />

        {/* slot-15 · image */}
        <Figure label="The login flow" ratio={16 / 9} caption="The login flow." />

        <Beat>
          <P>
            All of this started as three separate arguments about what a strategy builder
            should even be. The one we shipped wasn&rsquo;t the most powerful of the three.
          </P>
        </Beat>
      </div>

      {/* The question the three directions were answers to, broken out of the
          text column into a full-width band — the same treatment Titan gives
          its thesis. It is a question rather than a claim, so it stays in
          sentence case. */}
      <div className="my-24 sm:my-32">
        <BandLine fit>
          How might we make a strategy something you can see, without making traders learn a
          node editor first?
        </BandLine>
      </div>

      <div className="page-container flex flex-col gap-24 sm:gap-32">
        <Moment
          index={1}
          kicker="Editor, canvas, or both"
          title="The most capable version was the one nobody would learn"
        >
          <P>
            The three of us each took a direction: editor only, editor-led with a canvas, and
            canvas-led with an editor. The canvas-led one was the most honest expression of the
            problem — a strategy really is a graph, so why not let people work on the graph? It
            also asks a retail trader who has never opened a node editor to learn one before
            placing their first order.
          </P>
          <P>
            I pushed for a blend of the two early on, and once all three were built we went
            through them together and it held up. The form stays default because traders
            optimise for speed, and changing one number on a canvas is slow. So the canvas sits
            beside it as a live mirror rather than a mode you switch into. New users work in the
            surface they already know, and by the time they can read the diagram, nobody has had
            to teach it to them.
          </P>
          <P>
            The cost landed on the build. Every form feature had to earn a canvas equivalent
            that didn&rsquo;t add visual weight — contextual buttons on the block they apply to,
            colour carrying state, icons doing the work labels would otherwise do. We now have
            two surfaces reading the same data, and they have to stay in step.
          </P>
        </Moment>

        {/* slots 07 / 08 / 09 · video. 16:9 rather than the set's 3:4 default:
            these are screen captures of a wide product, and a portrait frame
            would letterbox all three. */}
        <ExplorationSet
          kicker="Three directions, built"
          ratio={16 / 9}
          options={[
            {
              label: "Editor only",
              body: "The nine sections restructured into a stepped, grouped flow. Genuinely much better than what it replaced.",
              verdict:
                "It still couldn't show a rule shared across legs. We fixed the length, not the capability.",
            },
            {
              label: "Canvas-led, editor secondary",
              body: "The graph as the primary surface, with the form available underneath.",
              verdict:
                "The most expressive of the three, and the least learnable. It puts a node editor in front of the thing meant to simplify the product.",
            },
            {
              label: "Editor-led, canvas as live mirror",
              chosen: true,
              body: "Form default, canvas beside it, both reading the same data.",
              verdict:
                "Traders start in the surface they already know and pick up the canvas by watching it. It costs a narrow form column and a much harder build.",
            },
          ]}
        />

        <Moment
          index={2}
          kicker="Ranking the results"
          title="Every trader wanted a different number first, so we had to pick one for everybody"
        >
          <P>
            The results page had twenty-one panels sitting at one weight. Net profit was in a
            tile the same size as the worst losing streak, and a warning that the strategy would
            lose money over time got the same treatment as everything above it. A trader opens a
            backtest to answer one question: should I run this?
          </P>
          <P>
            That wasn&rsquo;t a question we could answer from the inside. I sat down with
            traders individually to find out which values mattered and in what order, and their
            answers genuinely differed. But the variation had a shape to it — everyone wanted
            the verdict first, then the curve, then the reasons, then the raw rows. We rebuilt
            the page as that funnel, and went back and forth with the PM on where the smaller
            variables should land.
          </P>
          <P>
            Ranking things also meant demoting things. Configuration lost its permanent
            right-hand column, so a trader checking what produced these numbers has less of it
            on screen than before.
          </P>
        </Moment>

        {/* slots 10 / 11 · image */}
        <ExplorationSet
          kicker="Results page, before and after"
          ratio={16 / 9}
          options={[
            {
              label: "Before, win rate leads",
              body: "A percentage at the top, total net P&L small in the corner, Sharpe given the same room as max loss, and the cumulative curve below the fold.",
              verdict: "It leads with a question the trader wasn't asking first.",
            },
            {
              label: "After, the verdict leads",
              chosen: true,
              body: "Net P&L at display size, metrics grouped so each one carries its own supporting detail, and the curve at full height on the first screen.",
              verdict: "The settings that produced the run gave up their standing column.",
            },
          ]}
        />

        <Beat
          kicker="The same argument, at card size"
          title="The dashboard card had the same problem, just smaller"
        >
          <P>
            Strategy name, legs, stop losses, targets, net P&amp;L, trades, win count — all at
            one weight in a small card. The number you opened the card for had no more claim on
            your eye than the ones next to it. The redesign gives up some density to establish
            rank: the verdict at display size, the curve underneath, the legs in a readable
            table.
          </P>
        </Beat>

        {/* slots 12 / 13 · image, portrait */}
        <ExplorationSet
          kicker="Strategy card"
          // ExplorationSet's own 980px measure splits into two ~460px columns,
          // which is already the cap a 3:4 frame wants — no extra clamp needed.
          ratio={3 / 4}
          options={[
            {
              label: "Before",
              body: "Compact and complete, but flat — every value at the same size as every other.",
              verdict: "There's nothing here to scan for.",
            },
            {
              label: "After",
              chosen: true,
              body: "Net P/L leads, wins and trades support it, the curve shows shape over time, and the legs paginate.",
              verdict:
                "It costs vertical space, and version comparison moves behind the history control.",
            },
          ]}
        />

        <Beat kicker="Final flow" title="The full flow, start to verdict">
          <P>
            The whole path through the product, now that you know what each part of it cost us.
          </P>
        </Beat>

        {/* slot-14 · video */}
        <Figure
          label="End to end: naming a strategy through to the results verdict"
          ratio={16 / 9}
          heading="From a strategy name to a verdict"
        />

        <Beat
          kicker="Outcomes"
          title="Zenxo is live, and a shared rule is finally a thing you can see"
        >
          <P>
            The rebuilt builder and the new results page both shipped. The nine-section scroll
            is gone, and a rule shared across several legs — which the first version
            couldn&rsquo;t express at all — is now one node with its members wired to it.
          </P>
        </Beat>

        {/* The measurement claim is qualified next to itself rather than in a
            caption below, so nobody reads the number before the caveat. */}
        <Callout label="On the numbers">
          We ran a timed task comparison against the old build. It projects a substantial drop
          in time on screen and roughly 100ms off each action. These are projections from a task
          run, not measured behaviour in production.
        </Callout>

        <Beat
          kicker="Reflection"
          title="I didn't know how F&O worked, and the team paid for me learning it"
        >
          <P>
            Every decision here is really a claim about what a trader needs to know before
            risking their money, and those weren&rsquo;t claims I could make in my first few
            weeks. So I kept stopping to work out where a business requirement and a
            trader&rsquo;s actual need were pulling apart, and which one should win. Each pause
            was reasonable on its own. Together they pushed my tasks late, and late tasks moved
            the timeline for everyone downstream of me.
          </P>
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
                "Product designer. Mine: the login flow, the live strategy card, the dashboard card redesign, the colour system and all the motion. Co-designed: the builder's node and editor behaviour, the results-page hierarchy, and Zenbot",
            },
            {
              label: "Team",
              value:
                "2 PMs, 3 designers, 10 engineers — several of them traders. The backtesting engine is the backend team's work",
            },
            { label: "Timeline", value: "May–August 2026" },
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
