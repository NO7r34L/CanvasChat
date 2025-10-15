import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverMinification: false, // Disable to fix __name bundling issues
  },
}

export default nextConfig;

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
