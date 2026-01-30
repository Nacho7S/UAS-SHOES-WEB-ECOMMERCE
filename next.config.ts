import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // unoptimized: true, // disables optimization, no domain config needed\
    remotePatterns: [{
      protocol: 'https',
      hostname: 'lh3.googleusercontent.com'
    }]
  },
};

export default nextConfig;
