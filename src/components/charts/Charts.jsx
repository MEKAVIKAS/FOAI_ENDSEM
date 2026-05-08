import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import useAppStore from "../../store/appStore";
import { CHART_COLORS, NEWS_CATEGORIES, NEWS_CATEGORY_LABELS } from "../../constants";
import { fetchNewsByCategory } from "../../services/newsService";

const SpeedChart = () => {
  const { speedHistory } = useAppStore();
  const data = useMemo(() => speedHistory.map((entry) => ({
    time: entry.time?.substring(0, 5) || "",
    speed: parseFloat(entry.speed) || 0,
  })), [speedHistory]);

  if (!speedHistory || speedHistory.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-xl p-6 h-96 flex items-center justify-center"
      >
        <p className="text-gray-400">No speed data yet</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6"
    >
      <h3 className="text-lg font-bold mb-4">ISS Speed History</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis stroke="rgb(148, 163, 184)" />
          <YAxis stroke="rgb(148, 163, 184)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(30, 41, 59, 0.8)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "white" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="speed"
            stroke={CHART_COLORS.blue}
            dot={false}
            strokeWidth={2}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

const NewsDistributionChart = () => {
  const { newsByCategory, setSelectedCategory } = useAppStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const missingCategories = NEWS_CATEGORIES.filter(
      (category) => !newsByCategory[category]
    );

    if (missingCategories.length === 0) return;

    let cancelled = false;
    const loadCounts = async () => {
      setLoading(true);
      await Promise.allSettled(
        missingCategories.map(async (category) => {
          const articles = await fetchNewsByCategory(category, 1);
          if (!cancelled) {
            useAppStore.getState().setNewsForCategory(category, articles);
          }
        })
      );
      if (!cancelled) setLoading(false);
    };

    loadCounts();
    return () => {
      cancelled = true;
    };
  }, [newsByCategory]);

  const data = useMemo(
    () =>
      NEWS_CATEGORIES.map((category) => ({
        name: NEWS_CATEGORY_LABELS[category],
        category,
        value: newsByCategory[category]?.length || 0,
      })).filter((item) => item.value > 0),
    [newsByCategory]
  );

  if (loading && data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-xl p-6 h-96 flex items-center justify-center"
      >
        <p className="text-gray-400">Loading news distribution...</p>
      </motion.div>
    );
  }

  const colors = Object.values(CHART_COLORS);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6"
    >
      <h3 className="text-lg font-bold mb-4">News Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            isAnimationActive={true}
            onClick={(slice) => setSelectedCategory(slice.category)}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(30, 41, 59, 0.8)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "white" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export { SpeedChart, NewsDistributionChart };
