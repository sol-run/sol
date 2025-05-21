/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output as standalone to improve compatibility with Cloudflare
  output: "standalone",

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Ensure compatibility with Cloudflare Pages
  experimental: {
    serverComponentsExternalPackages: [],
  },

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
  swcMinify: true,
}

module.exports = nextConfig
