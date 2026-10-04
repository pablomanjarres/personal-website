import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      { pathname: "/**", search: "" },
      { pathname: "/images/anki/**", search: "?v=mobile-edge-1" },
      { pathname: "/mockups/body-previews/**", search: "?v=mobile-edge-1" },
      { pathname: "/mockups/body-previews/**", search: "?v=paired-export-2" },
      { pathname: "/mockups/project-previews/**", search: "?v=mobile-edge-1" },
    ],
  },
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
