import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // disables optimization, no domain config needed
  },
};

export default nextConfig;
