import type { NextConfig } from "next";

// Production only: the dev server needs eval and websockets for hot reload.
// Inline scripts stay allowed because Next.js streams its own; everything else
// is our origin, plus the OpenStreetMap embed on the home page.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  "frame-src https://www.openstreetmap.org",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  ...(process.env.NODE_ENV === "production" ? [{ key: "Content-Security-Policy", value: contentSecurityPolicy }] : []),
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // The hero video and its stills rarely change; a week in the browser, refreshed quietly after.
      {
        source: "/video/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
  // The studio site was briefly at /studio while "/" was the B2B page.
  async redirects() {
    return [
      { source: "/studio", destination: "/", permanent: true },
      // The B2B product pages were removed (owner, 2026-10-25); old links land on the studio.
      { source: "/isletmeler", destination: "/", permanent: true },
      { source: "/en", destination: "/", permanent: true },
    ];
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
