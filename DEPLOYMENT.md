# Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables set in `.env`
- [ ] API keys are valid and active
- [ ] `npm run build` completes successfully
- [ ] No console errors in dev mode
- [ ] Tested all features:
  - [ ] ISS map updates every 15 seconds
  - [ ] Astronauts data displays correctly
  - [ ] News articles load and filter works
  - [ ] AI chatbot responds only with dashboard data
  - [ ] Charts update in real-time
  - [ ] Theme toggle works and persists
  - [ ] Responsive on mobile/tablet/desktop

## Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Set environment variables
# Edit .env with your API keys

# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Deploy to Vercel (Recommended)

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables
vercel env add VITE_NEWS_API_KEY
vercel env add VITE_AI_TOKEN

# Redeploy with env vars
vercel --prod
```

### Option 2: Using GitHub Integration

1. Push code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - `VITE_NEWS_API_KEY`: Your News API key
   - `VITE_AI_TOKEN`: Your Hugging Face token
6. Click "Deploy"

### Environment Variables on Vercel

Add these in Vercel dashboard under Project Settings > Environment Variables:

```
VITE_NEWS_API_KEY = [your_newsapi_key]
VITE_AI_TOKEN = [your_huggingface_token]
```

## Deploy to Netlify

1. Build the project: `npm run build`
2. Go to https://netlify.com
3. Drag and drop the `dist` folder
4. Add environment variables in Site Settings > Build & Deploy > Environment
5. Redeploy to apply changes

## Deploy to GitHub Pages

```bash
# Update package.json homepage
# "homepage": "https://yourusername.github.io/repo-name"

# Build
npm run build

# Deploy
npm run build && git add dist -f && git commit -m "Deploy" && git push origin `git subtree split --prefix dist main`:gh-pages --force
```

## Deploy to Firebase

```bash
# Install Firebase CLI
npm i -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Build
npm run build

# Deploy
firebase deploy
```

## Performance Tips

1. **Minification**: Already enabled in production build
2. **Caching**: Configure cache headers in vercel.json
3. **CDN**: Vercel automatically uses CDN
4. **Images**: Optimize news images with external CDN
5. **Lazy Loading**: Components are code-split automatically

## Monitoring

### Error Tracking
- Check browser console for client-side errors
- Monitor API status at:
  - https://status.newsapi.org
  - https://status.huggingface.co

### Performance
- Check Lighthouse scores
- Monitor Core Web Vitals
- Check bundle size in build output

## Troubleshooting Deployment

### Blank Page
- Check browser console for errors
- Verify environment variables are set
- Check network tab for failed requests
- Verify API keys are correct

### API Not Working
- Verify VITE_NEWS_API_KEY is set
- Verify VITE_AI_TOKEN is set
- Check if API is online: newsapi.org, huggingface.co
- Check CORS headers (APIs should support CORS)

### ISS Not Updating
- ISS API requires no key, should always work
- Check browser console
- Verify network connection
- Try hard refresh (Cmd+Shift+R)

### Build Fails
- Check Node version: v16+
- Clear node_modules: `rm -rf node_modules && npm install --legacy-peer-deps`
- Check for syntax errors in modified files
- Review build log for specific errors

## Scale Considerations

### High Traffic
- Vercel auto-scales
- No database to manage
- ISS API might rate-limit (but very high limits)
- NewsAPI has rate limits based on plan

### Regional Deployment
- Vercel deploys globally by default
- Use regions config in vercel.json for specific regions
- Recommend default (all regions) for latency

## Security

- Never commit `.env` file
- Use environment variables for sensitive data
- Vercel encrypts environment variables
- Enable branch protection on main
- Use GitHub access tokens for deploying

## Maintenance

### Regular Updates
```bash
npm update
npm audit fix
```

### Monitor APIs
- Check API status pages weekly
- Update API keys annually
- Review breaking changes in dependencies

### Backup
- Keep git history
- Regular commits
- Tag releases

## Rollback

To revert to previous version on Vercel:
1. Go to Deployments
2. Click previous version
3. Click "Promote to Production"

Or using git:
```bash
git revert <commit-hash>
git push
```

## Custom Domain

1. Go to Vercel Project Settings
2. Domains
3. Add custom domain
4. Follow DNS setup instructions
5. SSL certificate auto-generated

---

For more help, check:
- README.md
- Vercel docs: https://vercel.com/docs
- Netlify docs: https://docs.netlify.com
- Vite docs: https://vitejs.dev
