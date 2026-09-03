import DashRule from "../DashRule";
import HatchCell from "../HatchCell";

/**
 * A thesis line, set in the site's blueprint band — the treatment the hero
 * headline and the "Come have a seat!" header already use: full-bleed dashed
 * rules above and below, with a periwinkle diagonal-hatch cell bookending each
 * end. The rules draw in and the cells wipe open as the band scrolls into view.
 *
 * Reserved for the two moments in the case study that carry the whole argument
 * ("Nature is the perfect design." and "NOTHING GETS THROUGH."), so the band
 * keeps its weight. Everything else is a Beat.
 *
 * The band is full-container width while the surrounding prose sits in a 620px
 * measure, so a thesis physically breaks out of the column it interrupts.
 */
/**
 * Font size for a band line long enough that --text-heading (46px) would wrap
 * it. Derived rather than picked: the p's available width is the container
 * (max 1280) less its 128px padding, the two 46px cells and the two gaps —
 * 972px at the cap — and this question's own glyphs measure 1093px at 46px, so
 * one line needs 46 × 972/1093 ≈ 41px there. Below the container's cap that
 * width falls with the viewport, so a fixed size would wrap again on a smaller
 * laptop; the vw term tracks it down with about 4% headroom. Floors at 28px,
 * below which the line stops reading as a thesis — under `lg` the hatch cells
 * are hidden anyway, and wrapping there is the intended degradation.
 */
const FIT_ONE_LINE = "clamp(1.75rem, 4vw - 1.15rem, 2.5rem)";

export default function BandLine({
  children,
  mono = false,
  fit = false,
}: {
  children: string;
  /** Set for the campaign line, which is a piece of copy from the work itself
   *  rather than the writer's own voice — the mono face marks that shift. */
  mono?: boolean;
  /** Size the line down so it holds one line on a desktop viewport. For a
   *  thesis too long to fit at the full heading size — a two-line band reads
   *  as a paragraph in a box rather than as one struck line. Left off by
   *  default so the short bands keep the full 46px and their weight with it. */
  fit?: boolean;
}) {
  return (
    /* The rules are absolutely positioned against THIS box and run to both
       viewport edges, so it stays full-bleed; the text sits in the padded
       container inside it. Without that inner padding the line ran straight
       off the screen on mobile, where the heading is wider than the viewport.

       No VERTICAL padding, deliberately: the box collapses to the row's own
       height, which puts the rules flush on the cells' top and bottom edges
       so each corner dot straddles a rule. That is how every other band on the
       site is built (see the "Come have a seat!" header) — an 8px inset here
       floated the dots in empty space and broke the pattern.

       The hatch cells carry a MINIMUM height and stretch past it, rather than
       a fixed one. Fixed, a line that wraps to two rows grows the band past
       the cell and strands its corner dots short of the rules; with no floor
       at all, a single short line collapses the band to the text's own ~48px
       and the cells go squat. 58px is the height every other band on the site
       gives them. */
    <div className="relative w-full">
      <DashRule edge="top" />
      <DashRule edge="bottom" />
      <div className="page-container flex items-stretch justify-center gap-[clamp(1.25rem,4vw,2.75rem)]">
        <HatchCell className="relative hidden min-h-[58px] w-[46px] shrink-0 self-stretch lg:block" delay={0} />
        {/* Not shrink-0: this line is long enough to need to wrap on small
            screens, unlike the short headings this band was borrowed from. */}
        <p
          className={`${mono ? "font-mono" : "type-heading"} text-ink min-w-0 self-center text-center`}
          style={
            mono
              ? { fontSize: "clamp(1.25rem, 3vw, 2rem)", letterSpacing: "0.02em" }
              : fit
                ? { fontSize: FIT_ONE_LINE }
                : undefined
          }
        >
          {children}
        </p>
        <HatchCell className="relative hidden min-h-[58px] w-[46px] shrink-0 self-stretch lg:block" delay={120} />
      </div>
    </div>
  );
}
