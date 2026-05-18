// api/recommend.js — Vercel serverless function
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  const ANTHROPIC_KEY = process.env.ANTHROPIC_KEY;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    if (data?.content?.[0]?.text) {
      res.status(200).json({ text: data.content[0].text });
    } else {
      res.status(500).json({ error: "No response from AI." });
    }
  } catch (e) {
    res.status(500).json({ error: "Failed to get AI recommendations." });
  }
}
