/**
 * Footer — thin divider and the "EDGE OF THE CITY" accent bar.
 */
export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="page-container">
        <div className="border-t border-black/10" />
      </div>
      <div className="page-container py-12">
        <div className="mx-auto flex max-w-[394px] items-center justify-center bg-accent px-6 py-5">
          <span className="type-label font-medium text-accent-ink">
            EDGE OF THE CITY
          </span>
        </div>
      </div>
    </footer>
  );
}
