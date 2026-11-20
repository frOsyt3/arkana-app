import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Article images are resized in the browser first, this leaves room for a large original GIF.
      bodySizeLimit: "3mb",
    },
  },
};

export default nextConfig;
