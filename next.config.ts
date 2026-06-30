import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the Next.js dev-mode indicator (bottom-left) so it doesn't overlap the
  // floating studio cog button. Dev-only setting; no effect on production.
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/kawai-support/request",
        destination: "/repairs/request",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
