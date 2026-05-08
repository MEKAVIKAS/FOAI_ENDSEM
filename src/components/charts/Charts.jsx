import React from "react";
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
import { CHART_COLORS } from "../../constants";

const SpeedChart = () => {
  const { speedHistory } = useAppStore();

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

  const data = speedHistory.map((entry) => ({
    time: entry.time?.substring(0, 5) || "",
    speed: parseFloat(entry.speed) || 0,
  }));

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
  const { news } = useAppStore();

  if (!news || news.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-xl p-6 h-96 flex items-center justify-center"
      >
        <p className="text-gray-400">No news data yet</p>
      </motion.div>
    );
  }

  // Count articles by category
  const categoryCount = {};
  news.forEach((article) => {
    const category = article.category || "other";
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });

  const data = Object.entries(categoryCount).map(([category, count]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: count,
  }));

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
