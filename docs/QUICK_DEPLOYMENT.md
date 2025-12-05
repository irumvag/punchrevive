# ⚡ Quick Deployment Setup

## One-Minute Setup

### 1. Add GitHub Secrets
```bash
# In your GitHub repo: Settings → Secrets and variables → Actions
# Add these three secrets from your Vercel account:

VERCEL_TOKEN=<your-vercel-token>
VERCEL_ORG_ID=<your-org-id>
VERCEL_PROJECT_ID=<your-project-id>
```

### 2. (Optional) Add API Keys
For full features, also add to GitHub secrets:
```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 3. Push to Main
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 4. Watch It Deploy
- Go to GitHub → Actions
- Watch the workflow run
- Vercel will deploy when build succeeds

## Getting Vercel Credentials

### VERCEL_TOKEN
1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click "Create"
3. Name it "GitHub Actions"
4. Copy the token (save it somewhere safe)

### VERCEL_ORG_ID & VERCEL_PROJECT_ID
1. Go to your Vercel project dashboard
2. Go to Settings
3. Copy "Team ID" (this is ORG_ID)
4. Copy "Project ID" (this is PROJECT_ID)

## Workflow Stages

```
Push to main/PR
    ↓
✅ Test & Lint (skips errors, continues)
    ↓
✅ Build (must succeed)
    ↓
[If PR] Deploy Preview
[If main] Deploy Production
    ↓
✅ GitHub comment with status
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Run `npm run build` locally first |
| Deployment fails | Check Vercel secrets are set |
| Preview URL not in PR | Make sure you're on `main` branch |
| Production won't deploy | Verify all 3 Vercel secrets |

## For Local Testing

```bash
# Test the build locally first
npm ci
npm run build

# If it works locally, it will work in CI/CD
```

## Features

✅ **Automatic on every push to main**
✅ **PR preview deployments**
✅ **Error handling & notifications**
✅ **No manual steps needed after setup**
✅ **Instant feedback in GitHub**

## Status Checks

After pushing:
1. Check **Actions** tab in GitHub
2. Click the workflow run
3. Watch each job:
   - 🟡 Running
   - ✅ Success
   - ❌ Failed

Deployment successful when all 4 jobs pass!
