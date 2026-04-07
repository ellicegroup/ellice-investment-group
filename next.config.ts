import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Use Vercel adapter when building on Vercel (Next.js 16 requirement)
  ...(process.env.VERCEL && {
    adapterPath: require.resolve("@next-community/adapter-vercel"),
  }),
};

export default nextConfig;
