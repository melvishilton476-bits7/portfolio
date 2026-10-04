/**
 * The redraw's frame corners: a 10px black L at each corner of a relative box.
 *
 * Not <CropMarks>. Those are the site's grey brackets with a registration dot,
 * set OUTSIDE a figure. These sit ON the box's own corners and mark the edge
 * of a slot in a ruled table, as on the Draw the Line page.
 */
export default function FrameCorners() {
  return (
    <>
      {(
        [
          "left-0 top-0 border-l border-t",
          "right-0 top-0 border-r border-t",
          "left-0 bottom-0 border-l border-b",
          "right-0 bottom-0 border-r border-b",
        ] as const
      ).map((c) => (
        <span
          key={c}
          aria-hidden
          className={`pointer-events-none absolute z-10 size-[10px] border-[#171717] ${c}`}
        />
      ))}
    </>
  );
}
