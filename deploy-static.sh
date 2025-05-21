#!/bin/bash

# Clean previous builds
rm -rf .next out

# Build the static site
echo "Building static site..."
npx next build

# Add the Cloudflare _headers file if it doesn't exist
if [ ! -f "out/_headers" ]; then
  echo "Creating Cloudflare _headers file..."
  echo "/*" > out/_headers
  echo "  Cache-Control: public, max-age=3600" >> out/_headers
fi

# Deploy to Cloudflare Pages
echo "Deploying to Cloudflare Pages..."
npx wrangler pages deploy out --project-name=sol-run-website

echo "Deployment complete!"
