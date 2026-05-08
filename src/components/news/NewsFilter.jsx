import { useMemo } from "react";
import {
  Search,
  RotateCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { debounce } from "../../utils/helpers";
import useAppStore from "../../store/appStore";
import { NEWS_CATEGORIES, NEWS_CATEGORY_LABELS } from "../../constants";

const NewsFilter = ({ onSearch, onRefresh, loading }) => {
  const store = useAppStore();
  const { selectedCategory, sortBy, searchQuery } = store;

  const handleSearchChange = useMemo(() => debounce((value) => {
    store.setSearchQuery(value);
    onSearch(value);
  }, 300), [store, onSearch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-lg p-4 mb-6"
    >
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search articles..."
          defaultValue={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => store.setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            {NEWS_CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="capitalize">
                {NEWS_CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => store.setSortBy(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="source">By Source</option>
          </select>
        </div>

        {/* Actions */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Actions
          </label>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition disabled:opacity-50"
          >
            <RotateCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsFilter;
