# ISS + AI News Intelligence Dashboard

A modern, real-time web application that tracks the International Space Station (ISS), displays latest news articles, and includes an AI chatbot powered by Hugging Face that answers questions using only dashboard data.

## 🌟 Features

### ISS Live Tracking
- **Real-time Location Updates**: ISS coordinates updated every 15 seconds
- **Interactive Map**: Leaflet.js powered map with zoom, pan, and trajectory visualization
- **Speed Calculation**: Accurate speed calculation using Haversine formula
- **Location Detection**: Reverse geocoding to show nearest city/country
- **Statistics**: Live stats card showing latitude, longitude, speed, and tracked positions

### Astronauts in Space
- Display current number of people in space
- List astronaut names and their spacecraft
- Real-time data from Open Notify API

### News Dashboard
- **Multi-Category Support**: Technology, Space, Science, Business, General
- **Search & Filter**: Real-time search across titles and descriptions
- **Sorting Options**: Sort by newest, oldest, or source
- **Caching**: 15-minute local storage caching
- **Responsive Cards**: Beautiful news article cards with images
- **External Links**: Direct access to full articles

### AI Chatbot
- **Context-Grounded**: Only answers using dashboard data (ISS, astronauts, news)
- **Persistent History**: Stores last 30 messages in localStorage
- **Export Chat**: Download conversation history as JSON
- **Clear & Reset**: Easy chat management

### Interactive Charts
- **ISS Speed Chart**: Line chart showing speed history
- **News Distribution**: Pie chart showing articles per category
- **Real-time Updates**: Charts update automatically

### Modern UI/UX
- **Glassmorphism Design**: Beautiful frosted glass cards
- **Dark/Light Theme**: Auto-detects system preference
- **Smooth Animations**: Framer Motion transitions
- **Responsive Design**: Perfect on mobile, tablet, and desktop

## 🛠️ Tech Stack

- React 19
- Vite
- Tailwind CSS
- React Router
- Zustand
- Leaflet.js
- Recharts
- Framer Motion
- Axios
- React Hot Toast

## 📋 Requirements

- Node.js 16+
- npm or yarn

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Setup Environment Variables

Create a `.env` file in the root directory:

```env
VITE_NEWS_API_KEY=your_newsapi_key_here
VITE_AI_TOKEN=your_huggingface_token_here
```

**Get API Keys:**
- NewsAPI: https://newsapi.org
- Hugging Face: https://huggingface.co/settings/tokens

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── api/              # API client
├── components/       # React components
├── hooks/           # Custom hooks
├── pages/           # Page components
├── services/        # Services
├── store/           # State management
├── utils/           # Utilities
├── constants/       # Constants
└── styles/          # Styles
```

## 🌐 Deployment

### Vercel
1. Push to GitHub
2. Import on Vercel
3. Add environment variables
4. Deploy!

## 📞 Support

For issues, check the console or refer to API documentation.

---

Built with ❤️ using React, Vite, and Tailwind CSS

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
