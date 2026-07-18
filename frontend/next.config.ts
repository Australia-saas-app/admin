import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - Bypass TS error for valid Next.js properties
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
} as any;

export default nextConfig;
