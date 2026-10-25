import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The studio site was briefly at /studio while "/" was the B2B page.
  async redirects() {
    return [{ source: "/studio", destination: "/", permanent: true }];
  },
  // Dev only: lets a phone on the same Wi-Fi open the dev server for review.
  allowedDevOrigins: ["192.168.*.*"],
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
