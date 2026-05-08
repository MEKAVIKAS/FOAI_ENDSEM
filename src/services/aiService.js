import axios from "axios";
import { SYSTEM_PROMPT, AI_MODEL } from "../constants";

/**
 * Send message to AI chatbot with context
 */
export const sendChatMessage = async (message, context) => {
  try {
    const huggingFaceToken = import.meta.env.VITE_AI_TOKEN;

    if (!huggingFaceToken) {
      throw new Error("AI Token not configured. Please add VITE_AI_TOKEN to .env");
    }

    // Build context string from dashboard data
    const contextString = buildContextString(context);

    // Build the prompt with system instruction and context
    const prompt = `${SYSTEM_PROMPT}

Dashboard Context:
${contextString}

User Question: ${message}

Answer (only using the provided data above):`;

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${AI_MODEL}`,
      {
        inputs: prompt,
        parameters: {
          max_length: 500,
          temperature: 0.7,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${huggingFaceToken}`,
        },
      }
    );

    if (response.data && response.data[0]) {
      const text = response.data[0].generated_text;
      // Extract only the answer part (after "Answer:")
      const answerPart = text.split("Answer:")[1]?.trim() || text;
      return answerPart;
    }

    return "Unable to generate response. Please try again.";
  } catch (error) {
    console.error("Error sending chat message:", error);

    if (error.response?.status === 503) {
      return "The AI service is currently loading. Please try again in a moment.";
    }

    if (
      error.message.includes("AI Token not configured") ||
      error.message.includes("401")
    ) {
      return "AI service not configured. Please add VITE_AI_TOKEN to .env";
    }

    return "I encountered an error. I can only answer using the dashboard's current ISS and news data.";
  }
};

/**
 * Build context string from dashboard data
 */
const buildContextString = (context) => {
  let contextStr = "";

  // Add ISS Data
  if (context?.iss) {
    contextStr += `ISS Current Location:
- Latitude: ${context.iss.latitude}
- Longitude: ${context.iss.longitude}
- Speed: ${context.iss.speed} km/h
- Last Updated: ${context.iss.lastUpdate}
- Nearest Location: ${context.iss.location?.city}, ${context.iss.location?.country}

`;
  }

  // Add Speed History (last few entries)
  if (context?.speedHistory && context.speedHistory.length > 0) {
    contextStr += `ISS Speed History (Last 5):
${context.speedHistory
  .slice(-5)
  .map((entry) => `- ${entry.time}: ${entry.speed} km/h`)
  .join("\n")}

`;
  }

  // Add Astronaut Data
  if (context?.astronauts) {
    contextStr += `Astronauts in Space (${context.astronauts.total}):
${context.astronauts.list
  .slice(0, 10)
  .map((astro) => `- ${astro.name} (${astro.craft})`)
  .join("\n")}

`;
  }

  // Add Latest News Articles
  if (context?.news && context.news.length > 0) {
    contextStr += `Latest News Articles (${context.news.length} available):
${context.news
  .slice(0, 5)
  .map(
    (article) =>
      `- "${article.title}" (${article.source}) - ${new Date(
        article.publishedAt
      ).toLocaleDateString()}`
  )
  .join("\n")}

`;
  }

  return contextStr || "No data available";
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
