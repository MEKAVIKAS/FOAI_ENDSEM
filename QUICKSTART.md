# Quick Start Guide

## 1️⃣ Installation (2 minutes)

```bash
# Install dependencies
npm install --legacy-peer-deps
```

## 2️⃣ Get API Keys (5 minutes)

### Get NewsAPI Key
1. Go to https://newsapi.org
2. Sign up for a free account
3. Copy your API key from dashboard
4. Paste in `.env` file as `VITE_NEWS_API_KEY`

### Get Hugging Face Token
1. Go to https://huggingface.co/settings/tokens
2. Create a new token with "Read" permission
3. Copy the token
4. Paste in `.env` file as `VITE_AI_TOKEN`

## 3️⃣ Configure .env

```bash
# Edit .env file
nano .env
```

Add your keys:
```
VITE_NEWS_API_KEY=your_key_here
VITE_AI_TOKEN=your_token_here
```

Save and exit (Ctrl+X for nano)

## 4️⃣ Run Locally (1 minute)

```bash
# Start development server
npm run dev
```

Visit: **http://localhost:5173**

## 🎯 What to Expect

When you start the app, you'll see:

### Home Page - ISS Tracking
- 📍 **Live Map**: Shows ISS location with trajectory
- 📊 **Stats Card**: Displays coordinates, speed, location
- 👨‍🚀 **Astronauts**: Shows people currently in space
- 📈 **Quick Info**: ISS facts and data points

### News Page
- 📰 **News Feed**: Latest articles by category
- 🔍 **Search**: Search across all articles
- 🏷️ **Categories**: Technology, Space, Science, Business, General
- 📊 **Filter**: Sort by newest, oldest, or source

### Analytics Page
- 📉 **Speed Chart**: ISS speed history visualization
- 📊 **News Distribution**: Articles per category pie chart
- 📈 **Statistics**: Aggregate data and metrics

### AI Chatbot
- 💬 **Chat Button**: Floating button (bottom-right)
- 🤖 **Smart Responses**: Only uses dashboard data
- 💾 **History**: Saves last 30 messages
- 💾 **Export**: Download chat as JSON

### Settings
- 🌙 **Theme Toggle**: Light/Dark/Auto modes
- 🔑 **API Setup**: Instructions for adding keys
- 🧹 **Cache Clear**: Clear local storage

## 🚀 Deploy to Vercel (1 minute)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables when prompted
```

## 🐛 Troubleshooting

### News not loading?
- Check VITE_NEWS_API_KEY in .env
- Verify API key at newsapi.org
- Check browser console

### Chatbot not responding?
- Check VITE_AI_TOKEN in .env
- First request may take 10-15 seconds (model loading)
- Check Hugging Face account status

### Map not showing?
- Refresh the page
- Check browser console for errors
- Verify internet connection

### Build fails?
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install --legacy-peer-deps
npm run build
```

## ✨ Features Overview

| Feature | Status | Realtime |
|---------|--------|----------|
| ISS Location | ✅ Live | Every 15s |
| Astronauts Data | ✅ Live | Every 5m |
| News Articles | ✅ Cached | Every 15m |
| Speed Chart | ✅ Live | Realtime |
| AI Chatbot | ✅ Working | On demand |
| Dark Mode | ✅ Persistent | Instant |
| Responsive | ✅ Mobile-First | Adaptive |

## 📱 Responsive Design

- **Mobile** (< 768px): Full-screen optimized
- **Tablet** (768-1024px): Sidebar toggle
- **Desktop** (> 1024px): Full sidebar
- **Ultra-wide** (> 1536px): Optimized layout

## 🔐 Privacy

- ✅ No personal data stored
- ✅ API keys only in .env (not committed)
- ✅ Public APIs only
- ✅ No tracking or analytics
- ✅ localStorage only for cache & theme

## 📚 Documentation

- **README.md**: Full documentation
- **DEPLOYMENT.md**: Detailed deployment guide
- **.env.example**: Environment template
- **Component files**: Inline code comments

## 🎓 Learn More

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [NewsAPI](https://newsapi.org/docs)
- [Hugging Face](https://huggingface.co/docs)
- [Open Notify](http://open-notify.org)

## 💡 Tips

1. **Search Optimization**: Searches are debounced (300ms)
2. **Caching Strategy**: Smart cache with 15-minute expiry
3. **Performance**: Code-split and optimized for fast loading
4. **Offline**: Map and cached data work offline
5. **Keyboard**: Press `h` in terminal for dev server help

## 🆘 Need Help?

1. Check console (F12) for errors
2. Read DEPLOYMENT.md
3. Check API status pages
4. Review .env configuration
5. Try hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

---

**Ready to explore?** 🚀

Start the dev server:
```bash
npm run dev
```

Have fun! 🎉
