import React from "react";
import ISSMap from "../components/iss/ISSMap";
import ISSStatsCard from "../components/iss/ISSStatsCard";
import AstronautsCard from "../components/iss/AstronautsCard";
import { useISSTracking, useAstronauts } from "../hooks";
import { motion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import useAppStore from "../store/appStore";

const HomePage = () => {
  const { iss, loading: issLoading, refetch: refetchISS, speedHistory } = useISSTracking();
  const { astronauts, loading: astronautsLoading, error: astronautsError } = useAstronauts();
  const { fullscreenMap, toggleFullscreenMap } = useAppStore();

  if (fullscreenMap) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center"
      >
        <button
          onClick={toggleFullscreenMap}
          className="absolute top-4 right-4 z-10 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg"
          title="Exit fullscreen"
        >
          <Maximize2 size={20} />
        </button>
        <ISSMap fullscreen={true} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Stats */}
      <ISSStatsCard onRefresh={refetchISS} loading={issLoading} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <ISSMap />
            <button
              onClick={toggleFullscreenMap}
              className="absolute top-4 right-4 p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg z-10 transition"
              title="Fullscreen"
            >
              <Maximize2 size={20} />
            </button>
          </motion.div>
        </div>

        {/* Astronauts */}
        <div className="lg:col-span-1">
          <AstronautsCard
            loading={astronautsLoading}
            error={astronautsError}
          />
        </div>
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="text-lg font-bold mb-4">Quick Info</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-xs text-gray-400">ISS Altitude</p>
            <p className="text-2xl font-bold">~408 km</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-xs text-gray-400">Orbital Period</p>
            <p className="text-2xl font-bold">~92 min</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-xs text-gray-400">Speed</p>
            <p className="text-2xl font-bold">7.66 km/s</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-xs text-gray-400">Tracked Points</p>
            <p className="text-2xl font-bold">{speedHistory.length}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
