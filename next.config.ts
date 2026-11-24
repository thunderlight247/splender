import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product and store photos live in /public/images (real Splendy photos).
    // Unsplash is allowed so placeholder shots can be added for items
    // that don't have a photo yet, without breaking next/image.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
