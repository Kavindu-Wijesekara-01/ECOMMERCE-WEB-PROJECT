import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // TypeScript වැරදි තිබුනත් Deploy වෙනවා
    ignoreBuildErrors: true,
  },
  
};

export default nextConfig;