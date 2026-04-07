import type { NextConfig } from "next";
import { createRequire } from "module";

const _require = createRequire(import.meta.url);

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Use Vercel adapter when building on Vercel (Next.js 16 requirement)
  ...(process.env.VERCEL && {
    adapterPath: _require.resolve("@next-community/adapter-vercel"),
  }),
};

export default nextConfig;
