import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Post, Spine } from "./posts";

/* Card body and the three spine palettes, straight off the design. The spine is
   a different instrument on every card — a gradient column, a dial, a stack of
   bars — which is the only thing distinguishing one unit from the next besides
   the picture, so the colours are named here rather than hidden in a class. */
const CARD = "#2b2626";
const AMBER = "#ffc51b";
const BAR_BLUE = "#434cff";

/* Every measurement below is a percentage of the CARD, never a pixel: the card
   carries a fixed aspect ratio, so a percentage box holds the design's exact
   composition at 230px wide on a laptop and at 320px wide on a phone. Written
   out as literal class strings because Tailwind reads source text — a class
   name assembled at runtime never reaches the stylesheet. */

/** The column standing to the right of the card. All three are bottom-aligned
 *  with the card and differ only above the bar. */
function SpineColumn({ spine }: { spine: Spine }) {
  if (spine === "blue") {
    // One unbroken column, taller than the other two and the only one that is
    // just a gradient — the first card sets the plain case the others vary.
    return (
      <div
        aria-hidden
        className="h-[80.59%] w-full"
        style={{ backgroundImage: `linear-gradient(to bottom, #c7c6ff, #3a44ff)` }}
      />
    );
  }

  if (spine === "amber") {
    return (
      <>
        {/* Five blocks in a dice pattern, knocked out of the white above the
            bar in the card's own body colour. Column widths 14 / 11 / 14 of
            the 39px spine; three equal rows. */}
        <div
          aria-hidden
          className="grid h-[11.13%] w-full grid-cols-[35.9%_28.2%_35.9%] grid-rows-3"
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <span key={i} style={{ backgroundColor: i % 2 === 0 ? CARD : undefined }} />
          ))}
        </div>
        <div aria-hidden className="h-[66.44%] w-full" style={{ backgroundColor: AMBER }} />
      </>
    );
  }

  return (
    <>
      {/* Four bars over the red column, 4px on a 8px pitch. */}
      <div aria-hidden className="flex h-[9.44%] w-full flex-col justify-between">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-[14.29%] w-full" style={{ backgroundColor: BAR_BLUE }} />
        ))}
      </div>
      {/* The gap the design leaves between the bars and the column. */}
      <div aria-hidden className="h-[1.69%]" />
      <div
        aria-hidden
        className="h-[66.44%] w-full"
        style={{ backgroundImage: `linear-gradient(to bottom, #ffc0c0, #ff0c0c)` }}
      />
    </>
  );
}

/**
 * One article: the dark card, and the coloured spine standing beside it.
 *
 * The unit is split 85.5 / 14.5 because that is the card against its spine in
 * the source (230.2 and 39 of 269.2), and holding the ratio rather than pinning
 * the spine to 39px is what keeps the composition intact when the column is
 * narrower than the design drew it.
 *
 * `href` is optional and usually absent — the articles are not linked yet. With
 * one the whole card becomes a link; without one it is an <article> that simply
 * sits there, which is the honest rendering: a card that looks clickable and
 * does nothing is worse than a card that does not claim to be clickable.
 */
export default function BlogCard({
  post,
  href,
  beat = 0,
}: {
  post: Post;
  href?: string;
  /** Which card this is in the row. Only use: offsetting the thumbnail's boil
   *  so the three silhouettes do not flicker on the same frame — three things
   *  blinking in lockstep read as the page stuttering, three out of phase read
   *  as three drawings. */
  beat?: number;
}) {
  const body = (
    <>
      {/* Kicker and title share a block pinned to the top inset, so the title
          starts at the same height on every card however long the kicker is. */}
      <div className="absolute inset-x-[8.15%] top-[7.6%]">
        <p className="type-readout text-white">{post.kicker}</p>
        {/* .type-subheading-sm sets no line-height, so a leading utility
                actually lands here (unlike font-size, which the tier would
                win). 1.2 is the design's setting; the body default of 1.5
                grows a three-line title by 19px and walks it into the
                picture. */}
        <h3 className="type-subheading-sm mt-[4%] leading-[1.2] text-white">{post.title}</h3>
      </div>

      {/* The picture, cut to the pixel silhouette that boils block by block
          (see .blog-cut in globals.css). Sized off the card's width; its own
          aspect ratio gives the height, so the whole thing scales as one.

          A NEGATIVE delay, not a positive one: it starts the animation part-way
          through rather than holding the first frame for a beat, so all three
          are already boiling on arrival and simply out of step with each
          other. A third of the 6.68s loop apart, so no two cards are ever
          sitting on the same step. */}
      <div
        className="blog-cut absolute left-[13.59%] top-[54.85%] w-[65.22%] aspect-[150.136/110.1]"
        style={{ ["--boil-offset" as string]: `${beat * -2227}ms` }}
      >
        <div className="blog-cut__plate">
          <Image
            src={post.image.src}
            alt={post.image.alt}
            fill
            /* The card never exceeds ~250px wide, and the picture is two
               thirds of that — 320px covers a 2x screen at the largest the
               layout ever gets. */
            sizes="(max-width: 1023px) 210px, 170px"
            className="object-cover"
            style={{ objectPosition: post.image.position ?? "center" }}
          />
        </div>
      </div>

      {/* Bottom-right, level with the foot of the picture. Decorative: the card
          around it already says where it goes. */}
      <ArrowRight
        aria-hidden
        strokeWidth={1.5}
        className="absolute left-[83.58%] top-[88.6%] h-auto w-[8.69%] text-white"
      />
    </>
  );

  return (
    <article className="mx-auto w-full max-w-[320px] lg:mx-0 lg:max-w-none">
      <div className="grid grid-cols-[85.51%_14.49%]">
        {href ? (
          <Link
            href={href}
            className="blog-card relative block aspect-[230.209/296.519] transition-transform duration-300 ease-out hover:-translate-y-1"
            style={{ backgroundColor: CARD }}
          >
            {body}
          </Link>
        ) : (
          <div
            className="blog-card relative aspect-[230.209/296.519]"
            style={{ backgroundColor: CARD }}
          >
            {body}
          </div>
        )}

        {/* Bottom-aligned with the card, whatever the pieces above it add up
            to — the design hangs all three spines off the same baseline. */}
        <div className="flex flex-col justify-end">
          <SpineColumn spine={post.spine} />
        </div>
      </div>
    </article>
  );
}
