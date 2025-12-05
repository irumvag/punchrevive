# 🚀 GitHub Workflow Deployment Guide

## Overview

The PunchRevive GitHub Actions workflow (`/.github/workflows/deploy.yml`) provides automated testing, building, and deployment to Vercel with full error handling and notifications.

## Workflow Jobs

### 1. Test Job
- **Runs on:** Every push to `main` and pull requests
- **Purpose:** Run tests and linting checks
- **Steps:**
  - Checkout code
  - Setup Node.js 18
  - Install dependencies with npm ci
  - Run tests (non-blocking - continues even if tests fail)
  - Run linter (non-blocking - continues even if linting fails)

### 2. Build Job
- **Depends on:** Test job (runs after)
- **Purpose:** Build the Next.js application
- **Steps:**
  - Checkout code
  - Setup Node.js 18
  - Install dependencies
  - Build Next.js application with dummy environment variables
  - Verify .next build directory exists
  - Upload build artifacts (retained for 1 day)

**Build Environment Variables:**
- `OPENAI_API_KEY`: dummy value for build (real key injected by Vercel at runtime)
- `ANTHROPIC_API_KEY`: dummy value for build
- `NEXT_PUBLIC_SUPABASE_URL`: dummy value for build
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: dummy value for build

### 3. Deploy Preview Job
- **Trigger:** Pull requests to `main`
- **Depends on:** Build job
- **Purpose:** Deploy preview URL for PR testing
- **Steps:**
  - Checkout code
  - Verify Vercel secrets are configured (warnings only)
  - Deploy to Vercel preview environment
  - Comment on PR with deployment status

### 4. Deploy Production Job
- **Trigger:** Push to `main` branch only
- **Depends on:** Build job
- **Purpose:** Deploy to production
- **Steps:**
  - Checkout code
  - Verify all required secrets are present (fails if missing)
  - Deploy to Vercel with production flag
  - Verify deployment completed
  - Create GitHub summary (success or failure)

**Production Environment Variables:**
- All secrets from Vercel project settings are passed through
- Real API keys used for production deployment

## Required Secrets

Configure these in your GitHub repository settings under **Settings → Secrets and variables → Actions**:

### Vercel Authentication (Required)
- `VERCEL_TOKEN` - Personal access token from Vercel
- `VERCEL_ORG_ID` - Organization ID from Vercel
- `VERCEL_PROJECT_ID` - Project ID from Vercel

### Application Secrets (Optional but Recommended)
- `OPENAI_API_KEY` - OpenAI API key for code modernization
- `ANTHROPIC_API_KEY` - Anthropic Claude API key (fallback)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `KV_REST_API_URL` - Vercel KV database URL
- `KV_REST_API_TOKEN` - Vercel KV token

## How to Set Up

### Step 1: Get Vercel Credentials
1. Go to [vercel.com](https://vercel.com)
2. Go to Settings → Tokens
3. Create a new token and copy it
4. Go to your project → Settings → Copy org ID and project ID

### Step 2: Add GitHub Secrets
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret" for each:
   - `VERCEL_TOKEN` = (token from Step 1)
   - `VERCEL_ORG_ID` = (org ID from Step 1)
   - `VERCEL_PROJECT_ID` = (project ID from Step 1)

### Step 3: Add Application Secrets (Optional)
Add the same variables to Vercel project settings:
1. Go to Vercel project → Settings → Environment Variables
2. Add your API keys and credentials

### Step 4: Test the Workflow
1. Make a commit and push to main
2. Go to GitHub repository → Actions
3. Watch the workflow run
4. Check logs for any issues

## Error Handling

### Build Failures
- Dummy environment variables are used so build never fails due to missing API keys
- Build must complete successfully to proceed with deployment
- If build fails, check the "Build Next.js application" step logs

### Missing Vercel Secrets
- Preview deployments: Warnings only (deployment may fail)
- Production deployments: Fails immediately with clear error message
- Configure secrets in GitHub before deploying to production

### Deployment Failures
- Vercel deployment action will show status in workflow
- If deployment fails, check Vercel project logs
- GitHub summary provides failure notification

## Monitoring Deployments

### View Workflow Status
1. Go to GitHub repository → Actions tab
2. Click on the workflow run
3. Check each job's status and logs

### View Deployment Status
1. Go to Vercel project dashboard
2. Check recent deployments
3. Click on deployment to see details and logs

### PR Preview URLs
- Comment is automatically added to each PR
- Preview URL shown in Vercel deployment comment
- Preview URL available immediately after deployment succeeds

## Troubleshooting

### Workflow stuck in queue
- Check GitHub Actions is enabled for your repository
- Check runner quota hasn't been exceeded
- Restart workflow manually from Actions tab

### Build fails with module errors
- Run `npm ci && npm run build` locally first
- Check console output for missing packages
- Verify .github/workflows/deploy.yml syntax

### Deployment fails silently
- Check Vercel project logs: Vercel Dashboard → Deployments
- Verify all secrets are set correctly
- Check that project is connected to the right GitHub repository

### Preview deployment fails on PR
- Verify `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` are set
- Check PR is to `main` branch
- Look at workflow logs for detailed error

### Production deployment fails
- Verify all three Vercel secrets are present
- Check GitHub repository settings → Secrets
- Ensure you're pushing to `main` branch (not staging or develop)
- Check Vercel project settings for any configuration issues

## Best Practices

1. **Always test locally first**
   ```bash
   npm ci
   npm run build
   ```

2. **Use semantic commit messages**
   - Helps identify when issues were introduced
   - Makes rollback easier if needed

3. **Monitor deployment logs**
   - Check GitHub Actions logs after each push
   - Check Vercel deployment logs for runtime issues

4. **Keep dependencies updated**
   - Regularly update packages for security patches
   - Test locally before pushing to main

5. **Add environment variables before deploying**
   - Don't wait until deployment fails to add secrets
   - Double-check variable names match exactly

## Recovery Steps

### If Production Deployment Fails
1. Identify the issue in workflow logs
2. Fix the issue locally and test
3. Commit and push to main
4. Monitor the new deployment attempt

### If You Need to Rollback
1. Go to Vercel project → Deployments
2. Click on previous successful deployment
3. Click "Promote to Production"
4. Or revert commit in GitHub and push

## Environment-Specific Notes

### Development (.env.local)
- Use dummy or test API keys
- Can leave most variables empty
- App functions with limited features

### Preview (Pull Requests)
- Uses same secrets as production
- Fully functional with all features
- Preview URL available for testing

### Production (Vercel)
- Uses real API keys from GitHub secrets
- All features enabled
- Critical for judges and end users

## CI/CD Pipeline Flow

```
GitHub Push/PR
    ↓
Test Job (lint, test)
    ↓
Build Job (next build)
    ↓
├─→ [If PR] Deploy Preview Job
│       ↓
│   Preview URL Comment
│
└─→ [If Main Push] Deploy Production Job
        ↓
    Production Deployment
        ↓
    Success/Failure Notification
```

## Support

For workflow issues:
1. Check this guide first
2. Review GitHub Actions logs
3. Check Vercel project logs
4. Look for similar issues in GitHub discussions
5. Contact Vercel support if infrastructure issue
