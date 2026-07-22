import Image from "next/image";

/**
 * The two hands draped over the top edge of the "Sights to See" slab, as if
 * the card is being pulled up over the hero by hand.
 *
 * Positioned at the slab's top edge, so they ride it 1:1 as the slab scrolls
 * up over the hero — no independent motion. Purely decorative.
 *
 * One animated source (a 6s roughen-edges loop, thumb up-right) is used for
 * the left hand and mirrored horizontally for the right, so the pair reads as
 * a matched set from a single asset. `unoptimized` so Next serves the
 * animated WebP as-is rather than flattening it to one frame.
 */
export default function SlideHands() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 -top-[24px] z-20"
    >
      {/* Hands sit ON the edge: upper half overhangs above onto the hero,
          fingertips drape below onto the slab. */}
      <Image
        src="/hands/animated.webp"
        alt=""
        width={480}
        height={640}
        unoptimized
        className="absolute left-[5%] top-0 h-auto w-[clamp(140px,17vw,240px)] -translate-y-[52%]"
      />
      <Image
        src="/hands/animated.webp"
        alt=""
        width={480}
        height={640}
        unoptimized
        className="absolute right-[5%] top-0 h-auto w-[clamp(140px,17vw,240px)] -translate-y-[52%] -scale-x-100"
      />
    </div>
  );
}
