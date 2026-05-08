import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Trash2,
  Download,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useAppStore from "../../store/appStore";
import { sendChatMessage, saveChatMessage, getChatHistory } from "../../services/aiService";
import toast from "react-hot-toast";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(() => getChatHistory());
  const [loading, setLoading] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const messagesEndRef = useRef(null);
  const store = useAppStore();
  const { iss, astronauts, news, newsByCategory, speedHistory } = store;

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const buildContext = () => ({
    iss: iss ? {
      latitude: iss.latitude,
      longitude: iss.longitude,
      speed: iss.speed,
      lastUpdate: iss.lastUpdate,
      location: store.location,
    } : null,
    speedHistory: speedHistory?.slice(-5) || [],
    astronauts: astronauts ? {
      total: astronauts.total,
      list: astronauts.list?.map(a => ({
        name: a.name,
        craft: a.craft,
      })) || [],
    } : null,
    news: Object.values(newsByCategory || {})
      .flat()
      .concat(news || [])
      .filter((article, index, all) => all.findIndex((item) => item.id === article.id) === index)
      .slice(0, 12)
      .map(n => ({
        title: n.title,
        description: n.description,
        source: n.source,
        category: n.category,
        publishedAt: n.publishedAt,
      })) || [],
  });

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    const userMsg = saveChatMessage(message, "user");
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);
    store.setApiStatus("ai", "loading");

    try {
      const context = buildContext();
      const response = await sendChatMessage(message, context);
      const aiMsg = saveChatMessage(response, "assistant");
      setMessages((prev) => [...prev, aiMsg]);
      store.setApiStatus("ai", "online");
    } catch (error) {
      console.error("Chat error:", error);
      store.setApiStatus("ai", "error");
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem("chat_history");
    setMessages([]);
    setConfirmClear(false);
    toast.success("Chat cleared");
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(messages, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chat-export-${Date.now()}.json`;
    link.click();
    toast.success("Chat exported");
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg shadow-blue-500/50 flex items-center justify-center hover:shadow-blue-500/70 transition"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-48px)] h-96 glass rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
              <h3 className="font-bold flex items-center gap-2">
                <MessageCircle size={20} className="text-blue-400" />
                ISS AI Assistant
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  className="p-1 hover:bg-slate-700 rounded-lg transition"
                  title="Export chat"
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={() => setConfirmClear(true)}
                  className="p-1 hover:bg-red-600/20 text-red-400 rounded-lg transition"
                  title="Clear chat"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-gray-500 text-sm">
                  <p>
                    Hello. I can answer questions about the ISS and news data.
                    <br />
                    Ask me anything!
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg max-w-xs ${
                        msg.sender === "user"
                          ? "bg-blue-600/20 border border-blue-500/30 text-white"
                          : "bg-slate-700/50 border border-slate-600/50 text-gray-200"
                      }`}
                    >
                      <p className="text-sm break-words">{msg.text}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2 items-center"
                >
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200" />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-slate-700/50 bg-slate-900/50"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask something..."
                  disabled={loading}
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmClear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-chat-title"
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              className="glass w-full max-w-sm rounded-lg p-5 shadow-2xl"
            >
              <div className="mb-4 flex items-center gap-3">
                <AlertTriangle className="text-amber-400" size={22} />
                <h3 id="clear-chat-title" className="font-bold">
                  Clear conversation?
                </h3>
              </div>
              <p className="text-sm text-gray-300">
                This removes the saved local chat history and cannot be undone.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setConfirmClear(false)}
                  className="rounded-lg bg-slate-700 px-4 py-2 text-sm hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClear}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-700"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
