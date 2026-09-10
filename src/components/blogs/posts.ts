/**
 * The three articles, and the little instrument that stands beside each one.
 *
 * Data rather than markup because the page draws the same unit three times and
 * the only things that change are these six fields. `href` is deliberately
 * empty: the articles live somewhere else and the links have not been supplied
 * yet. Everything downstream branches on it — an entry with a href becomes a
 * real <Link>, an entry without stays inert — so filling one in here is the
 * whole job of wiring a post up later, with nothing to change in a component.
 */
export type Spine = "blue" | "amber" | "red";

export type Post = {
  /** Slug-ish id — React key, and the anchor a future route would hang off. */
  id: string;
  /** The two subjects, mono, above the title. */
  kicker: string;
  title: string;
  /** Alt text: what the picture actually shows, not the title again. */
  image: { src: string; alt: string; position?: string };
  spine: Spine;
};

export const POSTS: Post[] = [
  {
    id: "ai-engineering-design",
    kicker: "Tech | Product Design",
    title: "How Does AI Affect Engineering And Design",
    image: {
      src: "/blog/ai-engineering-design.webp",
      alt: "An illustration of a man raising a finger with an idea, a lightbulb between him and a robot",
    },
    spine: "blue",
  },
  {
    id: "creatives-athlete-mindset",
    kicker: "Design | Mentality",
    title: "Creatives With An Athlete’s Mindset",
    image: {
      src: "/blog/creatives-athlete-mindset.webp",
      alt: "A basketball player lining up a free throw",
      position: "center top",
    },
    spine: "amber",
  },
  {
    id: "design-school-creativity",
    kicker: "Design | Creativity",
    title: "What Design School Taught Me About Creativity",
    image: {
      src: "/blog/design-school-creativity.webp",
      alt: "Someone seated on a stool holding a sign reading THINK BIGGER over their face",
    },
    spine: "red",
  },
];
