import axios from "axios";

/**
 * Send message to AI chatbot with context
 */
export const sendChatMessage = async (message, context) => {
  try {
    if (!context?.iss && !context?.astronauts && (!context?.news || context.news.length === 0)) {
      return "I can only answer using the dashboard's current ISS and news data.";
    }

    const response = await axios.post("/api/ai", { message, context });

    if (response.data?.answer) {
      return response.data.answer;
    }

    return "I can only answer using the dashboard's current ISS and news data.";
  } catch (error) {
    console.error("Error sending chat message:", error);

    if (error.response?.status === 503) {
      return "The AI service is currently loading. Please try again in a moment using the dashboard data.";
    }

    if (
      error.message.includes("AI Token not configured") ||
      error.message.includes("401")
    ) {
      return "AI service not configured. Please add VITE_AI_TOKEN to your Vercel or local environment.";
    }

    return "I encountered an error. I can only answer using the dashboard's current ISS and news data.";
  }
};

/**
 * Clear chat history from localStorage
 */
export const clearChatHistory = () => {
  localStorage.removeItem("chat_history");
};

/**
 * Get chat history from localStorage
 */
export const getChatHistory = () => {
  const history = localStorage.getItem("chat_history");
  return history ? JSON.parse(history) : [];
};

/**
 * Save message to chat history
 */
export const saveChatMessage = (message, sender = "user") => {
  const history = getChatHistory();
  const newMessage = {
    id: Date.now(),
    text: message,
    sender,
    timestamp: new Date().toISOString(),
  };

  history.push(newMessage);

  // Keep only last 30 messages
  if (history.length > 30) {
    history.shift();
  }

  localStorage.setItem("chat_history", JSON.stringify(history));
  return newMessage;
};
