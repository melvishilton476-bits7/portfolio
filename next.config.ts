import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* AVIF first, WebP behind it. The optimizer negotiates on the browser's
       Accept header, so anything that cannot read AVIF still gets WebP and
       nothing has to be re-exported by hand. On this site's photography AVIF
       lands roughly 30% under the WebP it replaces. */
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
