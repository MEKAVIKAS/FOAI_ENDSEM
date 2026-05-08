import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";
import NewsCard from "../components/news/NewsCard";
import NewsFilter from "../components/news/NewsFilter";
import useAppStore from "../store/appStore";
import { fetchNewsByCategory, filterArticles, sortArticles } from "../services/newsService";
import toast from "react-hot-toast";

const NewsPage = () => {
  const store = useAppStore();
  const { selectedCategory, searchQuery, sortBy, news } = store;
  const [loading, setLoading] = useState(false);
  const [filteredNews, setFilteredNews] = useState(news);

  // Fetch news when category changes
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const articles = await fetchNewsByCategory(selectedCategory, 1);
        store.setNews(articles);
        setFilteredNews(articles);
        toast.success(`Loaded ${articles.length} articles`);
      } catch (error) {
        console.error("Error fetching news:", error);
        toast.error("Failed to fetch news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedCategory, store]);

  // Filter and sort when criteria changes
  useEffect(() => {
    let result = news;

    // Apply search filter
    if (searchQuery) {
      result = filterArticles(result, searchQuery);
    }

    // Apply sorting
    result = sortArticles(result, sortBy);

    setFilteredNews(result);
  }, [searchQuery, sortBy, news]);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const articles = await fetchNewsByCategory(selectedCategory, 1);
      store.setNews(articles);
      setFilteredNews(articles);
      toast.success("News refreshed!");
    } catch (error) {
      console.error("Error refreshing news:", error);
      toast.error("Failed to refresh news");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setFilteredNews(news);
      return;
    }
    // Search is handled by local filtering
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">News Dashboard</h1>
        <p className="text-gray-400 mt-2">
          Latest articles from {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
        </p>
      </motion.div>

      {/* Filters */}
      <NewsFilter
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* Articles Grid */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-12"
        >
          <Loader className="animate-spin text-blue-400" size={40} />
        </motion.div>
      ) : filteredNews && filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((article, idx) => (
            <NewsCard key={article.id || idx} article={article} index={idx} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-xl p-12 text-center"
        >
          <p className="text-gray-400 mb-4">No articles found</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* Results Count */}
      {!loading && filteredNews.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-gray-400"
        >
          Showing {filteredNews.length} of {news.length} articles
        </motion.div>
      )}
    </motion.div>
  );
};

export default NewsPage;
