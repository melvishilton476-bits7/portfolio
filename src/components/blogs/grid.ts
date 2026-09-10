/**
 * The one column template the Blogs page lays everything on.
 *
 * The gutters are TRACKS, not `gap`, because two different rows have to sit on
 * this grid and one of them puts something IN the gutters: the read band fills
 * them with hatch cells. A `gap` is empty space nothing can be placed into, so
 * the gutter has to be a column you can address — hence `1fr 13% 1fr 13% 1fr`,
 * which is arithmetically identical to three equal columns with a 13% gap but
 * leaves the two gaps reachable as columns 2 and 4.
 *
 * 13% is the design's own proportion: 269px units separated by ~152px across a
 * 1111px measure. A percentage rather than a fixed gutter so the three cards
 * keep their relationship to one another at every width, instead of the gutters
 * eating the cards as the container narrows.
 *
 * Below lg it collapses to a single centred column — at tablet width three of
 * these cards are narrower than the design ever drew them, and the stacked
 * version (capped at 320px in BlogCard) is the one that still reads.
 *
 * Written out as literal strings: Tailwind reads source text, so a class name
 * built by joining fragments at runtime never reaches the stylesheet.
 */
export const COL_START = {
  grid: "grid grid-cols-1 lg:grid-cols-[1fr_13%_1fr_13%_1fr]",
  cols: ["lg:col-start-1", "lg:col-start-3", "lg:col-start-5"],
} as const;
