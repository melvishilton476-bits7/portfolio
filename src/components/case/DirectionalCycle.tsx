import BoardCycle, { type CycleBoard, type CyclePlate } from "./BoardCycle";

/**
 * The three directional boards, cut through against the forest.
 *
 * All the motion lives in <BoardCycle>; this file is the artwork and the two
 * decisions specific to this family. See that component for why the change is
 * a cut rather than a dissolve, and why the loop is honest here.
 */

/** All three boards export at 1458x1966, so the frame is taken from them
 *  rather than them fitted to it — and one shared ratio means the set can be
 *  sized on its height without any board changing width at the cut. */
const BOARD_RATIO = 1458 / 1966;

const BOARDS: readonly CycleBoard[] = [
  {
    name: "Coracle safari dock",
    src: "/case/nagarhole/board-coracle-dock.webp",
    alt: "Directional board reading Coracle Safari Dock, 3 mins, 700 m, with an arrow turning up and left and a coracle on the water",
  },
  {
    name: "Kabini river trail",
    src: "/case/nagarhole/board-river-trail.webp",
    alt: "Directional board reading Kabini River Trail, 45 mins, 10 km, with a right arrow and a sun rising over the river",
  },
  {
    name: "Safari entry point",
    src: "/case/nagarhole/board-safari-entry.webp",
    alt: "Directional board reading Way to Safari Entry Point, 3 mins, 700 m, with a left arrow and an open safari jeep",
  },
];

/** Held sharp, at the source photographer's own focus — no blur, but drained
 *  to greyscale, which leaves the board the only colour in the frame. That
 *  suits what this figure is for: the forest is the condition, the sign is the
 *  designed object, and the yellow now has nothing competing with it.
 *
 *  Each is pre-cropped to this figure's 3:4 so the framing is a decision
 *  rather than whatever `cover` happens to keep.
 *
 *  Ordered to sit under the board that shares its subject: the dock board over
 *  water, the trail board over a trail, the safari board over closed forest.
 *  Not a requirement, but a sign pointing to a coracle over a dry footpath
 *  undercuts the board it is meant to show. */
const CANOPIES: readonly CyclePlate[] = [
  {
    src: "/case/nagarhole/forest-river.webp",
    alt: "A still river corridor at first light, trees closing overhead and reflecting in the water",
  },
  {
    src: "/case/nagarhole/forest-path.webp",
    alt: "A narrow earth trail through dense misty jungle, banana and cane leaves crowding both sides",
  },
  {
    src: "/case/nagarhole/forest-canopy.webp",
    alt: "A large pale-trunked tree rising out of thick green undergrowth, a person standing small at its base",
  },
];

export default function DirectionalCycle() {
  return (
    <BoardCycle
      boards={BOARDS}
      plates={CANOPIES}
      ratio={BOARD_RATIO}
      fit="height"
      size="66%"
      label={`Directional boards for ${BOARDS.map((b) => b.name).join(", ")}, shown in turn against the forest`}
    />
  );
}
