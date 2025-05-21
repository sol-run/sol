#!/bin/bash

# Build the Next.js application
echo "Building Next.js application..."
pnpm run build

# Deploy to Cloudflare Pages
echo "Deploying to Cloudflare Pages..."
npx wrangler pages deploy .next --project-name=sol-run-website

echo "Deployment complete!"
