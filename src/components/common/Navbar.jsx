import { useEffect, useState } from "react";
import { Menu, X, Moon, Sun, Zap, Volume2, VolumeX } from "lucide-react";
import { useTheme, useSidebar } from "../../hooks";
import useAppStore from "../../store/appStore";
import { motion } from "framer-motion";

const Navbar = () => {
  const { toggleTheme, theme } = useTheme();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const { iss, apiStatus, soundEnabled, toggleSound } = useAppStore();
  const [clock, setClock] = useState(new Date());

  const isDark = document.documentElement.classList.contains("dark");
  const online = Object.values(apiStatus).some((status) => status === "online");

  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-40 glass-dark border-b border-slate-700/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="hidden md:block p-2 hover:bg-slate-800 rounded-lg transition"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <Zap className="text-blue-500" size={24} />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                ISS Dashboard
              </h1>
            </div>
          </div>

          {/* Live Status */}
          {iss && (
            <div className="hidden sm:flex items-center gap-3 text-sm">
              <div className={`h-2 w-2 rounded-full ${online ? "bg-green-500" : "bg-amber-500"} animate-pulse`} />
              <span className="text-gray-300">
                Live • {iss.speed?.toFixed(0)} km/h
              </span>
              <span className="text-gray-500">{clock.toLocaleTimeString()}</span>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className="p-2 hover:bg-slate-800 rounded-lg transition"
              title={soundEnabled ? "Disable notification sounds" : "Enable notification sounds"}
              aria-label={soundEnabled ? "Disable notification sounds" : "Enable notification sounds"}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-slate-800 rounded-lg transition"
              title={`Current theme: ${theme}`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
