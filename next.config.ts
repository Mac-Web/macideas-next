import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      { protocol: "http", hostname: "**" },
    ],
  },
  allowedDevOrigins: ["*.macweb.com", "macweb.com"],
};

export default nextConfig;
