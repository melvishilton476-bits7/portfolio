import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CASE_STUDIES, CASE_STUDY_SLUGS } from "@/case-studies/registry";

/**
 * Case-study route. One page per entry in the case-study registry.
 *
 * NOTE for future edits: in this version of Next, `params` is a **Promise** and
 * must be awaited (in a server component) or unwrapped with `use()` (in a
 * client one). It is not the plain object older App Router code passes around.
 *
 * Every slug is known at build time, so generateStaticParams prerenders the lot
 * and the route never hits a request-time render.
 */

export function generateStaticParams() {
  return CASE_STUDY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = CASE_STUDIES[slug];
  if (!study) return {};
  return { title: study.title, description: study.description };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = CASE_STUDIES[slug];
  if (!study) notFound();

  const { Component } = study;

  return (
    <>
      <Nav />
      <main className="flex-1 overflow-x-clip">
        <Component />
        {/* Back to the work section on the home page — the case study is a
            detour off "Sights to See", so it returns there rather than to the
            top of the site. */}
        <div className="page-container pb-24">
          <Link
            href="/#work"
            className="type-caption text-ink-muted hover:text-ink inline-flex items-center gap-2 uppercase tracking-[0.14em] transition-colors"
          >
            <span aria-hidden>←</span> Back to all work
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
