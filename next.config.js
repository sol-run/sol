/** @type {import('next').NextConfig} */
const nextConfig = {
  // Change to static output for Cloudflare compatibility
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

  // Ensure proper handling of static assets
  reactStrictMode: true,

  // Add trailing slash for better static hosting
  trailingSlash: true,
}

module.exports = nextConfig
