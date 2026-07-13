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
  // Old flat puzzle-app URLs now live under /puzzle — keep bookmarks working.
  async redirects() {
    return ["shorts", "insight", "gratitude", "my-light", "community", "music"].map(
      (p) => ({
        source: `/${p}`,
        destination: `/puzzle/${p}`,
        permanent: false,
      }),
    );
  },
  // Serve the standalone blueprint pages (public/diagram/**) at clean URLs.
  async rewrites() {
    return [
      { source: "/diagram", destination: "/diagram/index.html" },
      { source: "/diagram/next", destination: "/diagram/next/index.html" },
    ];
  },
};

export default nextConfig;
