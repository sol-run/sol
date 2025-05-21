/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use static export for Cloudflare Pages
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
  },

  // Ensure proper handling of static assets
  reactStrictMode: true,
}

module.exports = nextConfig
