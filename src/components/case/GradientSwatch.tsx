import TitanMark from "./TitanMark";

/**
 * A gradient cell with the finished mark laid over it.
 *
 * The mark sits dead centre, which on both ramps is the one place it reads:
 * each gradient runs light at one end and near-black at the other, so a white
 * mark parked anywhere but the middle would either burn out or vanish. Centred
 * it lands on mid-blue and mid-orange respectively — the two temperatures the
 * copy names — and holds against both.
 *
 * White rather than the artwork's black: it's the colour the mark is given
 * everywhere else it appears over imagery (the hero plate, the manual cover),
 * and black would disappear into the dark end of both ramps.
 */
export default function GradientSwatch({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid place-items-center"
      >
        <TitanMark className="h-auto w-[22%]" color="#fff" />
      </div>
    </>
  );
}
