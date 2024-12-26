import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'upload.wikimedia.org', // Existing domain
      'img.discogs.com',      // Discogs image domain
      'i.discogs.com',
    ],
  },
};

export default nextConfig;