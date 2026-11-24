import type { Metadata } from "next";

/**
 * One place that builds a page's search and share metadata, so every page
 * says the same things to Google, LinkedIn, WhatsApp and X.
 *
 * Next merges `openGraph` and `twitter` SHALLOWLY: a page that sets either
 * object replaces the layout's whole object, title and all. Before this
 * helper, a shared case-study link carried the home page's title. So each
 * page builds both objects in full here.
 *
 * `image` is a 1200 × 630 JPEG under /og; leave it out and the page uses the
 * default card drawn by app/opengraph-image.tsx.
 */

export const SITE_URL = "https://melvishilton.com";
export const SITE_NAME = "Melvis Hilton";

export function pageMeta({
  title,
  description,
  path,
  image,
  imageAlt,
  absoluteTitle = false,
}: {
  /** The page's own title. Short titles get " — Melvis Hilton" from the
   *  layout's template; pass `absoluteTitle` for ones that are complete. */
  title: string;
  description: string;
  /** Site path, starting with "/". */
  path: string;
  image?: string;
  imageAlt?: string;
  absoluteTitle?: boolean;
}): Metadata {
  const full = absoluteTitle ? title : `${title} — ${SITE_NAME}`;
  // A page that sets its own openGraph no longer inherits the file-based
  // default card, so point at it by its URL.
  const src = image ?? "/opengraph-image";
  const images = [{ url: src, width: 1200, height: 630, alt: imageAlt ?? full }];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: full,
      description,
      url: path,
      siteName: SITE_NAME,
      type: path.startsWith("/work/") ? "article" : "website",
      locale: "en_IN",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description,
      images: [src],
    },
  };
}
