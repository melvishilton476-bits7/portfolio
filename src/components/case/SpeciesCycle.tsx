import BoardCycle, { type CycleBoard, type CyclePlate } from "./BoardCycle";

/**
 * The three species boards, cut through against the forest — the same edit the
 * directional family gets, one section up. Sharing the mechanism is the point:
 * a reader meets both families the same way, so what differs between the two
 * figures is the boards and nothing else.
 *
 * All the motion lives in <BoardCycle>.
 */

/** These three don't share a ratio the way the directional set does — the
 *  elephant board is a wider composition, 874x1052 against the other two's
 *  ~713x933 — so each carries its own, taken from the export. The set is sized
 *  on width for the same reason: holding width steady lets that difference read
 *  as two board sizes, which is what it is, rather than as the frame jumping
 *  wider and narrower on every cut. */
const BOARDS: readonly CycleBoard[] = [
  {
    name: "Indian gaur",
    src: "/case/nagarhole/board-species-gaur.webp",
    alt: "Species board for the Indian gaur — the name in English above the Kannada, over five short sections on presence, habitat, breeding, calls and diet, with a yellow gaur silhouette and a QR code at the foot",
    ratio: 714 / 933,
  },
  {
    name: "Sambar deer",
    src: "/case/nagarhole/board-species-sambar.webp",
    alt: "Species board for the sambar deer, laid out to match the gaur board, with a yellow silhouette of a stag mid-stride and its alarm call given its own section",
    ratio: 713 / 933,
  },
  {
    name: "Asiatic elephant",
    src: "/case/nagarhole/board-species-elephant.webp",
    alt: "Species board for the Asiatic elephant on a wider panel, the silhouette and radiating yellow bars taking the upper left and the name set large across the foot",
    ratio: 874 / 1052,
  },
];

/** Three plates of its own rather than the directional figure's, which sit a
 *  screen apart and would read as the same frame served twice. Chosen to differ
 *  structurally, not just in subject — one recedes down a track, one is a flat
 *  wall of undergrowth, one is vertical — so each cut changes the shape of the
 *  frame behind the board and not only its texture.
 *
 *  Public domain (CC0, WordPress Photo Directory), so nothing here carries an
 *  attribution or share-alike obligation into the portfolio. They are not
 *  Nagarhole and the page never says they are; see <BoardCycle> on why the
 *  backdrop is there at all.
 *
 *  Greyscale is baked into the files as well as applied in CSS — these are only
 *  ever shown drained, and dropping the chroma paid for most of the weight of
 *  three full-frame plates. The board keeps the only colour in the frame. */
const CANOPIES: readonly CyclePlate[] = [
  {
    src: "/case/nagarhole/species-bg-track.webp",
    alt: "A narrow dirt track running away through open forest, tall bare trunks either side",
  },
  {
    src: "/case/nagarhole/species-bg-thicket.webp",
    alt: "A close wall of forest undergrowth, ferns and saplings crowding the base of thick trunks",
  },
  {
    src: "/case/nagarhole/species-bg-banyan.webp",
    alt: "A banyan hung with dense curtains of aerial roots dropping to the forest floor",
  },
];

export default function SpeciesCycle() {
  return (
    <BoardCycle
      boards={BOARDS}
      plates={CANOPIES}
      fit="width"
      size="68%"
      boardSizes="(max-width: 560px) 70vw, 400px"
      label={`Species boards for the ${BOARDS.map((b) => b.name).join(", ")}, shown in turn against the forest`}
    />
  );
}
