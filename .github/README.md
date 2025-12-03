# GitHub Configuration

This directory contains GitHub-specific configuration files for PunchRevive.

## Files

### `.github/workflows/deploy.yml`
Automated CI/CD pipeline that:
- Runs tests on every push and PR
- Builds the Next.js application
- Deploys preview environments for PRs
- Deploys to production on merge to main

### `.github/SETUP.md`
Comprehensive guide for setting up GitHub Actions with Vercel, including:
- How to get Vercel credentials
- Adding secrets to GitHub
- Workflow explanation
- Troubleshooting tips

### `.github/DEPLOYMENT_CHECKLIST.md`
Quick reference checklist for deployments, covering:
- Pre-deployment verification
- Vercel setup steps
- Post-deployment testing
- Monitoring and troubleshooting

## Quick Start

1. **Set up Vercel:**
   - Create account at https://vercel.com
   - Import your GitHub repository
   - Create Vercel KV database

2. **Configure GitHub Secrets:**
   - Add `VERCEL_TOKEN`
   - Add `VERCEL_ORG_ID`
   - Add `VERCEL_PROJECT_ID`

3. **Deploy:**
   - Push to main branch
   - GitHub Actions automatically deploys
   - Check Actions tab for status

## Documentation

- Full deployment guide: See `/DEPLOYMENT.md` in project root
- GitHub Actions setup: See `SETUP.md` in this directory
- Deployment checklist: See `DEPLOYMENT_CHECKLIST.md` in this directory

---

**The spirits of automation guide your deployments! 👻⚡**
