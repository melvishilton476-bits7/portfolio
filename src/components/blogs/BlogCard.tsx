import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Post, Spine } from "./posts";
import { external } from "./external";

/* Card body colour, straight off the design. */
const CARD = "#2b2626";

/* Every measurement below is a percentage of the CARD, never a pixel: the card
   carries a fixed aspect ratio, so a percentage box holds the design's exact
   composition at 230px wide on a laptop and at 320px wide on a phone. Written
   out as literal class strings because Tailwind reads source text — a class
   name assembled at runtime never reaches the stylesheet. */

/** The site's orange (the case-study accent). Every tag is this one colour;
 *  they differ only in height. */
const TAG = "#e8792b";

/**
 * The tag standing to the right of the card: one plain orange column with a
 * live boil on its three open edges.
 *
 * The boil (feTurbulence → feDisplacementMap, seed stepping ~7fps, as on the
 * asterisks and hands) roughens every edge of whatever it filters, so the
 * column reaches TUCK px left under the card: its left edge wobbles out of
 * sight there and the side joined to the card stays straight. `beat` offsets
 * the seed loop so the three tags do not boil in lockstep.
 */
const TUCK = 6;
function SpineColumn({ spine, beat }: { spine: Spine; beat: number }) {
  const id = `blog-tag-boil-${beat}`;
  const seeds = [4, 9, 2, 7, 11, 1, 6, 12, 3, 8, 5, 10];
  const offset = (beat * 4) % seeds.length;
  const values = [...seeds.slice(offset), ...seeds.slice(0, offset)].join(";");
  return (
    <>
      <svg aria-hidden width="0" height="0" className="absolute">
        <filter id={id} x="-30%" y="-10%" width="160%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves={2} seed={seeds[offset]} result="noise">
            <animate attributeName="seed" dur="1.8s" calcMode="discrete" values={values} repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={5} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div
        aria-hidden
        className={`blog-tag-boil ${spine === "blue" ? "h-[80.59%]" : "h-[77.57%]"}`}
        style={{ marginLeft: -TUCK, width: `calc(100% + ${TUCK}px)`, backgroundColor: TAG, filter: `url(#${id})` }}
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
      {/* A very soft shadow under card and tag together, as if the book
          rests on the page: drop-shadow follows their joint silhouette,
          boiled edge included, where a box-shadow would draw two boxes. */}
      {/* The lift on hover is on the whole book, so the tag rises with it. */}
      <div
        className={`grid grid-cols-[85.51%_14.49%] ${href ? "transition-transform duration-300 ease-out has-[a:hover]:-translate-y-1" : ""}`}
        style={{ filter: "drop-shadow(0 2px 3px rgba(23,23,23,0.06)) drop-shadow(0 16px 22px rgba(23,23,23,0.13))" }}
      >
        {href ? (
          <Link
            href={href}
            {...external(href)}
            className="blog-card relative z-10 block aspect-[230.209/296.519]"
            style={{ backgroundColor: CARD }}
          >
            {body}
          </Link>
        ) : (
          <div
            className="blog-card relative z-10 aspect-[230.209/296.519]"
            style={{ backgroundColor: CARD }}
          >
            {body}
          </div>
        )}

        {/* Bottom-aligned with the card, whatever the pieces above it add up
            to — the design hangs all three spines off the same baseline. */}
        <div className="relative flex flex-col justify-end">
          <SpineColumn spine={post.spine} beat={beat} />
        </div>
      </div>
    </article>
  );
}
