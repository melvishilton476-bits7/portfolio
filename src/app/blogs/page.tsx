import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TitleBand from "@/components/TitleBand";
import BlogCard from "@/components/blogs/BlogCard";
import ReadBand from "@/components/blogs/ReadBand";
import { POSTS } from "@/components/blogs/posts";
import { COL_START } from "@/components/blogs/grid";

/**
 * /blogs — a real route, like /about and /playground, rather than an anchor on
 * the home page. The nav item pointed at /#blogs, which resolved to nothing;
 * it now points here.
 *
 * Entirely a server component. There is no state on this page and nothing to
 * react to — three cards and a strip of plates — so the only JavaScript it
 * ships is what the shared chrome already brings: the nav, and the draw-in
 * observers inside DashRule and HatchCell. The articles themselves live
 * elsewhere; when their links arrive they go in components/blogs/posts.ts and
 * every card and plate on the page becomes a link on its own.
 */
export const metadata: Metadata = {
  title: "Blogs — Melvis Hilton",
  description:
    "Writing on design, engineering and the mentality behind both — from what AI is doing to the two crafts to what design school actually taught me.",
};

export default function BlogsPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 overflow-x-clip">
        {/* Top clearance from md up only: below that the nav is fixed to the
            BOTTOM of the screen and this padding would be an empty screenful
            above the title. Same as About. */}
        <section aria-labelledby="blogs-title" className="relative pt-12 pb-24 md:pt-28 md:pb-36">
          <TitleBand cell={120}>
            <h1 id="blogs-title" className="type-heading text-ink-hero text-center">
              BLOGS
            </h1>
          </TitleBand>

          {/* The standfirst. Two colours on the line and one of them is a
              weight change, not a hue: the football is the joke, so it carries
              the emphasis and the rest stays level. */}
          <div className="page-container">
            <p className="type-note text-ink-alt mx-auto mt-9 max-w-[27rem] text-center leading-normal">
              I tend to have an opinion on a lot of things like{" "}
              <span className="font-medium text-ink">
                Real Madrid is the Best club in the world
              </span>
              , and sometimes I like to share them&nbsp;&nbsp;:)
            </p>
          </div>

          <div className="page-container mt-16 lg:mt-24">
            <div className={`${COL_START.grid} gap-y-14 lg:gap-y-0`}>
              {POSTS.map((post, i) => (
                <div key={post.id} className={COL_START.cols[i]}>
                  <BlogCard post={post} beat={i} />
                </div>
              ))}
            </div>
          </div>

          <ReadBand />
        </section>
      </main>
      <Footer />
    </>
  );
}
