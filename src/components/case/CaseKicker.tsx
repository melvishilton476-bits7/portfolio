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
  const B = "pointer-events-none absolute h-2 w-2 border-[#cfcfcf]";
  const D = "pointer-events-none absolute size-[3px] rounded-full bg-[#171717]";
  return (
    <div className="relative ml-[26px] inline-block">
      <span aria-hidden className={`${B} -left-[26px] -top-[18px] border-l border-t`} />
      <span aria-hidden className={`${B} -right-[26px] -top-[18px] border-r border-t`} />
      <span aria-hidden className={`${B} -bottom-[18px] -left-[26px] border-b border-l`} />
      <span aria-hidden className={`${B} -bottom-[18px] -right-[26px] border-b border-r`} />
      <span aria-hidden className={`${D} -left-[26px] -top-[18px] translate-x-[4px] translate-y-[4px]`} />
      <span aria-hidden className={`${D} -right-[26px] -top-[18px] -translate-x-[4px] translate-y-[4px]`} />
      <span aria-hidden className={`${D} -bottom-[18px] -left-[26px] translate-x-[4px] -translate-y-[4px]`} />
      <span aria-hidden className={`${D} -bottom-[18px] -right-[26px] -translate-x-[4px] -translate-y-[4px]`} />
      <p className="type-caption text-ink-muted uppercase leading-none tracking-[0.14em]">
        {children}
      </p>
    </div>
  );
}
