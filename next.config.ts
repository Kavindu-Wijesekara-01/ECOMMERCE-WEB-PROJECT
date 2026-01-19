import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // TypeScript වැරදි තිබුනත් Deploy වෙනවා
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint වැරදි තිබුනත් Deploy වෙනවා
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;