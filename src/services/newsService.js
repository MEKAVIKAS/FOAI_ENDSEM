import axios from "axios";
import { getStorageWithExpiration, setStorageWithExpiration } from "../utils/helpers";
import { NEWS_CATEGORIES } from "../constants";

const normalizeArticle = (article, category) => ({
  id: article.url || `${article.title}-${article.publishedAt}`,
  title: article.title || "Untitled article",
  description: article.description || "No description available.",
  content: article.content,
  image: article.urlToImage,
  author: article.author || "Unknown author",
  source: article.source?.name || article.source || "Unknown source",
  url: article.url,
  publishedAt: article.publishedAt || new Date().toISOString(),
  category,
});

/**
 * Fetch news articles for a specific category
 */
export const fetchNewsByCategory = async (category = "technology", page = 1, force = false) => {
  const cacheKey = `news_${category}_${page}`;
  const cachedData = getStorageWithExpiration(cacheKey);

  if (cachedData && !force) {
    return cachedData;
  }

  try {
    let response;
    try {
      response = await axios.get("/api/news", {
        params: { category, page, pageSize: 20 },
      });
      if (!Array.isArray(response.data?.articles)) {
        throw new Error("Local API proxy unavailable");
      }
    } catch (proxyError) {
      const apiKey = import.meta.env.VITE_NEWS_API_KEY;
      if (!apiKey) throw proxyError;

      const categoryConfig = {
        technology: { endpoint: "top-headlines", params: { category: "technology", country: "us" } },
        space: { endpoint: "everything", params: { q: "space OR NASA OR astronomy", sortBy: "publishedAt", language: "en" } },
        ai: { endpoint: "everything", params: { q: "artificial intelligence OR AI", sortBy: "publishedAt", language: "en" } },
        world: { endpoint: "top-headlines", params: { category: "general", country: "us" } },
        science: { endpoint: "top-headlines", params: { category: "science", country: "us" } },
      }[category];

      response = await axios.get(`https://newsapi.org/v2/${categoryConfig.endpoint}`, {
        params: { ...categoryConfig.params, pageSize: 20, apiKey },
      });
    }

    if (response.data && response.data.articles) {
      const articles = response.data.articles
        .filter((article) => article.title && article.url)
        .map((article) => normalizeArticle(article, category));

      setStorageWithExpiration(cacheKey, articles, 15);
      return articles;
    }
    return [];
  } catch (error) {
    console.warn("News fetch unavailable:", error.message || error);
    throw error;
  }
};

/**
 * Search news articles
 */
export const searchNews = async (query, page = 1) => {
  const cacheKey = `news_search_${query}_${page}`;
  const cachedData = getStorageWithExpiration(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: query,
        page,
        pageSize: 20,
        sortBy: "publishedAt",
        apiKey: import.meta.env.VITE_NEWS_API_KEY,
      },
    });

    if (response.data && response.data.articles) {
      const articles = response.data.articles.map((article) =>
        normalizeArticle(article, "search")
      );

      setStorageWithExpiration(cacheKey, articles, 15);
      return articles;
    }
    return [];
  } catch (error) {
    console.warn("News search unavailable:", error.message || error);
    throw error;
  }
};

/**
 * Get trending articles across all categories
 */
export const fetchTrendingArticles = async () => {
  try {
    const categoryPromises = NEWS_CATEGORIES.map((category) =>
      fetchNewsByCategory(category, 1)
    );
    const results = await Promise.all(categoryPromises);
    return results.flat().slice(0, 50);
  } catch (error) {
    console.error("Error fetching trending articles:", error);
    return [];
  }
};

/**
 * Get articles with sorting
 */
export const sortArticles = (articles, sortBy = "newest") => {
  const sorted = [...articles];

  switch (sortBy) {
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      );
    case "source":
      return sorted.sort((a, b) => a.source.localeCompare(b.source));
    default:
      return sorted;
  }
};

/**
 * Filter articles by search query
 */
export const filterArticles = (articles, query) => {
  const lowerQuery = query.toLowerCase();
  return articles.filter(
    (article) =>
      article.title.toLowerCase().includes(lowerQuery) ||
      (article.description &&
        article.description.toLowerCase().includes(lowerQuery)) ||
      article.source.toLowerCase().includes(lowerQuery)
  );
};
