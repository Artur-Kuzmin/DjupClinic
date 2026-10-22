import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // One server-rendered 404 for every unmatched URL. Needed because the
    // root layout sits under /[lang] (see src/app/global-not-found.tsx).
    globalNotFound: true,
  },
};

export default nextConfig;
