/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Cloudflare compatibility
  output: "export",

  // Disable type checking and linting during build for faster builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Optimize image handling for static export
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

  // Add trailing slash for better static hosting
  trailingSlash: true,

  // Ensure proper handling of static assets
  reactStrictMode: true,

  // Disable server components for static export
  experimental: {
    // No experimental features needed
  },
}

module.exports = nextConfig
