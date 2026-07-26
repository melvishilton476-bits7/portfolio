import Hand from "./Hand";

/**
 * The two hands draped over the top edge of the "Sights to See" slab, as if
 * the card is being pulled up over the hero by hand.
 *
 * Positioned at the slab's top edge, so they ride it 1:1 as the slab scrolls
 * up over the hero — no independent motion. Purely decorative.
 *
 * One stylized `Hand` illustration (fingers hanging down) is used for the left
 * and mirrored horizontally (`-scale-x-100`) for the right, so the pair reads
 * as a matched set. Each straddles the edge: the wrist/back overhangs above
 * onto the hero, the fingertips drape below onto the slab.
 */
export default function SlideHands() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 -top-[36px] z-20"
    >
      <Hand
        boilId="hand-boil-l"
        className="absolute left-[5%] top-0 h-auto w-[clamp(128px,16vw,208px)] -translate-y-[42%]"
      />
      <Hand
        boilId="hand-boil-r"
        className="absolute right-[5%] top-0 h-auto w-[clamp(128px,16vw,208px)] -translate-y-[42%] -scale-x-100"
      />
    </div>
  );
}
