# Troubleshooting Guide

## InvariantError: Expected workUnitAsyncStorage to have a store

This error occurs in Next.js 15 when there are cached build artifacts from an old directory structure.

### Solution

Run the following commands in order:

```bash
# 1. Stop the dev server (Ctrl+C if running)

# 2. Clean all cache
./fix-cache.sh

# OR manually:
rm -rf .next
rm -rf node_modules/.cache
rm -rf .swc

# 3. Reinstall dependencies (optional but recommended)
rm -rf node_modules package-lock.json
npm install

# 4. Start dev server
npm run dev
```

### If the issue persists

The error can also be caused by Next.js 15.5.x. The project has been updated to use Next.js 15.1.6 (stable, patched version):

```bash
npm install
rm -rf .next .swc node_modules/.cache
npm run dev
```

### Root Cause

The project was previously using a mixed directory structure with both `/app` and `/src/app`. This has been fixed, but Next.js cached the old structure. Clearing the cache resolves this.

### Verified Working Configuration

- Next.js: 15.1.6 (stable, patched)
- React: 19.0.0
- Node: 18+ or 20+

### What Was Fixed

1. **Directory Structure**: All app files consolidated into `/src/app/` (removed duplicate `/app/` directory)
2. **API Routes**: All dynamic routes now properly `await params` (Next.js 15 requirement)
3. **Version**: Downgraded from 15.5.6 to 15.1.6 to avoid known async storage bugs
4. **Layouts**: Updated `generateMetadata` to use `Promise<{ param }>` syntax

### Files Changed

- `/src/app/api/process/[jobId]/route.ts` - Fixed params handling
- `/src/app/api/results/[jobId]/route.ts` - Fixed params handling
- `/src/app/api/share/[id]/route.ts` - Fixed params handling
- `/src/app/share/[id]/layout.tsx` - Fixed generateMetadata params
- All root files moved to `/src/app/` directory
