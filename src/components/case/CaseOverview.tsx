/**
 * The metadata block that closes a case study — year, type, role, duration, and
 * the scope of work as tags.
 *
 * Deliberately last. The framework this page follows pushes all the
 * conventional "role / tools / duration" material to the END, after the story
 * has done its work, rather than front-loading it as a spec sheet. It carries
 * no images for the same reason the reflection beat doesn't: when the point is
 * reading, the pictures come out.
 *
 * Set on the site's periwinkle tag colour for the scope chips, matching the
 * tags on the featured-project card, and framed by a dashed rule above so it
 * reads as an appendix to the essay rather than another beat of it.
 */
export default function CaseOverview({
  rows,
  scope,
}: {
  rows: readonly { label: string; value: string }[];
  scope: readonly string[];
}) {
  return (
    <section className="mx-auto w-full max-w-[620px]" aria-label="Project overview">
      <div className="border-t border-dashed border-black/20 pt-10">
        <dl className="flex flex-col gap-4">
          {rows.map(({ label, value }) => (
            <div key={label} className="grid grid-cols-[7rem_1fr] items-baseline gap-4">
              <dt className="type-caption text-ink-muted uppercase tracking-[0.14em]">
                {label}
              </dt>
              <dd
                className="type-lead text-ink"
                style={{ letterSpacing: "-0.02em", fontWeight: 300 }}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="type-caption text-ink-muted mt-10 uppercase tracking-[0.14em]">
          Scope of work
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {scope.map((item) => (
            <li
              key={item}
              className="type-caption text-chip-text bg-tag/40 px-3 py-1.5"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
