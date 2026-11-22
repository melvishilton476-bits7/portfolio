/** Connector geometry shared by the phone notes and the two diagrams. */

const ELBOW_R = 8;

/** A horizontal–vertical–horizontal run with rounded elbows, the shape every
 *  connector on the Strota page takes. A straight line when the ends are
 *  level; a straight vertical when they share an x. */
export function elbowPath(x1: number, y1: number, x2: number, y2: number, midX = (x1 + x2) / 2) {
  const dy = y2 - y1;
  if (Math.abs(dy) < 0.5) return `M${x1},${y1} H${x2}`;
  if (Math.abs(x2 - x1) < 0.5) return `M${x1},${y1} V${y2}`;
  const r = Math.min(ELBOW_R, Math.abs(dy) / 2, Math.abs(midX - x1), Math.abs(x2 - midX));
  const sy = Math.sign(dy);
  const sx1 = Math.sign(midX - x1) || 1;
  const sx2 = Math.sign(x2 - midX) || 1;
  return [
    `M${x1},${y1}`,
    `H${midX - sx1 * r}`,
    `Q${midX},${y1} ${midX},${y1 + sy * r}`,
    `V${y2 - sy * r}`,
    `Q${midX},${y2} ${midX + sx2 * r},${y2}`,
    `H${x2}`,
  ].join(" ");
}
