import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
