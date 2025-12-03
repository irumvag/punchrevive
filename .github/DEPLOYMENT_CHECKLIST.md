# 🚀 Deployment Checklist

Use this checklist to ensure smooth deployment to Vercel.

## Pre-Deployment Checklist

### Local Testing
- [ ] All tests pass: `npm run test`
- [ ] No linting errors: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] App runs locally: `npm run dev`

### Code Quality
- [ ] All features implemented and working
- [ ] No console errors in browser
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] All animations and sounds working
- [ ] Shareable links functional

### Documentation
- [ ] README.md is up to date
- [ ] DEPLOYMENT.md reviewed
- [ ] .env.example includes all required variables
- [ ] Code comments are clear

## Vercel Setup Checklist

### Initial Setup
- [ ] Vercel account created
- [ ] GitHub repository connected to Vercel
- [ ] Vercel project created
- [ ] Vercel KV database created and linked

### Environment Variables
- [ ] `OPENAI_API_KEY` set in Vercel
- [ ] `CLAUDE_API_KEY` set in Vercel (optional)
- [ ] KV variables auto-configured (verify in settings)
- [ ] `NEXT_PUBLIC_APP_URL` set (optional)

### GitHub Actions Setup
- [ ] `VERCEL_TOKEN` added to GitHub Secrets
- [ ] `VERCEL_ORG_ID` added to GitHub Secrets
- [ ] `VERCEL_PROJECT_ID` added to GitHub Secrets
- [ ] Workflow file exists: `.github/workflows/deploy.yml`

## Deployment Checklist

### First Deployment
- [ ] Push code to main branch
- [ ] GitHub Actions workflow runs successfully
- [ ] Vercel deployment completes
- [ ] Production URL is accessible
- [ ] Test all major features on production

### Feature Deployments
- [ ] Create feature branch
- [ ] Make changes and commit
- [ ] Push to GitHub
- [ ] Create pull request
- [ ] Preview deployment created automatically
- [ ] Test preview deployment
- [ ] Merge to main after approval
- [ ] Production deployment automatic

## Post-Deployment Verification

### Functionality Tests
- [ ] Homepage loads with haunted theme
- [ ] Upload zone accepts images
- [ ] Virtual Puncher is interactive
- [ ] OCR processes images correctly
- [ ] Translation produces valid code
- [ ] Exorcism Report displays
- [ ] Resurrection animation plays
- [ ] Sound effects work
- [ ] Certificate downloads
- [ ] Shareable links work
- [ ] Mobile layout responsive

### Performance Tests
- [ ] Page load time < 3 seconds
- [ ] Lighthouse score > 80
- [ ] No console errors
- [ ] API responses < 10 seconds
- [ ] Images load properly

### API Tests
- [ ] OpenAI API calls working
- [ ] Claude fallback working (if configured)
- [ ] Vercel KV storage working
- [ ] Rate limiting functional
- [ ] Error handling working

## Monitoring Checklist

### Daily Monitoring
- [ ] Check Vercel dashboard for errors
- [ ] Monitor API usage (OpenAI/Claude)
- [ ] Check function execution times
- [ ] Review error logs

### Weekly Monitoring
- [ ] Review Vercel analytics
- [ ] Check bandwidth usage
- [ ] Monitor KV storage usage
- [ ] Review GitHub Actions usage

## Troubleshooting Quick Reference

### Build Fails
1. Check GitHub Actions logs
2. Run `npm run build` locally
3. Fix TypeScript/ESLint errors
4. Push fix and retry

### API Errors
1. Verify environment variables in Vercel
2. Check API key validity
3. Monitor API rate limits
4. Review function logs

### KV Errors
1. Verify KV database is linked
2. Check KV environment variables
3. Monitor KV storage limits
4. Review KV command usage

### Performance Issues
1. Check function timeout settings
2. Optimize images and assets
3. Review bundle size
4. Consider caching strategies

## Emergency Procedures

### Rollback Production
```bash
# Via Vercel CLI
vercel rollback

# Or via Vercel Dashboard:
# Deployments → Previous deployment → Promote to Production
```

### Disable Automatic Deployments
1. Go to GitHub Actions
2. Disable "Deploy to Vercel" workflow
3. Deploy manually when ready

### Emergency Hotfix
1. Create hotfix branch from main
2. Make minimal fix
3. Test locally
4. Push and create PR
5. Merge immediately after CI passes
6. Monitor production deployment

## Success Criteria

Your deployment is successful when:
- ✅ All tests pass in CI/CD
- ✅ Production URL is accessible
- ✅ All features work as expected
- ✅ No console errors
- ✅ Performance metrics are good
- ✅ API calls are working
- ✅ Shareable links function
- ✅ Mobile experience is smooth

---

**May your deployments be swift and your resurrections successful! ⚡💀**
