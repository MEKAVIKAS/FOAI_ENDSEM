import { motion } from "framer-motion";
import { useTheme } from "../hooks";
import { THEME_OPTIONS } from "../constants";
import { Copy, Check, Volume2, VolumeX, Bookmark } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import useAppStore from "../store/appStore";

const SettingsPage = () => {
  const { theme, setTheme, toggleTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const { soundEnabled, toggleSound, bookmarkedArticles } = useAppStore();

  const handleCopyEnv = async () => {
    const envExample = `VITE_NEWS_API_KEY=your_newsapi_key_here
VITE_AI_TOKEN=your_huggingface_token_here`;
    await navigator.clipboard.writeText(envExample);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-2xl"
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-400 mt-2">Manage app preferences and configuration</p>
      </motion.div>

      {/* Theme Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="text-lg font-bold mb-4">Appearance</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">Theme</label>
            <div className="flex flex-wrap gap-3">
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => setTheme(option)}
                  className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                    theme === option
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                      : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {theme === "auto"
                ? "Theme follows system preference"
                : `Currently using ${theme} mode`}
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium transition"
          >
            Toggle Theme
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="text-lg font-bold mb-4">Notifications & Saved News</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={toggleSound}
            className="flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2 font-medium text-gray-200 hover:bg-slate-700"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            {soundEnabled ? "Sound On" : "Sound Off"}
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Bookmark size={18} className="text-amber-300" />
            {bookmarkedArticles.length} bookmarked articles
          </div>
        </div>
      </motion.div>

      {/* API Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="text-lg font-bold mb-4">API Configuration</h2>
        <p className="text-sm text-gray-300 mb-4">
          The app requires API keys for News and AI features. Add them to your .env file:
        </p>

        <div className="bg-slate-800/50 rounded-lg p-4 mb-4 relative">
          <pre className="text-xs text-gray-300 overflow-x-auto">
{`VITE_NEWS_API_KEY=your_newsapi_key_here
VITE_AI_TOKEN=your_huggingface_token_here`}
          </pre>
          <button
            onClick={handleCopyEnv}
            className="absolute top-4 right-4 p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            title="Copy"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <h3 className="font-semibold text-blue-400 mb-1">Get News API Key</h3>
            <a
              href="https://newsapi.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:text-blue-200 underline"
            >
              Sign up at NewsAPI.org →
            </a>
          </div>

          <div>
            <h3 className="font-semibold text-purple-400 mb-1">Get Hugging Face Token</h3>
            <a
              href="https://huggingface.co/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:text-blue-200 underline"
            >
              Get token from Hugging Face →
            </a>
          </div>
        </div>
      </motion.div>

      {/* Cache Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="text-lg font-bold mb-4">Cache & Data</h2>
        <div className="space-y-4">
          <button
            onClick={() => {
              localStorage.clear();
              toast.success("Cache cleared!");
            }}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
          >
            Clear All Cache
          </button>

          <button
            onClick={() => {
              const data = {
                theme: localStorage.getItem("app_theme"),
                cacheSize: new Blob(
                  Object.values(localStorage).map((v) => v)
                ).size,
              };
              toast.success("App info logged to console");
              console.log("App Data:", data);
            }}
            className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition"
          >
            View App Data
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          Local storage helps the app work faster and offline. Cache is automatically
          cleared after 15 minutes.
        </p>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="text-lg font-bold mb-4">About</h2>
        <div className="space-y-2 text-sm text-gray-300">
          <p>
            <span className="text-gray-400">Version:</span>
            <span className="ml-2">1.0.0</span>
          </p>
          <p>
            <span className="text-gray-400">Built with:</span>
            <span className="ml-2">React, Vite, Tailwind CSS</span>
          </p>
          <p>
            <span className="text-gray-400">Data from:</span>
            <span className="ml-2">Open Notify, NewsAPI, Hugging Face</span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;
