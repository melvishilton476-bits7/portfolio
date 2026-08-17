/**
 * The finished mark, on its own.
 *
 * The two paths are mirror halves about the centre — the brow ridge and outer
 * eye sweeping up, the beak dropping through as the stem. They are the same
 * geometry the construction diagram resolves to, which is why they live here
 * and TitanConstruction imports them rather than each file carrying its own
 * copy: the diagram and the finished mark drifting apart would quietly break
 * the one claim that beat makes.
 *
 * The viewBox is the paths' measured bounding box (via getBBox on the rendered
 * diagram, not read off the path data), so the mark sits tight in its box with
 * no padding of its own and callers can size it however they like.
 */
export const MARK_PATHS: readonly string[] = [
  "M494.6,167.35c2-.26,53.08-6.45,65.49-7.95,1.54-.19,2.8,1.25,2.38,2.75-.43,1.5-1.41,2.7-3.17,5.22-3.66,5.26-8.41,12.26-15.44,13.91-1.2.24-27.11,6.05-22.08,1.89,0,0,12.05-3.27,12.05-3.27,8.38-2.59,14.49-3.35,17.16-11.95.28-.64-.44-.66-1.12-.51l-31.6,5.91c-30.16,7.28-30.31,56.51-38.23,80.02-.83,2.45-1.92,3.96-4.59,6.71l6.54-80.12c0-6.96,2.14-10.94,12.61-12.61Z",
  "M453.14,167.35c-2-.26-53.08-6.45-65.49-7.95-1.54-.19-2.8,1.25-2.38,2.75.43,1.5,1.41,2.7,3.17,5.22,3.66,5.26,8.41,12.26,15.44,13.91,1.2.24,27.11,6.05,22.08,1.89,0,0-12.05-3.27-12.05-3.27-8.38-2.59-14.49-3.35-17.16-11.95-.28-.64.44-.66,1.12-.51l31.6,5.91c30.16,7.28,30.31,56.51,38.23,80.02.83,2.45,1.92,3.96,4.59,6.71l-6.54-80.12c0-6.96-2.14-10.94-12.61-12.61Z",
];

/** Measured bounding box of the two paths, in the construction diagram's own
 *  coordinate space. Used verbatim as this component's viewBox. */
export const MARK_VIEWBOX = "385.19 159.38 177.36 100.7";
export const MARK_RATIO = 177.36 / 100.7;

export default function TitanMark({
  className = "",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox={MARK_VIEWBOX} fill={color} aria-hidden className={className}>
      {MARK_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
