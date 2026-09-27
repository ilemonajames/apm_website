import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/wp/about", destination: "/about", permanent: true },
      { source: "/blog-financial-services-v1", destination: "/news", permanent: true },
      { source: "/blog-financial-services-v1/:path*", destination: "/news", permanent: true },
    ];
  },
};

export default nextConfig;
