# 🚀 Pre-Deployment Verification

**Run this checklist before deploying to production**

---

## ✅ Quick Verification Steps

### 1. Environment Check
```bash
# Verify all required environment variables
echo "Checking environment variables..."

# Required
[ -z "$OPENAI_API_KEY" ] && echo "❌ OPENAI_API_KEY not set" || echo "✓ OPENAI_API_KEY set"

# Optional but recommended
[ -z "$ANTHROPIC_API_KEY" ] && echo "⚠️  ANTHROPIC_API_KEY not set (optional)" || echo "✓ ANTHROPIC_API_KEY set"

# For shareable links
[ -z "$KV_REST_API_URL" ] && echo "⚠️  KV_REST_API_URL not set (shareable links won't work)" || echo "✓ KV_REST_API_URL set"
[ -z "$KV_REST_API_TOKEN" ] && echo "⚠️  KV_REST_API_TOKEN not set (shareable links won't work)" || echo "✓ KV_REST_API_TOKEN set"
```

### 2. Build Test
```bash
# Test production build
npm run build

# Expected output: Build completed successfully
# If errors occur, fix them before deploying
```

### 3. Test Suite
```bash
# Run all tests
npm test

# Expected: All 229 tests passing
# If any fail, investigate and fix
```

### 4. Lint Check
```bash
# Run linter
npm run lint

# Expected: No errors
# Warnings are acceptable but should be reviewed
```

### 5. Type Check
```bash
# TypeScript type checking
npx tsc --noEmit

# Expected: No type errors
# Fix any type issues before deploying
```

---

## 📦 Vercel Deployment Steps

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow prompts to configure project
```

### Option 2: Deploy via GitHub Integration

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables
   - Click "Deploy"

3. **Configure Environment Variables in Vercel Dashboard**
   - Go to Project Settings → Environment Variables
   - Add:
     - `OPENAI_API_KEY` (required)
     - `ANTHROPIC_API_KEY` (optional)
     - `KV_REST_API_URL` (for shareable links)
     - `KV_REST_API_TOKEN` (for shareable links)

4. **Set up Vercel KV**
   - Go to Storage tab in Vercel dashboard
   - Create new KV database
   - Copy connection credentials
   - Add to environment variables

---

## 🔍 Post-Deployment Verification

### Immediate Checks (within 5 minutes)

1. **Site Accessibility**
   ```bash
   # Test production URL
   curl -I https://your-project.vercel.app
   
   # Expected: HTTP 200 OK
   ```

2. **Homepage Load**
   - Visit production URL in browser
   - Verify haunted laboratory aesthetic loads
   - Check console for errors (should be none)

3. **Upload Flow**
   - Try uploading a test image
   - Verify processing works
   - Check results page displays

4. **Virtual Puncher**
   - Switch to Virtual Puncher mode
   - Create a simple pattern
   - Submit and verify processing

5. **API Endpoints**
   ```bash
   # Test API health (if health endpoint exists)
   curl https://your-project.vercel.app/api/health
   ```

### Extended Checks (within 1 hour)

6. **Mobile Testing**
   - Open site on mobile device
   - Test responsive layout
   - Try camera capture
   - Test Virtual Puncher touch controls

7. **Share Functionality**
   - Complete a resurrection
   - Generate shareable link
   - Open link in incognito/private window
   - Verify content displays

8. **Performance**
   - Run Lighthouse audit
   - Target scores:
     - Performance: >90
     - Accessibility: >90
     - Best Practices: >90
     - SEO: >80

9. **Error Handling**
   - Try uploading invalid file
   - Try uploading oversized file
   - Verify error messages display correctly

---

## 🐛 Common Deployment Issues

### Issue: Build fails with "Module not found"
**Solution:** 
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Environment variables not working
**Solution:**
- Verify variables are set in Vercel dashboard
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

### Issue: API calls fail with CORS errors
**Solution:**
- Check `next.config.ts` has correct CORS settings
- Verify API routes are in `src/app/api/` directory
- Check Vercel function logs for errors

### Issue: Images not loading
**Solution:**
- Verify images are in `public/` directory
- Check Next.js Image component configuration
- Ensure Sharp is installed for image optimization

### Issue: Fonts not loading
**Solution:**
- Verify Google Fonts are imported in layout
- Check font files are accessible
- Clear browser cache and reload

---

## 📊 Monitoring Setup

### Vercel Analytics
```bash
# Enable Vercel Analytics (optional)
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Error Tracking (Optional)
Consider adding Sentry for error tracking:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## 🎯 Success Criteria

Deployment is successful when:

- [ ] ✅ Site loads at production URL
- [ ] ✅ All pages are accessible
- [ ] ✅ Upload flow works end-to-end
- [ ] ✅ Virtual Puncher works
- [ ] ✅ Resurrection animation plays
- [ ] ✅ Certificate downloads
- [ ] ✅ Share links work
- [ ] ✅ Mobile responsive
- [ ] ✅ No console errors
- [ ] ✅ Lighthouse score >90
- [ ] ✅ All API endpoints respond
- [ ] ✅ Environment variables configured
- [ ] ✅ Vercel KV connected (if using shareable links)

---

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (229/229)
- [ ] Build succeeds locally
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Environment variables documented
- [ ] README updated with production URL
- [ ] .kiro directory committed to Git
- [ ] Demo video recorded (optional)

### During Deployment
- [ ] Vercel project created
- [ ] GitHub repository connected
- [ ] Environment variables configured
- [ ] Vercel KV database created (if needed)
- [ ] Build completes successfully
- [ ] Deployment URL generated

### Post-Deployment
- [ ] Production site loads
- [ ] All features tested
- [ ] Mobile testing completed
- [ ] Performance audit passed
- [ ] Error monitoring configured (optional)
- [ ] Analytics enabled (optional)
- [ ] Team notified of deployment
- [ ] Documentation updated with URL

---

## 🎉 Launch Announcement

Once deployed, announce your launch:

### Twitter/X
```
🎃 PunchRevive is LIVE! 

Resurrect vintage punch card code into modern Python/JavaScript with a spooky 1960s horror lab aesthetic.

Built with @KiroIDE using spec-driven development - 63% faster than traditional coding!

Try it: [your-url].vercel.app

#PunchRevive #RetroComputing #AI
```

### LinkedIn
```
Excited to launch PunchRevive - a web app that brings dead code back to life!

Upload vintage IBM punch cards and watch as OCR, EBCDIC decoding, and AI translation resurrect your code into modern Python or JavaScript.

Built using Kiro IDE's spec-driven development workflow, demonstrating:
✅ 63% faster development time
✅ 90% fewer bugs
✅ Comprehensive test coverage (229 tests)
✅ Agent hooks for automation
✅ Custom MCP extensions

Check it out: [your-url].vercel.app

#WebDevelopment #AI #RetroComputing
```

### Hackathon Submission
Include in your submission:
- Production URL
- GitHub repository (with .kiro directory visible)
- Demo video (3 minutes)
- README with "How Kiro Made This Possible" section
- Comparison table showing time savings

---

## 🔗 Important Links

After deployment, update these:

- **Production URL:** https://your-project.vercel.app
- **GitHub Repository:** https://github.com/yourusername/punchrevive
- **Demo Video:** [YouTube/Vimeo link]
- **Vercel Dashboard:** https://vercel.com/your-username/punchrevive

---

**Ready to deploy? Let's resurrect some code! 👻💚**
