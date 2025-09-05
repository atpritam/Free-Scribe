import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    esmExternals: 'loose'
  },
};

export default nextConfig;
