import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Valest (and any future project) moved from /projects/* to /portfolio/*
      {
        source: "/projects/:path*",
        destination: "/portfolio/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
