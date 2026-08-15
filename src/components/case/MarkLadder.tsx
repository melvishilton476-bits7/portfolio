import Placeholder from "../Placeholder";

/**
 * The hinge constraint, drawn at true size rather than exported as a picture.
 *
 * The copy's argument is that the mark had to survive down to a few millimetres
 * on a temple arm, so the ladder was built backwards from the smallest size up.
 * An exported image of that ladder would be a picture of sizes; rendering each
 * step at its ACTUAL pixel size makes the page itself the proof — 55px here is
 * 55px on the reader's screen.
 *
 * Baseline-aligned along a hairline so the steps read as one descending series,
 * with each size labelled beneath. Swap <Placeholder> for the real mark and the
 * diagram becomes literal with no other change.
 *
 * The row is ~490px of marks plus gaps, so on narrow screens it scrolls inside
 * its own container rather than pushing the page sideways.
 */
const STEPS = [185, 120, 85, 55] as const;

export default function MarkLadder() {
  return (
    <div className="mx-auto w-full max-w-[880px]">
      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max items-end gap-6 border-b border-black/15 pb-4 sm:gap-10">
          {STEPS.map((size) => (
            <div key={size} className="flex flex-col items-center gap-3">
              <Placeholder
                label=""
                ratio={1}
                style={{ width: size, height: size }}
                className="shrink-0"
              />
              <span className="type-caption text-ink-muted tabular-nums">{size}px</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
