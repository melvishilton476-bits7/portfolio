import Placeholder from "./Placeholder";

type ProjectCardProps = {
  title: string;
  meta: string;
  href?: string;
};

/**
 * A single project card — themed art block with title/meta and a
 * "View Project" pill. Art is a placeholder pending real exports.
 */
export default function ProjectCard({
  title,
  meta,
  href = "#",
}: ProjectCardProps) {
  return (
    <article className="group flex flex-col gap-3">
      <div className="relative overflow-hidden">
        <Placeholder label={title} ratio={237 / 207} variant="accent" />
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h3 className="type-subheading-sm text-ink">{title}</h3>
          <p className="type-caption text-ink-muted">{meta}</p>
        </div>
        <a
          href={href}
          className="type-caption inline-flex shrink-0 items-center gap-1 border border-ink/15 px-3 py-1.5 text-ink transition-colors group-hover:bg-ink group-hover:text-white"
        >
          View Project <span aria-hidden>→</span>
        </a>
      </div>
    </article>
  );
}
