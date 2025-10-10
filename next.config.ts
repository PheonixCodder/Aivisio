import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "replicate.delivery",
      },
      {
        protocol: "https",
        hostname: "sanqiqdndvvdsuoqpapn.supabase.co",
        pathname: "/storage/v1/object/**",
      },

    ]
  }
};

export default nextConfig;
