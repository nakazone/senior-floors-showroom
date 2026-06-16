import type { NextConfig } from "next";

function getR2Hostname() {
  const raw = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim();
  if (!raw) return undefined;

  try {
    return new URL(raw).hostname;
  } catch {
    return undefined;
  }
}

const r2Hostname = getR2Hostname();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      ...(r2Hostname
        ? [
            {
              protocol: "https" as const,
              hostname: r2Hostname,
              pathname: "/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
