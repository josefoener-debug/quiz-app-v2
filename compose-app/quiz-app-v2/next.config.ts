import type { NextConfig } from "next";

const internalApiOrigin = process.env.INTERNAL_API_ORIGIN || "http://api:4000";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${internalApiOrigin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
