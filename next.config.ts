import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* AVIF first, WebP behind it. The optimizer negotiates on the browser's
       Accept header, so anything that cannot read AVIF still gets WebP and
       nothing has to be re-exported by hand. On this site's photography AVIF
       lands roughly 30% under the WebP it replaces. */
    formats: ["image/avif", "image/webp"],
    /* Next 16 requires every quality the site asks for to be declared here —
       an open optimizer lets anyone burn CPU generating variants nobody uses.
       75 is the default and carries the site; 100 is for the About page, whose
       subject is film grain and printed paper. AVIF at 75 reads those as noise
       and smooths them, which is exactly the texture those pictures are FOR. */
    qualities: [75, 100],
  },
};

export default nextConfig;
