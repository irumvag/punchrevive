# 🔧 Deployment Troubleshooting Checklist

## Pre-Deployment Verification

### Local Build Test
- [ ] Run `npm ci` - no errors
- [ ] Run `npm run build` - produces .next directory
- [ ] Run `npm run lint` - no critical errors
- [ ] Run `npm run test` - tests pass or are skipped

### Repository Configuration
- [ ] Push is to `main` branch (for production)
- [ ] All files are committed to git
- [ ] `.github/workflows/deploy.yml` exists and is valid
- [ ] `.env.example` documents all variables
- [ ] `package.json` has correct build scripts

## GitHub Configuration

### Secrets Setup
- [ ] Go to Settings → Secrets and variables → Actions
- [ ] `VERCEL_TOKEN` is set
- [ ] `VERCEL_ORG_ID` is set
- [ ] `VERCEL_PROJECT_ID` is set
- [ ] Optional secrets are set (API keys, DB credentials)

### Repository Settings
- [ ] GitHub Actions is enabled
- [ ] Branch protection rules don't block Actions
- [ ] Required status checks are configured (optional but recommended)

## Vercel Configuration

### Project Setup
- [ ] Project exists on Vercel
- [ ] Project is connected to GitHub repository
- [ ] Framework is set to "Next.js"
- [ ] Build command is `npm run build`
- [ ] Output directory is `.next`

### Environment Variables in Vercel
- [ ] `OPENAI_API_KEY` is set (if using AI features)
- [ ] `ANTHROPIC_API_KEY` is set (optional fallback)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- [ ] `KV_REST_API_URL` is set (if using shareable links)
- [ ] `KV_REST_API_TOKEN` is set (if using shareable links)

### Vercel Credentials for GitHub
- [ ] Vercel Token (same as VERCEL_TOKEN in GitHub)
- [ ] Org ID (same as VERCEL_ORG_ID in GitHub)
- [ ] Project ID (same as VERCEL_PROJECT_ID in GitHub)

## Common Issues & Fixes

### Build Step Fails

**Error: "npm ERR! code E404" (package not found)**
- [ ] Run `npm ci` locally to verify all packages install
- [ ] Check package.json for typos in dependencies
- [ ] Check npm registry is accessible

**Error: "TypeScript compilation failed"**
- [ ] Run `npm run build` locally to see full error
- [ ] Fix TypeScript errors in source code
- [ ] Check tsconfig.json is correct

**Error: ".next directory not found"**
- [ ] Build failed but didn't show proper error
- [ ] Check "Build Next.js application" step logs
- [ ] Look for earlier errors in build output

### Deployment Step Fails

**Error: "Missing environment variable OPENAI_API_KEY"**
- [ ] This shouldn't happen - build uses dummy values
- [ ] Check workflow is using `secrets.VARIABLE_NAME || 'dummy-value'`
- [ ] Verify `.github/workflows/deploy.yml` has fallback values

**Error: "VERCEL_TOKEN invalid" or "unauthorized"**
- [ ] Verify token in GitHub secrets is correct
- [ ] Generate new token from Vercel if in doubt
- [ ] Check token hasn't expired

**Error: "Cannot find organization" or "Project not found"**
- [ ] Verify VERCEL_ORG_ID is correct
- [ ] Verify VERCEL_PROJECT_ID is correct
- [ ] Check you're using Team ID, not User ID

**Error: "Deployment timed out"**
- [ ] Check function timeout in `vercel.json` (currently 30s)
- [ ] Review Vercel deployment logs for slow operations
- [ ] Check if API calls are timing out

### Preview Deployment Fails

**Error: "Cannot comment on PR"**
- [ ] GitHub token might have limited permissions
- [ ] Check if PR is from fork (forks have limited permissions)
- [ ] Manual PR comment action might be needed

**Preview URL not showing in PR**
- [ ] Workflow might have failed - check Actions tab
- [ ] Vercel deployment might still be in progress
- [ ] Check "Comment PR with preview URL" step logs

### Production Deployment Fails

**Error: "Production deployment cannot proceed without required secrets"**
- [ ] One or more of VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID missing
- [ ] Add missing secrets to GitHub
- [ ] Redeploy after adding secrets

**Error: Deployment succeeds but site doesn't work**
- [ ] Check environment variables are set in Vercel project settings
- [ ] Verify API keys are correct in Vercel (not dummy values)
- [ ] Check Vercel deployment logs for runtime errors
- [ ] Look for 500 errors in deployment logs

## Debugging Steps

### 1. Check GitHub Actions Logs
```
Go to GitHub → Actions → Click workflow run
Look for red X next to failed job
Click failed job to see detailed logs
Search for "error" or "failed" keywords
```

### 2. Check Vercel Deployment Logs
```
Go to Vercel project → Deployments
Click on the deployment that failed
Scroll through logs to find error messages
Look for API key issues or timeout errors
```

### 3. Test Build Locally
```bash
# Exactly as CI/CD does it
npm ci
npm run build

# If this works locally, CI/CD should work
# If this fails locally, fix it first
```

### 4. Verify Environment Variables
```bash
# Check what GitHub has
# Go to Settings → Secrets and variables → Actions
# Verify each secret is showing as "hidden" (not displaying value)

# Check what Vercel has
# Go to Vercel project → Settings → Environment Variables
# Verify each variable is set and correct
```

### 5. Test Each Step Manually

**Test Node.js setup:**
```bash
node --version  # Should be v18.x or higher
npm --version   # Should be 8.x or higher
```

**Test dependencies:**
```bash
npm ci --prefer-offline --no-audit
```

**Test build:**
```bash
npm run build
```

**Test lint:**
```bash
npm run lint
```

## Rollback Procedure

If production deployment goes wrong:

1. **Immediate Fix**
   - Go to Vercel project → Deployments
   - Find the last known good deployment
   - Click the three-dots menu
   - Click "Promote to Production"
   - Site will roll back immediately

2. **Permanent Fix**
   - Identify the problematic commit
   - Run `git revert <commit-hash>`
   - Push the revert commit to main
   - New deployment will use reverted code
   - OR: `git reset --hard HEAD~1` and `git push -f origin main`

## Success Indicators

✅ **Build Phase**
- All test steps show checkmarks
- Build job shows ✅ status
- No red errors in logs

✅ **Preview Phase** (for PRs)
- Deploy Preview job shows ✅
- Comment appears on PR
- Preview URL is accessible

✅ **Production Phase** (for main)
- Deploy Production job shows ✅
- GitHub summary shows success
- Production URL is accessible

## After Deployment

### Verification Steps
1. [ ] Visit production URL
2. [ ] Test main features (upload, puncher, generate certificate)
3. [ ] Check browser console for errors
4. [ ] Test on mobile device
5. [ ] Check that all images load
6. [ ] Test API endpoints
7. [ ] Verify environment variables are correct

### Monitoring
- [ ] Check Vercel project for any errors
- [ ] Monitor GitHub Actions for failed workflows
- [ ] Check error logs if users report issues
- [ ] Keep Vercel dashboard open for first hour

## Getting Help

### If Still Stuck
1. Check this checklist again - most issues covered
2. Review GitHub Actions logs carefully
3. Review Vercel deployment logs
4. Check similar issues on GitHub Discussions
5. Contact Vercel support if infrastructure issue
6. Contact GitHub support for Actions issues

### Information to Gather
- Full error message from logs
- Which step failed (test, build, deploy)
- Whether it's first-time deployment or re-deployment
- What changed since last successful deployment
- Screenshot of error
