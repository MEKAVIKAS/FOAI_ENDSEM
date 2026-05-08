import {
  Globe2,
  Zap,
  MapPin,
  Gauge,
} from "lucide-react";
import { motion } from "framer-motion";
import useAppStore from "../../store/appStore";

const ISSStatsCard = ({ onRefresh, loading }) => {
  const { iss, location, issPositions } = useAppStore();

  const stats = [
    {
      icon: Globe2,
      label: "Latitude",
      value: iss?.latitude?.toFixed(3) || "—",
      unit: "°",
    },
    {
      icon: Globe2,
      label: "Longitude",
      value: iss?.longitude?.toFixed(3) || "—",
      unit: "°",
    },
    {
      icon: Gauge,
      label: "Speed",
      value: iss?.speed?.toFixed(0) || "—",
      unit: "km/h",
    },
    {
      icon: MapPin,
      label: "Location",
      value: location?.city || "—",
      unit: location?.country || "",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">ISS Live Data</h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 hover:bg-slate-800 rounded-lg transition disabled:opacity-50"
          title="Refresh"
        >
          <Zap
            size={20}
            className={loading ? "animate-spin" : ""}
          />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, unit }, idx) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-slate-800/50 rounded-lg p-4 hover:bg-slate-700/50 transition"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon size={16} className="text-blue-400" />
              <span className="text-xs text-gray-400">{label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-white">{value}</span>
              <span className="text-xs text-gray-500">{unit}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400">Last Updated</p>
            <p className="text-sm font-semibold">{iss?.lastUpdate || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Tracked Positions</p>
            <p className="text-sm font-semibold">{issPositions.length}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ISSStatsCard;
