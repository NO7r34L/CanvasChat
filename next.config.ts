import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  swcMinify: false, // Disable SWC minification
  compiler: {
    removeConsole: false,
  },
  experimental: {
    serverMinification: false,
  },
  // Disable optimization for Edge Runtime compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.minimize = false;
    }
    return config;
  },
}

export default nextConfig;

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
