import React from "react";
import { ExternalLink, Calendar, User, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { formatTimeAgo, truncateText } from "../../utils/helpers";

const NewsCard = ({ article, index }) => {
  const handleBookmark = (e) => {
    e.preventDefault();
    // TODO: Implement bookmarking
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass rounded-lg overflow-hidden hover:shadow-lg hover:shadow-blue-500/10 transition group"
    >
      {/* Image */}
      {article.image && (
        <div className="relative h-48 overflow-hidden bg-slate-800">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            onError={(e) => (e.target.style.display = "none")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Badge */}
        <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full mb-3">
          {article.category}
        </span>

        {/* Title */}
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {truncateText(article.description || "", 100)}
        </p>

        {/* Meta */}
        <div className="space-y-2 mb-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>{formatTimeAgo(new Date(article.publishedAt).getTime() / 1000)}</span>
          </div>
          <div className="flex items-center gap-2">
            <User size={14} />
            <span>{article.author || article.source}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
          >
            <Eye size={16} />
            Read Full Article
            <ExternalLink size={14} />
          </a>
          <button
            onClick={handleBookmark}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
            title="Bookmark"
          >
            📌
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default NewsCard;
