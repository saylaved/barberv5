import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    // WebP at q90: crisp hair/beard detail on retina screens.
    formats: ["image/webp"],
    qualities: [90],
    // Up to 3840 so 2x/3x screens never get an upscaled file.
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2048, 2560, 3840],
    imageSizes: [96, 192, 256, 384, 512],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
