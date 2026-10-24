import express from 'express';
import { getConversationalResponse } from './getConversationalResponse.js';
import query from './queryMovieEmbeddings.js'
import { marked } from "marked";
import DOMPurify from "dompurify";
import { JSDOM } from 'jsdom';

const chooseConversational = false;
const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const apiRouter = express.Router();

apiRouter.post('/', async (req, res) => {
  try {
    const { userPrompt } = req.body;

    if (!userPrompt) {
      return res.status(400).json({ message: "userPrompt is required" });
    }

    const data = chooseConversational ? 
        await getConversationalResponse(userPrompt) : 
        await query(userPrompt);

    res.json({ content: purify.sanitize(marked.parse(data)) });
  } catch (error) {
    console.error("OpenAI API Error:", error.message || error);
    res.status(500).json({ message: "Failed to generate movie recommendations." });
  }
});
