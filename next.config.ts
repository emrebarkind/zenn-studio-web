import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The studio site was briefly at /studio while "/" was the B2B page.
  async redirects() {
    return [{ source: "/studio", destination: "/", permanent: true }];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
