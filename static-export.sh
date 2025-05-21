#!/bin/bash

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf .next out

# Build the Next.js application with static export
echo "Building Next.js application with static export..."
pnpm run build

# Deploy to Cloudflare Pages
echo "Deploying to Cloudflare Pages..."
npx wrangler pages deploy out --project-name=sol2

echo "Deployment complete!"
