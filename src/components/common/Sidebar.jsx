import React from "react";
import {
  Globe2,
  Newspaper,
  BarChart3,
  Settings,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../../hooks";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const { pathname } = useLocation();
  const { sidebarOpen, toggleSidebar } = useSidebar();

  const menuItems = [
    { icon: Globe2, label: "ISS Tracking", path: "/" },
    { icon: Newspaper, label: "News", path: "/news" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const isActive = (path) => pathname === path;

  return (
    <>
      {/* Desktop Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            className="hidden md:block fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-700/50 z-30"
          >
            <nav className="p-4 space-y-2">
              {menuItems.map(({ icon: Icon, label, path }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(path)
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "text-gray-300 hover:bg-slate-800"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="md:hidden fixed inset-0 top-16 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: -250 }}
              animate={{ x: 0 }}
              exit={{ x: -250 }}
              className="md:hidden fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-slate-900 border-r border-slate-700/50 z-50"
            >
              <button
                onClick={toggleSidebar}
                className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg"
              >
                <X size={20} />
              </button>
              <nav className="p-4 space-y-2 mt-8">
                {menuItems.map(({ icon: Icon, label, path }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={toggleSidebar}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(path)
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-slate-800"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{label}</span>
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
