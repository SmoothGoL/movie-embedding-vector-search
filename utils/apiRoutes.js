import express from 'express';
import { getConversationalResponse } from './getConversationalResponse';

export const apiRouter = express.Router();

apiRouter.post('/', async (req, res) => {
  try {
    const { userPrompt } = req.body;

    if (!userPrompt) {
      return res.status(400).json({ message: "userPrompt is required" });
    }

    const data = await getConversationalResponse(userPrompt);

    res.json({ content: purify.sanitize(marked.parse(data)) });
  } catch (error) {
    console.error("OpenAI API Error:", error.message || error);
    res.status(500).json({ message: "Failed to generate gift ideas. Check server logs." });
  }
});
