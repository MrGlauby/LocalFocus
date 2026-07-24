import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  logging: {
    browserToTerminal: true,
  },
  devIndicators: false,
};

export default nextConfig;
