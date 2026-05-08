import React from "react";
import { Menu, X, Moon, Sun, Zap } from "lucide-react";
import { useTheme, useSidebar } from "../../hooks";
import useAppStore from "../../store/appStore";
import { motion } from "framer-motion";

const Navbar = () => {
  const { toggleTheme, theme } = useTheme();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const { iss } = useAppStore();

  const isDark = document.documentElement.classList.contains("dark");

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
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-gray-300">
                Live • {iss.speed?.toFixed(0)} km/h
              </span>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-2">
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
