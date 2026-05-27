import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Turbopack persistent cache (SST) is unstable on macOS and tears down
    // .next/dev manifests mid-session, causing 500s. Disable until upstream fix.
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
