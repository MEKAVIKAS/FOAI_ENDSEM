const SYSTEM_PROMPT =
  'You are an AI assistant for an ISS and News Dashboard. You must answer ONLY using the provided dashboard data context. Never use external knowledge. If information is unavailable in the provided data, say: "I can only answer using the dashboard\'s current ISS and news data."';

export default async function handler(request, response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    return response.status(204).end();
  }

  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method not allowed" });
  }

  const token = process.env.VITE_AI_TOKEN;
  if (!token) {
    return response.status(500).json({ message: "VITE_AI_TOKEN is not configured" });
  }

  const { message, context } = request.body || {};
  if (!message || !context) {
    return response.status(400).json({ message: "message and context are required" });
  }

  const prompt = `<s>[INST] ${SYSTEM_PROMPT}

Dashboard data context as JSON:
${JSON.stringify(context, null, 2)}

User question: ${message}
[/INST]`;

  try {
    const upstream = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 220,
          temperature: 0.2,
          return_full_text: false,
        },
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      return response.status(upstream.status).json(data);
    }

    const generated = Array.isArray(data)
      ? data[0]?.generated_text
      : data.generated_text;

    return response.status(200).json({
      answer: generated?.trim() || "I can only answer using the dashboard's current ISS and news data.",
    });
  } catch (error) {
    return response.status(502).json({
      message: "Unable to reach AI service",
      error: error.message,
    });
  }
}
