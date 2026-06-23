import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Turbopack persistent cache (SST) is unstable on macOS and tears down
    // .next/dev manifests mid-session, causing 500s. Disable until upstream fix.
    turbopackFileSystemCacheForDev: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zvsosicztraoevdxvmmv.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Serve the standalone app-map page (public/diagram/index.html) at a clean /diagram URL.
  async rewrites() {
    return [
      { source: "/diagram", destination: "/diagram/index.html" },
    ];
  },
};

export default nextConfig;
