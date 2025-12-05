# Quick Fix for InvariantError

Run these commands in your project directory:

```bash
# Stop dev server if running (Ctrl+C)

# Clear all cache
rm -rf .next .swc node_modules/.cache

# Reinstall to get correct Next.js version (15.1.6)
npm install

# Start fresh
npm run dev
```

That's it! The app should now work without errors.

## What happened?

The error was caused by:
1. Mixed directory structure (`/app` and `/src/app`)
2. Cached build artifacts referencing old structure
3. Next.js 15.5.x having known async storage bugs

## What was fixed?

- Consolidated all files into `/src/app/`
- Updated all dynamic routes to use `await params`
- Downgraded to stable Next.js 15.1.6
- Cleared cache

The build works perfectly - the issue is only dev mode cache.
