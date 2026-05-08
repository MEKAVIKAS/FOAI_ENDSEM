import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import Chatbot from "./components/chatbot/Chatbot";
import HomePage from "./pages/HomePage";
import NewsPage from "./pages/NewsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import useAppStore from "./store/appStore";
import { useTheme, useSidebar } from "./hooks";
import "./styles/index.css";

function App() {
  const store = useAppStore();
  const { sidebarOpen } = useSidebar();
  useTheme(); // Initialize theme

  useEffect(() => {
    // Load chat history on mount
    const history = localStorage.getItem("chat_history");
    if (history) {
      try {
        const messages = JSON.parse(history);
        store.addChatMessage(messages);
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    }
  }, [store]);

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
        <Navbar />
        
        <div className="flex">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main
            className={`flex-1 transition-all duration-300 ${
              sidebarOpen ? "md:ml-64" : "md:ml-0"
            }`}
          >
            <div className="min-h-[calc(100vh-64px)] p-4 md:p-6 lg:p-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </div>
          </main>
        </div>

        {/* Floating Chatbot */}
        <Chatbot />

        {/* Toast Notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(15, 23, 42, 0.95)",
              color: "#fff",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              backdropFilter: "blur(10px)",
              borderRadius: "8px",
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;