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
export default function BandLine({
  children,
  mono = false,
}: {
  children: string;
  /** Set for the campaign line, which is a piece of copy from the work itself
   *  rather than the writer's own voice — the mono face marks that shift. */
  mono?: boolean;
}) {
  return (
    /* The rules are absolutely positioned against THIS box and run to both
       viewport edges, so it stays full-bleed; the text sits in the padded
       container inside it. Without that inner padding the line ran straight
       off the screen on mobile, where the heading is wider than the viewport.

       No VERTICAL padding, deliberately: the box collapses to the hatch cells'
       own 58px, which puts the rules flush on the cells' top and bottom edges
       so each corner dot straddles a rule. That is how every other band on the
       site is built (see the "Come have a seat!" header) — an 8px inset here
       floated the dots in empty space and broke the pattern. */
    <div className="relative w-full">
      <DashRule edge="top" />
      <DashRule edge="bottom" />
      <div className="page-container flex items-center justify-center gap-[clamp(1.25rem,4vw,2.75rem)]">
        <HatchCell className="relative hidden h-[58px] w-[46px] shrink-0 lg:block" delay={0} />
        {/* Not shrink-0: this line is long enough to need to wrap on small
            screens, unlike the short headings this band was borrowed from. */}
        <p
          className={`${mono ? "font-mono" : "type-heading"} text-ink min-w-0 text-center`}
          style={mono ? { fontSize: "clamp(1.25rem, 3vw, 2rem)", letterSpacing: "0.02em" } : undefined}
        >
          {children}
        </p>
        <HatchCell className="relative hidden h-[58px] w-[46px] shrink-0 lg:block" delay={120} />
      </div>
    </div>
  );
}
