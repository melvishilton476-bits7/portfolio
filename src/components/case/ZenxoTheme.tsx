/**
 * The builder in both themes, cross-fading between them.
 *
 * Two captures of the same screen at the same moment, so nothing but the
 * theme changes between frames. That is the whole reason this is a dissolve
 * and not a side-by-side: shown as two panels the reader compares two
 * pictures, and shown as one panel changing colour underneath a layout that
 * never moves, they see that the dark theme is the same product rather than a
 * second design of it.
 *
 * The light shot is the base and the dark one fades over it. Only one element
 * animates, so there is no window where both are half-opaque against the page
 * and the whole thing goes pale — the layer underneath is always fully
 * painted.
 *
 * Long holds, short crossings: the point is each state, not the transition.
 */

export const THEME_RATIO = 2560 / 1319;

export default function ZenxoTheme({
  light,
  dark,
  lightAlt,
  darkAlt,
}: {
  light: string;
  dark: string;
  lightAlt: string;
  darkAlt: string;
}) {
  return (
    <div className="absolute inset-0 bg-background">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={light} alt={lightAlt} className="absolute inset-0 h-full w-full object-cover" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dark}
        alt={darkAlt}
        className="zt-dark absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
