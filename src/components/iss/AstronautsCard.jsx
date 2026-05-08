import { Users, Loader } from "lucide-react";
import { motion } from "framer-motion";
import useAppStore from "../../store/appStore";

const AstronautsCard = ({ loading, error }) => {
  const { astronauts } = useAppStore();

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center justify-center h-64">
          <Loader className="animate-spin text-blue-400" size={32} />
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-xl p-6 bg-red-500/10 border border-red-500/20"
      >
        <p className="text-red-400 text-sm">{error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Users className="text-blue-400" size={24} />
        <h2 className="text-xl font-bold">
          People in Space ({astronauts?.total || 0})
        </h2>
      </div>

      {astronauts?.list && astronauts.list.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {astronauts.list.map((astro, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition"
            >
              <div>
                <p className="font-semibold text-white">{astro.name}</p>
                <p className="text-sm text-gray-400">{astro.craft}</p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-8">No astronauts data available</p>
      )}
    </motion.div>
  );
};

export default AstronautsCard;
