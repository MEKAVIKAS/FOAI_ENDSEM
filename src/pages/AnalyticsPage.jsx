import React from "react";
import { motion } from "framer-motion";
import { SpeedChart, NewsDistributionChart } from "../components/charts/Charts";
import useAppStore from "../store/appStore";

const AnalyticsPage = () => {
  const { speedHistory, news, astronauts, iss } = useAppStore();

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
        <h1 className="text-3xl font-bold">Analytics & Visualization</h1>
        <p className="text-gray-400 mt-2">Real-time data analysis and insights</p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="glass rounded-lg p-6">
          <p className="text-gray-400 text-sm">Current Speed</p>
          <p className="text-3xl font-bold text-blue-400">
            {iss?.speed?.toFixed(0) || "—"} km/h
          </p>
        </div>
        <div className="glass rounded-lg p-6">
          <p className="text-gray-400 text-sm">Tracked Positions</p>
          <p className="text-3xl font-bold text-green-400">{speedHistory.length}</p>
        </div>
        <div className="glass rounded-lg p-6">
          <p className="text-gray-400 text-sm">News Articles</p>
          <p className="text-3xl font-bold text-purple-400">{news.length}</p>
        </div>
        <div className="glass rounded-lg p-6">
          <p className="text-gray-400 text-sm">Astronauts</p>
          <p className="text-3xl font-bold text-pink-400">
            {astronauts?.total || "—"}
          </p>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpeedChart />
        <NewsDistributionChart />
      </div>

      {/* Additional Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="text-lg font-bold mb-4">Data Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">ISS Statistics</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <span className="text-gray-400">Average Speed:</span>
                <span className="font-bold ml-2">
                  {speedHistory.length > 0
                    ? (
                        speedHistory.reduce((sum, s) => sum + parseFloat(s.speed || 0), 0) /
                        speedHistory.length
                      ).toFixed(0)
                    : "—"}
                  km/h
                </span>
              </li>
              <li>
                <span className="text-gray-400">Max Speed:</span>
                <span className="font-bold ml-2">
                  {speedHistory.length > 0
                    ? Math.max(...speedHistory.map((s) => parseFloat(s.speed || 0))).toFixed(0)
                    : "—"}
                  km/h
                </span>
              </li>
              <li>
                <span className="text-gray-400">Min Speed:</span>
                <span className="font-bold ml-2">
                  {speedHistory.length > 0
                    ? Math.min(...speedHistory.map((s) => parseFloat(s.speed || 0))).toFixed(0)
                    : "—"}
                  km/h
                </span>
              </li>
              <li>
                <span className="text-gray-400">Data Points:</span>
                <span className="font-bold ml-2">{speedHistory.length}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">News Statistics</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <span className="text-gray-400">Total Articles:</span>
                <span className="font-bold ml-2">{news.length}</span>
              </li>
              <li>
                <span className="text-gray-400">Categories:</span>
                <span className="font-bold ml-2">
                  {new Set(news.map((n) => n.category)).size}
                </span>
              </li>
              <li>
                <span className="text-gray-400">Sources:</span>
                <span className="font-bold ml-2">
                  {new Set(news.map((n) => n.source)).size}
                </span>
              </li>
              <li>
                <span className="text-gray-400">People in Space:</span>
                <span className="font-bold ml-2">{astronauts?.total || "—"}</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsPage;
