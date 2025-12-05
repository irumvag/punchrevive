#!/bin/bash

echo "🧹 Cleaning Next.js cache and rebuilding..."

# Remove all cache directories
rm -rf .next
rm -rf node_modules/.cache
rm -rf .swc

# Clear npm cache (optional but thorough)
npm cache clean --force 2>/dev/null || true

echo "✅ Cache cleared!"
echo ""
echo "Now run: npx next dev"
