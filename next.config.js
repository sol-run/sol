/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output as standalone to improve compatibility with Cloudflare
  output: "standalone",

  // Disable type checking and linting during build for faster builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // External packages that should be processed by Next.js
  serverExternalPackages: [],

  // Optimize image handling for Cloudflare
  images: {
    unoptimized: true,
    domains: ["blob.v0.dev"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "blob.v0.dev",
      },
    ],
  },

  // Ensure proper handling of static assets
  reactStrictMode: true,

  // Remove experimental edge runtime as it's causing Node.js compatibility issues
  experimental: {
    // Remove runtime: "edge" as it's causing issues
  },
}

module.exports = nextConfig
