# ISS + AI News Intelligence Dashboard

A production-ready React + Vite dashboard for live ISS tracking, people-in-space data, categorized news intelligence, grounded AI chat, and interactive analytics.

## Features

- Live ISS tracking with 15-second refresh, manual refresh, Leaflet map, custom marker, trajectory polyline, fullscreen mode, nearest-place detection, and Haversine speed calculation.
- People in Space module with astronaut names and spacecraft.
- News dashboard with Technology, Space, AI, World, and Science categories, realtime debounced search, sorting, refresh, 15-minute localStorage caching, image cards, bookmarks, and retry states.
- AI chatbot powered by Hugging Face Mistral that receives only structured dashboard context and falls back to: `I can only answer using the dashboard's current ISS and news data.`
- Recharts analytics for ISS speed history and news category distribution with interactive category filtering.
- Premium responsive UI with glassmorphism, dark/light/auto theme persistence, sticky navbar, desktop sidebar, mobile bottom navigation, footer, toasts, skeleton styling, animated cards, realtime clock, API status, and last synced timestamp.
- Vercel serverless API proxies for ISS, geocoding, NewsAPI, and AI so production avoids mixed-content calls and keeps service tokens server-side.

## Tech Stack

React, Vite, Tailwind CSS, React Router, Zustand, Leaflet, Recharts, Axios, Framer Motion, React Hot Toast, Lucide React, localStorage.

## Project Structure

```text
api/                  Vercel serverless API proxies
src/
  api/                Axios clients
  assets/             Static assets
  components/
    common/           Navbar, sidebar, mobile nav, footer
    iss/              ISS map, stats, astronauts
    news/             News filters and cards
    chatbot/          Grounded AI chat
    charts/           Recharts visualizations
  hooks/              ISS, astronauts, theme, sidebar hooks
  layouts/            Layout-ready folder
  pages/              Dashboard routes
  services/           ISS, news, AI services
  store/              Zustand global state
  utils/              Helpers and Haversine math
  constants/          Shared constants
  styles/             Tailwind app styles
```

## Environment

Create `.env` from `.env.example`:

```env
VITE_NEWS_API_KEY=your_newsapi_key_here
VITE_AI_TOKEN=your_huggingface_token_here
```

Add the same variables in Vercel project settings for deployment.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`.

For full local serverless proxy behavior, use Vercel CLI:

```bash
vercel dev
```

## Build

```bash
npm run lint
npm run build
```

## Deployment To Vercel

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Set `VITE_NEWS_API_KEY` and `VITE_AI_TOKEN`.
4. Deploy. `vercel.json` routes API requests to serverless functions and all app routes to Vite output.

## API References

- Open Notify: ISS position and people in space
- OpenStreetMap Nominatim: reverse geocoding
- NewsAPI: latest categorized articles
- Hugging Face Inference API: `mistralai/Mistral-7B-Instruct-v0.2`

## Screenshots

Add screenshots after deploying or running locally:

- Dashboard overview
- ISS fullscreen map
- News dashboard
- Analytics charts
- AI chatbot
