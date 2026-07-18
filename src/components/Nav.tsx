import Link from "next/link";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Playground", href: "#playground" },
  { label: "Blogs", href: "#blogs" },
];

const EMAIL = "melvishilton476@gmail.com";

/**
 * Top navigation — a dark pill with links, an email chip, and an avatar.
 * Links are in-page anchors / stubs for now; wire to real routes later.
 */
export default function Nav() {
  return (
    <header className="w-full pt-6 sm:pt-10">
      <nav className="page-container">
        <div className="mx-auto flex w-full max-w-[435px] items-center gap-2 rounded-[var(--radius-pill)] bg-surface-dark p-1.5 pl-2 text-white">
          {/* Avatar / logo */}
          <div
            className="size-8 shrink-0 rounded-[var(--radius-sm)] bg-surface"
            aria-hidden
          />

          {/* Links */}
          <ul className="flex flex-1 items-center justify-center gap-3 sm:gap-4">
            {LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="type-nav text-white/90 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Email chip */}
          <a
            href={`mailto:${EMAIL}`}
            className="type-nav hidden shrink-0 items-center rounded-[var(--radius-pill)] bg-surface px-3 py-2 font-normal text-chip-text sm:inline-flex"
          >
            {EMAIL}
          </a>
        </div>
      </nav>
    </header>
  );
}
