# PunchRevive Deployment Guide

This guide walks you through deploying PunchRevive to Vercel.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- OpenAI API key (get from https://platform.openai.com/api-keys)
- Anthropic Claude API key (optional, for fallback - get from https://console.anthropic.com/)

## Step 1: Prepare Your Repository

1. Ensure all code is committed to your GitHub repository
2. Make sure the `.kiro` directory is included (not in `.gitignore`)
3. Verify `package.json` has the correct build scripts

## Step 2: Create Vercel Project

### Option A: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect Next.js configuration
4. Click "Deploy" (don't worry about environment variables yet)

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

## Step 3: Set Up Vercel KV (Redis Storage)

1. Go to your project dashboard on Vercel
2. Navigate to the "Storage" tab
3. Click "Create Database"
4. Select "KV" (Redis)
5. Choose a name (e.g., "punchrevive-kv")
6. Select the same region as your deployment (iad1 - US East)
7. Click "Create"

Vercel will automatically inject these environment variables:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

## Step 4: Configure Environment Variables

1. Go to your project settings on Vercel
2. Navigate to "Settings" → "Environment Variables"
3. Add the following variables:

### Required Variables

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key (starts with `sk-`) | Production, Preview, Development |
| `CLAUDE_API_KEY` | Your Claude API key (starts with `sk-ant-`) | Production, Preview, Development |

### Optional Variables

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_APP_URL` | Your production URL (e.g., `https://punchrevive.vercel.app`) | Production |

**Note:** KV variables are automatically set when you create the KV database.

## Step 5: Redeploy

After adding environment variables:

1. Go to "Deployments" tab
2. Click the three dots on the latest deployment
3. Select "Redeploy"
4. Check "Use existing Build Cache"
5. Click "Redeploy"

Or via CLI:
```bash
vercel --prod
```

## Step 6: Verify Deployment

1. Visit your production URL (e.g., `https://punchrevive.vercel.app`)
2. Test the upload functionality
3. Test the Virtual Puncher
4. Verify the resurrection animation plays
5. Check that shareable links work

### Testing Checklist

- [ ] Homepage loads with haunted laboratory theme
- [ ] Upload zone accepts PNG/JPEG/WEBP files
- [ ] Virtual Puncher grid is interactive
- [ ] OCR processes uploaded images
- [ ] Translation produces valid code
- [ ] Exorcism Report displays bug fixes
- [ ] Resurrection animation plays with sound
- [ ] Certificate downloads as PNG
- [ ] Shareable links work
- [ ] Mobile responsive layout works

## Troubleshooting

### Build Fails

**Error:** `Module not found: Can't resolve 'sharp'`
- **Solution:** Sharp is automatically installed by Vercel. If issues persist, add to `package.json` dependencies.

**Error:** `Type errors in build`
- **Solution:** Run `npm run build` locally first to catch TypeScript errors.

### API Errors

**Error:** `OpenAI API key not found`
- **Solution:** Verify `OPENAI_API_KEY` is set in environment variables and redeploy.

**Error:** `KV_REST_API_URL is not defined`
- **Solution:** Ensure Vercel KV database is created and linked to your project.

### Performance Issues

**Slow API responses:**
- Check function timeout settings in `vercel.json` (currently 30s)
- Monitor function execution time in Vercel dashboard
- Consider upgrading Vercel plan for better performance

**Large bundle size:**
- Run `npm run build` locally and check `.next/analyze` output
- Consider code splitting for heavy components

## Environment-Specific Configuration

### Development
```bash
# Create .env.local for local development
cp .env.example .env.local
# Add your API keys to .env.local
```

### Preview (Pull Requests)
- Vercel automatically creates preview deployments for PRs
- Preview deployments use the same environment variables as production
- Preview URLs: `https://punchrevive-git-[branch]-[username].vercel.app`

### Production
- Production deployment happens on push to `main` branch
- Uses production environment variables
- Custom domain can be configured in Vercel dashboard

## Custom Domain (Optional)

1. Go to project settings → "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

## Monitoring

### Vercel Analytics
- Automatically enabled for all deployments
- View in "Analytics" tab on Vercel dashboard
- Tracks Web Vitals, page views, and performance

### Error Tracking
- Check "Functions" tab for API errors
- View logs in real-time: `vercel logs [deployment-url]`
- Consider adding Sentry for advanced error tracking

## CI/CD with GitHub Actions

The project includes a GitHub Actions workflow (see task 21.2) that:
- Runs tests on every push
- Builds the project
- Deploys to Vercel automatically

This is configured in `.github/workflows/deploy.yml`.

## Cost Considerations

### Vercel Free Tier Includes:
- Unlimited deployments
- 100 GB bandwidth per month
- Serverless function execution (100 GB-hours)
- Vercel KV: 256 MB storage, 10,000 commands/day

### Potential Costs:
- OpenAI API usage (pay-per-token)
- Claude API usage (pay-per-token)
- Vercel overages if exceeding free tier

**Tip:** Monitor API usage in OpenAI/Anthropic dashboards to avoid unexpected costs.

## Security Best Practices

1. **Never commit API keys** - Always use environment variables
2. **Rotate keys regularly** - Update keys every 90 days
3. **Use read-only tokens** - For KV, use read-only token where possible
4. **Enable rate limiting** - Implement in API routes to prevent abuse
5. **Monitor usage** - Set up alerts for unusual API activity

## Rollback

If a deployment breaks production:

1. Go to "Deployments" tab
2. Find the last working deployment
3. Click three dots → "Promote to Production"

Or via CLI:
```bash
vercel rollback
```

## Support

- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Next.js Documentation: https://nextjs.org/docs

---

**Ready to resurrect some code? Deploy now and bring the dead back to life! ⚡💀**
