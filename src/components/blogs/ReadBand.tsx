import Link from "next/link";
import DashRule from "@/components/DashRule";
import HatchCell from "@/components/HatchCell";
import { POSTS } from "./posts";
import { COL_START } from "./grid";

const BUTTON = "#454343";

/**
 * The strip under the cards: one full-width "Read this" plate per article, in
 * a band ruled top and bottom, with periwinkle hatch filling every gap.
 *
 * The plates sit in THE SAME grid as the cards above — the shared column
 * template in ./grid — so each one lines up with the card and spine it belongs
 * to rather than being centred under it by eye. The hatch cells then fill the
 * two gutters between the plates and run off both edges of the screen, which is
 * how the design closes the band off: the strip reads as continuous ruled
 * ground with three plates laid on it.
 *
 * Hatch and rules are lg-only, the same as everywhere else on the site — below
 * that the heading wraps, the cards stack, and there are no gaps left to fill.
 */
function Plate({ label, href }: { label: string; href?: string }) {
  const cls =
    "type-caption flex h-[45px] items-center justify-center font-medium text-white";
  return href ? (
    <Link href={href} className={`${cls} transition-opacity hover:opacity-85`} style={{ backgroundColor: BUTTON }}>
      {label}
    </Link>
  ) : (
    /* No article link yet. A plate that looks like a button and goes nowhere is
       worse than one that does not offer itself, so this stays a plain box
       until posts.ts carries a href. */
    <div className={cls} style={{ backgroundColor: BUTTON }}>
      {label}
    </div>
  );
}

export default function ReadBand() {
  return (
    <div className="page-container relative mt-12 lg:mt-14">
      <DashRule edge="top" />
      <DashRule edge="bottom" />

      <div className={`relative ${COL_START.grid} gap-y-3 lg:gap-y-0`}>
        {/* The two run-offs: each starts at an edge of the grid and carries the
            hatch out to the edge of the screen.

            The width is measured, not guessed. `50%` is half this grid, so
            `50vw - 50%` is exactly the distance from the grid's edge to the
            viewport's — the page's side padding at narrow widths, plus the
            centring margin once the container stops growing at 1280. A plain
            `w-screen` also covers the gap, but it is mostly off-screen, and
            HatchCell only draws itself once 35% of it is in view: at 1280 that
            is 64 visible pixels out of 1280, so the two ends of the band would
            sit blank white forever between hatched gutters. Sized to the bleed
            they are ~90% visible and draw with everything else. */}
        <HatchCell
          className="absolute inset-y-0 right-full hidden lg:block"
          style={{ width: "calc(50vw - 50%)" }}
          delay={0}
        />
        <HatchCell
          className="absolute inset-y-0 left-full hidden lg:block"
          style={{ width: "calc(50vw - 50%)" }}
          delay={360}
        />

        {POSTS.map((post, i) => (
          <div key={post.id} className={COL_START.cols[i]}>
            <Plate label="Read this" />
          </div>
        ))}

        {/* The two gutters. They are real grid tracks (see ./grid), so these
            land on them exactly instead of being positioned by arithmetic that
            would drift the moment the template changed.

            `row-start-1` is not optional: an item with a column but no row is
            auto-placed AFTER the plates, which have already taken row 1, so
            without it both cells drop into a second row of their own and
            collapse to nothing. Pinned to row 1 they stretch to the plates'
            height, which is where the band's ruled ground comes from.

            `relative` is not decoration either. A HatchCell paints its fill,
            its hatch and its dots as `absolute inset-0` children, so the cell
            has to be the containing block they resolve against. Every other
            cell on the site is passed `absolute` and gets that for free; these
            two are the first ones laid out BY the grid, and left static their
            fill resolves against the grid instead and lays hatch straight over
            all three plates. */}
        <HatchCell className="relative hidden lg:col-start-2 lg:row-start-1 lg:block" delay={120} />
        <HatchCell className="relative hidden lg:col-start-4 lg:row-start-1 lg:block" delay={240} />
      </div>
    </div>
  );
}
