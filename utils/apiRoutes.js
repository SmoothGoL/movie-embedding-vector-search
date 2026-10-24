import express from 'express';
import { messages } from './getConversationalResponse';

export const apiRouter = express.Router();

apiRouter.post('/', async (req, res) => {
  try {
    const { userPrompt } = req.body;

    if (!userPrompt) {
      return res.status(400).json({ message: "userPrompt is required" });
    }

    messages.push({ role: "user", content: userPrompt });

    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || "placeholder",
      messages,
    });

    const data = response.choices[0].message.content;

    messages.push({ role: "assistant", content: data });
    res.json({ content: purify.sanitize(marked.parse(data)) });
  } catch (error) {
    console.error("OpenAI API Error:", error.message || error);
    res.status(500).json({ message: "Failed to generate gift ideas. Check server logs." });
  }
});
