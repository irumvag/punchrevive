# GitHub Actions Setup Guide

This guide explains how to configure GitHub Actions for automated testing and deployment to Vercel.

## Overview

The CI/CD pipeline automatically:
- ✅ Runs tests on every push and pull request
- 🔍 Runs linting to catch code quality issues
- 🏗️ Builds the Next.js application
- 🚀 Deploys preview environments for pull requests
- 🎯 Deploys to production on merge to main

## Required GitHub Secrets

You need to add the following secrets to your GitHub repository:

### 1. Get Vercel Credentials

#### Option A: Via Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link your project (run in project directory)
vercel link

# This creates a .vercel directory with project.json
# Extract the values from .vercel/project.json
```

The `.vercel/project.json` file contains:
```json
{
  "orgId": "team_xxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxx"
}
```

#### Option B: Via Vercel Dashboard

1. Go to your project on Vercel
2. Navigate to Settings → General
3. Find "Project ID" - this is your `VERCEL_PROJECT_ID`
4. Find "Team ID" or "User ID" - this is your `VERCEL_ORG_ID`

#### Get Vercel Token

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it "GitHub Actions"
4. Set scope to your team/account
5. Set expiration (recommend 1 year)
6. Copy the token - this is your `VERCEL_TOKEN`

### 2. Add Secrets to GitHub

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each of the following:

| Secret Name | Value | Description |
|------------|-------|-------------|
| `VERCEL_TOKEN` | `vercel_xxxxx...` | Your Vercel authentication token |
| `VERCEL_ORG_ID` | `team_xxxxx` or `user_xxxxx` | Your Vercel organization/user ID |
| `VERCEL_PROJECT_ID` | `prj_xxxxx` | Your Vercel project ID |
| `OPENAI_API_KEY` | `sk-xxxxx` | (Optional) For build-time checks |
| `CLAUDE_API_KEY` | `sk-ant-xxxxx` | (Optional) For build-time checks |

**Note:** The API keys in GitHub Secrets are only used for build validation. The actual runtime API keys should be configured in Vercel's environment variables.

## Workflow Explanation

### Workflow File: `.github/workflows/deploy.yml`

#### Job 1: Test
- Runs on every push and PR
- Installs dependencies
- Runs `npm run test` (Vitest tests)
- Runs `npm run lint` (ESLint)
- Must pass before build job runs

#### Job 2: Build
- Runs after tests pass
- Builds the Next.js application
- Uploads build artifacts for inspection
- Uses dummy API keys for build (real keys injected by Vercel)

#### Job 3: Deploy Preview (PR only)
- Runs only on pull requests
- Deploys to Vercel preview environment
- Comments on PR with preview URL
- Uses spooky themed comment message

#### Job 4: Deploy Production (main branch only)
- Runs only on push to main branch
- Deploys to Vercel production
- Creates deployment summary with haunted theme
- Automatically promotes to production URL

## Testing the Workflow

### Test on Pull Request

1. Create a new branch:
   ```bash
   git checkout -b test-deployment
   ```

2. Make a small change (e.g., update README)

3. Commit and push:
   ```bash
   git add .
   git commit -m "Test: Verify CI/CD pipeline"
   git push origin test-deployment
   ```

4. Create a pull request on GitHub

5. Watch the workflow run:
   - Go to Actions tab
   - See "Deploy to Vercel" workflow running
   - Check for preview deployment comment

### Test Production Deployment

1. Merge the PR to main branch

2. Watch the workflow run:
   - Go to Actions tab
   - See production deployment job
   - Check deployment summary

3. Verify production URL is updated

## Troubleshooting

### Workflow Fails on Test Job

**Error:** `Test suite failed to run`
- **Solution:** Run `npm run test` locally to identify failing tests
- Fix tests and push again

**Error:** `Linting errors found`
- **Solution:** Run `npm run lint` locally and fix issues
- Or run `npm run lint -- --fix` to auto-fix

### Workflow Fails on Build Job

**Error:** `Module not found`
- **Solution:** Ensure all dependencies are in `package.json`
- Run `npm install` and commit `package-lock.json`

**Error:** `Type error: ...`
- **Solution:** Fix TypeScript errors locally first
- Run `npm run build` to catch errors before pushing

### Workflow Fails on Deploy Job

**Error:** `Vercel token is invalid`
- **Solution:** Regenerate Vercel token and update GitHub secret
- Ensure token hasn't expired

**Error:** `Project not found`
- **Solution:** Verify `VERCEL_PROJECT_ID` is correct
- Run `vercel link` to get correct project ID

**Error:** `Insufficient permissions`
- **Solution:** Ensure Vercel token has deployment permissions
- Check team/organization access settings

### Preview Deployment Not Appearing

**Issue:** PR comment doesn't show preview URL
- **Solution:** Check Vercel dashboard for deployment status
- Preview URL format: `https://punchrevive-git-[branch]-[username].vercel.app`
- May take 1-2 minutes to appear

## Workflow Customization

### Change Node.js Version

Edit `.github/workflows/deploy.yml`:
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'  # Change to desired version
```

### Add Additional Test Steps

Add after the test job:
```yaml
- name: Run integration tests
  run: npm run test:integration

- name: Check test coverage
  run: npm run test:coverage
```

### Add Slack Notifications

Add to the end of deploy-production job:
```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Production deployment complete! 🎃'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
  if: always()
```

### Skip CI for Specific Commits

Add `[skip ci]` to commit message:
```bash
git commit -m "docs: Update README [skip ci]"
```

## Monitoring Deployments

### GitHub Actions Dashboard
- View all workflow runs: Repository → Actions tab
- See detailed logs for each job
- Download build artifacts if needed

### Vercel Dashboard
- View all deployments: https://vercel.com/[username]/punchrevive
- See deployment logs and function execution
- Monitor performance and errors

## Security Best Practices

1. **Never commit secrets** - Always use GitHub Secrets
2. **Rotate tokens regularly** - Update Vercel token every 6-12 months
3. **Use least privilege** - Token should only have deployment permissions
4. **Review workflow logs** - Check for exposed secrets (GitHub auto-redacts)
5. **Enable branch protection** - Require PR reviews before merging to main

## Branch Protection Rules (Recommended)

1. Go to Settings → Branches
2. Add rule for `main` branch
3. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass (select "test" and "build")
   - ✅ Require branches to be up to date
   - ✅ Include administrators

This ensures all code is tested before reaching production.

## Cost Considerations

### GitHub Actions Free Tier:
- 2,000 minutes/month for private repos
- Unlimited for public repos

### Typical Usage:
- Each workflow run: ~5-10 minutes
- 10 deployments/day = ~50-100 minutes/day
- Well within free tier for most projects

## Disabling Workflows

To temporarily disable automatic deployments:

1. Go to Actions tab
2. Select "Deploy to Vercel" workflow
3. Click "..." → "Disable workflow"

Or delete/rename `.github/workflows/deploy.yml`

## Manual Deployment

If you need to deploy manually (bypassing CI):

```bash
# Deploy preview
vercel

# Deploy production
vercel --prod
```

---

**The spirits of automation are now watching over your code! 👻⚡**
