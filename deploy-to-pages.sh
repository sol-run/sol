#!/bin/bash

# Clean previous builds
rm -rf .next out

# Build the static site
echo "Building static site..."
next build

# Create Cloudflare _headers file for caching
echo "Creating Cloudflare _headers file..."
cat > out/_headers << EOL
/*
  Cache-Control: public, max-age=3600
EOL

# Deploy to Cloudflare Pages using direct upload
echo "Deploying to Cloudflare Pages..."
npx wrangler pages publish out --project-name=sol2 --branch=main

echo "Deployment complete!"
