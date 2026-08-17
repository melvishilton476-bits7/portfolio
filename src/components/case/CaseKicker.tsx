import CropMarks from "./CropMarks";

/**
 * The small uppercase label that opens each case-study beat ("The context",
 * "The turn"). It wears the site's crop-mark frame — the same 8px light-grey
 * L-brackets with a 3px black registration dot nested in each crook that frame
 * the "SIGHTS to SEE" and "Let's have a chat." subtitles — so a beat label
 * reads as part of the blueprint vocabulary rather than a new device.
 *
 * Shrink-to-fit (inline-block) so the frame hugs the words at any length.
 */
export default function CaseKicker({ children }: { children: string }) {
  return (
    <div className="relative ml-[26px] inline-block">
      <CropMarks offsetX={26} offsetY={18} />
      <p className="type-caption text-ink-muted uppercase leading-none tracking-[0.14em]">
        {children}
      </p>
    </div>
  );
}
