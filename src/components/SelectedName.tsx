import type { ReactNode } from "react";

/**
 * Wraps a word in a looping, faux iOS text-selection effect: a caret blinks
 * in, a blue highlight sweeps across to "select" the word, the two handles
 * ride to each end, it holds, deselects, and repeats. Decorative only
 * (overlay is aria-hidden); the word text stays crisp and readable on top.
 *
 * Styles + keyframes live in globals.css under "TEXT-SELECTION MOTIF".
 */
export default function SelectedName({ children }: { children: ReactNode }) {
  return (
    <span className="sel-name">
      <span className="sel-name__text">{children}</span>
      <span className="sel-name__overlay" aria-hidden="true">
        <span className="sel-name__caret" />
        <span className="sel-name__highlight">
          <span className="sel-name__handle sel-name__handle--end" />
        </span>
        <span className="sel-name__handle sel-name__handle--start" />
      </span>
    </span>
  );
}
