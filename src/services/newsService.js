import { newsApi } from "../api/client";
import { getStorageWithExpiration, setStorageWithExpiration } from "../utils/helpers";
import { NEWS_CATEGORIES } from "../constants";

/**
 * Fetch news articles for a specific category
 */
export const fetchNewsByCategory = async (category = "general", page = 1) => {
  const cacheKey = `news_${category}_${page}`;
  const cachedData = getStorageWithExpiration(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await newsApi.get("/top-headlines", {
      params: {
        category,
        page,
        pageSize: 20,
        apiKey: import.meta.env.VITE_NEWS_API_KEY,
      },
    });

    if (response.data && response.data.articles) {
      const articles = response.data.articles.map((article) => ({
        id: article.url,
        title: article.title,
        description: article.description,
        content: article.content,
        image: article.urlToImage,
        author: article.author,
        source: article.source.name,
        url: article.url,
        publishedAt: article.publishedAt,
        category,
      }));

      setStorageWithExpiration(cacheKey, articles, 15);
      return articles;
    }
    return [];
  } catch (error) {
    console.error("Error fetching news:", error);
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
    const response = await newsApi.get("/everything", {
      params: {
        q: query,
        page,
        pageSize: 20,
        sortBy: "publishedAt",
        apiKey: import.meta.env.VITE_NEWS_API_KEY,
      },
    });

    if (response.data && response.data.articles) {
      const articles = response.data.articles.map((article) => ({
        id: article.url,
        title: article.title,
        description: article.description,
        content: article.content,
        image: article.urlToImage,
        author: article.author,
        source: article.source.name,
        url: article.url,
        publishedAt: article.publishedAt,
        category: "search",
      }));

      setStorageWithExpiration(cacheKey, articles, 15);
      return articles;
    }
    return [];
  } catch (error) {
    console.error("Error searching news:", error);
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
