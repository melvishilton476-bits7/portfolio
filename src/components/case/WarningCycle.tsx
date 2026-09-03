import BoardCycle, { type CycleBoard, type CyclePlate } from "./BoardCycle";

/**
 * The three warning boards, cut through against the forest — the same edit the
 * directional and species families get. Sharing the mechanism is what lets the
 * page's own claim land: a reader meets all three families identically, so the
 * one thing that differs between this figure and the two above it is the
 * palette, which is exactly the decision this section is arguing about.
 *
 * All the motion lives in <BoardCycle>.
 */

/** All three export at ~1458x1966, the same sheet as the directional family,
 *  so the set can be sized on height without any board changing width at the
 *  cut. The two odd pixels (one board is 1965 tall, one 1457 wide) are the
 *  export's own and are left alone rather than rounded — same rule the rest of
 *  the page follows. */
const BOARD_RATIO = 1458 / 1966;

const BOARDS: readonly CycleBoard[] = [
  {
    name: "Stay quiet",
    src: "/case/nagarhole/board-warning-quiet.webp",
    alt: "Warning board reading Stay Quiet over Wild Animal Crossing, in yellow on deep crimson, with a stag stepping across a striped crossing",
  },
  {
    name: "Do not enter",
    src: "/case/nagarhole/board-warning-enter.webp",
    alt: "Warning board reading Do Not Enter over Restricted Zone, with two pines inside a radiating ring of tree marks",
  },
  {
    name: "No flash",
    src: "/case/nagarhole/board-warning-flash.webp",
    alt: "Warning board reading No Flash over No Flash Photography, with a camera whose lens is crossed out and a burst at its corner",
  },
];

/** Three plates of its own again, for the reason <SpeciesCycle> gives: these
 *  figures sit a screen apart, and a repeated plate would read as the same
 *  frame served twice rather than a third installation.
 *
 *  Chosen to differ structurally from BOTH sets above — one is a barrier seen
 *  head-on, one looks up into crossing branches, one is a corridor of vertical
 *  stalks — so nine plates across the page never repeat a shape.
 *
 *  The first is doing a second job: it is the only plate on the page with a
 *  man-made barrier in it, and it sits under the family whose whole argument
 *  is that a warning has to stop someone. Not a requirement, but a "Do Not
 *  Enter" over open ground would be arguing against the board it is showing.
 *
 *  Public domain (CC0, sourced via Openverse), so nothing here carries an
 *  attribution or share-alike obligation into the portfolio. They are not
 *  Nagarhole and the page never says they are; see <BoardCycle> on why the
 *  backdrop is there at all.
 *
 *  Greyscale is baked into the files as well as applied in CSS — these are
 *  only ever shown drained, and it pays for most of the weight of three
 *  full-frame plates. It matters more here than anywhere else on the page:
 *  crimson is the one hue the forest palette does not contain, and with the
 *  backdrop drained the board is the only colour in the frame. */
const CANOPIES: readonly CyclePlate[] = [
  {
    src: "/case/nagarhole/warn-bg-gate.webp",
    alt: "A timber picket fence closing off a huge buttressed tree, dense creeper crowding in from both sides",
  },
  {
    src: "/case/nagarhole/warn-bg-canopy.webp",
    alt: "A view up into a tangle of crossing branches, the canopy closing over almost all of the sky",
  },
  {
    src: "/case/nagarhole/warn-bg-bamboo.webp",
    alt: "A narrow corridor running away between dense walls of tall bamboo stalks",
  },
];

export default function WarningCycle() {
  return (
    <BoardCycle
      boards={BOARDS}
      plates={CANOPIES}
      ratio={BOARD_RATIO}
      fit="height"
      size="66%"
      label={`Warning boards reading ${BOARDS.map((b) => b.name).join(", ")}, shown in turn against the forest`}
    />
  );
}
