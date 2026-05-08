const categoryQueries = {
  technology: { endpoint: "top-headlines", params: { category: "technology", country: "us" } },
  space: { endpoint: "everything", params: { q: "space OR NASA OR astronomy", sortBy: "publishedAt", language: "en" } },
  ai: { endpoint: "everything", params: { q: "artificial intelligence OR AI", sortBy: "publishedAt", language: "en" } },
  world: { endpoint: "top-headlines", params: { category: "general", country: "us" } },
  science: { endpoint: "top-headlines", params: { category: "science", country: "us" } },
};

export default async function handler(request, response) {
  response.setHeader("Access-Control-Allow-Origin", "*");

  const apiKey = process.env.VITE_NEWS_API_KEY;
  if (!apiKey) {
    return response.status(500).json({ message: "VITE_NEWS_API_KEY is not configured" });
  }

  const category = String(request.query.category || "technology").toLowerCase();
  const pageSize = String(request.query.pageSize || "20");
  const config = categoryQueries[category] || categoryQueries.technology;
  const params = new URLSearchParams({
    ...config.params,
    pageSize,
    apiKey,
  });

  try {
    const upstream = await fetch(`https://newsapi.org/v2/${config.endpoint}?${params}`);
    const data = await upstream.json();

    if (!upstream.ok) {
      return response.status(upstream.status).json(data);
    }

    return response.status(200).json(data);
  } catch (error) {
    return response.status(502).json({
      message: "Unable to fetch news",
      error: error.message,
    });
  }
}
